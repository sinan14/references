const mongoose = require("mongoose")

const ad1MedFillMedPrideSchema = new mongoose.Schema({
    
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

ad1MedFillMedPrideSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const ad1MedFillMedPride = mongoose.model("ad1MedFillMedPride",ad1MedFillMedPrideSchema)
module.exports = ad1MedFillMedPride