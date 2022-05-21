const mongoose = require("mongoose");

const medUserNotificationsSchema = new mongoose.Schema({
    
 
    orderObjectId: {
      type:mongoose.Types.ObjectId,
    required: [true, "orderObjectId missing"]
    },
    orderId: {
        type: String,
        required: [true, "orderId missing"],
    },
    message: {
        type: String,
        required: [true, "message missing"],
    },
    products: Array,
    orderStatus: {
        type: String,
        required: [true, "orderStatus missing"],
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    paymentType: String,
    cartDetails: Object,
    userId: mongoose.Types.ObjectId,
    arrivingDate: { type: Date,
        required: [true, "arrivingDate missing"],
     },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false },
  
});

medUserNotificationsSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
  });
const medUserNotifications = mongoose.model("medUserNotifications", medUserNotificationsSchema);
module.exports = medUserNotifications;
