const mongoose = require("mongoose")
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const foliofitYogaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter a name"]        
    },
    video: {
        type: String,
        required: [true, "Please upload video"]        
    },
    thumbnail: {
        type: String,
        required: [true, "Please upload a thumbnail"]        
    },
    workoutTime: {
        type: String,
        required: [true, "Please add duration"]        
    },  
    isDisabled: {
        type: Boolean,
        default: false,
    }, 
    createdBy: {
        type: mongoose.Types.ObjectId,
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
    }, 
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

foliofitYogaSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

foliofitYogaSchema.plugin(aggregatePaginate);

const FolifitYoga = mongoose.model("folifitYoga",foliofitYogaSchema)
module.exports = FolifitYoga