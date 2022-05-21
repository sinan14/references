const mongoose = require("mongoose")

const adsImmunityBoosterSchema = new mongoose.Schema({
    categoryId: {
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the categoryId"]       
    },
    ProductId: {
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the categoryId"],
        ref: 'product'       
    },
    // sliderType: {
    //     type: String
    // },
    // image: {
    //     type: String,
    //     required: [true, "Image path missing"]
    // },      
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

adsImmunityBoosterSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const adsImmunityBooster = mongoose.model("adsImmunityBooster",adsImmunityBoosterSchema)
module.exports = adsImmunityBooster