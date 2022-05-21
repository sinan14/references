const mongoose = require("mongoose");

const foliofitMasterYogaHealthyRecommendedSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter the title"],
    },
    subTitle: {
        type: String,
        required: [true, "Please enter the sub title"],
    },
    benefits: {
        type: Array,
        required: [true, "Please enter the benefits"],
    },
    yogaType: {
        type: String,
        required: [true, "Please enter yoga type"],
    },
    videos: {
        type: [mongoose.Types.ObjectId],
        required: [true, "Video Id missing"],
    },   
    banner: {
        type: String,
        required: [true, "Banner path missing"],
    },
    icon: {
        type: String,
        required: [true, "Icon image path missing"],
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

foliofitMasterYogaHealthyRecommendedSchema.pre("save", function (next) {
   
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const FoliofitMasterYogaHealthyRecommended = mongoose.model("foliofitMasterYogaHealthyRecommended", foliofitMasterYogaHealthyRecommendedSchema);
module.exports = FoliofitMasterYogaHealthyRecommended;
