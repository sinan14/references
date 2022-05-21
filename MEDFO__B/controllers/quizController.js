const mongoose = require("mongoose");

const Quiz = require("../models/quiz");
const AdsMedfeedMainQuizExpert = require("../models/ads/medfeed/mainQuizExpert");
const submittedQuiz = require('../models/submittedQuiz')
const user = require('../models/user')
const { incrementOrDecrementAdminMedCoinBalance } = require('../controllers/medcoin/medCoinController')
const moment = require('moment')
const imgPath = process.env.BASE_URL
const MedCoin = require("../models/medcoin/medCoin");
const MedCoinDetails = require("../models/medcoin/medCoinDetails");

module.exports = {
  //list medfeed quiz
  listQuiz: async (req, res, next) => {
    try {
      let result = await Quiz.find();

      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  //search question

  findQuiz: async (req, res, next) => {
    try {
      let result = await Quiz.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      }).lean()

      result.startingdate = moment(result.startingdate).format('YYYY-MM-DD');
      result.endingdate = moment(result.endingdate).format('YYYY-MM-DD');
      console.log("re::", result);
      delete result.__v

      if (result) {
        res.status(200).json({
          message: "success",
          error: false,
          data: {
            quiz_details: result
          },
        });
      } else {
        res.status(200).json({
          status: false,
          data: "quiz not found",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  //enter questions to the quiz
  addQuiz: async (req, res, next) => {
    try {
      let existingName = await Quiz.findOne({ name: req.body.name });

      let data = req.body;

      let sta = new Date(data.startingdate)
      data.startingdate = sta

      // let newDate = data.startingdate.setUTCHours(0,0,0,0);
      let existingDate = await Quiz.findOne({
        endingdate: { $gte: new Date(data.startingdate) },
      })

      if (existingDate) {
        if (existingDate.isDisabledLiveQuiz) {
          existingDate = null
        }
      }

      if (!existingName) {
        if (!existingDate) {
          // data.startingdate = data.startingdate.setUTCHours(0,0,0,0);
          // data.endingdate = data.endingdate.setUTCHours(23,59,59,999);
          var endingdate = new Date(data.endingdate);
          console.log('type finding', typeof (endingdate))
          data.endingdate = new Date(endingdate.setUTCHours(23, 59, 59, 999)).toISOString()

          let schemaObj = new Quiz(data);
          schemaObj
            .save()
            .then((response) => {
              res.status(200).json({
                status: true,
                data: "Quiz added successfully",
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
            message: 'Sorry, a quiz is already available in this date'
          })
        }
      } else {
        res.status(200).json({
          status: false,
          data: "A quiz is already exists with this name",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  //modify quize data
  editQuiz: async (req, res, next) => {
    try {
      let valid = await Quiz.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });

      console.log('valid quiz', valid)
      let data = req.body;
      if (valid) {

        let existingName = await Quiz.findOne({ name: req.body.name });

        if (existingName) {
          if (existingName.name == valid.name) {
            existingName = false
          }
        }

        // let newDate = data.startingdate.setUTCHours(0,0,0,0);
        let existingDate = await Quiz.findOne({
          endingdate: { $gte: new Date(data.startingdate) }
        })

        console.log('exisgting date:', existingDate)

        if (existingDate) {
          if (existingDate.name == valid.name) {
            existingDate = false
          }
        }

        if (!existingName) {
          if (!existingDate) {
            // data.startingdate = data.startingdate.setUTCHours(0,0,0,0);
            // data.endingdate = data.endingdate.setUTCHours(23,59,59,999);

            var endingdate = new Date(data.endingdate);

            data.endingdate = new Date(endingdate.setUTCHours(23, 59, 59, 999)).toISOString()

            Quiz.updateOne(
              { _id: mongoose.Types.ObjectId(req.params.id) },
              data
            ).then((response) => {
              console.log(response);
              let date = new Date();
              Quiz.updateOne(
                { _id: mongoose.Types.ObjectId(req.params.id) },
                {
                  $set: { updatedAt: date },
                }
              ).then((response) => {
                res.status(200).json({
                  status: true,
                  data: "Updated",
                });
              });
            });

          } else {
            res.status(200).json({
              status: false,
              message: 'Sorry, a quiz is already exists with this date period'
            })
          }
        } else {
          res.status(200).json({
            status: false,
            message: 'Sorry, a quiz is already exists with this name'
          })
        }
      } else {
        res.status(200).json({
          status: false,
          data: "invalid Quiz ID",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  //Quiz Activate Deactivate
  deactivateQuiz: async (req, res, next) => {
    try {
      let valid = await Quiz.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      let data = req.body;
      if (valid) {
        if (valid.isactive) {
          let livequizflag = false
          if (new Date(valid.startingdate) <= new Date() && new Date(valid.endingdate) >= new Date()) {
            livequizflag = true
            let now = new Date()
            valid.endingdate = now
          }

          Quiz.updateOne(
            { _id: mongoose.Types.ObjectId(req.params.id) },
            {
              $set: {
                isactive: false,
                isDisabledLiveQuiz: livequizflag,
                endingdate: valid.endingdate
              },
            }
          ).then((response) => {
            console.log(response);
            if (response.nModified == 1) {
              let date = new Date();
              Quiz.updateOne(
                { _id: mongoose.Types.ObjectId(req.params.id) },
                {
                  updatedAt: date,
                }
              ).then((response) => {
                res.status(200).json({
                  status: true,
                  data: "Disabled",
                });
              });
            } else {
              res.status(200).json({
                status: false,
                data: "not updated",
              });
            }
          });
        } else {
          if (valid.isDisabledLiveQuiz) {
            return res.status(200).json({
              status: false,
              data: {
                errors: {
                  workEmail: {
                    name: "ValidatorError",
                    message: "Cannot enable a disabled live quiz",
                    properties: {
                      message: "Cannot enable a disabled live quiz",
                      type: "required",
                      path: "liveQuiz",
                    },
                    kind: "required",
                    path: "liveQuiz",
                  },
                },
                _message: "Cannot enable a disabled live quiz",
                name: "ValidationError",
                message:
                  "Cannot enable a disabled live quiz",
              },
            });
          }

          Quiz.updateOne(
            { _id: mongoose.Types.ObjectId(req.params.id) },
            {
              $set: {
                isactive: true,
              },
            }
          ).then((response) => {
            console.log(response);
            if (response.nModified == 1) {
              let date = new Date();
              Quiz.updateOne(
                { _id: mongoose.Types.ObjectId(req.params.id) },
                {
                  updatedAt: date,
                }
              ).then((response) => {
                res.status(200).json({
                  status: true,
                  data: "Enabled",
                });
              });
            } else {
              res.status(200).json({
                status: false,
                data: "not updated",
              });
            }
          });
        }

      } else {
        res.status(200).json({
          status: false,
          data: "invalid Quiz ID",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  // Delete a quiz
  deleteQuiz: async (req, res, next) => {
    try {
      let valid = await Quiz.findOne({ _id: mongoose.Types.ObjectId(req.params.id) })

      if (valid) {
        Quiz.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then((response) => {
          res.status(200).json({
            status: true,
            message: "Deleted",
          });
        });
      } else {
        res.status(200).json({
          status: false,
          message: 'invalid quiz id'
        })
      }

    } catch (error) {
      next(error)
    }
  },
  //delete all Quiz
  deleteAllQuizzes: async (req, res, next) => {
    try {
      Quiz.deleteMany().then((response) => {
        res.status(200).json({
          status: true,
          data: "Deleted All Data",
        });
      });
    } catch (error) {
      next(error);
    }
  },

  //Get quiz details for user app
  getQuizDetail: async (req, res, next) => {
    try {
      let currentDate = new Date();

      let todayStarting = new Date(currentDate.setUTCHours(0, 0, 0, 0)).toISOString()
      let todayEnding = new Date(currentDate.setUTCHours(23, 59, 59, 999)).toISOString()

      let quiz_details = await Quiz.aggregate([
        {
          $match: {
            $and: [
              { startingdate: { $lte: new Date(todayStarting) } },
              { endingdate: { $gte: new Date(todayEnding) } },
              { isactive: true }
            ],
          },
        },
        {
          $project: {
            title: "$name",
            medcoin: 1,
            quiz_time: "$quiztime",
            questions: 1,
          },
        },
      ]);
      console.log('quiz_details', quiz_details)

      let quiz_banner = await AdsMedfeedMainQuizExpert.find({ sliderType: 'quizone' });
      console.log(quiz_banner);
      if (quiz_details.length) {
        quiz_details[0].banner = process.env.BASE_URL.concat(
          quiz_banner[0].image
        );

        quiz_details[0].questions.map((e, i) => {
          let options = [
            {
              _id: 1,
              title: e.option1,
            },
            {
              _id: 2,
              title: e.option2,
            },
            {
              _id: 3,
              title: e.option3,
            },
            {
              _id: 4,
              title: e.option4
            },
          ];

          e.options = options

          e.answer_id = e.correctindex

          delete e.option1
          delete e.option2
          delete e.option3
          delete e.option4
          delete e.correctindex
        });

        let isSubmitted = await submittedQuiz.findOne({ customer_id: req.user._id, quiz_id: quiz_details[0]._id })
        if (isSubmitted) {
          quiz_details[0].isSubmitted = true
        } else {
          quiz_details[0].isSubmitted = false
        }

        res.status(200).json({
          error: false,
          message: "success",
          data: { quiz_details: quiz_details[0] },
        });
      } else {
        res.status(200).json({
          error: true,
          message: "no quiz available",
          data: { quiz_details: {} }

        });

      }

    } catch (error) {
      next(error);
    }
  },
  submitQuiz: async (req, res, next) => {
    try {
      let quiz = await Quiz.findOne({ _id: mongoose.Types.ObjectId(req.body.quiz_id) })

      console.log('mentor:', req.user)

      if (quiz) {
        let alreadySubmit = await submittedQuiz.findOne({ customer_id: req.user._id, quiz_id: req.body.quiz_id })
        if (alreadySubmit) {
          res.status(200).json({
            error: true,
            message: 'Already Submitted',
            data: {}
          })
        } else {
          let date = new Date()
          let data = {
            date: date,
            customer_id: req.user._id,
            corrected_count: req.body.corrected_count,
            total_questions: quiz.questions.length,
            time_used: req.body.time_used,
            quiz_id: req.body.quiz_id
          }
          let schemaObj = submittedQuiz(data)

          schemaObj.save().then((response) => {
            res.status(200).json({
              error: false,
              message: 'success',
              data: response
            })
          })
        }
      } else {
        res.status(200).json({
          error: true,
          message: 'invalid quiz id',
          data: {}
        })
      }

    } catch (error) {
      next(error)
    }
  },
  getQuizWinnerBanners: async (req, res, next) => {
    try {
      let result = []
      let banner = await AdsMedfeedMainQuizExpert.findOne({ sliderType: "quizone" }, {
        image: { $concat: [imgPath, "$image"] },
      })
      if (banner) {
        result.push(banner)
      }
      // let banners = await AdsMedfeedMainQuizExpert.find({sliderType:"quiz"}).skip(1)
      let banners = await AdsMedfeedMainQuizExpert.aggregate([{
        $match: {
          sliderType: "quiz"
        }
      }, {
        $project: {

          image: 1

        },
      },

      ])
      for (j = 0; j < banners.length; j++) {
        banners[j].image = process.env.BASE_URL.concat(
          banners[j].image
        );
        result.push(banners[j])
      }

      console.log('banners', banners)
      res.status(200).json({
        error: false,
        message: 'success',
        data: {
          banners: result
        }
      })
    } catch (error) {
      next(error)
    }
  },
  getLiveQuizzes: async (req, res, next) => {
    try {

      // ****** upcoming quizzes ******* \\

      // Finding tomorrow's date
      let today = new Date();
      let tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      // Start of tomorrow
      const startOfTomorrow = new Date(tomorrow.setUTCHours(0, 0, 0, 0)).toISOString()

      // Querying upcoming quizzes (starting date from tomorrow)
      let upcomingQuizzes = await Quiz.find({ startingdate: { $gte: startOfTomorrow } }, {
        medcoin: 0,
        quiztime: 0,
        winner: 0,
        __v: 0
      }).lean()

      upcomingQuizzes.map((e, i) => {
        e.startingdate = moment(e.startingdate).format('YYYY-MM-DD');
        e.endingdate = moment(e.endingdate).format('YYYY-MM-DD');
        e.questions.map((j, k) => {
          console.log('qustions', j)
          delete j._id
        })
      })

      // ********** live quiz *********** \\
      let todayDate = new Date()
      console.log('for testing:: now Date=====================:', todayDate)

      let todayStarting = new Date(todayDate.setUTCHours(0, 0, 0, 0)).toISOString()
      let todayEnding = new Date(todayDate.setUTCHours(23, 59, 59, 999)).toISOString()

      console.log('today Starting:::============:::', todayStarting)
      console.log('today ending:::=================:::', todayEnding)

      let liveQuiz = await Quiz.aggregate([
        {
          $match: {
            $and: [
              { startingdate: { $lte: new Date(todayStarting) } },
              { endingdate: { $gte: new Date(todayEnding) } },
              { isDisabledLiveQuiz: false }
            ],
          },
        },
        {
          $project: {
            name: 1,
            isactive: 1,
            questions: 1,
            startingdate: 1,
            endingdate: 1
          }
        },
      ]);

      if (liveQuiz.length) {
        liveQuiz[0].startingdate = moment(liveQuiz[0].startingdate).format('YYYY-MM-DD');
        liveQuiz[0].endingdate = moment(liveQuiz[0].endingdate).format('YYYY-MM-DD');

        liveQuiz[0].questions.map((j, k) => {
          console.log('qustions', j)
          delete j._id
        })
      }



      // ********* live quiz participants ********** \\
      let liveQuizParticipants = []

      if (liveQuiz.length) {
        liveQuizParticipants = await submittedQuiz.find({ quiz_id: mongoose.Types.ObjectId(liveQuiz[0]._id) }, {
          customer_id: 1,
          corrected_count: 1,
          total_questions: 1,
          time_used: 1,
          date: 1
        }).lean()

        liveQuiz[0].total_participants = liveQuizParticipants.length

        for (const participant of liveQuizParticipants) {
          participant.date = moment(participant.date).format('MMM DD YYYY h:mm a');
          let userDetails = await user.findOne({ _id: participant.customer_id })
          participant.username = userDetails.name
        }

      }



      let response = {
        upcoming_quizzes: upcomingQuizzes,
        live_quiz_participants: liveQuizParticipants
      }

      if (liveQuiz.length) {
        response.live_quiz = liveQuiz[0]
      } else {
        response.live_quiz = []
      }

      res.status(200).json({
        status: true,
        message: 'success',
        data: response
      })
    } catch (error) {
      next(error)
    }
  },
  getLiveQuizParticipants: async (req, res, next) => {
    try {

    } catch (error) {
      next(error)
    }
  },
  getPreviousQuizWinners: async (req, res, next) => {
    try {
      let now = new Date()
      // Get all quizzess
      let previousQuizzes = await Quiz.find({ $or: [{ endingdate: { $lt: new Date(now) } }, { isDisabledLiveQuiz: true }] }, {
        name: 1,
        winner: 1
      }).lean()

      // Looping quizzes for adding winners name and total participants
      for (i = 0; i < previousQuizzes.length; i++) {
        if (previousQuizzes[i].winner) {
          previousQuizzes[i].winner_id = previousQuizzes[i].winner

          // Finding winner
          let winner = await user.findOne({ _id: mongoose.Types.ObjectId(previousQuizzes[i].winner) })
          previousQuizzes[i].winner_name = winner.name

          delete previousQuizzes[i].winner
        } else {
          previousQuizzes[i].winner_id = ''
          previousQuizzes[i].winner_name = ''
        }

        // Finding total participants
        let participantsCount = await submittedQuiz.countDocuments({ quiz_id: previousQuizzes[i]._id })

        previousQuizzes[i].total_participants = participantsCount
      }

      res.status(200).json({
        status: true,
        message: 'success',
        data: {
          previous_quizzes: previousQuizzes
        }
      })
    } catch (error) {
      next(error)
    }
  },
  getQuizParticipants: async (req, res, next) => {
    try {
      let validQuiz = await Quiz.find({ _id: mongoose.Types.ObjectId(req.params.id) })

      if (validQuiz) {
        let participants = await submittedQuiz.find({ quiz_id: mongoose.Types.ObjectId(req.params.id) }, {
          customer_id: 1,
          corrected_count: 1,
          total_questions: 1,
          time_used: 1,
          date: 1
        }).lean()

        participants.map(async (e, i) => {
          e.data = moment(e.date).format('MMM DD YYYY, h:mm a');
          let userDetails = await user.findOne({ _id: e.customer._id })
          e.username = userDetails.name
        })

        res.status(200).json({
          status: false,
          message: 'success',
          data: participants
        })

      } else {
        res.status(200).json({
          status: false,
          message: 'invalid quiz id'
        })
      }

    } catch (error) {
      next(error)
    }
  },
  getWinnersList: async (req, res, next) => {
    try {
      let validQuiz = await Quiz.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {
        name: 1,
        questions: 1,
        winner: 1
      }).lean()

      validQuiz.questions.map((j, k) => {
        console.log('qustions', j)
        delete j._id
      })

      if (validQuiz) {
        // Finding participants of this quiz
        let participants = await submittedQuiz.find({ quiz_id: mongoose.Types.ObjectId(req.params.id) }, {
          customer_id: 1,
          corrected_count: 1,
          total_questions: 1,
          time_used: 1,
          date: 1
        }).lean()

        console.log('apritjoisadfdj:', participants)

        validQuiz.total_participants = participants.length

        for (const participant of participants) {
          participant.date = moment(participant.date).format('MMM DD YYYY, h:mm a');
          let userDetails = await user.findOne({ _id: participant.customer_id })
          console.log('user details:', userDetails)
          participant.username = userDetails.name
          participant.winner = false

          if (participant.customer_id + '' == validQuiz.winner + '') {
            participant.winner = true
          }
        }

        // participants.map(async(e,i) => {
        //   e.date = moment(e.date).format('MMM DD YYYY, h:mm a');
        //   let userDetails = await user.findOne({_id:e.customer_id})
        //   console.log('user details:',userDetails)
        //   e.username = userDetails.name
        // })

        delete validQuiz.winner

        let response = {
          quiz_details: validQuiz,
          participants: participants
        }

        res.status(200).json({
          status: true,
          message: 'success',
          data: response
        })

      } else {
        res.status(200).json({
          status: false,
          message: 'invalid quiz id'
        })
      }
    } catch (error) {
      next(error)
    }
  },
  getLiveQuiz: async (req, res, next) => {
    try {

    } catch (error) {
      next(error)
    }
  },
  declareWinner: async (req, res, next) => {
    try {
      if (req.body.quiz_id && req.body.user_id) {
        let quiz_details = await Quiz.findOne({ _id: req.body.quiz_id })
        let userDetails = await user.findOne({ _id: req.body.user_id })

        if (quiz_details) {
          if (quiz_details.winner) {
            return res.status(200).json({
              status: false,
              message: 'Already winner declared'
            })
          }

          if (userDetails) {
            //increment users med coin count
            await user.updateOne(
              { _id: req.body.user_id },
              {
                $inc: { medCoin: quiz_details.medcoin },
              }
            );

            // reducing admin balance
            await incrementOrDecrementAdminMedCoinBalance("dec", quiz_details.medcoin);

            // finding new admin and user's medcoin balance
            let newUserBalance = await user.findOne({_id: req.body.user_id},{medCoin: 1})
            let newAdminBalance = await MedCoinDetails.findOne()

            //create payment statement
            const statement = new MedCoin({
              type: "quiz",
              medCoinCount: quiz_details.medcoin,
              customerId: req.body.user_id,
              balance: newAdminBalance.availableBalance,
              customerBalance: newUserBalance.medCoin,
            })
            await statement.save();

            Quiz.updateOne({ _id: req.body.quiz_id }, {
              $set: {
                winner: userDetails._id
              }
            }).then((response) => {
              res.status(200).json({
                status: true,
                message: 'winner updated'
              })
            })
          } else {
            res.status(200).json({
              status: false,
              message: 'invalid user id'
            })
          }
        } else {
          res.status(200).json({
            status: false,
            message: 'invalid quiz id'
          })
        }
      } else {
        res.status(200).json({
          status: false,
          message: 'quiz id or user id is missing'
        })
      }
    } catch (error) {
      next(error)
    }
  },

};
