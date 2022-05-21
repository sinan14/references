const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    userId: mongoose.Types.ObjectId,
    orderObjectId: mongoose.Types.ObjectId,
    orderId: String,
    paymentAwaitedOrderId: mongoose.Types.ObjectId,
    subscriptionId: mongoose.Types.ObjectId,
    //only applicable to subscription
    active: Boolean,
    type: {
      type: String,
      default: "orderManagement",
    },
    status: {
      type: String,
      default: "created",
      enum: ["created", "payment success", "payment failed"],
    },
    paymentLink: String,
    paymentLinkRazorPayId: String,
  },
  {
    timestamps: true,
  }
);

const PaymentLink = mongoose.model("PaymentLink", Schema);

module.exports = PaymentLink;
