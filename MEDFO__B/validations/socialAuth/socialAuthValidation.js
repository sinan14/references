const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const validateAppleSignin = (data) => {
  const Schema = Joi.object({
    idToken: Joi.string()
      .required()
      .label("Id Token")
      .messages({ "string.pattern.name": "Invalid Id Token" }),
    user: Joi.string()
      .required()
      .label("user")
  });

  return Schema.validate(data);
};

module.exports = {
    validateAppleSignin
};
