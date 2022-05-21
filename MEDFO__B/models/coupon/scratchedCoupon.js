const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId,ref:'users'},
    couponId:{type:mongoose.Types.ObjectId,ref:'coupon'},
},
{
    timestamps:true
})

const ScratchedCoupon = mongoose.model('ScratchedCoupons',Schema);

module.exports = ScratchedCoupon;