const mongoose = require("mongoose");
const _ = require("lodash");
const moment = require("moment-timezone");

//models
const cart = require("../../models/cart");
const product = require("../../models/inventory");
const AdsCartHandpick = require("../../models/ads/cart/handpick");
const adsAd1Subscription = require("../../models/ads/cart/ad1Subscription");
const MasterPreference = require("../../models/mastersettings/masterPreference");
const UserAddress = require("../../models/userAddress");
const coupons = require("../../models/coupon/coupon");
const UserAppliedCoupons = require("../../models/cart/userAppliedCoupons");
const UserAppliedMedCoins = require("../../models/cart/userAppliedMedCoin");
const DefaultAppliedSubscriptionCoupon = require("../../models/cart/defaultAppliedSubscriptionCoupons");
const UserAppliedDonation = require("../../models/cart/userAppliedDonation");
const MasterDeliveryChargeTime = require("../../models/mastersettings/deliveryChargeTime");
const Prescription = require("../../models/prescription");
const User = require("../../models/user");
const InventoryFavourite = require("../../models/inventoryFavourites");
const Stores = require("../../models/store");
const storeProducts = require("../../models/store_products");
const adsCartOrderReview = require("../../models/ads/cart/orderreview");
const PremiumUser = require("../../models/user/premiumUser");
const UserMembershipBenefits = require("../../models/user/membershipBenefits");
let API_KEY = process.env.OTPAPIKEY;
const TwoFactor = new (require("2factor"))(API_KEY);

//validations
const {
  validateAddProductToCart,
  validateApplyACouponToCart,
  validateRemoveCouponFromTheCart,
  validateRemoveCartItem,
  validateUpdateCartItem,
  validateEditAppliedMedCoin,
  validateEditAppliedDonation,
  validateMultipleProductToCart,
} = require("../../validations/cart/cartValidations");
//helpers
const cartHelper = require("../cartHelper");
const {
  extractTextFromHTMLElement,
  convertAllNumberObjectPropertiesToString,
  calculateDeliveryTimeAndDeliveryDateByHours,
} = require("../../helpers/helper");
const ad1Subscription = require("../../models/ads/cart/ad1Subscription");
const MasterSubCategoryHealthcare = require("../../models/mastersettings/subCategoryHealthcare");

const imgPath = process.env.BASE_URL;

const doGetMedCart = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const customerType = "normal";

      let products = await cart.aggregate([
        //get all cart based on user  id
        {
          $match: {
            userId: mongoose.Types.ObjectId(userId),
          },
        },
        //get all product added to cart from products collection based on product id saved
        {
          $lookup: {
            from: "products",
            localField: "product_id",
            foreignField: "_id",
            as: "product",
          },
        },

        {
          $unwind: "$product",
        },

        //only get enabled products
        {
          $match: {
            "product.isDisabled": false,
          },
        },

        {
          $project: {
            "product.pricing": {
              //only get the variant that variant id and variant id saved in cart are equal
              $filter: {
                input: "$product.pricing",
                as: "pricing",
                cond: { $eq: ["$$pricing._id", "$variantId"] },
              },
            },
            variantId: 1,
            product_id: 1,
            quantity: 1,
            product: {
              name: 1,
              description: 1,
              prescription: 1,
              offerType: 1,
              type: 1,
              brand: 1,
              volume: 1,
              sku: 1,
            },
          },
        },

        {
          $unwind: "$product.pricing",
        },

        //brand

        {
          $lookup: {
            from: "masterbrands",
            localField: "product.brand",
            foreignField: "_id",
            as: "brand",
          },
        },

        {
          $unwind: {
            path: "$brand",
            preserveNullAndEmptyArrays: true,
          },
        },

        //uom value
        {
          $lookup: {
            from: "masteruomvalues",
            localField: "product.pricing.sku",
            foreignField: "_id",
            as: "uomValue",
          },
        },

        {
          $unwind: {
            path: "$uomValue",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            cartId: "$_id",
            variantId: "$variantId",
            product_id: "$product_id",
            quantity: "$quantity",
            productName: "$product.name",
            brandName: "$brand.title",
            type: "$product.type",
            description: "$product.description",
            IsPrescriptionRequired: "$product.prescription",
            image: { $concat: [imgPath, { $first: "$product.pricing.image" }] },
            price: "$product.pricing.price",
            offerType: "$product.offerType",
            specialPrice: "$product.pricing.specialPrice",
            uomValue: "$uomValue.uomValue",
            discountAmount: {
              $subtract: [
                "$product.pricing.price",
                "$product.pricing.specialPrice",
              ],
            },
            discountInPercentage: {
              $multiply: [
                {
                  $divide: [
                    {
                      $subtract: [
                        "$product.pricing.price",
                        "$product.pricing.specialPrice",
                      ],
                    },
                    "$product.pricing.price",
                  ],
                },
                100,
              ],
            },
          },
        },
        { $addFields: { outOfStock: false } },
      ]);

      //get all out of stock product

      const outOfStockProducts = [];

      for (const product of products) {
        //check if stock is available

        const { stockAvailable } =
          (await checkIfStockAvailable({
            variantId: product.variantId,
            productId: product.product_id,
            quantity: product.quantity,
            userId,
          })) || {};

        if (!stockAvailable) {
          outOfStockProducts.push(product.cartId);
        }

        //add subscribed value to all product as false
        product.subscribed = false;
      }

      //filter out of stock product it will be added to the cart later after all calculation

      products = products.filter(
        (product) => !outOfStockProducts.includes(product.cartId)
      );

      //delivery details

      const deliveryDetails = {
        isThisProductDeliverable: false,
        message: "This products are not deliverable.",
      };

      const storeDetails = {
        storeId: "",
        isThisStoreMaster: true,
        storeLevel: 0,
      };

      //check if user have address or not

      let address = await UserAddress.findOne(
        { userId, isDisabled: false },
        {
          name: 1,
          mobile: 1,
          pincode: 1,
          house: 1,
          state: 1,
          street: 1,
          landmark: 1,
          type: 1,
          isActive: 1,
        }
      ).lean();

      //check if user address pinCode is serviceable

      let serviceableStore;

      if (address && products.length) {
        serviceableStore = await Stores.findOne(
          {
            serviceablePincodes: {
              $elemMatch: { code: address.pincode, active: true },
            },
            isDisabled: false,
          },
          {
            _id: 1,
            level: 1,
            serviceablePincodes: {
              $elemMatch: { code: address.pincode, active: true },
            },
          }
        ).lean();
        if (serviceableStore) {
          serviceableStore.serviceablePincode =
            serviceableStore.serviceablePincodes[0];

          deliveryDetails.isThisProductDeliverable = true;
          deliveryDetails.message = "This products are deliverable.";

          //check if all product is available in the same level or any parent store

          let queryForCheckingProductsInStores = [];
          products.map((product) =>
            queryForCheckingProductsInStores.push({
              $and: [
                { productId: mongoose.Types.ObjectId(product.product_id) },
                { stock: { $gte: product.quantity } },
                { varientId: mongoose.Types.ObjectId(product.variantId) },
              ],
            })
          );

          let stopLoop = false;
          let storeIdToCheckProduct = serviceableStore._id;
          let loopCount = 0;
          let storeProductsData;
          while (!stopLoop) {
            storeProductsData = await storeProducts.aggregate([
              {
                $match: {
                  storeId: storeIdToCheckProduct,
                  $or: queryForCheckingProductsInStores,
                },
              },
              {
                $lookup: {
                  from: "stores",
                  localField: "storeId",
                  foreignField: "_id",
                  as: "store",
                },
              },
              {
                $unwind: "$store",
              },
              {
                $project: {
                  _id: 0,
                  storeId: 1,
                  product_id: "$productId",
                  variantId: "$varientId",
                  stock: 1,
                  price: 1,
                  specialPrice: 1,
                  discountAmount: { $subtract: ["$price", "$specialPrice"] },
                  discountInPercentage: {
                    $multiply: [
                      {
                        $divide: [
                          { $subtract: ["$price", "$specialPrice"] },
                          "$price",
                        ],
                      },
                      100,
                    ],
                  },
                  isThisMasterStore: "$store.masterStore",
                  parentStoreId: "$store.parent",
                  level: "$store.level",
                },
              },
            ]);

            if (
              products.length === storeProductsData.length ||
              storeProductsData[0]?.level - 1 === 0
            ) {
              stopLoop = true;
            }

            storeIdToCheckProduct = storeProductsData.parentStoreId;

            loopCount++;
            if (loopCount >= 2) {
              break;
            }
          }

          //if products length and storeProductsData length is equal which means a store other than master have all the products this user cart have

          if (products.length === storeProductsData.length) {
            storeDetails.isThisStoreMaster = false;
            storeDetails.storeLevel = storeProductsData[0]?.level;
            storeDetails.storeId = storeProductsData[0]?.storeId;

            storeProductsData.map((storeProduct) => {
              products.map((product) => {
                if (
                  product.product_id.toString() ==
                    storeProduct.product_id.toString() &&
                  product.variantId.toString() ==
                    storeProduct.variantId.toString()
                ) {
                  product.price = storeProduct.price;
                  product.specialPrice = storeProduct.specialPrice;
                  product.discountAmount = storeProduct.discountAmount;
                  product.discountInPercentage =
                    storeProduct.discountInPercentage;
                }
              });
            });
          } else {
            //get master store id
            const { _id: masterStoreId } =
              (await Stores.findOne(
                { masterStore: true, isDisabled: false },
                { _id: 1 }
              )) || {};

            storeDetails.isThisStoreMaster = true;
            storeDetails.storeLevel = 0;
            storeDetails.storeId = masterStoreId;
          }
        } else {
          deliveryDetails.isThisProductDeliverable = false;
          deliveryDetails.message = `This products are not deliverable for ${address.pincode}.`;
        }
      } else if (!products.length) {
        deliveryDetails.isThisProductDeliverable = false;
        deliveryDetails.message = `Please add products to your cart.`;
      } else {
        deliveryDetails.isThisProductDeliverable = false;
        deliveryDetails.message = `Please add address to see if the products are deliverable .`;
      }

      let cartDetails = {
        totalCartValue: 0,
        totalRealCartValue: 0,
        totalDiscountAmount: 0,
        deliveryCharge: 0,
        deliveryTime: 0,
        deliveryDate: "",
        medCoinRedeemed: 0,
        memberDiscount: 0,
        premiumUser: false,
        premiumMemberCashBack: 0,
        donationAmount: 0,
        couponAppliedDiscount: 0,
        totalCountOfProductsThatRequirePrescription: 0,
        isThisCartIsEligibleForPurchase: true,
        isThisCartEligibleForFreeDelivery: false,
        totalDiscountInPercentage: 0,
        totalAmountToBePaid: 0,
        cashOnDelivery: false,
        totalCartItemsCount: 0,
        whishListCount: 0,
        userHasMedCoins: true,
        isPrescriptionProvided: false,
        minFreeDeliveryAmount: 0,
        freeDeliveryProvidedByPremiumBenefit: false,
      };
      let prescriptionResult = await Prescription.findOne({
        userId: userId,
        active: true,
      });
      if (prescriptionResult?.prescription?.length) {
        cartDetails.isPrescriptionProvided = true;
      }

      //check if pin code is eligible for cash on delivery
      if (serviceableStore?.serviceablePincode?.cashOnDelivery) {
        cartDetails.cashOnDelivery = true;
      }

      const {
        minPurchaseAmount = 0,
        minFreeDeliveryAmount = 0,
        maxMedcoinUse = 0,
      } = (await MasterPreference.findOne(
        { isDisabled: false },
        { minPurchaseAmount: 1, minFreeDeliveryAmount: 1, maxMedcoinUse: 1 }
      )) || {};

      cartDetails.minFreeDeliveryAmount = minFreeDeliveryAmount;
      cartDetails.minimumPurchaseAmount = minPurchaseAmount;

      //apply default med coin to user if he have med coin and not applied any and have products

      //check if user has med coin or not

      let { medCoin } =
        (await User.findOne({ _id: userId }, { medCoin: 1 })) || {};

      //check users available med coin balance if it is zero or does not exit set isUserHasAnyMedCoin to false
      if (!medCoin) {
        cartDetails.userHasMedCoins = false;
      }

      //set default med coin redeem

      let applicableMedCoin = 0;

      if (medCoin && medCoin > 0) {
        if (medCoin > maxMedcoinUse) {
          applicableMedCoin = maxMedcoinUse;
        } else {
          applicableMedCoin = medCoin;
        }
      }

      let appliedMedCoin = await UserAppliedMedCoins.findOne({
        userId,
        isMedCoinApplied: true,
      });

      //if there is not applied med coin apply med coin

      if (products.length) {
        if (!appliedMedCoin) {
          await new UserAppliedMedCoins({
            userId,
            medCoinCount: applicableMedCoin,
            isMedCoinApplied: true,
          }).save();

          cartDetails.medCoinRedeemed = applicableMedCoin;
        } else {
          //if med coin applied is greater than med coin applicable change it back to applicable

          if (appliedMedCoin.medCoinCount > applicableMedCoin) {
            cartDetails.medCoinRedeemed = applicableMedCoin;

            //update applicable med coin

            await UserAppliedMedCoins.updateOne(
              { _id: appliedMedCoin._id },
              {
                medCoinCount: applicableMedCoin,
              }
            );
          } else {
            cartDetails.medCoinRedeemed = appliedMedCoin.medCoinCount;
          }
        }
      }
      //if there is no product in the cart remove med coin

      if (!products.length && appliedMedCoin) {
        await UserAppliedMedCoins.deleteOne({ _id: appliedMedCoin._id });

        cartDetails.medCoinRedeemed = 0;
      }

      //coupon applied discount for med cart
      let userAppliedCoupon = await UserAppliedCoupons.aggregate([
        {
          $match: { userId, isCouponApplied: true, couponType: "Medimall" },
        },
        {
          $lookup: {
            from: "coupons",
            localField: "couponId",
            foreignField: "_id",
            as: "coupon",
          },
        },
        {
          $unwind: "$coupon",
        },
        {
          $project: {
            couponId: 1,
            couponType: 1,
            category: "$coupon.category",
            purchaseAmount: "$coupon.purchaseAmount",
            percentage: "$coupon.percentage",
            maximumAmount: "$coupon.maximumAmount",
            to: "$coupon.to",
            code: "$coupon.code",
            name: "$coupon.name",
          },
        },
      ]);

      userAppliedCoupon = userAppliedCoupon[0];

      //remove coupon from the cart if there is no product to apply that coupon or if coupon expired or med coin is applied or no product exist in the cart

      if (userAppliedCoupon) {
        if (
          !products.some(
            (product) => product.type === userAppliedCoupon.category
          ) ||
          new Date().getTime() > new Date(userAppliedCoupon.to).getTime() ||
          cartDetails.medCoinRedeemed > 0 ||
          !products.length
        ) {
          await doRemoveCouponFromTheCart(userId, {
            couponId: userAppliedCoupon?.couponId,
          });
          userAppliedCoupon = null;
        }
      }

      //if user applied med coin do not allow to add coupon remove it from cart

      products.map((product) => {
        cartDetails.totalCartValue += product.specialPrice * product.quantity;
        cartDetails.totalDiscountAmount +=
          product.discountAmount * product.quantity;
        cartDetails.totalRealCartValue += product.price * product.quantity;
        //if product require prescription increase it's count
        if (product.IsPrescriptionRequired)
          cartDetails.totalCountOfProductsThatRequirePrescription++;
        //if product have a offer type which means it is not eligible for any other kind of discount or offers
        if (product.offerType) {
        }

        if (userAppliedCoupon) {
          if (product.type === userAppliedCoupon.category) {
            //get percentage of discount and increase coupon discount until it hit maximum limit

            const discountAmount =
              (userAppliedCoupon.percentage / 100) *
              (product.specialPrice * product.quantity);

            if (
              cartDetails.couponAppliedDiscount + discountAmount <
              userAppliedCoupon.maximumAmount
            ) {
              cartDetails.couponAppliedDiscount += discountAmount;
            } else {
              cartDetails.couponAppliedDiscount =
                userAppliedCoupon.maximumAmount;
            }
          }
        }
      });

      //get minimum purchase amount and min free delivery amount and set if this product is eligible for purchase and eligible for free delivery
      if (cartDetails.totalCartValue < minPurchaseAmount)
        cartDetails.isThisCartIsEligibleForPurchase = false;
      if (cartDetails.totalCartValue >= minFreeDeliveryAmount)
        cartDetails.isThisCartEligibleForFreeDelivery = true;

      //check if user is minimum purchase amount is equal or greater than the purchase amount apply this coupon
      if (userAppliedCoupon) {
        if (cartDetails.totalCartValue < userAppliedCoupon.purchaseAmount) {
          cartDetails.couponAppliedDiscount = 0;
          await doRemoveCouponFromTheCart(userId, {
            couponId: userAppliedCoupon?.couponId,
          });
          userAppliedCoupon = null;
        }
      }

      //decide total amount to be paid deducting all discounts , coupon, medCoin, and member discount
      if (products.length) {
        cartDetails.totalAmountToBePaid =
          cartDetails.totalCartValue -
          cartDetails.memberDiscount -
          cartDetails.medCoinRedeemed -
          cartDetails.couponAppliedDiscount;
      }

      //add coupon discount to total discount amount

      cartDetails.totalDiscountAmount += cartDetails.couponAppliedDiscount;

      //add medCoin Redeemed to total discount amount
      cartDetails.totalDiscountAmount += cartDetails.medCoinRedeemed;

      cartDetails.totalDiscountInPercentage =
        (cartDetails.totalDiscountAmount / cartDetails.totalRealCartValue) *
        100;

      if (!cartDetails.totalDiscountInPercentage)
        cartDetails.totalDiscountInPercentage = 0;

      //calculate delivery charge and time

      let deliveryChargeAndTimes = await MasterDeliveryChargeTime.find(
        { isDisabled: false },
        {
          level: 1,
          DeliveryTime: 1,
          charge: 1,
        }
      );

      if (deliveryChargeAndTimes.length && serviceableStore) {
        const userStoreLevel = serviceableStore.level;
        const productStoreLevel = storeDetails.storeLevel;

        const checkDeliveryChargeAndTimeAndChange = (levelName) => {
          const ruleForThisLevel = deliveryChargeAndTimes.filter(
            (rules) => rules.level === levelName
          );

          if (ruleForThisLevel.length) {
            cartDetails.deliveryCharge = ruleForThisLevel[0].charge;
            cartDetails.deliveryTime = ruleForThisLevel[0].DeliveryTime;
          } else {
            cartDetails.deliveryCharge = 0;
            cartDetails.deliveryTime = "0 hr";
          }
        };

        //if same level store

        if (userStoreLevel === productStoreLevel) {
          checkDeliveryChargeAndTimeAndChange("Same Level");
        } else if (userStoreLevel === 3 && productStoreLevel === 2) {
          checkDeliveryChargeAndTimeAndChange("Sub sub store to sub store");
        } else if (userStoreLevel === 3 && productStoreLevel === 1) {
          checkDeliveryChargeAndTimeAndChange("Sub sub store to sub store");
        } else if (userStoreLevel === 2 && productStoreLevel === 1) {
          checkDeliveryChargeAndTimeAndChange("Sub store to store");
        } else {
          checkDeliveryChargeAndTimeAndChange("Any store to main store");
        }
      }

      //if free deliver is  not available increase that amount to amount to be paid
      if (!cartDetails.isThisCartEligibleForFreeDelivery) {
        cartDetails.totalAmountToBePaid =
          cartDetails.totalAmountToBePaid + cartDetails.deliveryCharge;
      }

      //hand pick
      const handPicks = await AdsCartHandpick.aggregate([
        {
          $match: {
            sliderType: "handpick",
            isDisabled: false,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "typeId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $addFields: { pricing: { $first: "$product.pricing" } },
        },
        //brand

        {
          $lookup: {
            from: "masterbrands",
            localField: "product.brand",
            foreignField: "_id",
            as: "brand",
          },
        },

        {
          $unwind: {
            path: "$brand",
            preserveNullAndEmptyArrays: true,
          },
        },

        //uom value
        {
          $lookup: {
            from: "masteruomvalues",
            localField: "product.pricing.sku",
            foreignField: "_id",
            as: "uomValue",
          },
        },

        {
          $unwind: {
            path: "$uomValue",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 0,
            sliderType: 1,
            variantId: "$pricing._id",
            product_id: "$product._id",
            productName: "$product.name",
            uomValue: "$uomValue.uomValue",
            brandName: "$brand.title",
            IsPrescriptionRequired: "$product.prescription",
            image: { $concat: [imgPath, { $first: "$pricing.image" }] },
            price: "$pricing.price",
            specialPrice: "$pricing.specialPrice",
            discountAmount: {
              $subtract: ["$pricing.price", "$pricing.specialPrice"],
            },
            discountInPercentage: {
              $multiply: [
                {
                  $divide: [
                    { $subtract: ["$pricing.price", "$pricing.specialPrice"] },
                    "$pricing.price",
                  ],
                },
                100,
              ],
            },
          },
        },
      ]);

      for (const handpick of handPicks) {
        const { stockAvailable } =
          (await checkIfStockAvailable({
            variantId: handpick.variantId,
            productId: handpick.product_id,
            quantity: 1,
            userId,
          })) || {};

        if (!stockAvailable) {
          handpick.outOfStock = true;
        } else {
          handpick.outOfStock = false;
        }
      }

      handPicks.forEach((handPick) => {
        if (!handPick.IsPrescriptionRequired) {
          handPick.IsPrescriptionRequired = false;
        }
        if (!handPick.image) {
          handPick.image = "";
        }
        if (!handPick.discountAmount) {
          handPick.discountAmount = 0;
        }
        if (!handPick.discountInPercentage) {
          handPick.discountInPercentage = 0;
        }
        if (!handPick.variantId) {
          handPick.variantId = "";
        }
        if (!handPick.product_id) {
          handPick.product_id = "";
        }
        if (!handPick.productName) {
          handPick.productName = "";
        }
        if (!handPick.price) {
          handPick.price = 0;
        }
        if (!handPick.specialPrice) {
          handPick.specialPrice = 0;
        }

        //round handpick discount percentage

        handPick.discountInPercentage = Math.round(
          handPick.discountInPercentage
        );
      });

      const banner = await adsAd1Subscription.aggregate([
        {
          $match: {
            type: "ad1",
          },
        },
        { $project: { image: { $concat: [imgPath, "$image"] }, _id: 0 } },
      ]);
      const subscriptionAd = await adsAd1Subscription.aggregate([
        {
          $match: {
            type: "subscription",
          },
        },
        { $project: { image: { $concat: [imgPath, "$image"] }, _id: 0 } },
      ]);

      if (!userAppliedCoupon) {
        userAppliedCoupon = {};
      }

      //available coupons in med cart

      const availableMedCartCoupons = await coupons.aggregate([
        {
          $match: {
            customerType,
            type: "Medimall",
            $and: [
              { from: { $lte: new Date() } },
              { to: { $gte: new Date() } },
            ],
            isDisabled: false,
          },
        },

        {
          $project: {
            image: { $concat: [process.env.BASE_URL, "$image"] },
            _id: 1,
            name: 1,
            code: 1,
            from: 1,
            to: 1,
            percentage: 1,
            termsAndCondition: 1,
          },
        },
      ]);

      availableMedCartCoupons.forEach((coupon) => {
        coupon.termsAndCondition = extractTextFromHTMLElement(
          coupon.termsAndCondition
        );
      });

      //check for donation value if not add

      let donation = await UserAppliedDonation.findOne({
        userId,
        isDonationApplied: true,
      });

      // if there is no applied donation add default donation

      if (!donation) {
        const addedDonation = await new UserAppliedDonation({
          userId,
        }).save();

        donation = addedDonation;
      }

      //add donation amount to cart details and increment total amount to be paid

      cartDetails.donationAmount = donation.donationAmount;
      cartDetails.totalAmountToBePaid += cartDetails.donationAmount;

      //get whish list count and add it to cart details

      let wishListCount = await InventoryFavourite.countDocuments({
        userId,
        isDisabled: false,
      });

      cartDetails.whishListCount = wishListCount;

      //set delivery time and delivery date

      if (cartDetails.deliveryTime) {
        const { deliveryTime, deliveryDate } =
          calculateDeliveryTimeAndDeliveryDateByHours(
            parseInt(cartDetails.deliveryTime)
          );

        cartDetails.deliveryTime = deliveryTime;
        cartDetails.deliveryDate = deliveryDate;
      }

      //check if user is a premium user if he is provide premium benefits

      const premiumUser = await PremiumUser.findOne({ userId, expired: false });

      if (premiumUser) {
        //get user benefits

        let premiumBenefits = await UserMembershipBenefits.findOne({
          premiumUserId: premiumUser._id,
        });

        if (!premiumBenefits) {
          premiumBenefits = {};

          premiumBenefits.miniMumOffer = 0;
          premiumBenefits.cashBack = 0;
        }

        let discount =
          (premiumBenefits.cashBack * cartDetails.totalCartValue) / 100;

        cartDetails.memberDiscount = discount;

        //deduct member discount from amount to be paid

        if (Number.isNaN(cartDetails.memberDiscount)) {
          cartDetails.memberDiscount = 0;
        }
        cartDetails.totalAmountToBePaid -= cartDetails.memberDiscount;

        //check if free delivery already provided if not check how many free he have left if it is greater than 0
        //give user free delivery

        if (
          !cartDetails.isThisCartEligibleForFreeDelivery &&
          premiumBenefits.freeDelivery > 0
        ) {
          cartDetails.isThisCartEligibleForFreeDelivery = true;
          cartDetails.freeDeliveryProvidedByPremiumBenefit = true;
        }

        cartDetails.premiumUser = true;
        cartDetails.premiumMemberCashBack = premiumBenefits.cashBack;
      }

      if (!cartDetails.premiumMemberCashBack)
        cartDetails.premiumMemberCashBack = 0;

      //subscription cart details

      const subscriptionCartDetails = { ...cartDetails };
      //remove discount from total discount
      subscriptionCartDetails.couponAppliedDiscount = 0;
      subscriptionCartDetails.totalDiscountAmount -=
        cartDetails.couponAppliedDiscount;

      //increase the amount to be paid by discounted amount

      subscriptionCartDetails.totalAmountToBePaid +=
        cartDetails.couponAppliedDiscount;

      //set discount percentage to zero

      subscriptionCartDetails.totalDiscountInPercentage = 0;

      //check if user applied a subscription coupon

      let userAppliedSubscriptionCoupon = await UserAppliedCoupons.aggregate([
        {
          $match: { userId, isCouponApplied: true, couponType: "Subscription" },
        },
        {
          $lookup: {
            from: "coupons",
            localField: "couponId",
            foreignField: "_id",
            as: "coupon",
          },
        },
        {
          $unwind: "$coupon",
        },
        {
          $project: {
            couponId: 1,
            couponType: 1,
            category: "$coupon.category",
            purchaseAmount: "$coupon.purchaseAmount",
            percentage: "$coupon.percentage",
            maximumAmount: "$coupon.maximumAmount",
            to: "$coupon.to",
            code: "$coupon.code",
            name: "$coupon.name",
          },
        },
      ]);

      userAppliedSubscriptionCoupon = userAppliedSubscriptionCoupon[0];

      //if user does not apply any coupon and there is no med coin redeemed  add a random coupon

      if (
        !userAppliedSubscriptionCoupon &&
        products.length &&
        cartDetails.medCoinRedeemed === 0
      ) {
        //check if already a default coupon applied and removed by user

        let defaultAppliedSubscriptionCoupon =
          await DefaultAppliedSubscriptionCoupon.findOne({
            userId,
            defaultAppliedSubscriptionCoupon: true,
          });

        if (!defaultAppliedSubscriptionCoupon) {
          //find coupon

          userAppliedSubscriptionCoupon = await coupons
            .findOne(
              {
                customerType,
                isDisabled: false,
                category: products[0]?.type,
                type: "subscription",
                from: { $lte: new Date() },
                to: { $gte: new Date() },
                purchaseAmount: { $lte: cartDetails.totalCartValue },
              },
              {
                _id: 1,
                type: 1,
                category: 1,
                purchaseAmount: 1,
                maximumAmount: 1,
                to: 1,
                code: 1,
                name: 1,
                totalTimesUsed: 1,
                maximumUser: 1,
                numberPerUser: 1,
              }
            )
            .lean();

          if (userAppliedSubscriptionCoupon) {
            userAppliedSubscriptionCoupon.couponId =
              userAppliedSubscriptionCoupon._id;
            userAppliedSubscriptionCoupon.couponType =
              userAppliedSubscriptionCoupon.type;

            //apply coupon

            //check coupon total used count and maximum allowed per a user and maximum count for all user

            const numberOfTimesUserAppliedThisCoupon =
              await UserAppliedCoupons.find({
                userId,
                couponType: userAppliedSubscriptionCoupon.type,
                couponId: userAppliedSubscriptionCoupon._id,
              }).countDocuments();

            if (
              userAppliedSubscriptionCoupon.totalTimesUsed >=
                userAppliedSubscriptionCoupon.maximumUser ||
              numberOfTimesUserAppliedThisCoupon >=
                userAppliedSubscriptionCoupon.numberPerUser
            ) {
              userAppliedSubscriptionCoupon = null;
            }

            //if still there is a applied coupon save to db

            if (userAppliedSubscriptionCoupon) {
              //save new applied coupon
              await new UserAppliedCoupons({
                userId,
                couponType: userAppliedSubscriptionCoupon.type,
                couponId: userAppliedSubscriptionCoupon._id,
              }).save();

              //increment count of times this coupon is used

              await coupons.updateOne(
                { _id: userAppliedSubscriptionCoupon._id },
                { $inc: { totalTimesUsed: 1 } }
              );
            }

            //add default applied coupon
            await new DefaultAppliedSubscriptionCoupon({ userId }).save();

            if (userAppliedSubscriptionCoupon) {
              delete userAppliedSubscriptionCoupon._id;
              delete userAppliedSubscriptionCoupon.type;
              delete userAppliedSubscriptionCoupon.totalTimesUsed;
              delete userAppliedSubscriptionCoupon.maximumUser;
              delete userAppliedSubscriptionCoupon.numberPerUser;
            }
          }
        }
      }

      //remove subscription coupon from the cart if there is no product to apply that coupon or if coupon expired

      if (userAppliedSubscriptionCoupon) {
        if (
          !products.some(
            (product) => product.type === userAppliedSubscriptionCoupon.category
          ) ||
          new Date().getTime() >
            new Date(userAppliedSubscriptionCoupon.to).getTime() ||
          cartDetails.medCoinRedeemed > 0 ||
          !products.length
        ) {
          await doRemoveCouponFromTheCart(userId, {
            couponId: userAppliedSubscriptionCoupon?.couponId,
          });

          userAppliedSubscriptionCoupon = null;
        }
      }

      //check if user  minimum purchase amount is equal or greater than the purchase amount apply this coupon
      if (userAppliedSubscriptionCoupon) {
        if (
          subscriptionCartDetails.totalCartValue <=
          userAppliedSubscriptionCoupon.purchaseAmount
        ) {
          subscriptionCartDetails.couponAppliedDiscount = 0;

          await doRemoveCouponFromTheCart(userId, {
            couponId: userAppliedSubscriptionCoupon?.couponId,
          });

          userAppliedSubscriptionCoupon = null;
        }
      }

      //add subscription discount
      if (userAppliedSubscriptionCoupon) {
        products.map((product) => {
          if (userAppliedSubscriptionCoupon) {
            if (product.type === userAppliedSubscriptionCoupon.category) {
              //get percentage of discount and increase coupon discount until it hit maximum limit

              const discountAmount =
                (userAppliedSubscriptionCoupon.percentage / 100) *
                (product.specialPrice * product.quantity);

              if (
                subscriptionCartDetails.couponAppliedDiscount + discountAmount <
                userAppliedSubscriptionCoupon.maximumAmount
              ) {
                subscriptionCartDetails.couponAppliedDiscount += discountAmount;
              } else {
                subscriptionCartDetails.couponAppliedDiscount =
                  userAppliedSubscriptionCoupon.maximumAmount;
              }
            }
          }
        });
      }

      //if there is a coupon discount increment total discount amount decrement amount to be paid

      if (subscriptionCartDetails.couponAppliedDiscount) {
        subscriptionCartDetails.totalDiscountAmount +=
          subscriptionCartDetails.couponAppliedDiscount;
        subscriptionCartDetails.totalAmountToBePaid -=
          subscriptionCartDetails.couponAppliedDiscount;
      }

      //set discount percentage of subscription cart
      subscriptionCartDetails.totalDiscountInPercentage =
        (subscriptionCartDetails.totalDiscountAmount /
          subscriptionCartDetails.totalRealCartValue) *
        100;

      if (!userAppliedSubscriptionCoupon) {
        userAppliedSubscriptionCoupon = {};
      }
      let preference = await MasterPreference.findOne(
        {},
        {
          prescription: 1,
        }
      );
      let orderReview = await adsCartOrderReview
        .find(
          { sliderType: "orderreview", isDisabled: false },
          {
            type: 1,
            typeId: 1,
            image: { $concat: [process.env.BASE_URL, "$image"] },
            sliderType: 1,
          }
        )
        .lean();

      if (orderReview.length) {
        if (orderReview[0].type == 1) {
          let products = await product.findOne({
            _id: orderReview[0].typeId,
          });
          if (products) {
            orderReview[0].title = products.name;
          } else {
            orderReview[0].title = "";
          }
        } else {
          let category = await MasterSubCategoryHealthcare.findOne({
            _id: orderReview[0].typeId,
          });
          if (category) {
            orderReview[0].title = category.title;
          } else {
            orderReview[0].orderReview1.title = "";
          }
        }
      }

      //add whole address as a key

      if (address) {
        address.wholeAddress = `${address.house} , ${address.street} ${address.landmark} ${address.state} ${address.pincode}`;
      }

      if (!address) address = {};

      //available subscription coupons

      const availableSubscriptionCoupons = await coupons.aggregate([
        {
          $match: {
            customerType,
            type: "Subscription",
            $and: [
              { from: { $lte: new Date() } },
              { to: { $gte: new Date() } },
            ],
            isDisabled: false,
          },
        },

        {
          $project: {
            image: { $concat: [process.env.BASE_URL, "$image"] },
            _id: 1,
            name: 1,
            code: 1,
            from: 1,
            to: 1,
            percentage: 1,
            termsAndCondition: 1,
          },
        },
      ]);

      availableSubscriptionCoupons.forEach((coupon) => {
        coupon.termsAndCondition = extractTextFromHTMLElement(
          coupon.termsAndCondition
        );
      });

      //check if all the products in the cart included in the current product list if not
      // it is because of either variant is deleted or product is disabled

      const originalProductCount = await cart.countDocuments({ userId });

      if (originalProductCount !== products.length) {
        const allProducts = await cart.aggregate([
          //get all cart based on user  id
          {
            $match: {
              userId: mongoose.Types.ObjectId(userId),
            },
          },
          //get all product added to cart from products collection based on product id saved
          {
            $lookup: {
              from: "products",
              localField: "product_id",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $unwind: "$product",
          },
          {
            $lookup: {
              from: "masterbrands",
              localField: "product.brand",
              foreignField: "_id",
              as: "brand",
            },
          },

          {
            $unwind: {
              path: "$brand",
              preserveNullAndEmptyArrays: true,
            },
          },

          //uom value
          {
            $lookup: {
              from: "masteruomvalues",
              localField: "variantDetails.sku",
              foreignField: "_id",
              as: "uomValue",
            },
          },

          {
            $unwind: {
              path: "$uomValue",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $project: {
              cartId: "$_id",
              outOfStock: "true",
              brandName: "$brand.title",
              variantId: "$variantId",
              product_id: "$product._id",
              quantity: 1,
              productName: "$product.name",
              type: "$product.type",
              description: "$product.content",
              offerType: "$product.offerType",
              IsPrescriptionRequired: "$product.prescription",
              image: {
                $concat: [imgPath, { $first: "$variantDetails.image" }],
              },
              price: "$variantDetails.price",
              uomValue: "$uomValue.uomValue",
              specialPrice: "$variantDetails.specialPrice",
              discountAmount: {
                $subtract: [
                  "$variantDetails.price",
                  "$variantDetails.specialPrice",
                ],
              },
              discountInPercentage: {
                $multiply: [
                  {
                    $divide: [
                      {
                        $subtract: [
                          "$variantDetails.price",
                          "$variantDetails.specialPrice",
                        ],
                      },
                      "$variantDetails.price",
                    ],
                  },
                  100,
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
            },
          },
          { $addFields: { outOfStock: true } },
        ]);

        //add products to the cart that are out of stock

        allProducts.map((product) => {
          let productExist = _.find(products, {
            cartId: mongoose.Types.ObjectId(product.cartId),
          });
          if (!productExist) {
            products.push(product);
          }
        });
      }

      //check if products are added to whish list

      if (products.length) {
        const queryToGetWhishListAddedProducts = products.map((product) => ({
          $and: [
            { productId: mongoose.Types.ObjectId(product.product_id) },
            { productUomId: mongoose.Types.ObjectId(product.variantId) },
          ],
        }));

        const productsInWhishList = await InventoryFavourite.find({
          userId,
          isDisabled: false,
          $or: queryToGetWhishListAddedProducts,
        });

        productsInWhishList.forEach((productInWhishList) => {
          products.forEach((product) => {
            if (
              product.product_id.toString() ===
                productInWhishList.productId.toString() &&
              product.variantId.toString() ===
                productInWhishList.productUomId.toString()
            ) {
              product.isThisProductAddedToWhishList = true;
            }
          });
        });
      }

      //if prescription required is null set it to false
      products.forEach((product) => {
        if (!product.IsPrescriptionRequired) {
          product.IsPrescriptionRequired = false;
        }

        if (!product.isThisProductAddedToWhishList) {
          product.isThisProductAddedToWhishList = false;
        }

        product.discountInPercentage = Math.round(product.discountInPercentage);
        product.discountAmount = Math.round(product.discountAmount);
      });

      //cart length

      cartDetails.totalCartItemsCount = products.length;
      subscriptionCartDetails.totalCartItemsCount = products.length;

      //cart details discount percentage and  subscription discount percentage round
      cartDetails.totalDiscountInPercentage = Math.round(
        cartDetails.totalDiscountInPercentage
      );

      subscriptionCartDetails.totalDiscountInPercentage = Math.round(
        subscriptionCartDetails.totalDiscountInPercentage
      );

      //change all int to string
      products.map((product) => {
        convertAllNumberObjectPropertiesToString(product);
        product.quantity = parseInt(product.quantity);
      });

      //cartDetails to string
      convertAllNumberObjectPropertiesToString(cartDetails);

      //handPicks to string
      handPicks.map((handpick) => {
        convertAllNumberObjectPropertiesToString(handpick);
      });

      //add total amount pay on next delivery in subscription cart details

      subscriptionCartDetails.totalAmountToPayOnNextDelivery =
        subscriptionCartDetails.totalAmountToBePaid -
        subscriptionCartDetails.medCoinRedeemed +
        subscriptionCartDetails.memberDiscount +
        subscriptionCartDetails.couponAppliedDiscount -
        subscriptionCartDetails.donationAmount;

      //update applied coupons discount amount

      if (userAppliedCoupon) {
        await UserAppliedCoupons.updateOne(
          {
            _id: userAppliedCoupon._id,
          },
          {
            discountAmount: cartDetails.couponAppliedDiscount,
          }
        );
      }

      if (userAppliedSubscriptionCoupon) {
        await UserAppliedCoupons.updateOne(
          {
            _id: userAppliedSubscriptionCoupon._id,
          },
          {
            discountAmount: subscriptionCartDetails.couponAppliedDiscount,
          }
        );
      }

      convertAllNumberObjectPropertiesToString(availableMedCartCoupons);

      convertAllNumberObjectPropertiesToString(subscriptionCartDetails);

      convertAllNumberObjectPropertiesToString(availableSubscriptionCoupons);

      return resolve({
        error: false,
        message: "Cart found.",
        data: [
          {
            medCart: {
              products,
              cartDetails,
              handPicks,
              banner: banner[0],
              address,
              deliveryDetails,
              storeDetails,
              userAppliedCoupon,
              prescriptionEnable: preference.prescription,
              orderReview,
              availableCoupons: availableMedCartCoupons,
            },
          },
          {
            subscriptionCart: {
              products,
              cartDetails: subscriptionCartDetails,
              subscriptionAd: subscriptionAd[0],
              address,
              deliveryDetails,
              storeDetails,
              userAppliedCoupon: userAppliedSubscriptionCoupon,
              prescriptionEnable: preference.prescription,
              availableCoupons: availableSubscriptionCoupons,
            },
          },
        ],
      });
    } catch (error) {
      return reject(error);
    }
  });
};

const doGetMedCartWeb = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const customerType = "normal";

      userId = mongoose.Types.ObjectId(userId);

      let products = await cart.aggregate([
        //get all cart based on user  id
        {
          $match: {
            userId: mongoose.Types.ObjectId(userId),
          },
        },
        //get all product added to cart from products collection based on product id saved
        {
          $lookup: {
            from: "products",
            localField: "product_id",
            foreignField: "_id",
            as: "product",
          },
        },

        {
          $unwind: "$product",
        },

        //only get enabled products
        {
          $match: {
            "product.isDisabled": false,
          },
        },

        {
          $project: {
            "product.pricing": {
              //only get the variant that variant id and variant id saved in cart are equal
              $filter: {
                input: "$product.pricing",
                as: "pricing",
                cond: { $eq: ["$$pricing._id", "$variantId"] },
              },
            },
            variantId: 1,
            product_id: 1,
            quantity: 1,
            product: {
              name: 1,
              description: 1,
              prescription: 1,
              offerType: 1,
              type: 1,
              brand: 1,
              volume: 1,
              sku: 1,
            },
          },
        },

        {
          $unwind: "$product.pricing",
        },

        //brand

        {
          $lookup: {
            from: "masterbrands",
            localField: "product.brand",
            foreignField: "_id",
            as: "brand",
          },
        },

        {
          $unwind: {
            path: "$brand",
            preserveNullAndEmptyArrays: true,
          },
        },

        //uom value
        {
          $lookup: {
            from: "masteruomvalues",
            localField: "product.pricing.sku",
            foreignField: "_id",
            as: "uomValue",
          },
        },

        {
          $unwind: {
            path: "$uomValue",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            cartId: "$_id",
            variantId: "$variantId",
            product_id: "$product_id",
            quantity: "$quantity",
            productName: "$product.name",
            brandName: "$brand.title",
            type: "$product.type",
            description: "$product.description",
            IsPrescriptionRequired: "$product.prescription",
            image: { $concat: [imgPath, { $first: "$product.pricing.image" }] },
            price: "$product.pricing.price",
            offerType: "$product.offerType",
            specialPrice: "$product.pricing.specialPrice",
            uomValue: "$uomValue.uomValue",
            discountAmount: {
              $subtract: [
                "$product.pricing.price",
                "$product.pricing.specialPrice",
              ],
            },
            discountInPercentage: {
              $multiply: [
                {
                  $divide: [
                    {
                      $subtract: [
                        "$product.pricing.price",
                        "$product.pricing.specialPrice",
                      ],
                    },
                    "$product.pricing.price",
                  ],
                },
                100,
              ],
            },
          },
        },
        { $addFields: { outOfStock: false } },
      ]);

      //get all out of stock product

      const outOfStockProducts = [];

      for (const product of products) {
        //check if stock is available

        const { stockAvailable } =
          (await checkIfStockAvailable({
            variantId: product.variantId,
            productId: product.product_id,
            quantity: product.quantity,
            userId,
          })) || {};

        if (!stockAvailable) {
          outOfStockProducts.push(product.cartId);
        }

        //discount amount

        product.discountAmountFromCoupon = 0;
      }

      //filter out of stock product it will be added to the cart later after all calculation

      products = products.filter(
        (product) => !outOfStockProducts.includes(product.cartId)
      );

      //delivery details

      const deliveryDetails = {
        isThisProductDeliverable: false,
        message: "This products are not deliverable.",
      };

      const storeDetails = {
        storeId: "",
        isThisStoreMaster: true,
        storeLevel: 0,
      };

      //check if user have address or not

      let address = await UserAddress.findOne(
        { userId, isDisabled: false },
        {
          name: 1,
          mobile: 1,
          pincode: 1,
          house: 1,
          street: 1,
          state: 1,
          landmark: 1,
          type: 1,
          isActive: 1,
        }
      ).lean();

      //check if user address pinCode is serviceable

      let serviceableStore;

      if (address && products.length) {
        serviceableStore = await Stores.findOne(
          {
            serviceablePincodes: {
              $elemMatch: { code: address.pincode, active: true },
            },
            isDisabled: false,
          },
          {
            _id: 1,
            level: 1,
            serviceablePincodes: {
              $elemMatch: { code: address.pincode, active: true },
            },
          }
        ).lean();

        if (serviceableStore) {
          serviceableStore.serviceablePincode =
            serviceableStore.serviceablePincodes[0];

          deliveryDetails.isThisProductDeliverable = true;
          deliveryDetails.message = "This products are deliverable.";

          //check if all product is available in the same level or any parent store

          let queryForCheckingProductsInStores = [];
          products.map((product) =>
            queryForCheckingProductsInStores.push({
              $and: [
                { productId: mongoose.Types.ObjectId(product.product_id) },
                { stock: { $gte: product.quantity } },
                { varientId: mongoose.Types.ObjectId(product.variantId) },
              ],
            })
          );

          let stopLoop = false;
          let storeIdToCheckProduct = serviceableStore._id;
          let loopCount = 0;
          let storeProductsData;
          while (!stopLoop) {
            storeProductsData = await storeProducts.aggregate([
              {
                $match: {
                  storeId: storeIdToCheckProduct,
                  $or: queryForCheckingProductsInStores,
                },
              },
              {
                $lookup: {
                  from: "stores",
                  localField: "storeId",
                  foreignField: "_id",
                  as: "store",
                },
              },
              {
                $unwind: "$store",
              },
              {
                $project: {
                  _id: 0,
                  storeId: 1,
                  product_id: "$productId",
                  variantId: "$varientId",
                  stock: 1,
                  price: 1,
                  specialPrice: 1,
                  discountAmount: { $subtract: ["$price", "$specialPrice"] },
                  discountInPercentage: {
                    $multiply: [
                      {
                        $divide: [
                          { $subtract: ["$price", "$specialPrice"] },
                          "$price",
                        ],
                      },
                      100,
                    ],
                  },
                  isThisMasterStore: "$store.masterStore",
                  parentStoreId: "$store.parent",
                  level: "$store.level",
                },
              },
            ]);

            if (
              products.length === storeProductsData.length ||
              storeProductsData[0]?.level - 1 === 0
            ) {
              stopLoop = true;
            }

            storeIdToCheckProduct = storeProductsData.parentStoreId;

            loopCount++;
            if (loopCount >= 2) {
              break;
            }
          }

          //if products length and storeProductsData length is equal which means a store other than master have all the products this user cart have

          if (products.length === storeProductsData.length) {
            storeDetails.isThisStoreMaster = false;
            storeDetails.storeLevel = storeProductsData[0]?.level;
            storeDetails.storeId = storeProductsData[0]?.storeId;

            storeProductsData.map((storeProduct) => {
              products.map((product) => {
                if (
                  product.product_id.toString() ==
                    storeProduct.product_id.toString() &&
                  product.variantId.toString() ==
                    storeProduct.variantId.toString()
                ) {
                  product.price = storeProduct.price;
                  product.specialPrice = storeProduct.specialPrice;
                  product.discountAmount = storeProduct.discountAmount;
                  product.discountInPercentage =
                    storeProduct.discountInPercentage;
                }
              });
            });
          } else {
            //get master store id
            const { _id: masterStoreId } =
              (await Stores.findOne(
                { masterStore: true, isDisabled: false },
                { _id: 1 }
              )) || {};

            storeDetails.isThisStoreMaster = true;
            storeDetails.storeLevel = 0;
            storeDetails.storeId = masterStoreId;
          }
        } else {
          deliveryDetails.isThisProductDeliverable = false;
          deliveryDetails.message = `This products are not deliverable for ${address.pincode}.`;
        }
      } else if (!products.length) {
        deliveryDetails.isThisProductDeliverable = false;
        deliveryDetails.message = `Please add products to your cart.`;
      } else {
        deliveryDetails.isThisProductDeliverable = false;
        deliveryDetails.message = `Please add address to see if the products are deliverable .`;
      }

      let cartDetails = {
        totalCartValue: 0,
        totalRealCartValue: 0,
        totalDiscountAmount: 0,
        deliveryCharge: 0,
        deliveryTime: 0,
        deliveryDate: "",
        medCoinRedeemed: 0,
        memberDiscount: 0,
        donationAmount: 0,
        couponAppliedDiscount: 0,
        totalCountOfProductsThatRequirePrescription: 0,
        isThisCartIsEligibleForPurchase: true,
        isThisCartEligibleForFreeDelivery: false,
        totalDiscountInPercentage: 0,
        totalAmountToBePaid: 0,
        cashOnDelivery: false,
        totalCartItemsCount: 0,
        whishListCount: 0,
        userHasMedCoins: true,
        isPrescriptionProvided: false,
        minFreeDeliveryAmount: 0,
        minimumPurchaseAmount: 0,
        freeDeliveryProvidedByPremiumBenefit: false,
      };

      let prescriptionResult = await Prescription.findOne({
        userId: userId,
        active: true,
      });
      if (prescriptionResult?.prescription?.length) {
        cartDetails.isPrescriptionProvided = true;
      }

      //check if pin code is eligible for cash on delivery
      if (serviceableStore?.serviceablePincode?.cashOnDelivery) {
        cartDetails.cashOnDelivery = true;
      }

      const {
        minPurchaseAmount = 0,
        minFreeDeliveryAmount = 0,
        maxMedcoinUse = 0,
      } = (await MasterPreference.findOne(
        { isDisabled: false },
        { minPurchaseAmount: 1, minFreeDeliveryAmount: 1, maxMedcoinUse: 1 }
      )) || {};

      cartDetails.minFreeDeliveryAmount = minFreeDeliveryAmount;
      cartDetails.minimumPurchaseAmount = minPurchaseAmount;

      //apply default med coin to user if he have med coin and not applied any and have products

      //check if user has med coin or not

      let { medCoin } =
        (await User.findOne({ _id: userId }, { medCoin: 1 })) || {};

      //check users available med coin balance if it is zero or does not exit set isUserHasAnyMedCoin to false
      if (!medCoin) {
        cartDetails.userHasMedCoins = false;
      }

      //set default med coin redeem

      let applicableMedCoin = 0;

      if (medCoin && medCoin > 0) {
        if (medCoin > maxMedcoinUse) {
          applicableMedCoin = maxMedcoinUse;
        } else {
          applicableMedCoin = medCoin;
        }
      }

      let appliedMedCoin = await UserAppliedMedCoins.findOne({
        userId,
        isMedCoinApplied: true,
      });

      //if there is not applied med coin apply med coin

      if (products.length) {
        if (!appliedMedCoin) {
          await new UserAppliedMedCoins({
            userId,
            medCoinCount: applicableMedCoin,
            isMedCoinApplied: true,
          }).save();

          cartDetails.medCoinRedeemed = applicableMedCoin;
        } else {
          //if med coin applied is greater than med coin applicable change it back to applicable

          if (appliedMedCoin.medCoinCount > applicableMedCoin) {
            cartDetails.medCoinRedeemed = applicableMedCoin;

            //update applicable med coin

            await UserAppliedMedCoins.updateOne(
              { _id: appliedMedCoin._id },
              {
                medCoinCount: applicableMedCoin,
              }
            );
          } else {
            cartDetails.medCoinRedeemed = appliedMedCoin.medCoinCount;
          }
        }
      }
      //if there is no product in the cart remove med coin

      if (!products.length && appliedMedCoin) {
        await UserAppliedMedCoins.deleteOne({ _id: appliedMedCoin._id });

        cartDetails.medCoinRedeemed = 0;
      }

      //coupon applied discount for med cart
      let userAppliedCoupon = await UserAppliedCoupons.aggregate([
        {
          $match: { userId, isCouponApplied: true, couponType: "Medimall" },
        },
        {
          $lookup: {
            from: "coupons",
            localField: "couponId",
            foreignField: "_id",
            as: "coupon",
          },
        },
        {
          $unwind: "$coupon",
        },
        {
          $project: {
            couponId: 1,
            couponType: 1,
            category: "$coupon.category",
            purchaseAmount: "$coupon.purchaseAmount",
            percentage: "$coupon.percentage",
            maximumAmount: "$coupon.maximumAmount",
            to: "$coupon.to",
            code: "$coupon.code",
            name: "$coupon.name",
          },
        },
      ]);

      userAppliedCoupon = userAppliedCoupon[0];

      //remove coupon from the cart if there is no product to apply that coupon or if coupon expired or med coin is applied or no product exist in the cart

      if (userAppliedCoupon) {
        if (
          !products.some(
            (product) => product.type === userAppliedCoupon.category
          ) ||
          new Date().getTime() > new Date(userAppliedCoupon.to).getTime() ||
          cartDetails.medCoinRedeemed > 0 ||
          !products.length
        ) {
          await doRemoveCouponFromTheCart(userId, {
            couponId: userAppliedCoupon?.couponId,
          });
          userAppliedCoupon = null;
        }
      }

      //if user applied med coin do not allow to add coupon remove it from cart

      products.map((product) => {
        cartDetails.totalCartValue += product.specialPrice * product.quantity;
        cartDetails.totalDiscountAmount +=
          product.discountAmount * product.quantity;
        cartDetails.totalRealCartValue += product.price * product.quantity;
        //if product require prescription increase it's count
        if (product.IsPrescriptionRequired)
          cartDetails.totalCountOfProductsThatRequirePrescription++;
        //if product have a offer type which means it is not eligible for any other kind of discount or offers
        if (product.offerType) {
        }

        if (userAppliedCoupon) {
          if (product.type === userAppliedCoupon.category) {
            //get percentage of discount and increase coupon discount until it hit maximum limit

            const discountAmount =
              (userAppliedCoupon.percentage / 100) *
              (product.specialPrice * product.quantity);

            if (
              cartDetails.couponAppliedDiscount + discountAmount <
              userAppliedCoupon.maximumAmount
            ) {
              cartDetails.couponAppliedDiscount += discountAmount;
              product.discountAmountFromCoupon = discountAmount;
            } else {
              cartDetails.couponAppliedDiscount =
                userAppliedCoupon.maximumAmount;
            }
          }
        }
      });

      //get minimum purchase amount and min free delivery amount and set if this product is eligible for purchase and eligible for free delivery
      if (cartDetails.totalCartValue < minPurchaseAmount)
        cartDetails.isThisCartIsEligibleForPurchase = false;
      if (cartDetails.totalCartValue >= minFreeDeliveryAmount)
        cartDetails.isThisCartEligibleForFreeDelivery = true;

      //check if user is minimum purchase amount is equal or greater than the purchase amount apply this coupon
      if (userAppliedCoupon) {
        if (cartDetails.totalCartValue < userAppliedCoupon.purchaseAmount) {
          cartDetails.couponAppliedDiscount = 0;
          await doRemoveCouponFromTheCart(userId, {
            couponId: userAppliedCoupon?.couponId,
          });
          userAppliedCoupon = null;
        }
      }

      //decide total amount to be paid deducting all discounts , coupon, medCoin, and member discount
      if (products.length) {
        cartDetails.totalAmountToBePaid =
          cartDetails.totalCartValue -
          cartDetails.memberDiscount -
          cartDetails.medCoinRedeemed -
          cartDetails.couponAppliedDiscount;
      }

      //add coupon discount to total discount amount

      cartDetails.totalDiscountAmount += cartDetails.couponAppliedDiscount;

      //add medCoin Redeemed to total discount amount
      cartDetails.totalDiscountAmount += cartDetails.medCoinRedeemed;

      cartDetails.totalDiscountInPercentage =
        (cartDetails.totalDiscountAmount / cartDetails.totalRealCartValue) *
        100;

      if (!cartDetails.totalDiscountInPercentage)
        cartDetails.totalDiscountInPercentage = 0;

      //calculate delivery charge and time

      let deliveryChargeAndTimes = await MasterDeliveryChargeTime.find(
        { isDisabled: false },
        {
          level: 1,
          DeliveryTime: 1,
          charge: 1,
        }
      );

      if (deliveryChargeAndTimes.length && serviceableStore) {
        const userStoreLevel = serviceableStore.level;
        const productStoreLevel = storeDetails.storeLevel;

        const checkDeliveryChargeAndTimeAndChange = (levelName) => {
          const ruleForThisLevel = deliveryChargeAndTimes.filter(
            (rules) => rules.level === levelName
          );

          if (ruleForThisLevel.length) {
            cartDetails.deliveryCharge = ruleForThisLevel[0].charge;
            cartDetails.deliveryTime = ruleForThisLevel[0].DeliveryTime;
          } else {
            cartDetails.deliveryCharge = 0;
            cartDetails.deliveryTime = "0 hr";
          }
        };

        //if same level store

        if (userStoreLevel === productStoreLevel) {
          checkDeliveryChargeAndTimeAndChange("Same Level");
        } else if (userStoreLevel === 3 && productStoreLevel === 2) {
          checkDeliveryChargeAndTimeAndChange("Sub sub store to sub store");
        } else if (userStoreLevel === 3 && productStoreLevel === 1) {
          checkDeliveryChargeAndTimeAndChange("Sub sub store to sub store");
        } else if (userStoreLevel === 2 && productStoreLevel === 1) {
          checkDeliveryChargeAndTimeAndChange("Sub store to store");
        } else {
          checkDeliveryChargeAndTimeAndChange("Any store to main store");
        }
      }

      //if free deliver is available deduct that amount from amount to be paid
      if (!cartDetails.isThisCartEligibleForFreeDelivery) {
        cartDetails.totalAmountToBePaid =
          cartDetails.totalAmountToBePaid + cartDetails.deliveryCharge;
      }

      //hand pick
      const handPicks = await AdsCartHandpick.aggregate([
        {
          $match: {
            sliderType: "handpick",
            isDisabled: false,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "typeId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $addFields: { pricing: { $first: "$product.pricing" } },
        },
        //brand

        {
          $lookup: {
            from: "masterbrands",
            localField: "product.brand",
            foreignField: "_id",
            as: "brand",
          },
        },

        {
          $unwind: {
            path: "$brand",
            preserveNullAndEmptyArrays: true,
          },
        },

        //uom value
        {
          $lookup: {
            from: "masteruomvalues",
            localField: "product.pricing.sku",
            foreignField: "_id",
            as: "uomValue",
          },
        },

        {
          $unwind: {
            path: "$uomValue",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 0,
            sliderType: 1,
            variantId: "$pricing._id",
            product_id: "$product._id",
            productName: "$product.name",
            uomValue: "$uomValue.uomValue",
            brandName: "$brand.title",
            IsPrescriptionRequired: "$product.prescription",
            image: { $concat: [imgPath, { $first: "$pricing.image" }] },
            price: "$pricing.price",
            specialPrice: "$pricing.specialPrice",
            discountAmount: {
              $subtract: ["$pricing.price", "$pricing.specialPrice"],
            },
            discountInPercentage: {
              $multiply: [
                {
                  $divide: [
                    { $subtract: ["$pricing.price", "$pricing.specialPrice"] },
                    "$pricing.price",
                  ],
                },
                100,
              ],
            },
          },
        },
      ]);

      for (const handpick of handPicks) {
        const { stockAvailable } =
          (await checkIfStockAvailable({
            variantId: handpick.variantId,
            productId: handpick.product_id,
            quantity: 1,
            userId,
          })) || {};

        if (!stockAvailable) {
          handpick.outOfStock = true;
        } else {
          handpick.outOfStock = false;
        }
      }

      handPicks.forEach((handPick) => {
        if (!handPick.IsPrescriptionRequired) {
          handPick.IsPrescriptionRequired = false;
        }
        if (!handPick.image) {
          handPick.image = "";
        }
        if (!handPick.discountAmount) {
          handPick.discountAmount = 0;
        }
        if (!handPick.discountInPercentage) {
          handPick.discountInPercentage = 0;
        }
        if (!handPick.variantId) {
          handPick.variantId = "";
        }
        if (!handPick.product_id) {
          handPick.product_id = "";
        }
        if (!handPick.productName) {
          handPick.productName = "";
        }
        if (!handPick.price) {
          handPick.price = 0;
        }
        if (!handPick.specialPrice) {
          handPick.specialPrice = 0;
        }

        //round handpick discount percentage

        handPick.discountInPercentage = Math.round(
          handPick.discountInPercentage
        );
      });

      const banner = await adsAd1Subscription.aggregate([
        {
          $match: {
            type: "ad1",
          },
        },
        { $project: { image: { $concat: [imgPath, "$image"] }, _id: 0 } },
      ]);
      const subscriptionAd = await adsAd1Subscription.aggregate([
        {
          $match: {
            type: "subscription",
          },
        },
        { $project: { image: { $concat: [imgPath, "$image"] }, _id: 0 } },
      ]);

      if (!userAppliedCoupon) {
        userAppliedCoupon = {};
      }

      //available coupons in med cart

      const availableMedCartCoupons = await coupons.aggregate([
        {
          $match: {
            customerType,
            type: "Medimall",
            $and: [
              { from: { $lte: new Date() } },
              { to: { $gte: new Date() } },
            ],
            isDisabled: false,
          },
        },

        {
          $project: {
            image: { $concat: [process.env.BASE_URL, "$image"] },
            _id: 1,
            name: 1,
            code: 1,
            from: 1,
            to: 1,
            percentage: 1,
            termsAndCondition: 1,
          },
        },
      ]);

      availableMedCartCoupons.forEach((coupon) => {
        coupon.termsAndCondition = extractTextFromHTMLElement(
          coupon.termsAndCondition
        );
      });

      //check for donation value if not add

      let donation = await UserAppliedDonation.findOne({
        userId,
        isDonationApplied: true,
      });

      // if there is no applied donation add default donation

      if (!donation) {
        const addedDonation = await new UserAppliedDonation({
          userId,
        }).save();

        donation = addedDonation;
      }

      //add donation amount to cart details and increment total amount to be paid

      cartDetails.donationAmount = donation.donationAmount;
      cartDetails.totalAmountToBePaid += cartDetails.donationAmount;

      //get whish list count and add it to cart details

      let wishListCount = await InventoryFavourite.countDocuments({
        userId,
        isDisabled: false,
      });

      cartDetails.whishListCount = wishListCount;

      //set delivery time and delivery date

      if (cartDetails.deliveryTime) {
        const { deliveryTime, deliveryDate } =
          calculateDeliveryTimeAndDeliveryDateByHours(
            parseInt(cartDetails.deliveryTime)
          );

        cartDetails.deliveryTime = deliveryTime;
        cartDetails.deliveryDate = moment(
          deliveryDate,
          "YYYY-MM-DD HH:MM:SS"
        ).format("MMM DD, YYYY hh:mm:a");
      }

      //check if user is a premium user if he is provide premium benefits

      const premiumUser = await PremiumUser.findOne({ userId, expired: false });

      if (premiumUser) {
        //get user benefits

        let premiumBenefits = await UserMembershipBenefits.findOne({
          premiumUserId: premiumUser._id,
        });

        if (!premiumBenefits) {
          premiumBenefits = {};

          premiumBenefits.miniMumOffer = 0;
          premiumBenefits.cashBack = 0;
        }

        let discount =
          (premiumBenefits.cashBack * cartDetails.totalCartValue) / 100;

        cartDetails.memberDiscount = discount;

        //deduct member discount from amount to be paid

        if (Number.isNaN(cartDetails.memberDiscount)) {
          cartDetails.memberDiscount = 0;
        }
        cartDetails.totalAmountToBePaid -= cartDetails.memberDiscount;

        //check if free delivery already provided if not check how many free he have left if it is greater than 0
        //give user free delivery

        if (
          !cartDetails.isThisCartEligibleForFreeDelivery &&
          premiumBenefits.freeDelivery > 0
        ) {
          cartDetails.isThisCartEligibleForFreeDelivery = true;
          cartDetails.freeDeliveryProvidedByPremiumBenefit = true;
          cartDetails.totalAmountToBePaid -= cartDetails.deliveryCharge;
        }
      }

      //subscription cart details

      const subscriptionCartDetails = { ...cartDetails };
      //remove discount from total discount
      subscriptionCartDetails.couponAppliedDiscount = 0;
      subscriptionCartDetails.totalDiscountAmount -=
        cartDetails.couponAppliedDiscount;

      //increase the amount to be paid by discounted amount

      subscriptionCartDetails.totalAmountToBePaid +=
        cartDetails.couponAppliedDiscount;

      //set discount percentage to zero

      subscriptionCartDetails.totalDiscountInPercentage = 0;

      //check if user applied a subscription coupon

      let userAppliedSubscriptionCoupon = await UserAppliedCoupons.aggregate([
        {
          $match: { userId, isCouponApplied: true, couponType: "Subscription" },
        },
        {
          $lookup: {
            from: "coupons",
            localField: "couponId",
            foreignField: "_id",
            as: "coupon",
          },
        },
        {
          $unwind: "$coupon",
        },
        {
          $project: {
            couponId: 1,
            couponType: 1,
            category: "$coupon.category",
            purchaseAmount: "$coupon.purchaseAmount",
            percentage: "$coupon.percentage",
            maximumAmount: "$coupon.maximumAmount",
            to: "$coupon.to",
            code: "$coupon.code",
            name: "$coupon.name",
          },
        },
      ]);

      userAppliedSubscriptionCoupon = userAppliedSubscriptionCoupon[0];

      //if user does not apply any coupon and there is no med coin redeemed  add a random coupon

      if (
        !userAppliedSubscriptionCoupon &&
        products.length &&
        cartDetails.medCoinRedeemed === 0
      ) {
        //check if already a default coupon applied and removed by user

        let defaultAppliedSubscriptionCoupon =
          await DefaultAppliedSubscriptionCoupon.findOne({
            userId,
            defaultAppliedSubscriptionCoupon: true,
          });

        if (!defaultAppliedSubscriptionCoupon) {
          //find coupon

          userAppliedSubscriptionCoupon = await coupons
            .findOne(
              {
                customerType,
                isDisabled: false,
                category: products[0]?.type,
                type: "Subscription",
                from: { $lte: new Date() },
                to: { $gte: new Date() },
                purchaseAmount: { $lte: cartDetails.totalCartValue },
              },
              {
                _id: 1,
                type: 1,
                category: 1,
                purchaseAmount: 1,
                maximumAmount: 1,
                to: 1,
                code: 1,
                name: 1,
                totalTimesUsed: 1,
                maximumUser: 1,
                numberPerUser: 1,
              }
            )
            .lean();

          if (userAppliedSubscriptionCoupon) {
            userAppliedSubscriptionCoupon.couponId =
              userAppliedSubscriptionCoupon._id;
            userAppliedSubscriptionCoupon.couponType =
              userAppliedSubscriptionCoupon.type;

            //apply coupon

            //check coupon total used count and maximum allowed per a user and maximum count for all user

            const numberOfTimesUserAppliedThisCoupon =
              await UserAppliedCoupons.find({
                userId,
                couponType: userAppliedSubscriptionCoupon.type,
                couponId: userAppliedSubscriptionCoupon._id,
              }).countDocuments();

            if (
              userAppliedSubscriptionCoupon.totalTimesUsed >=
                userAppliedSubscriptionCoupon.maximumUser ||
              numberOfTimesUserAppliedThisCoupon >=
                userAppliedSubscriptionCoupon.numberPerUser
            ) {
              userAppliedSubscriptionCoupon = null;
            }

            //if still there is a applied coupon save to db

            if (userAppliedSubscriptionCoupon) {
              //save new applied coupon
              await new UserAppliedCoupons({
                userId,
                couponType: userAppliedSubscriptionCoupon.type,
                couponId: userAppliedSubscriptionCoupon._id,
              }).save();

              //increment count of times this coupon is used

              await coupons.updateOne(
                { _id: userAppliedSubscriptionCoupon._id },
                { $inc: { totalTimesUsed: 1 } }
              );
            }

            //add default applied coupon
            await new DefaultAppliedSubscriptionCoupon({ userId }).save();

            if (userAppliedSubscriptionCoupon) {
              delete userAppliedSubscriptionCoupon._id;
              delete userAppliedSubscriptionCoupon.type;
              delete userAppliedSubscriptionCoupon.totalTimesUsed;
              delete userAppliedSubscriptionCoupon.maximumUser;
              delete userAppliedSubscriptionCoupon.numberPerUser;
            }
          }
        }
      }

      //remove subscription coupon from the cart if there is no product to apply that coupon or if coupon expired

      if (userAppliedSubscriptionCoupon) {
        if (
          !products.some(
            (product) => product.type === userAppliedSubscriptionCoupon.category
          ) ||
          new Date().getTime() >
            new Date(userAppliedSubscriptionCoupon.to).getTime() ||
          cartDetails.medCoinRedeemed > 0 ||
          !products.length
        ) {
          await doRemoveCouponFromTheCart(userId, {
            couponId: userAppliedSubscriptionCoupon?.couponId,
          });

          userAppliedSubscriptionCoupon = null;
        }
      }

      //check if user  minimum purchase amount is equal or greater than the purchase amount apply this coupon
      if (userAppliedSubscriptionCoupon) {
        if (
          subscriptionCartDetails.totalCartValue <=
          userAppliedSubscriptionCoupon.purchaseAmount
        ) {
          subscriptionCartDetails.couponAppliedDiscount = 0;

          await doRemoveCouponFromTheCart(userId, {
            couponId: userAppliedSubscriptionCoupon?.couponId,
          });

          userAppliedSubscriptionCoupon = null;
        }
      }

      //add subscription discount
      if (userAppliedSubscriptionCoupon) {
        products.map((product) => {
          if (userAppliedSubscriptionCoupon) {
            if (product.type === userAppliedSubscriptionCoupon.category) {
              //get percentage of discount and increase coupon discount until it hit maximum limit

              const discountAmount =
                (userAppliedSubscriptionCoupon.percentage / 100) *
                (product.specialPrice * product.quantity);

              if (
                subscriptionCartDetails.couponAppliedDiscount + discountAmount <
                userAppliedSubscriptionCoupon.maximumAmount
              ) {
                subscriptionCartDetails.couponAppliedDiscount += discountAmount;
              } else {
                subscriptionCartDetails.couponAppliedDiscount =
                  userAppliedSubscriptionCoupon.maximumAmount;
              }
            }
          }
        });
      }

      //if there is a coupon discount increment total discount amount decrement amount to be paid

      if (subscriptionCartDetails.couponAppliedDiscount) {
        subscriptionCartDetails.totalDiscountAmount +=
          subscriptionCartDetails.couponAppliedDiscount;
        subscriptionCartDetails.totalAmountToBePaid -=
          subscriptionCartDetails.couponAppliedDiscount;
      }

      //set discount percentage of subscription cart
      subscriptionCartDetails.totalDiscountInPercentage =
        (subscriptionCartDetails.totalDiscountAmount /
          subscriptionCartDetails.totalRealCartValue) *
        100;

      if (!userAppliedSubscriptionCoupon) {
        userAppliedSubscriptionCoupon = {};
      }
      let preference = await MasterPreference.findOne(
        {},
        {
          prescription: 1,
        }
      );
      let orderReview = await ad1Subscription.find(
        { type: "orderreview2", isDisabled: false },
        {
          type: 1,
          image: { $concat: [process.env.BASE_URL, "$image"] },
        }
      );

      //add whole address as a key

      if (address) {
        address.wholeAddress = `${address.house}, ${address.street}, ${address.landmark}, ${address.state}, ${address.pincode}`;
      }

      if (!address) address = {};

      //available subscription coupons

      const availableSubscriptionCoupons = await coupons.aggregate([
        {
          $match: {
            customerType,
            type: "Subscription",
            $and: [
              { from: { $lte: new Date() } },
              { to: { $gte: new Date() } },
            ],
            isDisabled: false,
          },
        },

        {
          $project: {
            image: { $concat: [process.env.BASE_URL, "$image"] },
            _id: 1,
            name: 1,
            code: 1,
            from: 1,
            to: 1,
            percentage: 1,
            termsAndCondition: 1,
          },
        },
      ]);

      availableSubscriptionCoupons.forEach((coupon) => {
        coupon.termsAndCondition = extractTextFromHTMLElement(
          coupon.termsAndCondition
        );
      });

      //check if all the products in the cart included in the current product list if not
      // it is because of either variant is deleted or product is disabled

      const originalProductCount = await cart.countDocuments({ userId });

      if (originalProductCount !== products.length) {
        const allProducts = await cart.aggregate([
          //get all cart based on user  id
          {
            $match: {
              userId: mongoose.Types.ObjectId(userId),
            },
          },
          //get all product added to cart from products collection based on product id saved
          {
            $lookup: {
              from: "products",
              localField: "product_id",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $unwind: "$product",
          },
          {
            $lookup: {
              from: "masterbrands",
              localField: "product.brand",
              foreignField: "_id",
              as: "brand",
            },
          },

          {
            $unwind: {
              path: "$brand",
              preserveNullAndEmptyArrays: true,
            },
          },

          //uom value
          {
            $lookup: {
              from: "masteruomvalues",
              localField: "variantDetails.sku",
              foreignField: "_id",
              as: "uomValue",
            },
          },

          {
            $unwind: {
              path: "$uomValue",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $project: {
              cartId: "$_id",
              outOfStock: "true",
              brandName: "$brand.title",
              variantId: "$variantId",
              product_id: "$product._id",
              quantity: 1,
              productName: "$product.name",
              type: "$product.type",
              description: "$product.content",
              offerType: "$product.offerType",
              IsPrescriptionRequired: "$product.prescription",
              image: {
                $concat: [imgPath, { $first: "$variantDetails.image" }],
              },
              price: "$variantDetails.price",
              uomValue: "$uomValue.uomValue",
              specialPrice: "$variantDetails.specialPrice",
              discountAmount: {
                $subtract: [
                  "$variantDetails.price",
                  "$variantDetails.specialPrice",
                ],
              },
              discountInPercentage: {
                $multiply: [
                  {
                    $divide: [
                      {
                        $subtract: [
                          "$variantDetails.price",
                          "$variantDetails.specialPrice",
                        ],
                      },
                      "$variantDetails.price",
                    ],
                  },
                  100,
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
            },
          },
          { $addFields: { outOfStock: true } },
        ]);

        //add products to the cart that are out of stock

        allProducts.map((product) => {
          let productExist = _.find(products, {
            cartId: mongoose.Types.ObjectId(product.cartId),
          });
          if (!productExist) {
            products.push(product);
          }
        });
      }

      //check if products are added to whish list

      if (products.length) {
        const queryToGetWhishListAddedProducts = products.map((product) => ({
          $and: [
            { productId: mongoose.Types.ObjectId(product.product_id) },
            { productUomId: mongoose.Types.ObjectId(product.variantId) },
          ],
        }));

        const productsInWhishList = await InventoryFavourite.find({
          userId,
          isDisabled: false,
          $or: queryToGetWhishListAddedProducts,
        });

        productsInWhishList.forEach((productInWhishList) => {
          products.forEach((product) => {
            if (
              product.product_id.toString() ===
                productInWhishList.productId.toString() &&
              product.variantId.toString() ===
                productInWhishList.productUomId.toString()
            ) {
              product.isThisProductAddedToWhishList = true;
            }
          });
        });
      }

      //if prescription required is null set it to false and isThisProductAddedToWhishList
      products.forEach((product) => {
        if (!product.IsPrescriptionRequired) {
          product.IsPrescriptionRequired = false;
        }
        if (!product.isThisProductAddedToWhishList) {
          product.isThisProductAddedToWhishList = false;
        }

        product.discountInPercentage = Math.round(product.discountInPercentage);
        product.discountAmount = Math.round(product.discountAmount);
      });

      //cart length

      cartDetails.totalCartItemsCount = products.length;
      subscriptionCartDetails.totalCartItemsCount = products.length;

      //cart details discount percentage and  subscription discount percentage round
      cartDetails.totalDiscountInPercentage = Math.round(
        cartDetails.totalDiscountInPercentage
      );

      subscriptionCartDetails.totalDiscountInPercentage = Math.round(
        subscriptionCartDetails.totalDiscountInPercentage
      );

      //add total amount pay on next delivery in subscription cart details

      subscriptionCartDetails.totalAmountToPayOnNextDelivery =
        subscriptionCartDetails.totalAmountToBePaid -
        subscriptionCartDetails.medCoinRedeemed +
        subscriptionCartDetails.memberDiscount +
        subscriptionCartDetails.couponAppliedDiscount -
        subscriptionCartDetails.donationAmount;

      //update applied coupons discount amount

      if (userAppliedCoupon) {
        await UserAppliedCoupons.updateOne(
          {
            _id: userAppliedCoupon._id,
          },
          {
            discountAmount: cartDetails.couponAppliedDiscount,
          }
        );
      }

      if (userAppliedSubscriptionCoupon) {
        await UserAppliedCoupons.updateOne(
          {
            _id: userAppliedSubscriptionCoupon._id,
          },
          {
            discountAmount: subscriptionCartDetails.couponAppliedDiscount,
          }
        );
      }

      return resolve({
        status: true,
        message: "Cart found.",
        data: [
          {
            medCart: {
              products,
              cartDetails,
              handPicks,
              banner: banner[0],
              address,
              deliveryDetails,
              storeDetails,
              userAppliedCoupon,
              prescriptionEnable: preference.prescription,
              orderReview,
              availableCoupons: availableMedCartCoupons,
            },
          },
          {
            subscriptionCart: {
              products,
              cartDetails: subscriptionCartDetails,
              subscriptionAd: subscriptionAd[0],
              address,
              deliveryDetails,
              storeDetails,
              userAppliedCoupon: userAppliedSubscriptionCoupon,
              prescriptionEnable: preference.prescription,
              availableCoupons: availableSubscriptionCoupons,
            },
          },
        ],
      });
    } catch (error) {
      return reject(error);
    }
  });
};

const doApplyACouponToTheCart = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    const customerType = "normal";

    //validate incoming data
    const dataValidation = await validateApplyACouponToCart(data);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return resolve({
        error: true,
        message: message,
        statusCode: 200,
      });
    }

    let { couponCode, couponType } = data;

    if (couponType === "medimall") {
      couponType = "Medimall";
    }

    if (couponType === "subscription") {
      couponType = "Subscription";
    }
    //check if this coupon code is valid and not expired or not yet active

    const coupon = await coupons.findOne(
      {
        code: couponCode,
        customerType,
        isDisabled: false,
        type: couponType,
        from: { $lte: new Date() },
        to: { $gte: new Date() },
        $or: [{ type: "Medimall" }, { type: "Subscription" }],
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
      return resolve({
        error: true,
        message: "Invalid coupon.",
        statusCode: 200,
      });
    }

    //check coupon total used count and maximum allowed per a user and maximum count for all user

    const numberOfTimesUserAppliedThisCoupon = await UserAppliedCoupons.find({
      userId,
      couponType,
      couponId: coupon._id,
    }).countDocuments();

    if (
      coupon.totalTimesUsed >= coupon.maximumUser ||
      numberOfTimesUserAppliedThisCoupon >= coupon.numberPerUser
    ) {
      return resolve({
        error: true,
        message: "Coupon usage limit has been reached.",
        statusCode: 200,
      });
    }

    //only allow a user to apply one coupon at a time
    const existingAppliedCoupon = await UserAppliedCoupons.findOne({
      userId,
      couponType,
      isCouponApplied: true,
    });

    if (existingAppliedCoupon) {
      return resolve({
        error: true,
        message: "Please remove your applied coupon to add another one.",
        statusCode: 200,
      });
    }

    //TODO:
    //check promotion type

    //check cart if any of the added product is eligible for using this coupon
    let cartResponse = await doGetMedCartWeb(userId);
    let productsInTheCart = cartResponse?.data[0]?.medCart?.products;
    let cartDetails = cartResponse?.data[0]?.medCart?.cartDetails;

    //check if med coin is redeemed

    if (cartDetails.medCoinRedeemed) {
      return resolve({
        error: true,
        message: "Please remove your med coin to apply coupon.",
        statusCode: 200,
      });
    }

    //if there is no product in the cart
    if (!productsInTheCart.length) {
      return resolve({
        error: true,
        message: "Please add some products to your cart to apply coupon.",
        statusCode: 200,
      });
    }

    if (cartDetails?.totalCartValue < coupon.purchaseAmount) {
      return resolve({
        error: true,
        message: `Minimum purchase amount to apply this coupon is ${coupon.purchaseAmount} rs.`,
        statusCode: 200,
      });
    }

    if (
      !productsInTheCart.some((product) => product.type === coupon.category)
    ) {
      return resolve({
        error: true,
        message: `You can only apply this coupon to ${coupon.category} products. Please add some ${coupon.category} products to your cart to use this coupon.`,
        statusCode: 200,
      });
    }

    //save new applied coupon
    let couponDocument = await new UserAppliedCoupons({
      userId,
      couponType,
      couponId: coupon._id,
    }).save();

    //update applied discount amount

    let discountAmount;

    let cartAfterApplyingCoupon = await doGetMedCartWeb(userId);

    const medMallDiscountAmount =
      cartAfterApplyingCoupon?.data[0]?.medCart?.cartDetails
        ?.couponAppliedDiscount;
    const subscriptionDiscountAmount =
      cartAfterApplyingCoupon?.data[0]?.subscriptionCart?.cartDetails
        ?.couponAppliedDiscount;

    if (couponType === "medimall") {
      discountAmount = medMallDiscountAmount;
    } else {
      discountAmount = subscriptionDiscountAmount;
    }

    await UserAppliedCoupons.updateOne(
      {
        _id: couponDocument._id,
      },
      {
        discountAmount,
      }
    );

    //increment count of times this coupon is used

    await coupons.updateOne(
      { _id: coupon._id },
      { $inc: { totalTimesUsed: 1 } }
    );

    return resolve({
      error: false,
      message: "Coupon applied successfully.",
      statusCode: 200,
    });
  });
};

const doApplyMedCoinToTheCart = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //validate incoming data
      const dataValidation = await validateEditAppliedMedCoin(data);
      if (dataValidation.error) {
        const message = dataValidation.error.details[0].message.replace(
          /"/g,
          ""
        );
        return resolve({
          error: true,
          message: message,
        });
      }

      let { medCoinCount } = data;

      //check if user have any product in the cart

      let cartResponse = await doGetMedCartWeb(userId);
      let productsInTheCart = cartResponse?.data[0]?.medCart?.products;

      //if there is no product in the cart
      if (!productsInTheCart.length) {
        return resolve({
          error: true,
          message: "Please add some products to your cart to apply med coin.",
        });
      }

      if (medCoinCount > 0) {
        //check if user have any coupon applied
        const appliedCoupon = await UserAppliedCoupons.findOne({
          userId,
          isCouponApplied: true,
        });

        if (appliedCoupon) {
          return resolve({
            error: true,
            message: `Please remove applied coupons to apply med coin.`,
          });
        }
      }

      //check if user have enough med coin to apply

      //check if user has med coin or not

      let { medCoin } =
        (await User.findOne({ _id: userId }, { medCoin: 1 })) || {};

      if (!medCoin) medCoin = 0;

      if (medCoinCount > medCoin) {
        if (!medCoin) {
          return resolve({
            error: true,
            message: `You don't have any med coin to apply.`,
          });
        } else {
          return resolve({
            error: true,
            message: `You can only apply ${medCoin} med coin.`,
          });
        }
      }

      const { maxMedcoinUse = 0 } =
        (await MasterPreference.findOne(
          { isDisabled: false },
          { maxMedcoinUse: 1 }
        )) || {};

      if (medCoinCount > maxMedcoinUse) {
        return resolve({
          error: true,
          message: `You can only apply ${maxMedcoinUse} med coins.`,
        });
      }

      //check if med coin exist if not add

      const appliedMedCoin = await UserAppliedMedCoins.findOne(
        { isMedCoinApplied: true, userId },
        {
          medCoinCount,
        }
      );

      if (!appliedMedCoin) {
        //add med coin

        await new UserAppliedMedCoins({
          isMedCoinApplied: true,
          userId,
          medCoinCount,
        }).save();
      } else {
        //update med coin

        await UserAppliedMedCoins.updateOne(
          { isMedCoinApplied: true, userId },
          {
            medCoinCount,
          }
        );
      }

      return resolve({
        error: false,
        message: "Med coin updated successfully.",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const doRemoveCouponFromTheCart = (userId, { couponId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      //validate incoming data
      const dataValidation = await validateRemoveCouponFromTheCart({
        couponId,
      });
      if (dataValidation.error) {
        const message = dataValidation.error.details[0].message.replace(
          /"/g,
          ""
        );
        return resolve({
          statusCode: 200,
          error: true,
          message: message,
        });
      }

      //delete from user applied coupon
      let deleteAppliedCoupon = await UserAppliedCoupons.findOneAndDelete({
        userId,
        couponId,
        isCouponApplied: true,
      });

      if (!deleteAppliedCoupon) {
        return resolve({
          statusCode: 200,
          error: true,
          message: "Invalid applied coupon.",
        });
      }

      //decrement count of times this coupon is used

      await coupons.updateOne(
        { _id: couponId },
        { $inc: { totalTimesUsed: -1 } }
      );

      return resolve({
        statusCode: 200,
        error: false,
        message: "Applied Coupon removed successfully.",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const doRemoveCartItem = (userId, { cartId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      //validate incoming data
      const dataValidation = await validateRemoveCartItem({ cartId });
      if (dataValidation.error) {
        const message = dataValidation.error.details[0].message.replace(
          /"/g,
          ""
        );
        return resolve({
          error: true,
          message: message,
          statusCode: 200,
        });
      }

      //check if cart id is valid and delete

      const cartItemDelete = await cart.findOneAndDelete({
        _id: cartId,
        userId,
      });

      if (cartItemDelete) {
        return resolve({
          error: false,
          message: "Cart item deleted successfully.",
          statusCode: 200,
        });
      } else {
        return resolve({
          error: true,
          message: "Invalid cart item.",
          statusCode: 200,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getCartCount = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const cartItemsCount = await cart.countDocuments({ userId });

    const wishListCount = await InventoryFavourite.countDocuments({
      userId,
      isDisabled: false,
    });

    return res.json({
      status: true,
      message: "Cart items count found.",
      data: {
        cartItemsCount,
        wishListCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

const GetMedCartWeb = async (req, res, next) => {
  let { _id: userId } = req.user || {};
  await doGetMedCartWeb(userId)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      next(error);
    });
};

const checkIfStockAvailable = ({ variantId, productId, quantity, userId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check if user has address if he don't check if master have stock

      quantity = parseInt(quantity);

      const checkIfMasterHaveStock = async () => {
        const productWithStock = await product.findOne({
          _id: productId,
          isDisabled: false,
          $and: [
            {
              pricing: {
                $elemMatch: { _id: mongoose.Types.ObjectId(variantId) },
              },
            },
            { pricing: { $elemMatch: { stock: { $gte: quantity } } } },
          ],
        });

        if (productWithStock) {
          return resolve({ stockAvailable: true });
        } else {
          return resolve({ stockAvailable: false });
        }
      };

      let address = await UserAddress.findOne(
        { userId, isDisabled: false },
        {
          name: 1,
          mobile: 1,
          pincode: 1,
          house: 1,
          street: 1,
          landmark: 1,
          type: 1,
          isActive: 1,
        }
      ).lean();

      if (address) {
        let serviceableStore = await Stores.findOne({
          serviceablePincodes: {
            $elemMatch: { code: address.pincode, active: true },
          },
          isDisabled: false,
        }).lean();

        if (!serviceableStore) {
          await checkIfMasterHaveStock();
        }

        const { _id: masterStoreId } =
          (await Stores.findOne({
            masterStore: true,
            isDisabled: false,
          }).lean()) || {};

        let stopLoop = false;
        let storeIdToCheckProduct = serviceableStore._id;
        let loopCount = 0;
        let productWithStock;
        while (!stopLoop) {
          productWithStock = await storeProducts.findOne({
            storeId: mongoose.Types.ObjectId(storeIdToCheckProduct),
            productId: mongoose.Types.ObjectId(productId),
            stock: { $gte: quantity },
            varientId: mongoose.Types.ObjectId(variantId),
          });

          //get parent store

          const { parent: parentStoreId } =
            (await Stores.findOne({
              _id: mongoose.Types.ObjectId(storeIdToCheckProduct),
              isDisabled: false,
            }).lean()) || {};

          if (parentStoreId && masterStoreId) {
            if (
              productWithStock ||
              masterStoreId.toString() == parentStoreId.toString()
            ) {
              stopLoop = true;
            }
          }

          storeIdToCheckProduct = parentStoreId;

          loopCount++;
          if (loopCount >= 2) {
            break;
          }
        }

        if (productWithStock) {
          return resolve({ stockAvailable: true });
        } else {
          await checkIfMasterHaveStock();
        }
      } else {
        await checkIfMasterHaveStock();
      }
    } catch (error) {
      reject(error);
    }
  });
};

const doAddMultipleProductsToCart = (userId, products) => {
  return new Promise(async (resolve, reject) => {
    try {
      //validate incoming data
      const dataValidation = await validateMultipleProductToCart(products);
      if (dataValidation.error) {
        const message = dataValidation.error.details[0].message.replace(
          /"/g,
          ""
        );
        return resolve({
          error: true,
          message: message,
        });
      }

      products = products.products;

      //check if products are valid

      let queryToCheckProduct = products.map((product) => ({
        $and: [
          { _id: mongoose.Types.ObjectId(product.product_id) },
          {
            pricing: {
              $elemMatch: {
                _id: mongoose.Types.ObjectId(product.variantId),
              },
            },
          },
        ],
      }));

      const validProducts = await product.find({
        $or: queryToCheckProduct,
      });

      //if any of the products invalid remove it from the array before adding to db

      products = products.filter((product) =>
        _.find(validProducts, {
          _id: mongoose.Types.ObjectId(product.product_id),
        })
      );

      if (!products.length) {
        return resolve({
          error: true,
          message: "No valid product found.",
        });
      }

      //check if product with this variant is already exist in the cart

      let queryToCheckExistingProduct = products.map(
        ({ product_id, variantId }) => ({
          $and: [{ userId, product_id, variantId }],
        })
      );

      let existingProductsInTheCart = await cart.find({
        $or: queryToCheckExistingProduct,
      });

      //remove all the existing product
      products = products.filter(
        (product) =>
          !_.find(existingProductsInTheCart, {
            product_id: mongoose.Types.ObjectId(product.product_id),
          })
      );

      //after removing 0 product exits which means all products are already added to db

      if (!products.length) {
        return resolve({
          error: true,
          message: "Products already exist in the cart.",
        });
      }

      //create documents to insert to db
      const documents = products.map(({ product_id, variantId, quantity }) => {
        let variantDetails;

        validProducts.forEach((validProduct) => {
          let productVariant = _.find(validProduct.pricing, {
            _id: mongoose.Types.ObjectId(variantId),
          });

          if (productVariant) {
            variantDetails = productVariant;
          }
        });

        return {
          userId,
          product_id,
          variantId,
          quantity,
          variantDetails,
        };
      });

      //insert documents

      await cart.insertMany(documents);

      return resolve({
        error: false,
        message: `${documents.length} products successfully added to the cart.`,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const addMultipleProductsToCart = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    await doAddMultipleProductsToCart(userId, req.body).then((response) => {
      res.json(response);
    });
  } catch (error) {
    next(error);
  }
};

const doAddProductToCart = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //validate incoming data
      const dataValidation = await validateAddProductToCart(data);
      if (dataValidation.error) {
        const message = dataValidation.error.details[0].message.replace(
          /"/g,
          ""
        );
        return resolve({
          error: true,
          message: message,
          data: {},
        });
      }

      let { userId } = data;
      let { product_id, variantId, quantity } = data;

      //check product and variant is valid

      const validProduct = await product.findOne({
        _id: product_id,
        "pricing._id": {
          $in: [mongoose.Types.ObjectId(variantId)],
        },
        isDisabled: false,
      });

      if (!validProduct) {
        return resolve({
          error: true,
          message: "Invalid product.",
          data: {},
        });
      }

      //check if product and variant already added to the cart

      const existingCart = await cart.findOne({
        userId,
        product_id,
        variantId,
      });

      //if already exist in the cart increment quantity

      if (existingCart) {
        quantity += existingCart.quantity;
      }

      //check if stock is available

      const { stockAvailable } =
        (await checkIfStockAvailable({
          variantId,
          productId: product_id,
          quantity,
          userId,
        })) || {};

      if (!stockAvailable) {
        return resolve({
          error: true,
          message: "Product is out of stock right now.",
          data: {},
        });
      }

      //if product already exist update it

      if (existingCart) {
        //update product
        await cart.updateOne(
          {
            userId,
            product_id,
            variantId,
          },
          {
            quantity,
          }
        );

        return resolve({
          error: false,
          message: "Product Successfully added to your cart.",
          data: { cartId: existingCart._id, product_id, variantId, quantity },
        });
      }

      const variantDetails = _.find(validProduct.pricing, {
        _id: mongoose.Types.ObjectId(variantId),
      });

      const addedCartItem = await new cart({
        userId,
        product_id,
        variantId,
        quantity,
        variantDetails,
      }).save();

      return resolve({
        error: false,
        message: "Product Successfully added to your cart.",
        data: { cartId: addedCartItem._id, product_id, variantId, quantity },
      });
    } catch (error) {
      reject(error);
    }
  });
};

const doUpdateCartItem = (data, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      //validate incoming data
      const dataValidation = await validateUpdateCartItem(data);
      if (dataValidation.error) {
        const message = dataValidation.error.details[0].message.replace(
          /"/g,
          ""
        );
        return resolve({
          error: true,
          message: message,
        });
      }

      const { cartId, quantity } = data;

      const { variantId, product_id } =
        (await cart.findOne({
          userId,
          _id: cartId,
        })) || {};

      if (!variantId && product_id) {
        return resolve({
          error: true,
          message: "Invalid cart item.",
        });
      }

      //check if stock is available

      const { stockAvailable } =
        (await checkIfStockAvailable({
          variantId,
          productId: product_id,
          quantity,
          userId,
        })) || {};

      if (!stockAvailable) {
        return resolve({
          error: true,
          message: "Product is out of stock right now.",
        });
      }

      const updatedCartItem = await cart.findOneAndUpdate(
        { userId, _id: cartId },
        { quantity },
        { new: true }
      );

      if (updatedCartItem) {
        return resolve({
          error: false,
          message: "Cart item updated successfully.",
        });
      } else {
        return resolve({
          error: true,
          message: "Invalid cart item.",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  AddProductToCart: async (req, res, next) => {
    try {
      let data = req.body;
      data.userId = req.user._id;

      let response = await doAddProductToCart(data);

      res.json(response);
    } catch (error) {
      next(error);
    }
  },
  GetMedCart: async (req, res, next) => {
    let { _id: userId } = req.user || {};
    await doGetMedCart(userId)
      .then((response) => {
        delete response.data[0].medCart.cartDetails
          .freeDeliveryProvidedByPremiumBenefit;
        delete response.data[1].subscriptionCart.cartDetails
          .freeDeliveryProvidedByPremiumBenefit;

        res.json(response);
      })
      .catch((error) => {
        next(error);
      });
  },
  updateCartItem: async (req, res, next) => {
    try {
      const { _id: userId } = req.user || {};

      let response = await doUpdateCartItem(req.body, userId);

      res.json(response);
    } catch (error) {
      next(error);
    }
  },
  removeCartItem: async (req, res, next) => {
    const { cartId } = req.params || {};
    const { _id: userId } = req.user || {};

    await doRemoveCartItem(userId, { cartId })
      .then(({ error, message, statusCode }) => {
        res.status(statusCode).json({ error, message });
      })
      .catch((error) => {
        next(error);
      });
  },

  applyACouponToTheCart: async (req, res, next) => {
    try {
      const { _id: userId } = req.user;

      await doApplyACouponToTheCart(userId, req.body).then(
        ({ error, message, statusCode }) => {
          res.status(statusCode).json({ error, message });
        }
      );
    } catch (error) {
      next(error);
    }
  },

  removeCouponFromTheCart: async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      await doRemoveCouponFromTheCart(userId, req.body).then(
        ({ statusCode, error, message }) => {
          return res.status(statusCode).json({ error, message });
        }
      );
    } catch (error) {
      next(error);
    }
  },

  editAppliedMedCoinCount: async (req, res, next) => {
    try {
      const { _id: userId } = req.user;

      await doApplyMedCoinToTheCart(userId, req.body).then(
        ({ error, message }) => {
          res.json({ error, message });
        }
      );
    } catch (error) {
      next(error);
    }
  },
  doGetMedCart,
  removeCartItemNew: async (req, res, next) => {
    const { cartId } = req.body || {};
    const { _id: userId } = req.user || {};

    await doRemoveCartItem(userId, { cartId })
      .then(({ error, message, statusCode }) => {
        res.status(statusCode).json({ error, message });
      })
      .catch((error) => {
        next(error);
      });
  },

  editAppliedDonation: async (req, res, next) => {
    try {
      //validate edit donation

      const { _id: userId } = req.user;
      //validate incoming data
      const dataValidation = await validateEditAppliedDonation(req.body);
      if (dataValidation.error) {
        const message = dataValidation.error.details[0].message.replace(
          /"/g,
          ""
        );
        return res.status(200).json({
          error: true,
          message: message,
        });
      }

      const { donationAmount } = req.body;

      //check if user applied any donation if not apply donation

      const donation = await UserAppliedDonation.findOne({
        userId,
        isDonationApplied: true,
      });

      //add donation
      if (!donation) {
        await new UserAppliedDonation({
          userId,
          donationAmount,
        }).save();
      } else {
        // update donation
        await UserAppliedDonation.updateOne(
          { userId, isDonationApplied: true },
          {
            donationAmount,
          }
        );
      }

      return res.json({
        error: false,
        message: "Donation edited successfully.",
      });
    } catch (error) {
      next(error);
    }
  },

  getCartInfo: async (req, res, next) => {
    try {
      //hand pick

      const handPicks = await AdsCartHandpick.aggregate([
        {
          $match: {
            sliderType: "handpick",
            isDisabled: false,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "typeId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $addFields: { pricing: { $first: "$product.pricing" } },
        },
        //brand

        {
          $lookup: {
            from: "masterbrands",
            localField: "product.brand",
            foreignField: "_id",
            as: "brand",
          },
        },

        {
          $unwind: {
            path: "$brand",
            preserveNullAndEmptyArrays: true,
          },
        },

        //uom value
        {
          $lookup: {
            from: "masteruomvalues",
            localField: "product.pricing.sku",
            foreignField: "_id",
            as: "uomValue",
          },
        },

        {
          $unwind: {
            path: "$uomValue",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 0,
            sliderType: 1,
            variantId: "$pricing._id",
            product_id: "$product._id",
            productName: "$product.name",
            uomValue: "$uomValue.uomValue",
            brandName: "$brand.title",
            IsPrescriptionRequired: "$product.prescription",
            image: { $concat: [imgPath, { $first: "$pricing.image" }] },
            price: "$pricing.price",
            specialPrice: "$pricing.specialPrice",
            discountAmount: {
              $subtract: ["$pricing.price", "$pricing.specialPrice"],
            },
            discountInPercentage: {
              $multiply: [
                {
                  $divide: [
                    { $subtract: ["$pricing.price", "$pricing.specialPrice"] },
                    "$pricing.price",
                  ],
                },
                100,
              ],
            },
          },
        },
      ]);

      for (const handpick of handPicks) {
        const { stockAvailable } =
          (await checkIfStockAvailable({
            variantId: handpick.variantId,
            productId: handpick.product_id,
            quantity: 1,
            userId,
          })) || {};

        if (!stockAvailable) {
          handpick.outOfStock = true;
        } else {
          handpick.outOfStock = false;
        }
      }

      handPicks.forEach((handPick) => {
        if (!handPick.IsPrescriptionRequired) {
          handPick.IsPrescriptionRequired = false;
        }
        if (!handPick.image) {
          handPick.image = "";
        }
        if (!handPick.discountAmount) {
          handPick.discountAmount = 0;
        }
        if (!handPick.discountInPercentage) {
          handPick.discountInPercentage = 0;
        }
        if (!handPick.variantId) {
          handPick.variantId = "";
        }
        if (!handPick.product_id) {
          handPick.product_id = "";
        }
        if (!handPick.productName) {
          handPick.productName = "";
        }
        if (!handPick.price) {
          handPick.price = 0;
        }
        if (!handPick.specialPrice) {
          handPick.specialPrice = 0;
        }

        //round handpick discount percentage

        handPick.discountInPercentage = Math.round(
          handPick.discountInPercentage
        );
      });

      const banner = await adsAd1Subscription.aggregate([
        {
          $match: {
            type: "ad1",
          },
        },
        { $project: { image: { $concat: [imgPath, "$image"] }, _id: 0 } },
      ]);
      const subscriptionAd = await adsAd1Subscription.aggregate([
        {
          $match: {
            type: "subscription",
          },
        },
        { $project: { image: { $concat: [imgPath, "$image"] }, _id: 0 } },
      ]);

      return res.json({
        error: false,
        message: "Cart info ",
        data: {
          handPicks,
          banner: banner[0],
          subscriptionAd: subscriptionAd[0],
        },
      });
    } catch (error) {
      next(error);
    }
  },
  GetOrderReview: async (req, res, next) => {
    try {
      let { _id: userId } = req.user || {};
      const { data: cart } = await doGetMedCart(userId);
      let newProduct = [];
      let newSubProduct = [];

      let medCart = cart[0].medCart;
      let subscriptionCart = cart[1].subscriptionCart;
      medCart.orderReview1 = medCart.orderReview[0];
      delete medCart.orderReview;
      if (medCart) {
        for (let item of medCart?.products) {
          item.deliveryDate = medCart.cartDetails.deliveryDate;

          const { stockAvailable } =
            (await checkIfStockAvailable({
              variantId: item.variantId,
              productId: item.product_id,
              quantity: 1,
              userId: req.user._id,
            })) || {};
          if (stockAvailable) {
            newProduct.push(item);
          }
        }
        medCart.products = newProduct;
        medCart.orderReview2 = await ad1Subscription.findOne(
          { type: "orderreview2", isDisabled: false },
          {
            type: 1,
            image: { $concat: [process.env.BASE_URL, "$image"] },
          }
        );
        if (medCart.orderReview1) {
          console.log("kkkk");
          if (medCart.orderReview1.type == 1) {
            medCart.orderReview1.type = 0;
            let products = await product.findOne({
              _id: medCart.orderReview1.typeId,
            });
            if (products) {
              medCart.orderReview1.title = products.name;
            } else {
              medCart.orderReview1.title = "";
            }
          } else {
            medCart.orderReview1.type = 1;
            let category = await MasterSubCategoryHealthcare.findOne({
              _id: medCart.orderReview1.typeId,
            });
            if (category) {
              medCart.orderReview1.title = category.title;
            } else {
              medCart.orderReview1.title = "";
            }
          }
        }
      }
      if (subscriptionCart) {
        for (let item of subscriptionCart?.products) {
          const { stockAvailable } =
            (await checkIfStockAvailable({
              variantId: item.variantId,
              productId: item.product_id,
              quantity: 1,
              userId: req.user._id,
            })) || {};
          if (stockAvailable) {
            newSubProduct.push(item);
          }
        }
        subscriptionCart.products = newSubProduct;
      }
      return res.json({
        error: false,
        message: "Success",
        data: {
          medCart,
          subscriptionCart,
        },
      });
    } catch (error) {
      next();
    }
  },

  getCartCount,
  GetMedCartWeb,
  doGetMedCartWeb,
  addMultipleProductsToCart,
  checkIfStockAvailable,
  doAddMultipleProductsToCart,
  doApplyACouponToTheCart,
  doApplyMedCoinToTheCart,
  doAddProductToCart,
  doUpdateCartItem,
  doRemoveCartItem,
  doRemoveCouponFromTheCart,
};
