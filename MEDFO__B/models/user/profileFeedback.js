const mongoose = require("mongoose");

const userProfileFeedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true,"userId missing"],
        ref:"users"
    },
    reason: {
        type: Array,
        required: [true,"Reason missing"]
    },
    comment: {
        type: String
    },
   
    isDisabled: {
        type: Boolean,
        default:false
    },  
    createdAt: { type: Date, required: false },
  

});
userProfileFeedbackSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const UserProfileFeedback = mongoose.model("userProfileFeedback", userProfileFeedbackSchema);
module.exports = UserProfileFeedback;

