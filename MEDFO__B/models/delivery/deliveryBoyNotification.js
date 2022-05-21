const mongoose = require("mongoose");

const deliveryBoyNotificationsSchema = new mongoose.Schema({
    
    DeliveryBoyID: {
        type: mongoose.Types.ObjectId,
        required: [true, "DeliveryBoyID missing"]
    },
    orderObjectId: {
      type:mongoose.Types.ObjectId,
    required: [true, "orderObjectId missing"]
    },
    orderId: {
        type: String,
        required: [true, "orderId missing"],
    },
    type: {
        type: String,
        required: [true, "type missing"],
        enum: ["NewOrder","Return"],
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    assignedDate: Date,
    paymentType: String,
    cartDetails: Object,
    userId: mongoose.Types.ObjectId,
   
  
});


const deliveryBoyNotifications = mongoose.model("deliveryBoyNotifications", deliveryBoyNotificationsSchema);
module.exports = deliveryBoyNotifications;
