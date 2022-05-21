
const mongoose = require("mongoose")

const masterTaxSchema = new mongoose.Schema({   
  
    title: {
        type: String,
        required: [true, "Please enter the title "]        
    },
    percentage: {
        type: Number,
        required: [true, "Please enter the percentage "]        
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

masterTaxSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const MasterTax= mongoose.model("masterTax",masterTaxSchema)
module.exports = MasterTax