const mongoose = require("mongoose")

const customerComplaintSchema = new mongoose.Schema({
    CustomerId: {
        type: String,
        required: [true, "Please enter customerId"]        
    },
    ComplaintId: {
        type: String,
        required: [true, "Please enter complaintId"]        
    },
    ReasonForComplaint: {
        type: String,
        required: [true, "Please enter reason"]   
    },
    Department: {
        type: String,
        required: [true, "Please enter the Department"]   
    },
    preference: {
        type: String,
        required: [true, "Please enter the Department"] 
    },
    Details: {
        type: String,
        required: [true, "Please enter the Department"]   
    },
    complaintStatus: {
        type: Boolean,
        default: false
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Please enter the Department"]   
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
    },
    solvedDate: {
         type: Date, required: false 
    },
    HandledBy: {
        type: String, required: false 
    },
    Notes: {
        type: String, required: false   
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

customerComplaintSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const customerComplaint = mongoose.model("customerComplaint",customerComplaintSchema)
module.exports = customerComplaint