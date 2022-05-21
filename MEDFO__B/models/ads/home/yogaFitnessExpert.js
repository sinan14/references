const mongoose = require("mongoose");

const adsYogaFitnessExpertSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Please select the category "],
    },
    subCategoryId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Please select the sub category "],
    },
    adsType: {
        type: String,
        required: [true, "Ads Type required"]
    },   
    isDisabled: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false },
});

adsYogaFitnessExpertSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsHomeYogaFitnessExpert = mongoose.model("adsHomeYogaFitnessExpert", adsYogaFitnessExpertSchema);
module.exports = AdsHomeYogaFitnessExpert;
