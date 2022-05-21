const mongoose = require("mongoose")

const adsMedimallTopIconCatHealthSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, "Image path missing"]
    },
    isDisabled: {
        type: Boolean,
        default: false
    },
    sliderType: {
        type: String
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

adsMedimallTopIconCatHealthSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsMedimallTopIconCatHealth = mongoose.model("adsMedimallTopIconCatHealth",adsMedimallTopIconCatHealthSchema)
module.exports = AdsMedimallTopIconCatHealth

