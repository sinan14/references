const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema(
  {
    product_id: mongoose.Types.ObjectId,
    variantId: mongoose.Types.ObjectId,
    count: Number,
    productType: String,
  },
  {
    timestamps: true,
  }
);
Schema.plugin(aggregatePaginate);

const MostPurchasedProduct = mongoose.model("MostPurchasedProduct", Schema);

module.exports = MostPurchasedProduct;
