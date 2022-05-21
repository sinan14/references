const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "users" },
    couponId: { type: mongoose.Types.ObjectId, ref: "coupon" },
    isCouponApplied: { type: Boolean, default: true },
    couponType: String,
    discountAmount: Number,
    orderId: mongoose.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);
Schema.plugin(aggregatePaginate);

const UserAppliedCoupons = mongoose.model("UserAppliedCoupons", Schema);

module.exports = UserAppliedCoupons;
