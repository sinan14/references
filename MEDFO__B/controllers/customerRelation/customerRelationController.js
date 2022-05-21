const mongoose = require("mongoose");
const fs = require("fs");
const { isArray } = require("util");
const moment = require("moment");

const CustomerRelation = require("../../models/modelCustomerRelation/customerRelation");
const CustomerRemarks = require("../../models/modelCustomerRelation/customerRemarks");
const User = require("../../models/user");
const Order = require("../../models/orders/order");
const Prescription = require("../../models/prescription");
const PaymentLink = require("../../models/orders/paymentLink");
const UserSubscription = require("../../models/orders/userSubscription");
const Cart = require("../../models/cart");
const UserAppliedCoupons = require("../../models/cart/userAppliedCoupons");
const UserAppliedMedCoins = require("../../models/cart/userAppliedMedCoin");
const UserAppliedDonation = require("../../models/cart/userAppliedDonation");

const { doPlaceOrder } = require("../purchase/purchaseController");
const { razorpay } = require("../../constants/paymentGateways/paymentGateway");

const {
  doGetMedCartWeb,
  doAddProductToCart,
  doUpdateCartItem,
  doRemoveCartItem,
  doApplyACouponToTheCart,
  doRemoveCouponFromTheCart,
  doApplyMedCoinToTheCart,
} = require("../cart/cartController");

const { doAddUserAddress } = require("../userDetailsController");

const {
  validateGetCart,
  validateUpdateCartItem,
  validateRemoveCartItem,
  validateUserId,
  validateOrderId,
} = require("../../validations/customerRelation/customerRelationValidations");

const imgPath = process.env.BASE_URL;

//cart

//get cart details

const getCart = async (req, res, next) => {
  try {
    //validate data
    const dataValidation = await validateGetCart(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.json({
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
        message: "Invalid user id.",
      });
    }

    let response = await doGetMedCartWeb(userId);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const addProductToCart = async (req, res, next) => {
  try {
    let response = await doAddProductToCart(req.body);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { userId } = req.body || {};

    //validate data
    const dataValidation = await validateUpdateCartItem({ userId });
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.json({
        error: true,
        message: message,
      });
    }

    delete req.body.userId;

    const response = await doUpdateCartItem(req.body, userId);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const { userId, cartId } = req.body || {};

    //validate data
    const dataValidation = await validateRemoveCartItem({ userId });
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.json({
        error: true,
        message: message,
      });
    }

    const response = await doRemoveCartItem(userId, {
      cartId,
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const applyACouponToTheCart = async (req, res, next) => {
  try {
    const { userId } = req.body || {};

    //validate data
    const dataValidation = await validateUserId({ userId });
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.json({
        error: true,
        message: message,
      });
    }

    delete req.body.userId;

    const response = await doApplyACouponToTheCart(userId, req.body);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const removeCouponFromTheCart = async (req, res, next) => {
  try {
    const { userId, couponId } = req.body || {};

    //validate data
    const dataValidation = await validateUserId({ userId });
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.json({
        error: true,
        message: message,
      });
    }

    delete req.body.userId;

    const response = await doRemoveCouponFromTheCart(userId, { couponId });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const editAppliedMedCoinCount = async (req, res, next) => {
  try {
    const { userId } = req.body || {};

    //validate data
    const dataValidation = await validateUserId({ userId });
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.json({
        error: true,
        message: message,
      });
    }

    delete req.body.userId;

    const response = await doApplyMedCoinToTheCart(userId, req.body);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const placeOrder = async (req, res, next) => {
  try {
    const { userId } = req.body || {};

    //validate data
    const dataValidation = await validateUserId({ userId });
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.json({
        error: true,
        message: message,
      });
    }

    const cart = await doGetMedCartWeb(userId);

    const response = await doPlaceOrder(
      cart.data,
      "cod",
      userId,
      false,
      false,
      cart.data[0].medCart.products.map((cartItem) => ({
        cartId: cartItem._id,
        subscription: false,
        interval: "",
      }))
    );

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const addUserAddress = async (req, res, next) => {
  try {
    let data = req.body;

    const { userId } = req.body || {};

    //validate data
    const dataValidation = await validateUserId({ userId });
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.json({
        error: true,
        message: message,
      });
    }

    data.userId = userId;

    let response = await doAddUserAddress(data);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const uploadPrescription = async (req, res, next) => {
  try {
    let images = [];
    if (req.files?.prescription) {
      for (let item of req.files.prescription) {
        let obj = `${imgPath}users/${item.filename}`;
        images.push(obj);
      }
      res.status(200).json({
        error: false,
        message: "Prescription image upload successfully.",
        data: {
          images,
        },
      });
    } else {
      res.status(200).json({
        error: false,
        message: "Please upload image",
      });
    }
  } catch (error) {
    next(error);
  }
};

const addOrderToSubscription = async (req, res, next) => {
  try {
    const { userId } = req.body || {};

    //validate data
    const dataValidation = await validateOrderId(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.json({
        error: true,
        message: message,
      });
    }

    const { orderId, subscriptionInterval } = req.body || {};

    //check if it is a valid order

    const order = await Order.findOne({
      _id: orderId,
    });

    if (!order) {
      return res.json({
        error: true,
        message: "Invalid order id.",
      });
    }

    //check if there is a subscription already available with this order id

    const existingSubscription = await UserSubscription.findOne({
      originalOrderId: orderId,
    });

    if (existingSubscription) {
      return res.json({
        error: true,
        message: "This order is already a subscription.",
      });
    }

    //subscription id

    let subscriptionId = "MDFL-SUB-1001";

    const subscriptionDocument = await UserSubscription.findOne().sort({
      _id: -1,
    });

    if (subscriptionDocument) {
      subscriptionId = `MDFL-SUB-${
        parseInt(subscriptionDocument.subscriptionId.split("-")[2]) + 1
      }`;
    }

    //save subscription

    await UserSubscription({
      userId: order.userId,
      products: order.products,
      deliveryDate: moment(order.deliveryDate, "MMM DD, YYYY hh:mm:a"),
      nextDeliveryDate: moment(order.deliveryDate, "MMM DD, YYYY hh:mm:a").add(
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
      prescription: order.prescription,
    }).save();

    res.json({
      error: false,
      message: "Order successfully added to subscription.",
    });
  } catch (error) {
    next(error);
  }
};

const sendPaymentLinkMakeNewOrder = async (req, res, next) => {
  try {
    const { userId } = req.body || {};

    //validate data
    const dataValidation = await validateUserId({ userId });
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.json({
        error: true,
        message: message,
      });
    }

    //check if user is valid

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.json({
        error: true,
        message: "Invalid user id",
      });
    }

    const cart = await doGetMedCartWeb(userId);

    //create payment link

    const paymentLink = await razorpay.paymentLink.create({
      amount: cart.data[0].medCart.cartDetails.totalAmountToBePaid * 100,
      currency: "INR",
      accept_partial: false,
      description: "Pay this to place your order",
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
        cart: "",
      },
    });

    await PaymentLink({
      userId,
      paymentLink: paymentLink.short_url,
      paymentLinkRazorPayId: paymentLink.id,
    }).save();

    //clear user all cart items

    await Cart.deleteMany({ userId });

    //delete applied coupon, med coin, donation active status to false

    //coupon

    await UserAppliedCoupons.deleteOne({ userId, isCouponApplied: true });

    //med coin

    await UserAppliedMedCoins.deleteOne({
      userId,
      isMedCoinApplied: true,
    });

    //give back user med coin if it is redeemed

    if (cart.data[0].medCart.cartDetails.medCoinRedeemed) {
      User.updateOne(
        {
          _id: userId,
        },
        {
          $inc: {
            medCoin: -cart.data[0].medCart.cartDetails.medCoinRedeemed,
          },
        }
      );
    }

    //donation

    await UserAppliedDonation.deleteOne({
      userId,
      isDonationApplied: true,
    });

    res.json({
      error: false,
      message: "Payment link send successfully.",
      data: {
        paymentLink: paymentLink.short_url,
      },
    });
  } catch (error) {
    next(error);
  }
};

const saveUserPrescriptions = async (req, res, next) => {
  try {
    const { userId } = req.body || {};

    //validate data
    const dataValidation = await validateUserId({ userId });
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.json({
        error: true,
        message: message,
      });
    }

    //check if user is valid

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.json({
        error: true,
        message: "Invalid user id",
      });
    }

    let data = {
      userId,
      active: true,
      prescription: req.body.prescription,
    };
    let obj = new Prescription(data);
    obj.save().then((_) => {
      Prescription.updateMany(
        { _id: { $nin: obj._id }, userId },
        { active: false }
      ).then((response) => {
        console.log(response);
      });
      res.status(200).json({
        error: false,
        message: "Prescription added successfully.",
      });
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addDetailsToCustomerRelation: async (req, res, next) => {
    try {
      let data = req.body;
      let formData = data.mobile;
      data.createdBy = req.user._id;
      console.log("My Image");
      console.log(data.image);
      if (req.file) {
        data.image = `${req.file.filename}`;
      } else {
        data.image = "fefault.png";
      }

      let result = await CustomerRelation.findOne({ mobile: formData });
      console.log(result);
      if (!result) {
        const obj = new CustomerRelation(data);
        obj.save().then((_) => {
          res.status(200).json({
            status: true,
            data: "Added data to Customer",
          });
        });
      } else {
        console.log("not found");
        res.status(200).json({
          status: false,
          data: "Allready registered",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  getviewtCustomerRelation: async (req, res, next) => {
    try {
      var limit = parseInt(req.body.limit);
      if (limit == 0) limit = 10;
      var skip = (parseInt(req.body.page) - 1) * parseInt(limit);
      let result = await CustomerRelation.find({})
        .sort("-id")
        .limit(limit)
        .skip(skip);

      if (!result) {
        res.status(422).json({
          status: false,
          data: "No data to display",
        });
      } else {
        res.status(200).json({
          status: true,
          data: result,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getEditCustomerRelation: async (req, res, next) => {
    try {
      let id = req.params.id;
      console.log(id);
      let result = await CustomerRemarks.findOne(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        {
          name: 1,
          mobile: 1,
          email: 1,
          address: 1,
          pincode: 1,
          image: 1,
          zone: 1,
          total: 1,
          orderValue: 1,
        }
      );
      if (!result) {
        res.status(422).json({
          status: false,
          data: "No remarks to display",
        });
      } else {
        res.status(200).json({
          status: true,
          data: result,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  addCustomerRelationRemarks: async (req, res, next) => {
    try {
      let data = req.body;
      data.createdBy = req.user._id;
      data.customerId = req.params.id;

      const obj = new CustomerRemarks(data);
      obj
        .save()
        .then((_) => {
          res.status(200).json({
            status: true,
            data: "Remarks Added Successfully",
          });
        })
        .catch(async (error) => {
          res.status(200).json({
            status: false,
            data: error,
          });
        });
    } catch (error) {
      next(error);
    }
  },
  // fetchinh details from remarks collection for editing
  getEditDetailsForRemarks: async (req, res, next) => {
    try {
      let id = req.params.id;
      console.log(id);
      let result = await CustomerRemarks.findOne(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        { remarks: 1, customerId: 1 }
      );
      if (!result) {
        res.status(422).json({
          status: false,
          data: "No remarks to display",
        });
      } else {
        res.status(200).json({
          status: true,
          data: result,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getCart,
  addProductToCart,
  updateCartItem,
  removeCartItem,
  applyACouponToTheCart,
  removeCouponFromTheCart,
  editAppliedMedCoinCount,
  placeOrder,
  addUserAddress,
  uploadPrescription,
  addOrderToSubscription,
  sendPaymentLinkMakeNewOrder,
  saveUserPrescriptions,
};
