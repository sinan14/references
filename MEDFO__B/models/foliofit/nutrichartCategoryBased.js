const mongoose = require("mongoose")

const nutrichartCategoryBasedSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter the category name"]        
    },
    image: {
        type: String,
        required: [true, "Image path missing"]
    },
    createdBy: {
        type: mongoose.Types.ObjectId       
    },
    updatedBy: {
        type: mongoose.Types.ObjectId               
    },    
    isDisabled: {
        type: Boolean,
        default: false
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

nutrichartCategoryBasedSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const NutrichartCategoryBased = mongoose.model("nutrichartCategoryBased",nutrichartCategoryBasedSchema)
module.exports = NutrichartCategoryBased