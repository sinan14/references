const mongoose = require("mongoose");

const HealthExpertCategory = require("../models/healthExpertCategory");
const HealthExpertAdvice = require("../models/healthExpertAdvice");
const healthExpertQnReplay = require("../models/healthExpertQnReplay");
const Like = require("../models/like");
const User = require("../models/userModel");
const moment = require("moment")
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return "few seconds ago";
}

module.exports = {
  //Enter Health Expert Category
  addHealthExpertCategory: async (req, res, next) => {
    try {
      let exists = await HealthExpertCategory.findOne({ name: req.body.name });
      if (!exists) {
        HealthExpertCategory.create({
          name: req.body.name,
        })
          .then((response) => {
            res.status(200).json({
              status: true,
              data: "Category added",
            });
          })
          .catch((response) => {
            res.status(422).json({
              status: false,
              data: response,
            });
          });
      } else {
        res.status(422).json({
          status: false,
          data: "Existing category",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  // List my questions
  getMyHealthExpertQuestions: async (req, res, next) => {
    try {
      
      let user = req.user._id;
      console.log("userid", user);
      let health_advice = await HealthExpertAdvice.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(user) } },
        {
          $project: {
            id: "$_id",
            question: 1,
            // posted_by: "$userId",
            posted_on: "$createdAt",
            type: "advice",
            posted_by:"$userName",
            userImage:1
          },
        },
      ]);

      console.log("health advice", health_advice);
      for (j = 0; j < health_advice.length; j++) {
        health_advice[j].userImage = process.env.BASE_URL.concat(
          health_advice[j].userImage)
        delete health_advice[j]._id;
        health_advice[j].like_count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(health_advice[j].id),
        });
        // result[j] = result[j].toJSON();
        // is added wishlist (liked)
        let isLiked = await Like.findOne({
          type: "advice",
          contentId: mongoose.Types.ObjectId(health_advice[j].id),
          userId: req.user._id,
        });

        console.log(j,'q isliked:',isLiked)

        if (isLiked) {
          health_advice[j].is_liked = 1;
        } else {
          health_advice[j].is_liked = 0;
        }
        // let user = await User.findOne({
        //   _id: mongoose.Types.ObjectId(health_advice[j].posted_by),
        // });
        // console.log("user", user);
        // if (health_advice[j].user_pic) {
        //   health_advice[j].user_pic = process.env.BASE_URL.concat(
        //     user.image
        //   );
        // } else {
        //     health_advice[j].user_pic = process.env.BASE_URL.concat( "medfeed/head.jpeg"
        //     );
        // }
        // health_advice[j].posted_by = user.name;
        let time = timeSince(health_advice[j].posted_on)

            health_advice[j].posted_on = time;
       let objdata = await healthExpertQnReplay.aggregate([
          {
            $match: {
              question_id: mongoose.Types.ObjectId(health_advice[j].id),
            },
          },
          {
            $project: {
              reply_id: "$_id",
              answer: "$reply",
              replied_by: "$repliedBy",
              replay_posted_on: "$createdAt",
              reply_type: "adviceReply",
              image:1
            },
          },
        ]);
        
          // health_advice_replay.push(objdata);
          if (objdata.length) {
            delete objdata[0]._id;
          
          objdata[0].reply_like_count = await Like.countDocuments({
              contentId: mongoose.Types.ObjectId(objdata[0].reply_id),
            });
            console.log("count_replay@@@@@@", objdata[0].reply_like_count);

            // result[j] = result[j].toJSON();
            // is added wishlist (liked)
            var reply_isLiked = await Like.findOne({
              type: "adviceReply",
              contentId: mongoose.Types.ObjectId(objdata[0].reply_id),
              userId:req.user._id,
            });
            console.log("replay_isLiked", reply_isLiked);
            if (reply_isLiked) {
              objdata[0].reply_isLiked = 1;
            } else {
              objdata[0].reply_isLiked = 0;
            }
            let sin = timeSince(objdata[0].replay_posted_on)
            if (objdata[0].image) {
              health_advice[j].admin_image = process.env.BASE_URL.concat(
                objdata[0].image
              );
            } else {
              health_advice[j].admin_image = process.env.BASE_URL.concat(
                "medfeed/head.jpeg"
              ); 
            }
            health_advice[j].replay_posted_on = sin;
            // health_advice_replay.push(count_replay,replay_isLiked)
            health_advice[j].answer  = objdata[0].answer;
            health_advice[j].replied_by = objdata[0].replied_by
            // health_advice[j].reply_posted_on = objdata[0].replay_posted_on
            health_advice[j].reply_like_count = objdata[0].reply_like_count
            health_advice[j].reply_isLiked = objdata[0].reply_isLiked
            health_advice[j].reply_id  = objdata[0].reply_id;
            health_advice[j].reply_type  = objdata[0].reply_type;
            
          
        }
        
      }
      res.status(200).json({
        error: false,
        message: "success",
        data: { health_advice: health_advice.reverse() },
      });
    } catch (error) {
      next(error);
    }
  },
  // post questions
  sendQuestion: async (req, res, next) => {
    try {
      let valid = await HealthExpertCategory.findOne({ _id: mongoose.Types.ObjectId(req.body.category_id) });
      if(valid){
      let data = req.body;
      data.userId = req.user._id;
      data.userName= req.user.name;
      if(req.user.image){
        data.userImage= req.user.image
      }else{
        data.userImage="medfeed/head.jpeg"
      }
      let schemaObj = new HealthExpertAdvice(data);
      schemaObj.save().then((response) => {
        res.status(200).json({
          status: true,
          data: "Questions added successfully",
        });
      });
    }else{
      res.status(200).json({
        status: false,
        data: "In valid category id",
      });
    }

    } catch (error) {
      next(error);
    }
  },

  //Search HealthExpert Advice By ID

  findHealthExpertAdvice: async (req, res, next) => {
    try {
      let result = await HealthExpertAdvice.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });

      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  //List All Questions

  listAllHealthExpertAdvice: async (req, res, next) => {
    try {
      console.log("params", req.params);
      let Type = req.params.Type.replace(/\s+/g, " ").trim();
      console.log("Type", Type);
      if (Type == "all" || Type == "pending") {
        var result = "";
        if (Type == "all") {
          // result = await HealthExpertAdvice.find();
           result = await HealthExpertAdvice.aggregate([
            {
              $project: {
                _id: 1,
                question: 1,
                userId:1,
                createdAt: 1,
                category_id:1,
                reply:1,
                repliedBy:1,
                isReplied:1,
                userImage:1,
                userName:1
              },
            },
            
          ]);
          console.log("health advice", result);
          for(x=0;x<result.length;x++){
              result[x].userImage = process.env.BASE_URL.concat(result[x].userImage);
            if (result.length){
               result[x].createdAt  = moment(result[x].createdAt).format("DD MMM YYYY");
            }
            var name = await HealthExpertCategory.aggregate([
              {
                $match:{
                  _id:mongoose.Types.ObjectId(result[x].category_id)
                },
              },{
                $project:{
                  name:1
                }
              }
            ])
            if (name.length) {
              delete name[0]._id;
              // health_advice_replay.push(count_replay,replay_isLiked)
              result[x].name  = name[0].name;
             
              
          }
          let user = await User.findOne({
            _id: mongoose.Types.ObjectId(result[x].userId),
        });
        console.log("user", user);
       
          }
          console.log("name", name);
    
         
          for (j = 0; j < result.length; j++) {
            // delete result[j]._id;
            
           let objdata = await healthExpertQnReplay.aggregate([
              {
                $match: {
                  question_id: mongoose.Types.ObjectId(result[j]._id),
                },
              },
              {
                $project: {
                  replyId: "$_id",
                  answer: "$reply",
                  replied_by: "$repliedBy", // delete result[j]._id;
                  image:1
                },
              },
            ]);
            console.log('objdata',objdata)
              if (objdata.length) {
                delete objdata[0]._id;
                // health_advice_replay.push(count_replay,replay_isLiked)
                result[j].answer  = objdata[0].answer;
                result[j].replied_by = objdata[0].replied_by
                result[j].replyId = objdata[0].replyId
                result[j].image =process.env.BASE_URL.concat(objdata[0].image) 
            }
            console.log('result',result)
          }
        } else if (Type == "pending") {
          result = await HealthExpertAdvice.aggregate([
            {
              $match:{
                isReplied: false
              }
            },
            {
              $project: {
                _id: 1,
                question: 1,
                userId:1,
                createdAt: 1,
                category_id:1,
                // reply:1,
                // repliedBy:1,
                isReplied:1,
                userImage:1,
                userName:1
              },
            },
            
          ]);
          for(x=0;x<result.length;x++){
            result[x].userImage = process.env.BASE_URL.concat(result[x].userImage);
            if (result.length){
              result[x].createdAt  = moment(result[x].createdAt).format("DD MMM YYYY");
           }
            var name = await HealthExpertCategory.aggregate([
              {
                $match:{
                  _id:mongoose.Types.ObjectId(result[x].category_id)
                },
              },{
                $project:{
                  name:1
                }
              }
            ])
            if (name.length) {
              delete name[0]._id;
              // health_advice_replay.push(count_replay,replay_isLiked)
              result[x].name  = name[0].name;
              
          }
          }
         
        }
        console.log("result", result);
        res.status(200).json({
          status: true,
          data: result,
        });
      } else {
        res.status(200).json({
          status: false,
          data: "Please Check the Type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  //getHealthExpertAdviceQuestion single questions
  getHealthExpertAdviceQuestions: async (req, res, next) => {
    try {
          // result = await HealthExpertAdvice.find();
          var result = await HealthExpertAdvice.aggregate([
            {
              $match:{
                _id:mongoose.Types.ObjectId(req.params.id)
              }
            },
            {
              $project: {
                _id: 1,
                question: 1,
                userId:1,
                userName:1,
                userImage:1,
                createdAt: 1,
                category_id:1,
                reply:1,
                repliedBy:1,
                isReplied:1
              },
            },
            
          ]);
          result[0].userImage = process.env.BASE_URL.concat(result[0].userImage)
            if (result.length){
               result[0].createdAt  = moment(result[0].createdAt).format("DD MMM YYYY");
            }
            var name = await HealthExpertCategory.aggregate([
              {
                $match:{
                  _id:mongoose.Types.ObjectId(result[0].category_id)
                },
              },{
                $project:{
                  name:1
                }
              }
            ])
            if (name.length) {
              delete name[0]._id;
              // health_advice_replay.push(count_replay,replay_isLiked)
              result[0].name  = name[0].name;
             
              
          }
         

            // delete result[j]._id;
            
           let objdata = await healthExpertQnReplay.aggregate([
              {
                $match: {
                  question_id: mongoose.Types.ObjectId(result[0]._id),
                },
              },
              {
                $project: {
                  replyId: "$_id",
                  answer: "$reply",
                  replied_by: "$repliedBy", // delete result[j]._id;
                  image:1
                },
              },
            ]);
              if (objdata.length) {
                delete objdata[0]._id;
                // health_advice_replay.push(count_replay,replay_isLiked)
                result[0].answer  = objdata[0].answer;
                result[0].replied_by = objdata[0].replied_by
                result[0].replyId = objdata[0].replyId
                result[0].image = process.env.BASE_URL.concat(objdata[0].image)
            }
         
        console.log("result", result);
        res.status(200).json({
          status: true,
          data: result,
        });
    } catch (error) {
      next(error);
    }
  },
  //category vise lisiting
  listCategoryHealthExpertAdvice: async (req, res, next) => {
    try {
    var result = await HealthExpertAdvice.aggregate([
        {
          $match:{
            category_id: mongoose.Types.ObjectId(req.params.id)
          }
        },
        {
          $project: {
            _id: 1,
            question: 1,
            userId:1,
            userName:1,
            userImage:1,
            createdAt: 1,
            category_id:1,
            reply:1,
            repliedBy:1,
            isReplied:1
          },
        },
        
      ]);
      console.log("health advice", result);
      for(x=0;x<result.length;x++){
        result[x].userImage = process.env.BASE_URL.concat(result[x].userImage);
        if (result.length){
          result[x].createdAt  = moment(result[x].createdAt).format("DD MMM YYYY");
       }
        var name = await HealthExpertCategory.aggregate([
          {
            $match:{
              _id:mongoose.Types.ObjectId(result[x].category_id)
            },
          },{
            $project:{
              name:1
            }
          }
        ])
        if (name.length) {
          delete name[0]._id;
          // health_advice_replay.push(count_replay,replay_isLiked)
          result[x].name  = name[0].name;
          
      }
      }
      console.log("name", name);

     
      for (j = 0; j < result.length; j++) {
        // delete result[j]._id;
        
       let objdata = await healthExpertQnReplay.aggregate([
          {
            $match: {
              question_id: mongoose.Types.ObjectId(result[j]._id),
            },
          },
          {
            $project: {
              replyId: "$_id",
              answer: "$reply",
              replied_by: "$repliedBy", // delete result[j]._id;
              image:1
            },
          },
        ]);
        console.log('objdata',objdata)
          if (objdata.length) {
            delete objdata[0]._id;
            // health_advice_replay.push(count_replay,replay_isLiked)
            result[j].answer  = objdata[0].answer;
            result[j].replied_by = objdata[0].replied_by
            result[j].replyId = objdata[0].replyId
            result[j].image =  process.env.BASE_URL.concat(objdata[0].image)
        }
        console.log('result',result)
      }
      if (result) {
        res.status(200).json({
          status: true,
          data: result,
        });
      } else {
        res.status(200).json({
          status: false,
          data: "invalid category id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  //post reply for the question
  postReply: async (req, res, next) => {
    try {
      
      let valid = await HealthExpertAdvice.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      let data = req.body;
      // data.userId = req.user._id;
      data.question_id = req.params.id;
      // data.isReplied=true
      
      if (valid) {
          await HealthExpertAdvice.updateOne(
            { _id: mongoose.Types.ObjectId(req.params.id) },
            {$set:{
              isReplied:true
            }}
          )
          if(req.file){
            data.image = `medfeed/${req.file.filename}`;
          }else{
            data.image = "medfeed/head.jpeg";
          }
        
        let schemaObj = new healthExpertQnReplay(data);
        schemaObj.save().then((response) => {
          res.status(200).json({
            status: true,
            data: "Reply added successfully",
          });
          
        }).catch(async (error) => {
          await unlinkAsync(req.file.path);
          res.status(200).json({
            status: false,
            data: error,
          });
        });
    }else {
      await unlinkAsync(req.file.path);
      res.status(200).json({
        status: false,
        data: "Invalid HealthExpertAdvice ID",
      });
    }
       
        // .then((response) => {
        //   console.log(response);
        //   if (response.nModified == 1) {
        //     let date = new Date();
        //     HealthExpertAdvice.updateOne(
        //       { _id: mongoose.Types.ObjectId(req.params.id) },
        //       {
        //         updatedAt: date,
        //       }
        //     ).then((response) => {
        //       res.status(200).json({
        //         status: true,
        //         data: "Updated",
        //       });
        //     });
        //   } else {
        //     res.status(422).json({
        //       status: false,
        //       data: "no changes",
        //     });
        //   }
        // });
     
    } catch (error) {
      next(error);
    }
  },
  updatepostReply: async (req, res, next) => {
    try {
      
      if (req.body.replyId) {
        let reply = await healthExpertQnReplay.findOne({
          _id: mongoose.Types.ObjectId(req.body.replyId),
        });

        if (reply) {
          let data = req.body;
          if(data.image == 'null') {
            delete data.image
          }

          if (req.file) {
            data.image = `medfeed/${req.file.filename}`;
            // deleting old image
            let splittedImageRoute = reply.image.split("/");

            fs.unlink(
              `./public/images/${splittedImageRoute[1]}`,
              function (err) {
                if (err) throw err;
              }
            );
          }
          healthExpertQnReplay.updateOne(
            { _id: mongoose.Types.ObjectId(data.replyId) },
            data
          )
            .then((response) => {
              res.status(200).json({
                status: true,
                data: "updated successfully",
              });
            })
            .catch((error) => {
              res.status(200).json({
                status: false,
                data: error,
              });
            });
        } else {
          res.status(200).json({
            status: false,
            data: "invalid reply id",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          data: "replyId missing",
        });
      }
     
    } catch (error) {
      next(error);
    }
  },
  //Delete Health Expert Advice Question
  deleteExpertQuestion: async (req, res, next) => {
    try {
      let valid = await HealthExpertAdvice.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });

      if (valid) {
        HealthExpertAdvice.deleteOne({
          _id: mongoose.Types.ObjectId(req.params.id),
        }).then((response) => {
          res.status(200).json({
            status: true,
            data: "Question  removed",
          });
        });
      } else {
        res.status(422).json({
          status: false,
          data: "invalid  ID",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  //delete all HealthExpertAdvice
  deleteAllHealthExpertAdvice: async (req, res, next) => {
    try {
      HealthExpertAdvice.deleteMany().then((response) => {
        res.status(200).json({
          status: true,
          data: "Deleted All Data",
        });
      });
    } catch (error) {
      next(error);
    }
  },
};
