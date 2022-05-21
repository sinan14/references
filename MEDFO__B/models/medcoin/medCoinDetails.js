const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    availableBalance: { default: 0, type: Number },
    medCoinUsed: { default: 0, type: Number },
    nearToExpiry: { default: 0, type: Number },
  },
  {
    timestamps: true,
  }
);

const MedCoinDetails = mongoose.model("MedCoinDetails", Schema);

module.exports = MedCoinDetails;
