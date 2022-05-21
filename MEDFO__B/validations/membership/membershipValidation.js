const Joi = require("joi");

const validatePurchaseMemberShip = (data) => {
  const Schema = Joi.object({
    planName: Joi.string().required().label("Plan"),
    couponId: Joi.string().allow("",null).label("couponId"),
  });

  return Schema.validate(data);
};

const validateVerifySubscriptionPaymentRazorPay = (data) => {
  const Schema = Joi.object({
    paymentId: Joi.string().required().label("Payment ID"),
    razorPaySignature: Joi.string().required().label("Razorpay signature"),
    subscriptionId: Joi.string().required().label("Subscription ID"),
  });

  return Schema.validate(data);
};

module.exports = {
  validatePurchaseMemberShip,
  validateVerifySubscriptionPaymentRazorPay,
};
