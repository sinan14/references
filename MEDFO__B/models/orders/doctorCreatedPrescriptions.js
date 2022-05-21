const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    doctorName: String,
    patientName: String,
    age: Number,
    sex: String,
    aboutDiagnosis: String,
    allergies: String,
    medicineProducts: Array,
    description: String,
    signature: String,
    orderId: String,
    orderObjectId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    pdfFile: String,
  },
  {
    timestamps: true,
  }
);

const DoctorCreatedPrescription = mongoose.model(
  "DoctorCreatedPrescription",
  Schema
);

module.exports = DoctorCreatedPrescription;
