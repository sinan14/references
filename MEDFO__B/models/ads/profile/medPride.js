const mongoose = require("mongoose")

const MedPrideSchema = new mongoose.Schema({
    
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

MedPrideSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const MedPride = mongoose.model("MedPride",MedPrideSchema)
module.exports = MedPride