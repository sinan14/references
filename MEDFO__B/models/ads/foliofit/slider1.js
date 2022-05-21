const mongoose = require("mongoose")

const adsFoliofitSlider1Schema = new mongoose.Schema({
    // categoryId: {
    //     type:mongoose.Types.ObjectId,
    //     required: [true, "Please select the category name"]        
    // },
    // subCategoryId: {
    //     type:mongoose.Types.ObjectId,
    //     required: [true, "Please select the sub category name"]        
    // },
    type: {
        type: String,
        required: [true, "Please select the type"]        
    },
    redirectTo: {
        type: String,
        required: [true, "Please select the redirect to"]        
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

adsFoliofitSlider1Schema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsFoliofitSlider1 = mongoose.model("adsFoliofitSlider1",adsFoliofitSlider1Schema)
module.exports = AdsFoliofitSlider1