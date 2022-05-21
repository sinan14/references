const mongoose = require("mongoose")

const adsSetNewOfferSubSchema = new mongoose.Schema({
    categoryId: {
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the categoryId"]       
    },
    ProductId: {
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the categoryId"]
    },
    CatId: {
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the categoryId"]        
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

adsSetNewOfferSubSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const adsSetNewOfferSub = mongoose.model("adsSetNewOfferSub",adsSetNewOfferSubSchema)
module.exports = adsSetNewOfferSub