const mongoose = require("mongoose")

const adsCartHandPickSchema = new mongoose.Schema({
    type: {
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the type id"]     
    },
    typeId: {
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the type id"],
        ref:'product'    
    },
    sliderType: {
        type: String
    },
    // image: {
    //     type: String,
    //     required: [true, "Image path missing"]
    // },      
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

adsCartHandPickSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const adsCartHandPick = mongoose.model("adsCartHandPick",adsCartHandPickSchema)
module.exports = adsCartHandPick