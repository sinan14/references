const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    orderId: String,
    orderObjectId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    noOfItems: Number,
    phoneNumber: String,
    remarks: String,
    prescriptionCreationStatus: {
      type: String,
      default: "pending",
    },
    prescriptionCancelReason: String,
    createdPrescriptionId: mongoose.Types.ObjectId,
    medicineProducts: Array,
  },
  {
    timestamps: true,
  }
);

const PrescriptionAwaited = mongoose.model("PrescriptionAwaited", Schema);

module.exports = PrescriptionAwaited;
