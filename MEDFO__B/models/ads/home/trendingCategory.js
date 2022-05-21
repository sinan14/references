const mongoose = require("mongoose")

const adsHomeTrendingCategorySchema = new mongoose.Schema({   
    categoryId: {
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the  category"]        
    },
    offerBoxText: {
        type:String,
        required: [true, "Please enter the offer box text"]        
    },   
    offerBoxColor: {
        type:String,
        required: [true, "Please select the color"]        
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

adsHomeTrendingCategorySchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsHomeTrendingCategory = mongoose.model("adsHomeTrendingCategory",adsHomeTrendingCategorySchema)
module.exports = AdsHomeTrendingCategory