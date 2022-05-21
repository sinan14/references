const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const referalSchema = new mongoose.Schema({
  newUser: {
    type: Number,
  },
  referalUser: {
    type: Number,
  },

  from: {
    type: Date,
  },
  to: {
    type: Date,
  },
  benefit: {
    type: String,
    enum: ["immediate", "first"],
  },
  createdAt: { type: Date, required: false },
  updatedAt: { type: Date, required: false },
});

referalSchema.pre("save", function (next) {
  now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  this.updatedAt = now.getTime();
  next();
});
referalSchema.plugin(aggregatePaginate);

const referalPolicy = mongoose.model("referalPolicy", referalSchema);
module.exports = referalPolicy;
