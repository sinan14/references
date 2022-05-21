const mongoose = require("mongoose");
const moment = require("moment-timezone");

var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema(
  {
    userId: mongoose.Types.ObjectId,
    orderObjectId: mongoose.Types.ObjectId,
    deliveryBoyId: mongoose.Types.ObjectId,
    orderId: String,
    paymentType: String,
    deliveryDate: Date,
    noOfItems: Number,
    address: Object,
    products: Array,
    cartDetails: Object,
    status: {
      type: String,
      default: "pickup pending",
      enum: ["pickup pending", "picked up", "delivered","declined"],
    },
    paidToAdmin: {
      type: String,
      default: "pending to paid",
      enum: ["pending to paid", "paid"],
    },
    paidTodeliveryBoy: {
      type: String,
      default: "pending to paid",
      enum: ["pending to paid", "paid"],
    },
    deliveredDate: Date,
    paidToAdminDate: Date,
    pickedUpDate: Date,
    paidTodeliveryBoyDate: Date,
    packingDateString: {
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
Schema.plugin(aggregatePaginate);
const PickupPending = mongoose.model("PickupPending", Schema);

module.exports = PickupPending;
