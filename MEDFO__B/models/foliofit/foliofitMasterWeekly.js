const mongoose = require('mongoose')

const foliofitWeeklySchema = new mongoose.Schema({
    title: {
        type: String
    },
    subTitle: {
        type: String
    },
    banner: {
        type: String
    },
    benefits: {
        type: Array
    },
    videos: {
        type: Array
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

const foliofitWeeklyWorkout = mongoose.model('foliofitWeeklyWorkout', foliofitWeeklySchema)
module.exports = foliofitWeeklyWorkout