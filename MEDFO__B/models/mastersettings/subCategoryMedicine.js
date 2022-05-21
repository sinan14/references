const mongoose = require("mongoose");

const subCategoryMedicineSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: [true, "Please add the title"],
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        required: [true, "category type required"],
        ref:"masterCategory",
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

subCategoryMedicineSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const MasterSubCategoryMedicine = mongoose.model("masterSubCategoryMedicine", subCategoryMedicineSchema);
module.exports = MasterSubCategoryMedicine;
