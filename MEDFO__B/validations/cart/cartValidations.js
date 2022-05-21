const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const validateAddProductToCart = (data) => {
  const Schema = Joi.object({
    product_id: Joi.objectId()
      .required()
      .label("Product")
      .messages({ "string.pattern.name": "Invalid product ID." }),
    variantId: Joi.objectId()
      .required()
      .label("Variant")
      .messages({ "string.pattern.name": "Invalid variant ID." }),
    userId: Joi.objectId()
      .required()
      .label("User")
      .messages({ "string.pattern.name": "Invalid user ID." }),
    quantity: Joi.number().required().label("Quantity"),
  });

  return Schema.validate(data);
};

const validateApplyACouponToCart = (data) => {
  const Schema = Joi.object({
    couponCode: Joi.string().min(5).max(1000).required().label("Coupon code"),
    couponType: Joi.string()
      .required()
      .valid("medimall", "subscription", "Medimall", "Subscription")
      .label("Coupon type"),
  });
  return Schema.validate(data);
};

const validateRemoveCouponFromTheCart = (data) => {
  const Schema = Joi.object({
    couponId: Joi.objectId()
      .required()
      .label("Coupon")
      .messages({ "string.pattern.name": "Invalid Coupon ID." }),
  });
  return Schema.validate(data);
};

const validateRemoveCartItem = (data) => {
  const Schema = Joi.object({
    cartId: Joi.objectId()
      .required()
      .label("Cart ID")
      .messages({ "string.pattern.name": "Invalid Cart ID." }),
  });
  return Schema.validate(data);
};

const validateUpdateCartItem = (data) => {
  const Schema = Joi.object({
    cartId: Joi.objectId()
      .required()
      .label("Cart ID")
      .messages({ "string.pattern.name": "Invalid Cart ID." }),
    quantity: Joi.number().required().label("Quantity"),
  });
  return Schema.validate(data);
};

const validateEditAppliedMedCoin = (data) => {
  const Schema = Joi.object({
    medCoinCount: Joi.number()
      .integer()
      .min(0)
      .required()
      .label("med coin count"),
  });
  return Schema.validate(data);
};

const validateEditAppliedDonation = (data) => {
  const Schema = Joi.object({
    donationAmount: Joi.number()
      .integer()
      .min(0)
      .required()
      .label("Donation amount"),
  });
  return Schema.validate(data);
};

const validateMultipleProductToCart = (data) => {
  const Schema = Joi.object({
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
      .min(1)
      .required(),
  });

  return Schema.validate(data);
};

module.exports = {
  validateAddProductToCart,
  validateApplyACouponToCart,
  validateRemoveCouponFromTheCart,
  validateRemoveCartItem,
  validateUpdateCartItem,
  validateEditAppliedMedCoin,
  validateEditAppliedDonation,
  validateMultipleProductToCart,
};
