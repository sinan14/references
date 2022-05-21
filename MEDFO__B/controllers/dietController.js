const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const mv = require("mv");
var multiparty = require("multiparty");
let DietPlan = require("../models/dietPlan");
let DietDay = require("../models/dietDay");
const path = require("path");

var form = new multiparty.Form();

module.exports = {
  addDietPlan: async (req, res, next) => {
    try {
      console.log("diews", req.body);
      console.log("fileaa::", req.file);

      if (req.file) {
        if (req.body.name) {
          let existing = await DietPlan.findOne({ name: req.body.name });
          if (!existing) {
            let data = req.body;
            data.image = `foliofit/${req.file.filename}`;

            let schemaObj = new DietPlan(data);
            schemaObj
              .save()
              .then((response) => {
                res.status(200).json({
                  status: true,
                  data: "Plan added successfully",
                });
              })
              .catch(async (error) => {
                await unlinkAsync(req.file.path);
                res.status(200).json({
                  status: false,
                  data: error,
                });
              });
          } else {
            await unlinkAsync(req.file.path);
            res.status(200).json({
              status: false,
              data: "Existing plan",
            });
          }
        } else {
          await unlinkAsync(req.file.path);
          res.status(200).json({
            status: false,
            data: "Please enter name",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          data: "Please upload image",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  viewAllDietPlans: async (req, res, next) => {
    try {
      let result = await DietPlan.find().sort({"_id": -1})
      result.map((e, i) => {
        e.image = process.env.BASE_URL.concat(e.image);
      });
      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  viewDietPlan: async (req, res, next) => {
    try {
      let dietPlan = await DietPlan.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (dietPlan) {
        res.status(200).json({
          status: true,
          data: dietPlan,
        });
      } else {
        res.status(200).json({
          status: false,
          data: "invalid id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  viewDietPlansNameAndId: async (req, res, next) => {
    try {
      let dietPlans = await DietPlan.find({ isDisabled: false }, { name: 1 });

      res.status(200).json({
        status: true,
        message: "success",
        data: dietPlans,
      });
    } catch (error) {
      next(error);
    }
  },
  editDietPlan: async (req, res, next) => {
    try {
      if (req.body.dietPlanId) {
        let dietPlan = await DietPlan.findOne({
          _id: mongoose.Types.ObjectId(req.body.dietPlanId),
        });
        if (dietPlan) {
          let data = req.body;
          let existing = await DietPlan.findOne({_id: {$ne:data.dietPlanId},name: data.name})

          if(!existing) {
            if (data.image == "null" || data.image == null) {
              delete data.image;
            }
  
            if (req.file) {
              data.image = `foliofit/${req.file.filename}`;
              // deleting old image
              let splittedImageRoute = dietPlan.image.split("/");
  
              fs.unlink(
                `./public/images/foliofit/${splittedImageRoute[1]}`,
                function (err) {
                  if (err) throw err;
                }
              );
            }
  
            DietPlan.updateOne(
              { _id: mongoose.Types.ObjectId(data.dietPlanId) },
              data
            )
              .then((response) => {
                if (response.nModified == 1) {
                  let date = new Date();
                  data.updatedAt = date;
                  DietPlan.updateOne(
                    { _id: mongoose.Types.ObjectId(data.dietPlanId) },
                    { updatedAt: date }
                  ).then((response) => {
                    res.status(200).json({
                      status: true,
                      data: "Updated",
                    });
                  });
                } else {
                  res.status(200).json({
                    status: true,
                    data: "Updated",
                  });
                }
              })
              .catch(async (error) => {
                if (req.file) {
                  await unlinkAsync(req.file.path);
                }
                res.status(200).json({
                  status: false,
                  data: error,
                });
              });
          } else {
            if (req.file) {
              await unlinkAsync(req.file.path);
            }
            
            res.status(200).json({
              status: false,
              data: "Existing plan",
            });
          }
          
        } else {
          if (req.file) {
            await unlinkAsync(req.file.path);
          }
          res.status(200).json({
            status: false,
            data: "Invalid diet plan id",
          });
        }
      } else {
        if (req.file) {
          await unlinkAsync(req.file.path);
        }
        res.status(200).json({
          status: false,
          data: "diet plan id missing",
        });
      }
    } catch (error) {
      if (req.file) {
        await unlinkAsync(req.file.path);
      }
      next(error);
    }
  },
  deleteDietPlan: async (req, res, next) => {
    try {
      let dietPlan = await DietPlan.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (dietPlan) {
        DietPlan.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) })
          .then((response) => {
            let splittedImageRoute = dietPlan.image.split("/");
            fs.unlink(
              `./public/images/foliofit/${splittedImageRoute[1]}`,
              function (err) {
                if (err) throw err;
              }
            );

            res.status(200).json({
              status: true,
              data: "Diet plan removed successfully",
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
          data: "invalid diet plan id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  uploadFoliofitImage: async (req, res, next) => {
    try {
      if (req.file) {
        let image = `${process.env.BASE_URL}foliofit/${req.file.filename}`;
        // let image = `http://143.110.240.107:8000/foliofit/${req.file.filename}`;
        res.status(200).json({
          status: true,
          message: "uploaded successfully",
          data: {
            image_path: image,
          },
        });
      } else {
        res.status(422).json({
          status: false,
          message: "Please upload image",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  addDay: async (req, res, next) => {
    try {
      console.log('day incoming:::_____',req.body)
      if (req.body.dietPlan) {
        let validDietPlan = await DietPlan.findOne({
          _id: mongoose.Types.ObjectId(req.body.dietPlan),
        });
        if (validDietPlan) {
          let existingDay = await DietDay.findOne({
            $or:[
            {dietPlan: req.body.dietPlan,
            day: req.body.day},
            {dietPlan: req.body.dietPlan,
              title: req.body.title},
            ]
          });
          let baseurl = process.env.BASE_URL

          if (!existingDay) {
            if(req.body.morning) {
              for (i = 0; i < req.body.morning.length; i++) {
                req.body.morning[i] = JSON.parse(req.body.morning[i]);
                console.log('morning object:::_____',req.body.morning[i])
                req.body.morning[i].image = req.body.morning[i].image.replace(baseurl, "");
              }
            } 

            if(req.body.afterNoon) {
              for (i = 0; i < req.body.afterNoon.length; i++) {
                req.body.afterNoon[i] = JSON.parse(req.body.afterNoon[i]);
                console.log('afternoon object:::_____',req.body.afterNoon[i])
                req.body.afterNoon[i].image = req.body.afterNoon[i].image.replace(baseurl, "");
              }
            }

            if(req.body.evening) {
              for (i = 0; i < req.body.evening.length; i++) {
                req.body.evening[i] = JSON.parse(req.body.evening[i]);
                console.log('evening object:::_____',req.body.evening[i])
                req.body.evening[i].image = req.body.evening[i].image.replace(baseurl, "");
              }
            }
            
            if(req.body.night) {
              for (i = 0; i < req.body.night.length; i++) {
                req.body.night[i] = JSON.parse(req.body.night[i]);
                console.log('night object:::_____',req.body.night[i])
                req.body.night[i].image = req.body.night[i].image.replace(baseurl, "");
              }
            }
            
            let titleImage = ''

            if(req.file) {
              titleImage = `foliofit/${req.file.filename}`;
            } else {
              return res.status(422).json({
                status: false,
                message: 'Title image missing'
              })
            }

            let data = {
              dietPlan: req.body.dietPlan,
              day: req.body.day,
              title: req.body.title,
              image: titleImage,
              morning: req.body.morning,
              afterNoon: req.body.afterNoon,
              evening: req.body.evening,
              night: req.body.night,
            };

            let schemaObj = new DietDay(data);
            schemaObj
              .save()
              .then((response) => {
                return res.status(200).json({
                  status: true,
                  data: "New day added",
                });
              })
              .catch(async (error) => {
                res.status(200).json({
                  status: false,
                  data: error + "",
                });
              });
          } else {
            res.status(200).json({
              status: false,
              data: "Existing day",
            });
          }
        } else {
          res.status(200).json({
            status: false,
            data: "invalid diet plan id",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          data: "dietPlanId missing",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  viewAllDays: async (req, res, next) => {
    try {
      let result = await DietDay.find();
      console.log("resutl", result);
      res.status(200).json({
        status: false,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  viewDaysByDiet: async (req, res, next) => {
    try {
      let valid = await DietPlan.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });

      if (valid) {
        let result = await DietDay.find({ dietPlan: req.params.id }).lean();

        for (i = 0; i < result.length; i++) {
          result[i].image = process.env.BASE_URL.concat(result[i].image);

          if(result[i].morning) {
            for (j = 0; j < result[i].morning.length; j++) {
              result[i].morning[j].image = process.env.BASE_URL.concat(
                result[i].morning[j].image
              );
            }
          }
          
          if(result[i].afterNoon) {
            for (j = 0; j < result[i].afterNoon.length; j++) {
              result[i].afterNoon[j].image = process.env.BASE_URL.concat(
                result[i].afterNoon[j].image
              );
            }
          }
          
          if(result[i].evening) {
            for (j = 0; j < result[i].evening.length; j++) {
              result[i].evening[j].image = process.env.BASE_URL.concat(
                result[i].evening[j].image
              );
            }
          }

          if(result[i].night) {
            for (j = 0; j < result[i].night.length; j++) {
              result[i].night[j].image = process.env.BASE_URL.concat(
                result[i].night[j].image
              );
            }
          }
          
        }

        console.log("diet days=", result);
        res.status(200).json({
          status: false,
          data: result,
        });
      } else {
        res.status(200).json({
          status: false,
          data: "invalid diet plan id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  viewDay: async (req, res, next) => {
    try {
      let result = await DietDay.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      }).lean()
      result.image = process.env.BASE_URL.concat(result.image)
      result.morning.map((e,i) => {
        e.image = process.env.BASE_URL.concat(e.image)
      })

      result.afterNoon.map((e,i) => {
        e.image = process.env.BASE_URL.concat(e.image)
      })

      result.evening.map((e,i) => {
        e.image = process.env.BASE_URL.concat(e.image)
      })

      result.night.map((e,i) => {
        e.image = process.env.BASE_URL.concat(e.image)
      })
      if (result) {
        res.status(200).json({
          status: true,
          data: result,
        });
      } else {
        res.status(200).json({
          status: false,
          data: "invalid day id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  editDay: async (req, res, next) => {
    try {
      console.log('edit incoming_________________file_______:',req.file)
      console.log('edit incoming_________________body_______:',req.body)
      if (req.body.dayId) {
        let validDietDay = await DietDay.findOne({
          _id: mongoose.Types.ObjectId(req.body.dayId),
        });
        if (validDietDay) {
          let existingDay = await DietDay.findOne({$or:[
            {_id: { $ne: mongoose.Types.ObjectId(req.body.dayId) },
            dietPlan: req.body.dietPlan,
            day: req.body.day
            },
            {_id: { $ne: mongoose.Types.ObjectId(req.body.dayId) },
            dietPlan: req.body.dietPlan,
            title: req.body.title
            }
          ]
          });

          let baseurl = process.env.BASE_URL

          if (!existingDay) {
            if(req.body.morning) {
              for (i = 0; i < req.body.morning.length; i++) {
                req.body.morning[i] = JSON.parse(req.body.morning[i]);
                if(req.body.morning[i].image) {
                  req.body.morning[i].image = req.body.morning[i].image.replace(baseurl, "");
                } else {
                  return res.status(422).json({
                    status: false,
                    message: 'A morning image is missing'
                  })               
                }
              }
            } else {
              req.body.morning = []
            }
            
            if(req.body.afterNoon) {
              for (i = 0; i < req.body.afterNoon.length; i++) {
                req.body.afterNoon[i] = JSON.parse(req.body.afterNoon[i]);
                if(req.body.afterNoon[i].image) {
                  req.body.afterNoon[i].image = req.body.afterNoon[i].image.replace(baseurl, "");
                } else {
                  return res.status(422).json({
                    status: false,
                    message: 'A afterNoon image is missing'
                  })               
                }
              }
            } else {
              req.body.afterNoon = []
            }

            if(req.body.evening) {
              for (i = 0; i < req.body.evening.length; i++) {
                req.body.evening[i] = JSON.parse(req.body.evening[i]);
                if(req.body.evening[i].image) {
                  req.body.evening[i].image = req.body.evening[i].image.replace(baseurl, "");
                } else {
                  return res.status(422).json({
                    status: false,
                    message: 'An evening image is missing'
                  })               
                }
              }
            } else {
              req.body.evening = []
            }
            
            if(req.body.night) {
              for (i = 0; i < req.body.night.length; i++) {
                req.body.night[i] = JSON.parse(req.body.night[i]);
                if(req.body.night[i].image) {
                  req.body.night[i].image = req.body.night[i].image.replace(baseurl, "");
                } else {
                  return res.status(422).json({
                    status: false,
                    message: 'A night image is missing'
                  })               
                }
              }
            } else {
              req.body.night = []
            }
            
            let data = {
              dietPlan: req.body.dietPlan,
              day: req.body.day,
              title: req.body.title,
              morning: req.body.morning,
              afterNoon: req.body.afterNoon,
              evening: req.body.evening,
              night: req.body.night,
            };

            if(req.file){
              data.image = `foliofit/${req.file.filename}`;
              // deleting old image
              let splittedImageRoute = validDietDay.image.split('/')
    
              fs.unlink(`./public/images/foliofit/${splittedImageRoute[1]}`, function (err) {
                if (err) throw err;
              });
            }

            DietDay.updateOne(
              { _id: mongoose.Types.ObjectId(req.body.dayId) },
              data
            )
              .then((response) => {
                res.status(200).json({
                  status: true,
                  data: "updated",
                });
              })
              .catch((error) => {
                res.status(200).json({
                  status: false,
                  data: error + "",
                });
              });
          } else {
            res.status(200).json({
              status: false,
              message: "Existing Day",
            });
          }
        } else {
          res.status(200).json({
            status: false,
            data: "invalid day id",
          });
        }
      } else {
        res.status(422).json({
          status: false,
          data: "day id missing",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteDay: async (req, res, next) => {
    try {
      let valid = await DietDay.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (valid) {
        DietDay.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) })
          .then((response) => {
            res.status(200).json({
              status: true,
              data: "day removed successfully",
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
          data: "invalid day id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getDietPlansUser: async (req, res, next) => {
    try {
      let dietplans = await DietPlan.aggregate([
        { $match: { isDisabled: false } },
        {
          $project: {
            title: "$name",
            image: { $concat: [process.env.BASE_URL, "$image"] },
          },
        },
      ]);

      res.status(200).json({
        error: false,
        message: "success",
        data: {
          diet_plans: dietplans,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getDietDays: async (req, res, next) => {
    try {
      if (req.body.dietPlanId) {
        let valid = await DietPlan.findOne({
          _id: mongoose.Types.ObjectId(req.body.dietPlanId),
        });

        if (valid) {
          let result = await DietDay.aggregate([
            { $match: { dietPlan: mongoose.Types.ObjectId(req.body.dietPlanId) } },
            {
              $project: {
                title: 1,
                day: 1,
                image: { $concat: [process.env.BASE_URL, "$image"] },
              },
            },
          ]);

          console.log('day :',result)

          let staticDays = [
            {
              _id: "6144284e26e93e5ec054ea6f",
              title: "Fruits day",
              day: 1,
              image:
                "http://143.110.240.107:8000/foliofit/image_1631856744571.png",
            },
            {
              _id: "6144284e26e93e5ec054ea6f",
              title: "Vegetables day",
              day: 2,
              image:
                "http://143.110.240.107:8000/foliofit/image_1631856661137.png",
            },
            {
              _id: "6144284e26e93e5ec054ea6f",
              title: "Milk day",
              day: 3,
              image:
                "http://143.110.240.107:8000/foliofit/image_1631856687676.png",
            },
            {
              _id: "6144284e26e93e5ec054ea6f",
              title: "Test day",
              day: 4,
              image:
                "http://143.110.240.107:8000/foliofit/image_1631856718908.png",
            },
          ];

          res.status(200).json({
            error: false,
            message: "success",
            data: {
              diet_plan_title: valid.name,
              diet_days: result,
            },
          });
        } else {
          res.status(200).json({
            error: true,
            message: "invalid diet plan id",
            data: {},
          });
        }
      } else {
        res.status(200).json({
          error: true,
          message: "diet plan id missing",
          data: {},
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getDietDayDetail: async (req, res, next) => {
    try {
      if (req.body.dietDayId) {
        console.log('day id',req.body.dietDayId)
        let valid = await DietDay.findOne({
          _id: mongoose.Types.ObjectId(req.body.dietDayId),
        });

        // let staticDayDetails = {
        //   title: "Fruits test day",
        //   day: 1,
        //   image: "http://143.110.240.107:8000/foliofit/image_1631856687676.png",
        //   morning: [
        //     {
        //       describeMeal: "Breakfast (8-9 am)",
        //       subText: "A regular size of orange with milk",
        //       image:
        //         "http://143.110.240.107:8000/foliofit/image_1631856661137.png",
        //     },
        //     {
        //       describeMeal: "Snacks (10-11 am)",
        //       subText: "A regular size of apple with milk",
        //       image:
        //         "http://143.110.240.107:8000/foliofit/image_1631856718908.png",
        //     },
        //   ],
        //   afterNoon: [
        //     {
        //       describeMeal: "Pre Lunch (8-9 am)",
        //       subText: "A regular size of orange with milk",
        //       image:
        //         "http://143.110.240.107:8000/foliofit/image_1631856661137.png",
        //     },
        //     {
        //       describeMeal: "Lunch (10-11 am)",
        //       subText: "A regular size of apple with milk",
        //       image:
        //         "http://143.110.240.107:8000/foliofit/image_1631856718908.png",
        //     },
        //     {
        //       describeMeal: "Lunch (10-11 am)",
        //       subText: "A regular size of apple with milk",
        //       image:
        //         "http://143.110.240.107:8000/foliofit/image_1631856718908.png",
        //     },
        //   ],
        //   evening: [
        //     {
        //       describeMeal: "Pre Lunch (8-9 am)",
        //       subText: "A regular size of orange with milk",
        //       image:
        //         "http://143.110.240.107:8000/foliofit/image_1631856661137.png",
        //     },
        //     {
        //       describeMeal: "Lunch (10-11 am)",
        //       subText: "A regular size of apple with milk",
        //       image:
        //         "http://143.110.240.107:8000/foliofit/image_1631856718908.png",
        //     },
        //     {
        //       describeMeal: "Lunch (10-11 am)",
        //       subText: "A regular size of apple with milk",
        //       image:
        //         "http://143.110.240.107:8000/foliofit/image_1631856718908.png",
        //     },
        //   ],
        //   night: [
        //     {
        //       describeMeal: "Dinner (1:30-2 pm)",
        //       subText: "A regular size of grapes with milk",
        //       image:
        //         "http://143.110.240.107:8000/foliofit/image_1631856661137.png",
        //     },
        //   ],
        // };

        // res.status(200).json({
        //   error: false,
        //   message: "success",
        //   data: {
        //     diet_day: staticDayDetails,
        //   },
        // });

        if(valid) {
          let result = await DietDay.aggregate([
            {$match: { _id: mongoose.Types.ObjectId(req.body.dietDayId) }},
            {$project: {
              title: 1,
              day: 1,
              image: { $concat: [ process.env.BASE_URL, "$image" ] },
              morning: 1,
              afterNoon: 1,
              evening: 1,
              night: 1
            }}
          ]);

          if(result.length) {
            for(i=0; i<result[0].morning.length; i++) {
              result[0].morning[i].image = process.env.BASE_URL.concat(result[0].morning[i].image)
            }
  
            for(i=0; i<result[0].afterNoon.length; i++) {
              result[0].afterNoon[i].image = process.env.BASE_URL.concat(result[0].afterNoon[i].image)
            }
  
            for(i=0; i<result[0].evening.length; i++) {
              result[0].evening[i].image = process.env.BASE_URL.concat(result[0].evening[i].image)
            }
  
            for(i=0; i<result[0].night.length; i++) {
              result[0].night[i].image = process.env.BASE_URL.concat(result[0].night[i].image)
            }

            result = result[0]
          }          

          console.log("diet days=", result);
          res.status(200).json({
            error: false,
            message: 'success',
            data: {
              diet_day: result
            },
          });
        } else {
          res.status(200).json({
            error: true,
            message: 'invalid diet day id',
            data: {}
          })
        }
      } else {
        res.status(200).json({
          error: true,
          message: "diet day id missing",
          data: {},
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
