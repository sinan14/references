const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId },
    prescription: { type: Array },
    isConsult: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);
Schema.plugin(aggregatePaginate);
const Prescription = mongoose.model("userPrescriptionAdmin", Schema);

module.exports = Prescription;
