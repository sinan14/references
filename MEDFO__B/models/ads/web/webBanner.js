const mongoose = require('mongoose')

const WebBannerSchema = mongoose.Schema({
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

WebBannerSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const WebBanner = mongoose.model("WebBanner", WebBannerSchema)

module.exports = WebBanner