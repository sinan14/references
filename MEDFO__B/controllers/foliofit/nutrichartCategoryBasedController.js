const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const NutrichartCategoryBased = require("../../models/foliofit/nutrichartCategoryBased");

const imgPath = process.env.BASE_URL;

module.exports = {
  addNutrichartCategoryBased: async (req, res, next) => {
    try {
      let data = req.body;
      let existingCategory = await NutrichartCategoryBased.findOne({
        title: data.title,
      });
      if (!existingCategory) {
        if (req.file) {
          data.image = `foliofit/${req.file.filename}`;
          data.createdBy = req.user._id;
          let schemaObj = new NutrichartCategoryBased(data);
          schemaObj
            .save()
            .then((response) => {
              res.status(200).json({
                status: true,
                data: "Category added successfully",
              });
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
          res.status(200).json({
            status: false,
            data: "Please upload image",
          });
        }
      } else {
        if (req.file) {
          await unlinkAsync(req.file.path);
        }
        res.status(200).json({
          status: false,
          data: "Existing category",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  getAllNutrichartCategoryBased: async (req, res, next) => {
    try {
      let result = await NutrichartCategoryBased.find(
        { isDisabled: false },
        {
          title: 1,
          image: { $concat: [imgPath, "$image"] },
        }
      );
      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  editNutrichartCategoryBased: async (req, res, next) => {
    try {
      let data = req.body;
      if (data.categoryId) {
        let category = await NutrichartCategoryBased.findOne({
          _id: mongoose.Types.ObjectId(data.categoryId),
        });

        if (category) {
          let existingCategory = await NutrichartCategoryBased.findOne({
            _id: { $ne: data.categoryId },
            title: data.title,
          });

          if (!existingCategory) {
            data.image = category.image;
            if (req.file) {
              data.image = `foliofit/${req.file.filename}`;
              // deleting old image
              let splittedImageRoute = category.image.split("/");
              console.log("splitted::", splittedImageRoute);
              let path = `./public/images/foliofit/${splittedImageRoute[1]}`;
              if (fs.existsSync(path)) {
                // Do something
                fs.unlink(path, function (err) {
                  if (err) throw err;
                  console.log("old image deleted!");
                });
              }
            }
            data.updatedAt = new Date();
            data.updatedBy = req.user._id;
            NutrichartCategoryBased.updateOne(
              { _id: mongoose.Types.ObjectId(data.categoryId) },
              data
            )
              .then((response) => {
                if (response.nModified == 1) {
                  res.status(200).json({
                    status: true,
                    data: "Updated",
                  });
                } else {
                  res.status(200).json({
                    status: false,
                    data: "Not updated",
                  });
                }
              })
              .catch((error) => {
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
              data: "Existing category name",
            });
          }
          
        } else {
          if (req.file) {
            await unlinkAsync(req.file.path);
          }
          res.status(200).json({
            status: false,
            data: "invalid categoryId",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          data: "Please enter categoryId",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  deleteNutrichartCategoryBased: async (req, res, next) => {
    try {
      let category = await NutrichartCategoryBased.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });

      if (category) {
        NutrichartCategoryBased.deleteOne({ _id: req.params.id })
          .then((response) => {
            let splittedImageRoute = category.image.split("/");

            let path = `./public/images/foliofit/${splittedImageRoute[1]}`;
            if (fs.existsSync(path)) {
              fs.unlink(path, function (err) {
                if (err) throw err;
                console.log("old image deleted!");
              });
            }
            res.status(200).json({
              status: true,
              data: "Category deleted",
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
          data: "invalid categoryId",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  getNutrichartCategoryBasedById: async (req, res, next) => {
    try {
      let result = await NutrichartCategoryBased.findOne(
        {
          _id: mongoose.Types.ObjectId(req.params.id),
        },
        {
          title: 1,
          image: { $concat: [imgPath, "$image"] },
        }
      );

      if (!result) {
        res.status(200).json({
          status: false,
          data: "Invalid Id",
        });
      } else {
        res.status(200).json({
          status: true,
          data: result,
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
