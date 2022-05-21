const mongoose = require("mongoose")

const healthExpertCategory = new mongoose.Schema({
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

healthExpertCategory.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const HealthExpertCategory = mongoose.model("healthExpertCategory",healthExpertCategory)
module.exports = HealthExpertCategory