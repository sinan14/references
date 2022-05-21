const mongoose = require('mongoose')

const bmiCountSchema = new mongoose.Schema({
    count: Number,
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

bmiCountSchema.pre("save", function(next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const bmiCount = mongoose.model("bmicount", bmiCountSchema)
module.exports = bmiCount