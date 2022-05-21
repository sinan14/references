const mongoose = require("mongoose")

const specialPremiumCrudSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the Name"]        
    },
    month: {
        type: Number,
        required: [true, "Please enter the month"]        
    },
   
    price: {
        type: Number,
        required: [true, "Please enter the price"]   
    }, 
    specialPrice: {
        type: Number,
        required: [true, "Please enter the special price"]   
    }, 
    referAndEarn: {
        type: Number,
        required: [true, "Please enter refer  earn price price"]   
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
    }, 
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

specialPremiumCrudSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});


const SpecialPremiumCrud = mongoose.model("specialPremiumCrud",specialPremiumCrudSchema)
module.exports = SpecialPremiumCrud