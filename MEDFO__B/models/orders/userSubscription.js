const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema(
  {
    userId: mongoose.Types.ObjectId,
    products: Object,
    firstDeliveryDate: Date,
    nextDeliveryDate: Date,
    //this is current order id
    orderId: { type: mongoose.Types.ObjectId, ref: "orders" },
    //original order id this will be a constant
    originalOrderId: mongoose.Types.ObjectId,
    //order ids is a array of object to save all order ids and it is created date
    orderIds: Array,
    prescription: Array,
    subscriptionId: String,
    interval: {
      type: Number,
      default: 30,
    },
    active: {
      type: Boolean,
      default: true,
    },
    tab: {
      type: String,
      default: "subscription",
    },
    remarks: String,
    couponCode: String,
    medCoinCount: Number,
    //only applicable in payment awaited subscription order if payment status is true then it means user payment is success
    //this status will be changed to false when order moved to next tab .

    paid: Boolean,
  },
  {
    timestamps: true,
  }
);
Schema.plugin(aggregatePaginate);

const UserSubscription = mongoose.model("UserSubscription", Schema);

module.exports = UserSubscription;
