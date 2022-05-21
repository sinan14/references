const mongoose = require("mongoose")
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const healthcareSchema = new mongoose.Schema({
    name: {
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
    duration: {
        type: String,
        required: [true, "Please add duration"]        
    },
    subCategories: {
        type: Array,
        required: [true, "Please add atleast one sub category"]        
    },
    homepageMain: {
        type: Boolean
    },
    homepageSub: {
        type: Boolean
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

healthcareSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

healthcareSchema.plugin(aggregatePaginate);

const HealthcareVideos = mongoose.model("healthcareVideos",healthcareSchema)
module.exports = HealthcareVideos