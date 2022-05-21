const mongoose = require("mongoose")

const healthTipCategory = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the category name"]        
    },
    isDisabled: {
        type: Boolean,
        default: false
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

healthTipCategory.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const HealthTipCategory = mongoose.model("healthTipCategory",healthTipCategory)
module.exports = HealthTipCategory