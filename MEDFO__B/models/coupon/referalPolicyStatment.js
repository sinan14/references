const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const referalSchema = new mongoose.Schema({
  policyId: {
    type: mongoose.Types.ObjectId,
  },
  newUser: {
    type: mongoose.Types.ObjectId,
  },
  referredId: {
    type: mongoose.Types.ObjectId,
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

const referalPolicyStatement = mongoose.model(
  "referalPolicyStatement",
  referalSchema
);
module.exports = referalPolicyStatement;
