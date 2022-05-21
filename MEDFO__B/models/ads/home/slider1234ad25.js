const mongoose = require("mongoose")

const adsHomeSlider1234ad25Schema = new mongoose.Schema({   
    // mainCategoryId: {
    //     type:mongoose.Types.ObjectId,
    //     required: [true, "Please select the main category"]        
    // },
    // subCategoryId: {
    //     type:mongoose.Types.ObjectId,
    //     required: [true, "Please select the sub category"]        
    // },
    // categoryId: {
    //     type:mongoose.Types.ObjectId,
    //     required: [true, "Please select the category "]        
    // },
    redirect_type: {
        type:String,
        required: [true, "Please select the redirect type"]        
    },
    type: {
        type:String,
        required: [true, "Please select the type"]        
    },
    typeId: {
        type:mongoose.Types.ObjectId,
               
    },
    image: {
        type: String,
        required: [true, "Image path missing"]
    },  
    sliderType: {
        type: String,
        required: [true, "Slider Type required"]
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

adsHomeSlider1234ad25Schema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsHomeSlider1234ad25Schema = mongoose.model("adsHomeSlider1234ad25",adsHomeSlider1234ad25Schema)
module.exports = AdsHomeSlider1234ad25Schema