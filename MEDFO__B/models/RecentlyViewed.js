  const mongoose = require("mongoose");

  const recentlyViewedSchema = new mongoose.Schema({
    productId: {
      type: mongoose.Types.ObjectId,
      required: [true, "productId is missing"],
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: [true, "userId is missing"],
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false },
  });

  recentlyViewedSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
  });

  const recentlyViewed = mongoose.model("recentlyViewed", recentlyViewedSchema);
  module.exports = recentlyViewed;
