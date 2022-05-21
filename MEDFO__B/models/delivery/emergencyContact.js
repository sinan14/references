const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema({
    
    Name: {
        type: String,
        required: [true, "Name missing"],
    },
    contactNumber: {
        type: String,
        required: [true, "contactNumber missing"],
    },
    position: {
        type: String,
    }
  
});


const emergencyContact = mongoose.model("emergencyContact", emergencyContactSchema);
module.exports = emergencyContact;
