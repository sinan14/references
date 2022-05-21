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

const returnOrderReason = mongoose.model("returnOrderReason", Schema);
module.exports = returnOrderReason;
