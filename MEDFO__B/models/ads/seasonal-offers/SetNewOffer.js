const mongoose = require("mongoose")

const setNewOfferSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: [true, "Please select the type"]        
    },
    sliderType: {
        type: String,
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

setNewOfferSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const setNewOffer = mongoose.model("setNewOffer",setNewOfferSchema)
module.exports = setNewOffer