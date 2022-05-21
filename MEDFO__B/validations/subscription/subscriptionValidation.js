const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const validateGetSubscriptions = (data) => {
  const Schema = Joi.object({
    page: Joi.number().min(1).integer().required().label("Page"),
    searchBy: Joi.string().label("Search").allow("", null),
  });
  return Schema.validate(data);
};
const validateGetPaymentAwaitedSubscriptions = (data) => {
  const Schema = Joi.object({
    page: Joi.number().min(1).integer().required().label("Page"),
    searchBy: Joi.string().label("Search").allow("", null),
  });
  return Schema.validate(data);
};
const validateGetInactiveSubscriptions = (data) => {
  const Schema = Joi.object({
    page: Joi.number().min(1).integer().required().label("Page"),
    searchBy: Joi.string().label("Search").allow("", null),
  });
  return Schema.validate(data);
};
const validateGetConvertedSubscriptionOrders = (data) => {
  const Schema = Joi.object({
    page: Joi.number().min(1).integer().required().label("Page"),
    searchBy: Joi.string().label("Search").allow("", null),
  });
  return Schema.validate(data);
};

const validateUpdateUserSubscription = (data) => {
  const Schema = Joi.object({
    userId: Joi.objectId()
      .required()
      .label("User Id")
      .messages({ "string.pattern.name": "Invalid user ID." }),
    subscriptionId: Joi.objectId()
      .required()
      .label("Subscription Id")
      .messages({ "string.pattern.name": "Invalid subscription ID." }),
    couponCode: Joi.string().allow(null).label("Coupon code"),
    medCoinCount: Joi.number().integer().allow(null).label("Med coin count"),
    products: Joi.array()
      .items({
        product_id: Joi.objectId()
          .required()
          .label("Product")
          .messages({ "string.pattern.name": "Invalid product ID." }),
        variantId: Joi.objectId()
          .required()
          .label("Variant")
          .messages({ "string.pattern.name": "Invalid variant ID." }),
        quantity: Joi.number().required().label("Quantity"),
      })
      .required()
      .label("Products"),
  });

  return Schema.validate(data);
};

const validateSentUserSubscriptionPaymentLink = (data) => {
  const Schema = Joi.object({
    subscriptionId: Joi.objectId()
      .required()
      .label("Subscription Id")
      .messages({ "string.pattern.name": "Invalid subscription ID." }),
  });

  return Schema.validate(data);
};
const validateMoveUserSubscriptionToPrescriptionAwaited = (data) => {
  const Schema = Joi.object({
    subscriptionId: Joi.objectId()
      .required()
      .label("Subscription Id")
      .messages({ "string.pattern.name": "Invalid subscription ID." }),
  });

  return Schema.validate(data);
};
const validateMoveUserSubscriptionToReviewPending = (data) => {
  const Schema = Joi.object({
    subscriptionId: Joi.objectId()
      .required()
      .label("Subscription Id")
      .messages({ "string.pattern.name": "Invalid subscription ID." }),
  });

  return Schema.validate(data);
};
const validateMoveSubscriptionToPackingPending = (data) => {
  const Schema = Joi.object({
    subscriptionId: Joi.objectId()
      .required()
      .label("Subscription Id")
      .messages({ "string.pattern.name": "Invalid subscription ID." }),
  });

  return Schema.validate(data);
};
const validateActivateAndDeactivateSubscription = (data) => {
  const Schema = Joi.object({
    subscriptionId: Joi.objectId()
      .required()
      .label("Subscription Id")
      .messages({ "string.pattern.name": "Invalid subscription ID." }),
  });

  return Schema.validate(data);
};
const validateUpdateSubscriptionRemarks = (data) => {
  const Schema = Joi.object({
    subscriptionId: Joi.objectId()
      .required()
      .label("Subscription Id")
      .messages({ "string.pattern.name": "Invalid subscription ID." }),
    remarks: Joi.string().required().label("Remark"),
  });

  return Schema.validate(data);
};
const validateGetCouponDiscountAmount = (data) => {
  const Schema = Joi.object({
    couponCode: Joi.string().required().label("Coupon code"),
  });

  return Schema.validate(data);
};

// validate update prescriptions of user's subscription
const validateUpdatePrescriptionsOfSubscription = (data) => {
  const Schema = Joi.object({
    subscriptionId: Joi.objectId()
      .required()
      .label("Subscription Id")
      .messages({ "string.pattern.name": "Invalid subscription ID." }),
    prescriptions: Joi.array().required()

  });

  return Schema.validate(data);
};

module.exports = {
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
  validateUpdatePrescriptionsOfSubscription,
};
