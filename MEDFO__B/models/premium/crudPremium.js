const mongoose = require("mongoose")

const premiumCrudSchema = new mongoose.Schema({
    freeDelivery: {
        type: Number,
        required: [true, "Please enter the amonut of free delivery"]        
    },
    cashBack: {
        type: Number,
        required: [true, "Please enter a the cash back amount"]        
    },
   
    miniMumOffer: {
        type: Number,
        required: [true, "Please enter a the minimum amount"]   
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

premiumCrudSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});


const PremiumCrud = mongoose.model("premiumCrud",premiumCrudSchema)
module.exports = PremiumCrud