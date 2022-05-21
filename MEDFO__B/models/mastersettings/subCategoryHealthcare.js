const mongoose = require("mongoose");

const subCategoryHealthcareSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter the sub category name"],
    },  
    categoryId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Please select the category"],
        ref :"masterCategory"
    }, 
    banner: {
        type: String,
        required: [true, "Banner path missing"],
    },
    image: {
        type: String,
        required: [true, "Image path missing"],
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

subCategoryHealthcareSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const MasterSubCategoryHealthcare = mongoose.model("masterSubCategoryHealthcare", subCategoryHealthcareSchema);
module.exports = MasterSubCategoryHealthcare;
