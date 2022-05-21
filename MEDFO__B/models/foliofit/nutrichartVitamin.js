const mongoose = require("mongoose")

const nutrichartVitaminSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter the Vitamin name"]        
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

nutrichartVitaminSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const nutrichartVitamin = mongoose.model("nutrichartVitamin",nutrichartVitaminSchema)
module.exports = nutrichartVitamin