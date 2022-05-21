const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const moment = require("moment-timezone");
let API_KEY = process.env.OTPAPIKEY;
const TwoFactor = new (require("2factor"))(API_KEY);

const imgPath = process.env.BASE_URL;
const DeliveryBoys = require("../../models/delivery/deliveryBoys");
const Store = require("../../models/store");
const PickupPending = require("../../models/orders/pickupPending");
const ReturnOrders = require("../../models/returnOrders");
const DeliveryBoyCredit = require("../../models/delivery/deliveryBoyCredit");
const emergencyContact = require("../../models/delivery/emergencyContact");
const bankDetails = require("../../models/delivery/bankDetails");
const deliveryBoyQuery = require("../../models/delivery/deliveryBoyQuerys");
const DeliveryBoyNotification = require("../../models/delivery/deliveryBoyNotification");
const userNotification = require("../../models/user/userNotification");
const Order = require("../../models/orders/order");
const User = require("../../models/user");
const { sendMail } = require("../../email/email");
const {
  generateOrderShippedEMailTemplate,
  generateOrderDeliveredEMailTemplate,
} = require("../../email/templates/order");

module.exports = {
  uploadProfileImage: async (req, res, next) => {
    try {
      let data = req.body;
      let DeliveryBoy = await DeliveryBoys.findOne({
        _id: req.user._id,
      });
      console.log("req.file", req.file.image);
      if (DeliveryBoy) {
        if (req.file) {
          data.profilePic = `delivery/${req.file.filename}`;
          await DeliveryBoys.updateOne({ _id: req.user._id }, data)
            .then(async (response) => {
              res.status(200).json({
                error: false,
                message: "delivery boy profileImage updated successfully",
              });
            })
            .catch(async (error) => {
              res.status(200).json({
                error: true,
                message: error,
              });
            });
        } else {
          if (req.file) {
            await unlinkAsync(req.file.path);
          }
          res.status(200).json({
            status: false,
            message: "Please add a image",
          });
        }
      } else {
        if (req.file) {
          await unlinkAsync(req.file.path);
        }
        res.status(200).json({
          status: false,
          message: "something went wrong please login and continue",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  //get deliveryboy profile
  getDeliveryBoyProfile: async (req, res, next) => {
    try {
      let response = {
        fullName: "",
        deliveryBoyId: "",
        credit: "",
        profilePic: process.env.BASE_URL.concat("medfeed/head.jpeg"),
        status: "",
        mobile: "",
        email: "",
      };

      let result = await DeliveryBoys.findOne(
        { _id: req.user._id },
        {
          fullName: 1,
          deliveryBoyId: 1,
          credit: 1,
          profilePic: 1,
          status: 1,
          mobile: 1,
          email: 1,
        }
      ).lean();
      const deliveryBoyCredit = await DeliveryBoyCredit.findOne({
        deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
      }).sort({ _id: -1 });
      if (deliveryBoyCredit) {
        result.credit = deliveryBoyCredit.balance;
      }

      result.profilePic = process.env.BASE_URL.concat(result.profilePic);

      let finalResponse = { ...response, ...result };
      res.status(200).json({
        status: true,
        data: finalResponse,
      });
    } catch (error) {
      next(error);
    }
  },
  //get deliveryboy profile details
  getDeliveryBoyProfileDetails: async (req, res, next) => {
    try {
      const deliveryBoyDetails = await DeliveryBoys.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.user._id),
          },
        },
        {
          $project: {
            _id: 1,
            userInfo: {
              fullName: "$fullName",
              email: "$email",
              mobile: "$mobile",
              address: "$address",
              city: "$city",
            },
            license: {
              drivingLicenseNumber: "$drivingLicenseNumber",
              licence: { $concat: [imgPath, "$licence"] },
            },
            adhaar: {
              aadharCardNumber: "$aadharCardNumber",
              aadhar: { $concat: [imgPath, "$aadhar"] },
            },
            rcBook: {
              rcBook: { $concat: [imgPath, "$rcBook"] },
            },
          },
        },
        { $sort: { _id: -1 } },
      ]);
      res.status(200).json({
        status: true,
        data: deliveryBoyDetails,
      });
    } catch (error) {
      next(error);
    }
  },

  changeStatus: async (req, res, next) => {
    try {
      let data = req.body;
      console.log("data", data);
      data.userId = req.user._id;
      let DeliveryBoy = await DeliveryBoys.findOne({
        _id: req.user._id,
      });
      if (DeliveryBoy) {
        await DeliveryBoys.updateOne(
          { _id: req.user._id },
          {
            $set: {
              status: data.status,
            },
          }
        )
          .then(async (response) => {
            res.status(200).json({
              error: false,
              message: "delivery boy status updated successfully",
            });
          })
          .catch(async (error) => {
            res.status(200).json({
              error: true,
              message: error,
            });
          });
      } else {
        res.status(200).json({
          status: false,
          message: "something went wrong please login and continue",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getPickupPendingOrders: async (req, res, next) => {
    try {
      const pickupPendingOrders = await PickupPending.aggregate([
        {
          $match: {
            status: "pickup pending",
            deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
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
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$cartDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            userName: "$user.name",
            orderId: 1,
            orderObjectId: 1,
            paymentType: 1,
            totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
            status: 1,
          },
        },
        { $sort: { _id: -1 } },
      ]);
      return res.json({
        error: false,
        message: pickupPendingOrders.length
          ? "Pickup pending orders found."
          : "Empty pickup pending orders.",
        data: {
          pickupPendingOrders,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getPickupPendingSingleOrders: async (req, res, next) => {
    try {
      const pickupPendingOrders = await PickupPending.aggregate([
        {
          $match: {
            orderObjectId: mongoose.Types.ObjectId(req.body.orderObjectId),
            deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
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
          $unwind: {
            path: "$order",
            preserveNullAndEmptyArrays: true,
          },
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
          $unwind: {
            path: "$store",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$cartDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            address: 1,
            products: 1,
            paymentType: 1,
            totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
            status: 1,
            storeAddress: {
              name: "$store.name",
              email: "$store.email",
              phone: "$store.phone",
              address: "$store.address",
              pin: "$store.pin",
              state: "$store.state",
              country: "$store.country",
              gst: "$store.gst",
            },
          },
        },
        { $sort: { _id: -1 } },
      ]);

      return res.json({
        error: false,
        message: pickupPendingOrders.length
          ? "Pickup pending orders found."
          : "Empty pickup pending orders.",
        data: {
          pickupPendingOrders,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  changeOrderStatus: async (req, res, next) => {
    try {
      if (req.body.status == "picked up") {
        let data = req.body;
        data.deliveryBoyId = req.user._id;
        let DeliveryBoy = await DeliveryBoys.findOne({
          _id: data.deliveryBoyId,
        });
        if (DeliveryBoy) {
          let validOrder = await PickupPending.findOne({
            orderObjectId: data.orderObjectId,
          }).lean();
          if (validOrder) {
            await PickupPending.updateOne(
              {
                orderObjectId: mongoose.Types.ObjectId(req.body.orderObjectId),
              },
              {
                $set: {
                  status: data.status,
                  deliveryBoyId: data.deliveryBoyId,
                  pickedUpDate: moment(new Date()).tz(process.env.TIME_ZONE),
                },
              }
            );
            //update order status to order shipped

            await Order.updateOne(
              {
                _id: data.orderObjectId,
              },
              {
                orderStatus: "order shipped",
              }
            );

            //order

            const order = await Order.findOne({ _id: data.orderObjectId });

            //user

            const user = await User.findOne({ _id: order.userId });

            //sent sms

            await TwoFactor.sendTemplate(
              user.phone,
              "Order Shipped 1",
              [
                order.orderId,
                moment(order.cartDetails.deliveryDate, "MMM DD, YYYY hh:mm:a")
                  .tz(process.env.TIME_ZONE)
                  .diff(moment(), "days"),
                process.env.CLIENT_URL,
              ],
              "MEDMAL"
            ).catch((error) => console.log(error));

            //sent email
            await sendMail(
              process.env.EMAIL_ID,
              user.email,
              "Order shipped",
              generateOrderShippedEMailTemplate({
                username: user.name,
                deliveryAddress: `${order.address.name}, ${order.address.wholeAddress}`,
                deliveryDate: moment(
                  order.cartDetails.deliveryDate,
                  "MMM DD, YYYY hh:mm:a"
                )
                  .tz(process.env.TIME_ZONE)
                  .format("ddd Do MMMM"),
                orderId: order.orderId,
                paidAmount: order.cartDetails.totalAmountToBePaid,
                paymentType: order.paymentType,
                products: order.products.map((product) => ({
                  name: product.productName,
                  image: product.image,
                  description: product.description,
                  quantity: product.quantity,
                  amount: product.specialPrice,
                  realPrice: product.price,
                })),
                savedAmount: order.cartDetails.totalDiscountAmount,
                shippedDate: moment()
                  .tz(process.env.TIME_ZONE)
                  .format("DD MMM YYYY"),
              })
            ).catch((error) => console.log(error));

            //add order details to user notification
            await new userNotification({
              orderObjectId: validOrder._id,
              orderId: validOrder.orderId,
              paymentType: validOrder.paymentType,
              userId: validOrder.userId,
              cartDetails: validOrder.cartDetails,
              orderStatus: "order shipped",
              message: `your order for ${validOrder.orderId} was shipped`,
              arrivingDate: validOrder.deliveryDate,
            })
              .save()

              .then(async (response) => {
                res.status(200).json({
                  error: false,
                  message: "delivery boy status updated successfully",
                });
              })
              .catch(async (error) => {
                res.status(200).json({
                  error: true,
                  message: error,
                });
              });
          } else {
            res.status(200).json({
              status: false,
              message:
                "something went wrong Invalid order id please try again after some time",
            });
          }
        } else {
          res.status(200).json({
            status: false,
            message: "something went wrong please login and continue",
          });
        }
      } else if (req.body.status == "decline") {
        let data = req.body;
        data.deliveryBoyId = req.user._id;
        let DeliveryBoy = await DeliveryBoys.findOne({
          _id: data.deliveryBoyId,
        });
        if (DeliveryBoy) {
          let validOrder = await PickupPending.findOne({
            orderObjectId: data.orderObjectId,
          }).lean();
          if (validOrder) {
            await PickupPending.updateOne(
              {
                orderObjectId: mongoose.Types.ObjectId(req.body.orderObjectId),
              },
              {
                $set: {
                  status: "declined",
                },
              }
            );
            //code for deliveryboy credit
            const deliveryBoyCredit = await DeliveryBoyCredit.findOne({
              deliveryBoyId: data.deliveryBoyId,
            }).sort({ _id: -1 });
            let lastCredit = 0;
            if (deliveryBoyCredit) {
              lastCredit = deliveryBoyCredit.balance;
            } else {
              lastCredit = DeliveryBoy.credit;
            }

            let lastOrderDebit = validOrder.cartDetails.totalAmountToBePaid;
            let lastOrderBalance = 0;
            lastOrderBalance = parseFloat(lastCredit + lastOrderDebit).toFixed(
              2
            );
            await new DeliveryBoyCredit({
              deliveryBoyId: DeliveryBoy._id,
              orderObjectId: validOrder._id,
              orderId: validOrder.orderId,
              credit: lastOrderDebit,
              debit: 0,
              balance: lastOrderBalance,
              type: "order",
            })
              .save()
              .then(async (response) => {
                res.status(200).json({
                  error: false,
                  message: "delivery boy status updated successfully",
                });
              })
              .catch(async (error) => {
                res.status(200).json({
                  error: true,
                  message: error,
                });
              });
          } else {
            res.status(200).json({
              status: false,
              message:
                "something went wrong Invalid order id please try again after some time",
            });
          }
        } else {
          res.status(200).json({
            status: false,
            message: "something went wrong please login and continue",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          message:
            "something went wrong Invalid order id please try again after some time",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getPendingDeliveryOrders: async (req, res, next) => {
    try {
      const deliveryPendingOrders = await PickupPending.aggregate([
        {
          $match: {
            status: "picked up",
            deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
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
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$cartDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            userName: "$user.name",
            orderId: 1,
            orderObjectId: 1,
            paymentType: 1,
            totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
            status: 1,
          },
        },
        { $sort: { _id: -1 } },
      ]);
      return res.json({
        error: false,
        message: deliveryPendingOrders.length
          ? "Picked up orders found."
          : "Empty picked up orders.",
        data: {
          deliveryPendingOrders,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getPendingDeliverySingleOrders: async (req, res, next) => {
    try {
      const deliveryPendingOrder = await PickupPending.aggregate([
        {
          $match: {
            orderObjectId: mongoose.Types.ObjectId(req.body.orderObjectId),
            status: "picked up",
            deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
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
          $unwind: {
            path: "$order",
            preserveNullAndEmptyArrays: true,
          },
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
          $unwind: {
            path: "$store",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$cartDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            address: 1,
            products: 1,
            paymentType: 1,
            totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
            status: 1,
            storeAddress: {
              name: "$store.name",
              email: "$store.email",
              phone: "$store.phone",
              address: "$store.address",
              pin: "$store.pin",
              state: "$store.state",
              country: "$store.country",
              gst: "$store.gst",
            },
          },
        },
        { $sort: { _id: -1 } },
      ]);

      return res.json({
        error: false,
        message: deliveryPendingOrder.length
          ? "delivery pending orders found."
          : "Empty delivery pending orders.",
        data: {
          deliveryPendingOrder,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  changePendingOrderStatus: async (req, res, next) => {
    try {
      let data = req.body;
      data.deliveryBoyId = req.user._id;
      let DeliveryBoy = await DeliveryBoys.findOne({
        _id: data.deliveryBoyId,
      });
      if (DeliveryBoy) {
        let validOrder = await PickupPending.findOne({
          orderObjectId: data.orderObjectId,
          deliveryBoyId: data.deliveryBoyId,
        });
        if (validOrder) {
          await PickupPending.updateOne(
            { orderObjectId: mongoose.Types.ObjectId(req.body.orderObjectId) },
            {
              $set: {
                status: data.status,
                deliveredDate: moment(new Date()).tz(process.env.TIME_ZONE),
              },
            }
          );
          //update order status to  delivered

          await Order.updateOne(
            {
              _id: req.body.orderObjectId,
            },
            {
              $set: {
                orderStatus: "delivered",
                delivered: true,
                deliveredDate: moment(new Date()),
              },
            }
          );

          //order

          const order = await Order.findOne({ _id: data.orderObjectId });

          //user

          const user = await User.findOne({ _id: order.userId });

          //sent sms

          await TwoFactor.sendTemplate(
            user.phone,
            "delivered order",
            [order.orderId, process.env.CLIENT_URL],
            "MEDMAL"
          ).catch((error) => console.log(error));

          let orderObjectId = order._id;

          let splittedOrderId = orderObjectId
            .toString()
            .substr(orderObjectId.length - 12);

          //sent email
          await sendMail(
            process.env.EMAIL_ID,
            user.email,
            "Order delivered",
            generateOrderDeliveredEMailTemplate({
              username: user.name,
              deliveryAddress: ` ${order.address.name}, ${order.address.wholeAddress}`,
              returnId: order.orderId,
              products: order.products.map((product) => ({
                name: product.productName,
                image: product.image,
                description: product.description,
                quantity: product.quantity,
                realPrice: product.price,
                amount: product.specialPrice,
              })),
              invoiceLink: `${process.env.BASE_URL}order-invoice/pdf/Order-Invoice_${splittedOrderId}.pdf`,
            })
          ).catch((error) => console.log(error));

          //add order details to user notification
          await new userNotification({
            orderObjectId: validOrder._id,
            orderId: validOrder.orderId,
            paymentType: validOrder.paymentType,
            userId: validOrder.userId,
            cartDetails: validOrder.cartDetails,
            orderStatus: "delivered",
            message: `your order for ${validOrder.orderId} was delivered`,
            arrivingDate: moment(new Date()).tz(process.env.TIME_ZONE),
            products: validOrder.products,
          })
            .save()
            .then(async (response) => {
              res.status(200).json({
                error: false,
                message: " status updated successfully",
              });
            })
            .catch(async (error) => {
              res.status(200).json({
                error: true,
                message: error,
              });
            });
        } else {
          res.status(200).json({
            status: false,
            message:
              "something went wrong Invalid order id please try again after some time",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          message: "something went wrong please login and continue",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getDeliveredOrders: async (req, res, next) => {
    try {
      const deliveredOrders = await PickupPending.aggregate([
        {
          $match: {
            status: "delivered",
            deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
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
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$cartDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            userName: "$user.name",
            orderId: 1,
            paymentType: 1,
            orderObjectId: 1,
            totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
            deliveryCharge: "$cartDetails.deliveryCharge",
            isThisCartEligibleForFreeDelivery:
              "$cartDetails.isThisCartEligibleForFreeDelivery",
            status: 1,
          },
        },
        { $sort: { _id: -1 } },
      ]);
      let totalAmount = 0;
      for (let item of deliveredOrders) {
        totalAmount = parseInt(totalAmount + item.totalAmountToBePaid);
      }
      return res.json({
        error: false,
        message: deliveredOrders.length
          ? "deliveredOrders  orders found."
          : "Empty deliveredOrders orders.",
        data: {
          deliveredOrders,
          totalAmount,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getDateDeliveredOrders: async (req, res, next) => {
    try {
      let StartingDate = new Date(
        moment(req.body.StartingDate)
          .tz(process.env.TIME_ZONE)
          .set({ h: 00, m: 00, s: 00 })
      );

      let EndingDate = new Date(
        moment(req.body.EndingDate)
          .tz(process.env.TIME_ZONE)
          .set({ h: 23, m: 59, s: 59 })
      );
      const deliveredOrders = await PickupPending.aggregate([
        {
          $match: {
            $and: [
              { deliveredDate: { $gte: StartingDate } },
              { deliveredDate: { $lte: EndingDate } },
              { status: "delivered" },
              { deliveryBoyId: mongoose.Types.ObjectId(req.user._id) },
            ],
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
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$cartDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            userName: "$user.name",
            orderId: 1,
            orderObjectId: 1,
            paymentType: 1,
            totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
            deliveryCharge: "$cartDetails.deliveryCharge",
            isThisCartEligibleForFreeDelivery:
              "$cartDetails.isThisCartEligibleForFreeDelivery",
            status: 1,
          },
        },
        { $sort: { _id: -1 } },
      ]);
      let totalAmount = 0;
      for (let item of deliveredOrders) {
        totalAmount = parseFloat(
          totalAmount + item.totalAmountToBePaid
        ).toFixed(2);
      }
      return res.json({
        error: false,
        message: deliveredOrders.length
          ? "deliveredOrders  orders found."
          : "Empty deliveredOrders orders.",
        data: {
          deliveredOrders,
          totalAmount,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getDeliveredSingleOrders: async (req, res, next) => {
    try {
      const delivered = await PickupPending.aggregate([
        {
          $match: {
            orderObjectId: mongoose.Types.ObjectId(req.body.orderObjectId),
            status: "delivered",
            deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
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
          $unwind: {
            path: "$order",
            preserveNullAndEmptyArrays: true,
          },
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
          $unwind: {
            path: "$store",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$cartDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            address: 1,
            products: 1,
            paymentType: 1,
            totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
            deliveryCharge: "$cartDetails.deliveryCharge",
            isThisCartEligibleForFreeDelivery:
              "$cartDetails.isThisCartEligibleForFreeDelivery",
            status: 1,
            storeAddress: {
              name: "$store.name",
              email: "$store.email",
              phone: "$store.phone",
              address: "$store.address",
              pin: "$store.pin",
              state: "$store.state",
              country: "$store.country",
              gst: "$store.gst",
            },
          },
        },
        { $sort: { _id: -1 } },
      ]);
      let totalAmount = 0;
      for (let item of delivered) {
        totalAmount = parseFloat(
          totalAmount + item.totalAmountToBePaid
        ).toFixed(2);
      }
      return res.json({
        error: false,
        message: delivered.length
          ? "delivered orders found."
          : "Empty delivered orders.",
        data: {
          delivered,
          totalAmount,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getSearchedDeliveredOrders: async (req, res, next) => {
    try {
      let { searchBy } = req?.body;

      let searchQuery;
      searchQuery = [
        { orderId: { $regex: `${searchBy}`, $options: "i" } },
        { totalAmountToBePaid: { $regex: `${searchBy}`, $options: "i" } },
        { userName: { $regex: `${searchBy}`, $options: "i" } },
        { paymentType: { $regex: `${searchBy}`, $options: "i" } },
        { deliveryCharge: { $regex: `${searchBy}`, $options: "i" } },
      ];

      const deliveredOrders = await PickupPending.aggregate([
        {
          $match: {
            status: "delivered",
            deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
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
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$cartDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            userName: "$user.name",
            orderId: 1,
            orderObjectId: 1,
            paymentType: 1,
            totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
            deliveryCharge: "$cartDetails.deliveryCharge",
            isThisCartEligibleForFreeDelivery:
              "$cartDetails.isThisCartEligibleForFreeDelivery",
          },
        },
        {
          $match: {
            ...(searchBy && { $or: searchQuery }),
          },
        },
        { $sort: { _id: -1 } },
      ]);

      let totalAmount = 0;
      for (let item of deliveredOrders) {
        totalAmount = parseFloat(
          totalAmount + item.totalAmountToBePaid
        ).toFixed(2);
      }
      return res.json({
        error: false,
        message: deliveredOrders.length
          ? "deliveredOrders  orders found."
          : "Empty deliveredOrders orders.",
        data: {
          deliveredOrders,
          totalAmount,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getReturnOrders: async (req, res, next) => {
    try {
      const returnOrders = await ReturnOrders.aggregate([
        {
          $match: {
            status: "pickup pending",
            deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
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
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            userName: "$user.name",
            orderId: 1,
            orderObjectId: 1,
            products: 1,
            status: 1,
          },
        },
        { $sort: { _id: -1 } },
      ]);
      for (let item of returnOrders) {
        item.productCount = item.products.length;
      }
      return res.json({
        error: false,
        message: returnOrders.length
          ? "returnOrders  found."
          : "Empty returnOrders.",
        data: {
          returnOrders,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getReturnOrdersByType: async (req, res, next) => {
    try {
      if (req.body.type == "NewOrders") {
        const returnOrders = await ReturnOrders.aggregate([
          {
            $match: {
              status: "pickup pending",
              deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
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
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              userName: "$user.name",
              orderId: 1,
              orderObjectId: 1,
              products: 1,
              status: 1,
            },
          },
          { $sort: { _id: -1 } },
        ]);
        for (let item of returnOrders) {
          item.productCount = item.products.length;
        }
        return res.json({
          error: false,
          message: returnOrders.length
            ? "returnOrders  found."
            : "Empty returnOrders.",
          data: {
            returnOrders,
          },
        });
      } else if (req.body.type == "collectedOrders") {
        const returnOrders = await ReturnOrders.aggregate([
          {
            $match: {
              status: "collected",
              deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
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
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              userName: "$user.name",
              orderId: 1,
              orderObjectId: 1,
              products: 1,
              status: 1,
            },
          },
          { $sort: { _id: -1 } },
        ]);
        for (let item of returnOrders) {
          item.productCount = item.products.length;
        }
        return res.json({
          error: false,
          message: returnOrders.length
            ? "returnOrders  found."
            : "Empty returnOrders.",
          data: {
            returnOrders,
          },
        });
      } else if (req.body.type == "AcceptedOrders") {
        const returnOrders = await ReturnOrders.aggregate([
          {
            $match: {
              status: "accepted",
              deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
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
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              userName: "$user.name",
              orderId: 1,
              orderObjectId: 1,
              products: 1,
              status: 1,
            },
          },
          { $sort: { _id: -1 } },
        ]);
        for (let item of returnOrders) {
          item.productCount = item.products.length;
        }
        return res.json({
          error: false,
          message: returnOrders.length
            ? "returnOrders  found."
            : "Empty returnOrders.",
          data: {
            returnOrders,
          },
        });
      } else if (req.body.type == "AllOrders") {
        const returnOrders = await ReturnOrders.aggregate([
          {
            $match: {
              $or: [
                { status: "pickup pending" },
                { status: "collected" },
                { status: "accepted" },
                { status: "submitted" },
              ],
              deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
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
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              userName: "$user.name",
              orderId: 1,
              orderObjectId: 1,
              products: 1,
              status: 1,
            },
          },
          { $sort: { _id: -1 } },
        ]);
        for (let item of returnOrders) {
          item.productCount = item.products.length;
        }
        return res.json({
          error: false,
          message: returnOrders.length
            ? "returnOrders  found."
            : "Empty returnOrders.",
          data: {
            returnOrders,
          },
        });
      } else {
      }
    } catch (error) {
      next(error);
    }
  },
  getReturnSingleOrders: async (req, res, next) => {
    try {
      const singleReturnOrders = await ReturnOrders.aggregate([
        {
          $match: {
            orderObjectId: mongoose.Types.ObjectId(req.body.orderObjectId),
            deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
          },
        },
        {
          $lookup: {
            from: "returnorderreasons",
            localField: "orderObjectId",
            foreignField: "orderId",
            as: "returnOrderreason",
          },
        },
        {
          $lookup: {
            from: "stores",
            localField: "storeDetails.storeId",
            foreignField: "_id",
            as: "store",
          },
        },
        {
          $unwind: {
            path: "$store",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            address: 1,
            products: 1,
            status: 1,
            orderId: 1,
            orderObjectId: 1,
            returnOrderReason: { $last: "$returnOrderreason.reason" },
            Comments: { $last: "$returnOrderreason.notes" },
            // product_img: { $concat: [imgPath, "$product_img"] },
            // signature: { $concat: [imgPath, "$signature"] },
            storeAddress: {
              name: "$store.name",
              email: "$store.email",
              phone: "$store.phone",
              address: "$store.address",
              pin: "$store.pin",
              state: "$store.state",
              country: "$store.country",
              gst: "$store.gst",
            },
          },
        },
        { $sort: { _id: -1 } },
      ]);
      let productCount = 0;
      if (singleReturnOrders.length) {
        productCount = singleReturnOrders[0].products.length;
        if (singleReturnOrders[0].product_img) {
          singleReturnOrders[0].product_img = imgPath.concat(
            singleReturnOrders[0].product_img
          );
        } else {
          singleReturnOrders[0].product_img = "";
        }
        if (singleReturnOrders[0].signature) {
          singleReturnOrders[0].signature = imgPath.concat(
            singleReturnOrders[0].signature
          );
        } else {
          singleReturnOrders[0].signature = "";
        }
      }
      return res.json({
        error: false,
        message: singleReturnOrders.length
          ? "singleReturnOrders  orders found."
          : "Empty singleReturnOrders  orders.",
        data: {
          singleReturnOrders,
          productCount,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  changeReturnOrderStatus: async (req, res, next) => {
    try {
      let data = req.body;
      data.deliveryBoyId = req.user._id;
      let DeliveryBoy = await DeliveryBoys.findOne({
        _id: data.deliveryBoyId,
      });
      if (DeliveryBoy) {
        let validOrder = await ReturnOrders.findOne({
          orderObjectId: data.orderObjectId,
        });
        if (validOrder) {
          if (validOrder.status == "collected" && data.status == "submitted") {
            await ReturnOrders.updateOne(
              {
                orderObjectId: mongoose.Types.ObjectId(req.body.orderObjectId),
              },
              {
                $set: {
                  status: data.status,
                  deliveryBoyId: data.deliveryBoyId,
                  submittedDate: moment(new Date()).tz(process.env.TIME_ZONE),
                },
              }
            )
              .then(async (response) => {
                res.status(200).json({
                  error: false,
                  message: "Return products submitted successfully",
                });
              })
              .catch(async (error) => {
                res.status(200).json({
                  error: true,
                  message: error,
                });
              });

            //sent sms

            // if (validOrder.status == "collected") {
            //   await TwoFactor.sendTemplate(
            //     req.user.phone,
            //     "Return picked up",
            //     [],
            //     "MEDMAL"
            //   ).catch((error) => console.log(error));
            // }
          } else if (
            validOrder.status == "pickup pending" &&
            data.status == "accepted"
          ) {
            await ReturnOrders.updateOne(
              {
                orderObjectId: mongoose.Types.ObjectId(req.body.orderObjectId),
              },
              {
                $set: {
                  status: data.status,
                  deliveryBoyId: data.deliveryBoyId,
                  pickedUpDate: moment(new Date()).tz(process.env.TIME_ZONE),
                },
              }
            )
              .then(async (response) => {
                res.status(200).json({
                  error: false,
                  message: "return products accepted successfully",
                });
              })
              .catch(async (error) => {
                res.status(200).json({
                  error: true,
                  message: error,
                });
              });
          } else if (
            validOrder.status == "pickup pending" &&
            data.status == "rejected"
          ) {
            await ReturnOrders.updateOne(
              {
                orderObjectId: mongoose.Types.ObjectId(req.body.orderObjectId),
              },
              {
                $set: {
                  status: data.status,
                  deliveryBoyId: data.deliveryBoyId,
                  canceledDate: moment(new Date()).tz(process.env.TIME_ZONE),
                },
              }
            )
              .then(async (response) => {
                res.status(200).json({
                  error: false,
                  message: "Return order declined successfully",
                });
              })
              .catch(async (error) => {
                res.status(200).json({
                  error: true,
                  message: error,
                });
              });
          } else {
            res.status(200).json({
              status: false,
              message:
                "something went wrong Invalid order id please try again after some time",
            });
          }
        } else {
          res.status(200).json({
            status: false,
            message:
              "something went wrong Invalid order id please try again after some time",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          message: "something went wrong please login and continue",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  submitReturnOrderStatus: async (req, res, next) => {
    try {
      let data = req.body;
      data.deliveryBoyId = req.user._id;
      let DeliveryBoy = await DeliveryBoys.findOne({
        _id: data.deliveryBoyId,
      });
      if (DeliveryBoy) {
        let validOrder = await ReturnOrders.findOne({
          orderObjectId: data.orderObjectId,
        });
        if (validOrder) {
          if (req.files.product_img) {
            data.product_img = `delivery/${req.files.product_img[0].filename}`;
          }
          if (req.files.signature) {
            data.signature = `delivery/${req.files.signature[0].filename}`;
          }
          if (validOrder.status == "accepted" && data.status == "collected") {
            await ReturnOrders.updateOne(
              {
                orderObjectId: mongoose.Types.ObjectId(req.body.orderObjectId),
              },
              {
                $set: {
                  status: data.status,
                  deliveryBoyId: data.deliveryBoyId,
                  collectedDate: moment(new Date()).tz(process.env.TIME_ZONE),
                  product_img: data.product_img,
                  signature: data.signature,
                  Comments: data.Comments,
                },
              }
            )
              .then(async (response) => {
                res.status(200).json({
                  error: false,
                  message: "Return products collected successfully",
                });
              })
              .catch(async (error) => {
                res.status(200).json({
                  error: true,
                  message: error,
                });
              });
          } else {
            res.status(200).json({
              status: false,
              message:
                "something went wrong please accept the package and try again after some time",
            });
          }
        } else {
          res.status(200).json({
            status: false,
            message:
              "something went wrong Invalid order id please try again after some time",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          message: "something went wrong please login and continue",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getSearchedReturnOrder: async (req, res, next) => {
    try {
      let { searchBy } = req?.body;

      let searchQuery;
      searchQuery = [
        { orderId: { $regex: `${searchBy}`, $options: "i" } },
        { userName: { $regex: `${searchBy}`, $options: "i" } },
      ];
      if (req.body.Type == "NewOrders") {
        const returnOrders = await ReturnOrders.aggregate([
          {
            $match: {
              status: "pickup pending",
              deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
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
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: "$cartDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              userName: "$user.name",
              orderId: 1,
              orderObjectId: 1,
              products: 1,
              status: 1,
            },
          },
          {
            $match: {
              ...(searchBy && { $or: searchQuery }),
            },
          },
          { $sort: { _id: -1 } },
        ]);
        for (let item of returnOrders) {
          item.productCount = item.products.length;
        }
        return res.json({
          error: false,
          message: returnOrders.length
            ? "returnOrders found."
            : "Empty returnOrders.",
          data: {
            returnOrders,
          },
        });
      } else if (req.body.Type == "collectedOrders") {
        const returnOrders = await ReturnOrders.aggregate([
          {
            $match: {
              status: "collected",
              deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
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
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: "$cartDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              userName: "$user.name",
              orderId: 1,
              orderObjectId: 1,
              products: 1,
              status: 1,
            },
          },
          {
            $match: {
              ...(searchBy && { $or: searchQuery }),
            },
          },
          { $sort: { _id: -1 } },
        ]);
        for (let item of returnOrders) {
          item.productCount = item.products.length;
        }
        return res.json({
          error: false,
          message: returnOrders.length
            ? "returnOrders found."
            : "Empty returnOrders.",
          data: {
            returnOrders,
          },
        });
      } else if (req.body.Type == "AcceptedOrders") {
        const returnOrders = await ReturnOrders.aggregate([
          {
            $match: {
              $or: [{ status: "accepted" }],
              deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
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
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: "$cartDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              userName: "$user.name",
              orderId: 1,
              orderObjectId: 1,
              products: 1,
              status: 1,
            },
          },
          {
            $match: {
              ...(searchBy && { $or: searchQuery }),
            },
          },
          { $sort: { _id: -1 } },
        ]);
        for (let item of returnOrders) {
          item.productCount = item.products.length;
        }
        return res.json({
          error: false,
          message: returnOrders.length
            ? "returnOrders found."
            : "Empty returnOrders.",
          data: {
            returnOrders,
          },
        });
      } else if (req.body.Type == "AllOrders") {
        const returnOrders = await ReturnOrders.aggregate([
          {
            $match: {
              $or: [
                { status: "pickup pending" },
                { status: "collected" },
                { status: "accepted" },
                { status: "submitted" },
              ],
              deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
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
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: "$cartDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              userName: "$user.name",
              orderId: 1,
              orderObjectId: 1,
              products: 1,
              status: 1,
            },
          },
          {
            $match: {
              ...(searchBy && { $or: searchQuery }),
            },
          },
          { $sort: { _id: -1 } },
        ]);
        for (let item of returnOrders) {
          item.productCount = item.products.length;
        }
        return res.json({
          error: false,
          message: returnOrders.length
            ? "returnOrders found."
            : "Empty returnOrders.",
          data: {
            returnOrders,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getDeliveryBoyTransactions: async (req, res, next) => {
    try {
      if (req.body.Type == "pendingToAdmin") {
        const transactions = await PickupPending.aggregate([
          {
            $match: {
              status: "delivered",
              paymentType: "cod",
              paidToAdmin: "pending to paid",
              deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
              paidTodeliveryBoy: "pending to paid",
            },
          },
          {
            $unwind: {
              path: "$cartDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              orderId: 1,
              paymentType: 1,
              orderObjectId: 1,
              totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
              status: 1,
              paidToAdmin: 1,
              deliveredDate: 1,
            },
          },
          { $sort: { _id: -1 } },
        ]);
        let totalAmount = 0;
        for (let item of transactions) {
          item.deliveredDate = moment(item.deliveredDate).format("DD-MM-YYYY");
          totalAmount = parseInt(totalAmount + item.totalAmountToBePaid);
        }
        return res.json({
          error: false,
          message: transactions.length
            ? "transactions found."
            : "Empty transactions.",
          data: {
            transactions,
            totalAmount,
          },
        });
      } else if (req.body.Type == "paidToAdmin") {
        const transactions = await PickupPending.aggregate([
          {
            $match: {
              status: "delivered",
              paymentType: "cod",
              paidToAdmin: "paid",
              $or: [
                { paidTodeliveryBoy: "pending to paid" },
                { paidTodeliveryBoy: "paid" },
              ],
              deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
            },
          },
          {
            $unwind: {
              path: "$cartDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              orderId: 1,
              paymentType: 1,
              orderObjectId: 1,
              totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
              status: 1,
              paidToAdmin: 1,
              deliveredDate: 1,
            },
          },
          { $sort: { _id: -1 } },
        ]);
        for (let item of transactions) {
          item.deliveredDate = moment(item.deliveredDate).format("DD-MM-YYYY");
        }
        return res.json({
          error: false,
          message: transactions.length
            ? "transactions found."
            : "Empty transactions.",
          data: {
            transactions,
          },
        });
      } else {
        return res.json({
          error: true,
          message: "invalid Type.",
          data: {},
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getDatedDeliveryBoyTransactions: async (req, res, next) => {
    try {
      let StartingDate = new Date(
        moment(req.body.StartingDate)
          .tz(process.env.TIME_ZONE)
          .set({ h: 00, m: 00, s: 00 })
      );

      let EndingDate = new Date(
        moment(req.body.EndingDate)
          .tz(process.env.TIME_ZONE)
          .set({ h: 23, m: 59, s: 59 })
      );

      if (req.body.Type == "pendingToAdmin") {
        const DatedTransactions = await PickupPending.aggregate([
          {
            $match: {
              $and: [
                { deliveredDate: { $gte: StartingDate } },
                { deliveredDate: { $lte: EndingDate } },
                { status: "delivered" },
                { paymentType: "cod" },
                { paidToAdmin: "pending to paid" },
                { paidTodeliveryBoy: "pending to paid" },
                { deliveryBoyId: mongoose.Types.ObjectId(req.user._id) },
              ],
            },
          },
          {
            $unwind: {
              path: "$cartDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              orderId: 1,
              paymentType: 1,
              orderObjectId: 1,
              totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
              status: 1,
              paidToAdmin: 1,
              deliveredDate: 1,
            },
          },
          { $sort: { _id: -1 } },
        ]);
        let totalAmount = 0;
        for (let item of DatedTransactions) {
          item.deliveredDate = moment(item.deliveredDate).format("DD-MM-YYYY");
          totalAmount = parseInt(totalAmount + item.totalAmountToBePaid);
        }
        return res.json({
          error: false,
          message: DatedTransactions.length
            ? "DatedTransactions found."
            : "Empty DatedTransactions.",
          data: {
            DatedTransactions,
          },
        });
      } else if (req.body.Type == "paidToAdmin") {
        const DatedTransactions = await PickupPending.aggregate([
          {
            $match: {
              $and: [
                { deliveredDate: { $gte: StartingDate } },
                { deliveredDate: { $lte: EndingDate } },
                { status: "delivered" },
                { paymentType: "cod" },
                { paidToAdmin: "paid" },
                { paidTodeliveryBoy: "paid" },
                { deliveryBoyId: mongoose.Types.ObjectId(req.user._id) },
              ],
            },
          },
          {
            $unwind: {
              path: "$cartDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              orderId: 1,
              paymentType: 1,
              orderObjectId: 1,
              totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
              status: 1,
              paidToAdmin: 1,
              deliveredDate: 1,
            },
          },
          { $sort: { _id: -1 } },
        ]);
        for (let item of DatedTransactions) {
          item.deliveredDate = moment(item.deliveredDate).format("DD-MM-YYYY");
        }
        return res.json({
          error: false,
          message: DatedTransactions.length
            ? "transactions found."
            : "Empty transactions.",
          data: {
            DatedTransactions,
          },
        });
      } else {
        return res.json({
          error: true,
          message: "invalid Type.",
          data: {},
        });
      }
    } catch (error) {
      next(error);
    }
  },

  getSearchedDeliveryBoyTransactions: async (req, res, next) => {
    try {
      let { searchBy } = req?.body;

      let searchQuery;
      searchQuery = [
        { orderId: { $regex: `${searchBy}`, $options: "i" } },
        { totalAmountToBePaid: { $regex: `${searchBy}`, $options: "i" } },
        { status: { $regex: `${searchBy}`, $options: "i" } },
        { paymentType: { $regex: `${searchBy}`, $options: "i" } },
        { paidToAdmin: { $regex: `${searchBy}`, $options: "i" } },
      ];

      if (req.body.Type == "pendingToAdmin") {
        const SearchedTransactions = await PickupPending.aggregate([
          {
            $match: {
              status: "delivered",
              paymentType: "cod",
              paidToAdmin: "pending to paid",
              paidTodeliveryBoy: "pending to paid",
              deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
            },
          },
          {
            $unwind: {
              path: "$cartDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              orderId: 1,
              paymentType: 1,
              orderObjectId: 1,
              totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
              status: 1,
              paidToAdmin: 1,
              deliveredDate: 1,
            },
          },
          {
            $match: {
              ...(searchBy && { $or: searchQuery }),
            },
          },
          { $sort: { _id: -1 } },
        ]);
        let totalAmount = 0;
        for (let item of SearchedTransactions) {
          item.deliveredDate = moment(item.deliveredDate).format("DD-MM-YYYY");
          totalAmount = parseInt(totalAmount + item.totalAmountToBePaid);
        }
        return res.json({
          error: false,
          message: SearchedTransactions.length
            ? "SearchedTransactions found."
            : "Empty SearchedTransactions.",
          data: {
            SearchedTransactions,
          },
        });
      } else if (req.body.Type == "paidToAdmin") {
        const SearchedTransactions = await PickupPending.aggregate([
          {
            $match: {
              status: "delivered",
              paymentType: "cod",
              paidToAdmin: "paid",
              paidTodeliveryBoy: "paid",
              deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
            },
          },
          {
            $unwind: {
              path: "$cartDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              orderId: 1,
              paymentType: 1,
              orderObjectId: 1,
              totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
              status: 1,
              paidToAdmin: 1,
              deliveredDate: 1,
            },
          },
          {
            $match: {
              ...(searchBy && { $or: searchQuery }),
            },
          },
          { $sort: { _id: -1 } },
        ]);
        for (let item of SearchedTransactions) {
          item.deliveredDate = moment(item.deliveredDate).format("DD-MM-YYYY");
        }
        return res.json({
          error: false,
          message: SearchedTransactions.length
            ? "SearchedTransactions found."
            : "Empty SearchedTransactions.",
          data: {
            SearchedTransactions,
          },
        });
      } else {
        return res.json({
          error: true,
          message: "invalid Type.",
          data: {},
        });
      }
    } catch (error) {
      next(error);
    }
  },

  getDeliveryCredits: async (req, res, next) => {
    try {
      const DeliveryBoyCredits = await DeliveryBoyCredit.aggregate([
        {
          $match: {
            deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
          },
        },
        {
          $project: {
            _id: 1,
            orderId: 1,
            deliveryBoyId: 1,
            credit: 1,
            debit: 1,
            balance: 1,
            createdAt: 1,
            type: 1,
          },
        },
        { $sort: { _id: -1 } },
      ]);
      for (let item of DeliveryBoyCredits) {
        item.createdAt = moment(item.createdAt).format("DD-MM-YYYY");
      }
      const deliveryBoy = await DeliveryBoys.findOne({
        _id: req.user._id,
        isActive: true,
        isApproved: "approved",
      });
      const deliveryBoyCredit = await DeliveryBoyCredit.findOne({
        deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
      }).sort({ _id: -1 });
      let creditBalance = 0;
      if (deliveryBoyCredit) {
        creditBalance = deliveryBoyCredit.balance;
      } else {
        creditBalance = deliveryBoy.credit;
      }

      return res.json({
        error: false,
        message: DeliveryBoyCredits.length
          ? "DeliveryBoyCredits found."
          : "Empty DeliveryBoyCredits.",
        data: {
          DeliveryBoyCredits,
          creditBalance,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getDatedDeliveryBoyCredits: async (req, res, next) => {
    try {
      let StartingDate = new Date(
        moment(req.body.StartingDate)
          .tz(process.env.TIME_ZONE)
          .set({ h: 00, m: 00, s: 00 })
      );

      let EndingDate = new Date(
        moment(req.body.EndingDate)
          .tz(process.env.TIME_ZONE)
          .set({ h: 23, m: 59, s: 59 })
      );

      const DatedCredits = await DeliveryBoyCredit.aggregate([
        {
          $match: {
            $and: [
              { createdAt: { $gte: StartingDate } },
              { createdAt: { $lte: EndingDate } },
              { deliveryBoyId: mongoose.Types.ObjectId(req.user._id) },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            orderId: 1,
            deliveryBoyId: 1,
            credit: 1,
            debit: 1,
            balance: 1,
            createdAt: 1,
            type: 1,
          },
        },
        { $sort: { _id: -1 } },
      ]);
      for (let item of DatedCredits) {
        item.createdAt = moment(item.createdAt).format("DD-MM-YYYY");
      }
      const deliveryBoy = await DeliveryBoys.findOne({
        _id: req.user._id,
        isActive: true,
        isApproved: "approved",
      });
      const deliveryBoyCredit = await DeliveryBoyCredit.findOne({
        deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
      }).sort({ _id: -1 });
      let creditBalance = 0;
      if (deliveryBoyCredit) {
        creditBalance = deliveryBoyCredit.balance;
      } else {
        creditBalance = deliveryBoy.credit;
      }
      return res.json({
        error: false,
        message: DatedCredits.length
          ? "DatedCredits found."
          : "Empty DatedCredits.",
        data: {
          DatedCredits,
          creditBalance,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getSearchedDeliveryBoyCredits: async (req, res, next) => {
    try {
      let { searchBy } = req?.body;

      let searchQuery;
      searchQuery = [
        { orderId: { $regex: `${searchBy}`, $options: "i" } },
        { credit: { $regex: `${searchBy}`, $options: "i" } },
        { debit: { $regex: `${searchBy}`, $options: "i" } },
        { balance: { $regex: `${searchBy}`, $options: "i" } },
      ];
      const SearchedCredits = await DeliveryBoyCredit.aggregate([
        {
          $match: {
            deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
          },
        },
        {
          $project: {
            _id: 1,
            orderId: 1,
            deliveryBoyId: 1,
            credit: 1,
            debit: 1,
            balance: 1,
            createdAt: 1,
            type: 1,
          },
        },
        { $sort: { _id: -1 } },
      ]);

      for (let item of SearchedCredits) {
        item.createdAt = moment(item.createdAt).format("DD-MM-YYYY");
      }

      const deliveryBoy = await DeliveryBoys.findOne({
        _id: req.user._id,
        isActive: true,
        isApproved: "approved",
      });

      const deliveryBoyCredit = await DeliveryBoyCredit.findOne({
        deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
      }).sort({ _id: -1 });

      let creditBalance = 0;

      if (deliveryBoyCredit) {
        creditBalance = deliveryBoyCredit.balance;
      } else {
        creditBalance = deliveryBoy.credit;
      }

      return res.json({
        error: false,
        message: SearchedCredits.length
          ? "SearchedCredits found."
          : "Empty SearchedCredits.",
        data: {
          SearchedCredits,
          creditBalance,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getEmergencyContact: async (req, res, next) => {
    try {
      const EmergencyContact = await emergencyContact.find();
      return res.json({
        error: false,
        message: EmergencyContact.length
          ? "EmergencyContact found."
          : "Empty EmergencyContacts.",
        data: {
          EmergencyContact,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  editEmergencyContact: async (req, res, next) => {
    try {
      let data = req.body;

      let validData = await emergencyContact.findOne({
        _id: data.id,
      });
      if (validData) {
        let existingName = await emergencyContact.findOne({
          Name: data.Name,
          _id: { $ne: data.id },
        });
        let existingNumber = await emergencyContact.findOne({
          contactNumber: data.contactNumber,
          _id: { $ne: data.id },
        });
        if (!existingName) {
          if (!existingNumber) {
            await emergencyContact
              .updateOne({ _id: mongoose.Types.ObjectId(data.id) }, data)
              .then(async (response) => {
                res.status(200).json({
                  error: false,
                  message: " emergency contact updated successfully",
                });
              })
              .catch(async (error) => {
                res.status(200).json({
                  error: true,
                  message: error,
                });
              });
          } else {
            res.status(200).json({
              status: false,
              message: "something went wrong number already taken",
            });
          }
        } else {
          res.status(200).json({
            status: false,
            message: "something went wrong Name already taken",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          message: "something went wrong please login and continue",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  addEmergencyContact: async (req, res, next) => {
    try {
      let existingName = await emergencyContact.findOne({
        Name: req.body.Name,
      });
      let existingNumber = await emergencyContact.findOne({
        contactNumber: req.body.contactNumber,
      });

      if (!existingName) {
        if (!existingNumber) {
          var data = req.body;

          let schemaObject = new emergencyContact(data);

          schemaObject.save().then((response) => {
            res.status(200).json({
              error: false,
              message: "contact added successfully",
            });
          });
        } else {
          res.status(200).json({
            error: true,
            message: "Existing Contact number",
          });
        }
      } else {
        res.status(200).json({
          error: true,
          message: "Existing Name",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getBankDetails: async (req, res, next) => {
    try {
      const BankDetails = await bankDetails.find();
      const transactions = await PickupPending.aggregate([
        {
          $match: {
            status: "delivered",
            paymentType: "cod",
            paidToAdmin: "pending to paid",
            deliveryBoyId: mongoose.Types.ObjectId(req.user._id),
            paidTodeliveryBoy: "pending to paid",
          },
        },
        {
          $unwind: {
            path: "$cartDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
          },
        },
        { $sort: { _id: -1 } },
      ]);
      let totalDueAmount = 0;
      for (let item of transactions) {
        totalDueAmount = parseFloat(
          totalDueAmount + item.totalAmountToBePaid
        ).toFixed(2);
      }
      return res.json({
        error: false,
        message: BankDetails.length
          ? "BankDetails found."
          : "Empty BankDetails.",
        data: {
          BankDetails,
          totalDueAmount,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  editBankDetails: async (req, res, next) => {
    try {
      let data = req.body;

      await bankDetails
        .updateOne({ _id: mongoose.Types.ObjectId(data.id) }, data)
        .then(async (response) => {
          res.status(200).json({
            error: false,
            message: " bankDetails contact updated successfully",
          });
        })
        .catch(async (error) => {
          res.status(200).json({
            error: true,
            message: error,
          });
        });
    } catch (error) {
      next(error);
    }
  },
  addBankDetails: async (req, res, next) => {
    try {
      var data = req.body;

      let schemaObject = new bankDetails(data);

      schemaObject.save().then((response) => {
        res.status(200).json({
          error: false,
          message: "bankDetails added successfully",
        });
      });
    } catch (error) {
      next(error);
    }
  },
  addQuery: async (req, res, next) => {
    try {
      var data = req.body;
      data.DeliveryBoyID = req.user._id;
      let schemaObject = new deliveryBoyQuery(data);

      schemaObject.save().then((response) => {
        res.status(200).json({
          error: false,
          message: "deliveryBoyQuery added successfully",
        });
      });
    } catch (error) {
      next(error);
    }
  },
  getDeliveryBoyNotifications: async (req, res, next) => {
    try {
      const deliveryBoyNotification = await DeliveryBoyNotification.aggregate([
        {
          $match: {
            DeliveryBoyID: mongoose.Types.ObjectId(req.user._id),
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
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$cartDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            userName: "$user.name",
            orderId: 1,
            orderObjectId: 1,
            paymentType: 1,
            totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
            type: 1,
            isRead: 1,
          },
        },
        { $sort: { _id: -1 } },
      ]);
      let notificationCount = await DeliveryBoyNotification.countDocuments({
        DeliveryBoyID: mongoose.Types.ObjectId(req.user._id),
        isRead: false,
      });

      return res.json({
        error: false,
        message: deliveryBoyNotification.length
          ? "deliveryBoyNotification found."
          : "Empty deliveryBoyNotification.",
        data: {
          deliveryBoyNotification,
          notificationCount,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getDeliveryBoyMessages: async (req, res, next) => {
    try {
      const deliveryBoyMessage = await deliveryBoyQuery.aggregate([
        {
          $match: {
            DeliveryBoyID: mongoose.Types.ObjectId(req.user._id),
            isReplied: true,
          },
        },
        {
          $project: {
            _id: 1,
            IssueRelated: 1,
            Issue: 1,
            reply: 1,
            createdAt: 1,
            isRead: 1,
          },
        },
        { $sort: { _id: -1 } },
      ]);
      for (let item of deliveryBoyMessage) {
        item.createdAt = moment(item.createdAt).format("DD-MM-YYYY");
      }
      let messageCount = await deliveryBoyQuery.countDocuments({
        DeliveryBoyID: mongoose.Types.ObjectId(req.user._id),
        isRead: false,
        isReplied: true,
      });
      return res.json({
        error: false,
        message: deliveryBoyMessage.length
          ? "deliveryBoyMessage found."
          : "Empty deliveryBoyMessage.",
        data: {
          deliveryBoyMessage,
          messageCount,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  changeReadStatus: async (req, res, next) => {
    try {
      let data = req.body;
      let validMessage = await deliveryBoyQuery.findOne({
        DeliveryBoyID: req.user._id,
        _id: data.queryId,
      });
      if (validMessage) {
        await deliveryBoyQuery
          .updateOne(
            { _id: data.queryId },
            {
              $set: {
                isRead: true,
              },
            }
          )
          .then(async (response) => {
            res.status(200).json({
              error: false,
              message: "delivery boy message updated successfully",
            });
          })
          .catch(async (error) => {
            res.status(200).json({
              error: true,
              message: error,
            });
          });
      } else {
        res.status(200).json({
          status: false,
          message: "something went wrong please login and continue",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  changeNotificationReadStatus: async (req, res, next) => {
    try {
      let data = req.body;
      let validNotification = await DeliveryBoyNotification.findOne({
        DeliveryBoyID: req.user._id,
        _id: data.notificationId,
      });
      if (validNotification) {
        await DeliveryBoyNotification.updateOne(
          { _id: data.notificationId },
          {
            $set: {
              isRead: true,
            },
          }
        )
          .then(async (response) => {
            res.status(200).json({
              error: false,
              message: "delivery boy notification status updated successfully",
            });
          })
          .catch(async (error) => {
            res.status(200).json({
              error: true,
              message: error,
            });
          });
      } else {
        res.status(200).json({
          status: false,
          message: "something went wrong please login and continue",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteOneMessage: async (req, res, next) => {
    try {
      let result = await DeliveryBoyQueries.findOne({
        _id: mongoose.Types.ObjectId(req.body.id),
        isRead: true,
      });
      if (result) {
        DeliveryBoyQueries.deleteOne({
          _id: mongoose.Types.ObjectId(req.body.id),
        })
          .then((_) => {
            res.status(200).json({
              status: true,
              data: "Data removed successfully",
            });
          })
          .catch((error) => {
            res.status(200).json({
              status: false,
              data: error,
            });
          });
      } else {
        res.status(200).json({
          status: false,
          data: "invalid id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteAllMessages: async (req, res, next) => {
    try {
      let result = await DeliveryBoys.find({
        DeliveryBoyID: mongoose.Types.ObjectId(req.user._id),
        isRead: true,
      });
      if (result.length) {
        DeliveryBoyQueries.deleteMany({
          DeliveryBoyID: mongoose.Types.ObjectId(req.user._id),
          isRead: true,
        })
          .then((_) => {
            res.status(200).json({
              status: true,
              data: "Data removed successfully",
            });
          })
          .catch((error) => {
            res.status(200).json({
              status: false,
              data: error,
            });
          });
      } else {
        res.status(200).json({
          status: false,
          data: "invalid id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
