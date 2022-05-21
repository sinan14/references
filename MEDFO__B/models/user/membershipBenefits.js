const mongoose = require("mongoose");
const Schema = new mongoose.Schema(
  {
    premiumUserId: { type: mongoose.Types.ObjectId, ref: "premiumusers" },
    userId: { type: mongoose.Types.ObjectId, ref: "users" },
    freeDelivery: {
        type: Number,      
    },
    allottedFreeDelivery: {
      type: Number,      
    },
    cashBack: {
        type: Number,     
    },
   
    miniMumOffer: {
        type: Number,
    }, 
    cashBackAmount: {
        type: Number,  
        default: 0,   
    },
    discount: {
        type: Number,  
        default: 0,   
    },
    deliveryCharges: {
        type: Number,  
        default: 0,   
    },
    active: {
      type: Boolean,
      default: true,
    },
    expired: {
        type: Boolean,
        default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserMembershipBenefits = mongoose.model("userMembershipBenefits", Schema);

module.exports = UserMembershipBenefits;
