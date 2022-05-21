const mongoose = require("mongoose");

const adsHowToOrderMedicineSchema = new mongoose.Schema({
   
    type: {
        type:String,
        required: [true, "Please select the  type"],
    },
    thumbnail: {
        type: String,
        required: [true, "Thumbnail path missing"],
    },
    video: {
        type: String,
        required: [true, "video path missing"],
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

adsHowToOrderMedicineSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const adsHowToOrderMedicine = mongoose.model("adsHowToOrderMedicine", adsHowToOrderMedicineSchema);
module.exports = adsHowToOrderMedicine;
