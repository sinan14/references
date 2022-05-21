const mongoose = require("mongoose")

const adsMedimallTopCategorySchema = new mongoose.Schema({
    
    offerPercentage: {
        type: String,
        required: [true, "Offer Percentage Reuired"]
    },
    categoryId: {
        type:mongoose.Types.ObjectId,
        ref: 'proCategory' ,
        required: [true, "Please select the category "]
        
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

adsMedimallTopCategorySchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsMedimallTopCategories = mongoose.model("adsMedimallTopCategories",adsMedimallTopCategorySchema)
module.exports = AdsMedimallTopCategories

