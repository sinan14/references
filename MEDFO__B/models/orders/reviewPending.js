const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    orderId: String,
    orderObjectId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    noOfItems: Number,
    phoneNumber: String,
    remarks: String,
    reviewStatus: {
      type: String,
      default: "pending",
    },
    medicineProducts: Array,
    prescription: Array,
  },
  {
    timestamps: true,
  }
);

const ReviewPending = mongoose.model("ReviewPending", Schema);

module.exports = ReviewPending;
