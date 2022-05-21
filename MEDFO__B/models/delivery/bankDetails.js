const mongoose = require("mongoose");

const bankDetailsSchema = new mongoose.Schema({
    
    bankName: {
        type: String,
        required: [true, "Name missing"],
    },
    accountHolderName: {
        type: String,
        required: [true, "contactNumber missing"],
    },
    accountNumber: {
        type: String,
        required: [true, "accountNumber missing"],
    },
    ifscCode: {
        type: String,
        required: [true, "ifscCode missing"],
    },
    upid: {
        type: String,
        required: [true, "ifscCode missing"],
    },
  
});


const bankDetails = mongoose.model("bankDetails", bankDetailsSchema);
module.exports = bankDetails;
