const mongoose = require("mongoose");

const userFamilySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true,"User id missing"],
        ref:'users'
    },
    image: {
        type: String
    },
    name: {
        type: String,
        required: [true,"Name is missing"]
    },
    surname: {
        type: String
    },
    age: {
        type: Number,
        required: [true,"Age is missing"]
    },
    gender: {
        type: String,
        required: [true,"Gender is missing"],
    },
    bloodGroup: {
        type: String,
        required: [true,"Blood group is missing"],
    },
    height: {
        type: Number,
        required: [true,"Height is missing"],
    },
    weight: {
        type: Number,
        required: [true,"Weight is missing"],
    },
    relation: {
        type: String
    },
    isDisabled: {
        type: Boolean,
        default:false
    },  
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }

});
userFamilySchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const UserFamily = mongoose.model("userFamily", userFamilySchema);
module.exports = UserFamily;

