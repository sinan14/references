const mongoose = require("mongoose")

const orderMedicine3IconSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: [true, "Please select the type"]        
    },
    image: {
        type: String,
        required: [true, "Image path missing"]
    },      
    isDisabled: {
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

orderMedicine3IconSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const orderMedicine3Icon = mongoose.model("orderMedicine3Icon",orderMedicine3IconSchema)
module.exports = orderMedicine3Icon