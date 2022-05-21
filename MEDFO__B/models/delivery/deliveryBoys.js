const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const DeliverySchema = new mongoose.Schema({
  deliveryBoyId: {
    type: String 
  }, 
  fullName: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "Name is too short!"],
    maxLength: 150,
    description: "Please enter full name",
  }, 
  mobile: {
    type: String,
    description: "Mobile number",
    required: [true, "Please enter mobile number"]
  },
  email: {
    type: String,
    lowercase: true,
    description: "Please enter email id ",
  },
  password: {
    type: String,
    minLength: [6, "Password is too short!"],
    description: "Please enter password",
    required: true,
  },
  drivingLicenseNumber: {
    type: String,
    description: "Driving licence number",
    required: [true,"Please enter driving licence number"]
  },
  aadharCardNumber: {
    type: String,
    description: "Aadhar card number",
    required: [true,"Please add aadhar card number"]
  },
  address: {
    type: String,
    description: "Address",
    required: [true,"Please enter address"]
  },
  city: {
    type: String,
    description: "City",
    required: [true,"Please enter city"]
  },  
  licence: {
    type: String,
    description: "Licence",
    required: [true,"Please add licence"]
  },
  aadhar: {
    type: String,
    description: "Aadhar",
    required: [true,"Please add aadhar"]
  },
  rcBook: {
    type: String,
    description: "Aadhar",
    required: [true,"Please add RC Book"]
  },
  store: { 
    type: [mongoose.Types.ObjectId],
  },
  pincode: { 
    type: [mongoose.Types.ObjectId], 
  }, 
  commission: {
    type: Number
  },
  credit: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: String,
    default: "pending"
  },
  profilePic: {
    type: String,
    default:"medfeed/head.jpeg"
  },
  status: {
    type: String,
    default: "Offline",
    enum : ['Offline','Online'],
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

DeliverySchema.pre("save", async function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();

    // check the password if it is modified
    if (!this.isModified("password")) {
        return next();
    }

    // Hashing the password
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

const DeliveryBoys = mongoose.model("deliveryBoys", DeliverySchema);

module.exports = DeliveryBoys;
