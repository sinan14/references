const mongoose = require("mongoose")

const setYourDealSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: [true, "Please select the type"],      
    },
    starting_date: {
        type: Date,
        required: [true, "starting date  missing"]
    },
    ending_date: {
        type: Date,
        required: [true, "ending date   missing"]
    },
    starting_time: {
        type: String,
        required: [true, "starting time missing"]
    },
    ending_time: {
        type: String,
        required: [true, "ending time missing"]
    },
    purchase_limit: {
        type: String,
        required: [true, "purchase limit missing"]
    }, 
    sliderType: {
        type: String,
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

setYourDealSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const setYourDeal = mongoose.model("setYourDeal",setYourDealSchema)
module.exports = setYourDeal