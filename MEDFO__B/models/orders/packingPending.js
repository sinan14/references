const mongoose = require("mongoose");
const moment = require("moment-timezone");

const Schema = mongoose.Schema(
  {
    orderId: String,
    orderObjectId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    noOfItems: Number,
    storeLevel: Number,
    storeId: mongoose.Types.ObjectId,
    products: Array,
    approvalTime: Date,
    shippingZone: String,
    status: {
      type: String,
      default: "pending",
    },
    approvalTimeInString: {
      type: String,
      default: moment()
        .tz(process.env.TIME_ZONE)
        .format("MMM DD YYYY, hh:mm a"),
    },
  },
  {
    timestamps: true,
  }
);

const PackingPending = mongoose.model("PackingPending", Schema);

module.exports = PackingPending;
