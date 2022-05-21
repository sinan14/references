const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const validateGetCart = (data) => {
  const Schema = Joi.object({
    userId: Joi.objectId()
      .required()
      .label("User Id")
      .messages({ "string.pattern.name": "Invalid user ID." }),
  });

  return Schema.validate(data);
};
const validateUpdateCartItem = (data) => {
  const Schema = Joi.object({
    userId: Joi.objectId()
      .required()
      .label("User Id")
      .messages({ "string.pattern.name": "Invalid user ID." }),
  });

  return Schema.validate(data);
};
const validateRemoveCartItem = (data) => {
  const Schema = Joi.object({
    userId: Joi.objectId()
      .required()
      .label("User Id")
      .messages({ "string.pattern.name": "Invalid user ID." }),
  });

  return Schema.validate(data);
};

const validateUserId = (data) => {
  const Schema = Joi.object({
    userId: Joi.objectId()
      .required()
      .label("User Id")
      .messages({ "string.pattern.name": "Invalid user ID." }),
  });

  return Schema.validate(data);
};

const validateOrderId = (data) => {
  const Schema = Joi.object({
    orderId: Joi.objectId()
      .required()
      .label("order Id")
      .messages({ "string.pattern.name": "Invalid order ID." }),
    subscriptionInterval: Joi.number()
      .integer()
      .required()
      .label("Subscription Interval"),
  });

  return Schema.validate(data);
};
module.exports = {
  validateGetCart,
  validateUpdateCartItem,
  validateRemoveCartItem,
  validateUserId,
  validateOrderId,
};
