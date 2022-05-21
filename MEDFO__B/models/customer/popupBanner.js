const mongoose = require("mongoose");

const popupSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "Type missing"],
    enum: ["home", "medimall", "foliofit", "medfeed"],
  },
  image: {
    type: String,
    required: [true, "Image missing"],
  },
  from: {
    type: Date,
    required: false,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
  },
  updatedBy: {
    type: mongoose.Types.ObjectId,
  },
  createdAt: { type: Date, required: false },
  updatedAt: { type: Date, required: false },
});

popupSchema.pre("save", function (next) {
  now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  this.updatedAt = now.getTime();
  next();
});

const popupBanner = mongoose.model("popupBanner", popupSchema);
module.exports = popupBanner;
