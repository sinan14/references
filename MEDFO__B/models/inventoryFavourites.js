const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const inventoryFavouriteSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      required: [true, "Product id is missing"],
    },
    productUomId: {
      type: mongoose.Types.ObjectId,
      required: [true, "Product varient id is missing"],
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: [true, "userId missing"],
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    variantDetails: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

inventoryFavouriteSchema.plugin(aggregatePaginate);
const InventoryFavourites = mongoose.model(
  "inventoryFavourites",
  inventoryFavouriteSchema
);
module.exports = InventoryFavourites;
