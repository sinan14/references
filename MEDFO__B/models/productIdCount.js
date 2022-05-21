const mongoose = require('mongoose')

const productIdCountSchema = new mongoose.Schema({
    type:String,
    count: Number,
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

productIdCountSchema.pre("save", function(next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const productIdCount = mongoose.model("productCount", productIdCountSchema)
module.exports = productIdCount