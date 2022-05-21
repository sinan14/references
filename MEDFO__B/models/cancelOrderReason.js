const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  orderId: {
    type: mongoose.Types.ObjectId,
    required: [true, "orderId missing"],
    ref: "orders",
  },
  reason: {
    type: String,
  },
  notes: {
    type: String,
  },
});

const cancelOrderReason = mongoose.model("cancelOrderReason", Schema);
module.exports = cancelOrderReason;
