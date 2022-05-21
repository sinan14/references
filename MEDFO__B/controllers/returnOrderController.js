const _ = require("lodash");
const mongoose = require("mongoose");
const moment = require("moment");
let API_KEY = process.env.OTPAPIKEY;
const TwoFactor = new (require("2factor"))(API_KEY);

const returnOrders = require("../models/returnOrders");
const returnOrderReason = require("../models/returnOrderReason");
const Order = require("../models/orders/order");
const DeliveryBoys = require("../models/delivery/deliveryBoys");
const Store = require("../models/store");
const User = require("../models/user");
const Products = require("../models/Product");
const Payments = require("../models/payments/payments");
const DeliveryBoyCredit = require("../models/delivery/deliveryBoyCredit");
const DeliveryBoyNotification = require("../models/delivery/deliveryBoyNotification");
const MedCoin = require("../models/medcoin/medCoin");
const MedCoinDetails = require("../models/medcoin/medCoinDetails");
const Inventory = require("../models/inventory");
const UserAddress = require("../models/userAddress");
const {
    incrementOrDecrementAdminMedCoinBalance,
} = require("../controllers/medcoin/medCoinController");
const { razorpay } = require("../constants/paymentGateways/paymentGateway");
const {
    generateRefundIssuedEMailTemplate,
} = require("../email/templates/order");
const {
    generateOrderCancelledEMailTemplate,
} = require("../email/templates/order");
const {
    generateOrderReturnRequestEMailTemplate,
} = require("../email/templates/order");
const { sendMail } = require("../email/email");

const {
    validateGetRefundableAmount,
} = require("../validations/order/orderValidation");

//capitalize only the first letter of the string.
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
    getRefundableAmount: async (req, res, next) => {
        // try {
        //     // ### validating incoming data
        //     const dataValidation = await validateGetRefundableAmount(req.body);
        //     if (dataValidation.error) {
        //         const message = dataValidation.error.details[0].message.replace(
        //             /"/g,
        //             ""
        //         );
        //         return res.status(200).json({
        //             error: true,
        //             message: message,
        //         });
        //     }

        //     // ### validating order Id
        //     let orderDetails = await Order.findOne({ _id: req.body.orderId });
        //     if (!orderDetails) {
        //         return res.json({
        //             error: true,
        //             message: "Invalid orderId",
        //         });
        //     }

        //     // ### Calculations of Amounts
        //     let refundableAmount = 0;
        //     let reducableTotalAmount = 0;
        //     let reducableAmountFromEachProduct = 0;
        //     let couponDiscount = 0;
        //     let memberDiscount = 0;

        //     reducableTotalAmount =
        //         orderDetails.cartDetails.couponAppliedDiscount +
        //         orderDetails.cartDetails.memberDiscount
        //     // orderDetails.cartDetails.donationAmount;

        //     reducableAmountFromEachProduct = reducableTotalAmount / orderDetails.products.length;

        //     for (let i of req.body.products) {
        //         let selectedProduct = orderDetails.products.find(
        //             (product) => product.variantId == i
        //         );

        //         if (selectedProduct) {
        //             let reducableMemberDiscountOfThisProduct = 0;
        //             let reducableCouponDiscountOfThisProduct = 0;

        //             // member discount
        //             if (orderDetails.cartDetails.memberDiscount > 0) {
        //                 reducableMemberDiscountOfThisProduct = (selectedProduct.specialPrice * selectedProduct.quantity * 10) / 100;
        //                 memberDiscount += reducableMemberDiscountOfThisProduct;
        //             }

        //             // coupon discount
        //             if (orderDetails.cartDetails.couponAppliedDiscount > 0) {
        //                 reducableCouponDiscountOfThisProduct = (selectedProduct.specialPrice * selectedProduct.quantity * 5) / 100;
        //                 couponDiscount += reducableCouponDiscountOfThisProduct;
        //             }

        //             let totalReducableAmountOfThisProduct = reducableMemberDiscountOfThisProduct + reducableCouponDiscountOfThisProduct;

        //             refundableAmount +=
        //                 selectedProduct.specialPrice * selectedProduct.quantity -
        //                 totalReducableAmountOfThisProduct;
        //         }
        //     }

        //     let deliveryCharge = 0;
        //     if (req.body.products.length == orderDetails.products.length && orderDetails.cartDetails.isThisCartEligibleForFreeDelivery == false) {
        //         deliveryCharge = orderDetails.cartDetails.deliveryCharge;
        //         refundableAmount = refundableAmount + deliveryCharge;
        //     }

        //     refundableAmount = refundableAmount.toFixed(2);

        //     return res.status(200).json({
        //         error: false,
        //         message: "refundable amount",
        //         data: {
        //             refundableAmount,
        //             memberDiscount,
        //             deliveryCharge
        //         },
        //     });
        // } catch (error) {
        //     next(error);
        // }

        // Old Function without percentage wise calculation of member discount and coupon discount
        try {
            //validate incoming data
            const dataValidation = await validateGetRefundableAmount(req.body);
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

            let refundableAmount = 0;
            let reducableTotalAmount = 0;
            let reducableAmountFromEachProduct = 0;
            let orderDetails = await Order.findOne({ _id: req.body.orderId });
            if (!orderDetails) {
                return res.json({
                    error: true,
                    message: "Invalid orderId",
                });
            }

            reducableTotalAmount =
                orderDetails.cartDetails.couponAppliedDiscount +
                orderDetails.cartDetails.memberDiscount;
            // orderDetails.cartDetails.donationAmount;

            console.log("reducableTotalAmount:", reducableTotalAmount);
            console.log("req.body.products.length:", req.body.products.length);

            reducableAmountFromEachProduct =
                reducableTotalAmount / orderDetails.products.length;
            console.log(
                "reducableAmountFromEachProduct:",
                reducableAmountFromEachProduct
            );

            for (let i of req.body.products) {
                let selectedProduct = orderDetails.products.find(
                    (product) => product.variantId == i
                );
                console.log("selectedProduct__:", selectedProduct);
                if (selectedProduct) {
                    refundableAmount +=
                        selectedProduct.specialPrice * selectedProduct.quantity -
                        reducableAmountFromEachProduct;
                    console.log(
                        "Each reduced product price:____",
                        selectedProduct.specialPrice * selectedProduct.quantity -
                        reducableAmountFromEachProduct
                    );
                    console.log("refundableAmount:____", refundableAmount);
                }
            }

            let memberDiscount = orderDetails.cartDetails.memberDiscount;
            if (orderDetails.cartDetails.memberDiscount == 0) {
                memberDiscount =
                    (orderDetails.cartDetails.memberDiscount /
                        orderDetails.products.length) *
                    req.body.products.length;
            }

            let deliveryCharge = 0;
            if (
                req.body.products.length == orderDetails.products.length &&
                orderDetails.cartDetails.isThisCartEligibleForFreeDelivery == false
            ) {
                deliveryCharge = orderDetails.cartDetails.deliveryCharge;
                refundableAmount = refundableAmount + deliveryCharge;
            }

            refundableAmount = refundableAmount.toFixed(2);

            return res.status(200).json({
                error: false,
                message: "refundable amount",
                data: {
                    refundableAmount,
                    memberDiscount,
                    deliveryCharge,
                },
            });
        } catch (error) {
            next(error);
        }
    },
    getReturnRequests: async (req, res, next) => {
        try {
            if (!req.body.page) {
                return res.json({
                    error: true,
                    message: "Essential params missing",
                });
            }

            let pageNo = req.body.page;
            let pageSize = 10;

            let searchBy = req.body.searchBy;
            if (searchBy) {
                const users = await User.find({
                    name: { $regex: `${searchBy}`, $options: "i" },
                });

                const userIds = users.map((user) => ({
                    userId: { $eq: mongoose.Types.ObjectId(user._id) },
                }));

                searchQuery = [
                    { orderId: { $regex: `${searchBy}`, $options: "i" } },
                    { returnId: { $regex: `${searchBy}`, $options: "i" } },
                    { noOfItems: { $regex: `${searchBy}`, $options: "i" } },
                ];

                if (userIds.length) {
                    searchQuery = searchQuery.concat(userIds);
                }
            }

            let aggregateQuery = returnOrders.aggregate([
                {
                    $match: {
                        status: "requested",
                        ...(searchBy && {
                            $or: searchQuery,
                        }),
                    },
                },
                {
                    $lookup: {
                        from: "returnorderreasons",
                        localField: "orderObjectId",
                        foreignField: "orderId",
                        as: "reasons",
                    },
                },
                {
                    $set: {
                        reasons: { $arrayElemAt: ["$reasons.reason", 0] },
                        notes: { $arrayElemAt: ["$reasons.notes", 0] },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails",
                    },
                },
                {
                    $lookup: {
                        from: "premiumusers",
                        localField: "userId",
                        foreignField: "userId",
                        as: "premiumuserDetails",
                    },
                },
                {
                    $set: {
                        premiumuser: {
                            $cond: {
                                if: { $ne: ["$premiumuserDetails", []] },
                                then: true,
                                else: false,
                            },
                        },
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
                    $unwind: {
                        path: "$orderDetails",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        returnId: 1,
                        returnDate: "$createdAt",
                        orderId: 1,
                        orderDate: "$orderDetails.createdAt",
                        orderObjectId: 1,
                        noOfItems: { $size: "$products" },
                        reasons: 1,
                        notes: 1,
                        refundableAmount: 1000,
                        products: 1,
                        dateTime: "$formattedDateTime",
                        orderDetails: {
                            address: "$orderDetails.address",
                            paymentType: "$orderDetails.paymentType",
                            returnDate: "$createdAt",
                            orderDate: "$orderDetails.createdAt",
                            deliveryDate: "$deliveryDate",
                        },
                        paymentType: 1,
                        premiumuser: 1,
                        name: { $first: "$userDetails.name" },
                        customerId: { $first: "$userDetails.customerId" },
                    },
                },
                {
                    $sort: {
                        _id: -1,
                    },
                },
            ]);

            const customLabels = {
                totalDocs: "TotalRecords",
                docs: "returnRequests",
                limit: "PageSize",
                page: "CurrentPage",
            };
            const aggregatePaginateOptions = {
                page: pageNo,
                limit: pageSize,
                customLabels: customLabels,
            };
            let response = await returnOrders.aggregatePaginate(
                aggregateQuery,
                aggregatePaginateOptions
            );

            let serialNoStarting = (parseInt(pageNo) - 1) * 10 + 1;

            response.returnRequests.forEach((returnRequest) => {
                // returnRequest.createdAt = moment(returnRequest.createdAt)
                //     .tz(process.env.TIME_ZONE)
                //     .format("MMM DD YYYY, hh:mm a");

                //add sl.no
                returnRequest.slNo = serialNoStarting;
                serialNoStarting++;

                if (
                    returnRequest.orderDetails.paymentType != "cod" &&
                    returnRequest.paymentType == "bank"
                ) {
                    returnRequest.paymentType = "online payment";
                }

                returnRequest.paymentType = capitalizeFirstLetter(
                    returnRequest.paymentType
                );

                returnRequest.returnDate = moment(returnRequest.returnDate)
                    .tz(process.env.TIME_ZONE)
                    .format("MMM DD YYYY, hh:mm a");

                returnRequest.orderDate = moment(returnRequest.orderDate)
                    .tz(process.env.TIME_ZONE)
                    .format("MMM DD YYYY, hh:mm a");
            });

            let pickUpStatuses = [
                "pickup pending",
                "accepted",
                "rejected",
                "collected",
                "submitted",
            ];
            let pickupCount = await returnOrders.countDocuments({
                status: { $in: pickUpStatuses },
            });

            let qualityCheck = await returnOrders.countDocuments({
                status: "quality check",
            });

            let approvedCount = await returnOrders.countDocuments({
                "products.returnStatus": "approved",
            });

            let declinedCount = await returnOrders.countDocuments({
                "products.returnStatus": "declined",
            });

            response.count_returnRequests = response.TotalRecords;
            response.count_returnPickup = pickupCount;
            response.count_qualityCheck = qualityCheck;
            response.count_approved = approvedCount;
            response.count_declined = declinedCount;

            return res.status(200).json({
                error: false,
                message: "return requests are",
                data: response,
            });
        } catch (error) {
            next(error);
        }
    },
    assignReturnRequestToDeliveryBoy: async (req, res, next) => {
        try {
            const { id, deliveryBoyId } = req.body;

            //check order id id valid
            const order = await returnOrders.findOne({ _id: id });

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

            console.log("pinCode:", pinCode);

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

            let returnOrderDetails = await returnOrders.findOne({ _id: id });

            if (
                returnOrderDetails.status != "pickup pending" &&
                returnOrderDetails.status != "rejected" &&
                returnOrderDetails.status != "accepted" &&
                returnOrderDetails.status != "requested"
            ) {
                return res.json({
                    error: true,
                    message: `Cannot change delivery boy at this stage`,
                });
            }

            await new DeliveryBoyCredit({
                deliveryBoyId: deliveryBoy._id,
                orderObjectId: order._id,
                orderId: order.orderId,
                credit: 0,
                debit: lastOrderDebit,
                balance: lastOrderBalance,
            }).save();
            //update delivery boy
            await returnOrders.updateOne(
                { _id: id },
                {
                    $set: {
                        deliveryBoyId: deliveryBoyId,
                        status: "pickup pending",
                        deliveryBoyAssignedDate: new Date(),
                    },
                }
            );

            // update order status
            await Order.updateOne(
                { _id: returnOrderDetails.orderObjectId },
                {
                    $set: {
                        orderStatus: "return approved",
                    },
                }
            );

            //add order details to deliveryBoy notification

            await new DeliveryBoyNotification({
                DeliveryBoyID: deliveryBoyId,
                orderObjectId: order._id,
                orderId: order.orderId,
                paymentType: order.paymentType,
                type: "Return",
                userId: order.userId,
                cartDetails: order.cartDetails,
                assignedDate: moment(new Date()).tz(process.env.TIME_ZONE),
            }).save();

            return res.json({
                error: false,
                message: "Order successfully assigned to delivery boy.",
            });
        } catch (error) {
            next(error);
        }
    },
    getReturnPickup: async (req, res, next) => {
        try {
            if (!req.body.page) {
                return res.json({
                    error: true,
                    message: "Essential params missing",
                });
            }
            let pageNo = req.body.page;
            let pageSize = 10;

            let searchBy = req.body.searchBy;
            if (searchBy) {
                // user name wise search
                const users = await User.find({
                    name: { $regex: `${searchBy}`, $options: "i" },
                });

                const userIds = users.map((user) => ({
                    userId: { $eq: mongoose.Types.ObjectId(user._id) },
                }));

                // deliveryboy name wise search
                const searchedDeliveryBoys = await DeliveryBoys.find({
                    fullName: { $regex: `${searchBy}`, $options: "i" },
                });

                const deliveryBoyIds = searchedDeliveryBoys.map((deliveryBoy) => ({
                    deliveryBoyId: { $eq: mongoose.Types.ObjectId(deliveryBoy._id) },
                }));

                searchQuery = [
                    { orderId: { $regex: `${searchBy}`, $options: "i" } },
                    { returnId: { $regex: `${searchBy}`, $options: "i" } },
                    { noOfItems: { $regex: `${searchBy}`, $options: "i" } },
                    { status: { $regex: `${searchBy}`, $options: "i" } },
                ];

                if (userIds.length) {
                    searchQuery = searchQuery.concat(userIds);
                }

                if (deliveryBoyIds.length) {
                    searchQuery = searchQuery.concat(deliveryBoyIds);
                }
            }

            let pickUpStatuses = [
                "pickup pending",
                "accepted",
                "rejected",
                "collected",
                "submitted",
            ];

            let aggregateQuery = returnOrders.aggregate([
                {
                    $match: {
                        status: { $in: pickUpStatuses },
                        ...(searchBy && {
                            $or: searchQuery,
                        }),
                    },
                },
                {
                    $lookup: {
                        from: "returnorderreasons",
                        localField: "orderObjectId",
                        foreignField: "orderId",
                        as: "reasons",
                    },
                },
                {
                    $set: {
                        reasons: { $arrayElemAt: ["$reasons.reason", 0] },
                        notes: { $arrayElemAt: ["$reasons.notes", 0] },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails",
                    },
                },
                {
                    $lookup: {
                        from: "premiumusers",
                        localField: "userId",
                        foreignField: "userId",
                        as: "premiumuserDetails",
                    },
                },
                {
                    $set: {
                        premiumuser: {
                            $cond: {
                                if: { $ne: ["$premiumuserDetails", []] },
                                then: true,
                                else: false,
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: "deliveryboys",
                        localField: "deliveryBoyId",
                        foreignField: "_id",
                        as: "deliveryBoy",
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
                    $unwind: {
                        path: "$orderDetails",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        returnId: 1,
                        returnDate: "$createdAt",
                        orderId: 1,
                        orderDate: "$orderDetails.createdAt",
                        orderObjectId: 1,
                        noOfItems: { $size: "$products" },
                        reasons: 1,
                        notes: 1,
                        status: 1,
                        deliveryBoy: { $first: "$deliveryBoy.fullName" },
                        refundableAmount: 1000,
                        products: 1,
                        dateTime: "$formattedDateTime",
                        orderDetails: {
                            address: "$orderDetails.address",
                            paymentType: "$orderDetails.paymentType",
                            returnDate: "$createdAt",
                            orderDate: "$orderDetails.createdAt",
                            deliveryDate: "$deliveryDate",
                        },
                        paymentType: 1,
                        premiumuser: 1,
                        name: { $first: "$userDetails.name" },
                        customerId: { $first: "$userDetails.customerId" },
                        deliveryBoyAssignedDate: 1,
                    },
                },
                {
                    $sort: {
                        deliveryBoyAssignedDate: -1,
                    },
                },
            ]);

            const customLabels = {
                totalDocs: "TotalRecords",
                docs: "returnPickup",
                limit: "PageSize",
                page: "CurrentPage",
            };
            const aggregatePaginateOptions = {
                page: pageNo,
                limit: pageSize,
                customLabels: customLabels,
            };
            let response = await returnOrders.aggregatePaginate(
                aggregateQuery,
                aggregatePaginateOptions
            );

            let serialNoStarting = (parseInt(pageNo) - 1) * 10 + 1;

            response.returnPickup.forEach((returnPickup) => {
                //add sl.no
                returnPickup.slNo = serialNoStarting;
                serialNoStarting++;

                if (
                    returnPickup.orderDetails.paymentType != "cod" &&
                    returnPickup.paymentType == "bank"
                ) {
                    returnPickup.paymentType = "online payment";
                }

                returnPickup.status = capitalizeFirstLetter(returnPickup.status);
                returnPickup.paymentType = capitalizeFirstLetter(
                    returnPickup.paymentType
                );

                returnPickup.returnDate = moment(returnPickup.returnDate)
                    .tz(process.env.TIME_ZONE)
                    .format("MMM DD YYYY, hh:mm a");

                returnPickup.orderDate = moment(returnPickup.orderDate)
                    .tz(process.env.TIME_ZONE)
                    .format("MMM DD YYYY, hh:mm a");
            });

            return res.status(200).json({
                error: false,
                message: "return requests are",
                data: response,
            });
        } catch (error) {
            next(error);
        }
    },
    toQualityCheck: async (req, res, next) => {
        try {
            if (!req.body.id) {
                return res.json({
                    error: true,
                    message: "Essential params missing",
                });
            }

            let validReturnOrder = await returnOrders.findOne({ _id: req.body.id });

            if (!validReturnOrder) {
                return res.json({
                    error: true,
                    message: "Invalid return order id",
                });
            }

            //update delivery boy
            await returnOrders.updateOne(
                { _id: req.body.id },
                {
                    $set: {
                        status: "quality check",
                        qualityCheckDate: new Date(),
                    },
                }
            );

            return res.json({
                error: false,
                message: "Order moved to quality check",
            });
        } catch (error) {
            next(error);
        }
    },
    getQualityCheck: async (req, res, next) => {
        try {
            if (!req.body.page) {
                return res.json({
                    error: true,
                    message: "Essential params missing",
                });
            }
            let pageNo = req.body.page;
            let pageSize = 10;

            let searchBy = req.body.searchBy;
            if (searchBy) {
                const users = await User.find({
                    name: { $regex: `${searchBy}`, $options: "i" },
                });

                const userIds = users.map((user) => ({
                    userId: { $eq: mongoose.Types.ObjectId(user._id) },
                }));

                searchQuery = [
                    { orderId: { $regex: `${searchBy}`, $options: "i" } },
                    { returnId: { $regex: `${searchBy}`, $options: "i" } },
                    { noOfItems: { $regex: `${searchBy}`, $options: "i" } },
                ];

                if (userIds.length) {
                    searchQuery = searchQuery.concat(userIds);
                }
            }

            let aggregateQuery = returnOrders.aggregate([
                {
                    $match: {
                        status: "quality check",
                        ...(searchBy && {
                            $or: searchQuery,
                        }),
                    },
                },
                {
                    $lookup: {
                        from: "returnorderreasons",
                        localField: "orderObjectId",
                        foreignField: "orderId",
                        as: "reasons",
                    },
                },
                {
                    $set: {
                        reasons: { $arrayElemAt: ["$reasons.reason", 0] },
                        notes: { $arrayElemAt: ["$reasons.notes", 0] },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails",
                    },
                },
                {
                    $lookup: {
                        from: "premiumusers",
                        localField: "userId",
                        foreignField: "userId",
                        as: "premiumuserDetails",
                    },
                },
                {
                    $set: {
                        premiumuser: {
                            $cond: {
                                if: { $ne: ["$premiumuserDetails", []] },
                                then: true,
                                else: false,
                            },
                        },
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
                    $unwind: {
                        path: "$orderDetails",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        returnId: 1,
                        returnDate: "$createdAt",
                        orderId: 1,
                        orderDate: "$orderDetails.createdAt",
                        orderObjectId: 1,
                        noOfItems: { $size: "$products" },
                        reasons: 1,
                        notes: 1,
                        status: 1,
                        refundableAmount: 1000,
                        products: 1,
                        dateTime: "$formattedDateTime",
                        orderDetails: {
                            address: "$orderDetails.address",
                            paymentType: "$orderDetails.paymentType",
                            returnDate: "$createdAt",
                            orderDate: "$orderDetails.createdAt",
                            deliveryDate: "$deliveryDate",
                        },
                        paymentType: 1,
                        premiumuser: 1,
                        name: { $first: "$userDetails.name" },
                        product_img: { $concat: [process.env.BASE_URL, "$product_img"] },
                        signature: { $concat: [process.env.BASE_URL, "$signature"] },
                        customerId: { $first: "$userDetails.customerId" },
                        qualityCheckDate: 1,
                    },
                },
                {
                    $sort: {
                        qualityCheckDate: 1,
                    },
                },
            ]);

            const customLabels = {
                totalDocs: "TotalRecords",
                docs: "qualityCheck",
                limit: "PageSize",
                page: "CurrentPage",
            };
            const aggregatePaginateOptions = {
                page: pageNo,
                limit: pageSize,
                customLabels: customLabels,
            };
            let response = await returnOrders.aggregatePaginate(
                aggregateQuery,
                aggregatePaginateOptions
            );

            let serialNoStarting = (parseInt(pageNo) - 1) * 10 + 1;

            response.qualityCheck.forEach((qualityCheck) => {
                //add sl.no
                qualityCheck.slNo = serialNoStarting;
                serialNoStarting++;

                if (
                    qualityCheck.orderDetails.paymentType != "cod" &&
                    qualityCheck.paymentType == "bank"
                ) {
                    qualityCheck.paymentType = "online payment";
                }

                qualityCheck.status = capitalizeFirstLetter(qualityCheck.status);
                qualityCheck.paymentType = capitalizeFirstLetter(
                    qualityCheck.paymentType
                );

                qualityCheck.returnDate = moment(qualityCheck.returnDate)
                    .tz(process.env.TIME_ZONE)
                    .format("MMM DD YYYY, hh:mm a");

                qualityCheck.orderDate = moment(qualityCheck.orderDate)
                    .tz(process.env.TIME_ZONE)
                    .format("MMM DD YYYY, hh:mm a");
            });

            return res.status(200).json({
                error: false,
                message: "return requests are",
                data: response,
            });
        } catch (error) {
            next(error);
        }
    },
    approveDeclineReturnOrder: async (req, res, next) => {
        try {
            const { id, returnStatuses } = req.body;
            if (!id || !returnStatuses) {
                return res.json({
                    error: true,
                    message: "Essential params missing",
                });
            }

            // id validation
            let validReturnOrder = await returnOrders.findOne({ _id: req.body.id });

            if (!validReturnOrder) {
                return res.json({
                    error: true,
                    message: "Invalid return order id",
                });
            }

            // status validation
            const invalidStatus = returnStatuses.filter(
                (product) =>
                    product.status != "approved" && product.status != "declined"
            );

            if (invalidStatus.length) {
                return res.json({
                    error: true,
                    message: "Invalid status",
                });
            }

            let totalAmount = 0;
            let medcoinDiscount = 0;
            let refundableAmount = 0;
            let approvedProductsCount = 0;
            let couponDiscount = 0;
            let memberDiscount = 0;
            let reducableAmountFromEachProduct =
                validReturnOrder.reducableAmountFromEachProduct;
            let totalReducableAmount = 0;
            let refundedAmount = 9;

            let approvedProducts = [];

            for (let i of returnStatuses) {
                //update product status
                for (let j of validReturnOrder.products) {
                    if (j.variantId == i.variantId && i.status === "approved") {
                        if (validReturnOrder.status === "quality check") {
                            totalAmount += j.specialPrice * j.quantity;
                            approvedProductsCount++;

                            approvedProducts.push(j);
                        }
                    }
                }
            }

            totalReducableAmount =
                reducableAmountFromEachProduct * approvedProductsCount;

            refundableAmount = totalAmount - totalReducableAmount;

            refundedAmount = refundableAmount;

            // delivery charge calculation
            let orderDetails = await Order.findOne({
                _id: validReturnOrder.orderObjectId,
            });
            if (
                validReturnOrder.products.length == orderDetails.products.length &&
                orderDetails.cartDetails.isThisCartEligibleForFreeDelivery == false
            ) {
                refundableAmount =
                    refundableAmount + orderDetails.cartDetails.deliveryCharge;
                refundedAmount = refundableAmount;
            }

            // coupon and member discount
            if (validReturnOrder.cartDetails.couponAppliedDiscount != 0) {
                couponDiscount =
                    (validReturnOrder.cartDetails.couponAppliedDiscount /
                        orderDetails.products.length) *
                    approvedProductsCount;
            }

            if (validReturnOrder.cartDetails.memberDiscount != 0) {
                memberDiscount =
                    (validReturnOrder.cartDetails.memberDiscount /
                        orderDetails.products.length) *
                    approvedProductsCount;
            }

            refundableAmount = refundableAmount.toFixed(2);

            let message = "";
            let toBankAmount = 0;
            let toWalletAmount = 0;
            let returnMedcoinRedeemed =
                (orderDetails.cartDetails.medCoinRedeemed /
                    orderDetails.products.length) *
                approvedProductsCount;

            refundedAmount += returnMedcoinRedeemed;

            if (
                validReturnOrder.paymentType === "bank" &&
                approvedProductsCount > 0
            ) {
                //refund
                if (approvedProductsCount > 0) {
                    refundableAmount = parseFloat(refundableAmount);

                    if (orderDetails.paymentType === "razorpay") {
                        // razorpay online payment order
                        const payment = await Payments.findOne({
                            orderObjectId: validReturnOrder.orderObjectId,
                        });

                        if (!payment) {
                            return res.json({
                                error: true,
                                message: "Can't find payment info with this order id.",
                            });
                        }

                        refundableAmount = parseInt(refundableAmount);

                        const refund = await razorpay.payments.refund(payment.paymentId, {
                            amount: refundableAmount,
                        });

                        //save payment log
                        await new Payments({
                            userId: validReturnOrder.userId,
                            orderObjectId: validReturnOrder.orderObjectId,
                            // returnOrderObjectId: validReturnOrder._id
                            paymentId: refund.payment_id,
                            refundId: refund.id,
                            type: "refund, return order",
                        }).save();
                    } else if (orderDetails.paymentType === "cod") {
                        // order purchased by cash on delivery

                        // razorpay payouts
                        const payout = await razorpay.payouts.create({
                            amount: refundableAmount,
                            bank_account: process.env.RAZORPAY_BANK_ACCOUNT,
                            currency: "INR",
                            notes: {
                                order_id: validReturnOrder.orderObjectId,
                            },
                        });

                        //save payment log
                        await new Payments({
                            userId: validReturnOrder.userId,
                            orderObjectId: validReturnOrder.orderObjectId,
                            // returnOrderObjectId: validReturnOrder._id
                            paymentId: payout.id,
                            type: "payout, return order",
                        }).save();

                        // // razorpay payout log
                        // await new RazorpayPayout({
                        //     userId: validReturnOrder.userId,
                        //     orderObjectId: validReturnOrder.orderObjectId,
                        //     // returnOrderObjectId: validReturnOrder._id
                        //     payoutId: payout.id,
                        //     type: "refund, return order",
                        // }).save();
                    }

                    toBankAmount = refundableAmount;

                    // increasing users medcoin balance in the case of order purchased using medcoin also
                    if (validReturnOrder.cartDetails.medCoinRedeemed != 0) {
                        let increasableMedcoin =
                            (validReturnOrder.cartDetails.medCoinRedeemed /
                                orderDetails.products.length) *
                            approvedProductsCount;

                        //increment users med coin count
                        await User.updateOne(
                            { _id: validReturnOrder.userId },
                            {
                                $inc: { medCoin: increasableMedcoin },
                            }
                        );

                        // reducing admin balance
                        await incrementOrDecrementAdminMedCoinBalance(
                            "dec",
                            increasableMedcoin
                        );

                        // finding new admin and user's medcoin balance
                        let newUserBalance = await User.findOne(
                            { _id: validReturnOrder.userId },
                            { medCoin: 1 }
                        );
                        let newAdminBalance = await MedCoinDetails.findOne();

                        //create payment statement
                        const statement = new MedCoin({
                            type: "return order",
                            medCoinCount: increasableMedcoin,
                            customerId: validReturnOrder.userId,
                            balance: newAdminBalance.availableBalance,
                            customerBalance: newUserBalance.medCoin,
                        });
                        await statement.save();

                        toWalletAmount = increasableMedcoin;
                    }

                    message =
                        "Refund initiated, customer will receive the refund within 5-7 working days.";
                } else {
                    message = "All products rejected, no refund initiated.";
                }
            } else if (
                validReturnOrder.paymentType === "medcoin" &&
                approvedProductsCount > 0
            ) {
                //increment users med coin count

                if (validReturnOrder.cartDetails.medCoinRedeemed != 0) {
                    refundableAmount =
                        (validReturnOrder.cartDetails.medCoinRedeemed /
                            orderDetails.products.length) *
                        approvedProductsCount;
                }

                await User.updateOne(
                    { _id: validReturnOrder.userId },
                    {
                        $inc: { medCoin: refundableAmount },
                    }
                );

                // reducing admin balance
                await incrementOrDecrementAdminMedCoinBalance("dec", refundableAmount);

                // finding new admin and user's medcoin balance
                let newUserBalance = await User.findOne(
                    { _id: validReturnOrder.userId },
                    { medCoin: 1 }
                );
                let newAdminBalance = await MedCoinDetails.findOne();

                //create payment statement
                const statement = new MedCoin({
                    type: "return order",
                    medCoinCount: refundableAmount,
                    customerId: validReturnOrder.userId,
                    balance: newAdminBalance.availableBalance,
                    customerBalance: newUserBalance.medCoin,
                });
                await statement.save();

                message = "Approved, refunded to user's medcoin wallet";

                toWalletAmount = refundableAmount;
            }

            if (approvedProductsCount === 0) {
                message = "All products rejected, no refund initiated.";
                await returnOrders.updateOne(
                    { _id: id },
                    {
                        $set: {
                            status: "declined",
                            // refundableAmount: validReturnOrder.refundableAmount,
                            refundedAmount: 0,
                            couponDiscount: couponDiscount,
                            memberDiscount: memberDiscount,
                            returnMedcoinRedeemed: returnMedcoinRedeemed,
                            returnApprovedDeclinedDate: new Date(),
                        },
                    }
                );
            } else {
                await returnOrders.updateOne(
                    { _id: id },
                    {
                        $set: {
                            refundedAmount: refundedAmount,
                            status: "completed",
                            toBankAmount: toBankAmount,
                            toWalletAmount: toWalletAmount,
                            returnApprovedDeclinedDate: new Date(),
                            couponDiscount: couponDiscount,
                            memberDiscount: memberDiscount,
                            returnMedcoinRedeemed: returnMedcoinRedeemed,
                        },
                    }
                );

                let customer = await User.findOne({ _id: validReturnOrder.userId });

                //sent sms

                await TwoFactor.sendTemplate(
                    customer.phone,
                    "return accepted",
                    ["2"],
                    "MEDMAL"
                ).catch((error) => console.log(error));

                // sending email to customer
                let emailContents = {
                    username: customer.name,
                    returnId: validReturnOrder.returnId,
                    products: approvedProducts.map((product) => ({
                        name: product.productName,
                        image: product.image,
                        description: product.description,
                        quantity: product.quantity,
                        amount: product.specialPrice,
                        realPrice: product.price,
                    })),
                    refundAmount: refundableAmount,
                    cartValue:
                        orderDetails.cartDetails.totalAmountToBePaid +
                        orderDetails.cartDetails.medCoinRedeemed,
                    amountPaid:
                        orderDetails.cartDetails.paymentType === "cod"
                            ? "0"
                            : orderDetails.cartDetails.totalAmountToBePaid,
                    medCoinUsed: orderDetails.cartDetails.medCoinRedeemed,
                    totalRefundable: refundableAmount,
                    total: refundableAmount,
                    orderObjectId: orderDetails._id,
                };
                let emailTemplate = await generateRefundIssuedEMailTemplate(
                    emailContents
                );

                let email = await sendMail(
                    process.env.EMAIL_ID,
                    customer.email,
                    "Refund Issued",
                    emailTemplate
                );
                console.log("email_:", email);
            }

            for (let i of returnStatuses) {
                //update product status
                await returnOrders.updateOne(
                    {
                        _id: id,
                        "products.variantId": mongoose.Types.ObjectId(i.variantId),
                    },
                    {
                        $set: {
                            "products.$.returnStatus": i.status,
                        },
                    }
                );
            }

            await Order.updateOne(
                {
                    _id: validReturnOrder.orderObjectId,
                },
                {
                    $set: {
                        orderStatus: "returned",
                        returnApprovedDeclinedDate: new Date(),
                    },
                }
            );

            return res.json({
                error: false,
                message,
            });
        } catch (error) {
            next(error);
        }
    },
    getApprovedDeclined: async (req, res, next) => {
        try {
            if (!req.body.page || !req.body.status) {
                return res.json({
                    error: true,
                    message: "Essential params missing",
                });
            }

            if (req.body.status != "approved" && req.body.status != "declined") {
                return res.json({
                    error: true,
                    message: "Invalid status",
                });
            }

            let pageNo = req.body.page;
            let pageSize = 10;

            let searchBy = req.body.searchBy;
            if (searchBy) {
                const users = await User.find({
                    name: { $regex: `${searchBy}`, $options: "i" },
                });

                const userIds = users.map((user) => ({
                    userId: { $eq: mongoose.Types.ObjectId(user._id) },
                }));

                searchQuery = [
                    { orderId: { $regex: `${searchBy}`, $options: "i" } },
                    { returnId: { $regex: `${searchBy}`, $options: "i" } },
                    { noOfItems: { $regex: `${searchBy}`, $options: "i" } },
                ];

                if (userIds.length) {
                    searchQuery = searchQuery.concat(userIds);
                }
            }

            let aggregateQuery = returnOrders.aggregate([
                {
                    $match: {
                        "products.returnStatus": req.body.status,
                        ...(searchBy && {
                            $or: searchQuery,
                        }),
                    },
                },
                {
                    $lookup: {
                        from: "returnorderreasons",
                        localField: "orderObjectId",
                        foreignField: "orderId",
                        as: "reasons",
                    },
                },
                {
                    $set: {
                        reasons: { $arrayElemAt: ["$reasons.reason", 0] },
                        notes: { $arrayElemAt: ["$reasons.notes", 0] },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails",
                    },
                },
                {
                    $lookup: {
                        from: "premiumusers",
                        localField: "userId",
                        foreignField: "userId",
                        as: "premiumuserDetails",
                    },
                },
                {
                    $set: {
                        premiumuser: {
                            $cond: {
                                if: { $ne: ["$premiumuserDetails", []] },
                                then: true,
                                else: false,
                            },
                        },
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
                    $unwind: {
                        path: "$orderDetails",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        returnId: 1,
                        returnDate: "$createdAt",
                        orderId: 1,
                        orderDate: "$orderDetails.createdAt",
                        orderObjectId: 1,
                        reasons: 1,
                        notes: 1,
                        status: 1,
                        refundableAmount: 1,
                        products: {
                            $filter: {
                                input: "$products",
                                as: "product",
                                cond: { $eq: ["$$product.returnStatus", req.body.status] },
                            },
                        },
                        dateTime: "$formattedDateTime",
                        orderDetails: {
                            address: "$orderDetails.address",
                            paymentType: "$orderDetails.paymentType",
                            returnDate: "$createdAt",
                            orderDate: "$orderDetails.createdAt",
                            deliveryDate: "$deliveryDate",
                        },
                        paymentType: 1,
                        premiumuser: 1,
                        name: { $first: "$userDetails.name" },
                        customerId: { $first: "$userDetails.customerId" },
                        refundedAmount: 1,
                    },
                },
                {
                    $set: {
                        noOfItems: { $size: "$products" },
                    },
                },
                {
                    $sort: {
                        _id: -1,
                    },
                },
            ]);

            const customLabels = {
                totalDocs: "TotalRecords",
                docs: "approvedOrDeclined",
                limit: "PageSize",
                page: "CurrentPage",
            };
            const aggregatePaginateOptions = {
                page: pageNo,
                limit: pageSize,
                customLabels: customLabels,
            };
            let response = await returnOrders.aggregatePaginate(
                aggregateQuery,
                aggregatePaginateOptions
            );

            let serialNoStarting = (parseInt(pageNo) - 1) * 10 + 1;

            response.approvedOrDeclined.forEach((approvedOrDeclined) => {
                //add sl.no
                approvedOrDeclined.slNo = serialNoStarting;
                serialNoStarting++;

                if (
                    approvedOrDeclined.orderDetails.paymentType != "cod" &&
                    approvedOrDeclined.paymentType == "bank"
                ) {
                    approvedOrDeclined.paymentType = "online payment";
                }

                approvedOrDeclined.status = capitalizeFirstLetter(
                    approvedOrDeclined.status
                );
                approvedOrDeclined.paymentType = capitalizeFirstLetter(
                    approvedOrDeclined.paymentType
                );

                approvedOrDeclined.returnDate = moment(approvedOrDeclined.returnDate)
                    .tz(process.env.TIME_ZONE)
                    .format("MMM DD YYYY, hh:mm a");

                approvedOrDeclined.orderDate = moment(approvedOrDeclined.orderDate)
                    .tz(process.env.TIME_ZONE)
                    .format("MMM DD YYYY, hh:mm a");

                if (req.body.status == "approved") {
                    approvedOrDeclined.refundableAmount =
                        approvedOrDeclined.refundedAmount;
                } else {
                    approvedOrDeclined.refundableAmount =
                        approvedOrDeclined.refundableAmount -
                        approvedOrDeclined.refundedAmount;
                }

                delete approvedOrDeclined.refundedAmount;
            });

            return res.status(200).json({
                error: false,
                message: "return requests are",
                data: response,
            });
        } catch (error) {
            next(error);
        }
    },

    getReturnOrderInvoiceByOrderId: async (req, res, next) => {
        try {
            //validate incoming data
            //   const dataValidation = await validateGetOrderInvoiceByOrderId(req.body);
            //   if (dataValidation.error) {
            //     const message = dataValidation.error.details[0].message.replace(/"/g, "");
            //     return res.status(200).json({
            //       error: true,
            //       message: message,
            //     });
            //   }

            const { orderId } = req.body;

            let order = await returnOrders.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(orderId),
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
                    $lookup: {
                        from: "stores",
                        localField: "storeDetails.storeId",
                        foreignField: "_id",
                        as: "storeDetails",
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
                        phone: "$address.mobile",
                        orderId: 1,
                        returnId: 1,
                        noOfItems: { $size: "$products" },
                        createdAt: 1,
                        address: 1,
                        products: 1,
                        cartDetails: 1,
                        paymentType: 1,
                        dob: "$user.dob",
                        pickupPending: 1,
                        orderDetails: 1,
                        bankDetails: 1,
                        refundableAmount: 1,
                        storeAddress: {
                            $concat: [
                                { $first: "$storeDetails.address" },
                                ", ",
                                { $first: "$storeDetails.state" },
                                ", ",
                                { $first: "$storeDetails.country" },
                                ", ",
                                { $first: "$storeDetails.pin" },
                            ],
                        },
                        storeData: "$storeDetails",
                        deliveryCharge: 1,
                        returnMedcoinRedeemed: 1,
                        memberDiscount: 1,
                        couponDiscount: 1,
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

            const hsnSknCodes = await Products.find({
                $or: queryToGetHsnCode,
            }).lean();

            let totalAmount = 0;

            const productStatements = order.products.map((product) => {
                const hsnCodeProduct = _.find(hsnSknCodes, {
                    _id: product.product_id,
                });

                let { skuOrHsnNo } =
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
                medCoins: order.returnMedcoinRedeemed ? order.returnMedcoinRedeemed : 0,
                memberDiscount: order.memberDiscount,
                couponAppliedDiscount: order.couponDiscount,
                deliveryCharge: order.deliveryCharge ? order.deliveryCharge : 0,
                payableAmount: order.refundableAmount,
            };

            let invoice = {
                // orderId: order.orderId,
                returnId: order.returnId,
                orderId: order.orderId,
                shippingZone: order.address.pincode,
                name: order.userName,
                returnDate: moment(order.createdAt)
                    .tz(process.env.TIME_ZONE)
                    .format("MMM DD YYYY, hh:mm a"),
                contactNumber: order.phone,
                productStatements,
                amountStatements: amountStatements,
                paymentType: order.paymentType,
                age: order.dob
                    ? moment().diff(
                        moment(order.dob, "YYYY-MM-DD").tz(process.env.TIME_ZONE),
                        "years"
                    )
                    : null,
                pickupAddress: order.address,
                deliveryDate: moment(order.orderDetails[0].deliveredDate)
                    .tz(process.env.TIME_ZONE)
                    .format("MMM DD YYYY, hh:mm a"),
                deliveryAddress: order.orderDetails[0].address,
                orderDate: moment(order.orderDetails[0].createdAt)
                    .tz(process.env.TIME_ZONE)
                    .format("MMM DD YYYY, hh:mm a"),
                bankDetails: order.bankDetails,
                storeAddress: order.storeAddress,
            };

            invoice.pickupAddress.wholeAddress = `${order.address.house} , ${order.address.street} ${order.address.landmark} ${order.address.state} ${order.address.pincode}`;

            if (order.storeData.length && order.storeData[0].masterStore) {
                invoice.storeAddress = "Master Store";
            }

            return res.json({
                error: false,
                message: "Order invoice.",
                data: { invoice },
            });
        } catch (error) {
            next(error);
        }
    },
    directApproveReturnOrder: async (req, res, next) => {
        try {
            const { returnId } = req.body;

            const returnOrder = await returnOrders.findOne({
                _id: mongoose.Types.ObjectId(returnId),
            });

            const orderDetails = await Order.findOne({ _id: returnOrder.orderObjectId })

            if (!returnOrder) {
                return res.json({
                    error: true,
                    message: "Invalid return order ID.",
                });
            }

            let message = "";
            let toBankAmount = 0;
            let toWalletAmount = 0;

            // let refundableAmount = 100;

            returnOrder.refundableAmount = parseFloat(returnOrder.refundableAmount);

            //### refund to customer's bank account
            if (returnOrder.paymentType === "bank") {

                // case - order purchased with razorpay
                if (orderDetails.paymentType === 'razorpay') {
                    const payment = await Payments.findOne({
                        orderObjectId: returnOrder.orderObjectId,
                    });

                    if (!payment) {
                        return res.json({
                            error: true,
                            message: "Can't find payment info with this order id.",
                        });
                    }

                    //refund
                    // console.log('refundableAmount',refundableAmount)
                    const refund = await razorpay.payments.refund(payment.paymentId, {
                        amount: returnOrder.refundableAmount,
                    });

                    console.log("refund", refund);

                    //save payment log
                    await new Payments({
                        userId: returnOrder.userId,
                        orderObjectId: returnOrder.orderObjectId,
                        // returnOrderObjectId: validReturnOrder._id
                        paymentId: refund.payment_id,
                        refundId: refund.id,
                        type: "refund, return order",
                    }).save();

                    message =
                        "Refund initiated, customer will receive the refund within 5-7 working days.";
                }

                // case - order purchased by cod
                else if (orderDetails.paymentType === 'cod') {

                    // razorpay payouts
                    const payout = await razorpay.payouts.create({
                        amount: refundableAmount,
                        bank_account: process.env.RAZORPAY_BANK_ACCOUNT,
                        currency: "INR",
                        notes: {
                            order_id: validReturnOrder.orderObjectId,
                        },
                    });

                    //save payment log
                    await new Payments({
                        userId: validReturnOrder.userId,
                        orderObjectId: validReturnOrder.orderObjectId,
                        // returnOrderObjectId: validReturnOrder._id
                        paymentId: payout.id,
                        type: "payout, return order",
                    }).save();

                    // // razorpay payout log
                    // await new RazorpayPayout({
                    //     userId: validReturnOrder.userId,
                    //     orderObjectId: validReturnOrder.orderObjectId,
                    //     // returnOrderObjectId: validReturnOrder._id
                    //     payoutId: payout.id,
                    //     type: "refund, return order",
                    // }).save();

                    message =
                        "Refund initiated, customer will receive the refund within 5-7 working days.";
                }

            }
            //### refund to customer's medcoin wallet
            else if (returnOrder.paymentType === "medcoin") {
                //increment users med coin count
                await User.updateOne(
                    { _id: returnOrder.userId },
                    {
                        $inc: { medCoin: returnOrder.refundableAmount },
                    }
                );

                // reducing admin balance
                await incrementOrDecrementAdminMedCoinBalance(
                    "dec",
                    returnOrder.refundableAmount
                );

                // finding new admin and user's medcoin balance
                let newUserBalance = await User.findOne(
                    { _id: returnOrder.userId },
                    { medCoin: 1 }
                );
                let newAdminBalance = await MedCoinDetails.findOne();

                //create payment statement
                const statement = new MedCoin({
                    type: "return order",
                    medCoinCount: returnOrder.refundableAmount,
                    customerId: returnOrder.userId,
                    balance: newAdminBalance.availableBalance,
                    customerBalance: newUserBalance.medCoin,
                });
                await statement.save();

                message = "Approved, refunded to user's medcoin wallet";
            }

            //update product status
            const query = { _id: returnOrder._id };
            const updateDocument = {
                $set: { "products.$[].returnStatus": "approved" },
            };
            const productsStatusUpdate = await returnOrders.updateOne(
                query,
                updateDocument
            );

            console.log("after update");

            await returnOrders.updateOne(
                { _id: returnOrder._id },
                {
                    $set: {
                        refundableAmount: returnOrder.refundableAmount,
                        status: "completed",
                        toBankAmount: toBankAmount,
                        toWalletAmount: toWalletAmount,
                        directRefundApproved: true,
                    },
                }
            );

            let customer = await User.findOne({ _id: returnOrder.userId });

            // sending email to customer
            let emailContents = {
                username: customer.name,
                returnId: returnOrder.returnId,
                products: returnOrder.products,
                refundAmount: returnOrder.refundableAmount,
                cartValue: "1000",
                amountPaid: "1000",
                medCoinUsed: "50",
                totalRefundable: "1000",
                total: "1000",
            };
            let emailTemplate = await generateRefundIssuedEMailTemplate(
                emailContents
            );

            let email = await sendMail(
                process.env.EMAIL_ID,
                customer.email,
                "Refund Issued",
                emailTemplate
            );
            console.log("email_:", email);

            return res.json({
                error: false,
                message,
            });
        } catch (error) {
            next(error);
        }
    },
    getReturnOrderDetails: async (req, res, next) => {
        try {
            const { orderId } = req.body;

            let orderDetails = await Order.findOne({
                _id: mongoose.Types.ObjectId(orderId),
            });

            if (!orderDetails) {
                return res.json({
                    error: true,
                    message: "Invalid order ID.",
                });
            }

            let returnOrder = await returnOrders.aggregate([
                {
                    $match: {
                        orderObjectId: mongoose.Types.ObjectId(orderId),
                        // "products.returnStatus": { $ne: "declined" },
                    },
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
                    $lookup: {
                        from: "returnorderreasons",
                        localField: "orderObjectId",
                        foreignField: "orderId",
                        as: "reasons",
                    },
                },
                {
                    $set: {
                        reasons: { $arrayElemAt: ["$reasons.reason", 0] },
                        notes: { $arrayElemAt: ["$reasons.notes", 0] },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        order: 1,
                        status: 1,
                        returnId: 1,
                        createdAt: 1,
                        refundableAmount: 1,
                        reasons: 1,
                        notes: 1,
                        products: {
                            $map: {
                                input: "$products",
                                as: "product",
                                in: {
                                    _id: "$$product.variantId",
                                    productName: "$$product.productName",
                                    image: "$$product.image",
                                    quantity: "$$product.quantity",
                                    amount: "$$product.specialPrice",
                                    uomValue: "$$product.uomValue",
                                    returnStatus: "$$product.returnStatus",
                                },
                            },
                        },
                        pickedUpDate: 1,
                        returnApprovedDeclinedDate: 1,
                        memberDiscount: 1,
                        couponDiscount: 1,
                        directRefundApproved: 1,
                        toBankAmount: 1,
                        toWalletAmount: 1,
                        deliveryBoyAssignedDate: 1,
                        collectedDate: 1,
                    },
                },
            ]);

            if (!returnOrder.length) {
                return res.json({
                    error: true,
                    message: "Return order not found.",
                });
            }

            returnOrder = returnOrder[0];

            let statusMessage =
                "Refund has been initiated and will be credited within 5 - 7 business days. ";

            let trackingDates = {
                submitted: moment(returnOrder.createdAt)
                    .tz(process.env.TIME_ZONE)
                    .format("ddd, DD MMM YYYY"),
                approved: "",
                pickup: "",
                refundInitiated: "",
            };

            if (returnOrder.deliveryBoyAssignedDate) {
                trackingDates.approved = moment(returnOrder.deliveryBoyAssignedDate)
                    .tz(process.env.TIME_ZONE)
                    .format("ddd, DD MMM YYYY");

                delete returnOrder.deliveryBoyAssignedDate;
            }

            // pickup date
            if (returnOrder.collectedDate) {
                trackingDates.pickup = moment(returnOrder.collectedDate)
                    .tz(process.env.TIME_ZONE)
                    .format("ddd, DD MMM YYYY");

                delete returnOrder.collectedDate;
            }

            // refund initiated date
            if (
                returnOrder.status === "completed" ||
                returnOrder.status === "declined"
            ) {
                trackingDates.refundInitiated = moment(
                    returnOrder.returnApprovedDeclinedDate
                )
                    .tz(process.env.TIME_ZONE)
                    .format("ddd, DD MMM YYYY");

                delete returnOrder.returnApprovedDeclinedDate;
            }

            let response = {
                _id: returnOrder._id,
                orderId: returnOrder.order[0].orderId,
                placedDate: moment(returnOrder.order[0].createdAt)
                    .tz(process.env.TIME_ZONE)
                    .format("DD MMM YYYY"),
                totalAmount: returnOrder.order[0].cartDetails.totalAmountToBePaid,
                pickupAddress: returnOrder.order[0].address,
                returnId: returnOrder.returnId,
                status: returnOrder.status,
                returnDate: moment(returnOrder.createdAt)
                    .tz(process.env.TIME_ZONE)
                    .format("ddd, DD MMM YYYY"),
                reason: returnOrder.reasons,
                reasonNotes: returnOrder.notes,
                returnTrackingDates: trackingDates,
                refundableAmount: returnOrder.refundableAmount,
                toWalletAmount: returnOrder.toWalletAmount + "",
                toBankAmount: returnOrder.toBankAmount + "",
                couponDiscount: returnOrder.couponDiscount + "",
                memberDiscount: returnOrder.memberDiscount + "",
                returnProducts:
                    // [{
                    //     image: "",
                    //     name: "",
                    //     quantity: "",
                    //     amount: "",
                    // }]
                    returnOrder.products,
                statusMessage,
                directRefundApproved: returnOrder.directRefundApproved ? true : false,
            };

            return res.json({
                error: false,
                message: "Return order details.",
                data: response,
            });
        } catch (error) {
            next(error);
        }
    },

    // return order from customer relation
    returnOrderFromCustomerRelation: async (req, res, next) => {
        try {
            let cancelNotElgibleProducts = [];
            if (!req.body.id && !req.body.refundableAmount && !req.body.products) {
                return res.status(200).json({
                    error: true,
                    message: "Essential params missing",
                });
            }

            let data = await Order.findOne({
                _id: req.body.id,
            }).lean();

            if (!data) {
                return res.status(200).json({
                    error: true,
                    message: "Invalid order id",
                });
            }

            for (let item of req.body.products) {
                let products = await Inventory.findOne(
                    {
                        _id: item.product_id,
                    },
                    {
                        policy: 1,
                    }
                ).populate({ path: "policy", select: ["return"] });
                if (products) {
                    let orderDate = new Date(
                        moment(data.createdAt).add(products.policy.return, "days")
                    );
                    if (orderDate < new Date()) {
                        cancelNotElgibleProducts.push(item);
                    }
                }
            }

            if (cancelNotElgibleProducts.length) {
                return res.status(200).json({
                    error: true,
                    message: "Not eligible for return",
                });
            }

            let requestedProducts = req.body.products;
            let orderdProducts = data.products;

            requestedProducts = requestedProducts.map((product) =>
                _.find(orderdProducts, {
                    variantId: mongoose.Types.ObjectId(product.varientId),
                })
            );

            for (let item of orderdProducts) {
                let product = _.find(requestedProducts, {
                    variantId: mongoose.Types.ObjectId(item.variantId),
                });
                if (product) {
                    item.returnStatus = "requested";
                } else {
                    item.returnStatus = "";
                }
            }

            await Order.updateOne(
                {
                    _id: req.body.id,
                },
                {
                    products: orderdProducts,
                    orderStatus: "applied for return",
                    isReturned: true,
                }
            );

            // returnId Calculation
            let newReturnId = "";
            let letterReplacedOrderId = data.orderId.replace("F", "R");
            let lastReturnOrder = await returnOrders.findOne({}).sort({ _id: -1 });

            if (lastReturnOrder) {
                let splittedLastReturnOrder = lastReturnOrder.returnId.split("-");
                let lastReturnOrderIdCount = parseInt(splittedLastReturnOrder[1]);
                newReturnId = `${letterReplacedOrderId}-${lastReturnOrderIdCount + 1}`;
            } else {
                newReturnId = `${letterReplacedOrderId}-1`;
            }

            // return date formatting
            let formattedDateTime = moment(new Date()).format("MMM DD, h:mm a");

            let addressDetails = await UserAddress.findOne({ _id: req.body.address });

            // medcoin and discount calculation
            let reducableTotalAmount =
                data.cartDetails.medCoinRedeemed +
                data.cartDetails.couponAppliedDiscount +
                data.cartDetails.memberDiscount;
            // data.cartDetails.donationAmount;

            let reducableAmountFromEachProduct =
                reducableTotalAmount / data.products.length;

            let deliveryCharge = 0;
            if (
                req.body.products.length == data.products.length &&
                data.cartDetails.isThisCartEligibleForFreeDelivery == false
            ) {
                deliveryCharge = data.cartDetails.deliveryCharge;
            }

            // Discount Amount
            let memberDiscount =
                (data.cartDetails.memberDiscount / data.products.length) *
                requestedProducts.length;
            let couponDiscount =
                (data.cartDetails.couponAppliedDiscount / data.products.length) *
                requestedProducts.length;
            let returnMedcoinRedeemed =
                (data.cartDetails.medCoinRedeemed / data.products.length) *
                requestedProducts.length;
            let toWalletAmount = 0;
            let toBankAmount = 0;

            // saving bank details if refund is through bank
            let bankDetails;
            if (req.body.paymentMethod === "bank") {
                bankDetails = {
                    customerName: req.body.customerName,
                    accountNumber: req.body.accountNumber,
                    reAccountNumber: req.body.reAccountNumber,
                    ifsc: req.body.ifsc,
                    bankName: req.body.bankName,
                    branch: req.body.branch,
                    accountType: req.body.accountType,
                };

                toWalletAmount =
                    (data.cartDetails.medCoinRedeemed / data.products.length) *
                    requestedProducts.length;
                toBankAmount = req.body.refundableAmount - toWalletAmount;
            } else if (req.body.paymentMethod === "medcoin") {
                toWalletAmount = req.body.refundableAmount;
                toBankAmount = 0;
            }

            toWalletAmount = parseFloat(toWalletAmount);
            memberDiscount = parseFloat(memberDiscount);
            couponDiscount = parseFloat(couponDiscount);
            toBankAmount = parseFloat(toBankAmount);

            toWalletAmount = toWalletAmount.toFixed(2).replace(/[.,]00$/, "");
            memberDiscount = memberDiscount.toFixed(2).replace(/[.,]00$/, "");
            couponDiscount = couponDiscount.toFixed(2).replace(/[.,]00$/, "");
            toBankAmount = toBankAmount.toFixed(2).replace(/[.,]00$/, "");

            toWalletAmount = parseFloat(toWalletAmount);
            memberDiscount = parseFloat(memberDiscount);
            couponDiscount = parseFloat(couponDiscount);
            toBankAmount = parseFloat(toBankAmount);

            // req.body.refundableAmount = req.body.refundableAmount.toFixed(2)

            let newObj = {
                returnId: newReturnId,
                userId: data.userId,
                orderObjectId: req.body.id,
                orderId: data.orderId,
                paymentType: req.body.paymentMethod,
                noOfItems: data.noOfItems,
                address: addressDetails,
                products: requestedProducts,
                cartDetails: data.cartDetails,
                storeDetails: data.storeDetails,
                status: "requested",
                formattedDateTime: formattedDateTime,
                refundableAmount: req.body.refundableAmount,
                reducableAmountFromEachProduct: reducableAmountFromEachProduct,
                bankDetails: bankDetails,
                toWalletAmount: toWalletAmount,
                toBankAmount: toBankAmount,
                memberDiscount: memberDiscount,
                couponDiscount: couponDiscount,
                returnMedcoinRedeemed: returnMedcoinRedeemed,
                deliveryCharge: deliveryCharge,
                notes: req.body.notes,
                returnedFrom: "customer_relation",
            };

            let schemaObj = new returnOrders(newObj);
            let savedReturnOrder = await schemaObj.save();

            // fetching user details
            let userDetails = await User.findOne({ _id: data.userId });

            //sent sms

            await TwoFactor.sendTemplate(
                userDetails.phone,
                "return requested",
                [data.orderId],
                "MEDMAL"
            ).catch((error) => console.log(error));

            // sending email
            let emailContents = {
                username: userDetails.name,
                pickupDate: "12-12-2022",
                deliveryAddress: `${newObj?.address?.name}, ${newObj?.address?.house} , ${newObj?.address?.street} ${newObj?.address?.landmark} ${newObj?.address?.state} ${newObj?.address?.pincode}`,
                refundAmount: newObj.refundableAmount,
                returnId: newObj.returnId,
                products: newObj.products.map((product) => ({
                    name: product.productName,
                    image: product.image,
                    description: product.description,
                    quantity: product.quantity,
                    amount: product.specialPrice,
                    realPrice: product.price,
                })),
                amountPaid: "0",
                medCoinUsed: "0",
                totalRefundable: newObj.refundableAmount,
            };

            let emailTemplate = await generateOrderReturnRequestEMailTemplate(
                emailContents
            );

            let email = await sendMail(
                process.env.EMAIL_ID,
                userDetails.email,
                "Applied For Return Order",
                emailTemplate
            );

            return res.status(200).json({
                error: false,
                message: "success",
                data: {
                    returnId: savedReturnOrder.returnId,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    // cancel order in admin side (customer relation)
    cancelOrderFromCustomerRelation: async (req, res, next) => {
        try {
            if (!req.body.id) {
                return res.status(200).json({
                    error: true,
                    message: "Order id missing",
                });
            }

            let cancelNotElgibleProducts = [];

            let data = await Order.findOne({
                _id: req.body.id,
            });

            if (data) {
                for (let item of data.products) {
                    let products = await Inventory.findOne(
                        {
                            _id: item.product_id,
                        },
                        {
                            policy: 1,
                        }
                    ).populate({ path: "policy", select: ["cancel"] });

                    if (products) {
                        let orderDate = new Date(
                            moment(data.createdAt).add(products.policy.cancel, "days")
                        );

                        if (orderDate < new Date()) {
                            cancelNotElgibleProducts.push(item);
                        }
                    }
                }

                if (cancelNotElgibleProducts.length) {
                    return res.status(200).json({
                        error: true,
                        message: "Order Cannot Cancel",
                    });
                } else {
                    let cancelledDate = new Date();
                    let cancelledFormattedDate =
                        moment(cancelledDate).format("MMM DD, YYYY");

                    // refundable amount
                    let refundableAmount =
                        data.cartDetails.totalAmountToBePaid -
                        data.cartDetails.donationAmount;

                    //_###_bank refund method
                    if (req.body.refundMethod === "bank") {
                        // retund cash to user's bank account
                        const payment = await Payments.findOne({
                            orderObjectId: req.body.id,
                        });

                        if (!payment) {
                            return res.json({
                                error: true,
                                message: "Can't find payment info with this order id.",
                            });
                        }

                        const refund = await razorpay.payments.refund(payment.paymentId, {
                            amount: refundableAmount * 100,
                        });

                        //save payment log
                        await new Payments({
                            userId: data.userId,
                            orderObjectId: data._id,
                            // returnOrderObjectId: validReturnOrder._id
                            paymentId: refund.payment_id,
                            refundId: refund.id,
                            type: "refund, cancel order",
                        }).save();
                    }

                    //_###_medcoin refund method
                    else if (req.body.refundMethod === "medcoin") {
                        // increment user's med coin count
                        await User.updateOne(
                            { _id: data.userId },
                            {
                                $inc: { medCoin: refundableAmount },
                            }
                        );

                        // reducing admin balance
                        await incrementOrDecrementAdminMedCoinBalance(
                            "dec",
                            refundableAmount
                        );

                        // finding new admin and user's medcoin balance
                        let newUserBalance = await User.findOne(
                            { _id: data.userId },
                            { medCoin: 1 }
                        );
                        let newAdminBalance = await MedCoinDetails.findOne();

                        //create payment statement
                        const statement = new MedCoin({
                            type: "cancel order",
                            medCoinCount: refundableAmount,
                            customerId: data.userId,
                            balance: newAdminBalance.availableBalance,
                            customerBalance: newUserBalance.medCoin,
                        });
                        await statement.save();
                    }

                    await Order.updateOne(
                        {
                            _id: req.body.id,
                            userId: data.userId,
                        },
                        {
                            $set: {
                                orderStatus: "cancelled",
                                cancelledDate: cancelledDate,
                                cancelledFormattedDate: cancelledFormattedDate,
                            },
                        }
                    );

                    //sent sms

                    await TwoFactor.sendTemplate(
                        req.user.phone,
                        "cancelled orders",
                        [data.orderId, "5-7 buisness"],
                        "MEDMAL"
                    ).catch((error) => console.log(error));

                    let refundMode = "cod";

                    if (req.body.refundMethod === "medcoin") {
                        refundMode = "Medcoin";
                    } else if (req.body.refundMethod === "bank") {
                        refundMode = "bank";
                    }

                    // fetching user details
                    let userDetails = await User.findOne({ _id: data.userId });

                    // sending email to customer
                    let emailContents = {
                        username: userDetails.name,
                        cancelledDate: cancelledFormattedDate,
                        refundAmount: refundableAmount,
                        orderId: data.orderId,
                        products: data.products.map((product) => ({
                            name: product.productName,
                            image: product.image,
                            description: product.description,
                            quantity: product.quantity,
                            amount: product.specialPrice,
                            realPrice: product.price,
                        })),
                        amountPaid: data.cartDetails.totalAmountToBePaid,
                        medCoinUsed: data.cartDetails.medCoinRedeemed,
                        totalRefundable:
                            req.body.refundMethod === "medcoin"
                                ? refundableAmount + data.cartDetails.medCoinRedeemed
                                : refundableAmount,
                        amountSaved: data.cartDetails.totalDiscountAmount,
                        paymentType: refundMode,
                    };

                    let emailTemplate = await generateOrderCancelledEMailTemplate(
                        emailContents
                    );

                    let email = await sendMail(
                        process.env.EMAIL_ID,
                        userDetails.email,
                        "Order Cancelled",
                        emailTemplate
                    );
                    console.log("email_:", email);

                    return res.status(200).json({
                        error: false,
                        message: "Order Canceled Successfully",
                    });
                }
            } else {
                res.status(200).json({
                    error: true,
                    message: "Invalid order id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
};
