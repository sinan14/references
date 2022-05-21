const mongoose = require("mongoose")

const medCoinAd1Ad2HowItWorksSchema = new mongoose.Schema({
    
    type: {
        type: String,
        required: [true, "Please select the type"]        
    },
    image: {
        type: String,
        required: [true, "Image path missing"]
    },      
    isDisabled: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Types.ObjectId       
    },
    updatedBy: {
        type: mongoose.Types.ObjectId               
    },  
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

medCoinAd1Ad2HowItWorksSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const medCoinAd1Ad2HowItWorks = mongoose.model("medCoinAd1Ad2HowItWorks",medCoinAd1Ad2HowItWorksSchema)
module.exports = medCoinAd1Ad2HowItWorks