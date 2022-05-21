const mongoose = require('mongoose')

const medfeedMainSection = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please add title"]
    },
    image: {
        type: String
    }
})

const medfeedMainSections = mongoose.model('medfeedMainSections', medfeedMainSection)
module.exports = medfeedMainSections