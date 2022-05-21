const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "users" },
    defaultAppliedSubscriptionCoupon: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const DefaultAppliedSubscriptionCoupon = mongoose.model(
  "DefaultAppliedSubscriptionCoupon",
  Schema
);

module.exports = DefaultAppliedSubscriptionCoupon;
