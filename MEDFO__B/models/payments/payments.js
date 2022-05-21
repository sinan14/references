const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    userId: mongoose.Types.ObjectId,
    orderObjectId: mongoose.Types.ObjectId,
    subscriptionObjectId: mongoose.Types.ObjectId,
    paymentId: String,
    orderId: String,
    subscriptionId: String,
    refundId: String,
    type: {
      type: String,
      enum: [
        "order purchase",
        "membership subscription",
        "refund, payment awaited payable",
        "refund, return order",
        "refund, cancel order"
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Payments = mongoose.model("Payment", Schema);

module.exports = Payments;
