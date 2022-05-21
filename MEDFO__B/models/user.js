const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const userSchema = new mongoose.Schema({
  customerId: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    sparse: true,
  },
  phone: {
    type: String,
  },
  countryCode: {
    type: String,
  },
  password: {
    type: String,
  },
  medCoin: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
  isGuest: {
    type: Boolean,
  },
  image: {
    type: String,
  },

  gender: {
    type: String,
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
  },
  pincode: {
    type: String,
  },
  dob: {
    type: String,
  },
  bloodGroup: {
    type: String,
  },
  maritalStatus: {
    type: String,
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  referralCode: {
    type: String,
  },
  locality: {
    type: String,
  },
  isUserEligibleForReferralFirstOrderCoin: {
    type: Boolean,
  },
  firstOrderMedcoin: {
    type: String,
  },
  fcmId: {
    type: String,
  },
  notes: [
    {
      notes: String,
      date: Date,
    },
  ],
  referredUserId: mongoose.Types.ObjectId,
  referralPolicyId: mongoose.Types.ObjectId,
  referredUserMedCoinCount: Number,
  createdAt: { type: Date, required: false },
  updatedAt: { type: Date, required: false },
});

// userSchema.pre("save", async function(next) {
//     // check the password if it is modified
//     if (!this.isModified("password")) {
//       return next();
//     }

//     // Hashing the password
//     this.password = await bcrypt.hash(this.password, 12);

//     // Delete passwordConfirm field
//     this.passwordConfirm = undefined;
//     next();
// });

userSchema.pre("save", function (next) {
  now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  this.updatedAt = now.getTime();
  next();
});
userSchema.plugin(aggregatePaginate);

const user = mongoose.model("users", userSchema);
module.exports = user;
