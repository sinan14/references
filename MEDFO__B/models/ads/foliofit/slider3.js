const mongoose = require("mongoose")

const adsFoliofitSlider3Schema = new mongoose.Schema({
    productId: {
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the product name"]        
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

adsFoliofitSlider3Schema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsFoliofitSlider3 = mongoose.model("adsFoliofitSlider3",adsFoliofitSlider3Schema)
module.exports = AdsFoliofitSlider3