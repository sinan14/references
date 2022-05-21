
const mongoose = require("mongoose")

const adsHomePlanYourDietSchema = new mongoose.Schema({   
  
    categoryId: {
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the category "]        
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

adsHomePlanYourDietSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsHomePlanYourDiet= mongoose.model("adsHomePlanYourDiet",adsHomePlanYourDietSchema)
module.exports = AdsHomePlanYourDiet