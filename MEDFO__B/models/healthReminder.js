const mongoose = require('mongoose')

const healthReminderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
        // type:Number
    },
    type:{
        type:Number
    },
    session: {
        type:Array
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

healthReminderSchema.pre("save", function(next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const healthReminder = mongoose.model("healthReminder", healthReminderSchema)
module.exports = healthReminder