const mongoose = require("mongoose")




/* Ads Foiliofit Fitness Club Banner & Yoga Banner
============================================= */
const adsFoliofitBannerSchema = new mongoose.Schema({
    categoryId: {
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the category name"],        
    },    
    image: {
        type: String,
        required: [true, "Image path missing"]
    },      
    isDisabled: {
        type: Boolean,
        default: false
    },
    bannerType: {
        type: String
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

adsFoliofitBannerSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsFoliofitBanner = mongoose.model("adsFoliofitBanner",adsFoliofitBannerSchema)
module.exports = AdsFoliofitBanner