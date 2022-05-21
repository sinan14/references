const mongoose = require("mongoose");

const foliofitMasterFitnessMainHomeFullHealthySchema = new mongoose.Schema({
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
    fitnessType: {
        type: String,
        required: [true, "Please enter type"],
    },
    videos: {
       type: [mongoose.Types.ObjectId],
        // type: Array,
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

foliofitMasterFitnessMainHomeFullHealthySchema.pre("save", function (next) {
   
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const FoliofitMasterFitnessMainHomeFullbodyHealthy = mongoose.model("foliofitMasterFitnessMainHomeFullbodyHealthy", foliofitMasterFitnessMainHomeFullHealthySchema);
module.exports = FoliofitMasterFitnessMainHomeFullbodyHealthy;
