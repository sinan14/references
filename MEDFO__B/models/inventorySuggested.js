const mongoose = require('mongoose')
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const inventorySuggestedSchema = mongoose.Schema({
   
    title: {
        type: String,
        required: [true,"Title is missing"]
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true,"useId is missing"],
        ref: 'users'
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})
inventorySuggestedSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});
inventorySuggestedSchema.plugin(aggregatePaginate);

const InventorySuggested = mongoose.model("inventorySuggested",inventorySuggestedSchema)
module.exports = InventorySuggested