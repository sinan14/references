const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const mostFavouriteSchema = new mongoose.Schema({
  productId: {
    type: String,
  },
  type: {
    type: String,
  },
  count: {
    type: Number,
  },
  createdAt: { type: Date, required: false },
  updatedAt: { type: Date, required: false },
});

mostFavouriteSchema.pre("save", function (next) {
  now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  this.updatedAt = now.getTime();
  next();
});
mostFavouriteSchema.plugin(aggregatePaginate);

const inventoryMostFavourites = mongoose.model("inventoryMostFavourites", mostFavouriteSchema);
module.exports = inventoryMostFavourites;
