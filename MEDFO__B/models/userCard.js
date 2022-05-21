const mongoose = require("mongoose");

const userCardSchema = new mongoose.Schema({
    customerId: {
    type:String,
    required: [true, "productId is missing"],
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: [true, "userId is missing"],
  },
  expDate:{ 
      type: Date 
    },
    QrCodeImage:{
        type: String,
    },
    
  createdAt: { type: Date, required: false },
  updatedAt: { type: Date, required: false },
});

userCardSchema.pre("save", function (next) {
  now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  this.updatedAt = now.getTime();
  next();
});

const userCard = mongoose.model("userCard", userCardSchema);
module.exports = userCard;
