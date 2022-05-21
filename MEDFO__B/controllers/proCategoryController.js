const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const proCategory = require("../models/proCategory");
const product = require("../models/Product");

const { isArray } = require("util");

module.exports = {
    //list medfeed Inventory

    getProCategory: async (req, res, next) => {
        try {
            let Categories = await proCategory.find({ isDisabled: false }).lean();

            for (i = 0; i < Categories.length; i++) {
                Categories[i].image = process.env.BASE_URL.concat(Categories[i].image);
            }
            res.status(200).json({
                status: true,
                message: "success",
                data: Categories,
            });
        } catch (error) {
            next(error);
        }
    },
    addProCategory: async (req, res, next) => {
        try {
            let existing = await proCategory.findOne({
                title: req.body.title,
            });
            if (req.file) {
                if (!existing) {
                    let data = {
                        title: req.body.title,
                        image: `foliofit/${req.file.filename}`,
                    };

                    let schemaObj = proCategory(data);
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
    viewProCategory: async (req, res, next) => {
        try {
            let result = await proCategory.findOne({
                _id: mongoose.Types.ObjectId(req.params.id),
            });
            if (result) {
                results.image = await process.env.BASE_URL.concat(results.image);
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
    editProCategory: async (req, res, next) => {
        try {
            if (req.body.categoryId) {
                let valid = await proCategory.findOne({
                    _id: mongoose.Types.ObjectId(req.body.categoryId),
                });
                if (valid) {
                    let data = req.body;
                    if (req.file) {
                        data.image = `foliofit/${req.file.filename}`;
                        // deleting old image
                        let splittedImageRoute = valid.image.split("/");

                        fs.unlink(`./public/images/foliofit/${splittedImageRoute[1]}`, function (err) {
                            if (err) throw err;
                        });
                    }

                    proCategory
                        .updateOne({ _id: mongoose.Types.ObjectId(data.categoryId) }, data)
                        .then((response) => {
                            if (response.nModified == 1) {
                                let date = new Date();
                                proCategory
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
    deleteProCategory: async (req, res, next) => {
        try {
            let valid = await proCategory.findOne({
                _id: mongoose.Types.ObjectId(req.params.id),
            });
            if (valid) {
                proCategory.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then((response) => {
                    res.status(200).json({
                        status: true,
                        data: "Category removed successfully",
                    });
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
    //product
    getProduct: async (req, res, next) => {
        try {
            let products = await product.find({ isDisabled: false }).lean();

            for (i = 0; i < products.length; i++) {
                products[i].image = process.env.BASE_URL.concat(products[i].image);
            }
            res.status(200).json({
                status: true,
                message: "success",
                data: products,
            });
        } catch (error) {
            next(error);
        }
    },
    addProduct: async (req, res, next) => {
        try {
            let existing = await product.findOne({
                title: req.body.title,
            });
            if (req.file) {
                if (!existing) {
                    let data = {
                        title: req.body.title,
                        categoryId: req.body.categoryId,
                        image: `foliofit/${req.file.filename}`,
                    };

                    let schemaObj = product(data);
                    schemaObj
                        .save()
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "product added successfully",
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
                        data: "Existing product",
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
    viewProduct: async (req, res, next) => {
        try {
            let results = await product.findOne({
                _id: mongoose.Types.ObjectId(req.params.id),
            });

            if (results) {
                results.image = await process.env.BASE_URL.concat(results.image);

                res.status(200).json({
                    status: true,
                    data: results,
                });
            } else {
                res.status(200).json({
                    status: false,
                    data: "invalid product id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    editProduct: async (req, res, next) => {
        try {
            if (req.body._id) {
                let valid = await product.findOne({
                    _id: mongoose.Types.ObjectId(req.body._id),
                });
                if (valid) {
                    let data = req.body;
                    if (req.file) {
                        data.image = `foliofit/${req.file.filename}`;
                        // deleting old image
                        let splittedImageRoute = valid.image.split("/");

                        fs.unlink(`./public/images/foliofit/${splittedImageRoute[1]}`, function (err) {
                            if (err) throw err;
                        });
                    }

                    product
                        .updateOne({ _id: mongoose.Types.ObjectId(data._id) }, data)
                        .then((response) => {
                            if (response.nModified == 1) {
                                let date = new Date();
                                product
                                    .updateOne(
                                        { _id: mongoose.Types.ObjectId(req.body._id) },
                                        {
                                            updatedAt: date,
                                        }
                                    )
                                    .then((response) => {
                                        res.status(200).json({
                                            status: true,
                                            data: "product updated",
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
                        data: "invalid product id",
                    });
                }
            } else {
                if (req.file) {
                    await unlinkAsync(req.file.path);
                }
                res.status(200).json({
                    status: false,
                    data: "please add product id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteProduct: async (req, res, next) => {
        try {
            let valid = await product.findOne({
                _id: mongoose.Types.ObjectId(req.params.id),
            });
            if (valid) {
                product.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then((response) => {
                    res.status(200).json({
                        status: true,
                        data: "product removed successfully",
                    });
                });
            } else {
                res.status(200).json({
                    status: false,
                    data: "invalid product id",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    getProductByCategoryId: async (req, res, next) => {
      try {
          let products = await product.find({ isDisabled: false,categoryId : req.params.categoryId }).lean();
          for (i = 0; i < products.length; i++) {
              products[i].image = process.env.BASE_URL.concat(products[i].image);
          }
          res.status(200).json({
              status: true,
              message: "success",
              data: products,
          });
      } catch (error) {
          next(error);
      }
  },
};
