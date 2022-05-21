const mongoose = require("mongoose")

const adsMedimallSliderTopWishRecentSchema = new mongoose.Schema({
    // categoryId: {
    //     type:mongoose.Types.ObjectId,
    //     required: [true, "Please select the category name"]
    // },
    // subCategoryId: {
    //     type:mongoose.Types.ObjectId,
    //     required: [true, "Please select the sub category name"]
    // },
    type: {
        type:Number,
        required: [true, "Please select the type"]
    },
    typeId: {
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the type name"]
    },
    sliderType: {
        type: String
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

adsMedimallSliderTopWishRecentSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsMedimallSliderTopWishRecent = mongoose.model("adsMedimallSliderTopWishRecent",adsMedimallSliderTopWishRecentSchema)
module.exports = AdsMedimallSliderTopWishRecent

