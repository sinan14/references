const crypto = require("crypto");
const mongoose = require("mongoose");
const _ = require("lodash");
const moment = require("moment-timezone");
let API_KEY = process.env.OTPAPIKEY;
const TwoFactor = new (require("2factor"))(API_KEY);

const MasterPreference = require("../../models/mastersettings/masterPreference");
const Order = require("../../models/orders/order");
const Prescription = require("../../models/prescription");
const ReviewPending = require("../../models/orders/reviewPending");
const Payments = require("../../models/payments/payments");
const PrescriptionAwaited = require("../../models/orders/prescriptionAwaited");
const PackingPending = require("../../models/orders/packingPending");
const UserSubscription = require("../../models/orders/userSubscription");
const MostPurchasedProduct = require("../../models/most/mostPurchasedProducts");
const Cart = require("../../models/cart");
const UserAppliedCoupons = require("../../models/cart/userAppliedCoupons");
const UserAppliedMedCoins = require("../../models/cart/userAppliedMedCoin");
const UserAppliedDonation = require("../../models/cart/userAppliedDonation");
const UserMembershipBenefits = require("../../models/user/membershipBenefits");
const PremiumUser = require("../../models/user/premiumUser");
const referalPolicyStatement = require("../../models/coupon/referalPolicyStatment");
const Products = require("../../models/inventory");
const StoreProducts = require("../../models/store_products");
const MedCoin = require("../../models/medcoin/medCoin");
const User = require("../../models/user");
const { sendMail } = require("../../email/email");
const {
  generateOrderPlacedEmailTemplate,
} = require("../../email/templates/order");

const { razorpay } = require("../../constants/paymentGateways/paymentGateway");

const {
  validatePlaceOrder,
  validateVerifyVerifyRazorPayPayment,
} = require("../../validations/purchase/purchaseValidation");
const { doGetMedCartWeb } = require("../cart/cartController");
const { getOrderId } = require("../../helpers/helper");
const {
  doGetMedCoinDetails,
  incrementOrDecrementAdminMedCoinBalance,
} = require("../medcoin/medCoinController");

const doPlaceOrder = (
  cart,
  paymentType,
  userId,
  iDontHaveAPrescription,
  subscription,
  cartItems,
  paymentObjectId
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let prescription;
      let isPrescriptionRequired = false;

      if (
        cart[0].medCart.products.some(
          (product) => product.IsPrescriptionRequired
        )
      ) {
        isPrescriptionRequired = true;

        prescription = await Prescription.findOne({
          userId: userId,
          active: true,
        });

        if (prescription) {
          prescription = prescription.prescription;
        }
      }

      const address = cart[0].medCart.address;

      let cartDetails;
      if (subscription) {
        cartDetails = cart[1].subscriptionCart.cartDetails;
      } else {
        cartDetails = cart[0].medCart.cartDetails;
      }

      const deliveryDate = cart[0].medCart.cartDetails.deliveryDate;
      const storeDetails = cart[0].medCart.storeDetails;
      const storeLevel = cart[0].medCart.storeDetails.storeLevel;
      const medCoinUsed = cart[0].medCart.cartDetails.medCoinRedeemed;
      let products = cart[0].medCart.products;
      let freeDeliveryProvidedByPremiumBenefit =
        cartDetails.freeDeliveryProvidedByPremiumBenefit;
      let deliveryCharge = cartDetails.deliveryCharge;
      products = products.filter((product) => !product.outOfStock);

      products.forEach((product) => {
        product.returnStatus = "";
      });

      //create order

      //generate orderId

      const previousOrder = await Order.findOne().sort({ _id: -1 });

      const orderId = getOrderId(
        !previousOrder ? "" : previousOrder.orderId,
        !previousOrder ? new Date() : previousOrder.createdAt
      );

      if (!prescription) prescription = [];
      if (iDontHaveAPrescription) prescription = [];

      const order = await new Order({
        userId,
        orderId,
        paymentType,
        deliveryDate: moment(
          cartDetails.deliveryDate,
          "MMM DD, YYYY hh:mm:a"
        ).tz(process.env.TIME_ZONE),
        expectedDeliveryDate: moment(
          cartDetails.deliveryDate,
          "MMM DD, YYYY hh:mm:a"
        ).tz(process.env.TIME_ZONE),
        noOfItems: products.length,
        address,
        orderStatus: "order placed",
        products,
        cartDetails,
        storeDetails,
        prescription,
      }).save();

      //if med coin redeemed by user create statement

      if (medCoinUsed) {
        //admin balance does not need to be changed

        //get admin balance

        const { availableBalance } = (await doGetMedCoinDetails()) || {};

        //get user balance

        let { medCoin } =
          (await User.findOne({ _id: userId }, { medCoin: 1 })) || {};

        await MedCoin({
          medCoinCount: medCoinUsed,
          customerId: userId,
          type: "order",
          balance: availableBalance,
          customerBalance: medCoin - medCoinUsed,
        }).save();

        //decrement user med coin count

        await User.updateOne(
          { _id: userId },
          {
            $inc: {
              medCoin: -medCoinUsed,
            },
          }
        );
      }

      //update order object id to payment if payment type is razor pay

      if (paymentType === "razorpay" && paymentObjectId) {
        await Payments.updateOne(
          {
            _id: paymentObjectId,
          },
          {
            orderObjectId: order._id,
          }
        );
      }

      //save subscribed products

      let subscriptionInterval;

      let userSubscribedProducts = cartItems.map((cartItem) => {
        if (cartItem.subscription) {
          const product = _.find(products, {
            cartId: mongoose.Types.ObjectId(cartItem.cartId),
          });

          subscriptionInterval = parseInt(cartItem.interval);

          if (product) {
            return product;
          }
        }
      });

      userSubscribedProducts = _.without(
        userSubscribedProducts,
        undefined,
        null
      );

      // if user subscribed to any of the product then add data to user subscription

      if (userSubscribedProducts.length) {
        let subscriptionId = "MDFL-SUB-1001";

        const subscriptionDocument = await UserSubscription.findOne().sort({
          _id: -1,
        });

        if (subscriptionDocument) {
          subscriptionId = `MDFL-SUB-${
            parseInt(subscriptionDocument.subscriptionId.split("-")[2]) + 1
          }`;
        }

        await UserSubscription({
          userId,
          products: userSubscribedProducts,
          firstDeliveryDate: moment(deliveryDate, "MMM DD, YYYY hh:mm:a"),
          nextDeliveryDate: moment(deliveryDate, "MMM DD, YYYY hh:mm:a").add(
            subscriptionInterval,
            "days"
          ),
          orderId: order._id,
          originalOrderId: order._id,
          orderIds: [
            {
              orderId: order._id,
              createdAt: new Date(),
            },
          ],
          subscriptionId,
          interval: subscriptionInterval,
          prescription,
        }).save();
      }

      let productsThatRequiresPrescription = products.filter(
        (product) => product.type === "medicine"
      );

      //check if user provided a prescription or chose i dont have a prescription

      if (isPrescriptionRequired && iDontHaveAPrescription) {
        //move order to prescription awaited section

        await new PrescriptionAwaited({
          orderId,
          orderObjectId: order._id,
          userId,
          noOfItems: productsThatRequiresPrescription.length,
          phoneNumber: address.mobile,
          medicineProducts: productsThatRequiresPrescription,
        }).save();
      } else if (isPrescriptionRequired && prescription?.length) {
        //if user  provided a prescription move this to review pending collection
        await new ReviewPending({
          orderId,
          orderObjectId: order._id,
          userId,
          noOfItems: productsThatRequiresPrescription.length,
          phoneNumber: address.mobile,
          prescription: prescription,
          medicineProducts: productsThatRequiresPrescription,
        }).save();
      }

      if (!isPrescriptionRequired) {
        await new PackingPending({
          orderId,
          orderObjectId: order._id,
          userId,
          noOfItems: products.length,
          storeLevel,
          storeId: storeDetails.storeId,
          products,
          approvalTime: new Date(),
          shippingZone: `${address.state} ${address.pincode}`,
        }).save();

        //update order status to order under review

        await Order.updateOne(
          {
            _id: order._id,
          },
          {
            orderStatus: "order under review",
          }
        );
      }

      //add data to most purchased products

      const productsThatPurchasedBefore = await MostPurchasedProduct.find({
        $or: products.map((product) => {
          return {
            $and: [
              { product_id: mongoose.Types.ObjectId(product.product_id) },
              { variantId: mongoose.Types.ObjectId(product.variantId) },
            ],
          };
        }),
      });

      //update count of products that purchased before

      const bulkWriteDocuments = [];

      products.forEach((product) => {
        //if this is a product that purchased before update

        if (
          _.find(productsThatPurchasedBefore, {
            product_id: product.product_id,
            variantId: product.variantId,
          })
        ) {
          bulkWriteDocuments.push({
            updateOne: {
              filter: {
                product_id: product.product_id,
                variantId: product.variantId,
              },
              update: {
                $inc: { count: product.quantity },
              },
            },
          });
        } else {
          bulkWriteDocuments.push({
            insertOne: {
              document: {
                product_id: product.product_id,
                variantId: product.variantId,
                count: product.quantity,
                productType: product.type,
              },
            },
          });
        }
      });

      //save most purchased updated and inserted document

      await MostPurchasedProduct.bulkWrite(bulkWriteDocuments);

      //set applied coupon, med coin, donation active status to false

      //coupon

      await UserAppliedCoupons.updateOne(
        { userId, isCouponApplied: true },
        {
          isCouponApplied: false,
          orderId: order._id,
        }
      );

      //med coin

      await UserAppliedMedCoins.updateOne(
        {
          userId,
          isMedCoinApplied: true,
        },
        {
          isMedCoinApplied: false,
          orderId: order._id,
        }
      );

      //donation

      await UserAppliedDonation.updateOne(
        {
          userId,
          isDonationApplied: true,
        },
        {
          isDonationApplied: false,
          orderId: order._id,
        }
      );

      //clear user all cart items

      await Cart.deleteMany({ userId });

      //save premium member benefits

      const premiumUser = await PremiumUser.findOne({ userId, expired: false });

      if (premiumUser) {
        //update user benefits

        await UserMembershipBenefits.updateOne(
          {
            premiumUserId: premiumUser._id,
          },
          {
            $inc: {
              cashBackAmount: cartDetails.memberDiscount,
              discount: cartDetails.memberDiscount,
            },
          }
        );

        //update delivery change and free delivery count

        if (freeDeliveryProvidedByPremiumBenefit) {
          await UserMembershipBenefits.updateOne(
            {
              premiumUserId: premiumUser._id,
            },
            {
              $inc: {
                freeDelivery: -1,
                deliveryCharges: deliveryCharge,
              },
            }
          );
        }
      }

      //decrement stock from store

      //check if store is master or not

      if (storeDetails.isThisStoreMaster) {
        //update master stock

        Products.bulkWrite(
          products.map((product) => ({
            updateOne: {
              filter: {
                product_id: mongoose.Types.ObjectId(product.product_id),
                "pricing._id": mongoose.Types.ObjectId(product.variantId),
              },
              update: { $inc: { "pricing.$.stock": -product.quantity } },
            },
          }))
        );
      } else {
        //update store stock

        StoreProducts.bulkWrite(
          products.map((product) => ({
            updateOne: {
              filter: {
                storeId: mongoose.Types.ObjectId(storeDetails.storeId),
                productId: mongoose.Types.ObjectId(product.product_id),
                varientId: mongoose.Types.ObjectId(product.variantId),
              },
              update: { $inc: { "pricing.$.stock": -product.quantity } },
            },
          }))
        );
      }

      const user = await User.findOne({
        _id: userId,
      });

      //sent sms

      await TwoFactor.sendTemplate(
        user.phone,
        "order confirmed",
        [
          orderId,
          moment(cartDetails.deliveryDate, "MMM DD, YYYY hh:mm:a")
            .tz(process.env.TIME_ZONE)
            .diff(moment(), "days"),
          process.env.CLIENT_URL,
        ],
        "MEDMAL"
      ).catch((error) => console.log(error));

      //sent mail

      await sendMail(
        process.env.EMAIL_ID,
        user.email,
        "Order Placed",
        generateOrderPlacedEmailTemplate({
          username: user.name,
          deliveryDate: moment(cartDetails.deliveryDate, "MMM DD, YYYY hh:mm:a")
            .tz(process.env.TIME_ZONE)
            .format("ddd Do MMMM"),
          paidAmount: cartDetails.totalAmountToBePaid,
          savedAmount: cartDetails.totalDiscountAmount,
          paymentType,
          deliveryAddress: `${address.name}, ${address.wholeAddress}`,
          orderId,
          products: products.map((product) => ({
            name: product.productName,
            image: product.image,
            description: product.description,
            quantity: product.quantity,
            amount: product.specialPrice,
            realPrice: product.price,
          })),
          total: cartDetails.totalAmountToBePaid,
          freeDelivery: cartDetails.isThisCartEligibleForFreeDelivery,
          couponDiscount: cartDetails.couponAppliedDiscount,
          deliveryCharge: cartDetails.deliveryCharge,
          medCoin: cartDetails.medCoinRedeemed,
          memberDiscount: cartDetails.memberDiscount,
          paidOnline:
            paymentType === "cod" ? 0 : cartDetails.totalAmountToBePaid,
          totalPayable: cartDetails.totalAmountToBePaid,
          orderObjectId: order._id,
        })
      ).catch((error) => console.log(error));

      //check if user is eligible for first order med coin earning

      if (user.isUserEligibleForReferralFirstOrderCoin) {
        //check if this is user first order or not

        const orderCount = await Order.countDocuments({ userId });

        if (orderCount === 1) {
          let medCoinCount = parseInt(user.firstOrderMedcoin);
          let referredUserMedCoinCount = user.referredUserMedCoinCount;

          //decrement admin balance

          await incrementOrDecrementAdminMedCoinBalance(
            "dec",
            referredUserMedCoinCount
          );

          //get admin balance

          const { availableBalance } = (await doGetMedCoinDetails()) || {};

          //get med coin balance 0f referred user

          const referredUser = User.findOne({ _id: user.referredUserId });

          if (!referredUser.medCoin) {
            referredUser.medCoin = 0;
          }

          // add med coin to referred user

          await User.updateOne(
            {
              _id: mongoose.Types.ObjectId(user.referredUserId),
            },
            {
              $inc: {
                medCoin: referredUserMedCoinCount,
              },
            }
          );

          // create referred user med coin statement

          await MedCoin({
            medCoinCount: referredUserMedCoinCount,
            customerId: user.referredUserId,
            type: "refer and earn",
            balance: availableBalance,
            customerBalance: referredUser.medCoin + referredUserMedCoinCount,
          }).save();

          //update user med coin count

          await User.updateOne(
            {
              _id: userId,
            },
            {
              $inc: {
                medCoin: medCoinCount,
              },
            }
          );

          //create user med coin statements

          await MedCoin({
            medCoinCount,
            customerId: userId,
            type: "refer and earn",
            balance: availableBalance - medCoinCount,
            customerBalance: user.medCoin + medCoinCount,
          }).save();

          //create referral policy
          await new referalPolicyStatement({
            policyId: user.referralPolicyId,
            newUser: userId,
            referredId: user.referredUserId,
          }).save();
        }
      }

      return resolve({ status: true, message: "Order placed." });
    } catch (error) {
      reject(error);
    }
  });
};

const placeOrder = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    //validate incoming data
    const dataValidation = await validatePlaceOrder(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    const { paymentType, iDontHaveAPrescription, subscription, cartItems } =
      req.body;

    //get user cart details
    const { data: cart } = await doGetMedCartWeb(userId);

    let products = cart[0].medCart.products;
    products = products.filter((product) => !product.outOfStock);

    //check if products in the cart and incoming products are same

    for (const item of cartItems) {
      if (
        !_.find(products, {
          cartId: mongoose.Types.ObjectId(item.cartId),
        }) ||
        products.length !== cartItems.length
      ) {
        return res.json({ error: true, message: "Invalid cart item." });
      }
    }

    //check if user payment method is cod if it is check it is valid
    if (
      paymentType === "cod" &&
      !cart[0]?.medCart?.cartDetails?.cashOnDelivery
    ) {
      return res.status(200).json({
        error: true,
        message:
          "Cash on delivery is not available please select another payment method.",
      });
    }

    //check if this cart is deliverable
    if (!cart[0]?.medCart?.deliveryDetails?.isThisProductDeliverable) {
      return res.status(200).json({
        error: true,
        message: `${cart[0]?.medCart?.deliveryDetails?.message}`,
      });
    }

    //check if the products are eligible for purchase
    if (!cart[0]?.medCart?.cartDetails?.isThisCartIsEligibleForPurchase) {
      return res.status(200).json({
        error: true,
        message:
          "Your purchase amount is less than minimum purchase amount to place an order.",
      });
    }

    //check if user chose i dont have prescription when it is disabled

    const { prescription: prescriptionEnabled } =
      await MasterPreference.findOne(
        { isDisabled: false },
        { prescription: 1 }
      );

    if (!prescriptionEnabled && iDontHaveAPrescription) {
      return res.status(200).json({
        error: true,
        message: "You cannot choose i don't have a prescription.",
      });
    }

    //check if the cart need a prescription and if it is prescription provided or not

    let prescription;
    let isPrescriptionRequired = false;

    if (
      cart[0].medCart.products.some((product) => product.IsPrescriptionRequired)
    ) {
      isPrescriptionRequired = true;

      prescription = await Prescription.findOne({
        userId: userId,
        active: true,
      });

      if (prescription) {
        prescription = prescription.prescription;
      }

      if (!prescription?.length) prescription = null;

      //if i dont have a prescription is enabled and user does not choose it and also dont provide a prescription
      if (!iDontHaveAPrescription && !prescription) {
        return res.status(200).json({
          error: true,
          message: prescriptionEnabled
            ? "Please provide a prescription or choose i don't have a prescription."
            : "Please provide a prescription.",
        });
      }
    }

    if (paymentType === "cod") {
      await doPlaceOrder(
        cart,
        paymentType,
        userId,
        iDontHaveAPrescription,
        subscription,
        cartItems
      );

      return res.json({
        error: false,
        message: "Order placed successfully.",
        data: {},
      });
    } else if (paymentType === "razorpay") {
      //if not subscription which means user is trying to purchase from med cart

      let amount;

      if (!subscription) {
        amount = cart[0].medCart.cartDetails.totalAmountToBePaid * 100;
      } else {
        amount = cart[1].subscriptionCart.cartDetails.totalAmountToBePaid * 100;
      }

      const options = {
        amount,
        currency: "INR",
        notes: {
          iDontHaveAPrescription,
          subscription,
          cartItems: JSON.stringify(cartItems),
        },
      };

      const order = await razorpay.orders.create(options);

      return res.json({
        error: false,
        message: "Order placed successfully.",
        data: {
          order_id: order.id,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const verifyRazorPayPayment = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    //validate incoming data
    const dataValidation = await validateVerifyVerifyRazorPayPayment(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.json({
        error: true,
        message: message,
      });
    }

    const { paymentId, orderId, razorPaySignature } = req.body;

    const crypt = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    crypt.update(`${orderId}|${paymentId}`);
    const digest = crypt.digest("hex");

    //payment failed
    if (digest !== razorPaySignature) {
      return res.json({
        error: true,
        message: "Payment verification failed.",
      });
    }

    //check if this user payment already verified.

    const payment = await Payments.findOne({
      paymentId,
    });

    if (payment) {
      return res.json({
        error: false,
        message: "Payment already verified, order placed.",
      });
    }

    const newPayment = await new Payments({
      userId,
      paymentId,
      orderId,
      type: "order purchase",
    }).save();

    //get user cart details
    const { data: cart } = await doGetMedCartWeb(userId);

    const razorPayOrderDetails = await razorpay.orders.fetch(orderId);

    razorPayOrderDetails.notes.iDontHaveAPrescription =
      razorPayOrderDetails.notes.iDontHaveAPrescription === "true"
        ? true
        : false;
    razorPayOrderDetails.notes.subscription =
      razorPayOrderDetails.notes.subscription === "true" ? true : false;

    await doPlaceOrder(
      cart,
      "razorpay",
      userId,
      razorPayOrderDetails.notes.iDontHaveAPrescription,
      razorPayOrderDetails.notes.subscription,
      JSON.parse(razorPayOrderDetails.notes.cartItems),
      newPayment._id
    );

    return res.json({
      error: false,
      message: "Order placed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { placeOrder, verifyRazorPayPayment, doPlaceOrder };
