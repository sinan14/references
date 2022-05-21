const mongoose = require('mongoose')

const saveSchema = mongoose.Schema({
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

const Save = mongoose.model("saves",saveSchema)
module.exports = Save