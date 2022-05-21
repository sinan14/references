const mongoose = require('mongoose')

const foliofitMainSectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please add name"]
    },
    image: {
        type: String
    }
})

const foliofitMainSections = mongoose.model('foliofitMainSections', foliofitMainSectionSchema)
module.exports = foliofitMainSections