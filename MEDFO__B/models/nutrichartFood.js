const mongoose = require('mongoose')

const nutrichartFoodSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true,"Please enter title"]
    },
    category: {
        type: mongoose.Types.ObjectId,
        required: [true, "Please add category"]
    },
    image: {
        type: String
    },
    banner: {
        type: String
    },
    description: {
        type: String,
        required: [true, "Please enter description"]
    },
    vitamins: {
        type: Array
    },
    categoriesBased: {
        type: Array
    },
    niceToAvoid: {
        type: Array
    },
    veg: {
        type: Boolean,
        required: [true, "Please select veg or non veg"]
    },
    recommended: {
        type: Boolean,
        default: false
    },
    recommended_isDeleted: {
        type: Boolean,
        default: false
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

nutrichartFoodSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const nutrichartFood = mongoose.model("nutrichartFoods",nutrichartFoodSchema)
module.exports = nutrichartFood