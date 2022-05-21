const mongoose = require("mongoose");
const nutrichartCategory = require("../models/nutrichartCategory");
const nutrichartFood = require("../models/nutrichartFood");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

module.exports = {
  addNutrichartCategory: async (req, res, next) => {
    try {
      let existing = await nutrichartCategory.findOne({
        title: req.body.title,
      });
      if (req.file) {
        if (!existing) {
          let data = {
            title: req.body.title,
            image: `foliofit/${req.file.filename}`,
          };

          let schemaObj = nutrichartCategory(data);
          schemaObj
            .save()
            .then((response) => {
              res.status(200).json({
                status: true,
                data: "Category added successfully",
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
            data: "Existing category",
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
  viewAllNutrichartCatergories: async (req, res, next) => {
    try {
      let result = await nutrichartCategory.find().lean()
      
      result.map((e,i) => {
        e.image = process.env.BASE_URL.concat(e.image)
      })

      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  viewNutrichartCategory: async (req, res, next) => {
    try {
      let result = await nutrichartCategory.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
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
  editNutrichartController: async (req, res, next) => {
    try {
      if (req.body.categoryId) {
        let valid = await nutrichartCategory.findOne({
          _id: mongoose.Types.ObjectId(req.body.categoryId),
        });
        if (valid) {
          let existing = await nutrichartCategory.findOne({_id: {$ne:req.body.categoryId},title: req.body.title})

          if(!existing) {
            let data = req.body;
            if (req.file) {
              data.image = `foliofit/${req.file.filename}`;
              // deleting old image
              let splittedImageRoute = valid.image.split("/");
  
              fs.unlink(
                `./public/images/foliofit/${splittedImageRoute[1]}`,
                function (err) {
                  if (err) throw err;
                }
              );
            }
  
            if(data.image == 'null' || data.image == null) {
              delete data.image
            }
  
            nutrichartCategory
              .updateOne({ _id: mongoose.Types.ObjectId(data.categoryId) }, data)
              .then((response) => {
                if (response.nModified == 1) {
                  let date = new Date();
                  nutrichartCategory
                    .updateOne(
                      { _id: mongoose.Types.ObjectId(req.body.categoryId) },
                      {
                        updatedAt: date,
                      }
                    )
                    .then((response) => {
                      res.status(200).json({
                        status: true,
                        data: "Category updated",
                      });
                    });
                } else {
                  res.status(200).json({
                    status: false,
                    data: "no changes",
                  });
                }
              })
              .catch(async (error) => {
                if (req.file) {
                  await unlinkAsync(req.file.path);
                }
                res.status.json({
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
              data: "Existing category name",
            });
          }
          
        } else {
          if (req.file) {
            await unlinkAsync(req.file.path);
          }
          res.status(200).json({
            status: false,
            data: "invalid category id",
          });
        }
      } else {
        if (req.file) {
          await unlinkAsync(req.file.path);
        }
        res.status(200).json({
          status: false,
          data: "please add category id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deletedNutrichartCategory: async (req, res, next) => {
    try {
      let valid = await nutrichartCategory.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (valid) {
        nutrichartCategory
          .deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) })
          .then((response) => {
            // deleting all nutrichart foods under this category
            nutrichartFood.deleteMany({category: req.params.id}).then((resp) => {
              res.status(200).json({
                status: true,
                data: "Category removed successfully",
              });
            })
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
  addNutrichartFood: async (req, res, next) => {
    try {
        console.log('files', req.files)
      let existing = await nutrichartFood.findOne({
        title: req.body.title,
        category: req.body.category,
      });

      if (!existing) {
        if (req.files.image && req.files.banner) {
          let data = req.body;
          data.image = `foliofit/${req.files.image[0].filename}`;
          data.banner = `foliofit/${req.files.banner[0].filename}`;

          let schemaObj = nutrichartFood(data);

          schemaObj
            .save()
            .then((response) => {
              res.status(200).json({
                status: true,
                data: "Food added successfully",
              });
            })
            .catch(async (error) => {
              await unlinkAsync(req.files.image[0].path);
              await unlinkAsync(req.files.banner[0].path);

              res.status(200).json({
                status: false,
                data: error,
              });
            });
        } else {
          res.status(200).json({
            status: false,
            data: "one of the images are missing",
          });
        }
      } else {
        if (req.files.image) {
          await unlinkAsync(req.files.image[0].path);
        }

        if (req.files.banner) {
          await unlinkAsync(req.files.banner[0].path);
        }

        res.status(200).json({
          status: false,
          data: "Existing food",
        });
      }
    } catch (error) {
      if (req.files.image) {
        await unlinkAsync(req.files.image[0].path);
      }

      if (req.files.banner) {
        await unlinkAsync(req.files.banner[0].path);
      }
      next(error);
    }
  },
  viewAllNutrichartFoods: async (req, res, next) => {
    try {
      let category = await nutrichartCategory.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (category) {
        let result = await nutrichartFood.find({
          category: mongoose.Types.ObjectId(req.params.id),
        });
        
        result.map((e,i) => {
          e.image = process.env.BASE_URL.concat(e.image)
          e.banner = process.env.BASE_URL.concat(e.banner)
        })

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
  viewNutrichartFood: async (req, res, next) => {
    try {
      let result = await nutrichartFood.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });

      result.image = process.env.BASE_URL.concat(result.image)
      result.banner = process.env.BASE_URL.concat(result.banner)

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
  editNutrichartFood: async (req, res, next) => {
    try {
      if (req.body.foodId) {
        let valid = await nutrichartFood.findOne({
          _id: mongoose.Types.ObjectId(req.body.foodId),
        });
        if (valid) {
          let data = req.body;
          if (req.files.image) {
            data.image = `foliofit/${req.files.image[0].filename}`;
            // deleting old image
            let splittedImageRoute = valid.image.split("/");

            fs.unlink(
              `./public/images/foliofit/${splittedImageRoute[1]}`,
              function (err) {
                if (err) throw err;
              }
            );
          }

          if (req.files.banner) {
            data.banner = `foliofit/${req.files.banner[0].filename}`;
            // deleting old image
            let splittedImageRoute = valid.banner.split("/");

            fs.unlink(
              `./public/images/foliofit/${splittedImageRoute[1]}`,
              function (err) {
                if (err) throw err;
              }
            );
          }

          if(data.image == 'null') {
            delete data.image
          }

          if(data.banner == 'null') {
            delete data.banner
          }

          nutrichartFood
            .updateOne({ _id: mongoose.Types.ObjectId(data.foodId) }, data)
            .then((response) => {
              if (response.nModified == 1) {
                let date = new Date();
                nutrichartFood
                  .updateOne(
                    { _id: mongoose.Types.ObjectId(req.body.foodId) },
                    {
                      updatedAt: date,
                    }
                  )
                  .then((response) => {
                    res.status(200).json({
                      status: true,
                      data: "Food item updated",
                    });
                  });
              } else {
                res.status(200).json({
                  status: false,
                  data: "no changes",
                });
              }
            })
            .catch(async (error) => {
              if (req.files.image) {
                await unlinkAsync(req.files.image[0].path);
              }

              if (req.files.banner) {
                await unlinkAsync(req.files.banner[0].path);
              }
              res.status.json({
                status: false,
                data: error,
              });
            });
        } else {
          if (req.files.image) {
            await unlinkAsync(req.files.image[0].path);
          }

          if (req.files.banner) {
            await unlinkAsync(req.files.banner[0].path);
          }
          res.status(200).json({
            status: false,
            data: "invalid food id",
          });
        }
      } else {
        if (req.files.image) {
          await unlinkAsync(req.files.image[0].path);
        }

        if (req.files.banner) {
          await unlinkAsync(req.files.banner[0].path);
        }
        res.status(200).json({
          status: false,
          data: "please add food id",
        });
      }
    } catch (error) {
      if (req.files.image) {
        await unlinkAsync(req.files.image[0].path);
      }

      if (req.files.banner) {
        await unlinkAsync(req.files.banner[0].path);
      }
      next(error);
    }
  },
  deleteNutrichartFood: async (req, res, next) => {
    try {
      let valid = await nutrichartFood.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (valid) {
        nutrichartFood
          .deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) })
          .then((response) => {
            res.status(200).json({
              status: false,
              data: "Removed successfully",
            });
          });
      } else {
        res.status(200).json({
          status: false,
          data: "invalid food id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
