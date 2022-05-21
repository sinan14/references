const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    orderId: String,
    orderObjectId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    noOfItems: Number,
    products: Array,
    status: {
      type: String,
      default: "not paid",
    },
    type: String,
    doctorAddedProducts: Array,
    originalCartDetails: Object,
    cartDetails: Object,
    amountToBePaid: Number,
    remarks: String,
    prescription: Array,
  },
  {
    timestamps: true,
  }
);

const PaymentAwaited = mongoose.model("PaymentAwaited", Schema);

module.exports = PaymentAwaited;
