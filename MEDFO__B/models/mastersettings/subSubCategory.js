const mongoose = require("mongoose");

const subSubCategorySchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: [true, "Please add the title"],
    },
    subCategoryId: {
        type:  mongoose.Types.ObjectId,
        required: [true, "sub category required"],
        ref : "masterSubCategoryHealthcare"
    },
    image: {
        type: String,
        required: [true, "Image path missing"],
    },
    // isActive: {
    //     type: Boolean,
    //     default: true,
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

subSubCategorySchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const MasterSubSubCategory = mongoose.model("masterSubSubCategory", subSubCategorySchema);
module.exports = MasterSubSubCategory;
