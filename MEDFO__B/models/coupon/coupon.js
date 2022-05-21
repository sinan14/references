const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    type: {
        type: String
    },
    customerType: {
        type: String
    },
    promotionType: {
        type: String
    },
    name: {
        type: String
    },
    code: {
        type: String
    },
    category: {
        type: String
    },
    from: {
        type: Date
    },
    to: {
        type: Date
    },
    percentage: {
        type: Number
    },
    purchaseAmount: {
        type: Number
    },
    maximumAmount: {
        type: Number
    },
    maximumUser: {
        type: Number
    },
    numberPerUser: {
        type: Number
    },
    termsAndCondition: {
        type: String
    },
    image:{
        type:String
    },
    isDisabled:{
        type:Boolean,
        default:false
    },
    totalTimesUsed:{
        type:Number,
        default:0
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

couponSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const coupons = mongoose.model("coupon", couponSchema)
module.exports = coupons