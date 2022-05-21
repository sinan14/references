const mongoose = require("mongoose")

const adsHomeTopCatMainCatAd1Ad6Ad8Schema = new mongoose.Schema({   
    image: {
        type: String,
        required: [true, "Image path missing"]
    },  
    sliderType: {
        type: String,
        required: [true, "Slider Type required"]
    },
    name: {
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

adsHomeTopCatMainCatAd1Ad6Ad8Schema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsHomeTopCatMainCatAd1Ad6Ad8 = mongoose.model("adsHomeTopCatMainCatAd1Ad6Ad8",adsHomeTopCatMainCatAd1Ad6Ad8Schema)
module.exports = AdsHomeTopCatMainCatAd1Ad6Ad8