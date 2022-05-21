const mongoose = require('mongoose')

const WebHomeSliderSchema = mongoose.Schema({
    redirection_type: {
        type: String,
        required: [true, "redirection_type missing"],
        enum : ['product','category'],
    },
    redirection_id: {
        type: mongoose.Types.ObjectId,
        required: [true, "redirection_id missing"]
    },
    image: {
        type: String,
        required: [true, "image missing"]
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

WebHomeSliderSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const WebHomeSlider = mongoose.model("WebHomeSlider", WebHomeSliderSchema)

module.exports = WebHomeSlider