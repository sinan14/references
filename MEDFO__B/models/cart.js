const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    variantId: {
      type: mongoose.Types.ObjectId,
      required: [true, "variant id is missing"],
    },
    product_id: {
      type: mongoose.Types.ObjectId,
      required: [true, "product id is missing"],
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: [true, "user id is missing"],
    },
    quantity: {
      type: Number,
    },
    variantDetails: {
      type: Object,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  }
);

const cart = mongoose.model("cart", cartSchema);
module.exports = cart;
