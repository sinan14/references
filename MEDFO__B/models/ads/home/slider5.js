const mongoose = require("mongoose")

const adsHomeSlider5Schema = new mongoose.Schema({   
    // categoryId: {
    //     type:mongoose.Types.ObjectId,
    //     required: [true, "Please select the  category"]        
    // },
    // subCategoryId: {
    //     type:mongoose.Types.ObjectId,
    //     required: [true, "Please select the sub category"]        
    // },   
    type: {
        type:Number,
        required: [true, "Please select the  type"]        
    },
    typeId: {
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the type name"]        
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

adsHomeSlider5Schema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsHomeSlider5 = mongoose.model("adsHomeSlider5",adsHomeSlider5Schema)
module.exports = AdsHomeSlider5