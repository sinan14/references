const mongoose = require("mongoose")

const healthExpertQnReplaySchema = new mongoose.Schema({
   
    question_id: {
        type: mongoose.Types.ObjectId,
        required: [true, "Please add a category"]  
    },
    reply: {
        type: String
    },
    image: {
        type: String,       
    },
    repliedBy: {
        type: String
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

healthExpertQnReplaySchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const healthExpertQnReplay = mongoose.model("healthExpertQnReplay",healthExpertQnReplaySchema)
module.exports = healthExpertQnReplay