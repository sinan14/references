const mongoose = require("mongoose")

const liveUpdateSchema = new mongoose.Schema({
    category: {
        type: mongoose.Types.ObjectId,
        required: [true, "Please add a category"],
        ref: 'articleCategory'
    },
    image: {
        type: String,
        required: [true, "Image path missing"]
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

liveUpdateSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const LiveUpdate = mongoose.model("liveUpdate",liveUpdateSchema)
module.exports = LiveUpdate