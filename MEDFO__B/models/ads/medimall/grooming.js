const mongoose = require("mongoose")

const adsMedimallGroomingSchema = new mongoose.Schema({
    
    // productId: {
    //     type:mongoose.Types.ObjectId,
    //     required: [true, "Please select the product"]
    // },
    // type: {
    //     type:Number,
    //     required: [true, "Please select the type"]
    // },
    categoryId: {
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the categorye"]
    },
    productId: {
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the type name"],
        ref: 'product'
    },
    // typeId: {
    //     type:mongoose.Types.ObjectId,
    //     required: [true, "Please select the type name"]
    // },
    isDisabled: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Types.ObjectId
    },
    updatedBy: {
        type: mongoose.Types.ObjectId
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

adsMedimallGroomingSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const AdsMedimallGrooming = mongoose.model("adsMedimallGrooming",adsMedimallGroomingSchema)
module.exports = AdsMedimallGrooming

