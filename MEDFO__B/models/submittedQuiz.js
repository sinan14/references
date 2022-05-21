const mongoose = require('mongoose')

const submittedQuizSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, "parameter missing: 'date'"]
    },
    customer_id: {
        type: mongoose.Types.ObjectId,
        required: [true, "parameter missing: 'customer_id'"]
    },
    corrected_count: {
        type: Number,
        required: [true, "parameter missing: 'corrected_count'"]
    },
    total_questions: {
        type: Number,
        required: [true, "parameter missing: 'total_questions'"]
    },
    time_used: {
        type: Number,
        required: [true, "parameter missing: 'time_used'"]
    },
    quiz_id:{
        type: mongoose.Types.ObjectId,
        required: [true, "parameter missing: 'quiz_id'"]
    }
})

const submittedQuiz = mongoose.model('submittedQuizzes',submittedQuizSchema)
module.exports = submittedQuiz