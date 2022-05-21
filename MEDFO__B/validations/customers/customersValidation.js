const Joi = require("joi");

const validateGetCustomersBySegment = (data) => {
  const Schema = Joi.object({
    segment: Joi.string()
      .required()
      .valid(
        "all_customers",
        "single_order_customers",
        "no_orders_customers",
        "order_ongoing_customers",
        "premium_customers",
        "subscribed_customers"
      )
      .label("Segment"),
    page: Joi.number().integer().required().label("Page"),
    selectAll: Joi.boolean().required().label("select all"),
    name: Joi.string().max(500).label("Name"),
  });

  return Schema.validate(data);
};

module.exports = { validateGetCustomersBySegment };
