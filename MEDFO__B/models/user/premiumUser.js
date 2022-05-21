const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "users" },
    expired: {
      type: Boolean,
      default: false,
    },
    startDate: Date,
    endDate: Date,
    planId: { type: mongoose.Types.ObjectId, ref: "specialpremiumcruds" },
    planName: String,
    active: {
      type: Boolean,
      default: true,
    },
    paymentGateway: String,
  },
  {
    timestamps: true,
  }
);
Schema.plugin(aggregatePaginate);
const PremiumUser = mongoose.model("PremiumUser", Schema);

module.exports = PremiumUser;
