const mongoose = require("mongoose");

const masterDeliveryChargeTimeSchema = new mongoose.Schema({   
    level: {
        type: String,
        required: [true, "Please enter the level "],
    },
    DeliveryTime: {
        type: String,
        required: [true, "Please enter the DeliveryTime "],
    },
    charge: {
        type: Number,
        required: [true, "Please enter the charge "],
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

masterDeliveryChargeTimeSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const masterDeliveryChargeTime = mongoose.model("masterDeliveryChargeTime", masterDeliveryChargeTimeSchema);
module.exports = masterDeliveryChargeTime;
