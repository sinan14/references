const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema(
  {
    userId: mongoose.Types.ObjectId,
    orderId: String,
    paymentType: String,
    deliveryDate: Date,
    expectedDeliveryDate: Date,
    cancelledDate: Date,
    cancelledFormattedDate: String,
    noOfItems: Number,
    address: Object,
    orderStatus: {
      type: String,

      //order placed
      /*
      when a user make a order it's initial status is order placed
      */
      //rejected
      /*
      when a order is rejected by admin it's status is rejected
      /*/
      //order confirmed
      /*
      when a order is in prescription awaited it's status is order confirmed
      */
      //order under review
      /*
      when a order is in review pending or in packing pending then it's status is order under review
      */
      //order packed
      /*
      when a order is in pickup pending then it's status is order packed
      */
      //order shipped
      /*
      when a order is in transit then it's status is order shipped
      */
      //out for delivery
      /*
      when it is delivery date then it's status is out for delivery
      */
      //delivered
      /*
      when a product is delivered it's status is delivered
      /*
        when a order is applied to return then it's status is 'applied for return'
      */
      /*
        when a order is approved for return then it's status is 'returned'
      */
      /*
        when a order is cancelled then it's status is 'cancelled'
      */

      enum: [
        "order placed",
        "doctor rejected",
        "order confirmed",
        "order under review",
        "pharmacy rejected",
        "order packed",
        "order shipped",
        "out for delivery",
        "delivered",
        "cancelled",
        "applied for return",
        "return approved",
        "return picked up",
        "returned",
      ],
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    deliveredDate: Date,
    rejectionReason: String,
    storeDetails: Object,
    products: Array,
    cartDetails: Object,
    prescription: Array,
    originalCartDetails: Object,
    originalProducts: Array,
    doctorAddedProducts: Array,
    doctorRemovedProducts: Array,
    doctorQuantityChangedProducts: Array,
    productChangedByDoctor: {
      type: Boolean,
      default: false,
    },
    isReturned: {
      type: Boolean,
      default: false,
    },
    remarks: String,
    eligibleForCancel: {
      default: true,
      type: Boolean,
    },
    doctorRejectedDate: Date,
    pharmacyRejectedDate: Date,
  },
  {
    timestamps: true,
  }
);
Schema.plugin(aggregatePaginate);

const Order = mongoose.model("Order", Schema);

module.exports = Order;
