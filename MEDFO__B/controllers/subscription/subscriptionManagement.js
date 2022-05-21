const mongoose = require("mongoose");
const moment = require("moment");
const _ = require("lodash");

const User = require("../../models/user");
const UserSubscription = require("../../models/orders/userSubscription");
const UserAppliedDonation = require("../../models/cart/userAppliedDonation");
const Order = require("../../models/orders/order");
const Products = require("../../models/inventory");
const MasterPreference = require("../../models/mastersettings/masterPreference");
const Coupons = require("../../models/coupon/coupon");
const UserAppliedCoupons = require("../../models/cart/userAppliedCoupons");
const PaymentLink = require("../../models/orders/paymentLink");
const ReviewPending = require("../../models/orders/reviewPending");
const Cart = require("../../models/cart");

const { razorpay } = require("../../constants/paymentGateways/paymentGateway");

const {
  validateGetSubscriptions,
  validateUpdateUserSubscription,
  validateSentUserSubscriptionPaymentLink,
  validateMoveUserSubscriptionToPrescriptionAwaited,
  validateActivateAndDeactivateSubscription,
  validateUpdateSubscriptionRemarks,
  validateGetPaymentAwaitedSubscriptions,
  validateGetInactiveSubscriptions,
  validateGetConvertedSubscriptionOrders,
  validateMoveUserSubscriptionToReviewPending,
  validateMoveSubscriptionToPackingPending,
  validateGetCouponDiscountAmount,
} = require("../../validations/subscription/subscriptionValidation");

const {
  checkIfStockAvailable,
  doAddMultipleProductsToCart,
  doApplyACouponToTheCart,
  doApplyMedCoinToTheCart,
  doGetMedCartWeb,
} = require("../cart/cartController");
const {
  doGetProductDetailsByProductAndVariantId,
  doAcceptOrRejectReviewPendingOrder,
} = require("../orders/orderManagaementController");

const { doPlaceOrder } = require("../purchase/purchaseController");

const getSubscriptions = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateGetSubscriptions(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    let { page, searchBy } = req.body;
    let limit = 10;
    let skip = (page - 1) * limit;

    let searchQuery;

    if (searchBy) {
      const users = await User.find({
        name: { $regex: `${searchBy}`, $options: "i" },
      });

      const userIds = users.map((user) => ({
        userId: { $eq: mongoose.Types.ObjectId(user._id) },
      }));

      searchQuery = [
        { subscriptionId: { $regex: `${searchBy}`, $options: "i" } },
      ];

      if (userIds.length) {
        searchQuery = searchQuery.concat(userIds);
      }
    }

    let totalDocuments = await UserSubscription.countDocuments({
      active: true,
      tab: "subscription",
    });

    let totalPages = Math.ceil(totalDocuments / limit);

    const userSubscriptions = await UserSubscription.aggregate([
      {
        $match: {
          active: true,
          tab: "subscription",
          ...(searchBy && {
            $or: searchQuery,
          }),
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "order",
        },
      },
      {
        $unwind: {
          path: "$order",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          subscriptionId: "$_id",
          userId: 1,
          userName: "$user.name",
          createdAt: 1,
          products: 1,
          remarks: 1,
          medCoinCount: 1,
          couponCode: 1,
          phoneNumber: "$order.address.mobile",
          firstDeliveryDate: "$order.deliveredDate",
          interval: 1,
          nextDeliveryDate: 1,
          subscriptionIdString: "$subscriptionId",
          address: "$order.address",
          paymentType: "$order.paymentType",
          originalOrderId: "$order.orderId",
          orderIds: 1,
          prescription: 1,
          customerId: "$user.customerId",
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    let serialNoStarting = (parseInt(page) - 1) * 10 + 1;

    userSubscriptions.forEach((userSubscription) => {
      userSubscription.createdAt = moment(userSubscription.createdAt)
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY ");
      userSubscription.nextDeliveryDate = moment(
        userSubscription.nextDeliveryDate
      )
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY ");

      userSubscription.firstDeliveryDate = moment(
        userSubscription.firstDeliveryDate
      )
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY ");

      userSubscription.amount = 0;

      userSubscription.products.forEach((product) => {
        userSubscription.amount += product.specialPrice * product.quantity;
      });

      userSubscription.noOfItems = userSubscription.products.length;

      //add s:no
      userSubscription.siNo = serialNoStarting;
      serialNoStarting++;

      //previous order date

      let previousDate = moment()
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY ");

      if (userSubscription.orderIds.length) {
        previousDate = moment(
          userSubscription.orderIds[userSubscription.orderIds.length - 1]
            .createdAt
        )
          .tz(process.env.TIME_ZONE)
          .format("MMM DD YYYY ");
      }

      userSubscription.previousDate = previousDate;
    });

    //get hsn/sku code

    for (const subscription of userSubscriptions) {
      let query = subscription.products.map((product) => {
        return {
          _id: product.product_id,
        };
      });

      if (query.length) {
        const variants = await Products.find({ $or: query });

        subscription.products.forEach((product) => {
          let prod = _.find(variants, {
            _id: product.product_id,
          });

          let variant = _.find(prod.pricing, {
            _id: product.variantId,
          });

          product.skuOrHsnNo = variant.skuOrHsnNo;
        });
      }
    }

    let hasPrevPage = false;
    let hasNextPage = false;

    if (page < totalPages) hasNextPage = true;
    if (page != 1) hasPrevPage = true;

    const pageDetails = {
      currentPage: parseInt(page),
      totalPages: totalPages,
      hasPrevPage,
      hasNextPage,
      totalDocuments,
    };

    const {
      minPurchaseAmount = 0,
      minFreeDeliveryAmount = 0,
      maxMedcoinUse = 0,
    } = (await MasterPreference.findOne(
      { isDisabled: false },
      { minPurchaseAmount: 1, minFreeDeliveryAmount: 1, maxMedcoinUse: 1 }
    )) || {};

    //add flag value if any of the subscription product require prescription

    userSubscriptions.forEach((userSubscription) => {
      if (
        userSubscription.products.some(
          (product) => product.IsPrescriptionRequired
        )
      ) {
        userSubscription.prescriptionRequired = true;
      } else {
        userSubscription.prescriptionRequired = false;
      }
    });

    return res.json({
      error: false,
      message: userSubscriptions.length
        ? "Subscriptions found."
        : "Empty subscription.",
      data: {
        subscriptions: userSubscriptions,
        pageDetails,
        masterPreference: {
          minPurchaseAmount,
          minFreeDeliveryAmount,
          maxMedcoinUse,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateUserSubscription = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateUpdateUserSubscription(req.body);

    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    let { userId, subscriptionId, products, couponCode, medCoinCount } =
      req.body;

    //check if user is valid

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.json({
        error: true,
        message: "Invalid user or user no longer exist.",
      });
    }

    //check if subscription is valid

    const subscription = await UserSubscription.findOne({
      _id: subscriptionId,
    });

    if (!subscription) {
      return res.json({
        error: true,
        message: "Invalid subscription.",
      });
    }

    if (!subscription.active) {
      return res.json({
        error: true,
        message: "This subscription is inactive.",
      });
    }

    if (subscription.tab === "paymentAwaited") {
      return res.json({
        error: true,
        message:
          "This subscription is in payment awaited you can't update or change products now.",
      });
    }

    if (user._id.toString() !== subscription.userId.toString()) {
      return res.json({
        error: true,
        message: `This subscription is not belong to ${user.name}.`,
      });
    }

    //check if product is valid and stock available or not

    for (const { product_id, variantId, quantity } of products) {
      //check if stock is available

      const { stockAvailable } =
        (await checkIfStockAvailable({
          variantId: variantId,
          productId: product_id,
          quantity: quantity,
          userId,
        })) || {};

      if (!stockAvailable) {
        //check if product is valid

        const product = await Products.findOne({
          _id: product_id,

          pricing: {
            $elemMatch: {
              _id: variantId,
            },
          },
        });

        if (!product) {
          return res.json({
            error: true,
            message: `Invalid product or variant.`,
          });
        }

        if (product) {
          return res.json({
            error: true,
            message: `${quantity} ${product.name} is now out of stock.`,
          });
        }
      }
    }

    //check if user is using both med coin and coupon at the same time
    if (medCoinCount && couponCode) {
      return res.json({
        error: true,
        message: "User can't use med coin and coupon at the same time.",
      });
    }

    //check how much med coin a user can apply if it is applied

    if (medCoinCount) {
      let { medCoin } =
        (await User.findOne({ _id: userId }, { medCoin: 1 })) || {};

      if (!medCoin) medCoin = 0;

      if (medCoinCount > medCoin) {
        if (!medCoin) {
          return res.json({
            error: true,
            message: `User don't have any med coin to apply.`,
          });
        } else {
          return res.status(200).json({
            error: true,
            message: `User can only apply ${medCoin} med coin.`,
          });
        }
      }

      const { maxMedcoinUse = 0 } =
        (await MasterPreference.findOne(
          { isDisabled: false },
          { maxMedcoinUse: 1 }
        )) || {};

      if (medCoinCount > maxMedcoinUse) {
        return res.status(200).json({
          error: true,
          message: `User can only apply ${maxMedcoinUse} med coins.`,
        });
      }
    }

    //if coupon is applied

    let couponPurchaseAmount = 0;
    let totalCartValue = 0;

    const productsData = await Products.find({
      $or: products.map((product) => {
        return {
          _id: product.product_id,
        };
      }),
    });

    products.forEach((product) => {
      const productData = _.find(productsData, {
        _id: mongoose.Types.ObjectId(product.product_id),
      });

      const variant = _.find(productData.pricing, {
        _id: mongoose.Types.ObjectId(product.variantId),
      });

      totalCartValue += variant.specialPrice * product.quantity;
    });

    if (couponCode) {
      const coupon = await Coupons.findOne(
        {
          code: couponCode,
          isDisabled: false,
          from: { $lte: new Date() },
          to: { $gte: new Date() },
        },
        {
          type: 1,
          maximumUser: 1,
          numberPerUser: 1,
          promotionType: 1,
          totalTimesUsed: 1,
          category: 1,
          purchaseAmount: 1,
        }
      );

      if (!coupon) {
        return res.json({
          error: true,
          message: "Invalid Coupon Code.",
        });
      }

      //check if this coupon can be applied to any of the products

      if (!productsData.some((product) => product.type === coupon.category)) {
        return res.json({
          error: true,
          message: `User can only apply this coupon to ${coupon.category} products. Please add some ${coupon.category} products to your cart to use this coupon.`,
        });
      }

      //check coupon total used count and maximum allowed per a user and maximum count for all user

      const numberOfTimesUserAppliedThisCoupon = await UserAppliedCoupons.find({
        userId,
        couponId: coupon._id,
      }).countDocuments();

      if (
        coupon.totalTimesUsed >= coupon.maximumUser ||
        numberOfTimesUserAppliedThisCoupon >= coupon.numberPerUser
      ) {
        return res.json({
          error: true,
          message: "Coupon usage limit has been reached.",
        });
      }

      if (totalCartValue < coupon.purchaseAmount) {
        return res.json({
          error: true,
          message: `Minimum purchase amount to apply this coupon is ${coupon.purchaseAmount} rs.`,
        });
      }
    }

    //minimum purchase amount

    const {
      minPurchaseAmount = 0,
      minFreeDeliveryAmount = 0,
      maxMedcoinUse = 0,
    } = (await MasterPreference.findOne(
      { isDisabled: false },
      { minPurchaseAmount: 1, minFreeDeliveryAmount: 1, maxMedcoinUse: 1 }
    )) || {};

    if (totalCartValue < minPurchaseAmount) {
      return res.json({
        error: true,
        message: `Your purchase amount is less than minimum purchase amount to place an order.`,
      });
    }

    const updateProducts = [];

    for (const { product_id, variantId, quantity } of products) {
      const product = await doGetProductDetailsByProductAndVariantId(
        product_id,
        variantId,
        quantity
      );

      updateProducts.push(product);
    }

    //remove applied coupon if purchase amount is less than to use this coupon

    let removeCoupon = false;

    if (totalCartValue < couponPurchaseAmount) {
      removeCoupon = true;
    }

    //update subscription
    await UserSubscription.updateOne(
      {
        _id: subscriptionId,
      },
      {
        ...(medCoinCount && { medCoinCount, couponCode: null }),
        ...(couponCode && { couponCode, medCoinCount: null }),
        ...(removeCoupon && { couponCode: null }),
        ...(!couponCode && { couponCode: null }),
        ...(!medCoinCount && { medCoinCount: null }),
        products: updateProducts,
      }
    );

    return res.json({
      error: false,
      message: "User subscription updated.",
    });
  } catch (error) {
    next(error);
  }
};

const sentUserSubscriptionPaymentLink = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateSentUserSubscriptionPaymentLink(
      req.body
    );
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    const { subscriptionId } = req.body;

    const subscription = await UserSubscription.findOne({
      _id: subscriptionId,
    });

    if (!subscription) {
      return res.json({
        error: true,
        message: "Invalid subscription.",
      });
    }

    if (!subscription.active) {
      return res.json({
        error: true,
        message: "This subscription is inactive.",
      });
    }

    //calculate amount to be paid

    const productsData = await Products.find({
      $or: subscription.products.map((product) => {
        return {
          _id: product.product_id,
        };
      }),
    });

    let totalCartValue = 0;
    let couponDiscount = 0;

    let coupon = await Coupons.findOne(
      {
        code: subscription.couponCode,
        isDisabled: false,
      },
      {
        type: 1,
        maximumUser: 1,
        numberPerUser: 1,
        promotionType: 1,
        totalTimesUsed: 1,
        category: 1,
        purchaseAmount: 1,
        from: 1,
        to: 1,
      }
    );

    //check if coupon still can be used or not

    if (coupon) {
      if (
        new Date(coupon.from).getTime() >= new Date().getTime() ||
        new Date(coupon.to).getTime() <= new Date()
      ) {
        return res.json({
          error: true,
          message: `${coupon.code} this coupon is expired. please remove it from the subscription to continue.`,
        });
      }
    }

    subscription.products.forEach((product) => {
      const productData = _.find(productsData, {
        _id: mongoose.Types.ObjectId(product.product_id),
      });

      const variant = _.find(productData.pricing, {
        _id: mongoose.Types.ObjectId(product.variantId),
      });

      totalCartValue += variant.specialPrice * product.quantity;

      if (coupon) {
        if (productData.type === coupon.category) {
          const discountAmount =
            (coupon.percentage / 100) *
            (productData.specialPrice * product.quantity);

          if (couponDiscount + discountAmount < coupon.maximumAmount) {
            couponDiscount += discountAmount;
          } else {
            couponDiscount = discountAmount;
          }
        }
      }
    });

    //deduct med coin

    if (subscription.medCoinCount) {
      totalCartValue -= subscription.medCoinCount;
    }

    if (subscription.couponCode) {
      totalCartValue -= subscription.couponDiscount;
    }

    //check if there is already a valid payment link if there is then send that link instead of creating new one

    const existingPaymentLink = await PaymentLink.findOne({
      status: { $ne: "payment failed" },
      subscriptionId,
      active: true,
    });

    //sent payment link
    if (existingPaymentLink) {
      return res.json({
        error: false,
        message: "Payment link was already created.",
        data: {
          paymentLink: existingPaymentLink.paymentLink,
        },
      });
    }

    const user = await User.findOne({ _id: subscription.userId });

    //create payment link

    const paymentLink = await razorpay.paymentLink.create({
      amount: totalCartValue * 100,
      currency: "INR",
      accept_partial: false,
      description:
        "Your subscription order is verified please pay this money to confirm your order",
      customer: {
        name: user.name,
        email: user.email,
        contact: user.phone,
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      callback_url: `${process.env.CLIENT_URL}/verify-payment`,
      callback_method: "get",
      notes: {
        type: "subscription",
      },
    });

    await new PaymentLink({
      userId: subscription.userId,
      subscriptionId,
      type: "subscription",
      paymentLink: paymentLink.short_url,
      paymentLinkRazorPayId: paymentLink.id,
      active: true,
    }).save();

    //update subscription tab to payment awaited

    await UserSubscription.updateOne(
      { _id: subscriptionId },
      {
        tab: "paymentAwaited",
      }
    );

    return res.json({
      error: false,
      message: "Payment link created successfully.",
      data: {
        paymentLink: paymentLink.short_url,
      },
    });
  } catch (error) {
    next(error);
  }
};

const moveUserSubscriptionToPrescriptionAwaited = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation =
      await validateMoveUserSubscriptionToPrescriptionAwaited(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    const { subscriptionId } = req.body;

    //check subscription is valid or not

    const subscription = await UserSubscription.findOne({
      _id: subscriptionId,
    });

    if (!subscription) {
      return res.json({
        error: true,
        message: "Invalid subscription.",
      });
    }

    if (!subscription.active) {
      return res.json({
        error: true,
        message: "This subscription is inactive.",
      });
    }

    //check order is cash on delivery or online payment

    let cod = false;

    if (subscription.tab === "subscription") {
      cod = true;
    }

    //if this order is payment awaited check if it is paid or not paid

    if (subscription.tab === "paymentAwaited" && !subscription.paid) {
      return res.json({
        error: true,
        message:
          "User payment is not yet captured, please verify payment again.",
      });
    }

    //check if any product require prescription

    let prescriptionRequired = false;

    const productsData = await Products.find({
      $or: subscription.products.map((product) => {
        return {
          _id: product.product_id,
        };
      }),
    });

    productsData.some((product) => {
      if (product.prescription) prescriptionRequired = true;
    });

    if (prescriptionRequired) {
      return res.json({
        error: true,
        message:
          "None of the subscribed products require prescription choose confirm order to move subscription to packing pending.",
      });
    }

    //get all cart items of user

    const cartItems = await Cart.find({ userId: subscription.userId });

    const putAllCartItemsBack = async (cartItems) => {
      await Cart.insertMany(cartItems);
    };

    //now delete all cart items

    await Cart.deleteMany({ userId: subscription.userId });

    //add products to cart to purchase

    const addProductsToCart = await doAddMultipleProductsToCart(
      subscription.userId,
      {
        products: subscription.products.map((product) => ({
          product_id: product.product_id,
          variantId: product.variantId,
          quantity: product.quantity,
        })),
      }
    );

    if (addProductsToCart.error) {
      await putAllCartItemsBack(cartItems);

      return res.json({
        error: true,
        message: addProductsToCart.message,
      });
    }

    //after products adding apply med coin and coupon code

    if (subscription.couponCode) {
      let coupon = await Coupons.findOne(
        {
          code: subscription.couponCode,
          isDisabled: false,
        },
        {
          type: 1,
          maximumUser: 1,
          numberPerUser: 1,
          promotionType: 1,
          totalTimesUsed: 1,
          category: 1,
          purchaseAmount: 1,
          from: 1,
          to: 1,
        }
      );

      //check if coupon still can be used or not

      if (coupon) {
        if (
          new Date(coupon.from).getTime() >= new Date().getTime() ||
          new Date(coupon.to).getTime() <= new Date()
        ) {
          return res.json({
            error: true,
            message: `${coupon.code} this coupon is expired. please remove it from the subscription to continue.`,
          });
        }
      }

      let applyCoupon = await doApplyACouponToTheCart(subscription.userId, {
        couponCode: subscription.couponCode,
        couponType: coupon.category,
      });

      if (applyCoupon.error) {
        await putAllCartItemsBack(cartItems);

        return res.json({
          error: true,
          message: applyCoupon.message,
        });
      }
    }

    //med coin
    if (subscription.medCoinCount) {
      const applyMedCoin = doApplyMedCoinToTheCart(subscription.userId, {
        medCoinCount: subscription.medCoinCount,
      });

      if (applyMedCoin.error) {
        await putAllCartItemsBack(cartItems);
        return res.json({
          error: true,
          message: applyMedCoin.message,
        });
      }
    }

    const { data: cart } = await doGetMedCartWeb(subscription.userId);

    //new cart items
    const newCartItems = await Cart.find({ userId: subscription.userId });
    //now place order

    // update donation
    await UserAppliedDonation.updateOne(
      { userId: subscription.userId, isDonationApplied: true },
      {
        donationAmount: 0,
      }
    );

    if (!cod) {
      await doPlaceOrder(
        cart,
        "razorpay",
        subscription.userId,
        true,
        false,
        newCartItems.map((cartItem) => ({
          cartId: cartItem._id,
          subscription: false,
          interval: "",
        })),
        ""
      ).catch(async (error) => {
        await putAllCartItemsBack(cartItems);
        return res.json(error);
      });
    } else {
      //check if cash on delivery is available

      if (!cart[0].medCart.cartDetails.cashOnDelivery) {
        await putAllCartItemsBack(cartItems);
        return res.json({
          error: true,
          message:
            "Cash on delivery is not available for this pin code right now.",
        });
      }

      await doPlaceOrder(
        cart,
        "cod",
        subscription.userId,
        true,
        false,
        newCartItems.map((cartItem) => ({
          cartId: cartItem._id,
          subscription: false,
          interval: "",
        }))
      ).catch(async (error) => {
        await putAllCartItemsBack(cartItems);
        return res.json(error);
      });
    }

    //order details

    const order = await Order.findOne({ userId: subscription.userId }).sort({
      _id: -1,
    });

    await putAllCartItemsBack(cartItems);

    //change subscription tab to converted orders

    await UserSubscription.updateOne(
      {
        _id: subscriptionId,
      },
      {
        nextDeliveryDate: moment(new Date(), "MMM DD, YYYY ").add(
          subscription.interval,
          "days"
        ),
        tab: "converted orders",
        couponCode: null,
        medCoinCount: null,
        paid: false,
        orderId: order._id,
        $push: {
          orderIds: {
            orderId: order._id,
            createdAt: new Date(),
          },
        },
      }
    );

    return res.json({
      error: false,
      message: "Subscription moved to converted orders.",
    });
  } catch (error) {
    next(error);
  }
};

const moveSubscriptionToReviewPending = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateMoveUserSubscriptionToReviewPending(
      req.body
    );
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    const { subscriptionId } = req.body;

    //check subscription is valid or not

    const subscription = await UserSubscription.findOne({
      _id: subscriptionId,
    });

    if (!subscription) {
      return res.json({
        error: true,
        message: "Invalid subscription.",
      });
    }

    if (!subscription.active) {
      return res.json({
        error: true,
        message: "This subscription is inactive.",
      });
    }

    //check order is cash on delivery or online payment

    let cod = false;

    if (subscription.tab === "subscription") {
      cod = true;
    }

    //if this order is payment awaited check if it is paid or not paid

    if (subscription.tab === "paymentAwaited" && !subscription.paid) {
      return res.json({
        error: true,
        message:
          "User payment is not yet captured, please verify payment again.",
      });
    }

    //check if any product require prescription

    let prescriptionRequired = false;

    const productsData = await Products.find({
      $or: subscription.products.map((product) => {
        return {
          _id: product.product_id,
        };
      }),
    });

    productsData.some((product) => {
      if (product.prescription) prescriptionRequired = true;
    });

    if (prescriptionRequired) {
      return res.json({
        error: true,
        message:
          "None of the subscribed products require prescription choose confirm order to move subscription to packing pending.",
      });
    }

    //get all cart items of user

    const cartItems = await Cart.find({ userId: subscription.userId });

    const putAllCartItemsBack = async (cartItems) => {
      await Cart.insertMany(cartItems);
    };

    //now delete all cart items

    await Cart.deleteMany({ userId: subscription.userId });

    //add products to cart to purchase

    const addProductsToCart = await doAddMultipleProductsToCart(
      subscription.userId,
      {
        products: subscription.products.map((product) => ({
          product_id: product.product_id,
          variantId: product.variantId,
          quantity: product.quantity,
        })),
      }
    );

    if (addProductsToCart.error) {
      await putAllCartItemsBack(cartItems);

      return res.json({
        error: true,
        message: addProductsToCart.message,
      });
    }

    //after products adding apply med coin and coupon code

    if (subscription.couponCode) {
      let coupon = await Coupons.findOne(
        {
          code: subscription.couponCode,
          isDisabled: false,
        },
        {
          type: 1,
          maximumUser: 1,
          numberPerUser: 1,
          promotionType: 1,
          totalTimesUsed: 1,
          category: 1,
          purchaseAmount: 1,
          from: 1,
          to: 1,
        }
      );

      //check if coupon still can be used or not

      if (coupon) {
        if (
          new Date(coupon.from).getTime() >= new Date().getTime() ||
          new Date(coupon.to).getTime() <= new Date()
        ) {
          return res.json({
            error: true,
            message: `${coupon.code} this coupon is expired. please remove it from the subscription to continue.`,
          });
        }
      }

      let applyCoupon = await doApplyACouponToTheCart(subscription.userId, {
        couponCode: subscription.couponCode,
        couponType: coupon.category,
      });

      if (applyCoupon.error) {
        await putAllCartItemsBack(cartItems);

        return res.json({
          error: true,
          message: applyCoupon.message,
        });
      }
    }

    //med coin
    if (subscription.medCoinCount) {
      const applyMedCoin = doApplyMedCoinToTheCart(subscription.userId, {
        medCoinCount: subscription.medCoinCount,
      });

      if (applyMedCoin.error) {
        await putAllCartItemsBack(cartItems);
        return res.json({
          error: true,
          message: applyMedCoin.message,
        });
      }
    }

    const { data: cart } = await doGetMedCartWeb(subscription.userId);

    //new cart items
    const newCartItems = await Cart.find({ userId: subscription.userId });

    // update donation
    await UserAppliedDonation.updateOne(
      { userId: subscription.userId, isDonationApplied: true },
      {
        donationAmount: 0,
      }
    );

    //now place order

    if (!cod) {
      await doPlaceOrder(
        cart,
        "razorpay",
        subscription.userId,
        false,
        false,
        newCartItems.map((cartItem) => ({
          cartId: cartItem._id,
          subscription: false,
          interval: "",
        })),
        ""
      ).catch(async (error) => {
        await putAllCartItemsBack(cartItems);
        return res.json(error);
      });
    } else {
      if (!cart[0].medCart.cartDetails.cashOnDelivery) {
        await putAllCartItemsBack(cartItems);
        return res.json({
          error: true,
          message:
            "Cash on delivery is not available for this pin code right now.",
        });
      }

      await doPlaceOrder(
        cart,
        "cod",
        subscription.userId,
        false,
        false,
        newCartItems.map((cartItem) => ({
          cartId: cartItem._id,
          subscription: false,
          interval: "",
        }))
      ).catch(async (error) => {
        await putAllCartItemsBack(cartItems);
        return res.json(error);
      });
    }

    //order details

    const order = await Order.findOne({ userId: subscription.userId }).sort({
      _id: -1,
    });

    await putAllCartItemsBack(cartItems);

    //change subscription tab to converted orders

    await UserSubscription.updateOne(
      {
        _id: subscriptionId,
      },
      {
        nextDeliveryDate: moment(new Date(), "MMM DD, YYYY ").add(
          subscription.interval,
          "days"
        ),
        tab: "converted orders",
        couponCode: null,
        medCoinCount: null,
        paid: false,
        orderId: order._id,
        $push: {
          orderIds: {
            orderId: order._id,
            createdAt: new Date(),
          },
        },
      }
    );

    return res.json({
      error: false,
      message: "Subscription moved to converted orders.",
    });
  } catch (error) {
    next(error);
  }
};

const moveSubscriptionToPackingPending = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateMoveSubscriptionToPackingPending(
      req.body
    );
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    const { subscriptionId } = req.body;

    //check subscription is valid or not

    const subscription = await UserSubscription.findOne({
      _id: subscriptionId,
    });

    if (!subscription) {
      return res.json({
        error: true,
        message: "Invalid subscription.",
      });
    }

    if (!subscription.active) {
      return res.json({
        error: true,
        message: "This subscription is inactive.",
      });
    }

    //check order is cash on delivery or online payment

    let cod = false;

    if (subscription.tab === "subscription") {
      cod = true;
    }

    //if this order is payment awaited check if it is paid or not paid

    if (subscription.tab === "paymentAwaited" && !subscription.paid) {
      return res.json({
        error: true,
        message:
          "User payment is not yet captured, please verify payment again.",
      });
    }

    //check if any product require prescription

    let prescriptionRequired = false;

    const productsData = await Products.find({
      $or: subscription.products.map((product) => {
        return {
          _id: product.product_id,
        };
      }),
    });

    productsData.some((product) => {
      if (product.prescription) prescriptionRequired = true;
    });

    //get all cart items of user

    const cartItems = await Cart.find({ userId: subscription.userId });

    const putAllCartItemsBack = async (cartItems) => {
      await Cart.insertMany(cartItems);
    };

    //now delete all cart items

    await Cart.deleteMany({ userId: subscription.userId });

    //add products to cart to purchase

    const addProductsToCart = await doAddMultipleProductsToCart(
      subscription.userId,
      {
        products: subscription.products.map((product) => ({
          product_id: product.product_id,
          variantId: product.variantId,
          quantity: product.quantity,
        })),
      }
    );

    if (addProductsToCart.error) {
      await putAllCartItemsBack(cartItems);

      return res.json({
        error: true,
        message: addProductsToCart.message,
      });
    }

    //after products adding apply med coin and coupon code

    if (subscription.couponCode) {
      let coupon = await Coupons.findOne(
        {
          code: subscription.couponCode,
          isDisabled: false,
        },
        {
          type: 1,
          maximumUser: 1,
          numberPerUser: 1,
          promotionType: 1,
          totalTimesUsed: 1,
          category: 1,
          purchaseAmount: 1,
          from: 1,
          to: 1,
        }
      );

      //check if coupon still can be used or not

      if (coupon) {
        if (
          new Date(coupon.from).getTime() >= new Date().getTime() ||
          new Date(coupon.to).getTime() <= new Date()
        ) {
          return res.json({
            error: true,
            message: `${coupon.code} this coupon is expired. please remove it from the subscription to continue.`,
          });
        }
      }

      let applyCoupon = await doApplyACouponToTheCart(subscription.userId, {
        couponCode: subscription.couponCode,
        couponType: coupon.category,
      });

      if (applyCoupon.error) {
        await putAllCartItemsBack(cartItems);

        return res.json({
          error: true,
          message: applyCoupon.message,
        });
      }
    }

    //med coin
    if (subscription.medCoinCount) {
      const applyMedCoin = doApplyMedCoinToTheCart(subscription.userId, {
        medCoinCount: subscription.medCoinCount,
      });

      if (applyMedCoin.error) {
        await putAllCartItemsBack(cartItems);
        return res.json({
          error: true,
          message: applyMedCoin.message,
        });
      }
    }

    const { data: cart } = await doGetMedCartWeb(subscription.userId);

    //new cart items
    const newCartItems = await Cart.find({ userId: subscription.userId });

    // update donation
    await UserAppliedDonation.updateOne(
      { userId: subscription.userId, isDonationApplied: true },
      {
        donationAmount: 0,
      }
    );

    //now place order

    if (!cod) {
      await doPlaceOrder(
        cart,
        "razorpay",
        subscription.userId,
        false,
        false,
        newCartItems.map((cartItem) => ({
          cartId: cartItem._id,
          subscription: false,
          interval: "",
        })),
        ""
      ).catch(async (error) => {
        await putAllCartItemsBack(cartItems);
        return res.json(error);
      });
    } else {
      if (!cart[0].medCart.cartDetails.cashOnDelivery) {
        await putAllCartItemsBack(cartItems);
        return res.json({
          error: true,
          message:
            "Cash on delivery is not available for this pin code right now.",
        });
      }

      await doPlaceOrder(
        cart,
        "cod",
        subscription.userId,
        false,
        false,
        newCartItems.map((cartItem) => ({
          cartId: cartItem._id,
          subscription: false,
          interval: "",
        }))
      ).catch(async (error) => {
        await putAllCartItemsBack(cartItems);
        return res.json(error);
      });
    }

    //order details

    const order = await Order.findOne({ userId: subscription.userId }).sort({
      _id: -1,
    });

    //if product require prescription required it will be in review pending then approve it to move to packing pending.

    if (prescriptionRequired) {
      const reviewPendingOrder = await ReviewPending.findOne({
        orderObjectId: order._id,
      });

      await doAcceptOrRejectReviewPendingOrder({
        type: "accept",
        reviewPendingOrderId: reviewPendingOrder._id,
      });
    }

    await putAllCartItemsBack(cartItems);

    //change subscription tab to converted orders

    await UserSubscription.updateOne(
      {
        _id: subscriptionId,
      },
      {
        nextDeliveryDate: moment(new Date(), "MMM DD, YYYY ").add(
          subscription.interval,
          "days"
        ),
        tab: "converted orders",
        couponCode: null,
        medCoinCount: null,
        paid: false,
        orderId: order._id,
        $push: {
          orderIds: {
            orderId: order._id,
            createdAt: new Date(),
          },
        },
      }
    );

    return res.json({
      error: false,
      message: "Subscription moved to converted orders.",
    });
  } catch (error) {
    next(error);
  }
};

const activateAndDeactivateSubscription = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateActivateAndDeactivateSubscription(
      req.body
    );
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    const { subscriptionId } = req.body;

    //check if subscription is valid.

    const subscription = await UserSubscription.findOne({
      _id: subscriptionId,
    });

    if (!subscription) {
      return res.json({
        error: true,
        message: "Invalid subscription.",
      });
    }

    //change subscription status

    await UserSubscription.updateOne(
      {
        _id: subscriptionId,
      },
      {
        active: subscription?.active ? false : true,
      }
    );

    res.json({
      error: false,
      message: subscription?.active
        ? "Subscription deactivated"
        : "Subscription activated",
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscriptionRemarks = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateUpdateSubscriptionRemarks(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    const { subscriptionId, remarks } = req.body;

    //check if subscription is valid.

    const subscription = await UserSubscription.findOne({
      _id: subscriptionId,
    });

    if (!subscription) {
      return res.json({
        error: true,
        message: "Invalid subscription.",
      });
    }

    //update subscription remarks

    await UserSubscription.updateOne(
      {
        _id: subscriptionId,
      },
      {
        remarks,
      }
    );

    res.json({ error: false, message: "Remarks updated." });
  } catch (error) {
    next(error);
  }
};

const getPaymentAwaitedSubscriptions = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateGetPaymentAwaitedSubscriptions(
      req.body
    );
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    let { page, searchBy } = req.body;
    let limit = 10;
    let skip = (page - 1) * limit;

    let searchQuery;

    if (searchBy) {
      const users = await User.find({
        name: { $regex: `${searchBy}`, $options: "i" },
      });

      const userIds = users.map((user) => ({
        userId: { $eq: mongoose.Types.ObjectId(user._id) },
      }));

      searchQuery = [
        { subscriptionId: { $regex: `${searchBy}`, $options: "i" } },
      ];

      if (userIds.length) {
        searchQuery = searchQuery.concat(userIds);
      }
    }

    let totalDocuments = await UserSubscription.countDocuments({
      active: true,
      tab: "paymentAwaited",
    });

    let totalPages = Math.ceil(totalDocuments / limit);

    //paymentAwaited

    const paymentAwaitedSubscriptions = await UserSubscription.aggregate([
      {
        $match: {
          active: true,
          tab: "paymentAwaited",
          ...(searchBy && {
            $or: searchQuery,
          }),
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "order",
        },
      },
      {
        $unwind: {
          path: "$order",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          subscriptionId: "$_id",
          userId: 1,
          userName: "$user.name",
          createdAt: 1,
          products: 1,
          remarks: 1,
          medCoinCount: 1,
          couponCode: 1,
          phoneNumber: "$order.address.mobile",
          firstDeliveryDate: "$order.deliveredDate",
          interval: 1,
          nextDeliveryDate: 1,
          paymentType: "$order.paymentType",
          subscriptionIdString: "$subscriptionId",
          address: "$order.address",
          originalOrderId: "$order.orderId",
          orderIds: 1,
          prescription: 1,
          customerId: "$user.customerId",
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    let serialNoStarting = (parseInt(page) - 1) * 10 + 1;

    paymentAwaitedSubscriptions.forEach((userSubscription) => {
      userSubscription.createdAt = moment(userSubscription.updatedAt)
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY ");
      userSubscription.nextDeliveryDate = moment(
        userSubscription.nextDeliveryDate
      )
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY ");

      userSubscription.firstDeliveryDate = moment(
        userSubscription.firstDeliveryDate
      )
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY ");

      userSubscription.amount = 0;

      userSubscription.products.forEach((product) => {
        userSubscription.amount += product.specialPrice * product.quantity;
      });

      userSubscription.noOfItems = userSubscription.products.length;

      //add s:no
      userSubscription.siNo = serialNoStarting;
      serialNoStarting++;

      //previous order date

      let previousDate = moment()
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY ");

      if (userSubscription.orderIds.length) {
        previousDate = moment(
          userSubscription.orderIds[userSubscription.orderIds.length - 1]
            .createdAt
        )
          .tz(process.env.TIME_ZONE)
          .format("MMM DD YYYY ");
      }

      userSubscription.previousDate = previousDate;
    });

    //get hsn/sku code

    for (const subscription of paymentAwaitedSubscriptions) {
      let query = subscription.products.map((product) => {
        return {
          _id: product.product_id,
        };
      });

      if (query.length) {
        const variants = await Products.find({ $or: query });

        subscription.products.forEach((product) => {
          let prod = _.find(variants, {
            _id: product.product_id,
          });

          let variant = _.find(prod.pricing, {
            _id: product.variantId,
          });

          product.skuOrHsnNo = variant.skuOrHsnNo;
        });
      }
    }

    let hasPrevPage = false;
    let hasNextPage = false;

    if (page < totalPages) hasNextPage = true;
    if (page != 1) hasPrevPage = true;

    const pageDetails = {
      currentPage: parseInt(page),
      totalPages: totalPages,
      hasPrevPage,
      hasNextPage,
      totalDocuments,
    };

    const {
      minPurchaseAmount = 0,
      minFreeDeliveryAmount = 0,
      maxMedcoinUse = 0,
    } = (await MasterPreference.findOne(
      { isDisabled: false },
      { minPurchaseAmount: 1, minFreeDeliveryAmount: 1, maxMedcoinUse: 1 }
    )) || {};

    //add flag value if any of the subscription product require prescription

    paymentAwaitedSubscriptions.forEach((userSubscription) => {
      if (
        userSubscription.products.some(
          (product) => product.IsPrescriptionRequired
        )
      ) {
        userSubscription.prescriptionRequired = true;
      } else {
        userSubscription.prescriptionRequired = false;
      }
    });

    return res.json({
      error: false,
      message: paymentAwaitedSubscriptions.length
        ? "Payment awaited subscriptions found."
        : "Empty payment awaited subscription.",
      data: {
        subscriptions: paymentAwaitedSubscriptions,
        pageDetails,
        masterPreference: {
          minPurchaseAmount,
          minFreeDeliveryAmount,
          maxMedcoinUse,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getInactiveSubscriptions = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateGetInactiveSubscriptions(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    let { page, searchBy } = req.body;
    let limit = 10;
    let skip = (page - 1) * limit;

    let searchQuery;

    if (searchBy) {
      const users = await User.find({
        name: { $regex: `${searchBy}`, $options: "i" },
      });

      const userIds = users.map((user) => ({
        userId: { $eq: mongoose.Types.ObjectId(user._id) },
      }));

      searchQuery = [
        { subscriptionId: { $regex: `${searchBy}`, $options: "i" } },
      ];

      if (userIds.length) {
        searchQuery = searchQuery.concat(userIds);
      }
    }

    let totalDocuments = await UserSubscription.countDocuments({
      active: false,
    });

    let totalPages = Math.ceil(totalDocuments / limit);

    //paymentAwaited

    const inactiveSubscriptions = await UserSubscription.aggregate([
      {
        $match: {
          active: false,
          ...(searchBy && {
            $or: searchQuery,
          }),
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "order",
        },
      },
      {
        $unwind: {
          path: "$order",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          subscriptionId: "$_id",
          userId: 1,
          userName: "$user.name",
          createdAt: 1,
          products: 1,
          remarks: 1,
          medCoinCount: 1,
          couponCode: 1,
          phoneNumber: "$order.address.mobile",
          firstDeliveryDate: "$order.deliveredDate",
          interval: 1,
          nextDeliveryDate: 1,
          subscriptionIdString: "$subscriptionId",
          address: "$order.address",
          paymentType: "$order.paymentType",
          originalOrderId: "$order.orderId",
          orderIds: 1,
          prescription: 1,
          customerId: "$user.customerId",
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    let serialNoStarting = (parseInt(page) - 1) * 10 + 1;

    inactiveSubscriptions.forEach((userSubscription) => {
      userSubscription.createdAt = moment(userSubscription.updatedAt)
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY ");
      userSubscription.nextDeliveryDate = moment(
        userSubscription.nextDeliveryDate
      )
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY ");

      userSubscription.firstDeliveryDate = moment(
        userSubscription.firstDeliveryDate
      )
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY ");

      userSubscription.amount = 0;

      userSubscription.products.forEach((product) => {
        userSubscription.amount += product.specialPrice * product.quantity;
      });

      userSubscription.noOfItems = userSubscription.products.length;

      //add s:no
      userSubscription.siNo = serialNoStarting;
      serialNoStarting++;

      //previous order date

      let previousDate = moment()
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY ");

      if (userSubscription.orderIds.length) {
        previousDate = moment(
          userSubscription.orderIds[userSubscription.orderIds.length - 1]
            .createdAt
        )
          .tz(process.env.TIME_ZONE)
          .format("MMM DD YYYY ");
      }

      userSubscription.previousDate = previousDate;
    });

    //get hsn/sku code

    for (const subscription of inactiveSubscriptions) {
      let query = subscription.products.map((product) => {
        return {
          _id: product.product_id,
        };
      });

      if (query.length) {
        const variants = await Products.find({ $or: query });

        subscription.products.forEach((product) => {
          let prod = _.find(variants, {
            _id: product.product_id,
          });

          let variant = _.find(prod.pricing, {
            _id: product.variantId,
          });

          product.skuOrHsnNo = variant.skuOrHsnNo;
        });
      }
    }

    let hasPrevPage = false;
    let hasNextPage = false;

    if (page < totalPages) hasNextPage = true;
    if (page != 1) hasPrevPage = true;

    const pageDetails = {
      currentPage: parseInt(page),
      totalPages: totalPages,
      hasPrevPage,
      hasNextPage,
      totalDocuments,
    };

    const {
      minPurchaseAmount = 0,
      minFreeDeliveryAmount = 0,
      maxMedcoinUse = 0,
    } = (await MasterPreference.findOne(
      { isDisabled: false },
      { minPurchaseAmount: 1, minFreeDeliveryAmount: 1, maxMedcoinUse: 1 }
    )) || {};

    //add flag value if any of the subscription product require prescription

    inactiveSubscriptions.forEach((userSubscription) => {
      if (
        userSubscription.products.some(
          (product) => product.IsPrescriptionRequired
        )
      ) {
        userSubscription.prescriptionRequired = true;
      } else {
        userSubscription.prescriptionRequired = false;
      }
    });

    return res.json({
      error: false,
      message: inactiveSubscriptions.length
        ? "Inactive subscriptions found."
        : "Empty inactive subscription.",
      data: {
        subscriptions: inactiveSubscriptions,
        pageDetails,
        masterPreference: {
          minPurchaseAmount,
          minFreeDeliveryAmount,
          maxMedcoinUse,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getActiveSubscriptions = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateGetInactiveSubscriptions(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    let { page, searchBy } = req.body;
    let limit = 10;
    let skip = (page - 1) * limit;

    let searchQuery;

    if (searchBy) {
      const users = await User.find({
        name: { $regex: `${searchBy}`, $options: "i" },
      });

      const userIds = users.map((user) => ({
        userId: { $eq: mongoose.Types.ObjectId(user._id) },
      }));

      searchQuery = [
        { subscriptionId: { $regex: `${searchBy}`, $options: "i" } },
      ];

      if (userIds.length) {
        searchQuery = searchQuery.concat(userIds);
      }
    }

    let totalDocuments = await UserSubscription.countDocuments({
      active: false,
    });

    let totalPages = Math.ceil(totalDocuments / limit);

    //paymentAwaited

    const activeSubscriptions = await UserSubscription.aggregate([
      {
        $match: {
          active: true,
          ...(searchBy && {
            $or: searchQuery,
          }),
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "order",
        },
      },
      {
        $unwind: {
          path: "$order",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          subscriptionId: "$_id",
          userId: 1,
          userName: "$user.name",
          createdAt: 1,
          products: 1,
          remarks: 1,
          medCoinCount: 1,
          couponCode: 1,
          phoneNumber: "$order.address.mobile",
          firstDeliveryDate: "$order.deliveredDate",
          interval: 1,
          nextDeliveryDate: 1,
          subscriptionIdString: "$subscriptionId",
          address: "$order.address",
          paymentType: "$order.paymentType",
          originalOrderId: "$order.orderId",
          orderIds: 1,
          prescription: 1,
          customerId: "$user.customerId",
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    let serialNoStarting = (parseInt(page) - 1) * 10 + 1;

    activeSubscriptions.forEach((userSubscription) => {
      userSubscription.createdAt = moment(userSubscription.updatedAt)
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY ");
      userSubscription.nextDeliveryDate = moment(
        userSubscription.nextDeliveryDate
      )
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY ");

      userSubscription.firstDeliveryDate = moment(
        userSubscription.firstDeliveryDate
      )
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY ");

      userSubscription.amount = 0;

      userSubscription.products.forEach((product) => {
        userSubscription.amount += product.specialPrice * product.quantity;
      });

      userSubscription.noOfItems = userSubscription.products.length;

      //add s:no
      userSubscription.siNo = serialNoStarting;
      serialNoStarting++;

      //previous order date

      let previousDate = moment()
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY ");

      if (userSubscription.orderIds.length) {
        previousDate = moment(
          userSubscription.orderIds[userSubscription.orderIds.length - 1]
            .createdAt
        )
          .tz(process.env.TIME_ZONE)
          .format("MMM DD YYYY ");
      }

      userSubscription.previousDate = previousDate;
    });

    //get hsn/sku code

    for (const subscription of activeSubscriptions) {
      let query = subscription.products.map((product) => {
        return {
          _id: product.product_id,
        };
      });

      if (query.length) {
        const variants = await Products.find({ $or: query });

        subscription.products.forEach((product) => {
          let prod = _.find(variants, {
            _id: product.product_id,
          });

          let variant = _.find(prod.pricing, {
            _id: product.variantId,
          });

          product.skuOrHsnNo = variant.skuOrHsnNo;
        });
      }
    }

    let hasPrevPage = false;
    let hasNextPage = false;

    if (page < totalPages) hasNextPage = true;
    if (page != 1) hasPrevPage = true;

    const pageDetails = {
      currentPage: parseInt(page),
      totalPages: totalPages,
      hasPrevPage,
      hasNextPage,
      totalDocuments,
    };

    const {
      minPurchaseAmount = 0,
      minFreeDeliveryAmount = 0,
      maxMedcoinUse = 0,
    } = (await MasterPreference.findOne(
      { isDisabled: false },
      { minPurchaseAmount: 1, minFreeDeliveryAmount: 1, maxMedcoinUse: 1 }
    )) || {};

    //add flag value if any of the subscription product require prescription

    activeSubscriptions.forEach((userSubscription) => {
      if (
        userSubscription.products.some(
          (product) => product.IsPrescriptionRequired
        )
      ) {
        userSubscription.prescriptionRequired = true;
      } else {
        userSubscription.prescriptionRequired = false;
      }
    });

    return res.json({
      error: false,
      message: activeSubscriptions.length
        ? "Active subscriptions found."
        : "Empty active subscription.",
      data: {
        subscriptions: activeSubscriptions,
        pageDetails,
        masterPreference: {
          minPurchaseAmount,
          minFreeDeliveryAmount,
          maxMedcoinUse,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getConvertedSubscriptionOrders = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateGetConvertedSubscriptionOrders(
      req.body
    );
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    let { page, searchBy } = req.body;
    let limit = 10;
    let skip = (page - 1) * limit;

    let searchQuery;

    if (searchBy) {
      const users = await User.find({
        name: { $regex: `${searchBy}`, $options: "i" },
      });

      const userIds = users.map((user) => ({
        userId: { $eq: mongoose.Types.ObjectId(user._id) },
      }));

      searchQuery = [
        { subscriptionId: { $regex: `${searchBy}`, $options: "i" } },
      ];

      if (userIds.length) {
        searchQuery = searchQuery.concat(userIds);
      }
    }

    let totalDocuments = await UserSubscription.countDocuments({
      tab: "converted orders",
    });

    let totalPages = Math.ceil(totalDocuments / limit);

    //paymentAwaited

    const convertedOrders = await UserSubscription.aggregate([
      {
        $match: {
          tab: "converted orders",
          ...(searchBy && {
            $or: searchQuery,
          }),
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "order",
        },
      },
      {
        $unwind: {
          path: "$order",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          subscriptionId: "$_id",
          userId: 1,
          userName: "$user.name",
          createdAt: 1,
          products: 1,
          remarks: 1,
          medCoinCount: 1,
          couponCode: 1,
          phoneNumber: "$order.address.mobile",
          firstDeliveryDate: "$order.deliveredDate",
          interval: 1,
          nextDeliveryDate: 1,
          subscriptionIdString: "$subscriptionId",
          address: "$order.address",
          orderStatus: "$order.orderStatus",
          paymentType: "$order.paymentType",
          originalOrderId: "$order.orderId",
          orderIds: 1,
          prescription: 1,
          customerId: "$user.customerId",
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    let serialNoStarting = (parseInt(page) - 1) * 10 + 1;

    convertedOrders.forEach((userSubscription) => {
      userSubscription.createdAt = moment(userSubscription.updatedAt)
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY ");
      userSubscription.nextDeliveryDate = moment(
        userSubscription.nextDeliveryDate
      )
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY ");

      userSubscription.firstDeliveryDate = moment(
        userSubscription.firstDeliveryDate
      )
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY ");

      userSubscription.amount = 0;

      userSubscription.products.forEach((product) => {
        userSubscription.amount += product.specialPrice * product.quantity;
      });

      userSubscription.noOfItems = userSubscription.products.length;

      //add s:no
      userSubscription.siNo = serialNoStarting;
      serialNoStarting++;

      //previous order date

      let previousDate = moment()
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY ");

      if (userSubscription.orderIds.length) {
        previousDate = moment(
          userSubscription.orderIds[userSubscription.orderIds.length - 1]
            .createdAt
        )
          .tz(process.env.TIME_ZONE)
          .format("MMM DD YYYY ");
      }

      userSubscription.previousDate = previousDate;
    });

    //get hsn/sku code

    for (const subscription of convertedOrders) {
      let query = subscription.products.map((product) => {
        return {
          _id: product.product_id,
        };
      });

      if (query.length) {
        const variants = await Products.find({ $or: query });

        subscription.products.forEach((product) => {
          let prod = _.find(variants, {
            _id: product.product_id,
          });

          let variant = _.find(prod.pricing, {
            _id: product.variantId,
          });

          product.skuOrHsnNo = variant.skuOrHsnNo;
        });
      }
    }

    let hasPrevPage = false;
    let hasNextPage = false;

    if (page < totalPages) hasNextPage = true;
    if (page != 1) hasPrevPage = true;

    const pageDetails = {
      currentPage: parseInt(page),
      totalPages: totalPages,
      hasPrevPage,
      hasNextPage,
      totalDocuments,
    };

    const {
      minPurchaseAmount = 0,
      minFreeDeliveryAmount = 0,
      maxMedcoinUse = 0,
    } = (await MasterPreference.findOne(
      { isDisabled: false },
      { minPurchaseAmount: 1, minFreeDeliveryAmount: 1, maxMedcoinUse: 1 }
    )) || {};

    //add flag value if any of the subscription product require prescription

    convertedOrders.forEach((userSubscription) => {
      if (
        userSubscription.products.some(
          (product) => product.IsPrescriptionRequired
        )
      ) {
        userSubscription.prescriptionRequired = true;
      } else {
        userSubscription.prescriptionRequired = false;
      }
    });

    return res.json({
      error: false,
      message: convertedOrders.length
        ? "Converted orders found."
        : "Empty converted orders subscription.",
      data: {
        subscriptions: convertedOrders,
        pageDetails,
        masterPreference: {
          minPurchaseAmount,
          minFreeDeliveryAmount,
          maxMedcoinUse,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getDiscountAmountOfACoupon = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateGetCouponDiscountAmount(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    const { couponCode } = req.body;

    const coupon = await Coupons.findOne(
      {
        code: couponCode,
        isDisabled: false,
        from: { $lte: new Date() },
        to: { $gte: new Date() },
      },
      {
        type: 1,
        maximumUser: 1,
        numberPerUser: 1,
        promotionType: 1,
        totalTimesUsed: 1,
        category: 1,
        purchaseAmount: 1,
        maximumAmount: 1,
        percentage: 1,
      }
    );

    if (!coupon) {
      return res.json({
        error: true,
        message: "Invalid Coupon Code.",
      });
    }

    return res.json({
      error: false,
      message: "Coupon found.",
      data: {
        coupon,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCountOfActiveAndInactiveSubscriptions = async (req, res, next) => {
  try {
    //get count of active subscriptions

    let activeSubscriptions = await UserSubscription.countDocuments({
      active: true,
    });

    //get count of inactive subscriptions

    let inactiveSubscriptions = await UserSubscription.countDocuments({
      active: false,
    });

    res.json({
      error: false,
      message: "Subscription details found.",
      data: {
        activeSubscriptions,
        inactiveSubscriptions,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubscriptions,
  updateUserSubscription,
  sentUserSubscriptionPaymentLink,
  moveUserSubscriptionToPrescriptionAwaited,
  moveSubscriptionToReviewPending,
  moveSubscriptionToPackingPending,
  activateAndDeactivateSubscription,
  updateSubscriptionRemarks,
  getPaymentAwaitedSubscriptions,
  getInactiveSubscriptions,
  getConvertedSubscriptionOrders,
  getActiveSubscriptions,
  getDiscountAmountOfACoupon,
  getCountOfActiveAndInactiveSubscriptions,
};
