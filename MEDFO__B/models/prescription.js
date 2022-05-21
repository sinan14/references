const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId },
    prescription: { type: Array },
    active: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Prescription = mongoose.model("prescription", Schema);

module.exports = Prescription;
