const mongoose = require('mongoose')

const nutrichartCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true,"Please enter title"]
    },
    image: {
        type: String,
        required: [true, "Please upload image"]
    },
    createdBy: {
        type: mongoose.Types.ObjectId
    },
    updatedBy: {
        type: mongoose.Types.ObjectId
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

nutrichartCategorySchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const nutrichartCategory = mongoose.model("nutrichartCategories",nutrichartCategorySchema)
module.exports = nutrichartCategory