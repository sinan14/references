const mongoose = require("mongoose")

const termsAndConditionClubSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, "Please enter a name"]        
    },
    description: {
        type: String,
        required: [true, "Please enter a description"]        
    },
   
    isDisabled: {
        type: Boolean,
        default: false,
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

termsAndConditionClubSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});


const TermsAndCondition = mongoose.model("termsAndCondition",termsAndConditionClubSchema)
module.exports = TermsAndCondition