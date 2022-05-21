const mongoose = require("mongoose")

const setYourDealSubSchema = new mongoose.Schema({
    categoryId: {
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the category id"]        
    },
    productId: {
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the product id"],
        ref:'products'        
    },
    catId: {
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the type id"]        
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

setYourDealSubSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const setYourDealSub = mongoose.model("setYourDealSub",setYourDealSubSchema)
module.exports = setYourDealSub