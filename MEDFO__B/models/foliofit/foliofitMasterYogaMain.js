const mongoose = require("mongoose");

const foliofitMasterYogaMainCategorySchema = new mongoose.Schema({
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
        validate: [arrayLimit, '{PATH} exceeds the limit of 2']
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

foliofitMasterYogaMainCategorySchema.pre("save", function (next) {
   
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});



function arrayLimit(val) {
    return val.length <= 2;
  }

const FoliofitMasterYogaMainCategory = mongoose.model("foliofitMasterYogaMainCategory", foliofitMasterYogaMainCategorySchema);
module.exports = FoliofitMasterYogaMainCategory;
