const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const validateReturnOrder = (data) => {
  const Schema = Joi.object({
    id: Joi.objectId().required().label("id").messages({
      "string.pattern.name": "Invalid id",
    }),
    refundableAmount: Joi.string().required().label("Refundaable Amount"),
    products: Joi.array().label("Products"),
    paymentMethod: Joi.string().required().label("Payment Method"),

  });
  return Schema.validate(data);
};

const validateReturnOrderBankDetails = (data) => {
    const Schema = Joi.object({
      customerName: Joi.string().required().label("Customer Name"),
      accountNumber: Joi.string().required().label("Account Number"),
      reAccountNumber: Joi.array().label("Re Account Number"),
      ifsc: Joi.string().required().label("IFSC Code"),
      bankName: Joi.string().required().label("Bank Name"),
      branch: Joi.string().required().label("Branch"),
      accountType: Joi.string().required().label("Account Type"), 
    });
    return Schema.validate(data);
};

module.exports = {
    validateReturnOrder,
    validateReturnOrderBankDetails
};
