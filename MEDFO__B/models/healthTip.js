const mongoose = require("mongoose")
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const healthTipSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: [true, "Please add heading"]
    },
    readTime: {
        type: String,
        required: [true, "Please enter read time"]        
    },
    categories: {
        type: Array,
        required: [true, "Please add atleast one category"]        
    },
    image: {
        type: String,
        required: [true, "Please add image"]        
    },
    description: {
        type: String,
        required: [true, "Please add description"]        
    },
    newest: {
        type: Boolean,
        default:false
    },
    trending: {
        type: Boolean,
        default:false
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

healthTipSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

healthTipSchema.plugin(aggregatePaginate);

const HealthTip = mongoose.model("healthTip",healthTipSchema)
module.exports = HealthTip