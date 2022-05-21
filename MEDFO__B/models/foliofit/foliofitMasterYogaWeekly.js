const mongoose = require("mongoose");

const foliofitMasterYogaWeeklySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add the title"],
    },
    subTitle: {
        type: String,
        required: [true, "Please add the sub title"],
    },
    benefits: {
        type: Array,
        required: [true, "Please add the benefits"],
    },
    image: {
        type: String,
        required: [true, "Image path missing"],
    },
    videos: [
        {
            type: mongoose.Types.ObjectId,
            required: [true, "Video Id missing"],
        },
    ],
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

foliofitMasterYogaWeeklySchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const FoliofitMasterYogaWeekly = mongoose.model("foliofitMasterYogaWeeklyWorkout", foliofitMasterYogaWeeklySchema);
module.exports = FoliofitMasterYogaWeekly;
