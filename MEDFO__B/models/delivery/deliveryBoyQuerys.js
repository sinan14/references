const mongoose = require("mongoose");

const deliveryBoyQuerySchema = new mongoose.Schema({
    
    DeliveryBoyID: {
        type: mongoose.Types.ObjectId,
        required: [true, "DeliveryBoyID missing"]
    },
    IssueRelated: {
        type: String,
        required: [true, "IssueRelated missing"],
        enum : ['Payment Related','Delivery Related','Account Related','Return Related','Transaction Related'],
    },
    Issue: {
        type: String,
        required: [true, "Issue missing"],
    },
    reply: {
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    isReplied: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        required: false
    },
    updatedAt: {
      type: Date,
      required: false
    }
  
});
deliveryBoyQuerySchema.pre("save", async function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
});

const deliveryBoyQuery = mongoose.model("deliveryBoyQuery", deliveryBoyQuerySchema);
module.exports = deliveryBoyQuery;
