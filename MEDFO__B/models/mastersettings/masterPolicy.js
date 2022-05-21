const mongoose = require("mongoose");

const masterPolicySchema = new mongoose.Schema({   
    title: {
        type: String,
        required: [true, "Please enter the title "],
    },
    return: {
        type: Number,
        required: [true, "Please enter the return "],
    },
    cancel: {
        type: Number,
        required: [true, "Please enter the cancel "],
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

masterPolicySchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const MasterPolicy = mongoose.model("masterPolicy", masterPolicySchema);
module.exports = MasterPolicy;
