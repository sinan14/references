const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "users" },
    donationAmount: {
      type: Number,
      default: 10,
    },
    isDonationApplied: { type: Boolean, default: true },
    orderId: mongoose.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

const UserAppliedDonation = mongoose.model("UserAppliedDonation", Schema);

module.exports = UserAppliedDonation;
