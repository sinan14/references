const mongoose = require("mongoose")

const customerRemarkSchema = new mongoose.Schema({
    remarks: {
        type: String,
        required: [true, "Please enter remarks"]        
    },
    customerId: {
        type: String,
        // required: [true, "Please enter remarks"]        
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

customerRemarkSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const CustomerRemarks = mongoose.model("customerRemarks",customerRemarkSchema)
module.exports = CustomerRemarks