const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "users" },
    medCoinCount: Number,
    isMedCoinApplied: { type: Boolean, default: true },
    orderId: mongoose.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

const UserAppliedMedCoins = mongoose.model("UserAppliedMedCoins", Schema);

module.exports = UserAppliedMedCoins;
