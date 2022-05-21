const mongoose = require('mongoose')

const userNotificationSchema = mongoose.Schema({
   
    notification_content: {
        type: String,
        required: [true,"Title is missing"]
    },
    notification_type: {
        type: String,
        required: [true,"Title is missing"]
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true,"useId is missing"],
        ref: 'users'
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})
userNotificationSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const userNotification = mongoose.model("userNotification",userNotificationSchema)
module.exports = userNotification