const mongoose = require("mongoose")

const dietPlan = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the category name"]        
    },
    image: {
        type: String
    },
    isDisabled: {
        type: Boolean,
        default: false
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

dietPlan.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const DietPlan = mongoose.model("dietPlans",dietPlan)
module.exports = DietPlan