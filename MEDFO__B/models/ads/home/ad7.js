const mongoose = require("mongoose")

const adsHomeAd7Schema = new mongoose.Schema({   
  
    couponCode: {
        type:String              
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

adsHomeAd7Schema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsHomeAd7 = mongoose.model("adsHomeAd7",adsHomeAd7Schema)
module.exports = AdsHomeAd7