const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const mostSearchSchema = new mongoose.Schema({
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

mostSearchSchema.pre("save", function (next) {
  now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  this.updatedAt = now.getTime();
  next();
});
mostSearchSchema.plugin(aggregatePaginate);

const mostSearchProduct = mongoose.model("mostSearchProduct", mostSearchSchema);
module.exports = mostSearchProduct;
