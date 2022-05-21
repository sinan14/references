const mongoose = require("mongoose")

const promotionalEmailSchema = new mongoose.Schema({
    segmentId: {
        type: String,
        required: [true, "Please select the segment"]        
    },
    subject: {
        type: String,
       required: [true, "Please enter the subject"]   
    },
    description: {
        type: String,
        required: [true, "Please enter the description"]   
    },
    isImmediate: {
        type: String,
        default: true  
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

promotionalEmailSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});




const promotionalEmailUsersSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Please enter the customer id"]        
    },
    proEmailId: {
        type: mongoose.Types.ObjectId,
       required: [true, "Please enter the promotinal email id"]   
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

promotionalEmailUsersSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});



const PromotionalEmail= mongoose.model("promotionalEmail",promotionalEmailSchema)
// module.exports = PromotionalEmail

const PromotionalEmailUsers = mongoose.model("promotionalEmailUsers",promotionalEmailUsersSchema)
module.exports ={
    PromotionalEmail,
    PromotionalEmailUsers
} 