const mongoose = require("mongoose")

const adsMedfeedMainQuizExpertSchema = new mongoose.Schema({   
    image: {
        type: String,
        required: [true, "Image path missing"]
    },  
    sliderType: {
        type: String,
        required: [true, "Slider Type required"]
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

adsMedfeedMainQuizExpertSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsMedfeedMainQuizExpert = mongoose.model("adsMedfeedMainQuizExpert",adsMedfeedMainQuizExpertSchema)
module.exports = AdsMedfeedMainQuizExpert