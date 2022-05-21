const _ = require("lodash");
const crypto = require("crypto");
const moment = require("moment");
const mongoose = require("mongoose");
const converter = require("number-to-words");

const specialPremiumCrud = require("../../models/premium/specialPriceCrudPremium");
const MasterPreference = require("../../models/mastersettings/masterPreference");
const PremiumUser = require("../../models/user/premiumUser");
const Payments = require("../../models/payments/payments");
const coupons = require("../../models/coupon/coupon");
const PremiumCrud = require("../../models/premium/crudPremium");
const UserMembershipBenefits = require("../../models/user/membershipBenefits");

const {
  validatePurchaseMemberShip,
  validateVerifySubscriptionPaymentRazorPay,
} = require("../../validations/membership/membershipValidation");
const {
  razorpay,
  payoutsInstance,
} = require("../../constants/paymentGateways/paymentGateway");

const purchaseMembership = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validatePurchaseMemberShip(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.json({
        error: true,
        message: message,
      });
    }

    const { id: userId } = req.user;
    const { planName, couponId } = req.body;

    //get price of the package user trying to purchase
    const plan = await specialPremiumCrud.findOne({ name: planName });

    if (!plan) {
      return res.json({
        error: true,
        message: "Invalid plan.",
      });
    }
    let validCoupon = await coupons.findOne({
      _id: mongoose.Types.ObjectId(couponId),
    });
    if (validCoupon) {
      if (validCoupon.purchaseAmount <= plan.specialPrice) {
        let discount = plan.specialPrice * (validCoupon.percentage / 100);
        plan.discountPrice = Math.floor(plan.specialPrice - discount);
        if (discount > validCoupon.maximumAmount) {
          plan.discountPrice = Math.floor(
            plan.specialPrice - validCoupon.maximumAmount
          );
        }
        plan.specialPrice = plan.discountPrice;
      }
    }
    //get payment gateway admin enabled and crete payment request

    const { paymentType = "razorpay" } =
      (await MasterPreference.findOne(
        { isDisabled: false },
        { paymentType: 1 }
      )) || {};

    // if (paymentType === "razorpay") {
    if (true) {
      //razor pay
      const allSubscriptionPlans = await razorpay.plans.all({});

      //check if plan is added to razor pay plans if not add

      let planId;

      let existingPlan = _.find(allSubscriptionPlans.items, {
        item: {
          name: plan.name,
          amount: plan.specialPrice * 100,
        },
      });

      if (existingPlan) {
        planId = existingPlan.id;
      } else {
        //  create plan
        let createdPlan = await razorpay.plans.create({
          period: "monthly",
          interval: 1,
          item: {
            name: plan.name,
            amount: plan.specialPrice * 100,
            currency: "INR",
          },
        });

        planId = createdPlan.id;
      }

      //subscribe to plan
      const subscription = await razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        quantity: 1,
        total_count: 1,
        notes: {
          userId,
        },
      });

      return res.json({
        error: false,
        message: "subscription created.",
        data: { paymentGateway: paymentType, subscriptionId: subscription.id },
      });
    } else if (paymentType === "cashfree") {
    }
  } catch (error) {
    next(error);
  }
};

const verifySubscriptionPaymentRazorPay = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    //validate incoming data
    const dataValidation = await validateVerifySubscriptionPaymentRazorPay(
      req.body
    );
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.json({
        error: true,
        message: message,
      });
    }

    const { paymentId, subscriptionId, razorPaySignature } = req.body;

    const crypt = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    crypt.update(`${paymentId}|${subscriptionId}`);
    const digest = crypt.digest("hex");

    //payment failed
    if (digest !== razorPaySignature) {
      return res.json({
        error: true,
        message: "Payment verification failed.",
      });
    }

    //get subscription details
    const subscription = await razorpay.subscriptions.fetch(subscriptionId);

    const {
      item: { name: planName },
    } = await razorpay.plans.fetch(subscription.plan_id);

    //check if this user payment already verified.

    const payment = await Payments.findOne({
      paymentId,
    });

    if (payment) {
      return res.json({
        error: false,
        message: "Payment already verified, subscription activated.",
      });
    }

    await new Payments({
      userId,
      paymentId,
      subscriptionId,
      type: "membership subscription",
    }).save();

    const plan = await specialPremiumCrud.findOne({ name: planName });

    //add user to premium users list

    let startDate = moment().tz(process.env.TIME_ZONE).utc();
    let endDate = moment()
      .add(plan.month, "months")
      .tz(process.env.TIME_ZONE)
      .set({ h: 23, m: 59, s: 00 })
      .utc();

    await new PremiumUser({
      userId,
      startDate,
      endDate,
      planId: plan._id,
      planName,
      paymentGateway: "razorpay",
    })
      .save()
      .then(async (response) => {
        let premiumUserId = response._id;
        //add user benefits of premium users (admin-premium)
        let premiumBenefits = await PremiumCrud.findOne({});
        await new UserMembershipBenefits({
          premiumUserId: premiumUserId,
          userId: req.user._id,
          freeDelivery: premiumBenefits.freeDelivery,
          allottedFreeDelivery: premiumBenefits.freeDelivery,
          cashBack: premiumBenefits.cashBack,
          miniMumOffer: premiumBenefits.miniMumOffer,
        }).save();
      });
    return res.json({
      error: false,
      message: "Payment verified, subscription activated.",
    });

    //payment success set this user type to premium
  } catch (error) {
    next(error);
  }
};

const getUserMembershipBenefits = async (req, res, next) => {
  try {
    let result = await PremiumUser.aggregate([
      {
        $match: {
          userId: req.user._id,
          expired: false,
        },
      },
      {
        $lookup: {
          from: "usermembershipbenefits",
          localField: "userId",
          foreignField: "userId",
          as: "benefits",
        },
      },
      {
        $project: {
          _id: 1,
          startDate: {
            $dateToString: { format: "%d-%m-%Y", date: "$startDate" },
          },
          endDate: { $dateToString: { format: "%d-%m-%Y", date: "$endDate" } },
          planId: 1,
          planName: 1,
          paymentGateway: 1,
          freeDelivery: { $first: "$benefits.freeDelivery" },
          allottedFreeDelivery: { $first: "$benefits.allottedFreeDelivery" },
          cashBack: { $first: "$benefits.cashBack" },
          miniMumOffer: { $first: "$benefits.miniMumOffer" },
          cashBackAmount: { $first: "$benefits.cashBackAmount" },
          discount: { $first: "$benefits.discount" },
          deliveryCharges: { $first: "$benefits.deliveryCharges" },
        },
      },
    ]);
  
    result = result[0];
    
    if (!result.freeDelivery) {
      result.freeDelivery = 0;
    }

    // free delivery
    result.freeDeliveryLeftInWords = converter.toWords(result.freeDelivery);
    result.daysAfterMemberShipPurchase = moment()
      .tz(process.env.TIME_ZONE)
      .diff(
        moment(result.startDate, "DD-MM-YYYY").tz(process.env.TIME_ZONE),
        "days"
      );

    // duration
    result.duration = moment(result.endDate, "DD-MM-YYYY")
    .tz(process.env.TIME_ZONE)
    .diff(
      moment(result.startDate, "DD-MM-YYYY").tz(process.env.TIME_ZONE),
      "months"
    );

    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  purchaseMembership,
  verifySubscriptionPaymentRazorPay,
  getUserMembershipBenefits,
};
