
const mongoose = require("mongoose")

const masterUOMSchema = new mongoose.Schema({   
  
    title: {
        type: String,
        required: [true, "Please enter the title "]        
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

masterUOMSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const MasterUom= mongoose.model("masterUom",masterUOMSchema)
module.exports = MasterUom