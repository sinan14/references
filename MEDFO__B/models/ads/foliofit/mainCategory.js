const mongoose = require("mongoose")

const adsFoliofitMainCategorySchema = new mongoose.Schema({
   
    image: {
        type: String,
        required: [true, "Image path missing"]
    },
    name: {
        type: String,
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

adsFoliofitMainCategorySchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsFoliofitMainCategory = mongoose.model("adsFoliofitMainCategory",adsFoliofitMainCategorySchema)
module.exports = AdsFoliofitMainCategory