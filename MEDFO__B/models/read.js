const mongoose = require('mongoose')

const readSchema = mongoose.Schema({
    type: {
        type: String,
        required: [true, "Type is missing"]
    },
    contentId: {
        type: mongoose.Types.ObjectId,
        required: [true, "content id is missing"]
    },
    userId: [{
        type: String,
        required: [true, "userId missing"]
    }],
    read_count: {
        type: Number
    }
})

const Read = mongoose.model("read", readSchema)
module.exports = Read