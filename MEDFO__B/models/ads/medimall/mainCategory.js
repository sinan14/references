const mongoose = require("mongoose")

const adsMedimallMainCategorySchema = new mongoose.Schema({
    
    offerText: {
        type: String,
        required: [true, "Please enter offer text"]
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

adsMedimallMainCategorySchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsMedimallMainCategory = mongoose.model("adsMedimallMainCategory",adsMedimallMainCategorySchema)
module.exports = AdsMedimallMainCategory

