const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
    level: {
        type: Number
    },
    parent: {
        type: mongoose.Types.ObjectId,
        ref: 'stores'

    },
    category: {
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    password: {
        type: String,
    },
    pin: {
        type: String,
    },
    state: {
        type: String,
    },

    country: {
        type: String,
    },
    gst: {
        type: String,
    },

    regNo: {
        type: String,
    },

    managerName: {
        type: String,
    },
    managerPhone: {
        type: String,
    },
    serviceablePincodes: [{
        code: { type: String },
        active: {
            type: Boolean,
            default: true
        },
        cashOnDelivery: {
            type: Boolean,
            default: true
        }
    }],

    posUsername: {
        type: String,
    },
    posPassword: {
        type: String,
    },
    isDisabled: {
        type: Boolean,
        default: false
    },
    masterStore: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: String,
    },
    updatedBy: {
        type: String,
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }

});
storeSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const Stores = mongoose.model("store", storeSchema);
module.exports = Stores;


// const storePinSchema = new mongoose.Schema({

//     serviceablePincodes: [{ code: { type: Number } }],


// });

// const StoresPin = mongoose.model("storepin", storePinSchema);
// module.exports = StoresPin;