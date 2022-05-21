const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema(
  {
    returnId: {
      type: String,
      unique: true // returnId must be unique
    },
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
      default: "requested",
        enum: ["requested","pickup pending","accepted","rejected","collected","submitted","quality check", "completed", "declined"],
    },
    deliveredDate: Date,
    collectedDate:Date,
    submittedDate:Date,
    pickedUpDate: Date,
    canceledDate: Date,
    product_img: String,
    signature: String,
    Comments: String,
    formattedDateTime: String,
    refundableAmount: String,
    storeDetails: Object,
    reducableAmountFromEachProduct: String,
    // returnApprovedDate: Date,
    // returnRejectedDate: Date,
    returnApprovedDeclinedDate: Date,
    bankDetails: Object,
    deliveryCharge: String,
    returnMedcoinRedeemed: String,
    deliveryBoyAssignedDate: Date,
    qualityCheckDate: Date,
    refundedAmount: Number,
    toBankAmount: Number,
    toWalletAmount: Number,
    couponDiscount: Number,
    memberDiscount: Number,
    directRefundApproved: Boolean,
    notes: String,
    returnedFrom: {
      type: String,
      enum: ["customer_relation", "user"]
    }
  },
  {
    timestamps: true,
  }
);

Schema.plugin(aggregatePaginate);

const returnOrders = mongoose.model("returnOrders", Schema);

module.exports = returnOrders;
