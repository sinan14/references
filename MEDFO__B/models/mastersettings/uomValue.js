
const mongoose = require("mongoose")

const adsUOMValueSchema = new mongoose.Schema({   
  
  
    uomId: {
        type: mongoose.Types.ObjectId,
        ref:"masterUom",
        required: [true, "Please select UOM Name"]        
    },
    uomValue: {
        type: String,
        required: [true, "Please add the uom value "]        
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

adsUOMValueSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const MasterUomValue= mongoose.model("masterUomValue",adsUOMValueSchema)
module.exports = MasterUomValue