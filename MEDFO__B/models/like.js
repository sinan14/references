const mongoose = require('mongoose')

const likeSchema = mongoose.Schema({
    type:{
        type: String,
        required: [true,"Type is missing"]
    },
    contentId: {
        type: mongoose.Types.ObjectId,
        required: [true,"content id is missing"]
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true,"userId missing"]
    }
})

const Like = mongoose.model("likes",likeSchema)
module.exports = Like