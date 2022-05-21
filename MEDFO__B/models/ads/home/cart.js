
const mongoose = require("mongoose")

const adsHomeCartSchema = new mongoose.Schema({   
  
    categoryId: {
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the category "]        
    },
    // subCategoryId: {
    //     type:mongoose.Types.ObjectId,     
    //     ref: 'products'         
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

adsHomeCartSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsHomeCart = mongoose.model("adsHomeCart",adsHomeCartSchema)
module.exports = AdsHomeCart