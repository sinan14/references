const mongoose = require("mongoose");

const adsHomeSpotlightSchema = new mongoose.Schema({
    offerText: {
        type: String,
        required: [true, "Please enter the offer text"],
    },
    colorCode: {
        type: String,
        required: [true, "Please select the color "],
    },
    // categoryId: {
    //     type: mongoose.Types.ObjectId,
    //     required: [true, "Please select the  category"],
    // },
    // subCategoryId: {
    //     type: mongoose.Types.ObjectId,
    //     required: [true, "Please select the sub category"],
    // },
    // (product or category)
    type: {
        type:Number,
        required: [true, "Please select the  type"],
    },
    typeId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Please select the type id"],
    },
    thumbnail: {
        type: String,
        required: [true, "Thumbnail path missing"],
    },
    image: {
        type: String,
        required: [true, "Image path missing"],
    },
    isMedimall: {
        type: Boolean,
        default: false,
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

adsHomeSpotlightSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsHomeSpotlight = mongoose.model("adsHomeSpotlight", adsHomeSpotlightSchema);
module.exports = AdsHomeSpotlight;
