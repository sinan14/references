const mongoose = require("mongoose")

const promotionalSmsSchema = new mongoose.Schema({
    segmentId: {
        type: String,
        required: [true, "Please enter the category name"]        
    },
    isImmediate: {
        type: String,
        default: true  
    },  
    description: {
        type: String,
        required: [true, "Please enter the description"]   
    },
    date: {
        type: String,
        
    },    
    isDisabled: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

promotionalSmsSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

// const PromotionalSms = mongoose.model("promotionalSms",promotionalSmsSchema)
// module.exports = PromotionalSms

const promotionalSmsUsersSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Please enter the customer id"]        
    },
    proSmsId: {
        type: mongoose.Types.ObjectId,
       required: [true, "Please enter the promotinal sms id"]   
    },
    
    isDisabled: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

promotionalSmsUsersSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});



const PromotionalSms = mongoose.model("promotionalSms",promotionalSmsSchema)
const PromotionalSmsUsers = mongoose.model("promotionalSmsUsers",promotionalSmsUsersSchema)
module.exports ={
    PromotionalSms,
    PromotionalSmsUsers
} 