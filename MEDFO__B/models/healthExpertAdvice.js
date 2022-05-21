const mongoose = require("mongoose")

const healthExpertAdviceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Please add userId"]        
    },
    userName: {
        type: String,
        required: [true, "Please add userName"]        
    },
    userImage: {
        type: String,
        required: [true, "Please add userImage"]        
    },
    category_id: {
        type: mongoose.Types.ObjectId,
        required: [true, "Please add a category"]  
    },
    question: {
        type: String,
        required: [true, "Please enter the question"]        
    },
    reply: {
        type: String
    },
    repliedBy: {
        type: String
    },
    isReplied:{
        type: Boolean,
        default: false
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

healthExpertAdviceSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const HealthExpertAdvice = mongoose.model("healthExpert",healthExpertAdviceSchema)
module.exports = HealthExpertAdvice