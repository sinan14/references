const mongoose = require("mongoose");

const masterPreferenceSchema = new mongoose.Schema({
    minPurchaseAmount: {
        type: Number,
        required: [true, "Please enter the minimum purchase amount "],
    },
    minFreeDeliveryAmount: {
        type: Number,
        required: [true, "Please enter minimum free delivery amount "],
    },
    deliveryTimeFrom: {
        type: String,
        required: [true, "Please select the delivery time (From)"],
    },
    deliveryTimeTo: {
        type: String,
        required: [true, "Please select the delivery time (To) "],
    },
    prescription: {
        type: Boolean,
        default: false,
    },
    maxMedcoinUse: {
        type: Number,
        required: [true, "Maximum use of medcoin in single order "],
    },
    paymentType: {
        type: String,
        required: [true, "Please select the payment gateway"],
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

masterPreferenceSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const MasterPreference = mongoose.model("masterPreference", masterPreferenceSchema);
module.exports = MasterPreference;
