const Joi = require("joi");

const validatePlaceOrder = (data) => {
  const Schema = Joi.object({
    paymentType: Joi.string()
      .valid("cod", "razorpay")
      .required()
      .label("Payment type"),
    iDontHaveAPrescription: Joi.boolean()
      .required()
      .label("I don't have a subscription"),
    additionalNotes: Joi.string().allow("", null),
    cartItems: Joi.array()
      .items({
        cartId: Joi.objectId().required().label("Cart id"),
        subscription: Joi.boolean().required().label("Subscription"),
        firstDeliveryDate: Joi.string().allow("", null),
        interval: Joi.string().allow("", null),
      })
      .required()
      .label("Cart items"),
    subscription: Joi.boolean().required().label("Subscription"),
  });
  return Schema.validate(data);
};

const validateVerifyVerifyRazorPayPayment = (data) => {
  const Schema = Joi.object({
    paymentId: Joi.string().required().label("Payment ID"),
    razorPaySignature: Joi.string().required().label("Razorpay signature"),
    orderId: Joi.string().required().label("Order ID"),
  });

  return Schema.validate(data);
};

module.exports = { validatePlaceOrder, validateVerifyVerifyRazorPayPayment };
