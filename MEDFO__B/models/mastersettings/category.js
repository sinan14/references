const mongoose = require("mongoose");

const masterCategorySchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: [true, "Please add the title"],
    },
    categoryType: {
        type: String,
        required: [true, "category type required"],
    },
    image: {
        type: String,
        required: [true, "Image path missing"],
    },
    // isActive: {
    //     type: Boolean,
    //     default: false,
    // },
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

masterCategorySchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const MasterCategory = mongoose.model("masterCategory", masterCategorySchema);
module.exports = MasterCategory;
