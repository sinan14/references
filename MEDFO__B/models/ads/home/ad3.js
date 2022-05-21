const mongoose = require("mongoose")

const adsHomeAd3Schema = new mongoose.Schema({   
  
    // categoryId: {
    //     type:mongoose.Types.ObjectId,
    //     required: [true, "Please select the category "]        
    // },
    redirect_type: {
        type:String,
        required: [true, "Please select the redirect type "]        
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

adsHomeAd3Schema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsHomeAd3 = mongoose.model("adsHomeAd3",adsHomeAd3Schema)
module.exports = AdsHomeAd3