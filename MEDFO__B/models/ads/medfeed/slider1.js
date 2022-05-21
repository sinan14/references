const mongoose = require("mongoose")

const adsMedfeedSlider1Schema = new mongoose.Schema({
    // categoryId: {
    //     type:mongoose.Types.ObjectId,
    //     required: [true, "Please select the category "]        
    // },   
    redirect_type: {
        type:String,
        required: [true, "Please select the redirect type "]        
    }, 
    image: {
        type: String,
        required: [true, "Image path missing"]
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

adsMedfeedSlider1Schema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsMedfeedSlider1 = mongoose.model("adsMedfeedSlider1",adsMedfeedSlider1Schema)
module.exports = AdsMedfeedSlider1