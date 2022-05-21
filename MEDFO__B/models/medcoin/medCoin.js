const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    medCoinCount: Number,
    narration: String,
    type: String,
    expiryDate: Date,
    customerId: mongoose.Types.ObjectId,
    balance: Number,
    customerBalance: Number,
    expired: { type: Boolean, default: false },
    redeemed: Number,
    userUsed: Number,
    customerIdString: String,
  },
  {
    timestamps: true,
  }
);

const MedCoin = mongoose.model("MedCoin", Schema);

module.exports = MedCoin;
