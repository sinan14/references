const mongoose = require('mongoose')

const foliofitHomePageSchema = new mongoose.Schema({
    category: {
        type: mongoose.Types.ObjectId
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

const foliofitHomePage = mongoose.model('foliofitHomePage', foliofitHomePageSchema)
module.exports = foliofitHomePage