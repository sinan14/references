const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const validateGetPrescriptionAwaitedOrders = (data) => {
  const Schema = Joi.object({
    page: Joi.number().min(1).integer().required().label("Page"),
    searchBy: Joi.string().allow(null).label("Search By"),
  });
  return Schema.validate(data);
};

const validateGetDeliveryBoysByOrderId = (data) => {
  const Schema = Joi.object({
    orderId: Joi.objectId().required().label("Order ID").messages({
      "string.pattern.name": "Invalid order Id.",
    }),
  });
  return Schema.validate(data);
};

const validateGetOrderInvoiceByOrderId = (data) => {
  const Schema = Joi.object({
    orderId: Joi.objectId().required().label("Order ID").messages({
      "string.pattern.name": "Invalid order Id.",
    }),
  });
  return Schema.validate(data);
};

const validateGetPickupPendingOrders = (data) => {
  const Schema = Joi.object({
    page: Joi.number().min(1).integer().required().label("Page"),
    searchBy: Joi.string().label("Search").allow("", null),
  });
  return Schema.validate(data);
};

const validateGetPackingPendingOrders = (data) => {
  const Schema = Joi.object({
    page: Joi.number().min(1).integer().required().label("Page"),
    searchBy: Joi.string().label("Search").allow("", null),
  });
  return Schema.validate(data);
};
const validatePaymentAwaitedOrders = (data) => {
  const Schema = Joi.object({
    page: Joi.number().min(1).integer().required().label("Page"),
    searchBy: Joi.string().label("Search").allow("", null),
    type: Joi.string().valid("payable", "receivable").required().label("type"),
  });
  return Schema.validate(data);
};

const validateReviewPendingOrders = (data) => {
  const Schema = Joi.object({
    page: Joi.number().min(1).integer().required().label("Page"),
    searchBy: Joi.string().label("Search").allow("", null),
  });
  return Schema.validate(data);
};

const validateSendPaymentLinkToUser = (data) => {
  const Schema = Joi.object({
    paymentAwaitedOrderId: Joi.objectId()
      .required()
      .label("Payment awaited order Id")
      .messages({
        "string.pattern.name": "Invalid payment awaited order Id.",
      }),
  });
  return Schema.validate(data);
};

const validateVerifyPaymentAwaitedOrder = (data) => {
  const Schema = Joi.object({
    paymentAwaitedOrderId: Joi.objectId()
      .required()
      .label("Payment awaited order Id")
      .messages({
        "string.pattern.name": "Invalid payment awaited order Id.",
      }),
  });
  return Schema.validate(data);
};
const validateMoveOrderToReviewPending = (data) => {
  const Schema = Joi.object({
    paymentAwaitedOrderId: Joi.objectId()
      .required()
      .label("Payment awaited order Id")
      .messages({
        "string.pattern.name": "Invalid payment awaited order Id.",
      }),
  });
  return Schema.validate(data);
};

const validateVerifyPaymentByPaymentLinkId = (data) => {
  const Schema = Joi.object({
    paymentLinkRazorPayId: Joi.string()
      .required()
      .label("Payment link razor pay id"),
  });
  return Schema.validate(data);
};

const validateRejectPrescriptionAwaitedOrder = (data) => {
  const Schema = Joi.object({
    prescriptionAwaitedOrderId: Joi.objectId()
      .required()
      .label("Prescription awaited order Id")
      .messages({
        "string.pattern.name": "Invalid Prescription awaited order Id.",
      }),

    reason: Joi.string()
      .required()
      .valid(
        "Patient not reachable",
        "False Patient information",
        "Restricted drugs",
        "Others"
      )
      .label("Reason"),
  });
  return Schema.validate(data);
};

const validateCreatePrescription = (data) => {
  const Schema = Joi.object({
    orderId: Joi.objectId().required().label("Order ID").messages({
      "string.pattern.name": "Invalid order Id.",
    }),
    patientName: Joi.string().required().label("Patient Name"),
    age: Joi.number().min(1).integer().required().label("Age"),
    sex: Joi.string().required().label("Sex"),
    aboutDiagnosis: Joi.string().allow(null).label("About Diagnosis"),
    allergies: Joi.string().allow(null).label("allergies"),
    description: Joi.string().allow(null).label("Diagnostic test"),
    medicineProducts: Joi.array()
      .items({
        product_id: Joi.objectId()
          .required()
          .label("Product")
          .messages({ "string.pattern.name": "Invalid product ID." }),
        variantId: Joi.objectId()
          .required()
          .label("Variant")
          .messages({ "string.pattern.name": "Invalid variant ID." }),
        quantity: Joi.number().integer().required().label("Quantity"),
        whenToTake: Joi.string()
          .required()
          .valid("before", "after")
          .label("When to take"),
        morning: Joi.number().required().label("Morning"),
        noon: Joi.number().required().label("Noon"),
        night: Joi.number().required().label("Night"),
        days: Joi.number().required().label("Days"),
        instructions: Joi.string().allow(null).label("Instructions"),
      })
      .required()
      .label("Medicine Products"),
  });
  return Schema.validate(data);
};

const validateAssignDeliveryBoyToOrder = (data) => {
  const Schema = Joi.object({
    orderId: Joi.objectId().required().label("Order ID").messages({
      "string.pattern.name": "Invalid order Id.",
    }),
    deliveryBoyId: Joi.objectId().required().label("Delivery Boy ID").messages({
      "string.pattern.name": "Delivery Boy Id.",
    }),
  });
  return Schema.validate(data);
};

const validateUpdateRemarks = (data) => {
  const Schema = Joi.object({
    orderId: Joi.objectId().required().label("Order ID").messages({
      "string.pattern.name": "Invalid order Id.",
    }),
    remarks: Joi.string().required().label("Remarks"),
    remarkType: Joi.string()
      .required()
      .valid("prescription awaited", "payment awaited", "review pending")
      .label("Remark type"),
  });
  return Schema.validate(data);
};

const validateRefundPayableRazorPay = (data) => {
  const Schema = Joi.object({
    orderId: Joi.objectId().required().label("Order ID").messages({
      "string.pattern.name": "Invalid order Id.",
    }),
    paymentAwaitedOrderId: Joi.objectId()
      .required()
      .label("Payment awaited order Id")
      .messages({
        "string.pattern.name": "Invalid payment awaited order Id.",
      }),
  });
  return Schema.validate(data);
};

const validateRefundPayableMedCoin = (data) => {
  const Schema = Joi.object({
    paymentAwaitedOrderId: Joi.objectId()
      .required()
      .label("Payment awaited order Id")
      .messages({
        "string.pattern.name": "Invalid payment awaited order Id.",
      }),
  });
  return Schema.validate(data);
};
const validateAcceptOrRejectReviewPendingOrder = (data) => {
  const Schema = Joi.object({
    reviewPendingOrderId: Joi.objectId()
      .required()
      .label("Review pending order Id")
      .messages({
        "string.pattern.name": "Invalid review pending order Id.",
      }),
    type: Joi.string().required().valid("accept", "reject").label("Type"),
  });
  return Schema.validate(data);
};
const validateGetHealthDataByUser = (data) => {
  const Schema = Joi.object({
    userId: Joi.objectId().required().label("User Id").messages({
      "string.pattern.name": "User Id.",
    }),
  });
  return Schema.validate(data);
};

const validateGetRefundableAmount = (data) => {
  const Schema = Joi.object({
    orderId: Joi.objectId().required().label("Order Id").messages({
      "string.pattern.name": "Invalid Order Id",
    }),
    products: Joi.array().items(Joi.objectId()).required(),
  });
  return Schema.validate(data);
};

const validateCancelReason = (data) => {
  const Schema = Joi.object({
    id: Joi.objectId().required().label("id").messages({
      "string.pattern.name": "Invalid id",
    }),
    reason: Joi.string().required().label("Reason"),
    notes: Joi.string().label("Notes"),
  });
  return Schema.validate(data);
};

module.exports = {
  validateGetPrescriptionAwaitedOrders,
  validateRejectPrescriptionAwaitedOrder,
  validateCreatePrescription,
  validateGetPickupPendingOrders,
  validateGetDeliveryBoysByOrderId,
  validateGetOrderInvoiceByOrderId,
  validateAssignDeliveryBoyToOrder,
  validateUpdateRemarks,
  validatePaymentAwaitedOrders,
  validateSendPaymentLinkToUser,
  validateVerifyPaymentAwaitedOrder,
  validateVerifyPaymentByPaymentLinkId,
  validateGetPackingPendingOrders,
  validateReviewPendingOrders,
  validateMoveOrderToReviewPending,
  validateRefundPayableRazorPay,
  validateRefundPayableMedCoin,
  validateAcceptOrRejectReviewPendingOrder,
  validateGetHealthDataByUser,
  validateGetRefundableAmount,
  validateCancelReason,
};
