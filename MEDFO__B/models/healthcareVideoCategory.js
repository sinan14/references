const mongoose = require("mongoose")

const healthcareVideoCategory = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the category name"]        
    },
    parent: {
        type: String,
        required: [true, "Please enter the parent category"]
    },    
    image: {
        type: String
    },
    homepage: {
        type: Boolean
    },
    isDisabled: {
        type: Boolean,
        default: false
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

healthcareVideoCategory.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const HealthcareVideoCategory = mongoose.model("healthcareVideoCategory",healthcareVideoCategory)
module.exports = HealthcareVideoCategory