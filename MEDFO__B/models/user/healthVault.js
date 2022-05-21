const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId },
    patientId: {
      type: mongoose.Types.ObjectId,
      required: [true, "Patient id missing"],
    },
    category: { type: String, required: [true, "Category missing"] },
    prescription: { type: String, required: [true, "Prescription missing"] },
  },
  {
    timestamps: true,
  }
);

const UserHealthVault = mongoose.model("userHealthVault", Schema);

module.exports = UserHealthVault;
