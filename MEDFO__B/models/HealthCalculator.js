const mongoose = require('mongoose')

const healthCalculatorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users'

    },
    bmi: String,
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

healthCalculatorSchema.pre("save", function(next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const healthCalculator = mongoose.model("healthCalculator", healthCalculatorSchema)
module.exports = healthCalculator