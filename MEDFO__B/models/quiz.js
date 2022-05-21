const mongoose = require("mongoose");


//db.medquiz.insert({"name":"Live Quiz covid19","medcoin":100,"startingdate":"10/08/2021",
//"endingdate":"11/08/2021","quiztime":10,"questions":[{"question":"which month covid 19 firstrepored in kerala","optiona":"januvary","optionb":"december","optionc":"feb","optiond":"march","correctindex":1}]});

const quizSchema = new mongoose.Schema({
    name: {
        type: String
       
    },
    
    medcoin:{type:Number},
 startingdate:{type:Date},
 endingdate:{type:Date},
 quiztime:{type:Number},
 isactive:{type:Boolean,
default:true},
 questions:[{
     question:{type:String},
     option1:{type:String},
     option2:{type:String},
     option3:{type:String},
     option4:{type:String},
     correctindex:{type:Number}
 }],
 winner: {
     type: mongoose.Types.ObjectId
 },
 isDisabledLiveQuiz: {
     type: Boolean,
     default: false
 }
    
})

const Quiz = mongoose.model("quiz", quizSchema);
module.exports = Quiz;