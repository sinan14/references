
const mongoose = require("mongoose")

const foliofitMasterYogaHomeSchema = new mongoose.Schema({   
  
    categoryId: {
        type: mongoose.Types.ObjectId,  
        required: [true, "Please add the category "]        
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

foliofitMasterYogaHomeSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const FoliofitMasterYogaHome= mongoose.model("foliofitMasterYogaHome",foliofitMasterYogaHomeSchema)
module.exports = FoliofitMasterYogaHome