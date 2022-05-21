const mongoose = require("mongoose");

const masterbrandSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter the brand name"],
    },
    banner: {
        type: String,
        required: [true, "Banner path missing"],
    },
    image: {
        type: String,
        required: [true, "Image path missing"],
    },
    isShop: {
        type: Boolean,
        default: false,
    },
    isTrending: {
        type: Boolean,
        default: false,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isPromoted: {
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

masterbrandSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const MasterBrand = mongoose.model("masterBrand", masterbrandSchema);
module.exports = MasterBrand;
