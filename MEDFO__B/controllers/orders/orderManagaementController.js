const moment = require("moment");
const _ = require("lodash");
const mongoose = require("mongoose");
const appRoot = require("app-root-path");
const { existsSync, unlinkSync } = require("fs");
const { convert } = require("html-to-text");

const PrescriptionAwaited = require("../../models/orders/prescriptionAwaited");
const Order = require("../../models/orders/order");
const DoctorCreatedPrescription = require("../../models/orders/doctorCreatedPrescriptions");
const PackingPending = require("../../models/orders/packingPending");
const Store = require("../../models/store");
const Products = require("../../models/inventory");
const DeliveryBoys = require("../../models/delivery/deliveryBoys");
const PickupPending = require("../../models/orders/pickupPending");
const PaymentLink = require("../../models/orders/paymentLink");
const MasterPreference = require("../../models/mastersettings/masterPreference");
const PaymentAwaited = require("../../models/orders/paymentAwaited");
const EmployeeType = require("../../models/employeeTypes");
const UserAppliedCoupons = require("../../models/cart/userAppliedCoupons");
const User = require("../../models/user");
const ReviewPending = require("../../models/orders/reviewPending");
const Payments = require("../../models/payments/payments");
const MedCoin = require("../../models/medcoin/medCoin");
const UserSubscription = require("../../models/orders/userSubscription");
const generatePrescriptionPDFAndImages = require("../../helpers/PDFs/pdfGenerator");
const termsAndConditionsOfPrescription = require("../../constants/pdf");
const HealthVault = require("../../models/user/healthVault");
const DeliveryBoyCredit = require("../../models/delivery/deliveryBoyCredit");
const DeliveryBoyNotification = require("../../models/delivery/deliveryBoyNotification");
const UomValue = require("../../models/mastersettings/uomValue");
const PremiumUser = require("../../models/user/premiumUser");
const userNotification = require("../../models/user/userNotification");

const {
  incrementOrDecrementAdminMedCoinBalance,
  doGetMedCoinDetails,
} = require("../medcoin/medCoinController");

const { razorpay } = require("../../constants/paymentGateways/paymentGateway");

const { checkIfStockAvailable } = require("../cart/cartController");

const {
  extractTextFromHTMLElement,
  downloadImage,
} = require("../../helpers/helper");

const {
  validateGetPrescriptionAwaitedOrders,
  validateRejectPrescriptionAwaitedOrder,
  validateCreatePrescription,
  validateGetPickupPendingOrders,
  validateGetDeliveryBoysByOrderId,
  validateGetOrderInvoiceByOrderId,
  validateAssignDeliveryBoyToOrder,
  validateUpdateRemarks,
  validatePaymentAwaitedOrders,
  validateSendPaymentLinkToUser,
  validateVerifyPaymentAwaitedOrder,
  validateVerifyPaymentByPaymentLinkId,
  validateGetPackingPendingOrders,
  validateReviewPendingOrders,
  validateMoveOrderToReviewPending,
  validateRefundPayableRazorPay,
  validateRefundPayableMedCoin,
  validateAcceptOrRejectReviewPendingOrder,
  validateGetHealthDataByUser,
} = require("../../validations/order/orderValidation");

const imgPath = process.env.BASE_URL;

const getPrescriptionAwaitedOrders = async (req, res, next) => {
  try {
    let page = req?.params?.page;
    let limit = 10;
    let skip = (page - 1) * limit;

    req.body.page = page;

    //validate incoming data
    const dataValidation = await validateGetPrescriptionAwaitedOrders(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    let { searchBy } = req?.body;

    let searchQuery;

    if (searchBy) {
      const users = await User.find({
        name: { $regex: `${searchBy}`, $options: "i" },
      });

      const userIds = users.map((user) => ({
        userId: { $eq: mongoose.Types.ObjectId(user._id) },
      }));

      searchQuery = [
        { orderId: { $regex: `${searchBy}`, $options: "i" } },
        { phoneNumber: { $regex: `${searchBy}`, $options: "i" } },
      ];

      if (userIds.length) {
        searchQuery = searchQuery.concat(userIds);
      }
    }

    let storeOrdersIds = [];

    if (req.isStore) {
      let storeOrders = await Order.find(
        {
          "storeDetails.storeId": mongoose.Types.ObjectId(req.user.id),
          orderStatus: { $ne: "cancelled" },
        },
        { _id: 1 }
      );

      storeOrdersIds = storeOrders.map((order) => ({
        orderObjectId: mongoose.Types.ObjectId(order._id),
      }));
    }

    let totalDocuments = await PrescriptionAwaited.countDocuments({
      prescriptionCreationStatus: "pending",
      ...(searchBy && { $or: searchQuery }),
      ...(req.isStore && storeOrdersIds.length && { $or: storeOrdersIds }),
    });

    let totalPages = Math.floor(totalDocuments / limit);

    let prescriptionAwaitedOrders = await PrescriptionAwaited.aggregate([
      {
        $match: {
          prescriptionCreationStatus: "pending",
          ...(searchBy && { $or: searchQuery }),
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "orderObjectId",
          foreignField: "_id",
          as: "orderDetails",
        },
      },
      {
        $match: {
          ...(req.isStore && {
            "orderDetails.storeDetails.storeId": mongoose.Types.ObjectId(
              req.user.id
            ),
          }),
          "orderDetails.orderStatus": { $ne: "cancelled" },
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
        $project: {
          _id: 0,
          prescriptionAwaitedOrderId: "$_id",
          userId: 1,
          userName: "$user.name",
          customerId: "$user.customerId",
          orderId: 1,
          orderObjectId: 1,
          noOfItems: 1,
          phoneNumber: 1,
          createdAt: 1,
          medicineProducts: 1,
          orderDetails: 1,
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

    // if (req.isStore) {
    //   prescriptionAwaitedOrders = prescriptionAwaitedOrders.filter(
    //     (prescriptionAwaitedOrder) => {
    //       return (
    //         prescriptionAwaitedOrder.orderDetails[0].storeDetails.storeId+"" ==
    //         req.user._id+""
    //       );
    //     }
    //   );
    // }

    prescriptionAwaitedOrders.forEach((prescriptionAwaitedOrder) => {
      prescriptionAwaitedOrder.createdAt = moment(
        prescriptionAwaitedOrder.orderDetails[0]?.createdAt
      )
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY, hh:mm a");

      if (!prescriptionAwaitedOrder.remarks) {
        prescriptionAwaitedOrder.remarks = "";
      }

      //add s:no
      prescriptionAwaitedOrder.siNo = serialNoStarting;
      serialNoStarting++;
    });

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

    //get all variants of that product

    if (prescriptionAwaitedOrders.length) {
      for (const order of prescriptionAwaitedOrders) {
        for (const medicineProduct of order.medicineProducts) {
          const product = await Products.findOne({
            _id: medicineProduct.product_id,
          }).lean();

          for (const variant of product.pricing) {
            //get variant name

            const uom = await UomValue.findOne({ _id: variant.sku });

            variant.uomValue = uom?.uomValue;
            variant.image = variant.image[0];
            variant.variantId = variant._id;
            delete variant._id;

            if (!variant.uomValue) variant.uomValue = null;
          }

          medicineProduct.variants = product.pricing;

          if (!medicineProduct?.variants?.length) {
            medicineProduct.variants = [];
          }
        }
      }
    }

    let premiumUsers = [];

    if (prescriptionAwaitedOrders.length) {
      //check if user is premium member or not

      premiumUsers = await PremiumUser.find({
        $or: prescriptionAwaitedOrders.map((order) => ({
          userId: mongoose.Types.ObjectId(order.userId),
        })),
        active: true,
        expired: false,
      });
    }

    for (const order of prescriptionAwaitedOrders) {
      if (
        _.find(premiumUsers, {
          userId: mongoose.Types.ObjectId(order.userId),
        })
      ) {
        order.premiumUser = true;
      } else {
        order.premiumUser = false;
      }
    }

    //set remarks

    prescriptionAwaitedOrders.map((order) => {
      order.remarks = order.orderDetails[0]?.remarks;
      if (!order.remarks) order.remarks = "";
    });

    return res.json({
      error: false,
      message: prescriptionAwaitedOrders.length
        ? "Prescription awaited orders found."
        : "Empty prescription awaited orders.",
      data: {
        prescriptionAwaitedOrders,
        pageDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};

const rejectPrescriptionAwaitedOrder = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateRejectPrescriptionAwaitedOrder(
      req.body
    );
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    let { prescriptionAwaitedOrderId, reason } = req.body;

    //check prescription awaited order id is valid

    const prescriptionAwaitedOrder = await PrescriptionAwaited.findOne({
      _id: prescriptionAwaitedOrderId,
    });

    if (!prescriptionAwaitedOrder) {
      return res.json({
        error: true,
        message: "Invalid prescription awaited order ID",
      });
    }

    //change prescription awaited order status to rejected

    await PrescriptionAwaited.updateOne(
      { _id: prescriptionAwaitedOrderId },
      {
        prescriptionCreationStatus: "rejected",
        prescriptionCancelReason: reason,
      }
    );

    //change order status to rejected
    await Order.updateOne(
      { _id: prescriptionAwaitedOrder.orderObjectId },
      {
        orderStatus: "doctor rejected",
        rejectionReason: reason,
        doctorRejectedDate: new Date(),
      }
    );

    return res.json({ error: false, message: "Order successfully rejected." });
  } catch (error) {
    next(error);
  }
};

const createPrescription = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateCreatePrescription(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    let {
      orderId,
      patientName,
      age,
      sex,
      aboutDiagnosis,
      allergies,
      medicineProducts,
      description,
    } = req.body;

    aboutDiagnosis = aboutDiagnosis
      ? convert(convert(aboutDiagnosis))
      : "Not applicable";

    allergies = allergies ? convert(convert(allergies)) : "Not applicable";
    description = description
      ? convert(convert(description))
      : "Not applicable";

    //get original order made by the user

    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      return res.json({ error: true, message: "Invalid Order Id." });
    }

    const originalCartDetails = order.cartDetails;
    const originalProducts = [...order.products];

    const prescriptionAwaitedOrder = await PrescriptionAwaited.findOne({
      orderObjectId: orderId,
    });

    if (!prescriptionAwaitedOrder) {
      return res.json({
        error: true,
        message: "Invalid prescription awaited order.",
      });
    }

    if (prescriptionAwaitedOrder.prescriptionCreationStatus !== "pending") {
      return res.json({
        error: true,
        message: `Prescription awaited for this order was ${prescriptionAwaitedOrder.prescriptionCreationStatus}.`,
      });
    }

    //check if the incoming medicine products and prescription awaited products are same if not doctor changed the product

    let sameProductThatUserPurchased = true;
    let newlyAddedProducts = [];
    const quantityChangedProducts = [];
    const removedProducts = [];

    medicineProducts.forEach((medicineProduct) => {
      const productThatAddedByUser = _.find(order.products, {
        product_id: mongoose.Types.ObjectId(medicineProduct.product_id),
        variantId: mongoose.Types.ObjectId(medicineProduct.variantId),
        quantity: medicineProduct.quantity,
      });

      //if a product is not added by user then it is added by doctor

      if (!productThatAddedByUser) {
        sameProductThatUserPurchased = false;

        //check if this is a quantity changed product or not

        const quantityChangedProduct = _.find(order.products, {
          product_id: mongoose.Types.ObjectId(medicineProduct.product_id),
          variantId: mongoose.Types.ObjectId(medicineProduct.variantId),
        });

        if (quantityChangedProduct) {
          quantityChangedProduct.quantity = medicineProduct.quantity;
          quantityChangedProducts.push(quantityChangedProduct);
        } else {
          newlyAddedProducts.push(medicineProduct);
        }
      }
    });

    //get products that is removed by doctor

    prescriptionAwaitedOrder.medicineProducts.forEach(
      (originalMedicineProduct) => {
        const productAvailableInDoctorAddedMedicine = _.find(medicineProducts, {
          variantId: originalMedicineProduct.variantId.toString(),
        });

        // if a product is not found in doctor added product then it is removed by doctor

        if (!productAvailableInDoctorAddedMedicine) {
          sameProductThatUserPurchased = false;
          removedProducts.push(originalMedicineProduct);
        }
      }
    );

    let moveToReviewPending = true;

    if (!sameProductThatUserPurchased) {
      //check if incoming products are valid

      const validProducts = await Products.find({
        $or: medicineProducts.map((medicineProduct) => {
          return {
            $and: [
              { _id: medicineProduct.product_id },
              {
                pricing: {
                  $elemMatch: {
                    _id: medicineProduct.variantId,
                  },
                },
              },
            ],
          };
        }),
        isDisabled: false,
      });

      let validProductsVariants = validProducts.map(
        (validProduct) => validProduct.pricing
      );

      validProductsVariants = _.flatten(validProductsVariants);

      //check if variant exist

      for (const medicineProduct of medicineProducts) {
        if (
          !_.find(validProductsVariants, {
            _id: mongoose.Types.ObjectId(medicineProduct.variantId),
          }) ||
          !_.find(validProducts, {
            _id: mongoose.Types.ObjectId(medicineProduct.product_id),
          })
        ) {
          return res.json({ error: true, message: "Invalid product." });
        }
      }

      //check if stock available

      for (const medicineProduct of medicineProducts) {
        const { stockAvailable } =
          (await checkIfStockAvailable({
            variantId: medicineProduct.variantId,
            productId: medicineProduct.product_id,
            quantity: medicineProduct.quantity,
            userId: order.userId,
          })) || {};

        const product = _.find(validProducts, {
          _id: mongoose.Types.ObjectId(medicineProduct.product_id),
        });

        if (!stockAvailable) {
          return res.json({
            error: true,
            message: `Stock for product ${product.name} is not available right now.`,
          });
        }
      }

      //calculate new amount that user need to pay

      let updatedProducts = order.products;

      //remove quantity changed product from original product.

      quantityChangedProducts.forEach((quantityChangedProduct) => {
        _.remove(updatedProducts, {
          variantId: quantityChangedProduct.variantId,
        });
      });

      //remove removed products from original products
      removedProducts.forEach((removedProduct) => {
        _.remove(updatedProducts, {
          variantId: removedProduct.variantId,
        });
      });

      //if doctor added new product get its details

      if (newlyAddedProducts.length) {
        const products = await Products.aggregate([
          {
            $match: {
              $or: newlyAddedProducts.map((product) => {
                return {
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
                };
              }),
            },
          },

          {
            $project: {
              pricing: {
                //only get the variant
                $filter: {
                  input: "$pricing",
                  as: "pricing",
                  cond: {
                    $or: newlyAddedProducts.map((product) => {
                      return {
                        $eq: [
                          "$$pricing._id",
                          mongoose.Types.ObjectId(product.variantId),
                        ],
                      };
                    }),
                  },
                },
              },
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
          {
            $unwind: "$pricing",
          },
          //brand

          {
            $lookup: {
              from: "masterbrands",
              localField: "brand",
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
              localField: "pricing.sku",
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
              cartId: "",
              variantId: "$pricing._id",
              product_id: "$_id",
              quantity: "$quantity",
              productName: "$name",
              brandName: "$brand.title",
              type: 1,
              description: 1,
              IsPrescriptionRequired: "$prescription",
              image: {
                $concat: [imgPath, { $first: "$pricing.image" }],
              },
              price: "$pricing.price",
              offerType: { $ifNull: ["$offerType", "Unspecified"] },
              specialPrice: "$pricing.specialPrice",
              uomValue: "$uomValue.uomValue",
              discountAmount: {
                $subtract: ["$pricing.price", "$pricing.specialPrice"],
              },
              discountInPercentage: {
                $multiply: [
                  {
                    $divide: [
                      {
                        $subtract: ["$pricing.price", "$pricing.specialPrice"],
                      },
                      "$pricing.price",
                    ],
                  },
                  100,
                ],
              },
            },
          },
          { $addFields: { outOfStock: false } },
        ]);

        //add quantity

        products.forEach((product) => {
          const matchingProduct = _.find(newlyAddedProducts, {
            variantId: product.variantId.toString(),
          });

          if (matchingProduct) {
            product.quantity = matchingProduct.quantity;
          }
        });

        //set newly added product as products

        newlyAddedProducts = products;
      }

      //add newly added products and quantity changed products to original products

      updatedProducts = updatedProducts.concat(
        newlyAddedProducts,
        quantityChangedProducts
      );

      //calculate new cartDetails

      const newCartDetails = { ...originalCartDetails };

      newCartDetails.totalCartValue = 0;
      newCartDetails.totalRealCartValue = 0;
      newCartDetails.totalDiscountAmount = 0;
      newCartDetails.totalAmountToBePaid = 0;
      newCartDetails.couponAppliedDiscount = 0;

      //get user applied coupon

      let userAppliedCoupon = await UserAppliedCoupons.aggregate([
        {
          $match: {
            userId: order.userId,
            orderId: order._id,
          },
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

      updatedProducts.map((product) => {
        newCartDetails.totalCartValue +=
          product.specialPrice * product.quantity;
        newCartDetails.totalRealCartValue += product.price * product.quantity;

        // re calculate coupon discount

        if (userAppliedCoupon) {
          if (product.type === userAppliedCoupon.category) {
            //get percentage of discount and increase coupon discount until it hit maximum limit

            const discountAmount =
              (userAppliedCoupon.percentage / 100) *
              (product.specialPrice * product.quantity);

            if (
              newCartDetails.couponAppliedDiscount + discountAmount <
              userAppliedCoupon.maximumAmount
            ) {
              newCartDetails.couponAppliedDiscount += discountAmount;
            } else {
              newCartDetails.couponAppliedDiscount =
                userAppliedCoupon.maximumAmount;
            }
          }
        }
      });

      //re calculate coupon discount

      //total discount

      newCartDetails.totalDiscountAmount =
        newCartDetails.totalRealCartValue -
        newCartDetails.totalCartValue +
        newCartDetails.medCoinRedeemed +
        newCartDetails.memberDiscount +
        newCartDetails.couponAppliedDiscount;

      //total amount to be paid

      newCartDetails.totalAmountToBePaid =
        newCartDetails.totalRealCartValue -
        newCartDetails.totalDiscountAmount +
        newCartDetails.donationAmount;

      //check if updated amount to be paid greater than minimum purchase amount.

      const { minPurchaseAmount = 0, minFreeDeliveryAmount = 0 } =
        (await MasterPreference.findOne(
          { isDisabled: false },
          { minPurchaseAmount: 1, minFreeDeliveryAmount: 1 }
        )) || {};

      if (newCartDetails.totalCartValue < minPurchaseAmount) {
        return res.json({
          error: true,
          message: `user minimum purchase should be ${minPurchaseAmount}.`,
        });
      }

      //check for free delivery

      if (originalCartDetails.isThisCartEligibleForFreeDelivery) {
        if (newCartDetails.totalCartValue <= minFreeDeliveryAmount) {
          newCartDetails.isThisCartEligibleForFreeDelivery = false;

          newCartDetails.totalAmountToBePaid += newCartDetails.deliveryCharge;
        }
      } else {
        if (newCartDetails.totalCartValue >= minFreeDeliveryAmount) {
          newCartDetails.isThisCartEligibleForFreeDelivery = true;

          newCartDetails.totalAmountToBePaid -= newCartDetails.deliveryCharge;
        }
      }

      //update original order

      await Order.updateOne(
        { _id: orderId },
        {
          products: updatedProducts,
          originalCartDetails,
          originalProducts,
          doctorAddedProducts: newlyAddedProducts,
          doctorRemovedProducts: removedProducts,
          doctorQuantityChangedProducts: quantityChangedProducts,
          cartDetails: newCartDetails,
          noOfItems: updatedProducts.length,
        }
      );

      //if user payment type is not cod and total amount to be paid is not same as original total amount to be paid then add this to
      // payment awaited

      if (
        order.paymentType !== "cod" &&
        originalCartDetails.totalAmountToBePaid !==
          newCartDetails.totalAmountToBePaid
      ) {
        moveToReviewPending = false;

        let type = "payable";

        if (
          newCartDetails.totalAmountToBePaid >
          originalCartDetails.totalAmountToBePaid
        ) {
          type = "receivable";
        }

        let amountToBePaid;

        if (type === "payable") {
          amountToBePaid =
            originalCartDetails.totalAmountToBePaid -
            newCartDetails.totalAmountToBePaid;
        } else {
          amountToBePaid =
            newCartDetails.totalAmountToBePaid -
            originalCartDetails.totalAmountToBePaid;
        }

        await new PaymentAwaited({
          orderId: order.orderId,
          orderObjectId: order._id,
          userId: order.userId,
          doctorAddedProducts: newlyAddedProducts,
          noOfItems: updatedProducts.length,
          products: updatedProducts,
          originalCartDetails,
          cartDetails: newCartDetails,
          type,
          amountToBePaid,
          prescription: order.prescription,
        }).save();

        //update order status to order confirmed

        await Order.updateOne(
          {
            _id: order._id,
          },
          {
            orderStatus: "order confirmed",
          }
        );
      }
    }

    //doctor details

    let { signature, firstname, lastname } = req.user;

    let signatureImage = "no-image-available.png";

    if (signature) {
      //if doctor signature then download signature

      //delete previous sign

      if (existsSync(`${appRoot.path}/helpers/PDFs/sign.png`)) {
        unlinkSync(`${appRoot.path}/helpers/PDFs/sign.png`);
      }

      //download new signature
      let downloadedImageResponse = await downloadImage(
        `${process.env.BASE_URL}${signature}`,
        `${appRoot.path}/helpers/PDFs/sign.png`
      );

      if (downloadedImageResponse.status) {
        signatureImage = "sign.png";
      }
    }

    //create pdf and save it to the db

    const productsForPDF = [];

    for (const medicineProduct of medicineProducts) {
      const product = await doGetProductDetailsByProductAndVariantId(
        medicineProduct.product_id,
        medicineProduct.variantId
      );

      productsForPDF.push({
        name: product.productName,
        freq: `${medicineProduct.morning}-${medicineProduct.noon}-${medicineProduct.night}`,
        duration: `${medicineProduct.days} ${
          medicineProduct.days > 1 ? "days" : "day"
        }`,
        instructions: medicineProduct.instructions,
      });
    }

    productsForPDF.forEach((product) => {
      if (!product.instructions) product.instructions = "Not applicable";
    });

    const prescriptionSavedImagesAndPDF =
      await generatePrescriptionPDFAndImages(
        {
          doctorName: `${firstname} ${lastname}`,
          medicalDegree: "MBBS",
        },
        {
          patientName,
          ageAndGender: `${age} / ${sex}`,
        },
        allergies ? allergies : "Not applicable",
        aboutDiagnosis ? aboutDiagnosis : "Not applicable",
        description ? description : "Not applicable",
        productsForPDF,
        termsAndConditionsOfPrescription,
        signatureImage
      );

    //create prescription

    const createdPrescription = await new DoctorCreatedPrescription({
      orderId: order.orderId,
      orderObjectId: order._id,
      userId: order.userId,
      patientName,
      age,
      sex,
      aboutDiagnosis,
      allergies,
      medicineProducts,
      description,
      pdfFile: `${process.env.BASE_URL}prescriptions/pdf/${prescriptionSavedImagesAndPDF.PDFFileName}`,
    }).save();

    //update order prescriptions

    await Order.updateOne(
      {
        _id: order._id,
      },
      {
        $push: {
          prescription: {
            $each: prescriptionSavedImagesAndPDF.images.map(
              (image) =>
                `${process.env.BASE_URL}prescriptions/images/${image.name}`
            ),
          },
        },
      }
    );

    //update payment awaited prescription

    await PaymentAwaited.updateOne(
      {
        orderObjectId: order._id,
      },
      {
        $push: {
          prescription: {
            $each: prescriptionSavedImagesAndPDF.images.map(
              (image) =>
                `${process.env.BASE_URL}prescriptions/images/${image.name}`
            ),
          },
        },
      }
    );
    //update subscription prescription too

    await UserSubscription.updateOne(
      {
        orderId: order._id,
      },
      {
        $push: {
          prescription: {
            $each: prescriptionSavedImagesAndPDF.images.map(
              (image) =>
                `${process.env.BASE_URL}prescriptions/images/${image.name}`
            ),
          },
        },
      }
    );
    //update prescription status to created

    await PrescriptionAwaited.updateOne(
      {
        orderObjectId: orderId,
      },
      {
        prescriptionCreationStatus: "created",
        createdPrescriptionId: createdPrescription._id,
      }
    );

    const productsDetails = [];

    for (const medicineProduct of medicineProducts) {
      const product = await doGetProductDetailsByProductAndVariantId(
        medicineProduct.product_id,
        medicineProduct.variantId,
        medicineProduct.quantity
      );

      productsDetails.push(product);
    }

    if (moveToReviewPending) {
      await new ReviewPending({
        orderId: order.orderId,
        orderObjectId: order._id,
        userId: order.userId,
        noOfItems: medicineProducts.length,
        phoneNumber: order.address.mobile,
        medicineProducts: productsDetails,
        prescription: prescriptionSavedImagesAndPDF.images.map(
          (image) => `${process.env.BASE_URL}prescriptions/images/${image.name}`
        ),
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

    //send mail

    return res.json({
      error: false,
      message: "Prescription created successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const getPackingPendingOrders = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateGetPackingPendingOrders(req.body);
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

    //if search by build search query

    let searchQuery;

    if (searchBy) {
      //search by user name

      const users = await User.find({
        name: { $regex: `${searchBy}`, $options: "i" },
      });

      const userIds = users.map((user) => ({
        userId: { $eq: mongoose.Types.ObjectId(user._id) },
      }));

      //search by store name

      //get all stores that matches the search key word

      const stores = await Store.find({
        name: { $regex: `${searchBy}`, $options: "i" },
      });

      //now get all orders that have this order

      let ordersFromTheSearchedStore = [];

      if (stores.length) {
        ordersFromTheSearchedStore = await Order.find({
          $or: stores.map((store) => ({
            "storeDetails.storeId": mongoose.Types.ObjectId(store._id),
          })),
        });
      }

      let orderIds = [];

      if (ordersFromTheSearchedStore.length) {
        orderIds = ordersFromTheSearchedStore.map((order) => ({
          orderObjectId: { $eq: mongoose.Types.ObjectId(order._id) },
        }));
      }

      searchQuery = [
        { orderId: { $regex: `${searchBy}`, $options: "i" } },

        { shippingZone: { $regex: `${searchBy}`, $options: "i" } },
        { approvalTimeInString: { $regex: `${searchBy}`, $options: "i" } },
      ];

      if (userIds.length) {
        searchQuery = searchQuery.concat(userIds);
      }

      if (orderIds.length) {
        searchQuery = searchQuery.concat(orderIds);
      }
    }

    let storeOrdersIds = [];

    if (req.isStore) {
      let storeOrders = await Order.find(
        {
          "storeDetails.storeId": mongoose.Types.ObjectId(req.user.id),
          orderStatus: { $ne: "cancelled" },
        },
        { _id: 1 }
      );

      storeOrdersIds = storeOrders.map((order) => ({
        orderObjectId: mongoose.Types.ObjectId(order._id),
      }));
    }

    let totalDocuments = await PackingPending.countDocuments({
      status: "pending",
      ...(searchBy && {
        $or: searchQuery,
      }),
      ...(req.isStore && storeOrdersIds.length && { $or: storeOrdersIds }),
    });

    let totalPages = Math.floor(totalDocuments / limit);

    let packingPendingOrders = await PackingPending.aggregate([
      {
        $match: {
          status: "pending",
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
          localField: "orderObjectId",
          foreignField: "_id",
          as: "order",
        },
      },
      {
        $match: {
          ...(req.isStore && {
            "order.storeDetails.storeId": mongoose.Types.ObjectId(req.user.id),
          }),
          "order.orderStatus": { $ne: "cancelled" },
        },
      },
      {
        $unwind: "$order",
      },
      {
        $lookup: {
          from: "stores",
          localField: "order.storeDetails.storeId",
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
          packingPendingOrderId: "$_id",
          userId: 1,
          userName: "$user.name",
          customerId: "$user.customerId",
          orderId: 1,
          orderObjectId: 1,
          noOfItems: 1,
          createdAt: "$order.createdAt",
          reviewApprovedTime: "$createdAt",
          products: 1,
          storeLevel: 1,
          approvalTime: 1,
          shippingZone: 1,
          storeName: "$store.name",
          storeDetails: "$order.storeDetails",
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

    if (req.isStore) {
      packingPendingOrders = packingPendingOrders.filter(
        (packingPendingOrder) => {
          return (
            packingPendingOrder.storeDetails.storeId + "" == req.user._id + ""
          );
        }
      );
    }

    packingPendingOrders.forEach((packingPendingOrder) => {
      packingPendingOrder.createdAt = moment(packingPendingOrder.createdAt)
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY, hh:mm a");

      if (!packingPendingOrder.declinedByDeliveryBoy) {
        packingPendingOrder.declinedByDeliveryBoy = false;
      }

      packingPendingOrder.approvalTime = moment(
        packingPendingOrder.reviewApprovedTime
      )
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY, hh:mm a");

      //add s:no
      packingPendingOrder.siNo = serialNoStarting;
      serialNoStarting++;
    });

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

    let premiumUsers = [];

    if (packingPendingOrders.length) {
      //check if user is premium member or not

      premiumUsers = await PremiumUser.find({
        $or: packingPendingOrders.map((order) => ({
          userId: mongoose.Types.ObjectId(order.userId),
        })),
        active: true,
        expired: false,
      });
    }

    for (const order of packingPendingOrders) {
      if (
        _.find(premiumUsers, {
          userId: mongoose.Types.ObjectId(order.userId),
        })
      ) {
        order.premiumUser = true;
      } else {
        order.premiumUser = false;
      }
    }

    return res.json({
      error: false,
      message: packingPendingOrders.length
        ? "Pickup pending orders found."
        : "Empty pickup pending orders.",
      data: {
        packingPendingOrders,
        pageDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getDeliveryBoysByOrderId = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateGetDeliveryBoysByOrderId(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    const { orderId } = req.body;

    //get order from db

    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      return res.json({ error: true, message: "Invalid order ID." });
    }

    //get delivery boys based on user ordered address pin code
    const pinCode = order.address.pincode;

    //get pin code object id

    const store = await Store.findOne({
      serviceablePincodes: { $elemMatch: { code: pinCode } },
    });

    if (!store) {
      return res.json({
        error: true,
        message: "Pin code is not serviceable.",
      });
    }

    let { _id: pinCodeId } =
      _.find(store.serviceablePincodes, {
        code: pinCode,
      }) || {};

    const deliveryBoys = await DeliveryBoys.find(
      {
        pincode: { $elemMatch: { $eq: mongoose.Types.ObjectId(pinCodeId) } },
        isActive: true,
        isApproved: "approved",
      },
      {
        deliveryBoyId: 1,
        fullName: 1,
        credit: 1,
        online: "$status",
        _id: 1,
      }
    ).lean();

    //get real credit

    if (deliveryBoys.length) {
      for (const deliveryBoy of deliveryBoys) {
        const newCredit = await DeliveryBoyCredit.findOne({
          deliveryBoyId: deliveryBoy._id,
        }).sort({ _id: -1 });

        if (newCredit) {
          deliveryBoy.credit = newCredit.balance;
        }
      }
    }

    deliveryBoys.forEach((deliveryBoy) => {
      if (!deliveryBoy.online) deliveryBoy.online = "Offline";
    });

    res.json({
      error: false,
      message: deliveryBoys.length
        ? "Delivery boys found."
        : "Empty delivery boys.",
      data: {
        deliveryBoys,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOrderInvoiceByOrderId = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateGetOrderInvoiceByOrderId(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    const { orderId } = req.body;

    let order = await Order.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(orderId),
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
        $project: {
          _id: 0,
          orderObjectId: "$_id",
          userId: 1,
          userName: "$user.name",
          customerId: "$user.customerId",
          phone: "$address.mobile",
          orderId: 1,
          noOfItems: 1,
          createdAt: 1,
          address: 1,
          products: 1,
          cartDetails: 1,
          paymentType: 1,
          dob: "$user.dob",
        },
      },
    ]);

    order = order[0];

    if (!order) {
      return res.json({ error: true, message: "Invalid order ID." });
    }

    const queryToGetHsnCode = order.products.map((product) => ({
      pricing: {
        $elemMatch: { _id: mongoose.Types.ObjectId(product.variantId) },
      },
    }));

    //get all products hsn skn code

    const hsnSknCodes = await Products.find({ $or: queryToGetHsnCode });

    let totalAmount = 0;

    const productStatements = order.products.map((product) => {
      const hsnCodeProduct = _.find(hsnSknCodes, {
        _id: product.product_id,
      });

      const { skuOrHsnNo } =
        _.find(hsnCodeProduct.pricing, {
          _id: product.variantId,
        }) || {};

      if (!skuOrHsnNo) {
        skuOrHsnNo = "_";
      }

      totalAmount += product.specialPrice * product.quantity;

      return {
        skuOrHsnNo,
        productName: product.productName,
        quantity: product.quantity,
        productId: product.product_id,
        variantId: product.variantId,
        uomValue: product.uomValue,
        amount: product.specialPrice,
        total: product.specialPrice * product.quantity,
      };
    });

    let amountStatements = {
      totalAmount,
      medCoins: order.cartDetails.medCoinRedeemed,
      memberDiscount: order.cartDetails.memberDiscount,
      couponAppliedDiscount: order.cartDetails.couponAppliedDiscount,
      payableAmount: order.cartDetails.totalAmountToBePaid,
      deliveryCharge: order.cartDetails.deliveryCharge,
      deliveryWasFree: order.cartDetails.isThisCartEligibleForFreeDelivery,
      donationAmount: order.cartDetails.donationAmount,
    };

    let invoice = {
      orderId: order.orderId,
      shippingZone: order.address.pincode,
      name: order.userName,
      orderTime: moment(order.createdAt)
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY, hh:mm a"),
      shippingAddress: order.address.wholeAddress,
      contactNumber: order.phone,
      productStatements,
      amountStatements: amountStatements,
      paymentType: order.paymentType === "cod" ? "cod" : "online payment",
      age: order.dob
        ? moment().diff(
            moment(order.dob, "YYYY-MM-DD").tz(process.env.TIME_ZONE),
            "years"
          )
        : null,
    };

    return res.json({
      error: false,
      message: "Order invoice.",
      data: { invoice },
    });
  } catch (error) {
    next(error);
  }
};

const assignDeliveryBoyToOrder = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateAssignDeliveryBoyToOrder(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    const { orderId, deliveryBoyId } = req.body;

    //check order id id valid

    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      return res.json({ error: true, message: "Invalid order Id" });
    }

    //check if deliver boy is valid

    const deliveryBoy = await DeliveryBoys.findOne({
      _id: deliveryBoyId,
      isApproved: "approved",
    });

    if (!deliveryBoy) {
      return res.json({ error: true, message: "Invalid delivery boy Id" });
    }

    //check if delivery boy online or not

    if (!deliveryBoy.status || deliveryBoy.status === "Offline") {
      return res.json({
        error: true,
        message: "Delivery boy is not available right now.",
      });
    }

    //check delivery boy's credit

    if (deliveryBoy.credit < order.cartDetails.totalAmountToBePaid) {
      return res.json({
        error: true,
        message: "Delivery boy's credit is less than order payment.",
      });
    }

    const pinCode = order.address.pincode;

    //get pincode object id from store

    const store = await Store.findOne({
      serviceablePincodes: { $elemMatch: { code: pinCode } },
    });

    if (!store) {
      return res.json({
        error: true,
        message: "Pin code is not serviceable.",
      });
    }

    let { _id: pinCodeId } =
      _.find(store.serviceablePincodes, {
        code: pinCode,
      }) || {};

    //check if delivery boy serviceable for this order pin code

    let serviceableDeliveryBoy = _.find(deliveryBoy.pincode, pinCodeId);

    if (!serviceableDeliveryBoy) {
      return res.json({
        error: true,
        message: `This delivery boy does not have delivery in ${pinCode} pin code.`,
      });
    }

    //check if this order is already assigned or not

    const assignedOrder = await PickupPending.findOne({
      orderObjectId: orderId,
      status: { $ne: "Decline" },
    });

    if (assignedOrder) {
      return res.json({
        error: true,
        message: `Order already assigned to delivery boy.`,
      });
    }
    //code for deliveryboy credit
    const deliveryBoyCredit = await DeliveryBoyCredit.findOne({
      deliveryBoyId: mongoose.Types.ObjectId(deliveryBoyId),
    }).sort({ _id: -1 });
    let lastCredit = 0;
    if (deliveryBoyCredit) {
      lastCredit = deliveryBoyCredit.balance;
    } else {
      lastCredit = deliveryBoy.credit;
    }
    let lastOrderDebit = order.cartDetails.totalAmountToBePaid;
    let lastOrderBalance = 0;
    if (lastCredit > 0) {
      lastOrderBalance = parseFloat(lastCredit - lastOrderDebit).toFixed(2);
      if (lastOrderBalance < 0) {
        return res.json({
          error: true,
          message: `Insufficient credit value for the delivery boy.`,
        });
      }
    } else {
      return res.json({
        error: true,
        message: `Insufficient credit value for the delivery boy.`,
      });
    }
    await new DeliveryBoyCredit({
      deliveryBoyId: deliveryBoy._id,
      orderObjectId: order._id,
      orderId: order.orderId,
      credit: 0,
      debit: lastOrderDebit,
      balance: lastOrderBalance,
      type: "order",
    }).save();

    //move order to pickup pending

    await new PickupPending({
      userId: order.userId,
      deliveryBoyId,
      orderObjectId: order._id,
      orderId: order.orderId,
      paymentType: order.paymentType,
      deliveryDate: order.deliveryDate,
      noOfItems: order.noOfItems,
      address: order.address,
      products: order.products,
      cartDetails: order.cartDetails,
      status: "pickup pending",
    }).save();

    //update packing pending order to assigned

    await PackingPending.updateOne(
      {
        orderObjectId: orderId,
      },
      {
        status: "assigned",
      }
    );

    //update order status to order packed

    await Order.updateOne(
      {
        _id: order._id,
      },
      {
        $set: {
          orderStatus: "order packed",
          eligibleForCancel: false,
        },
      }
    );
    //add order details to deliveryBoy notification

    await new DeliveryBoyNotification({
      DeliveryBoyID: deliveryBoyId,
      orderObjectId: order._id,
      orderId: order.orderId,
      paymentType: order.paymentType,
      type: "NewOrder",
      userId: order.userId,
      cartDetails: order.cartDetails,
      assignedDate: moment(new Date()).tz(process.env.TIME_ZONE),
    }).save();

    //add order details to user notification

    await new userNotification({
      orderObjectId: order._id,
      orderId: order.orderId,
      paymentType: order.paymentType,
      userId: order.userId,
      cartDetails: order.cartDetails,
      orderStatus: "order packed",
      message: `your order for ${order.orderId} was packed`,
      arrivingDate: order.deliveryDate,
      products: order.products,
    }).save();

    return res.json({
      error: false,
      message: "Order successfully assigned to delivery boy.",
    });
  } catch (error) {
    next(error);
  }
};

const updateRemarks = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateUpdateRemarks(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    const { orderId, remarks, remarkType } = req.body;

    //check if order id valid or not

    const order = await Order.findOne({
      _id: orderId,
    });

    if (!order) {
      return res.json({
        error: true,
        message: "Invalid order ID.",
      });
    }

    //UPDATE ORDER REMARKS

    await Order.updateOne({ _id: orderId }, { remarks });

    return res.json({
      error: false,
      message: "Remarks successfully updated.",
    });
  } catch (error) {
    next(error);
  }
};

const getDoctorDetails = async (req, res, next) => {
  try {
    let {
      _id: employeeId,
      employeeType: employeeTypeId,
      signature,
      firstname,
      lastname,
    } = req.user;

    if (!signature) signature = "";

    const response = await doGetDoctorDetails(
      employeeId,
      employeeTypeId,
      signature,
      firstname,
      lastname
    );

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const doGetDoctorDetails = (
  employeeId,
  employeeTypeId,
  signature,
  firstname,
  lastname
) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check employee type and only allow doctor to access this

      const employeeType = await EmployeeType.findOne({
        _id: employeeTypeId,
      });

      if (!employeeType || employeeType.type !== "Doctor") {
        return resolve({
          error: true,
          message: "Only doctors are allowed do this action.",
        });
      }

      const doctorDetails = {
        doctorId: employeeId,
        signature: `${process.env.BASE_URL}${signature}`,
        fullName: `${firstname} ${lastname}`,
      };

      resolve({
        error: false,
        message: "Doctor details found.",
        data: {
          doctorDetails,
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getPaymentAwaitedOrders = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validatePaymentAwaitedOrders(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    let { page, searchBy, type } = req.body;
    let limit = 10;
    let skip = (page - 1) * limit;

    //if search by build search query

    let searchQuery;

    if (searchBy) {
      const users = await User.find({
        name: { $regex: `${searchBy}`, $options: "i" },
      });

      const userIds = users.map((user) => ({
        userId: { $eq: mongoose.Types.ObjectId(user._id) },
      }));

      searchQuery = [{ orderId: { $regex: `${searchBy}`, $options: "i" } }];

      if (userIds.length) {
        searchQuery = searchQuery.concat(userIds);
      }
    }

    let storeOrdersIds = [];

    if (req.isStore) {
      let storeOrders = await Order.find(
        {
          "storeDetails.storeId": mongoose.Types.ObjectId(req.user.id),
          orderStatus: { $ne: "cancelled" },
        },
        { _id: 1 }
      );

      storeOrdersIds = storeOrders.map((order) => ({
        orderObjectId: mongoose.Types.ObjectId(order._id),
      }));
    }

    let totalPayableDocumentsCount = await PaymentAwaited.countDocuments({
      type: "payable",
      ...(searchBy && {
        $or: searchQuery,
      }),
      ...(req.isStore && storeOrdersIds.length && { $or: storeOrdersIds }),
    });
    let totalReceivableDocumentsCount = await PaymentAwaited.countDocuments({
      type: "receivable",
      ...(searchBy && {
        $or: searchQuery,
      }),
      ...(req.isStore && storeOrdersIds.length && { $or: storeOrdersIds }),
    });

    let totalDocuments = 0;

    if (type === "payable") {
      totalDocuments = totalPayableDocumentsCount;
    } else {
      totalDocuments = totalReceivableDocumentsCount;
    }

    let totalPages = Math.floor(totalDocuments / limit);

    let paymentAwaitedOrders = await PaymentAwaited.aggregate([
      {
        $match: {
          status: "not paid",
          type,
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
          localField: "orderObjectId",
          foreignField: "_id",
          as: "order",
        },
      },
      {
        $match: {
          ...(req.isStore && {
            "order.storeDetails.storeId": mongoose.Types.ObjectId(req.user.id),
          }),
          "order.orderStatus": { $ne: "cancelled" },
        },
      },
      {
        $unwind: "$order",
      },
      {
        $project: {
          _id: 0,
          paymentAwaitedOrderId: "$_id",
          amountToBePaid: 1,
          userId: 1,
          userName: "$user.name",
          customerId: "$user.customerId",
          orderId: 1,
          orderObjectId: 1,
          noOfItems: 1,
          createdAt: "$order.createdAt",
          prescription: 1,
          products: 1,
          phoneNumber: "$user.phone",
          remarks: "$order.remarks",
          paymentType: "$order.paymentType",
          storeDetails: "$order.storeDetails",
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

    if (req.isStore) {
      paymentAwaitedOrders = paymentAwaitedOrders.filter(
        (paymentAwaitedOrder) => {
          return (
            paymentAwaitedOrder.storeDetails.storeId + "" == req.user._id + ""
          );
        }
      );
    }

    paymentAwaitedOrders.forEach((paymentAwaitedOrder) => {
      paymentAwaitedOrder.createdAt = moment(paymentAwaitedOrder.createdAt)
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY, hh:mm a");

      if (!paymentAwaitedOrder?.prescription?.length) {
        paymentAwaitedOrder.prescription = [];
      }

      //add s:no
      paymentAwaitedOrder.siNo = serialNoStarting;
      serialNoStarting++;
    });

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
      totalPayableDocumentsCount,
      totalReceivableDocumentsCount,
    };

    //check if user is premium member or not

    let premiumUsers = [];

    if (paymentAwaitedOrders.length) {
      premiumUsers = await PremiumUser.find({
        $or: paymentAwaitedOrders.map((order) => ({
          userId: mongoose.Types.ObjectId(order.userId),
        })),
        active: true,
        expired: false,
      });
    }

    for (const order of paymentAwaitedOrders) {
      if (
        _.find(premiumUsers, {
          userId: mongoose.Types.ObjectId(order.userId),
        })
      ) {
        order.premiumUser = true;
      } else {
        order.premiumUser = false;
      }
    }

    return res.json({
      error: false,
      message: paymentAwaitedOrders.length
        ? "Payment awaited orders found."
        : "Empty payment awaited orders.",
      data: {
        paymentAwaitedOrders,
        pageDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getPickupPendingOrders = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateGetPickupPendingOrders(req.body);
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

    //if search by build search query

    let searchQuery;

    if (searchBy) {
      const users = await User.find({
        name: { $regex: `${searchBy}`, $options: "i" },
      });

      const userIds = users.map((user) => ({
        userId: { $eq: mongoose.Types.ObjectId(user._id) },
      }));

      searchQuery = [
        { orderId: { $regex: `${searchBy}`, $options: "i" } },

        { "address.state": { $regex: `${searchBy}`, $options: "i" } },
        { "address.pincode": { $regex: `${searchBy}`, $options: "i" } },
        { packingDateString: { $regex: `${searchBy}`, $options: "i" } },
      ];

      if (userIds.length) {
        searchQuery = searchQuery.concat(userIds);
      }

      //search by delivery boy name

      const deliveryBoys = await DeliveryBoys.find({
        fullName: { $regex: `${searchBy}`, $options: "i" },
      });

      if (deliveryBoys.length) {
        const deliveryBoysIds = deliveryBoys.map((deliveryBoy) => ({
          deliveryBoyId: { $eq: mongoose.Types.ObjectId(deliveryBoy._id) },
        }));

        searchQuery = searchQuery.concat(deliveryBoysIds);
      }
    }

    let storeOrdersIds = [];

    if (req.isStore) {
      let storeOrders = await Order.find(
        { "storeDetails.storeId": mongoose.Types.ObjectId(req.user.id) },
        { _id: 1 }
      );

      storeOrdersIds = storeOrders.map((order) => ({
        orderObjectId: mongoose.Types.ObjectId(order._id),
      }));
    }

    let totalDocuments = await PickupPending.countDocuments({
      ...(searchBy
        ? {
            $or: searchQuery,
            $and: [
              { $or: [{ status: "pickup pending" }, { status: "declined" }] },
            ],
          }
        : {
            $or: [{ status: "pickup pending" }, { status: "declined" }],
          }),
      ...(req.isStore && storeOrdersIds.length && { $or: storeOrdersIds }),
    });

    let totalPages = Math.floor(totalDocuments / limit);

    let pickupPendingOrders = await PickupPending.aggregate([
      {
        $match: {
          ...(searchBy
            ? {
                $or: searchQuery,
                $and: [
                  {
                    $or: [{ status: "pickup pending" }, { status: "declined" }],
                  },
                ],
              }
            : {
                $or: [{ status: "pickup pending" }, { status: "declined" }],
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
          from: "orders",
          localField: "orderObjectId",
          foreignField: "_id",
          as: "orderDetails",
        },
      },
      {
        $match: {
          ...(req.isStore && {
            "orderDetails.storeDetails.storeId": mongoose.Types.ObjectId(
              req.user.id
            ),
          }),
        },
      },
      {
        $unwind: "$orderDetails",
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
      //delivery boy
      {
        $lookup: {
          from: "deliveryboys",
          localField: "deliveryBoyId",
          foreignField: "_id",
          as: "deliveryBoy",
        },
      },
      {
        $unwind: "$deliveryBoy",
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          userName: "$user.name",
          customerId: "$user.customerId",
          orderId: 1,
          orderObjectId: 1,
          noOfItems: 1,
          createdAt: "$orderDetails.createdAt",
          packedTime: "$createdAt",
          orderDetails: 1,
          products: 1,
          status: 1,
          storeLevel: 1,
          approvalTime: 1,
          address: 1,
          deliveryBoyName: "$deliveryBoy.fullName",
          deliveryBoyId: "$deliveryBoy.deliveryBoyId",
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

    // if (req.isStore) {
    //   pickupPendingOrders = pickupPendingOrders.filter((pickupPendingOrder) => {
    //     return (
    //       pickupPendingOrder.orderDetails.storeDetails.storeId+"" == req.user._id+""
    //     );
    //   });
    // }

    pickupPendingOrders.forEach((pickupPendingOrder) => {
      pickupPendingOrder.createdAt = moment(pickupPendingOrder.createdAt)
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY, hh:mm a");

      pickupPendingOrder.approvalTime = moment(pickupPendingOrder.packedTime)
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY, hh:mm a");

      //add s:no
      pickupPendingOrder.siNo = serialNoStarting;
      serialNoStarting++;
    });

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

    let premiumUsers = [];

    if (pickupPendingOrders.length) {
      //check if user is premium member or not

      premiumUsers = await PremiumUser.find({
        $or: pickupPendingOrders.map((order) => ({
          userId: mongoose.Types.ObjectId(order.userId),
        })),
        active: true,
        expired: false,
      });
    }

    for (const order of pickupPendingOrders) {
      if (
        _.find(premiumUsers, {
          userId: mongoose.Types.ObjectId(order.userId),
        })
      ) {
        order.premiumUser = true;
      } else {
        order.premiumUser = false;
      }
    }

    return res.json({
      error: false,
      message: pickupPendingOrders.length
        ? "Pickup pending orders found."
        : "Empty pickup pending orders.",
      data: {
        pickupPendingOrders,
        pageDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};

const sendPaymentLinkToUser = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateSendPaymentLinkToUser(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    const { paymentAwaitedOrderId } = req.body;

    //check if payment Awaited Order Id is valid

    const paymentAwaitedOrder = await PaymentAwaited.findOne({
      _id: paymentAwaitedOrderId,
    });

    if (!paymentAwaitedOrderId) {
      return res.json({
        error: true,
        message: "Invalid payment awaited order id.",
      });
    }

    // check if this payment awaited order is already paid

    if (paymentAwaitedOrder.status === "paid") {
      return res.json({
        error: true,
        message: "This payment awaited order is already paid by user.",
      });
    }

    if (paymentAwaitedOrder.type !== "receivable") {
      return res.json({
        error: true,
        message:
          "This payment awaited order is to receive from customer not to pay.",
      });
    }

    const amount = paymentAwaitedOrder.amountToBePaid * 100;

    //check if there is already a valid payment link if there is then send that link instead of creating new one

    const existingPaymentLink = await PaymentLink.findOne({
      status: { $ne: "payment failed" },
      paymentAwaitedOrderId: paymentAwaitedOrder._id,
    });

    if (existingPaymentLink) {
      return res.json({
        error: false,
        message: "Payment link was already created.",
        data: {
          paymentLink: existingPaymentLink.paymentLink,
        },
      });
    }

    const user = await User.findOne({ _id: paymentAwaitedOrder.userId });

    //create payment link

    const paymentLink = await razorpay.paymentLink.create({
      amount,
      currency: "INR",
      accept_partial: false,
      description:
        "Your order amount is changed please pay this money to confirm your order",
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
        type: "orderManagement",
      },
    });

    await PaymentLink({
      userId: paymentAwaitedOrder.userId,
      orderObjectId: paymentAwaitedOrder.orderObjectId,
      orderId: paymentAwaitedOrder.orderId,
      paymentAwaitedOrderId: paymentAwaitedOrder._id,
      paymentLink: paymentLink.short_url,
      paymentLinkRazorPayId: paymentLink.id,
    }).save();

    res.json({
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

const verifyPaymentAwaitedOrder = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateVerifyPaymentAwaitedOrder(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    const { paymentAwaitedOrderId } = req.body;

    //check if payment Awaited Order Id is valid

    const paymentAwaitedOrder = await PaymentAwaited.findOne({
      _id: paymentAwaitedOrderId,
    });

    if (!paymentAwaitedOrder) {
      return res.json({
        error: true,
        message: "Invalid payment awaited order id.",
      });
    }

    const paymentLink = await PaymentLink.findOne({
      paymentAwaitedOrderId: paymentAwaitedOrder._id,
      status: { $ne: "payment failed" },
    });

    if (!paymentLink) {
      return res.json({
        error: true,
        message: "Please send a payment link to user before verifying it.",
      });
    }

    if (paymentLink.status === "payment success") {
      return res.json({
        error: true,
        message: "Payment is already verified.",
      });
    }

    //verify payment

    const paymentStatus = await razorpay.paymentLink.fetch(
      paymentLink.paymentLinkRazorPayId
    );

    if (paymentStatus.status === "created") {
      return res.json({
        error: true,
        message: "Payment is not yet paid.",
      });
    }

    if (
      paymentStatus.status === "cancelled" ||
      paymentStatus.status === "failed"
    ) {
      await PaymentLink.updateOne(
        { _id: paymentLink._id },
        {
          status: "payment failed",
        }
      );

      return res.json({
        error: true,
        message: "User payment is failed send new payment link to user.",
      });
    }

    if (paymentStatus.status === "paid") {
      await PaymentLink.updateOne(
        { _id: paymentLink._id },
        {
          status: "payment success",
        }
      );

      //move payment awaited order to next tab
      await new ReviewPending({
        orderId: paymentAwaitedOrder.orderId,
        orderObjectId: paymentAwaitedOrder.orderObjectId,
        userId: paymentAwaitedOrder.userId,
        noOfItems: paymentAwaitedOrder.noOfItems,
        phoneNumber: paymentAwaitedOrder.phoneNumber,
        medicineProducts: paymentAwaitedOrder.products,
        prescription: paymentAwaitedOrder.prescription,
      }).save();

      //update payment awaited order to paid

      await PaymentAwaited.updateOne(
        {
          _id: paymentAwaitedOrderId,
        },
        {
          status: "paid",
        }
      );

      //update order status to order under review

      await Order.updateOne(
        {
          _id: paymentAwaitedOrder.orderObjectId,
        },
        {
          orderStatus: "order confirmed",
        }
      );

      return res.json({
        error: false,
        message: "user payment is verified moving order to review tab.",
      });
    }
  } catch (error) {
    next(error);
  }
};

const verifyPaymentByPaymentLinkId = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateVerifyPaymentByPaymentLinkId(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    let { paymentLinkRazorPayId } = req.body;

    const paymentLink = await PaymentLink.findOne({
      paymentLinkRazorPayId,
    });

    if (!paymentLink) {
      return res.json({
        error: true,
        message: "Invalid payment link id.",
      });
    }

    if (paymentLink.status === "payment success") {
      return res.json({
        error: true,
        message: "Payment is already verified.",
      });
    }

    if (paymentLink.status === "payment failed") {
      return res.json({
        error: true,
        message: "Payment was failed.",
      });
    }

    //if payment status in created state verify payment

    const paymentStatus = await razorpay.paymentLink.fetch(
      paymentLink.paymentLinkRazorPayId
    );

    if (paymentStatus.status === "created") {
      return res.json({
        error: true,
        message: "Payment is not yet paid.",
      });
    }

    if (
      paymentStatus.status === "cancelled" ||
      paymentStatus.status === "failed"
    ) {
      await PaymentLink.updateOne(
        { _id: paymentLink._id },
        {
          status: "payment failed",
          active: false,
        }
      );

      return res.json({
        error: true,
        message: "User payment is failed send new payment link to user.",
      });
    }

    if (!paymentStatus?.notes?.type) {
      paymentStatus.notes.type === "orderManagement";
    }

    if (paymentStatus.notes.type === "orderManagement") {
      if (paymentStatus.status === "paid") {
        await PaymentLink.updateOne(
          { _id: paymentLink._id },
          {
            status: "payment success",
          }
        );

        const paymentAwaitedOrder = await PaymentAwaited.findOne({
          _id: paymentLink.paymentAwaitedOrderId,
        });

        //move payment awaited order to next tab
        await new ReviewPending({
          orderId: paymentAwaitedOrder.orderId,
          orderObjectId: paymentAwaitedOrder.orderObjectId,
          userId: paymentAwaitedOrder.userId,
          noOfItems: paymentAwaitedOrder.noOfItems,
          phoneNumber: paymentAwaitedOrder.phoneNumber,
          medicineProducts: paymentAwaitedOrder.products,
          prescription: paymentAwaitedOrder.prescription,
        }).save();

        //update payment awaited order to paid

        await PaymentAwaited.updateOne(
          {
            _id: paymentAwaitedOrder._id,
          },
          {
            status: "paid",
          }
        );

        //update order status to order under review

        await Order.updateOne(
          {
            _id: paymentAwaitedOrder.orderObjectId,
          },
          {
            orderStatus: "order under review",
          }
        );

        return res.json({
          error: false,
          message: "Payment is verified your order is now under review.",
        });
      }
    } else if (paymentStatus.notes.type === "subscription") {
      if (paymentStatus.status === "paid") {
        await PaymentLink.updateOne(
          { _id: paymentLink._id },
          {
            status: "payment success",
            active: false,
          }
        );

        //update subscription paid status to true

        await UserSubscription.updateOne(
          {
            _id: paymentLink.subscriptionId,
          },
          {
            paid: true,
          }
        );

        return res.json({
          error: false,
          message: "Payment is verified.",
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

const getReviewPendingOrders = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateReviewPendingOrders(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    let { page, searchBy, type } = req.body;
    let limit = 10;
    let skip = (page - 1) * limit;

    //if search by build search query

    let searchQuery;

    if (searchBy) {
      const users = await User.find({
        name: { $regex: `${searchBy}`, $options: "i" },
      });

      const userIds = users.map((user) => ({
        userId: { $eq: mongoose.Types.ObjectId(user._id) },
      }));

      searchQuery = [{ orderId: { $regex: `${searchBy}`, $options: "i" } }];

      if (userIds.length) {
        searchQuery = searchQuery.concat(userIds);
      }
    }

    let storeOrdersIds = [];

    if (req.isStore) {
      let storeOrders = await Order.find(
        {
          "storeDetails.storeId": mongoose.Types.ObjectId(req.user.id),
          orderStatus: { $ne: "cancelled" },
        },
        { _id: 1 }
      );

      storeOrdersIds = storeOrders.map((order) => ({
        orderObjectId: mongoose.Types.ObjectId(order._id),
      }));
    }

    let totalDocuments = await ReviewPending.countDocuments({
      reviewStatus: "pending",
      ...(searchBy && {
        $or: searchQuery,
      }),
      ...(req.isStore && storeOrdersIds.length && { $or: storeOrdersIds }),
    });

    let totalPages = Math.floor(totalDocuments / limit);

    let reviewPendingOrders = await ReviewPending.aggregate([
      {
        $match: {
          reviewStatus: "pending",
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
          from: "orders",
          localField: "orderObjectId",
          foreignField: "_id",
          as: "orderDetails",
        },
      },
      {
        $match: {
          ...(req.isStore && {
            "orderDetails.storeDetails.storeId": mongoose.Types.ObjectId(
              req.user.id
            ),
          }),
          "orderDetails.orderStatus": { $ne: "cancelled" },
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
        $project: {
          _id: 0,
          ReviewPendingOrderId: "$_id",
          userId: 1,
          userName: "$user.name",
          customerId: "$user.customerId",
          orderId: 1,
          orderObjectId: 1,
          noOfItems: 1,
          createdAt: 1,
          medicineProducts: 1,
          phoneNumber: "$user.phone",
          prescription: 1,
          orderDetails: 1,
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

    if (req.isStore) {
      reviewPendingOrders = reviewPendingOrders.filter((reviewPendingOrder) => {
        return (
          reviewPendingOrder.orderDetails[0].storeDetails.storeId + "" ==
          req.user._id + ""
        );
      });
    }

    reviewPendingOrders.forEach((reviewPendingOrder) => {
      reviewPendingOrder.createdAt = moment(
        reviewPendingOrder.orderDetails[0].createdAt
      )
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY, hh:mm a");

      if (!reviewPendingOrder.prescription) {
        reviewPendingOrder.prescription = [];
      }

      //add s:no
      reviewPendingOrder.siNo = serialNoStarting;
      serialNoStarting++;
    });

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

    let premiumUsers = [];

    if (reviewPendingOrders.length) {
      //check if user is premium member or not

      premiumUsers = await PremiumUser.find({
        $or: reviewPendingOrders.map((order) => ({
          userId: mongoose.Types.ObjectId(order.userId),
        })),
        active: true,
        expired: false,
      });
    }

    for (const order of reviewPendingOrders) {
      if (
        _.find(premiumUsers, {
          userId: mongoose.Types.ObjectId(order.userId),
        })
      ) {
        order.premiumUser = true;
      } else {
        order.premiumUser = false;
      }
    }

    //set remarks

    reviewPendingOrders.map((order) => {
      order.remarks = order.orderDetails[0]?.remarks;
      if (!order.remarks) order.remarks = "";
    });

    return res.json({
      error: false,
      message: reviewPendingOrders.length
        ? "Review pending orders found."
        : "Empty review pending orders.",
      data: {
        reviewPendingOrders,
        pageDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};

const moveOrderToReviewPending = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateMoveOrderToReviewPending(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    const { paymentAwaitedOrderId } = req.body;

    //check if payment Awaited Order Id is valid

    const paymentAwaitedOrder = await PaymentAwaited.findOne({
      _id: paymentAwaitedOrderId,
    });

    if (!paymentAwaitedOrder) {
      return res.json({
        error: true,
        message: "Invalid payment awaited order id.",
      });
    }

    if (paymentAwaitedOrder.status === "admin moved") {
      return res.json({
        error: true,
        message: "Order is already moved by admin to next tab.",
      });
    }

    if (paymentAwaitedOrder.status === "paid") {
      return res.json({
        error: true,
        message:
          "Order is already moved to next tab after payment verification.",
      });
    }

    //move payment awaited order to next tab
    await new ReviewPending({
      orderId: paymentAwaitedOrder.orderId,
      orderObjectId: paymentAwaitedOrder.orderObjectId,
      userId: paymentAwaitedOrder.userId,
      noOfItems: paymentAwaitedOrder.noOfItems,
      phoneNumber: paymentAwaitedOrder.phoneNumber,
      medicineProducts: paymentAwaitedOrder.products,
      prescription: paymentAwaitedOrder.prescription,
    }).save();

    //update payment awaited order to paid

    await PaymentAwaited.updateOne(
      {
        _id: paymentAwaitedOrderId,
      },
      {
        status: "admin moved",
      }
    );

    //update order status to order under review

    await Order.updateOne(
      {
        _id: paymentAwaitedOrder.orderObjectId,
      },
      {
        orderStatus: "order under review",
      }
    );

    return res.json({
      error: false,
      message: "Order moved to Review Pending.",
    });
  } catch (error) {
    next(error);
  }
};
const updateDeliveryBoyToOrder = async (req, res, next) => {
  try {
    // //validate incoming data
    // const dataValidation = await validateAssignDeliveryBoyToOrder(req.body);
    // if (dataValidation.error) {
    //   const message = dataValidation.error.details[0].message.replace(/"/g, "");
    //   return res.status(200).json({
    //     error: true,
    //     message: message,
    //   });
    // }

    const { id, deliveryBoyId } = req.body;

    //check order id id valid

    const order = await PickupPending.findOne({ _id: id });

    if (!order) {
      return res.json({ error: true, message: "Invalid order Id" });
    }

    //check if deliver boy is valid

    const deliveryBoy = await DeliveryBoys.findOne({
      _id: deliveryBoyId,
      isActive: true,
      isApproved: "approved",
    });

    if (!deliveryBoy) {
      return res.json({ error: true, message: "Invalid delivery boy Id" });
    }

    const pinCode = order.address.pincode;

    //get pincode object id from store

    const store = await Store.findOne({
      serviceablePincodes: { $elemMatch: { code: pinCode } },
    });

    if (!store) {
      return res.json({
        error: true,
        message: "Pin code is not serviceable.",
      });
    }

    let { _id: pinCodeId } =
      _.find(store.serviceablePincodes, {
        code: pinCode,
      }) || {};

    //check if delivery boy serviceable for this order pin code

    let serviceableDeliveryBoy = _.find(deliveryBoy.pincode, pinCodeId);

    if (!serviceableDeliveryBoy) {
      return res.json({
        error: true,
        message: `This delivery boy does not have delivery in ${pinCode} pin code.`,
      });
    }

    //update delivery boy
    await PickupPending.updateOne(
      { _id: id },
      {
        $set: {
          deliveryBoyId: deliveryBoyId,
          status: "pickup pending",
        },
      }
    );

    return res.json({
      error: false,
      message: "Order successfully update to delivery boy.",
    });
  } catch (error) {
    next(error);
  }
};
const getTransitOrders = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateGetPickupPendingOrders(req.body);
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

    //if search by build search query

    let searchQuery;

    if (searchBy) {
      const users = await User.find({
        name: { $regex: `${searchBy}`, $options: "i" },
      });

      const userIds = users.map((user) => ({
        userId: { $eq: mongoose.Types.ObjectId(user._id) },
      }));

      searchQuery = [{ orderId: { $regex: `${searchBy}`, $options: "i" } }];

      if (userIds.length) {
        searchQuery = searchQuery.concat(userIds);
      }
    }

    let storeOrdersIds = [];

    if (req.isStore) {
      let storeOrders = await Order.find(
        { "storeDetails.storeId": mongoose.Types.ObjectId(req.user.id) },
        { _id: 1 }
      );

      storeOrdersIds = storeOrders.map((order) => ({
        orderObjectId: mongoose.Types.ObjectId(order._id),
      }));
    }

    let totalDocuments = await PickupPending.countDocuments({
      status: "picked up",
      ...(searchBy && {
        $or: searchQuery,
      }),
      ...(req.isStore && storeOrdersIds.length && { $or: storeOrdersIds }),
    });

    let totalPages = Math.floor(totalDocuments / limit);

    let pickupPendingOrders = await PickupPending.aggregate([
      {
        $match: {
          status: "picked up",
          ...(searchBy && {
            $or: searchQuery,
          }),
        },
      },
      {
        $sort: {
          pickedUpDate: -1,
        },
      },
      {
        $lookup: {
          from: "deliveryboys",
          localField: "deliveryBoyId",
          foreignField: "_id",
          as: "deliveryBoyDetails",
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "orderObjectId",
          foreignField: "_id",
          as: "orderDetails",
        },
      },
      {
        $match: {
          ...(req.isStore && {
            "orderDetails.storeDetails.storeId": mongoose.Types.ObjectId(
              req.user.id
            ),
          }),
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
        $project: {
          _id: 1,
          userId: 1,
          userName: "$user.name",
          customerId: "$user.customerId",
          orderId: 1,
          orderObjectId: 1,
          noOfItems: 1,
          createdAt: 1,
          products: 1,
          pickedUpDate: 1,
          address: 1,
          orderDetails: 1,
          deliveryBoy: {
            $cond: {
              if: {
                $ne: ["$deliveryBoyDetails", []],
              },
              then: "$deliveryBoyDetails.fullName",
              else: "",
            },
          },
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

    // if (req.isStore) {
    //   pickupPendingOrders = pickupPendingOrders.filter((pickupPendingOrder) => {
    //     return (
    //       pickupPendingOrder.orderDetails[0].storeDetails.storeId+"" ==
    //       req.user._id+""
    //     );
    //   });
    // }

    pickupPendingOrders.forEach((pickupPendingOrder) => {
      pickupPendingOrder.createdAt = moment(
        pickupPendingOrder.orderDetails[0].createdAt
      )
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY, hh:mm a");
      pickupPendingOrder.pickedUpDate = moment(pickupPendingOrder.pickedUpDate)
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY, hh:mm a");

      //add s:no
      pickupPendingOrder.siNo = serialNoStarting;
      serialNoStarting++;
    });

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

    let premiumUsers = [];

    if (pickupPendingOrders.length) {
      premiumUsers = await PremiumUser.find({
        $or: pickupPendingOrders.map((order) => ({
          userId: mongoose.Types.ObjectId(order.userId),
        })),
        active: true,
        expired: false,
      });
    }

    for (const order of pickupPendingOrders) {
      if (
        _.find(premiumUsers, {
          userId: mongoose.Types.ObjectId(order.userId),
        })
      ) {
        order.premiumUser = true;
      } else {
        order.premiumUser = false;
      }
    }

    return res.json({
      error: false,
      message: pickupPendingOrders.length
        ? "Transit orders found."
        : "Empty transit pending orders.",
      data: {
        pickupPendingOrders,
        pageDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};

const refundPayableRazorPay = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateRefundPayableRazorPay(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    const { orderId, paymentAwaitedOrderId } = req.body;

    //check if paymentAwaitedOrderId is valid

    const paymentAwaitedOrder = await PaymentAwaited.findOne({
      _id: paymentAwaitedOrderId,
    });

    if (!paymentAwaitedOrder) {
      return res.json({
        error: true,
        message: "Invalid payment awaited order ID.",
      });
    }

    if (paymentAwaitedOrder.status === "paid") {
      return res.json({
        error: true,
        message: "Refund already initiated.",
      });
    }

    if (paymentAwaitedOrder.type !== "payable") {
      return res.json({
        error: true,
        message: "Payment awaited order type should be payable.",
      });
    }

    //check if order id is valid

    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      return res.json({
        error: true,
        message: "Invalid order ID.",
      });
    }

    const payment = await Payments.findOne({ orderObjectId: orderId });

    if (!payment) {
      return res.json({
        error: true,
        message: "Can't find payment info with this order id.",
      });
    }

    //refund

    const refund = await razorpay.payments.refund(payment.paymentId, {
      amount: paymentAwaitedOrder.amountToBePaid * 100,
    });

    //save payment log

    await new Payments({
      userId: order.userId,
      orderObjectId: orderId,
      paymentId: refund.payment_id,
      refundId: refund.id,
      type: "refund, payment awaited payable",
    }).save();

    //move order to review pending

    await new ReviewPending({
      orderId: paymentAwaitedOrder.orderId,
      orderObjectId: paymentAwaitedOrder.orderObjectId,
      userId: paymentAwaitedOrder.userId,
      noOfItems: paymentAwaitedOrder.noOfItems,
      phoneNumber: paymentAwaitedOrder.phoneNumber,
      medicineProducts: paymentAwaitedOrder.products,
      prescription: paymentAwaitedOrder.prescription,
    }).save();

    //update payment awaited order

    await PaymentAwaited.updateOne(
      {
        _id: paymentAwaitedOrderId,
      },
      {
        status: "paid",
      }
    );

    res.json({
      error: false,
      message:
        "Refund initiated, customer will receive the refund within 5-7 working days.",
    });
  } catch (error) {
    next(error);
  }
};

const refundPayableMedCoin = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateRefundPayableMedCoin(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    const { paymentAwaitedOrderId } = req.body;

    //check if paymentAwaitedOrderId is valid

    const paymentAwaitedOrder = await PaymentAwaited.findOne({
      _id: paymentAwaitedOrderId,
    });

    if (!paymentAwaitedOrder) {
      return res.json({
        error: true,
        message: "Invalid payment awaited order ID.",
      });
    }

    if (paymentAwaitedOrder.status === "paid") {
      return res.json({
        error: true,
        message: "Refund already provided.",
      });
    }

    if (paymentAwaitedOrder.type !== "payable") {
      return res.json({
        error: true,
        message: "Payment awaited order type should be payable.",
      });
    }

    if (!paymentAwaitedOrder.amountToBePaid) {
      paymentAwaitedOrder.amountToBePaid = 0;
    }
    //update admin med coin balance

    await incrementOrDecrementAdminMedCoinBalance(
      "dec",
      paymentAwaitedOrder.amountToBePaid
    );

    //update user med coin count

    await User.updateOne(
      { _id: paymentAwaitedOrder.userId },
      {
        $inc: { medCoin: paymentAwaitedOrder.amountToBePaid },
      }
    );

    //create statement for this med coin transaction

    //admin balance
    let { availableBalance: balance } = (await doGetMedCoinDetails()) || {};
    if (!balance) balance = 0;

    //user balance

    const user = await User.findOne({ _id: paymentAwaitedOrder.userId });

    await MedCoin({
      medCoinCount: paymentAwaitedOrder.amountToBePaid,
      type: "refund",
      customerId: paymentAwaitedOrder.userId,
      balance,
      customerBalance: user.medCoin,
    }).save();

    //update payment awaited order

    await PaymentAwaited.updateOne(
      {
        _id: paymentAwaitedOrderId,
      },
      {
        status: "paid",
      }
    );

    //move order to review pending

    await new ReviewPending({
      orderId: paymentAwaitedOrder.orderId,
      orderObjectId: paymentAwaitedOrder.orderObjectId,
      userId: paymentAwaitedOrder.userId,
      noOfItems: paymentAwaitedOrder.noOfItems,
      phoneNumber: paymentAwaitedOrder.phoneNumber,
      medicineProducts: paymentAwaitedOrder.products,
      prescription: paymentAwaitedOrder.prescription,
    }).save();

    res.json({
      error: false,
      message: "Med coin paid to user successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const doAcceptOrRejectReviewPendingOrder = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //validate incoming data
      const dataValidation = await validateAcceptOrRejectReviewPendingOrder(
        data
      );
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

      const { type, reviewPendingOrderId } = data;

      //check if review pending order is valid

      const reviewPending = await ReviewPending.findOne({
        _id: reviewPendingOrderId,
      });

      if (!reviewPending) {
        return resolve({
          error: true,
          message: "Invalid review pending order.",
        });
      }

      if (reviewPending.reviewStatus !== "pending") {
        return resolve({
          error: true,
          message: `Review pending is already ${reviewPending.reviewStatus}ed.`,
        });
      }

      const order = await Order.findOne({
        _id: reviewPending.orderObjectId,
      });

      //move order to next tab

      if (type === "accept") {
        await new PackingPending({
          orderId: order.orderId,
          orderObjectId: order._id,
          userId: order.userId,
          noOfItems: order.products.length,
          storeLevel: order.storeDetails?.storeLevel,
          storeId: order.storeDetails?.storeId,
          products: order.products,
          approvalTime: new Date(),
          shippingZone: `${order.address.state} ${order.address.pincode}`,
        }).save();
      }

      //update review pending order

      await ReviewPending.updateOne(
        {
          _id: reviewPendingOrderId,
        },
        {
          reviewStatus: type,
        }
      );

      //update order status
      await Order.updateOne(
        {
          _id: reviewPending.orderObjectId,
        },
        {
          orderStatus:
            type === "accept" ? "order under review" : "pharmacy rejected",
          pharmacyRejectedDate: type === "accept" ? null : new Date(),
        }
      );

      resolve({
        error: false,
        message:
          type === "accept"
            ? "Order Approved Successfully"
            : "Order Rejected successfully",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const acceptOrRejectReviewPendingOrder = async (req, res, next) => {
  try {
    await doAcceptOrRejectReviewPendingOrder(req.body).then((response) => {
      res.json(response);
    });
  } catch (error) {
    next(error);
  }
};

const getDeliveredOrders = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateGetPickupPendingOrders(req.body);
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

    //if search by build search query

    let searchQuery;

    if (searchBy) {
      const users = await User.find({
        name: { $regex: `${searchBy}`, $options: "i" },
      });

      const userIds = users.map((user) => ({
        userId: { $eq: mongoose.Types.ObjectId(user._id) },
      }));

      searchQuery = [{ orderId: { $regex: `${searchBy}`, $options: "i" } }];

      if (userIds.length) {
        searchQuery = searchQuery.concat(userIds);
      }
    }

    let storeOrdersIds = [];

    if (req.isStore) {
      let storeOrders = await Order.find(
        { "storeDetails.storeId": mongoose.Types.ObjectId(req.user.id) },
        { _id: 1 }
      );

      storeOrdersIds = storeOrders.map((order) => ({
        orderObjectId: mongoose.Types.ObjectId(order._id),
      }));
    }

    let totalDocuments = await PickupPending.countDocuments({
      status: "delivered",
      ...(searchBy && {
        $or: searchQuery,
      }),
      ...(req.isStore && storeOrdersIds.length && { $or: storeOrdersIds }),
    });

    let totalPages = Math.floor(totalDocuments / limit);

    let pickupPendingOrders = await PickupPending.aggregate([
      {
        $match: {
          status: "delivered",
          ...(searchBy && {
            $or: searchQuery,
          }),
        },
      },
      {
        $sort: {
          deliveredDate: -1,
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "orderObjectId",
          foreignField: "_id",
          as: "orderDetails",
        },
      },
      {
        $match: {
          ...(req.isStore && {
            "orderDetails.storeDetails.storeId": mongoose.Types.ObjectId(
              req.user.id
            ),
          }),
        },
      },
      {
        $lookup: {
          from: "deliveryboys",
          localField: "deliveryBoyId",
          foreignField: "_id",
          as: "deliveryBoyDetails",
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
        $project: {
          _id: 1,
          userId: 1,
          userName: "$user.name",
          customerId: "$user.customerId",
          orderId: 1,
          orderObjectId: 1,
          noOfItems: 1,
          deliveredDate: 1,
          createdAt: 1,
          products: 1,
          orderDetails: 1,
          address: 1,
          deliveryBoy: {
            $cond: {
              if: {
                $ne: ["$deliveryBoyDetails", []],
              },
              then: "$deliveryBoyDetails.fullName",
              else: "",
            },
          },
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

    // if (req.isStore) {
    //   pickupPendingOrders = pickupPendingOrders.filter((pickupPendingOrder) => {
    //     return (
    //       pickupPendingOrder.orderDetails[0].storeDetails.storeId+"" ==
    //       req.user._id+""
    //     );
    //   });
    // }

    pickupPendingOrders.forEach((pickupPendingOrder) => {
      pickupPendingOrder.createdAt = moment(
        pickupPendingOrder.orderDetails[0].createdAt
      )
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY, hh:mm a");
      pickupPendingOrder.deliveredDate = moment(
        pickupPendingOrder.deliveredDate
      )
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY, hh:mm a");

      //add s:no
      pickupPendingOrder.siNo = serialNoStarting;
      serialNoStarting++;
    });

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

    let premiumUsers = [];

    if (pickupPendingOrders.length) {
      premiumUsers = await PremiumUser.find({
        $or: pickupPendingOrders.map((order) => ({
          userId: mongoose.Types.ObjectId(order.userId),
        })),
        active: true,
        expired: false,
      });
    }

    for (const order of pickupPendingOrders) {
      if (
        _.find(premiumUsers, {
          userId: mongoose.Types.ObjectId(order.userId),
        })
      ) {
        order.premiumUser = true;
      } else {
        order.premiumUser = false;
      }
    }

    return res.json({
      error: false,
      message: pickupPendingOrders.length
        ? "Pickup pending orders found."
        : "Empty pickup pending orders.",
      data: {
        pickupPendingOrders,
        pageDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getHealthDataByUserId = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateGetHealthDataByUser(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    const { userId } = req.body;

    //check if user is valid

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.json({
        error: true,
        message: "Invalid User Id.",
      });
    }

    //get health data

    const healthData = await HealthVault.aggregate([
      {
        $match: {
          userId,
        },
      },
      //get patient id if patient exist

      {
        $lookup: {
          from: "userfamilies",
          localField: "patientId",
          foreignField: "_id",
          as: "patient",
        },
      },

      {
        $unwind: { path: "$patient", preserveNullAndEmptyArrays: true },
      },

      {
        $project: {
          prescription: { $concat: [process.env.BASE_URL, "$prescription"] },
          healthDataId: "$_id",
          _id: 0,
          patientId: 1,
          category: 1,
          userId: 1,
          patientName: "$patient.name",
        },
      },
    ]);

    healthData.map((data) => {
      data.userName = user.name;
    });

    if (!healthData?.length) {
      return res.json({
        error: true,
        message: "This user does not have any health data.",
      });
    }

    return res.json({
      error: false,
      message: "health data found.",
      data: {
        healthData,
      },
    });
  } catch (error) {
    next(error);
  }
};

const doGetProductDetailsByProductAndVariantId = (
  productId,
  variantId,
  quantity = 1
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let products = await Products.aggregate([
        //get all cart based on user  id
        {
          $match: {
            _id: mongoose.Types.ObjectId(productId),
            pricing: {
              $elemMatch: {
                _id: mongoose.Types.ObjectId(variantId),
              },
            },
          },
        },

        {
          $project: {
            pricing: {
              //only get the variant that variant id and variant id saved in cart are equal
              $filter: {
                input: "$pricing",
                as: "pricing",
                cond: {
                  $eq: ["$$pricing._id", mongoose.Types.ObjectId(variantId)],
                },
              },
            },

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

        {
          $unwind: "$pricing",
        },
        //brand

        {
          $lookup: {
            from: "masterbrands",
            localField: "brand",
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
            localField: "pricing.sku",
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
            variantId: mongoose.Types.ObjectId(variantId),
            product_id: mongoose.Types.ObjectId(productId),
            productName: "$name",
            brandName: "$brand.title",
            type: "$type",
            description: "$description",
            IsPrescriptionRequired: "$prescription",
            image: { $concat: [imgPath, { $first: "$pricing.image" }] },
            price: "$pricing.price",
            offerType: "$offerType",
            specialPrice: "$pricing.specialPrice",
            uomValue: "$uomValue.uomValue",
            discountAmount: {
              $subtract: ["$pricing.price", "$pricing.specialPrice"],
            },
            discountInPercentage: {
              $multiply: [
                {
                  $divide: [
                    {
                      $subtract: ["$pricing.price", "$pricing.specialPrice"],
                    },
                    "$pricing.price",
                  ],
                },
                100,
              ],
            },
          },
        },
        { $addFields: { outOfStock: false, quantity } },
      ]);

      //check for stock

      const { stockAvailable } =
        (await checkIfStockAvailable({
          variantId: variantId,
          productId: productId,
          quantity: 1,
          userId: variantId,
        })) || {};

      const product = products?.length ? products[0] : {};

      if (!stockAvailable) product.outOfStock = true;

      resolve(product);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getPrescriptionAwaitedOrders,
  rejectPrescriptionAwaitedOrder,
  createPrescription,
  getPackingPendingOrders,
  getPickupPendingOrders,
  getDeliveryBoysByOrderId,
  getOrderInvoiceByOrderId,
  assignDeliveryBoyToOrder,
  updateRemarks,
  getDoctorDetails,
  getPaymentAwaitedOrders,
  sendPaymentLinkToUser,
  verifyPaymentAwaitedOrder,
  verifyPaymentByPaymentLinkId,
  getReviewPendingOrders,
  moveOrderToReviewPending,
  updateDeliveryBoyToOrder,
  getTransitOrders,
  refundPayableRazorPay,
  refundPayableMedCoin,
  acceptOrRejectReviewPendingOrder,
  getDeliveredOrders,
  getHealthDataByUserId,
  doGetProductDetailsByProductAndVariantId,
  doAcceptOrRejectReviewPendingOrder,
};
