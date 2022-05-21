const mongoose = require("mongoose")
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const dietDay = new mongoose.Schema({
    dietPlan: {
        type: mongoose.Types.ObjectId,
        required: [true, "Please add diet plan id"]
    },
    day: {
        type: Number,
        required: [true, "Please add day number"]
    },
    title: {
        type: String,
        required: [true, "Please enter title"]
    },
    image: {
        type: String
    },
    morning: [{
        describeMeal: {
            type: String,
            required: [true, "description for a morning meal is missing"]
        },
        subText: {
            type: String,
            required: [true, "sub text of a morning meal is missing"]
        },
        image: {
            type: String
        },
        _id: false
    }],
    afterNoon: [{
        describeMeal: {
            type: String,
            required: [true, "description for a afternoon meal is missing"]
        },
        subText: {
            type: String,
            required: [true, "sub text of a afternoon meal is missing"]
        },
        image: {
            type: String
        },
        _id: false
    }],
    evening: [{
        describeMeal: {
            type: String,
            required: [true, "description for a evening meal is missing"]
        },
        subText: {
            type: String,
            required: [true, "sub text of a evening meal is missing"]
        },
        image: {
            type: String
        },
        _id: false
    }],
    night: [{
        describeMeal: {
            type: String,
            required: [true, "description for a night meal is missing"]
        },
        subText: {
            type: String,
            required: [true, "sub text of a night meal is missing"]
        },
        image: {
            type: String
        },
        _id: false
    }, ],
    createdBy: {
        type: mongoose.Types.ObjectId,
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

dietDay.pre("save", function(next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});
dietDay.plugin(aggregatePaginate);


const DietDay = mongoose.model("dietDays", dietDay)
module.exports = DietDay