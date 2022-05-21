const mongoose = require("mongoose");

const deliveryBoyCreditSchema = new mongoose.Schema({
    orderObjectId: mongoose.Types.ObjectId,
    orderId: String,
    type: {
      type:String,
      enum:['admin','order']
    },
    deliveryBoyId: mongoose.Types.ObjectId,
    credit: {
        type: Number,
        default: 0
      },
      debit: {
        type: Number,
        default: 0
      },
      balance: {
        type: Number,
        default: 0
      },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false },
});

deliveryBoyCreditSchema.pre("save", function (next) {
  now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  this.updatedAt = now.getTime();
  next();
});

const deliveryBoyCredit = mongoose.model("deliveryBoyCredit", deliveryBoyCreditSchema);
module.exports = deliveryBoyCredit;
