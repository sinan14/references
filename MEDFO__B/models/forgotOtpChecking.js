const mongoose = require('mongoose')

const forgotOtpCheckingSchema = new mongoose.Schema({
    sessionId: {
        type: String
    },
    phone: {
        type: String
    }
})

const forgotOtpChecking = mongoose.model('forgotOtpChecking', forgotOtpCheckingSchema)
module.exports = forgotOtpChecking