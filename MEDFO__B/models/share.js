const mongoose = require('mongoose')

const shareSchema = mongoose.Schema({
    type:{
        type: String,
        required: [true,"Type is missing"]
    },
    contentId: {
        type: mongoose.Types.ObjectId,
        required: [true,"content id is missing"]
    },
    userId: {
        type: [String],
       
    },
    share_count: {
        type: Number,
       
    }
})

const Share = mongoose.model("shares",shareSchema)
module.exports = Share