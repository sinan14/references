const mongoose = require("mongoose");

const productRatingSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true, "userId missing"]
    },
    productId: {
        type: mongoose.Types.ObjectId,
        required: [true, "productId missing"]
    },
    comment: {
        type: String,
    },
    star: {
        type: Number,
        required: [true, "Must be at least 5, got {VALUE}"],
        min: 1,
        max: 5,
        default: 1
    },
    createdAt: {
        type: Date,
        required: false
    },
    updatedAt: {
      type: Date,
      required: false
    }
  
});
productRatingSchema.pre("save", async function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
});

const productRating = mongoose.model("productRating", productRatingSchema);
module.exports = productRating;
