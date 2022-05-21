const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const validateRechargeAndWithdrawMedCoin = (data) => {
  const Schema = Joi.object({
    medCoinCount: Joi.number()
      .min(1)
      .integer()
      .required()
      .label("Med coin count"),
    narration: Joi.string().max(500).allow(null, "").label("narration"),
  });
  return Schema.validate(data);
};

const validatePayMedCoin = (data) => {
  const Schema = Joi.object({
    medCoinCount: Joi.number()
      .integer()
      .min(1)
      .required()
      .label("Med coin count"),
    narration: Joi.string().max(500).allow(null, "").label("Narration"),
    customers: Joi.array()
      .items(
        Joi.objectId()
          .required()
          .label("Customers")
          .messages({ "string.pattern.name": "Invalid Customer ID." })
      )
      .required()
      .label("Customers"),
    expiryDate: Joi.date().required().label("Expiry date"),
  });
  return Schema.validate(data);
};

const validateWithdrawMedCoinFromUser = (data) => {
  const Schema = Joi.object({
    medCoinCount: Joi.number()
      .min(1)
      .integer()
      .required()
      .label("Med coin count"),
    narration: Joi.string().max(500).allow(null, "").label("Narration"),
    customerId: Joi.objectId()
      .required()
      .label("Customer Id")
      .messages({ "string.pattern.name": "Invalid Customer ID." }),
  });
  return Schema.validate(data);
};

const validateGetMedCoinStatements = (data) => {
  const Schema = Joi.object({
    statementType: Joi.string()
      .valid("med_coin_statements", "customer_wise_statement")
      .required()
      .label("Statement type"),
    page: Joi.number().integer().min(1).required().label("Page"),
    from: Joi.date().label("from"),
    to: Joi.date().label("to"),
    searchBy: Joi.string().label("search by"),
  });
  return Schema.validate(data);
};

const validateGetMedCoinDetailsByUser = (data) => {
  const Schema = Joi.object({
    page: Joi.number().integer().required().label("Page"),
  });
  return Schema.validate(data);
};

module.exports = {
  validateRechargeAndWithdrawMedCoin,
  validatePayMedCoin,
  validateWithdrawMedCoinFromUser,
  validateGetMedCoinStatements,
  validateGetMedCoinDetailsByUser,
};
