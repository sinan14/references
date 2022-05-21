const mongoose = require("mongoose")

const adsHomeAd4Schema = new mongoose.Schema({   
  
    link: {
        type: String,
        required: [true, "please enter the link"]      
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

adsHomeAd4Schema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsHomeAd4 = mongoose.model("adsHomeAd4",adsHomeAd4Schema)
module.exports = AdsHomeAd4