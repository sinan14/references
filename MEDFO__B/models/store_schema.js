const mongoose = require("mongoose");
const Product = require("./product");
const { Schema } = mongoose;

const storeSchema = new Schema({
  name: {
    type: String,
    required: [true, "store must have a name!"],
  },
  level: {
    type: Number,
  },

  catogory: {
    type: String,
    enum: ["Mini", "Micro", "MediMall"],
  },
  parent: {
    type: Schema.Types.ObjectId,
  },
  email: {
    type: String,
    required: [true, "Email required"],
  },
  phone: {
    type: Number,
  },
  address: {
    type: String,
  },
  password: {
    type: String,
  },
  pinCode: {
    type: Number,
  },
  state: { type: String },
  country: { type: String },
  gst: { type: Number },
  registerNo: { type: String },
  managerName: { type: String },
  managerPhone: { type: Number },
  serviceablePincodes: { type: [] },
  posUsername: { type: String },
  posPassword: { type: String },
  isDisabled: { type: Boolean, default: false },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  createdBy: { type: Schema.Types.ObjectId },
  updatedBy: { type: Schema.Types.ObjectId },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

storeSchema.pre("save", function (next) {
  now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  this.updatedAt = now.getTime();
  next();
});

// DELETE ALL ASSOCIATED PRODUCTS AFTER A STORE IS DELETED
// storeSchema.post("findOneAndDelete", async function (Store) {
//   if (store.products.length) {
//     const res = await Product.deleteMany({ _id: { $in: store.products } });
//     console.log(res);
//   }
// });

storeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
storeSchema.pre("save", async function (next) {
  if (!this.isModified("posPassword")) return next();
  this.password = await bcrypt.hash(this.posPassword, 12);
  next();
});

const StoreData = mongoose.model("StoreData", storeSchema);

module.exports = StoreData;
