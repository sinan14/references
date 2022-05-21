const mongoose = require("mongoose");

const userAddressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true,"userId missing"]
    },
    name: {
        type: String,
        required: [true,"Name is missing"]
    },
    mobile: {
        type: String,
        required: [true,"Phone number is missing"]
    },
    pincode: {
        type: String,
        required: [true,"Pincode is missing"]
    },
    house: {
        type: String,
        required: [true,"House number is missing"]
    },
    street: {
        type: String,
    },
    landmark: {
        type: String,
    },
    latitude: {
        type: String,
    },
    longitude: {
        type: String,
    },
    type: {
        type: String,
        required: [true,"Address type is missing"]
    },
    state: {        
        type: String,
        required: [true,"State is missing"]
    },
    isDisabled: {
        type: Boolean,
        default:true
    },  
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }

});
userAddressSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const UserAddress = mongoose.model("userAddress", userAddressSchema);
module.exports = UserAddress;

