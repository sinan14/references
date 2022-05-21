const mongoose = require("mongoose");
const axios = require("axios");

const Inventory = require("../models/inventory");
const MasterCategory = require("../models/mastersettings/category");
const MasterSubCategoryHealthcare = require("../models/mastersettings/subCategoryHealthcare");
const MasterSubSubCategoryHealthcare = require("../models/mastersettings/subSubCategory");
const MasterBrand = require("../models/mastersettings/brand");

const MasterSubCategoryMedicine = require("../models/mastersettings/subCategoryMedicine");

const storeProducts = require("../models/store_products");
const fs = require("fs");
const { isArray } = require("util");

let Vimeo = require("vimeo").Vimeo;
const dotenv = require("dotenv");
const MasterUom = require("../models/mastersettings/uom");
const MasterUomValue = require("../models/mastersettings/uomValue");
const productIdCount = require("../models/productIdCount");

const InventoryFavourite = require("../models/inventoryFavourites");
const mostSearchProduct = require("../models/mostSearchedProducts");
const MasterSubSubCategory = require("../models/mastersettings/subSubCategory");
const MostPurchasedProduct = require("../models/most/mostPurchasedProducts");

const mostFavouriteProduct = require("../models/inventoryMostFavourite");

dotenv.config({
  path: "../config.env",
});
let client = new Vimeo(
  process.env.VIMEO_CLIENT_ID,
  process.env.VIMEO_CLIENT_SECRET,
  process.env.VIMEO_ACCESS_TOKEN
);

var imageError = "false";
var filType = "";

function checkfileType(filType, fileInfo) {
  //   if (fileInfo) {
  //         dimensions = sizeOf(fileInfo.path);
  //         console.log('dimensions',dimensions);
  //   }

  if (filType == "video") {
    /*Flash	.flv	video/x-flv
MPEG-4	.mp4	video/mp4
iPhone Index	.m3u8	application/x-mpegURL
iPhone Segment	.ts	video/MP2T
3GP Mobile	.3gp	video/3gpp
QuickTime	.mov	video/quicktime
A/V Interleave	.avi	video/x-msvideo
Windows Media	.wmv	video/x-ms-wmv
*/

    if (
      fileInfo.mimetype === "video/mp4" ||
      fileInfo.mimetype === "video/avi" ||
      fileInfo.mimetype === "video/x-flv" ||
      fileInfo.mimetype === "video/x-ms-wmv" ||
      fileInfo.mimetype === "video/3gpp"
    ) {
    }
  } else if (filType == "thumbnail") {
    //image/png
    if (
      fileInfo.mimetype != "image/png" ||
      fileInfo.mimetype != "image/jpeg" ||
      fileInfo.mimetype != "image/svg+xml" ||
      fileInfo.mimetype != "image/gif"
    ) {
      // imageError+="Please upload .png"
      dimensions = sizeOf(fileInfo.path);
      console.log("dimensions", dimensions);
      // if (dimensions.width != 1076 && dimensions.height != 444) {
      //     imageError += "please upload images with size(1076x444)";
      // }
    }
  } else {
    imageError += "file type is not supported check with another file type";
  }
}

module.exports = {
  // products listing for dropdowns
  dropdownList: async (req, res, next) => {
    try {
      let result = await Inventory.find({}, { name: 1 });

      res.status(200).json({
        status: true,
        message: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  dropdownListing: async (req, res, next) => {
    try {
      let result = await Inventory.find({ type: req.params.type }, { name: 1 });

      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  //list medfeed Inventory
  listProducts: async (req, res, next) => {
    try {
      if (req.body.type) {
        if (req.body.type == "healthcare" || req.body.type == "medicine") {
          let result = await Inventory.find(
            { type: req.body.type },
            {
              productId: 1,
              name: 1,
              categories: 1,
              isDisabled: 1,
              pricing: 1,
            }
          )
            .populate({ path: "brand", select: ["title"] })
            .lean();

          if (!req.body.page) {
            return res.status(200).json({
              status: false,
              message: "page missing",
            });
          }

          let pageSize = 10;
          let pageNo = req.body.page;

          var aggregateQuery = Inventory.aggregate();

          aggregateQuery.match({ type: req.body.type });

          aggregateQuery.project({
            _id: 1,
            productId: 1,
            name: 1,
            categories: 1,
            brand: 1,
            isDisabled: 1,
            pricing: 1,
          });

          aggregateQuery.sort({ _id: -1 });

          const customLabels = {
            totalDocs: "TotalRecords",
            docs: "products",
            limit: "PageSize",
            page: "CurrentPage",
          };
          const aggregatePaginateOptions = {
            page: pageNo,
            limit: pageSize,
            customLabels: customLabels,
          };
          let response = await Inventory.aggregatePaginate(
            aggregateQuery,
            aggregatePaginateOptions
          );

          console.log("paginated____:", response);

          for (let item of response.products) {
            let brand = await MasterBrand.findOne(
              { _id: item.brand },
              { title: 1 }
            );

            if (brand) {
              item.brand = brand.title;
            } else {
              item.brand = "";
            }

            item.image = item.pricing[0].image[0];
            if (!item.image.includes(process.env.BASE_URL)) {
              item.image = process.env.BASE_URL.concat(item.image);
            }
            delete item.pricing;

            let categories = [];
            if (req.body.type == "medicine") {
              for (let i of item.categories) {
                let subCategory = await MasterSubCategoryMedicine.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }
              }
              item.categories = categories;
            } else {
              for (let i of item.categories) {
                let subCategory = await MasterSubCategoryHealthcare.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }

                let subSubCategory =
                  await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                if (subSubCategory) {
                  categories.push(subSubCategory.title);
                }
              }
            }

            item.categories = categories;
          }

          delete response.prevPage;
          delete response.nextPage;

          res.status(200).json({
            status: true,
            data: response,
          });
        } else {
          res.status(422).json({
            status: false,
            message: "Type missing",
          });
        }
      } else {
        res.status(422).json({
          status: false,
          message: "Invalid type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  listProductsByCategory: async (req, res, next) => {
    try {
      if (req.body.type) {
        if (req.body.type == "medicine" || req.body.type == "healthcare") {
          if (!req.body.category) {
            return res.status(422).json({
              status: false,
              message: "category missing",
            });
          }
          console.log("bodyyyyy::::________", req.body);

          let result = await Inventory.find(
            { categories: req.body.category, type: req.body.type },
            {
              productId: 1,
              name: 1,
              categories: 1,
              brand: 1,
              isDisabled: 1,
              pricing: 1,
            }
          )
            .populate({ path: "brand", select: ["title"] })
            .lean();

          // loop for getting category's title of products list
          for (let item of result) {
            let categories = [];
            if (req.body.type == "medicine") {
              for (let i of item.categories) {
                let subCategory = await MasterSubCategoryMedicine.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }
              }
              item.categories = categories;
            } else {
              for (let i of item.categories) {
                let subCategory = await MasterSubCategoryHealthcare.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }

                let subSubCategory =
                  await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                if (subSubCategory) {
                  categories.push(subSubCategory.title);
                }
              }
            }

            item.categories = categories;

            // assigning brand title
            item.brand = item.brand.title;

            item.image = process.env.BASE_URL + item.pricing[0].image[0];
            delete item.pricing;
          }

          res.status(200).json({
            status: true,
            data: result,
          });
        } else {
          res.status(422).json({
            status: false,
            message: "Invalid type",
          });
        }
      } else {
        res.status(422).json({
          status: false,
          message: "Type missing",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  //search product By ID

  findProductByCode: async (req, res, next) => {
    try {
      let result = await Inventory.findOne({ productId: req.params.id });
      if (!result) {
        res.status(422).json({
          status: false,
          data: "No products",
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
  findProductByName: async (req, res, next) => {
    try {
      let result = await Inventory.findOne({ name: req.params.name });
      if (!result) {
        res.status(422).json({
          status: false,
          data: "No products",
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

  //enter questions to the Inventory
  // addProducts: async(req, res, next) => {
  //     try {
  //         let existingName = await Inventory.findOne({ name: req.body.name });
  //         let existingCode = await Inventory.findOne({ productId: req.body.productId });

  //         let data = req.body;
  //         const obj = {
  //             type: data.type,
  //             productId: data.productId,
  //             name: data.name,
  //             categories: data.categories,
  //             stockAlert: data.stockAlert,
  //             statusLimit: data.statusLimit,
  //             brand: data.brand,
  //             policy: data.policy,
  //             prescription: data.prescription,
  //             description: data.description,
  //             directionsOfUse: data.directionsOfUse,
  //             content: data.content,
  //             warning: data.warning,
  //             sideEffects: data.sideEffects,
  //             metaTitles: data.metaTitles,
  //             moreInfo: data.moreInfo,
  //             tags: data.tags,
  //             relatedProducts: data.relatedProducts,
  //             substitutions: data.substitutions,
  //             store: data.store,
  //             createdBy: req.user._id
  //         }
  //         if (!existingCode) {
  //             if (!existingName) {
  //                 let schemaObj = new Inventory(obj);
  //                 schemaObj
  //                     .save()
  //                     .then((response) => {
  //                         res.status(200).json({
  //                             status: true,
  //                             data: "Products added successfully",
  //                         });
  //                     }).catch((error) => {
  //                         res.status(200).json({
  //                             status: false,
  //                             data: error
  //                         });
  //                     })
  //             } else {
  //                 res.status(422).json({
  //                     status: false,
  //                     data: "A Product is already exists with this name",
  //                 });
  //             }
  //         } else {
  //             res.status(422).json({
  //                 status: false,
  //                 data: "A Product is already exists with this Code",
  //             });
  //         }

  //     } catch (error) {
  //         next(error);
  //     }

  // },
  //modify Inventorye data
  // editProduct: async(req, res, next) => {
  //     try {
  //         let valid = await Inventory.findOne({ _id: mongoose.Types.ObjectId(req.params.id) })
  //         let data = req.body;
  //         if (valid) {
  //             const obj = {
  //                 type: data.type,
  //                 productId: data.productId,
  //                 name: data.name,
  //                 categories: data.categories,
  //                 stockAlert: data.stockAlert,
  //                 statusLimit: data.statusLimit,
  //                 brand: data.brand,
  //                 policy: data.policy,
  //                 prescription: data.prescription,
  //                 description: data.description,
  //                 directionsOfUse: data.directionsOfUse,
  //                 content: data.content,
  //                 warning: data.warning,
  //                 sideEffects: data.sideEffects,
  //                 metaTitles: data.metaTitles,
  //                 moreInfo: data.moreInfo,
  //                 tags: data.tags,
  //                 relatedProducts: data.relatedProducts,
  //                 substitutions: data.substitutions,
  //                 store: data.store,
  //                 createdBy: data.createdBy
  //             }
  //             Inventory.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) },
  //                 obj
  //             ).then((response) => {
  //                 console.log(response)
  //                 if (response.nModified == 1) {
  //                     let date = new Date()
  //                     Inventory.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {
  //                         updatedAt: date
  //                     }).then((response) => {
  //                         res.status(200).json({
  //                             status: true,
  //                             data: 'Updated'
  //                         })
  //                     })
  //                 } else {
  //                     res.status(422).json({
  //                         status: false,
  //                         data: 'no changes'
  //                     })
  //                 }
  //             })
  //         } else {
  //             res.status(422).json({
  //                 status: false,
  //                 data: 'invalid Inventory ID'
  //             })
  //         }
  //     } catch (error) {
  //         next(error)
  //     }
  // },
  //Inventory Activate Deactivate
  deactivateInventory: async (req, res, next) => {
    try {
      let valid = await Inventory.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      let data = req.body;
      if (valid) {
        Inventory.updateOne(
          { _id: mongoose.Types.ObjectId(req.params.id) },
          {
            $set: {
              isDisabled: data.status,
            },
          }
        ).then((response) => {
          console.log(response);
          if (response.nModified == 1) {
            let date = new Date();
            Inventory.updateOne(
              { _id: mongoose.Types.ObjectId(req.params.id) },
              {
                updatedAt: date,
              }
            ).then((response) => {
              res.status(200).json({
                status: true,
                data: "Updated",
              });
            });
          } else {
            res.status(422).json({
              status: false,
              data: "no changes",
            });
          }
        });
      } else {
        res.status(422).json({
          status: false,
          data: "invalid Inventory ID",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  //delete all Questions
  deleteInventory: async (req, res, next) => {
    try {
      Inventory.deleteOne({ _id: req.params.id }).then((response) => {
        res.status(200).json({
          status: true,
          data: "Inventory Deleted",
        });
      });
    } catch (error) {
      next(error);
    }
  },
  editStock: (req, res, next) => {
    try {
      Inventory.findOne({ "store.pricing._id": req.params.id }).then(
        (response) => {
          if (response) {
            let data = [];
            for (let item of response.pricing) {
              if (item._id == req.params.id) {
                item = req.body;
                item._id = req.params.id;
              }
              data.push(item);
            }
            response.store[0].pricing = data;
            Inventory.updateOne({ _id: response._id }, response).then((r) => {
              res.status(200).json({
                status: true,
                data: "Stock Updated",
              });
            });
          } else {
            res.status(422).json({
              status: false,
              data: "invalid Stock ID",
            });
          }
        }
      );
    } catch (error) {
      next(error);
    }
  },
  inventoryListingWithNameOnly: async (req, res, next) => {
    try {
      let list = await Inventory.find({ isActive: true }, { name: 1 });

      res.status(200).json({
        status: true,
        data: {
          products: list,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getHealthcareInventoryCategories: async (req, res, next) => {
    try {
      let allCategories = [];

      let healthcareCategories = await MasterCategory.find(
        { categoryType: "healthcare" },
        { title: 1 }
      ).lean();

      for (i = 0; i < healthcareCategories.length; i++) {
        let subCategories = await MasterSubCategoryHealthcare.find(
          { categoryId: healthcareCategories[i]._id },
          { title: 1 }
        ).lean();

        for (j = 0; j < subCategories.length; j++) {
          let subSubCategories = await MasterSubSubCategoryHealthcare.find(
            { subCategoryId: mongoose.Types.ObjectId(subCategories[j]._id) },
            { title: 1 }
          ).lean();
          subCategories[j].sub_sub_categories = subSubCategories;
        }

        healthcareCategories[i].sub_categories = subCategories;

        // MasterSubCategoryHealthcare
      }

      let structure = [];

      res.status(200).json({
        status: true,
        message: "success",
        data: healthcareCategories,
      });
    } catch (error) {
      next(error);
    }
  },
  addProducts: async (req, res, next) => {
    try {
      if (req.body.type == "healthcare") {
        let existingName = await Inventory.findOne({ name: req.body.name });
        let existingCode = await Inventory.findOne({
          productId: req.body.productId,
        });
        let data = req.body;

        let baseurl = process.env.BASE_URL;

        // for (i = 0; i < data.pricing.length; i++) {
        //   console.log("imageesaa", data.pricing[i]);
        //   for (j = 0; j < data.pricing[i].image.length; j++) {
        //     data.pricing[i].image[j] = data.pricing[i].image[j].replace(
        //       baseurl,
        //       ""
        //     );
        //     console.log("11", data.pricing[i].image[j]);
        //   }
        // }
        let pricing = [];

        let newPricing = JSON.parse(data.pricing);
        console.log("frontend====", newPricing);
        for (let item of newPricing) {
          let img = [];
          let obj = {
            uom: item.uom,
            sku: item.sku,
            skuOrHsnNo: item.skuOrHsnNo,
            price: item.price,
            specialPrice: item.specialPrice,
            stock: item.stock,
            video: item.video,
          };
          for (let image of item.image) {
            image = image.replace(baseurl, "");
            img.push(image);
          }
          obj.image = img;
          pricing.push(obj);
        }
        console.log("changed====", pricing);
        const obj = {
          type: data.type,
          productId: data.productId,
          name: data.name,
          categories: data.categories,
          online: data.online,
          tax: data.tax,
          stockAlert: data.stockAlert,
          statusLimit: data.statusLimit,
          offerType: data.offerType,
          brand: data.brand,
          policy: data.policy,
          prescription: data.prescription,
          description: data.description,
          directionsOfUse: data.directionsOfUse,
          content: data.content,
          warning: data.warning,
          sideEffects: data.sideEffects,
          metaTitles: data.metaTitles,
          metaDescription: data.metaDescription,
          moreInfo: data.moreInfo,
          tags: data.tags,
          substitutions: data.substitutions,
          pricing: pricing,
        };
        if (data.relatedProducts) {
          obj.relatedProducts = data.relatedProducts;
        }
        if (!existingCode) {
          if (!existingName) {
            let schemaObj = new Inventory(obj);
            schemaObj
              .save()
              .then(async (_) => {
                await productIdCount.updateMany(
                  { type: req.body.type },
                  { $inc: { count: 1 } }
                );
                res.status(200).json({
                  status: true,
                  data: "Products added successfully",
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
              data: "A Product is already exists with this name",
            });
          }
        } else {
          res.status(200).json({
            status: false,
            data: "A Product is already exists with this Code",
          });
        }
      } else if (req.body.type == "medicine") {
        let existingName = await Inventory.findOne({ name: req.body.name });
        let existingCode = await Inventory.findOne({
          productId: req.body.productId,
        });
        let data = req.body;

        let baseurl = process.env.BASE_URL;
        let pricing = [];
        let newPricing = JSON.parse(data.pricing);
        for (let item of newPricing) {
          let img = [];
          let obj = {
            uom: item.uom,
            sku: item.sku,
            skuOrHsnNo: item.skuOrHsnNo,
            price: item.price,
            specialPrice: item.specialPrice,
            volume: item.volume,
            expiryDate: item.expiryDate,
            stock: item.stock,
            video: item.video,
          };
          for (let image of item.image) {
            image = image.replace(baseurl, "");
            img.push(image);
          }
          obj.image = img;
          pricing.push(obj);
        }

        const obj = {
          type: data.type,
          productId: data.productId,
          name: data.name,
          categories: data.categories,
          online: data.online,
          tax: data.tax,
          stockAlert: data.stockAlert,
          statusLimit: data.statusLimit,
          brand: data.brand,
          policy: data.policy,
          prescription: data.prescription,
          description: data.description,
          directionsOfUse: data.directionsOfUse,
          content: data.content,
          warning: data.warning,
          sideEffects: data.sideEffects,
          metaTitles: data.metaTitles,
          metaDescription: data.metaDescription,
          moreInfo: data.moreInfo,
          tags: data.tags,
          substitutions: data.substitutions,
          pricing: pricing,
          createdBy: req.user._id,
        };
        if (data.relatedProducts) {
          obj.relatedProducts = data.relatedProducts;
        }
        if (!existingCode) {
          if (!existingName) {
            let schemaObj = new Inventory(obj);
            schemaObj
              .save()
              .then(async (_) => {
                await productIdCount.updateMany(
                  { type: req.body.type },
                  { $inc: { count: 1 } }
                );
                res.status(200).json({
                  status: true,
                  data: "Products added successfully",
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
              data: "A Product is already exists with this name",
            });
          }
        } else {
          res.status(200).json({
            status: false,
            data: "A Product is already exists with this Code",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          data: "invalid type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getInventoryById: async (req, res, next) => {
    try {
      let result = await Inventory.findOne(
        { _id: req.params.id },
        {
          createdBy: 0,
          __v: 0,
        }
      ).lean();
      let brand = [];
      let policy = [];
      if (result) {
        for (i = 0; i < result.pricing.length; i++) {
          for (j = 0; j < result.pricing[i].image.length; j++) {
            result.pricing[i].image[j] = process.env.BASE_URL.concat(
              result.pricing[i].image[j]
            );
          }
        }
        brand.push(result.brand);
        policy.push(result.policy);

        result.policy = policy;
        result.brand = brand;
        let categories = [];
        if (result.type == "medicine") {
          for (let i of result.categories) {
            let subCategory = await MasterSubCategoryMedicine.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push({
                _id: subCategory._id,
                title: subCategory.title,
              });
            }
          }
          result.categories = categories;
        } else {
          for (let i of result.categories) {
            let subCategory = await MasterSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push({
                _id: subCategory._id,
                title: subCategory.title,
              });
            }

            let subSubCategory = await MasterSubSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subSubCategory) {
              categories.push({
                _id: subSubCategory._id,
                title: subSubCategory.title,
              });
            }
          }
          result.categories = categories;
        }

        return res.status(200).json({
          status: true,
          data: result,
        });
      } else {
        res.status(422).json({
          status: false,
          data: "Invalid Id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  editProduct: async (req, res, next) => {
    try {
      let valid = await Inventory.findOne({ _id: req.params.id });
      if (valid) {
        let baseurl = process.env.BASE_URL;

        if (req.body.type == "healthcare") {
          let existingName = await Inventory.findOne({
            _id: { $ne: req.params.id },
            name: req.body.name,
          });
          let existingCode = await Inventory.findOne({
            _id: { $ne: req.params.id },
            productId: req.body.productId,
          });
          let data = req.body;
          let pricing = [];

          let newPricing = JSON.parse(data.pricing);
          for (let item of newPricing) {
            console.log(item);

            let img = [];
            let obj = {
              _id: item._id,
              uom: item.uom,
              sku: item.sku,
              skuOrHsnNo: item.skuOrHsnNo,
              price: item.price,
              specialPrice: item.specialPrice,
              stock: item.stock,
              video: item.video,
            };
            for (let image of item.image) {
              image = image.replace(baseurl, "");
              img.push(image);
            }
            obj.image = img;
            pricing.push(obj);
          }
          console.log(pricing);
          const obj = {
            type: data.type,
            productId: data.productId,
            name: data.name,
            categories: data.categories,
            online: data.online,
            tax: data.tax,
            stockAlert: data.stockAlert,
            statusLimit: data.statusLimit,
            offerType: data.offerType,
            brand: data.brand,
            policy: data.policy,
            prescription: data.prescription,
            description: data.description,
            directionsOfUse: data.directionsOfUse,
            content: data.content,
            warning: data.warning,
            sideEffects: data.sideEffects,
            metaTitles: data.metaTitles,
            metaDescription: data.metaDescription,
            moreInfo: data.moreInfo,
            tags: data.tags,
            substitutions: data.substitutions,
            relatedProducts: data.relatedProducts,
            pricing: pricing,
            createdBy: req.user._id,
          };

          if (!existingCode) {
            if (!existingName) {
              Inventory.updateOne({ _id: valid._id }, obj).then((response) => {
                if (response.nModified == 1) {
                  res.status(200).json({
                    status: true,
                    data: "Products Updated successfully",
                  });
                } else {
                  res.status(200).json({
                    status: true,
                    data: "Products Not updated",
                  });
                }
              });
            } else {
              res.status(200).json({
                status: false,
                data: "A Product is already exists with this name",
              });
            }
          } else {
            res.status(200).json({
              status: false,
              data: "A Product is already exists with this Code",
            });
          }
        } else if (req.body.type == "medicine") {
          let existingName = await Inventory.findOne({
            _id: { $ne: req.params.id },
            name: req.body.name,
          });
          let existingCode = await Inventory.findOne({
            _id: { $ne: req.params.id },
            productId: req.body.productId,
          });
          let data = req.body;
          let pricing = [];
          let newPricing = JSON.parse(data.pricing);
          for (let item of newPricing) {
            console.log(item);
            let img = [];
            let obj = {
              _id: item._id,
              uom: item.uom,
              sku: item.sku,
              skuOrHsnNo: item.skuOrHsnNo,
              price: item.price,
              specialPrice: item.specialPrice,
              volume: item.volume,
              expiryDate: item.expiryDate,
              stock: item.stock,
              video: item.video,
            };
            for (let image of item.image) {
              image = image.replace(baseurl, "");
              img.push(image);
            }
            obj.image = img;
            pricing.push(obj);
          }
          console.log("Medcine=====", pricing);
          const obj = {
            type: data.type,
            productId: data.productId,
            name: data.name,
            categories: data.categories,
            online: data.online,
            tax: data.tax,
            stockAlert: data.stockAlert,
            statusLimit: data.statusLimit,
            brand: data.brand,
            policy: data.policy,
            prescription: data.prescription,
            description: data.description,
            directionsOfUse: data.directionsOfUse,
            content: data.content,
            warning: data.warning,
            sideEffects: data.sideEffects,
            metaTitles: data.metaTitles,
            metaDescription: data.metaDescription,
            moreInfo: data.moreInfo,
            tags: data.tags,
            substitutions: data.substitutions,
            relatedProducts: data.relatedProducts,
            pricing: pricing,
            createdBy: req.user._id,
          };
          if (!existingCode) {
            if (!existingName) {
              Inventory.updateOne({ _id: valid._id }, obj).then((response) => {
                if (response.nModified == 1) {
                  res.status(200).json({
                    status: true,
                    data: "Products Updated successfully",
                  });
                } else {
                  res.status(200).json({
                    status: true,
                    data: "Products Not updated",
                  });
                }
              });
            } else {
              res.status(200).json({
                status: false,
                data: "A Product is already exists with this name",
              });
            }
          } else {
            res.status(200).json({
              status: false,
              data: "A Product is already exists with this Code",
            });
          }
        } else {
          res.status(200).json({
            status: false,
            data: "Invalid type",
          });
        }
      }
    } catch (error) {
      next(error);
    }
  },
  getInventoryCategory: async (req, res, next) => {
    try {
      if (req.params.type == "healthcare" || req.params.type == "medicine") {
        if (req.params.type == "medicine") {
          let mainCategories = await MasterCategory.find(
            { categoryType: req.params.type },
            {
              title: 1,
            }
          ).lean();
          console.log("main cat:", mainCategories);

          let allSubCategories = [];

          for (let item of mainCategories) {
            let subCategories = await MasterSubCategoryMedicine.find(
              { categoryId: mongoose.Types.ObjectId(item._id) },
              {
                title: 1,
              }
            ).lean();

            item.subCategories = subCategories;

            // for new response
            allSubCategories = allSubCategories.concat(subCategories);
          }

          console.log("main cat medicine last:", mainCategories);

          console.log("new return medicine categs::____:", allSubCategories);

          return res.status(200).json({
            status: true,
            message: "success",
            data: {
              categories: allSubCategories,
            },
          });
        } else {
          let mainCategories = await MasterCategory.find(
            { categoryType: req.params.type },
            {
              title: 1,
            }
          ).lean();
          console.log("main cat health:", mainCategories);

          let allHealthCareCategories = [];

          for (let item of mainCategories) {
            let subCategories = await MasterSubCategoryHealthcare.find(
              { categoryId: mongoose.Types.ObjectId(item._id) },
              {
                title: 1,
              }
            ).lean();

            for (let i of subCategories) {
              let subSubCategoryHealthcare =
                await MasterSubSubCategoryHealthcare.find(
                  { subCategoryId: mongoose.Types.ObjectId(i._id) },
                  {
                    title: 1,
                  }
                );

              if (subSubCategoryHealthcare.length) {
                i.subCategories = subSubCategoryHealthcare;
                allHealthCareCategories = allHealthCareCategories.concat(
                  subSubCategoryHealthcare
                );
              } else {
                allHealthCareCategories.push(i);
              }
            }

            item.subCategories = subCategories;
          }

          console.log("main cat health last:", mainCategories);

          console.log(
            "new return healthcare categs::____:",
            allHealthCareCategories
          );

          return res.status(200).json({
            status: true,
            message: "success",
            data: {
              categories: allHealthCareCategories,
            },
          });
        }

        // let result = await MasterCategory.find({ isActive: true }, { title: 1 });
        // res.status(200).json({
        //   status: true,
        //   data: result,
        // });
      } else {
        res.status(422).json({
          status: false,
          data: "Invalid Type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getInventoryVarients: async (req, res, next) => {
    try {
      if (req.body.type) {
        if (req.body.type == "healthcare" || req.body.type == "medicine") {
          let products = [];

          if (req.body.categoryId) {
            if (req.body.categoryId == "all") {
              products = await Inventory.find({ type: req.body.type }).lean();

              // loop for getting category's title of products list
              for (let item of products) {
                let categories = [];
                if (item.type == "medicine") {
                  for (let i of item.categories) {
                    let subCategory = await MasterSubCategoryMedicine.findOne({
                      _id: mongoose.Types.ObjectId(i),
                    });
                    if (subCategory) {
                      categories.push(subCategory.title);
                    }
                  }
                  item.categories = categories;
                } else {
                  for (let i of item.categories) {
                    let subCategory = await MasterSubCategoryHealthcare.findOne(
                      {
                        _id: mongoose.Types.ObjectId(i),
                      }
                    );
                    if (subCategory) {
                      categories.push(subCategory.title);
                    }

                    let subSubCategory =
                      await MasterSubSubCategoryHealthcare.findOne({
                        _id: mongoose.Types.ObjectId(i),
                      });
                    if (subSubCategory) {
                      categories.push(subSubCategory.title);
                    }
                  }
                }

                item.categories = categories;
              }
            } else {
              products = await Inventory.find({
                type: req.body.type,
                categories: req.body.categoryId,
              }).lean();

              for (let item of products) {
                let categories = [];
                if (item.type == "medicine") {
                  for (let i of item.categories) {
                    let subCategory = await MasterSubCategoryMedicine.findOne({
                      _id: mongoose.Types.ObjectId(i),
                    });
                    if (subCategory) {
                      categories.push(subCategory.title);
                    }
                  }
                  item.categories = categories;
                } else {
                  for (let i of item.categories) {
                    let subCategory = await MasterSubCategoryHealthcare.findOne(
                      {
                        _id: mongoose.Types.ObjectId(i),
                      }
                    );
                    if (subCategory) {
                      categories.push(subCategory.title);
                    }

                    let subSubCategory =
                      await MasterSubSubCategoryHealthcare.findOne({
                        _id: mongoose.Types.ObjectId(i),
                      });
                    if (subSubCategory) {
                      categories.push(subSubCategory.title);
                    }
                  }
                }

                item.categories = categories;
              }
            }
          } else {
            return res.status(422).json({
              status: false,
              message: "categoryId missing",
            });
          }

          let newArray = [];
          let ids = [];

          for (let item of products) {
            for (let items of item.pricing) {
              let tempProdObj = {
                productId: item.productId,
                name: item.name,
                category: item.categories,
                brand: item.brand,
                sku: items.sku,
                skuOrHsnNo: items.skuOrHsnNo,
                price: items.price,
                specialPrice: items.specialPrice,
                stock: items.stock,
                image: items.image[0],
                _id: items._id,
              };
              if (!tempProdObj.image.includes(process.env.BASE_URL)) {
                tempProdObj.image = process.env.BASE_URL.concat(
                  tempProdObj.image
                );
              }
              if (item.type == "medicine") {
                tempProdObj.expiryDate = items.expiryDate;
              }
              if (!ids.includes(tempProdObj._id + "")) {
                ids.push(tempProdObj._id + "");
                newArray.push(tempProdObj);
              }
            }
          }
          console.log("newresul===", newArray);
          let newResults = [];
          for (let data of newArray) {
            console.log(data.image);

            let sku = await MasterUomValue.findOne({ _id: data.sku });
            let brand = await MasterBrand.findOne({ _id: data.brand });
            let obj = {
              productId: data.productId,
              name: data.name,
              category: data.category,
              skuOrHsnNo: data.skuOrHsnNo,
              price: data.price,
              specialPrice: data.specialPrice,
              stock: data.stock,
              image: data.image,
              _id: data._id,
              expiryDate: data.expiryDate,
            };
            if (sku) {
              obj.sku = sku.uomValue;
            }
            if (brand) {
              obj.brand = brand.title;
            }
            if (data.expiryDate) {
              obj.expiryDate = data.expiryDate;
            }
            if (newResults.includes(obj)) {
            } else {
              newResults.push(obj);
            }
          }
          let newData = [...new Set(newResults)];
          let page = parseInt(req.body.page) - 1;
          let limit = parseInt(req.body.limit);
          let nextPage = false;
          let start = page * limit;
          let end = page * limit + limit;
          let newResult = newData.slice(start, end);

          if (newData.length > end) {
            nextPage = true;
          } else {
            nextPage = false;
          }
          let totalPage = Math.ceil(newData.length / limit);

          res.status(200).json({
            status: true,
            message: "success",
            data: {
              product_varients: newResult,
              nextPage: nextPage,
              totalPage: totalPage,
            },
          });
        } else {
          res.status(422).json({
            status: false,
            message: "Invalid type",
          });
        }
      } else {
        res.status(422).json({
          status: false,
          message: "Invalid type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getOutOfStockInventoryVarients: async (req, res, next) => {
    try {
      if (req.body.type) {
        if (req.body.type == "healthcare" || req.body.type == "medicine") {
          let products = [];

          if (req.body.categoryId) {
            if (req.body.categoryId == "all") {
              products = await Inventory.find({ type: req.body.type }).lean();

              for (let item of products) {
                let categories = [];
                if (item.type == "medicine") {
                  for (let i of item.categories) {
                    let subCategory = await MasterSubCategoryMedicine.findOne({
                      _id: mongoose.Types.ObjectId(i),
                    });
                    if (subCategory) {
                      categories.push(subCategory.title);
                    }
                  }
                  item.categories = categories;
                } else {
                  for (let i of item.categories) {
                    let subCategory = await MasterSubCategoryHealthcare.findOne(
                      {
                        _id: mongoose.Types.ObjectId(i),
                      }
                    );
                    if (subCategory) {
                      categories.push(subCategory.title);
                    }

                    let subSubCategory =
                      await MasterSubSubCategoryHealthcare.findOne({
                        _id: mongoose.Types.ObjectId(i),
                      });
                    if (subSubCategory) {
                      categories.push(subSubCategory.title);
                    }
                  }
                }

                item.categories = categories;
              }
            } else {
              products = await Inventory.find({
                type: req.body.type,
                categories: req.body.categoryId,
              }).lean();

              for (let item of products) {
                let categories = [];
                if (item.type == "medicine") {
                  for (let i of item.categories) {
                    let subCategory = await MasterSubCategoryMedicine.findOne({
                      _id: mongoose.Types.ObjectId(i),
                    });
                    if (subCategory) {
                      categories.push(subCategory.title);
                    }
                  }
                  item.categories = categories;
                } else {
                  for (let i of item.categories) {
                    let subCategory = await MasterSubCategoryHealthcare.findOne(
                      {
                        _id: mongoose.Types.ObjectId(i),
                      }
                    );
                    if (subCategory) {
                      categories.push(subCategory.title);
                    }

                    let subSubCategory =
                      await MasterSubSubCategoryHealthcare.findOne({
                        _id: mongoose.Types.ObjectId(i),
                      });
                    if (subSubCategory) {
                      categories.push(subSubCategory.title);
                    }
                  }
                }

                item.categories = categories;
              }
            }
          } else {
            return res.status(422).json({
              status: false,
              message: "categoryId missing",
            });
          }

          let newArray = [];

          for (i = 0; i < products.length; i++) {
            let tempProdObj = {
              productId: products[i].productId,
              name: products[i].name,
              category: products[i].categories,
              brand: products[i].brand,
            };

            for (j = 0; j < products[i].pricing.length; j++) {
              if (products[i].pricing[j].stock == 0) {
                let varientObj = tempProdObj;
                varientObj.sku = products[i].pricing[j].sku;
                varientObj.skuOrHsnNo = products[i].pricing[j].skuOrHsnNo;
                varientObj.price = products[i].pricing[j].price;
                varientObj.specialPrice = products[i].pricing[j].specialPrice;
                varientObj.stock = products[i].pricing[j].stock;
                varientObj.image = process.env.BASE_URL.concat(
                  products[i].pricing[j].image[0]
                );
                varientObj._id = products[i].pricing[j]._id;

                if (products[i].type == "medicine") {
                  varientObj.expiryDate = products[i].pricing[j].expiryDate;
                }

                newArray.push(varientObj);
              }
            }
          }
          let newResults = [];
          for (let data of newArray) {
            // console.log(typeof(item.sku));
            console.log(data.image);

            let sku = await MasterUomValue.findOne({ _id: data.sku });
            let brand = await MasterBrand.findOne({ _id: data.brand });
            let obj = {
              productId: data.productId,
              name: data.name,
              category: data.category,
              skuOrHsnNo: data.skuOrHsnNo,
              price: data.price,
              specialPrice: data.specialPrice,
              stock: data.stock,
              image: data.image,
              _id: data._id,
              expiryDate: data.expiryDate,
            };
            if (sku) {
              obj.sku = sku.uomValue;
            }
            if (brand) {
              obj.brand = brand.title;
            }
            if (data.expiryDate) {
              obj.expiryDate = data.expiryDate;
            }
            newResults.push(obj);
          }

          let page = parseInt(req.body.page) - 1;
          let limit = parseInt(req.body.limit);
          let nextPage = false;
          let start = page * limit;
          let end = page * limit + limit;
          let newResult = newResults.slice(start, end);

          if (newResults.length > end) {
            nextPage = true;
          } else {
            nextPage = false;
          }
          let totalPage = Math.ceil(newArray.length / limit);

          res.status(200).json({
            status: true,
            message: "success",
            data: {
              product_varients: newResult,
              nextPage: nextPage,
              totalPage: totalPage,
            },
          });
        } else {
          res.status(422).json({
            status: false,
            message: "Invalid type",
          });
        }
      } else {
        res.status(422).json({
          status: false,
          message: "Invalid type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getLowStockInventoryVarients: async (req, res, next) => {
    try {
      if (req.body.type) {
        if (req.body.type == "healthcare" || req.body.type == "medicine") {
          let products = [];

          if (req.body.categoryId) {
            if (req.body.categoryId == "all") {
              products = await Inventory.find({ type: req.body.type }).lean();

              for (let item of products) {
                let categories = [];
                if (item.type == "medicine") {
                  for (let i of item.categories) {
                    let subCategory = await MasterSubCategoryMedicine.findOne({
                      _id: mongoose.Types.ObjectId(i),
                    });
                    if (subCategory) {
                      categories.push(subCategory.title);
                    }
                  }
                  item.categories = categories;
                } else {
                  for (let i of item.categories) {
                    let subCategory = await MasterSubCategoryHealthcare.findOne(
                      {
                        _id: mongoose.Types.ObjectId(i),
                      }
                    );
                    if (subCategory) {
                      categories.push(subCategory.title);
                    }

                    let subSubCategory =
                      await MasterSubSubCategoryHealthcare.findOne({
                        _id: mongoose.Types.ObjectId(i),
                      });
                    if (subSubCategory) {
                      categories.push(subSubCategory.title);
                    }
                  }
                }

                item.categories = categories;
              }
            } else {
              products = await Inventory.find({
                type: req.body.type,
                categories: req.body.categoryId,
              }).lean();

              for (let item of products) {
                let categories = [];
                if (item.type == "medicine") {
                  for (let i of item.categories) {
                    let subCategory = await MasterSubCategoryMedicine.findOne({
                      _id: mongoose.Types.ObjectId(i),
                    });
                    if (subCategory) {
                      categories.push(subCategory.title);
                    }
                  }
                  item.categories = categories;
                } else {
                  for (let i of item.categories) {
                    let subCategory = await MasterSubCategoryHealthcare.findOne(
                      {
                        _id: mongoose.Types.ObjectId(i),
                      }
                    );
                    if (subCategory) {
                      categories.push(subCategory.title);
                    }

                    let subSubCategory =
                      await MasterSubSubCategoryHealthcare.findOne({
                        _id: mongoose.Types.ObjectId(i),
                      });
                    if (subSubCategory) {
                      categories.push(subSubCategory.title);
                    }
                  }
                }

                item.categories = categories;
              }
            }
          } else {
            return res.status(422).json({
              status: false,
              message: "categoryId missing",
            });
          }

          let newArray = [];

          for (i = 0; i < products.length; i++) {
            let tempProdObj = {
              productId: products[i].productId,
              name: products[i].name,
              category: products[i].categories,
              brand: products[i].brand,
            };

            for (j = 0; j < products[i].pricing.length; j++) {
              if (
                products[i].pricing[j].stock <= products[i].stockAlert &&
                products[i].pricing[j].stock != 0
              ) {
                let varientObj = tempProdObj;
                varientObj.sku = products[i].pricing[j].sku;
                varientObj.skuOrHsnNo = products[i].pricing[j].skuOrHsnNo;
                varientObj.price = products[i].pricing[j].price;
                varientObj.specialPrice = products[i].pricing[j].specialPrice;
                varientObj.stock = products[i].pricing[j].stock;
                varientObj.image = process.env.BASE_URL.concat(
                  products[i].pricing[j].image[0]
                );
                varientObj._id = products[i].pricing[j]._id;

                if (products[i].type == "medicine") {
                  varientObj.expiryDate = products[i].pricing[j].expiryDate;
                }

                newArray.push(varientObj);
              }
            }
          }
          let newResults = [];
          for (let data of newArray) {
            // console.log(typeof(item.sku));
            console.log(data.image);

            let sku = await MasterUomValue.findOne({ _id: data.sku });
            let brand = await MasterBrand.findOne({ _id: data.brand });
            let obj = {
              productId: data.productId,
              name: data.name,
              category: data.category,
              skuOrHsnNo: data.skuOrHsnNo,
              price: data.price,
              specialPrice: data.specialPrice,
              stock: data.stock,
              image: data.image,
              _id: data._id,
              expiryDate: data.expiryDate,
            };
            if (sku) {
              obj.sku = sku.uomValue;
            }
            if (brand) {
              obj.brand = brand.title;
            }
            if (data.expiryDate) {
              obj.expiryDate = data.expiryDate;
            }
            newResults.push(obj);
          }

          let page = parseInt(req.body.page) - 1;
          let limit = parseInt(req.body.limit);
          let nextPage = false;
          let start = page * limit;
          let end = page * limit + limit;
          let newResult = newResults.slice(start, end);

          if (newResults.length > end) {
            nextPage = true;
          } else {
            nextPage = false;
          }
          let totalPage = Math.ceil(newArray.length / limit);

          res.status(200).json({
            status: true,
            message: "success",
            data: {
              product_varients: newResult,
              nextPage: nextPage,
              totalPage: totalPage,
            },
          });
        } else {
          res.status(422).json({
            status: false,
            message: "Invalid type",
          });
        }
      } else {
        res.status(422).json({
          status: false,
          message: "Invalid type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getInventoryVarientsOfStore: async (req, res, next) => {
    try {
      if (req.body.type) {
        if (req.body.type == "healthcare" || req.body.type == "medicine") {
          let products = [];
          let steppiny = [];

          if (req.body.categoryId) {
            if (req.body.categoryId == "all") {
              products = await storeProducts.aggregate([
                { $match: { type: req.body.type, storeId: req.user._id } },
                {
                  $project: {
                    _id: "$varientId",
                    storeId: 1,
                    productId: 1,
                    stock: 1,
                    price: 1,
                    specialPrice: 1,
                    skuOrHsnNo: 1,
                    expiryDate: 1,
                    type: 1,
                  },
                },
              ]);
              console.log("findd productss", products);

              products = products.reverse();

              // loop for getting category's title of products list
              for (let item of products) {
                let categories = [];

                console.log("item__of___products", item);

                let product = await Inventory.findOne({
                  "pricing._id": item._id,
                }).lean();
                console.log("producccctttttttt:", product);

                if (product) {
                  item.productId = product.productId;
                  item.name = product.name;
                  item.categories = product.categories;
                  item.brand = product.brand;

                  for (let eachPricing of product.pricing) {
                    console.log("heeeeelo", eachPricing);
                    console.log("yyyy:", item._id);
                    if (eachPricing._id + "" == item._id + "") {
                      console.log("OOOOOIII");
                      item.sku = eachPricing.sku;
                      item.image = process.env.BASE_URL + eachPricing.image[0];
                    }
                  }

                  console.log("after producty:::_:", item);

                  if (req.body.type == "medicine") {
                    for (let i of item.categories) {
                      let subCategory = await MasterSubCategoryMedicine.findOne(
                        {
                          _id: mongoose.Types.ObjectId(i),
                        }
                      );
                      if (subCategory) {
                        categories.push(subCategory.title);
                      }
                    }
                    item.categories = categories;
                  } else {
                    for (let i of item.categories) {
                      let subCategory =
                        await MasterSubCategoryHealthcare.findOne({
                          _id: mongoose.Types.ObjectId(i),
                        });
                      if (subCategory) {
                        categories.push(subCategory.title);
                      }

                      let subSubCategory =
                        await MasterSubSubCategoryHealthcare.findOne({
                          _id: mongoose.Types.ObjectId(i),
                        });
                      if (subSubCategory) {
                        categories.push(subSubCategory.title);
                      }
                    }
                  }

                  item.categories = categories;
                } else {
                  products.splice(products.indexOf(item), 1);
                }
              }
            } else {
              products = await storeProducts.aggregate([
                { $match: { type: req.body.type, storeId: req.user._id } },
                {
                  $project: {
                    _id: "$varientId",
                    storeId: 1,
                    productId: 1,
                    stock: 1,
                    price: 1,
                    specialPrice: 1,
                    skuOrHsnNo: 1,
                    expiryDate: 1,
                    type: 1,
                  },
                },
                {
                  $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product",
                  },
                },
              ]);

              console.log(
                "founnddd productsss___",
                products[0].product[0].pricing[0].image
              );

              products = products.reverse();

              for (let item of products) {
                let categories = [];

                item.categories = item.product[0].categories;
                item.productId = item.product[0].productId;
                item.name = item.product[0].name;
                item.brand = item.product[0].brand;

                for (let eachPricing of item.product[0].pricing) {
                  console.log("heeeeelo", eachPricing);
                  console.log("yyyy:", item._id);
                  if (eachPricing._id + "" == item._id + "") {
                    console.log("OOOOOIII");
                    item.sku = eachPricing.sku;
                    item.image = process.env.BASE_URL + eachPricing.image[0];
                  }
                }

                // category filtering
                if (item.categories.includes(req.body.categoryId)) {
                  if (item.type == "medicine") {
                    for (let i of item.categories) {
                      let subCategory = await MasterSubCategoryMedicine.findOne(
                        {
                          _id: mongoose.Types.ObjectId(i),
                        }
                      );
                      if (subCategory) {
                        categories.push(subCategory.title);
                      }
                    }
                    item.categories = categories;
                  } else {
                    for (let i of item.categories) {
                      let subCategory =
                        await MasterSubCategoryHealthcare.findOne({
                          _id: mongoose.Types.ObjectId(i),
                        });
                      if (subCategory) {
                        categories.push(subCategory.title);
                      }

                      let subSubCategory =
                        await MasterSubSubCategoryHealthcare.findOne({
                          _id: mongoose.Types.ObjectId(i),
                        });
                      if (subSubCategory) {
                        categories.push(subSubCategory.title);
                      }
                    }
                  }

                  item.categories = categories;

                  steppiny.push(item);
                } else {
                  console.log("elsey");
                }
              }
            }
          } else {
            return res.status(422).json({
              status: false,
              message: "categoryId missing",
            });
          }

          let newArray = [];
          let ids = [];

          console.log("newresul===", newArray);
          let newResults = [];

          if (req.body.categoryId != "all") {
            products = steppiny;
          }

          for (let data of products) {
            console.log(data.image);
            console.log("dataaaaaa.sku", data);

            let sku = await MasterUomValue.findOne({ _id: data.sku });
            let brand = await MasterBrand.findOne({ _id: data.brand });
            let obj = {
              productId: data.productId,
              name: data.name,
              category: data.categories,
              skuOrHsnNo: data.skuOrHsnNo,
              price: data.price,
              specialPrice: data.specialPrice,
              stock: data.stock,
              image: data.image,
              _id: data._id,
              expiryDate: data.expiryDate,
            };
            if (sku) {
              obj.sku = sku.uomValue;
            }
            if (brand) {
              obj.brand = brand.title;
            }
            if (data.expiryDate) {
              obj.expiryDate = data.expiryDate;
            }
            if (newResults.includes(obj)) {
            } else {
              newResults.push(obj);
            }
          }
          let newData = [...new Set(newResults)];
          let page = parseInt(req.body.page) - 1;
          let limit = parseInt(req.body.limit);
          let nextPage = false;
          let start = page * limit;
          let end = page * limit + limit;
          let newResult = newData.slice(start, end);

          if (newData.length > end) {
            nextPage = true;
          } else {
            nextPage = false;
          }
          let totalPage = Math.ceil(newData.length / limit);

          res.status(200).json({
            status: true,
            message: "success",
            data: {
              product_varients: newResult,
              nextPage: nextPage,
              totalPage: totalPage,
            },
          });
        } else {
          res.status(422).json({
            status: false,
            message: "Invalid type",
          });
        }
      } else {
        res.status(422).json({
          status: false,
          message: "Invalid type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getInventoryOutOfStockVarientsOfStore: async (req, res, next) => {
    try {
      if (req.body.type) {
        if (req.body.type == "healthcare" || req.body.type == "medicine") {
          let products = [];
          let steppiny = [];

          if (req.body.categoryId) {
            if (req.body.categoryId == "all") {
              products = await storeProducts.aggregate([
                {
                  $match: {
                    type: req.body.type,
                    storeId: req.user._id,
                    stock: 0,
                  },
                },
                {
                  $project: {
                    _id: "$varientId",
                    storeId: 1,
                    productId: 1,
                    stock: 1,
                    price: 1,
                    specialPrice: 1,
                    skuOrHsnNo: 1,
                    expiryDate: 1,
                    type: 1,
                  },
                },
              ]);
              console.log("findd productss", products);

              // loop for getting category's title of products list
              for (let item of products) {
                let categories = [];

                let product = await Inventory.findOne({
                  "pricing._id": item._id,
                }).lean();
                console.log("producccctttttttt:", product);

                item.productId = product.productId;
                item.name = product.name;
                item.categories = product.categories;
                item.brand = product.brand;

                for (let eachPricing of product.pricing) {
                  console.log("heeeeelo", eachPricing);
                  console.log("yyyy:", item._id);
                  if (eachPricing._id + "" == item._id + "") {
                    console.log("OOOOOIII");
                    item.sku = eachPricing.sku;
                    item.image = process.env.BASE_URL + eachPricing.image[0];
                  }
                }

                console.log("after producty:::_:", item);

                if (req.body.type == "medicine") {
                  for (let i of item.categories) {
                    let subCategory = await MasterSubCategoryMedicine.findOne({
                      _id: mongoose.Types.ObjectId(i),
                    });
                    if (subCategory) {
                      categories.push(subCategory.title);
                    }
                  }
                  item.categories = categories;
                } else {
                  for (let i of item.categories) {
                    let subCategory = await MasterSubCategoryHealthcare.findOne(
                      {
                        _id: mongoose.Types.ObjectId(i),
                      }
                    );
                    if (subCategory) {
                      categories.push(subCategory.title);
                    }

                    let subSubCategory =
                      await MasterSubSubCategoryHealthcare.findOne({
                        _id: mongoose.Types.ObjectId(i),
                      });
                    if (subSubCategory) {
                      categories.push(subSubCategory.title);
                    }
                  }
                }

                item.categories = categories;
              }
            } else {
              products = await storeProducts.aggregate([
                {
                  $match: {
                    type: req.body.type,
                    storeId: req.user._id,
                    stock: 0,
                  },
                },
                {
                  $project: {
                    _id: "$varientId",
                    storeId: 1,
                    productId: 1,
                    stock: 1,
                    price: 1,
                    specialPrice: 1,
                    skuOrHsnNo: 1,
                    expiryDate: 1,
                    type: 1,
                  },
                },
                {
                  $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product",
                  },
                },
              ]);

              for (let item of products) {
                console.log("wizard", products.indexOf(item));
                let categories = [];

                item.categories = item.product[0].categories;
                item.productId = item.product[0].productId;
                item.name = item.product[0].name;
                item.brand = item.product[0].brand;

                for (let eachPricing of item.product[0].pricing) {
                  console.log("heeeeelo", eachPricing);
                  console.log("yyyy:", item._id);
                  if (eachPricing._id + "" == item._id + "") {
                    console.log("OOOOOIII");
                    item.sku = eachPricing.sku;
                    item.image = process.env.BASE_URL + eachPricing.image[0];
                  }
                }

                // category filtering
                console.log(
                  "ite.categories:",
                  item.categories,
                  "body",
                  req.body.categoryId
                );
                if (item.categories.includes(req.body.categoryId)) {
                  if (item.type == "medicine") {
                    for (let i of item.categories) {
                      let subCategory = await MasterSubCategoryMedicine.findOne(
                        {
                          _id: mongoose.Types.ObjectId(i),
                        }
                      );
                      if (subCategory) {
                        categories.push(subCategory.title);
                      }
                    }
                    item.categories = categories;
                  } else {
                    for (let i of item.categories) {
                      let subCategory =
                        await MasterSubCategoryHealthcare.findOne({
                          _id: mongoose.Types.ObjectId(i),
                        });
                      if (subCategory) {
                        categories.push(subCategory.title);
                      }
                      let subSubCategory =
                        await MasterSubSubCategoryHealthcare.findOne({
                          _id: mongoose.Types.ObjectId(i),
                        });
                      if (subSubCategory) {
                        categories.push(subSubCategory.title);
                      }
                    }
                  }
                  item.categories = categories;

                  steppiny.push(item);
                } else {
                  console.log("in elsy");
                  // products.splice(products.indexOf(item),1)
                }
              }
            }
          } else {
            return res.status(422).json({
              status: false,
              message: "categoryId missing",
            });
          }

          let newArray = [];
          let ids = [];

          console.log("newresul===", newArray);
          let newResults = [];

          if (req.body.categoryId != "all") {
            products = steppiny;
          }

          for (let data of products) {
            console.log(data.image);
            console.log("dataaaaaa.sku", data);

            let sku = await MasterUomValue.findOne({ _id: data.sku });
            let brand = await MasterBrand.findOne({ _id: data.brand });
            let obj = {
              productId: data.productId,
              name: data.name,
              category: data.categories,
              skuOrHsnNo: data.skuOrHsnNo,
              price: data.price,
              specialPrice: data.specialPrice,
              stock: data.stock,
              image: data.image,
              _id: data._id,
              expiryDate: data.expiryDate,
            };
            if (sku) {
              obj.sku = sku.uomValue;
            }
            if (brand) {
              obj.brand = brand.title;
            }
            if (data.expiryDate) {
              obj.expiryDate = data.expiryDate;
            }
            if (newResults.includes(obj)) {
            } else {
              newResults.push(obj);
            }
          }
          let newData = [...new Set(newResults)];
          let page = parseInt(req.body.page) - 1;
          let limit = parseInt(req.body.limit);
          let nextPage = false;
          let start = page * limit;
          let end = page * limit + limit;
          let newResult = newData.slice(start, end);

          if (newData.length > end) {
            nextPage = true;
          } else {
            nextPage = false;
          }
          let totalPage = Math.ceil(newData.length / limit);

          res.status(200).json({
            status: true,
            message: "success",
            data: {
              product_varients: newResult,
              nextPage: nextPage,
              totalPage: totalPage,
            },
          });
        } else {
          res.status(422).json({
            status: false,
            message: "Invalid type",
          });
        }
      } else {
        res.status(422).json({
          status: false,
          message: "Invalid type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getInventoryLowStockVarientsOfStore: async (req, res, next) => {
    try {
      if (req.body.type) {
        if (req.body.type == "healthcare" || req.body.type == "medicine") {
          let products = [];
          let steppiny = [];

          if (req.body.categoryId) {
            if (req.body.categoryId == "all") {
              products = await storeProducts
                .find({ type: req.body.type, storeId: req.user._id })
                .populate({ path: "productId", select: ["stockAlert"] })
                .lean();
              console.log("findd productss", products);

              products = products.filter(
                (each) =>
                  each.stock <= each.productId.stockAlert && each.stock != 0
              );
              console.log("after filterink", products);

              // loop for getting category's title of products list
              for (let item of products) {
                console.log("before _id___________:", item._id);
                item._id = item.varientId;
                console.log("after _id___________:", item._id);
                let categories = [];

                let product = await Inventory.findOne({
                  "pricing._id": item.varientId,
                }).lean();
                console.log("producccctttttttt:", product);

                item.productId = product.productId;
                item.name = product.name;
                item.categories = product.categories;
                item.brand = product.brand;

                for (let eachPricing of product.pricing) {
                  console.log("heeeeelo", eachPricing);
                  console.log("yyyy:", item._id);
                  if (eachPricing._id + "" == item._id + "") {
                    console.log("OOOOOIII");
                    item.sku = eachPricing.sku;
                    item.image = process.env.BASE_URL + eachPricing.image[0];
                  }
                }

                console.log("after producty:::_:", item);

                if (req.body.type == "medicine") {
                  for (let i of item.categories) {
                    let subCategory = await MasterSubCategoryMedicine.findOne({
                      _id: mongoose.Types.ObjectId(i),
                    });
                    if (subCategory) {
                      categories.push(subCategory.title);
                    }
                  }
                  item.categories = categories;
                } else {
                  for (let i of item.categories) {
                    let subCategory = await MasterSubCategoryHealthcare.findOne(
                      {
                        _id: mongoose.Types.ObjectId(i),
                      }
                    );
                    if (subCategory) {
                      categories.push(subCategory.title);
                    }

                    let subSubCategory =
                      await MasterSubSubCategoryHealthcare.findOne({
                        _id: mongoose.Types.ObjectId(i),
                      });
                    if (subSubCategory) {
                      categories.push(subSubCategory.title);
                    }
                  }
                }

                item.categories = categories;
              }
            } else {
              products = await storeProducts.aggregate([
                { $match: { type: req.body.type, storeId: req.user._id } },
                {
                  $project: {
                    _id: "$varientId",
                    storeId: 1,
                    productId: 1,
                    stock: 1,
                    price: 1,
                    specialPrice: 1,
                    skuOrHsnNo: 1,
                    expiryDate: 1,
                    type: 1,
                  },
                },
                {
                  $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product",
                  },
                },
              ]);

              products = products.filter(
                (each) =>
                  each.stock <= each.product[0].stockAlert && each.stock != 0
              );

              for (let item of products) {
                let categories = [];

                item.categories = item.product[0].categories;
                item.productId = item.product[0].productId;
                item.name = item.product[0].name;
                item.brand = item.product[0].brand;

                for (let eachPricing of item.product[0].pricing) {
                  console.log("heeeeelo", eachPricing);
                  console.log("yyyy:", item._id);
                  if (eachPricing._id + "" == item._id + "") {
                    console.log("OOOOOIII");
                    item.sku = eachPricing.sku;
                    item.image = process.env.BASE_URL + eachPricing.image[0];
                  }
                }

                // category filtering
                if (item.categories.includes(req.body.categoryId)) {
                  if (item.type == "medicine") {
                    for (let i of item.categories) {
                      let subCategory = await MasterSubCategoryMedicine.findOne(
                        {
                          _id: mongoose.Types.ObjectId(i),
                        }
                      );
                      if (subCategory) {
                        categories.push(subCategory.title);
                      }
                    }
                    item.categories = categories;
                  } else {
                    for (let i of item.categories) {
                      let subCategory =
                        await MasterSubCategoryHealthcare.findOne({
                          _id: mongoose.Types.ObjectId(i),
                        });
                      if (subCategory) {
                        categories.push(subCategory.title);
                      }

                      let subSubCategory =
                        await MasterSubSubCategoryHealthcare.findOne({
                          _id: mongoose.Types.ObjectId(i),
                        });
                      if (subSubCategory) {
                        categories.push(subSubCategory.title);
                      }
                    }
                  }

                  item.categories = categories;

                  steppiny.push(item);
                } else {
                  console.log("elsyyy");
                }
              }
            }
          } else {
            return res.status(422).json({
              status: false,
              message: "categoryId missing",
            });
          }

          let newArray = [];
          let ids = [];

          console.log("newresul===", newArray);
          let newResults = [];

          if (req.body.categoryId != "all") {
            products = steppiny;
          }

          for (let data of products) {
            console.log(data.image);
            console.log("dataaaaaa.sku", data);

            let sku = await MasterUomValue.findOne({ _id: data.sku });
            let brand = await MasterBrand.findOne({ _id: data.brand });
            let obj = {
              productId: data.productId,
              name: data.name,
              category: data.categories,
              skuOrHsnNo: data.skuOrHsnNo,
              price: data.price,
              specialPrice: data.specialPrice,
              stock: data.stock,
              image: data.image,
              _id: data._id,
              expiryDate: data.expiryDate,
            };
            if (sku) {
              obj.sku = sku.uomValue;
            }
            if (brand) {
              obj.brand = brand.title;
            }
            if (data.expiryDate) {
              obj.expiryDate = data.expiryDate;
            }
            if (newResults.includes(obj)) {
            } else {
              newResults.push(obj);
            }
          }
          let newData = [...new Set(newResults)];
          let page = parseInt(req.body.page) - 1;
          let limit = parseInt(req.body.limit);
          let nextPage = false;
          let start = page * limit;
          let end = page * limit + limit;
          let newResult = newData.slice(start, end);

          if (newData.length > end) {
            nextPage = true;
          } else {
            nextPage = false;
          }
          let totalPage = Math.ceil(newData.length / limit);

          res.status(200).json({
            status: true,
            message: "success",
            data: {
              product_varients: newResult,
              nextPage: nextPage,
              totalPage: totalPage,
            },
          });
        } else {
          res.status(422).json({
            status: false,
            message: "Invalid type",
          });
        }
      } else {
        res.status(422).json({
          status: false,
          message: "Invalid type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getInventoryVarientById: async (req, res, next) => {
    try {
      let varient = await Inventory.aggregate([
        { $match: { "pricing._id": mongoose.Types.ObjectId(req.params.id) } },
        {
          $project: {
            pricing: {
              $filter: {
                input: "$pricing",
                as: "pricing",
                cond: {
                  $gte: [
                    "$$pricing._id",
                    mongoose.Types.ObjectId(req.params.id),
                  ],
                },
              },
            },
            _id: 0,
          },
        },
        { $unwind: "$pricing" },
        {
          $project: {
            "product_varient.price": "$pricing.price",
            "product_varient.specialPrice": "$pricing.specialPrice",
            "product_varient.stock": "$pricing.stock",
          },
        },
      ]);

      if (varient.length) {
        varient = varient[0];
      }

      if (varient) {
        res.status(200).json({
          status: true,
          message: "success",
          data: varient,
        });
      } else {
        res.status(422).json({
          status: false,
          message: "Invalid id",
        });
      }
      res.status();
    } catch (error) {
      next(error);
    }
  },
  editInventoryVarient: async (req, res, next) => {
    try {
      Inventory.findOne({ "pricing._id": req.params.id })
        .then((response) => {
          if (response) {
            let data = [];
            for (let item of response.pricing) {
              if (item._id == req.params.id) {
                if (req.body.price) {
                  item.price = req.body.price;
                }
                if (req.body.specialPrice) {
                  item.specialPrice = req.body.specialPrice;
                }
                if (req.body.stock) {
                  item.stock = req.body.stock;
                }
                if (req.body.skuOrHsnNo) {
                  item.skuOrHsnNo = req.body.skuOrHsnNo;
                }
                if (req.body.expiryDate) {
                  item.expiryDate = req.body.expiryDate;
                }

                item._id = req.params.id;
              }
              data.push(item);
            }
            response.pricing = data;
            Inventory.updateOne({ _id: response._id }, response).then((r) => {
              res.status(200).json({
                status: true,
                data: "Stock Updated",
              });
            });
          } else {
            res.status(422).json({
              status: false,
              data: "invalid Varient ID",
            });
          }
        })
        .catch((error) => {
          res.status(422).json({
            status: false,
            data: error + "",
          });
        });
    } catch (error) {
      next(error);
    }
  },
  uploadInventoryImage: async (req, res, next) => {
    try {
      if (req.file) {
        let image = `${process.env.BASE_URL}inventory/${req.file.filename}`;
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
  uploadInventoryVideo: async (req, res, next) => {
    try {
      if (req.file) {
        var fileInfoVideo = {};
        var fileInfoThumbnail = {};
        fileInfoVideo = req.file;
        filType = "video";
        checkfileType(filType, fileInfoVideo);

        if (imageError != "false") {
          await unlinkAsync(req.file.path);

          res.status(422).json({
            status: false,
            data: imageError,
          });
          imageError = "false";
        } else {
          let file_name = `./public/images/inventory/${fileInfoVideo.filename}`;

          await client.upload(
            file_name,
            {
              name: "inventory",
              description: "The description goes here.",
            },
            function (uri) {
              let splittedUri = uri.split("/");

              res.status(200).json({
                status: true,
                message: "uploaded successfully",
                data: {
                  video_path: splittedUri[2],
                },
              });
            },
            function (bytes_uploaded, bytes_total) {
              var percentage = ((bytes_uploaded / bytes_total) * 100).toFixed(
                2
              );
              console.log(percentage + "%");
            },
            async function (error) {
              await unlinkAsync(req.file.path);
              res.status(429).json({
                status: false,
                error: error,
              });
              // console.log('Failed because: ' + error)
              // throw error
            }
          );
        }
      } else {
        res.status(422).json({
          status: false,
          message: "Please upload video",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteInventoryImage: async (req, res, next) => {
    try {
      if (req.body.image_path) {
        let baseurl = process.env.BASE_URL;

        req.body.image_path = req.body.image_path.replace(baseurl, "");

        let splittedImageRoute = req.body.image_path.split("/");

        if (splittedImageRoute) {
          if (
            fs.existsSync(`./public/images/inventory/${splittedImageRoute[1]}`)
          ) {
            fs.unlink(
              `./public/images/inventory/${splittedImageRoute[1]}`,
              function (err) {
                if (err) throw err;

                console.log("old image deleted!");
                return res.status(200).json({
                  status: true,
                  message: "Image deleted",
                });
              }
            );
          }
        }
      } else {
        res.status(422).json({
          status: false,
          message: "Image path missing",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteInventoryVideo: async (req, res, next) => {
    try {
      if (req.body.video_id) {
        let config = {
          headers: {
            Authorization: "Bearer " + process.env.VIMEO_ACCESS_TOKEN,
          },
        };

        axios
          .delete(`https://api.vimeo.com/videos/${req.body.video_id}`, config)
          .then((response) => {
            return res.status(200).json({
              status: true,
              message: "Video deleted",
            });
          });
      } else {
        res.status(422).json({
          status: false,
          message: "Video id missing",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  searchInventoryListing: async (req, res, next) => {
    try {
      let result = [];
      let productIds = [];
      let finalResult = [];

      if (req.body.type == "medicine") {
        let keyword = req.body.keyword;
        let brand = await MasterBrand.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subCategory = await MasterSubCategoryMedicine.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let productById = await Inventory.find(
          {
            productId: { $regex: `${keyword}`, $options: "i" },
            type: "medicine",
          },
          {
            productId: 1,
            name: 1,
            categories: 1,
            brand: 1,
            isDisabled: 1,
            pricing: 1,
          }
        )
          .populate({ path: "brand", select: ["title"] })
          .lean();
        let productByName = await Inventory.find(
          { name: { $regex: `${keyword}`, $options: "i" }, type: "medicine" },
          {
            productId: 1,
            name: 1,
            categories: 1,
            brand: 1,
            isDisabled: 1,
            pricing: 1,
          }
        )
          .populate({ path: "brand", select: ["title"] })
          .lean();
        console.log(subCategory);
        if (brand.length) {
          for (let item of brand) {
            let products = await Inventory.find(
              { type: "medicine", brand: item._id },
              {
                productId: 1,
                name: 1,
                categories: 1,
                brand: 1,
                isDisabled: 1,
                pricing: 1,
              }
            )
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryMedicine.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        if (subCategory.length) {
          for (let item of subCategory) {
            let products = await Inventory.find(
              { type: "medicine", categories: item._id + "" },
              {
                productId: 1,
                name: 1,
                categories: 1,
                brand: 1,
                isDisabled: 1,
                pricing: 1,
              }
            )
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryMedicine.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        for (let item of productById) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryMedicine.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of productByName) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryMedicine.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of result) {
          if (!productIds.includes(item.productId)) {
            productIds.push(item.productId);
            finalResult.push(item);
          }
        }
        for (let item of finalResult) {
          item.image = process.env.BASE_URL.concat(item.pricing[0].image[0]);
          delete item.pricing;
        }
        let newData = [...new Set(finalResult)];

        let page = parseInt(req.body.page) - 1;
        let limit = parseInt(req.body.limit);

        let nextPage = false;
        let start = page * limit;
        let end = page * limit + limit;
        let newResult = newData.slice(start, end);
        if (newData.length > end) {
          nextPage = true;
        } else {
          nextPage = false;
        }
        if (newData.length == 0) {
          nextPage = false;
        }
        let totalPage = Math.ceil(newData.length / limit);
        res.status(200).json({
          status: true,
          data: {
            result: newResult,
            nextPage: nextPage,
            totalPage: totalPage,
          },
        });
      } else {
        let keyword = req.body.keyword;
        let brand = await MasterBrand.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subCategory = await MasterSubCategoryHealthcare.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subSubCategory = await MasterSubCategoryHealthcare.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });

        let productById = await Inventory.find(
          {
            productId: { $regex: `${keyword}`, $options: "i" },
            type: "healthcare",
          },
          {
            productId: 1,
            name: 1,
            categories: 1,
            brand: 1,
            isDisabled: 1,
            pricing: 1,
          }
        )
          .populate({ path: "brand", select: ["title"] })
          .lean();
        let productByName = await Inventory.find(
          { name: { $regex: `${keyword}`, $options: "i" }, type: "healthcare" },
          {
            productId: 1,
            name: 1,
            categories: 1,
            brand: 1,
            isDisabled: 1,
            pricing: 1,
          }
        )
          .populate({ path: "brand", select: ["title"] })
          .lean();

        if (brand.length) {
          for (let item of brand) {
            let products = await Inventory.find(
              { type: "healthcare", brand: item._id },
              {
                productId: 1,
                name: 1,
                categories: 1,
                brand: 1,
                isDisabled: 1,
                pricing: 1,
              }
            )
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryHealthcare.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }

                let subSubCategory =
                  await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                if (subSubCategory) {
                  categories.push(subSubCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        if (subCategory.length) {
          for (let item of subCategory) {
            let products = await Inventory.find(
              { type: "healthcare", categories: item._id + "" },
              {
                productId: 1,
                name: 1,
                categories: 1,
                brand: 1,
                isDisabled: 1,
                pricing: 1,
              }
            )
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryHealthcare.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }

                let subSubCategory =
                  await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                if (subSubCategory) {
                  categories.push(subSubCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        for (let item of subSubCategory) {
          let products = await Inventory.find(
            { type: "healthcare", categories: item._id + "" },
            {
              productId: 1,
              name: 1,
              categories: 1,
              brand: 1,
              isDisabled: 1,
              pricing: 1,
            }
          )
            .populate({ path: "brand", select: ["title"] })
            .lean();
          for (let product of products) {
            let categories = [];
            for (let i of product.categories) {
              let subCategory = await MasterSubCategoryHealthcare.findOne({
                _id: mongoose.Types.ObjectId(i),
              });
              if (subCategory) {
                categories.push(subCategory.title);
              }

              let subSubCategory = await MasterSubSubCategoryHealthcare.findOne(
                {
                  _id: mongoose.Types.ObjectId(i),
                }
              );
              if (subSubCategory) {
                categories.push(subSubCategory.title);
              }
            }
            product.categories = categories;
            if (!result.includes(product)) {
              result.push(product);
            }
          }
        }
        for (let item of productById) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }

            let subSubCategory = await MasterSubSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subSubCategory) {
              categories.push(subSubCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of productByName) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }

            let subSubCategory = await MasterSubSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subSubCategory) {
              categories.push(subSubCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of result) {
          if (!productIds.includes(item.productId)) {
            productIds.push(item.productId);
            finalResult.push(item);
          }
        }
        for (let item of finalResult) {
          item.image = process.env.BASE_URL.concat(item.pricing[0].image[0]);
          delete item.pricing;
        }
        let page = parseInt(req.body.page) - 1;
        let limit = parseInt(req.body.limit);
        console.log(finalResult.length);

        let nextPage = false;
        let start = page * limit;
        let end = page * limit + limit;
        let newResult = finalResult.slice(start, end);
        if (finalResult.length > end) {
          nextPage = true;
        } else {
          nextPage = false;
        }
        if (finalResult.length == 0) {
          nextPage = false;
        }
        let totalPage = Math.ceil(finalResult.length / limit);

        res.status(200).json({
          status: true,
          data: {
            result: newResult,
            nextPage: nextPage,
            totalPage: totalPage,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  },
  searchStockListing: async (req, res, next) => {
    try {
      let result = [];
      let productIds = [];
      let finalResult = [];
      let varient_ids = [];

      if (req.body.type == "medicine") {
        let keyword = req.body.keyword;
        let brand = await MasterBrand.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subCategory = await MasterSubCategoryMedicine.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let productById = await Inventory.find({
          productId: { $regex: `${keyword}`, $options: "i" },
          type: "medicine",
        }).populate({ path: "brand", select: ["title"] });
        let productByName = await Inventory.find({
          name: { $regex: `${keyword}`, $options: "i" },
          type: "medicine",
        })
          .populate({ path: "brand", select: ["title"] })

          .lean();
        console.log(subCategory);
        if (brand.length) {
          for (let item of brand) {
            let products = await Inventory.find({
              type: "medicine",
              brand: item._id,
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryMedicine.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        if (subCategory.length) {
          for (let item of subCategory) {
            let products = await Inventory.find({
              type: "medicine",
              categories: item._id + "",
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryMedicine.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        for (let item of productById) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryMedicine.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of productByName) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryMedicine.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }

        for (let item of result) {
          for (let data of item.pricing) {
            if (!varient_ids.includes(data.skuOrHsnNo)) {
              varient_ids.push(data.skuOrHsnNo);

              let sku = await MasterUomValue.findOne({ _id: data.sku });

              let obj = {
                productId: item.productId,
                name: item.name,
                category: item.categories,
                brand: item.brand.title,
                sku: data.sku,
                skuOrHsnNo: data.skuOrHsnNo,
                price: data.price,
                specialPrice: data.specialPrice,
                stock: data.stock,
                image: process.env.BASE_URL.concat(data.image[0]),
                _id: data._id,
                expiryDate: data.expiryDate,
              };
              if (sku) {
                obj.sku = sku.uomValue;
              }
              finalResult.push(obj);
            }
          }
        }
        let page = parseInt(req.body.page) - 1;
        let limit = parseInt(req.body.limit);
        console.log(finalResult.length);

        let nextPage = false;
        let start = page * limit;
        let end = page * limit + limit;
        let newResult = finalResult.slice(start, end);
        if (finalResult.length > end) {
          nextPage = true;
        } else {
          nextPage = false;
        }
        if (finalResult.length == 0) {
          nextPage = false;
        }
        let totalPage = Math.ceil(finalResult.length / limit);

        res.status(200).json({
          status: true,
          data: {
            result: newResult,
            nextPage: nextPage,
            totalPage: totalPage,
          },
        });
      } else {
        let keyword = req.body.keyword;
        let brand = await MasterBrand.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subCategory = await MasterSubCategoryHealthcare.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subSubCategory = await MasterSubCategoryHealthcare.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });

        let productById = await Inventory.find({
          productId: { $regex: `${keyword}`, $options: "i" },
          type: "healthcare",
        }).populate({ path: "brand", select: ["title"] });
        let productByName = await Inventory.find({
          name: { $regex: `${keyword}`, $options: "i" },
          type: "healthcare",
        })
          .populate({ path: "brand", select: ["title"] })

          .lean();

        if (brand.length) {
          for (let item of brand) {
            let products = await Inventory.find({
              type: "healthcare",
              brand: item._id,
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryHealthcare.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }

                let subSubCategory =
                  await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                if (subSubCategory) {
                  categories.push(subSubCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        if (subCategory.length) {
          for (let item of subCategory) {
            let products = await Inventory.find({
              type: "healthcare",
              categories: item._id + "",
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryHealthcare.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }

                let subSubCategory =
                  await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                if (subSubCategory) {
                  categories.push(subSubCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        for (let item of subSubCategory) {
          let products = await Inventory.find({
            type: "healthcare",
            categories: item._id + "",
          })
            .populate({ path: "brand", select: ["title"] })
            .lean();
          for (let product of products) {
            let categories = [];
            for (let i of product.categories) {
              let subCategory = await MasterSubCategoryHealthcare.findOne({
                _id: mongoose.Types.ObjectId(i),
              });
              if (subCategory) {
                categories.push(subCategory.title);
              }

              let subSubCategory = await MasterSubSubCategoryHealthcare.findOne(
                {
                  _id: mongoose.Types.ObjectId(i),
                }
              );
              if (subSubCategory) {
                categories.push(subSubCategory.title);
              }
            }
            product.categories = categories;
            if (!result.includes(product)) {
              result.push(product);
            }
          }
        }
        for (let item of productById) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }

            let subSubCategory = await MasterSubSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subSubCategory) {
              categories.push(subSubCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of productByName) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }

            let subSubCategory = await MasterSubSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subSubCategory) {
              categories.push(subSubCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of result) {
          for (let data of item.pricing) {
            if (!varient_ids.includes(data.skuOrHsnNo)) {
              varient_ids.push(data.skuOrHsnNo);

              let sku = await MasterUomValue.findOne({ _id: data.sku });
              let obj = {
                productId: item.productId,
                name: item.name,
                category: item.categories,
                brand: item.brand.title,
                sku: data.sku,
                skuOrHsnNo: data.skuOrHsnNo,
                price: data.price,
                specialPrice: data.specialPrice,
                stock: data.stock,
                image: process.env.BASE_URL.concat(data.image[0]),
                _id: data._id,
              };
              if (sku) {
                obj.sku = sku.uomValue;
              }

              finalResult.push(obj);
            }
          }
        }
        let page = parseInt(req.body.page) - 1;
        let limit = parseInt(req.body.limit);
        let nextPage = false;
        let start = page * limit;
        let end = page * limit + limit;
        let newResult = finalResult.slice(start, end);
        if (finalResult.length > end) {
          nextPage = true;
        } else {
          nextPage = false;
        }
        if (finalResult.length == 0) {
          nextPage = false;
        }
        let totalPage = Math.ceil(finalResult.length / limit);

        res.status(200).json({
          status: true,
          data: {
            result: newResult,
            nextPage: nextPage,
            totalPage: totalPage,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getProductIdCode: async (req, res, next) => {
    try {
      if (req.params.type == "healthcare") {
        let valid = await productIdCount.findOne({ type: req.params.type });
        if (valid) {
          res.status(200).json({
            status: true,
            data: {
              count: valid.count,
            },
          });
        } else {
          let data = {
            count: 1,
            type: req.params.type,
          };
          let obj = productIdCount(data);
          obj.save().then((_) => {
            res.status(200).json({
              status: true,
              data: {
                count: 1,
              },
            });
          });
        }
      } else if (req.params.type == "medicine") {
        let valid = await productIdCount.findOne({ type: req.params.type });
        if (valid) {
          res.status(200).json({
            status: true,
            data: {
              count: valid.count,
            },
          });
        } else {
          let data = {
            count: 1,
            type: req.params.type,
          };
          let obj = productIdCount(data);
          obj.save().then((_) => {
            res.status(200).json({
              status: true,
              data: {
                count: 1,
              },
            });
          });
        }
      }
    } catch (error) {
      next(error);
    }
  },
  searchStoreStockListing: async (req, res, next) => {
    try {
      let result = [];
      let productIds = [];
      let finalResult = [];
      let varient_ids = [];

      if (req.body.type == "medicine") {
        let keyword = req.body.keyword;
        let brand = await MasterBrand.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subCategory = await MasterSubCategoryMedicine.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let productById = await Inventory.find({
          productId: { $regex: `${keyword}`, $options: "i" },
          type: "medicine",
        }).populate({ path: "brand", select: ["title"] });
        let productByName = await Inventory.find({
          name: { $regex: `${keyword}`, $options: "i" },
          type: "medicine",
        })
          .populate({ path: "brand", select: ["title"] })

          .lean();
        console.log(subCategory);
        if (brand.length) {
          for (let item of brand) {
            let products = await Inventory.find({
              type: "medicine",
              brand: item._id,
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryMedicine.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        if (subCategory.length) {
          for (let item of subCategory) {
            let products = await Inventory.find({
              type: "medicine",
              categories: item._id + "",
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryMedicine.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        for (let item of productById) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryMedicine.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of productByName) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryMedicine.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        // ^^ result array completed with all searched products ^^

        let storeVarients = await storeProducts.find({
          type: req.body.type,
          storeId: req.user.id,
        });
        console.log("store_varients________", storeVarients);
        console.log("result_array___>", result);

        let resultId = [];

        for (let item of result) {
          resultId.push(item._id);
          for (let data of item.pricing) {
            for (let storeVarient of storeVarients) {
              console.log(
                "storeVarient.varientId",
                storeVarient.varientId,
                "pricing._id",
                data._id
              );
              console.log(
                "typeof both",
                typeof (storeVarient.varientId + ""),
                "_",
                typeof (data._id + "")
              );
              let storeVarientId = storeVarient.varientId + "";
              let pricing_id = data._id + "";
              console.log(
                "new variables:::___:",
                storeVarientId,
                "__",
                pricing_id
              );
              console.log(
                "new variables types:::___:",
                typeof storeVarientId,
                "__",
                typeof pricing_id
              );
              if (storeVarient.varientId + "" == data._id + "") {
                console.log("inside thissss if_____:_____");

                // duplication checking
                if (!varient_ids.includes(data.skuOrHsnNo)) {
                  varient_ids.push(data.skuOrHsnNo);
                  console.log("in______includes____if____:", varient_ids);

                  let sku = await MasterUomValue.findOne({ _id: data.sku });

                  let obj = {
                    productId: item.productId,
                    name: item.name,
                    category: item.categories,
                    brand: item.brand.title,
                    sku: data.sku,
                    skuOrHsnNo: storeVarient.skuOrHsnNo,
                    price: storeVarient.price,
                    specialPrice: storeVarient.specialPrice,
                    stock: storeVarient.stock,
                    image: process.env.BASE_URL.concat(data.image[0]),
                    _id: data._id,
                    expiryDate: storeVarient.expiryDate,
                  };
                  if (sku) {
                    obj.sku = sku.uomValue;
                  }
                  finalResult.push(obj);
                }
                console.log("outside thissss if_____:_____");
              }
            }
          }
        }
        console.log("resutlIdss", resultId);
        let page = parseInt(req.body.page) - 1;
        let limit = parseInt(req.body.limit);
        console.log(finalResult.length);

        let nextPage = false;
        let start = page * limit;
        let end = page * limit + limit;
        let newResult = finalResult.slice(start, end);
        if (finalResult.length > end) {
          nextPage = true;
        } else {
          nextPage = false;
        }
        if (finalResult.length == 0) {
          nextPage = false;
        }
        let totalPage = Math.ceil(finalResult.length / limit);

        res.status(200).json({
          status: true,
          data: {
            result: newResult,
            nextPage: nextPage,
            totalPage: totalPage,
          },
        });
      } else {
        let keyword = req.body.keyword;
        let brand = await MasterBrand.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subCategory = await MasterSubCategoryHealthcare.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subSubCategory = await MasterSubCategoryHealthcare.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });

        let productById = await Inventory.find({
          productId: { $regex: `${keyword}`, $options: "i" },
          type: "healthcare",
        }).populate({ path: "brand", select: ["title"] });
        let productByName = await Inventory.find({
          name: { $regex: `${keyword}`, $options: "i" },
          type: "healthcare",
        })
          .populate({ path: "brand", select: ["title"] })

          .lean();

        if (brand.length) {
          for (let item of brand) {
            let products = await Inventory.find({
              type: "healthcare",
              brand: item._id,
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryHealthcare.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }

                let subSubCategory =
                  await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                if (subSubCategory) {
                  categories.push(subSubCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        if (subCategory.length) {
          for (let item of subCategory) {
            let products = await Inventory.find({
              type: "healthcare",
              categories: item._id + "",
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryHealthcare.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }

                let subSubCategory =
                  await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                if (subSubCategory) {
                  categories.push(subSubCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        for (let item of subSubCategory) {
          let products = await Inventory.find({
            type: "healthcare",
            categories: item._id + "",
          })
            .populate({ path: "brand", select: ["title"] })
            .lean();
          for (let product of products) {
            let categories = [];
            for (let i of product.categories) {
              let subCategory = await MasterSubCategoryHealthcare.findOne({
                _id: mongoose.Types.ObjectId(i),
              });
              if (subCategory) {
                categories.push(subCategory.title);
              }

              let subSubCategory = await MasterSubSubCategoryHealthcare.findOne(
                {
                  _id: mongoose.Types.ObjectId(i),
                }
              );
              if (subSubCategory) {
                categories.push(subSubCategory.title);
              }
            }
            product.categories = categories;
            if (!result.includes(product)) {
              result.push(product);
            }
          }
        }
        for (let item of productById) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }

            let subSubCategory = await MasterSubSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subSubCategory) {
              categories.push(subSubCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of productByName) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }

            let subSubCategory = await MasterSubSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subSubCategory) {
              categories.push(subSubCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }

        let storeVarients = await storeProducts.find({
          type: req.body.type,
          storeId: req.user.id,
        });
        console.log("store_varients________", storeVarients);
        console.log("result_array___>", result);

        for (let item of result) {
          for (let data of item.pricing) {
            for (let storeVarient of storeVarients) {
              console.log(
                "storeVarient.varientId",
                storeVarient.varientId,
                "pricing._id",
                data._id
              );
              console.log(
                "typeof both",
                typeof (storeVarient.varientId + ""),
                "_",
                typeof (data._id + "")
              );
              let storeVarientId = storeVarient.varientId + "";
              let pricing_id = data._id + "";
              console.log(
                "new variables:::___:",
                storeVarientId,
                "__",
                pricing_id
              );
              console.log(
                "new variables types:::___:",
                typeof storeVarientId,
                "__",
                typeof pricing_id
              );
              if (storeVarient.varientId + "" == data._id + "") {
                console.log("inside thissss if_____:_____");

                // duplication checking
                if (!varient_ids.includes(data.skuOrHsnNo)) {
                  varient_ids.push(data.skuOrHsnNo);

                  let sku = await MasterUomValue.findOne({ _id: data.sku });
                  let obj = {
                    productId: item.productId,
                    name: item.name,
                    category: item.categories,
                    brand: item.brand.title,
                    sku: data.sku,
                    skuOrHsnNo: storeVarient.skuOrHsnNo,
                    price: storeVarient.price,
                    specialPrice: storeVarient.specialPrice,
                    stock: storeVarient.stock,
                    image: process.env.BASE_URL.concat(data.image[0]),
                    _id: data._id,
                  };
                  if (sku) {
                    obj.sku = sku.uomValue;
                  }

                  finalResult.push(obj);
                }
              }
            }
          }
        }
        let page = parseInt(req.body.page) - 1;
        let limit = parseInt(req.body.limit);
        let nextPage = false;
        let start = page * limit;
        let end = page * limit + limit;
        let newResult = finalResult.slice(start, end);
        if (finalResult.length > end) {
          nextPage = true;
        } else {
          nextPage = false;
        }
        if (finalResult.length == 0) {
          nextPage = false;
        }
        let totalPage = Math.ceil(finalResult.length / limit);

        res.status(200).json({
          status: true,
          data: {
            result: newResult,
            nextPage: nextPage,
            totalPage: totalPage,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  },
  searchOutOfStockListing: async (req, res, next) => {
    try {
      let result = [];
      let productIds = [];
      let finalResult = [];
      let varient_ids = [];

      if (req.body.type == "medicine") {
        let keyword = req.body.keyword;
        let brand = await MasterBrand.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subCategory = await MasterSubCategoryMedicine.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let productById = await Inventory.find({
          productId: { $regex: `${keyword}`, $options: "i" },
          type: "medicine",
        }).populate({ path: "brand", select: ["title"] });
        let productByName = await Inventory.find({
          name: { $regex: `${keyword}`, $options: "i" },
          type: "medicine",
        })
          .populate({ path: "brand", select: ["title"] })

          .lean();
        console.log(subCategory);
        if (brand.length) {
          for (let item of brand) {
            let products = await Inventory.find({
              type: "medicine",
              brand: item._id,
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryMedicine.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        if (subCategory.length) {
          for (let item of subCategory) {
            let products = await Inventory.find({
              type: "medicine",
              categories: item._id + "",
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryMedicine.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        for (let item of productById) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryMedicine.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of productByName) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryMedicine.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of result) {
          for (let data of item.pricing) {
            if (data.stock == 0) {
              // duplication checking
              if (!varient_ids.includes(data.skuOrHsnNo)) {
                varient_ids.push(data.skuOrHsnNo);

                let sku = await MasterUomValue.findOne({ _id: data.sku });

                let obj = {
                  productId: item.productId,
                  name: item.name,
                  category: item.categories,
                  brand: item.brand.title,
                  sku: data.sku,
                  skuOrHsnNo: data.skuOrHsnNo,
                  price: data.price,
                  specialPrice: data.specialPrice,
                  stock: data.stock,
                  image: process.env.BASE_URL.concat(data.image[0]),
                  _id: data._id,
                  expiryDate: data.expiryDate,
                };
                if (sku) {
                  obj.sku = sku.uomValue;
                }
                finalResult.push(obj);
              }
            }
          }
        }
        let page = parseInt(req.body.page) - 1;
        let limit = parseInt(req.body.limit);
        console.log(finalResult.length);

        let nextPage = false;
        let start = page * limit;
        let end = page * limit + limit;
        let newResult = finalResult.slice(start, end);
        if (finalResult.length > end) {
          nextPage = true;
        } else {
          nextPage = false;
        }
        if (finalResult.length == 0) {
          nextPage = false;
        }
        let totalPage = Math.ceil(finalResult.length / limit);

        res.status(200).json({
          status: true,
          data: {
            result: newResult,
            nextPage: nextPage,
            totalPage: totalPage,
          },
        });
      } else {
        let keyword = req.body.keyword;
        let brand = await MasterBrand.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subCategory = await MasterSubCategoryHealthcare.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subSubCategory = await MasterSubCategoryHealthcare.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });

        let productById = await Inventory.find({
          productId: { $regex: `${keyword}`, $options: "i" },
          type: "healthcare",
        }).populate({ path: "brand", select: ["title"] });
        let productByName = await Inventory.find({
          name: { $regex: `${keyword}`, $options: "i" },
          type: "healthcare",
        })
          .populate({ path: "brand", select: ["title"] })

          .lean();

        if (brand.length) {
          for (let item of brand) {
            let products = await Inventory.find({
              type: "healthcare",
              brand: item._id,
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryHealthcare.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }

                let subSubCategory =
                  await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                if (subSubCategory) {
                  categories.push(subSubCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        if (subCategory.length) {
          for (let item of subCategory) {
            let products = await Inventory.find({
              type: "healthcare",
              categories: item._id + "",
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryHealthcare.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }

                let subSubCategory =
                  await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                if (subSubCategory) {
                  categories.push(subSubCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        for (let item of subSubCategory) {
          let products = await Inventory.find({
            type: "healthcare",
            categories: item._id + "",
          })
            .populate({ path: "brand", select: ["title"] })
            .lean();
          for (let product of products) {
            let categories = [];
            for (let i of product.categories) {
              let subCategory = await MasterSubCategoryHealthcare.findOne({
                _id: mongoose.Types.ObjectId(i),
              });
              if (subCategory) {
                categories.push(subCategory.title);
              }

              let subSubCategory = await MasterSubSubCategoryHealthcare.findOne(
                {
                  _id: mongoose.Types.ObjectId(i),
                }
              );
              if (subSubCategory) {
                categories.push(subSubCategory.title);
              }
            }
            product.categories = categories;
            if (!result.includes(product)) {
              result.push(product);
            }
          }
        }
        for (let item of productById) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }

            let subSubCategory = await MasterSubSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subSubCategory) {
              categories.push(subSubCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of productByName) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }

            let subSubCategory = await MasterSubSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subSubCategory) {
              categories.push(subSubCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of result) {
          for (let data of item.pricing) {
            if (data.stock == 0) {
              // duplication checking
              if (!varient_ids.includes(data.skuOrHsnNo)) {
                varient_ids.push(data.skuOrHsnNo);

                let sku = await MasterUomValue.findOne({ _id: data.sku });
                let obj = {
                  productId: item.productId,
                  name: item.name,
                  category: item.categories,
                  brand: item.brand.title,
                  sku: data.sku,
                  skuOrHsnNo: data.skuOrHsnNo,
                  price: data.price,
                  specialPrice: data.specialPrice,
                  stock: data.stock,
                  image: process.env.BASE_URL.concat(data.image[0]),
                  _id: data._id,
                };
                if (sku) {
                  obj.sku = sku.uomValue;
                }

                finalResult.push(obj);
              }
            }
          }
        }
        let page = parseInt(req.body.page) - 1;
        let limit = parseInt(req.body.limit);
        let nextPage = false;
        let start = page * limit;
        let end = page * limit + limit;
        let newResult = finalResult.slice(start, end);
        if (finalResult.length > end) {
          nextPage = true;
        } else {
          nextPage = false;
        }
        if (finalResult.length == 0) {
          nextPage = false;
        }
        let totalPage = Math.ceil(finalResult.length / limit);

        res.status(200).json({
          status: true,
          data: {
            result: newResult,
            nextPage: nextPage,
            totalPage: totalPage,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  },
  searchLowStockListing: async (req, res, next) => {
    try {
      let result = [];
      let productIds = [];
      let finalResult = [];
      let varient_ids = [];

      if (req.body.type == "medicine") {
        let keyword = req.body.keyword;
        let brand = await MasterBrand.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subCategory = await MasterSubCategoryMedicine.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let productById = await Inventory.find({
          productId: { $regex: `${keyword}`, $options: "i" },
          type: "medicine",
        }).populate({ path: "brand", select: ["title"] });
        let productByName = await Inventory.find({
          name: { $regex: `${keyword}`, $options: "i" },
          type: "medicine",
        })
          .populate({ path: "brand", select: ["title"] })

          .lean();
        console.log(subCategory);
        if (brand.length) {
          for (let item of brand) {
            let products = await Inventory.find({
              type: "medicine",
              brand: item._id,
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryMedicine.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        if (subCategory.length) {
          for (let item of subCategory) {
            let products = await Inventory.find({
              type: "medicine",
              categories: item._id + "",
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryMedicine.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        for (let item of productById) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryMedicine.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of productByName) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryMedicine.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of result) {
          for (let data of item.pricing) {
            if (data.stock <= item.stockAlert && data.stock != 0) {
              // duplication checking
              if (!varient_ids.includes(data.skuOrHsnNo)) {
                varient_ids.push(data.skuOrHsnNo);

                let sku = await MasterUomValue.findOne({ _id: data.sku });

                let obj = {
                  productId: item.productId,
                  name: item.name,
                  category: item.categories,
                  brand: item.brand.title,
                  sku: data.sku,
                  skuOrHsnNo: data.skuOrHsnNo,
                  price: data.price,
                  specialPrice: data.specialPrice,
                  stock: data.stock,
                  image: process.env.BASE_URL.concat(data.image[0]),
                  _id: data._id,
                  expiryDate: data.expiryDate,
                };
                if (sku) {
                  obj.sku = sku.uomValue;
                }
                finalResult.push(obj);
              }
            }
          }
        }
        let page = parseInt(req.body.page) - 1;
        let limit = parseInt(req.body.limit);
        console.log(finalResult.length);

        let nextPage = false;
        let start = page * limit;
        let end = page * limit + limit;
        let newResult = finalResult.slice(start, end);
        if (finalResult.length > end) {
          nextPage = true;
        } else {
          nextPage = false;
        }
        if (finalResult.length == 0) {
          nextPage = false;
        }
        let totalPage = Math.ceil(finalResult.length / limit);

        res.status(200).json({
          status: true,
          data: {
            result: newResult,
            nextPage: nextPage,
            totalPage: totalPage,
          },
        });
      } else {
        let keyword = req.body.keyword;
        let brand = await MasterBrand.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subCategory = await MasterSubCategoryHealthcare.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subSubCategory = await MasterSubCategoryHealthcare.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });

        let productById = await Inventory.find({
          productId: { $regex: `${keyword}`, $options: "i" },
          type: "healthcare",
        }).populate({ path: "brand", select: ["title"] });
        let productByName = await Inventory.find({
          name: { $regex: `${keyword}`, $options: "i" },
          type: "healthcare",
        })
          .populate({ path: "brand", select: ["title"] })

          .lean();

        if (brand.length) {
          for (let item of brand) {
            let products = await Inventory.find({
              type: "healthcare",
              brand: item._id,
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryHealthcare.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }

                let subSubCategory =
                  await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                if (subSubCategory) {
                  categories.push(subSubCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        if (subCategory.length) {
          for (let item of subCategory) {
            let products = await Inventory.find({
              type: "healthcare",
              categories: item._id + "",
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryHealthcare.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }

                let subSubCategory =
                  await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                if (subSubCategory) {
                  categories.push(subSubCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        for (let item of subSubCategory) {
          let products = await Inventory.find({
            type: "healthcare",
            categories: item._id + "",
          })
            .populate({ path: "brand", select: ["title"] })
            .lean();
          for (let product of products) {
            let categories = [];
            for (let i of product.categories) {
              let subCategory = await MasterSubCategoryHealthcare.findOne({
                _id: mongoose.Types.ObjectId(i),
              });
              if (subCategory) {
                categories.push(subCategory.title);
              }

              let subSubCategory = await MasterSubSubCategoryHealthcare.findOne(
                {
                  _id: mongoose.Types.ObjectId(i),
                }
              );
              if (subSubCategory) {
                categories.push(subSubCategory.title);
              }
            }
            product.categories = categories;
            if (!result.includes(product)) {
              result.push(product);
            }
          }
        }
        for (let item of productById) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }

            let subSubCategory = await MasterSubSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subSubCategory) {
              categories.push(subSubCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of productByName) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }

            let subSubCategory = await MasterSubSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subSubCategory) {
              categories.push(subSubCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of result) {
          for (let data of item.pricing) {
            if (data.stock <= item.stockAlert && data.stock != 0) {
              // duplication checking
              if (!varient_ids.includes(data.skuOrHsnNo)) {
                varient_ids.push(data.skuOrHsnNo);

                let sku = await MasterUomValue.findOne({ _id: data.sku });
                let obj = {
                  productId: item.productId,
                  name: item.name,
                  category: item.categories,
                  brand: item.brand.title,
                  sku: data.sku,
                  skuOrHsnNo: data.skuOrHsnNo,
                  price: data.price,
                  specialPrice: data.specialPrice,
                  stock: data.stock,
                  image: process.env.BASE_URL.concat(data.image[0]),
                  _id: data._id,
                };
                if (sku) {
                  obj.sku = sku.uomValue;
                }

                finalResult.push(obj);
              }
            }
          }
        }
        let page = parseInt(req.body.page) - 1;
        let limit = parseInt(req.body.limit);
        let nextPage = false;
        let start = page * limit;
        let end = page * limit + limit;
        let newResult = finalResult.slice(start, end);
        if (finalResult.length > end) {
          nextPage = true;
        } else {
          nextPage = false;
        }
        if (finalResult.length == 0) {
          nextPage = false;
        }
        let totalPage = Math.ceil(finalResult.length / limit);

        res.status(200).json({
          status: true,
          data: {
            result: newResult,
            nextPage: nextPage,
            totalPage: totalPage,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  },
  searchStoreLowStockListing: async (req, res, next) => {
    try {
      let result = [];
      let productIds = [];
      let finalResult = [];
      let varient_ids = [];

      if (req.body.type == "medicine") {
        let keyword = req.body.keyword;
        let brand = await MasterBrand.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subCategory = await MasterSubCategoryMedicine.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let productById = await Inventory.find({
          productId: { $regex: `${keyword}`, $options: "i" },
          type: "medicine",
        }).populate({ path: "brand", select: ["title"] });
        let productByName = await Inventory.find({
          name: { $regex: `${keyword}`, $options: "i" },
          type: "medicine",
        })
          .populate({ path: "brand", select: ["title"] })

          .lean();
        console.log(subCategory);
        if (brand.length) {
          for (let item of brand) {
            let products = await Inventory.find({
              type: "medicine",
              brand: item._id,
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryMedicine.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        if (subCategory.length) {
          for (let item of subCategory) {
            let products = await Inventory.find({
              type: "medicine",
              categories: item._id + "",
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryMedicine.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        for (let item of productById) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryMedicine.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of productByName) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryMedicine.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }

        let storeVarients = await storeProducts.find({
          type: req.body.type,
          storeId: req.user.id,
        });

        for (let item of result) {
          for (let data of item.pricing) {
            for (let storeVarient of storeVarients) {
              if (storeVarient.varientId + "" == data._id + "") {
                if (
                  storeVarient.stock <= item.stockAlert &&
                  storeVarient.stock != 0
                ) {
                  // duplication checking
                  if (!varient_ids.includes(data.skuOrHsnNo)) {
                    varient_ids.push(data.skuOrHsnNo);

                    let sku = await MasterUomValue.findOne({ _id: data.sku });

                    let obj = {
                      productId: item.productId,
                      name: item.name,
                      category: item.categories,
                      brand: item.brand.title,
                      sku: data.sku,
                      skuOrHsnNo: storeVarient.skuOrHsnNo,
                      price: storeVarient.price,
                      specialPrice: storeVarient.specialPrice,
                      stock: storeVarient.stock,
                      image: process.env.BASE_URL.concat(data.image[0]),
                      _id: data._id,
                      expiryDate: storeVarient.expiryDate,
                    };
                    if (sku) {
                      obj.sku = sku.uomValue;
                    }
                    finalResult.push(obj);
                  }
                }
              }
            }
          }
        }
        let page = parseInt(req.body.page) - 1;
        let limit = parseInt(req.body.limit);
        console.log(finalResult.length);

        let nextPage = false;
        let start = page * limit;
        let end = page * limit + limit;
        let newResult = finalResult.slice(start, end);
        if (finalResult.length > end) {
          nextPage = true;
        } else {
          nextPage = false;
        }
        if (finalResult.length == 0) {
          nextPage = false;
        }
        let totalPage = Math.ceil(finalResult.length / limit);

        res.status(200).json({
          status: true,
          data: {
            result: newResult,
            nextPage: nextPage,
            totalPage: totalPage,
          },
        });
      } else {
        let keyword = req.body.keyword;
        let brand = await MasterBrand.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subCategory = await MasterSubCategoryHealthcare.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subSubCategory = await MasterSubCategoryHealthcare.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });

        let productById = await Inventory.find({
          productId: { $regex: `${keyword}`, $options: "i" },
          type: "healthcare",
        }).populate({ path: "brand", select: ["title"] });
        let productByName = await Inventory.find({
          name: { $regex: `${keyword}`, $options: "i" },
          type: "healthcare",
        })
          .populate({ path: "brand", select: ["title"] })

          .lean();

        if (brand.length) {
          for (let item of brand) {
            let products = await Inventory.find({
              type: "healthcare",
              brand: item._id,
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryHealthcare.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }

                let subSubCategory =
                  await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                if (subSubCategory) {
                  categories.push(subSubCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        if (subCategory.length) {
          for (let item of subCategory) {
            let products = await Inventory.find({
              type: "healthcare",
              categories: item._id + "",
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryHealthcare.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }

                let subSubCategory =
                  await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                if (subSubCategory) {
                  categories.push(subSubCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        for (let item of subSubCategory) {
          let products = await Inventory.find({
            type: "healthcare",
            categories: item._id + "",
          })
            .populate({ path: "brand", select: ["title"] })
            .lean();
          for (let product of products) {
            let categories = [];
            for (let i of product.categories) {
              let subCategory = await MasterSubCategoryHealthcare.findOne({
                _id: mongoose.Types.ObjectId(i),
              });
              if (subCategory) {
                categories.push(subCategory.title);
              }

              let subSubCategory = await MasterSubSubCategoryHealthcare.findOne(
                {
                  _id: mongoose.Types.ObjectId(i),
                }
              );
              if (subSubCategory) {
                categories.push(subSubCategory.title);
              }
            }
            product.categories = categories;
            if (!result.includes(product)) {
              result.push(product);
            }
          }
        }
        for (let item of productById) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }

            let subSubCategory = await MasterSubSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subSubCategory) {
              categories.push(subSubCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of productByName) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }

            let subSubCategory = await MasterSubSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subSubCategory) {
              categories.push(subSubCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }

        let storeVarients = await storeProducts.find({
          type: req.body.type,
          storeId: req.user.id,
        });

        for (let item of result) {
          for (let data of item.pricing) {
            for (let storeVarient of storeVarients) {
              if (storeVarient.varientId + "" == data._id + "") {
                if (
                  storeVarient.stock <= item.stockAlert &&
                  storeVarient.stock != 0
                ) {
                  // duplication checking
                  if (!varient_ids.includes(data.skuOrHsnNo)) {
                    varient_ids.push(data.skuOrHsnNo);

                    let sku = await MasterUomValue.findOne({ _id: data.sku });
                    let obj = {
                      productId: item.productId,
                      name: item.name,
                      category: item.categories,
                      brand: item.brand.title,
                      sku: data.sku,
                      skuOrHsnNo: storeVarient.skuOrHsnNo,
                      price: storeVarient.price,
                      specialPrice: storeVarient.specialPrice,
                      stock: storeVarient.stock,
                      image: process.env.BASE_URL.concat(data.image[0]),
                      _id: data._id,
                    };
                    if (sku) {
                      obj.sku = sku.uomValue;
                    }

                    finalResult.push(obj);
                  }
                }
              }
            }
          }
        }
        let page = parseInt(req.body.page) - 1;
        let limit = parseInt(req.body.limit);
        let nextPage = false;
        let start = page * limit;
        let end = page * limit + limit;
        let newResult = finalResult.slice(start, end);
        if (finalResult.length > end) {
          nextPage = true;
        } else {
          nextPage = false;
        }
        if (finalResult.length == 0) {
          nextPage = false;
        }
        let totalPage = Math.ceil(finalResult.length / limit);

        res.status(200).json({
          status: true,
          data: {
            result: newResult,
            nextPage: nextPage,
            totalPage: totalPage,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  },
  searchStoreOutOfStockListing: async (req, res, next) => {
    try {
      let result = [];
      let productIds = [];
      let finalResult = [];
      let varient_ids = [];

      if (req.body.type == "medicine") {
        let keyword = req.body.keyword;
        let brand = await MasterBrand.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subCategory = await MasterSubCategoryMedicine.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let productById = await Inventory.find({
          productId: { $regex: `${keyword}`, $options: "i" },
          type: "medicine",
        }).populate({ path: "brand", select: ["title"] });
        let productByName = await Inventory.find({
          name: { $regex: `${keyword}`, $options: "i" },
          type: "medicine",
        })
          .populate({ path: "brand", select: ["title"] })

          .lean();
        console.log(subCategory);
        if (brand.length) {
          for (let item of brand) {
            let products = await Inventory.find({
              type: "medicine",
              brand: item._id,
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryMedicine.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        if (subCategory.length) {
          for (let item of subCategory) {
            let products = await Inventory.find({
              type: "medicine",
              categories: item._id + "",
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryMedicine.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        for (let item of productById) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryMedicine.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of productByName) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryMedicine.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }

        let storeVarients = await storeProducts.find({
          type: req.body.type,
          storeId: req.user.id,
        });

        console.log("result_array____>", result);

        console.log("all_varients____", storeVarients);

        for (let item of result) {
          for (let data of item.pricing) {
            console.log("each_pricing___________>__>", data);
            for (let storeVarient of storeVarients) {
              console.log(
                "storeVarient.varientId___",
                storeVarient.varientId,
                "data._id____",
                data._id
              );
              console.log(
                "typeof-storeVarient.varientId___",
                typeof storeVarient,
                "typeof-data._id____",
                typeof data._id
              );
              if (storeVarient.varientId + "" == data._id + "") {
                console.log("inside___if____:::___:");
                if (storeVarient.stock == 0) {
                  console.log("__in_stock 0 if____");

                  // duplication checking
                  if (!varient_ids.includes(data.skuOrHsnNo)) {
                    varient_ids.push(data.skuOrHsnNo);

                    let sku = await MasterUomValue.findOne({ _id: data.sku });

                    let obj = {
                      productId: item.productId,
                      name: item.name,
                      category: item.categories,
                      brand: item.brand.title,
                      sku: data.sku,
                      skuOrHsnNo: storeVarient.skuOrHsnNo,
                      price: storeVarient.price,
                      specialPrice: storeVarient.specialPrice,
                      stock: storeVarient.stock,
                      image: process.env.BASE_URL.concat(data.image[0]),
                      _id: data._id,
                      expiryDate: storeVarient.expiryDate,
                    };
                    if (sku) {
                      obj.sku = sku.uomValue;
                    }
                    finalResult.push(obj);
                  }
                }
              }
              console.log("outside___if____:::___:");
            }
          }
        }
        let page = parseInt(req.body.page) - 1;
        let limit = parseInt(req.body.limit);
        console.log(finalResult.length);

        let nextPage = false;
        let start = page * limit;
        let end = page * limit + limit;
        let newResult = finalResult.slice(start, end);
        if (finalResult.length > end) {
          nextPage = true;
        } else {
          nextPage = false;
        }
        if (finalResult.length == 0) {
          nextPage = false;
        }
        let totalPage = Math.ceil(finalResult.length / limit);

        res.status(200).json({
          status: true,
          data: {
            result: newResult,
            nextPage: nextPage,
            totalPage: totalPage,
          },
        });
      } else {
        let keyword = req.body.keyword;
        let brand = await MasterBrand.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subCategory = await MasterSubCategoryHealthcare.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subSubCategory = await MasterSubCategoryHealthcare.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });

        let productById = await Inventory.find({
          productId: { $regex: `${keyword}`, $options: "i" },
          type: "healthcare",
        }).populate({ path: "brand", select: ["title"] });
        let productByName = await Inventory.find({
          name: { $regex: `${keyword}`, $options: "i" },
          type: "healthcare",
        })
          .populate({ path: "brand", select: ["title"] })

          .lean();

        if (brand.length) {
          for (let item of brand) {
            let products = await Inventory.find({
              type: "healthcare",
              brand: item._id,
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryHealthcare.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }

                let subSubCategory =
                  await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                if (subSubCategory) {
                  categories.push(subSubCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        if (subCategory.length) {
          for (let item of subCategory) {
            let products = await Inventory.find({
              type: "healthcare",
              categories: item._id + "",
            })
              .populate({ path: "brand", select: ["title"] })
              .lean();
            for (let product of products) {
              let categories = [];
              for (let i of product.categories) {
                let subCategory = await MasterSubCategoryHealthcare.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }

                let subSubCategory =
                  await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                if (subSubCategory) {
                  categories.push(subSubCategory.title);
                }
              }
              product.categories = categories;
              if (!result.includes(product)) {
                result.push(product);
              }
            }
          }
        }
        for (let item of subSubCategory) {
          let products = await Inventory.find({
            type: "healthcare",
            categories: item._id + "",
          })
            .populate({ path: "brand", select: ["title"] })
            .lean();
          for (let product of products) {
            let categories = [];
            for (let i of product.categories) {
              let subCategory = await MasterSubCategoryHealthcare.findOne({
                _id: mongoose.Types.ObjectId(i),
              });
              if (subCategory) {
                categories.push(subCategory.title);
              }

              let subSubCategory = await MasterSubSubCategoryHealthcare.findOne(
                {
                  _id: mongoose.Types.ObjectId(i),
                }
              );
              if (subSubCategory) {
                categories.push(subSubCategory.title);
              }
            }
            product.categories = categories;
            if (!result.includes(product)) {
              result.push(product);
            }
          }
        }
        for (let item of productById) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }

            let subSubCategory = await MasterSubSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subSubCategory) {
              categories.push(subSubCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }
        for (let item of productByName) {
          let categories = [];
          for (let i of item.categories) {
            let subCategory = await MasterSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subCategory) {
              categories.push(subCategory.title);
            }

            let subSubCategory = await MasterSubSubCategoryHealthcare.findOne({
              _id: mongoose.Types.ObjectId(i),
            });
            if (subSubCategory) {
              categories.push(subSubCategory.title);
            }
          }
          item.categories = categories;
          result.push(item);
        }

        let storeVarients = await storeProducts.find({
          type: req.body.type,
          storeId: req.user.id,
        });

        console.log("result_array____>", result);

        console.log("all_varients____", storeVarients);

        for (let item of result) {
          for (let data of item.pricing) {
            console.log("each_pricing___________>__>", data);
            for (let storeVarient of storeVarients) {
              console.log(
                "storeVarient.varientId___",
                storeVarient.varientId,
                "data._id____",
                data._id
              );
              console.log(
                "typeof-storeVarient.varientId___",
                typeof storeVarient,
                "typeof-data._id____",
                typeof data._id
              );

              if (storeVarient.varientId + "" == data._id + "") {
                console.log("inside___if____:::___:");
                if (storeVarient.stock == 0) {
                  // duplication checking
                  if (!varient_ids.includes(data.skuOrHsnNo)) {
                    varient_ids.push(data.skuOrHsnNo);

                    let sku = await MasterUomValue.findOne({ _id: data.sku });
                    let obj = {
                      productId: item.productId,
                      name: item.name,
                      category: item.categories,
                      brand: item.brand.title,
                      sku: data.sku,
                      skuOrHsnNo: storeVarient.skuOrHsnNo,
                      price: storeVarient.price,
                      specialPrice: storeVarient.specialPrice,
                      stock: storeVarient.stock,
                      image: process.env.BASE_URL.concat(data.image[0]),
                      _id: data._id,
                    };
                    if (sku) {
                      obj.sku = sku.uomValue;
                    }

                    finalResult.push(obj);
                  }
                }
              }
            }
          }
        }
        let page = parseInt(req.body.page) - 1;
        let limit = parseInt(req.body.limit);
        let nextPage = false;
        let start = page * limit;
        let end = page * limit + limit;
        let newResult = finalResult.slice(start, end);
        if (finalResult.length > end) {
          nextPage = true;
        } else {
          nextPage = false;
        }
        if (finalResult.length == 0) {
          nextPage = false;
        }
        let totalPage = Math.ceil(finalResult.length / limit);

        res.status(200).json({
          status: true,
          data: {
            result: newResult,
            nextPage: nextPage,
            totalPage: totalPage,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  },

  getAllFavourites: async (req, res, next) => {
    try {
      let result = [];
      if (req.body.type) {
        if (req.body.type == "healthcare" || req.body.type == "medicine") {
          if (!req.body.page) {
            return res.status(200).json({
              status: false,
              message: "page missing",
            });
          }

          let pageSize = 10;
          let pageNo = req.body.page;

          var aggregateQuery = mostFavouriteProduct.aggregate();

          aggregateQuery.match({
            type: req.body.type,
          });
          aggregateQuery.sort({ count: -1 });

          const customLabels = {
            totalDocs: "TotalRecords",
            docs: "products",
            limit: "PageSize",
            page: "CurrentPage",
          };
          const aggregatePaginateOptions = {
            page: pageNo,
            limit: pageSize,
            customLabels: customLabels,
          };
          let response = await mostFavouriteProduct.aggregatePaginate(
            aggregateQuery,
            aggregatePaginateOptions
          );

          for (let ii of response.products) {
            let item = await Inventory.findOne(
              { _id: ii.productId },
              {
                _id: 1,
                productId: 1,
                name: 1,
                categories: 1,
                brand: 1,
                isDisabled: 1,
                pricing: 1,
              }
            ).lean();
            if (item) {
              let brand = await MasterBrand.findOne(
                { _id: item.brand },
                { title: 1 }
              );

              if (brand) {
                item.brand = brand.title;
              } else {
                item.brand = "";
              }

              item.image = item.pricing[0].image[0];
              if (!item.image.includes(process.env.BASE_URL)) {
                item.image = process.env.BASE_URL.concat(item.image);
              }
              delete item.pricing;

              let categories = [];
              if (req.body.type == "medicine") {
                for (let i of item.categories) {
                  let subCategory = await MasterSubCategoryMedicine.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                  if (subCategory) {
                    categories.push(subCategory.title);
                  }
                }
                item.categories = categories;
              } else {
                for (let i of item.categories) {
                  let subCategory = await MasterSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                  if (subCategory) {
                    categories.push(subCategory.title);
                  }

                  let subSubCategory =
                    await MasterSubSubCategoryHealthcare.findOne({
                      _id: mongoose.Types.ObjectId(i),
                    });
                  if (subSubCategory) {
                    categories.push(subSubCategory.title);
                  }
                }
              }

              item.categories = categories;
              item.count = ii.count;
              result.push(item);
            }
          }

          response.products = result;
          delete response.nextPage;

          res.status(200).json({
            status: true,
            data: {
              response,
            },
          });
        } else {
          res.status(200).json({
            status: false,
            message: "Invalid type",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          message: "Type is missing",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  // search in favourite
  searchFavouriteProducts: async (req, res, next) => {
    try {
      let newProducts = [];
      let result = [];

      if (req.body.type == "medicine") {
        let keyword = req.body.keyword;
        let brand = await MasterBrand.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subCategory = await MasterSubCategoryMedicine.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let productById = await Inventory.find(
          {
            productId: { $regex: `${keyword}`, $options: "i" },
            type: "medicine",
          },
          {
            productId: 1,
            name: 1,
            categories: 1,
            brand: 1,
            isDisabled: 1,
            pricing: 1,
          }
        );
        for (let item of productById) {
          newProducts.push(item);
        }

        let productByName = await Inventory.find(
          { name: { $regex: `${keyword}`, $options: "i" }, type: "medicine" },
          {
            productId: 1,
            name: 1,
            categories: 1,
            brand: 1,
            isDisabled: 1,
            pricing: 1,
          }
        );
        for (let item of productByName) {
          newProducts.push(item);
        }

        if (brand.length) {
          for (let item of brand) {
            let products = await Inventory.find(
              { type: "medicine", brand: item._id },
              {
                productId: 1,
                name: 1,
                categories: 1,
                brand: 1,
                isDisabled: 1,
                pricing: 1,
              }
            );
            for (let itemss of products) {
              newProducts.push(itemss);
            }
          }
        }
        if (subCategory.length) {
          for (let item of subCategory) {
            let products = await Inventory.find(
              { type: "medicine", categories: item._id + "" },
              {
                productId: 1,
                name: 1,
                categories: 1,
                brand: 1,
                isDisabled: 1,
                pricing: 1,
              }
            );
            for (let itemss of products) {
              newProducts.push(itemss);
            }
          }
        }
      } else {
        let keyword = req.body.keyword;
        let brand = await MasterBrand.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subCategory = await MasterSubCategoryHealthcare.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        console.log("subcat====>", subCategory);
        let subSubCategory = await MasterSubSubCategory.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        console.log("subsubcat====>", subSubCategory);

        let productById = await Inventory.find(
          {
            productId: { $regex: `${keyword}`, $options: "i" },
            type: "healthcare",
          },
          {
            productId: 1,
            name: 1,
            categories: 1,
            brand: 1,
            isDisabled: 1,
            pricing: 1,
          }
        );
        for (let item of productById) {
          newProducts.push(item);
        }
        let productByName = await Inventory.find(
          { name: { $regex: `${keyword}`, $options: "i" }, type: "healthcare" },
          {
            productId: 1,
            name: 1,
            categories: 1,
            brand: 1,
            isDisabled: 1,
            pricing: 1,
          }
        );
        for (let itemss of productByName) {
          newProducts.push(itemss);
        }

        if (brand.length) {
          for (let item of brand) {
            let products = await Inventory.find(
              { type: "healthcare", brand: item._id },
              {
                productId: 1,
                name: 1,
                categories: 1,
                brand: 1,
                isDisabled: 1,
                pricing: 1,
              }
            );
            for (let itemss of products) {
              newProducts.push(itemss);
            }
          }
        }
        if (subCategory.length) {
          for (let item of subCategory) {
            let products = await Inventory.find(
              { type: "healthcare", categories: item._id + "" },
              {
                productId: 1,
                name: 1,
                categories: 1,
                brand: 1,
                isDisabled: 1,
                pricing: 1,
              }
            );
            console.log("sub====>", products);
            for (let itemss of products) {
              newProducts.push(itemss);
            }
          }
        }
        for (let item of subSubCategory) {
          let products = await Inventory.find(
            { type: "healthcare", categories: item._id + "" },
            {
              productId: 1,
              name: 1,
              categories: 1,
              brand: 1,
              isDisabled: 1,
              pricing: 1,
            }
          );
          console.log("subsub====>", products);

          for (let itemss of products) {
            newProducts.push(itemss);
          }
        }
      }

      if (newProducts.length) {
        let productQuery = [];
        newProducts.map((item) =>
          productQuery.push({ productId: item._id + "" })
        );
        // console.log(productQuery);
        let pageSize = 10;
        let pageNo = req.body.page;

        var aggregateQuery = mostFavouriteProduct.aggregate();

        aggregateQuery.match({
          $or: productQuery,
        });
        aggregateQuery.sort({ count: -1 });

        const customLabels = {
          totalDocs: "TotalRecords",
          docs: "products",
          limit: "PageSize",
          page: "CurrentPage",
        };
        const aggregatePaginateOptions = {
          page: pageNo,
          limit: pageSize,
          customLabels: customLabels,
        };
        let response = await mostFavouriteProduct.aggregatePaginate(
          aggregateQuery,
          aggregatePaginateOptions
        );
        console.log(response.products);

        for (let ii of response.products) {
          let item = await Inventory.findOne(
            { _id: ii.productId },
            {
              _id: 1,
              productId: 1,
              name: 1,
              categories: 1,
              brand: 1,
              isDisabled: 1,
              pricing: 1,
            }
          ).lean();
          if (item) {
            let brand = await MasterBrand.findOne(
              { _id: item.brand },
              { title: 1 }
            );

            if (brand) {
              item.brand = brand.title;
            } else {
              item.brand = "";
            }

            item.image = item.pricing[0].image[0];
            if (!item.image.includes(process.env.BASE_URL)) {
              item.image = process.env.BASE_URL.concat(item.image);
            }
            delete item.pricing;

            let categories = [];
            if (req.body.type == "medicine") {
              for (let i of item.categories) {
                let subCategory = await MasterSubCategoryMedicine.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }
              }
              item.categories = categories;
            } else {
              for (let i of item.categories) {
                let subCategory = await MasterSubCategoryHealthcare.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }

                let subSubCategory =
                  await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                if (subSubCategory) {
                  categories.push(subSubCategory.title);
                }
              }
            }

            item.categories = categories;
            result.push(item);
          }
        }
        response.products = result;
        delete response.nextPage;
        console.log(productQuery);

        res.status(200).json({
          status: true,
          data: {
            response,
          },
        });
      } else {
        res.status(200).json({
          status: false,
          data: "No Data",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  listMostSearchedProducts: async (req, res, next) => {
    try {
      let result = [];
      if (req.body.type) {
        if (req.body.type == "healthcare" || req.body.type == "medicine") {
          if (!req.body.page) {
            return res.status(200).json({
              status: false,
              message: "page missing",
            });
          }

          let pageSize = 10;
          let pageNo = req.body.page;

          var aggregateQuery = mostSearchProduct.aggregate();

          aggregateQuery.match({
            type: req.body.type,
          });
          aggregateQuery.sort({ count: -1 });

          const customLabels = {
            totalDocs: "TotalRecords",
            docs: "products",
            limit: "PageSize",
            page: "CurrentPage",
          };
          const aggregatePaginateOptions = {
            page: pageNo,
            limit: pageSize,
            customLabels: customLabels,
          };
          let response = await mostSearchProduct.aggregatePaginate(
            aggregateQuery,
            aggregatePaginateOptions
          );

          for (let ii of response.products) {
            let item = await Inventory.findOne(
              { _id: ii.productId },
              {
                _id: 1,
                productId: 1,
                name: 1,
                categories: 1,
                brand: 1,
                isDisabled: 1,
                pricing: 1,
              }
            ).lean();
            if (item) {
              let brand = await MasterBrand.findOne(
                { _id: item.brand },
                { title: 1 }
              );

              if (brand) {
                item.brand = brand.title;
              } else {
                item.brand = "";
              }

              item.image = item.pricing[0].image[0];
              if (!item.image.includes(process.env.BASE_URL)) {
                item.image = process.env.BASE_URL.concat(item.image);
              }
              delete item.pricing;

              let categories = [];
              if (req.body.type == "medicine") {
                for (let i of item.categories) {
                  let subCategory = await MasterSubCategoryMedicine.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                  if (subCategory) {
                    categories.push(subCategory.title);
                  }
                }
                item.categories = categories;
              } else {
                for (let i of item.categories) {
                  let subCategory = await MasterSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                  if (subCategory) {
                    categories.push(subCategory.title);
                  }

                  let subSubCategory =
                    await MasterSubSubCategoryHealthcare.findOne({
                      _id: mongoose.Types.ObjectId(i),
                    });
                  if (subSubCategory) {
                    categories.push(subSubCategory.title);
                  }
                }
              }
              item.count = ii.count;

              item.categories = categories;
              result.push(item);
            }
          }

          response.products = result;
          delete response.nextPage;

          res.status(200).json({
            status: true,
            data: {
              response,
            },
          });
        } else {
          res.status(200).json({
            status: false,
            message: "Type missing",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          message: "Invalid type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  searchMostSearchProducts: async (req, res, next) => {
    try {
      let newProducts = [];
      let result = [];

      if (req.body.type == "medicine") {
        let keyword = req.body.keyword;
        let brand = await MasterBrand.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subCategory = await MasterSubCategoryMedicine.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let productById = await Inventory.find(
          {
            productId: { $regex: `${keyword}`, $options: "i" },
            type: "medicine",
          },
          {
            productId: 1,
            name: 1,
            categories: 1,
            brand: 1,
            isDisabled: 1,
            pricing: 1,
          }
        );
        for (let item of productById) {
          newProducts.push(item);
        }

        let productByName = await Inventory.find(
          { name: { $regex: `${keyword}`, $options: "i" }, type: "medicine" },
          {
            productId: 1,
            name: 1,
            categories: 1,
            brand: 1,
            isDisabled: 1,
            pricing: 1,
          }
        );
        for (let item of productByName) {
          newProducts.push(item);
        }

        if (brand.length) {
          for (let item of brand) {
            let products = await Inventory.find(
              { type: "medicine", brand: item._id },
              {
                productId: 1,
                name: 1,
                categories: 1,
                brand: 1,
                isDisabled: 1,
                pricing: 1,
              }
            );
            for (let itemss of products) {
              newProducts.push(itemss);
            }
          }
        }
        if (subCategory.length) {
          for (let item of subCategory) {
            let products = await Inventory.find(
              { type: "medicine", categories: item._id + "" },
              {
                productId: 1,
                name: 1,
                categories: 1,
                brand: 1,
                isDisabled: 1,
                pricing: 1,
              }
            );
            for (let itemss of products) {
              newProducts.push(itemss);
            }
          }
        }
      } else {
        let keyword = req.body.keyword;
        let brand = await MasterBrand.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subCategory = await MasterSubCategoryHealthcare.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        console.log("subcat====>", subCategory);
        let subSubCategory = await MasterSubSubCategory.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        console.log("subsubcat====>", subSubCategory);

        let productById = await Inventory.find(
          {
            productId: { $regex: `${keyword}`, $options: "i" },
            type: "healthcare",
          },
          {
            productId: 1,
            name: 1,
            categories: 1,
            brand: 1,
            isDisabled: 1,
            pricing: 1,
          }
        );
        for (let item of productById) {
          newProducts.push(item);
        }
        let productByName = await Inventory.find(
          { name: { $regex: `${keyword}`, $options: "i" }, type: "healthcare" },
          {
            productId: 1,
            name: 1,
            categories: 1,
            brand: 1,
            isDisabled: 1,
            pricing: 1,
          }
        );
        for (let itemss of productByName) {
          newProducts.push(itemss);
        }

        if (brand.length) {
          for (let item of brand) {
            let products = await Inventory.find(
              { type: "healthcare", brand: item._id },
              {
                productId: 1,
                name: 1,
                categories: 1,
                brand: 1,
                isDisabled: 1,
                pricing: 1,
              }
            );
            for (let itemss of products) {
              newProducts.push(itemss);
            }
          }
        }
        if (subCategory.length) {
          for (let item of subCategory) {
            let products = await Inventory.find(
              { type: "healthcare", categories: item._id + "" },
              {
                productId: 1,
                name: 1,
                categories: 1,
                brand: 1,
                isDisabled: 1,
                pricing: 1,
              }
            );
            console.log("sub====>", products);
            for (let itemss of products) {
              newProducts.push(itemss);
            }
          }
        }
        for (let item of subSubCategory) {
          let products = await Inventory.find(
            { type: "healthcare", categories: item._id + "" },
            {
              productId: 1,
              name: 1,
              categories: 1,
              brand: 1,
              isDisabled: 1,
              pricing: 1,
            }
          );
          console.log("subsub====>", products);

          for (let itemss of products) {
            newProducts.push(itemss);
          }
        }
      }

      if (newProducts.length) {
        let productQuery = [];
        newProducts.map((item) =>
          productQuery.push({ productId: item._id + "" })
        );
        // console.log(productQuery);
        let pageSize = 10;
        let pageNo = req.body.page;

        var aggregateQuery = mostSearchProduct.aggregate();

        aggregateQuery.match({
          $or: productQuery,
        });
        aggregateQuery.sort({ count: -1 });

        const customLabels = {
          totalDocs: "TotalRecords",
          docs: "products",
          limit: "PageSize",
          page: "CurrentPage",
        };
        const aggregatePaginateOptions = {
          page: pageNo,
          limit: pageSize,
          customLabels: customLabels,
        };
        let response = await mostSearchProduct.aggregatePaginate(
          aggregateQuery,
          aggregatePaginateOptions
        );
        console.log(response.products);

        for (let ii of response.products) {
          let item = await Inventory.findOne(
            { _id: ii.productId },
            {
              _id: 1,
              productId: 1,
              name: 1,
              categories: 1,
              brand: 1,
              isDisabled: 1,
              pricing: 1,
            }
          ).lean();
          if (item) {
            let brand = await MasterBrand.findOne(
              { _id: item.brand },
              { title: 1 }
            );

            if (brand) {
              item.brand = brand.title;
            } else {
              item.brand = "";
            }

            item.image = item.pricing[0].image[0];
            if (!item.image.includes(process.env.BASE_URL)) {
              item.image = process.env.BASE_URL.concat(item.image);
            }
            delete item.pricing;

            let categories = [];
            if (req.body.type == "medicine") {
              for (let i of item.categories) {
                let subCategory = await MasterSubCategoryMedicine.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }
              }
              item.categories = categories;
            } else {
              for (let i of item.categories) {
                let subCategory = await MasterSubCategoryHealthcare.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }

                let subSubCategory =
                  await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                if (subSubCategory) {
                  categories.push(subSubCategory.title);
                }
              }
            }
            item.count = ii.count;
            item.categories = categories;
            result.push(item);
          }
        }
        response.products = result;
        delete response.nextPage;
        console.log(productQuery);

        res.status(200).json({
          status: true,
          data: {
            response,
          },
        });
      } else {
        res.status(200).json({
          status: false,
          data: "No Data",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  listMostBuyedProducts: async (req, res, next) => {
    try {
      let result = [];
      if (req.body.type) {
        if (req.body.type == "healthcare" || req.body.type == "medicine") {
          if (!req.body.page) {
            return res.status(200).json({
              status: false,
              message: "page missing",
            });
          }

          let pageSize = 10;
          let pageNo = req.body.page;

          var aggregateQuery = MostPurchasedProduct.aggregate();

          aggregateQuery.match({
            productType: req.body.type,
          });
          aggregateQuery.sort({ count: -1 });

          const customLabels = {
            totalDocs: "TotalRecords",
            docs: "products",
            limit: "PageSize",
            page: "CurrentPage",
          };
          const aggregatePaginateOptions = {
            page: pageNo,
            limit: pageSize,
            customLabels: customLabels,
          };
          let response = await MostPurchasedProduct.aggregatePaginate(
            aggregateQuery,
            aggregatePaginateOptions
          );

          for (let ii of response.products) {
            let item = await Inventory.findOne(
              { _id: ii.product_id },
              {
                _id: 1,
                productId: 1,
                name: 1,
                categories: 1,
                brand: 1,
                isDisabled: 1,
                pricing: 1,
              }
            ).lean();
            if (item) {
              let brand = await MasterBrand.findOne(
                { _id: item.brand },
                { title: 1 }
              );

              if (brand) {
                item.brand = brand.title;
              } else {
                item.brand = "";
              }

              item.image = item.pricing[0].image[0];
              if (!item.image.includes(process.env.BASE_URL)) {
                item.image = process.env.BASE_URL.concat(item.image);
              }
              delete item.pricing;

              let categories = [];
              if (req.body.type == "medicine") {
                for (let i of item.categories) {
                  let subCategory = await MasterSubCategoryMedicine.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                  if (subCategory) {
                    categories.push(subCategory.title);
                  }
                }
                item.categories = categories;
              } else {
                for (let i of item.categories) {
                  let subCategory = await MasterSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                  if (subCategory) {
                    categories.push(subCategory.title);
                  }

                  let subSubCategory =
                    await MasterSubSubCategoryHealthcare.findOne({
                      _id: mongoose.Types.ObjectId(i),
                    });
                  if (subSubCategory) {
                    categories.push(subSubCategory.title);
                  }
                }
              }
              item.count = ii.count;
              item.categories = categories;
              result.push(item);
            }
          }

          response.products = result;
          delete response.nextPage;

          res.status(200).json({
            status: true,
            data: {
              response,
            },
          });
        } else {
          res.status(200).json({
            status: false,
            message: "Type missing",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          message: "Invalid type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  searchMostBuyedProducts: async (req, res, next) => {
    try {
      let newProducts = [];
      let result = [];

      if (req.body.type == "medicine") {
        let keyword = req.body.keyword;
        let brand = await MasterBrand.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subCategory = await MasterSubCategoryMedicine.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let productById = await Inventory.find(
          {
            productId: { $regex: `${keyword}`, $options: "i" },
            type: "medicine",
          },
          {
            productId: 1,
            name: 1,
            categories: 1,
            brand: 1,
            isDisabled: 1,
            pricing: 1,
          }
        );
        for (let item of productById) {
          newProducts.push(item);
        }

        let productByName = await Inventory.find(
          { name: { $regex: `${keyword}`, $options: "i" }, type: "medicine" },
          {
            productId: 1,
            name: 1,
            categories: 1,
            brand: 1,
            isDisabled: 1,
            pricing: 1,
          }
        );
        for (let item of productByName) {
          newProducts.push(item);
        }

        if (brand.length) {
          for (let item of brand) {
            let products = await Inventory.find(
              { type: "medicine", brand: item._id },
              {
                productId: 1,
                name: 1,
                categories: 1,
                brand: 1,
                isDisabled: 1,
                pricing: 1,
              }
            );
            for (let itemss of products) {
              newProducts.push(itemss);
            }
          }
        }
        if (subCategory.length) {
          for (let item of subCategory) {
            let products = await Inventory.find(
              { type: "medicine", categories: item._id + "" },
              {
                productId: 1,
                name: 1,
                categories: 1,
                brand: 1,
                isDisabled: 1,
                pricing: 1,
              }
            );
            for (let itemss of products) {
              newProducts.push(itemss);
            }
          }
        }
      } else {
        let keyword = req.body.keyword;
        let brand = await MasterBrand.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        let subCategory = await MasterSubCategoryHealthcare.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        console.log("subcat====>", subCategory);
        let subSubCategory = await MasterSubSubCategory.find({
          title: { $regex: `${keyword}`, $options: "i" },
        });
        console.log("subsubcat====>", subSubCategory);

        let productById = await Inventory.find(
          {
            productId: { $regex: `${keyword}`, $options: "i" },
            type: "healthcare",
          },
          {
            productId: 1,
            name: 1,
            categories: 1,
            brand: 1,
            isDisabled: 1,
            pricing: 1,
          }
        );
        for (let item of productById) {
          newProducts.push(item);
        }
        let productByName = await Inventory.find(
          { name: { $regex: `${keyword}`, $options: "i" }, type: "healthcare" },
          {
            productId: 1,
            name: 1,
            categories: 1,
            brand: 1,
            isDisabled: 1,
            pricing: 1,
          }
        );
        for (let itemss of productByName) {
          newProducts.push(itemss);
        }

        if (brand.length) {
          for (let item of brand) {
            let products = await Inventory.find(
              { type: "healthcare", brand: item._id },
              {
                productId: 1,
                name: 1,
                categories: 1,
                brand: 1,
                isDisabled: 1,
                pricing: 1,
              }
            );
            for (let itemss of products) {
              newProducts.push(itemss);
            }
          }
        }
        if (subCategory.length) {
          for (let item of subCategory) {
            let products = await Inventory.find(
              { type: "healthcare", categories: item._id + "" },
              {
                productId: 1,
                name: 1,
                categories: 1,
                brand: 1,
                isDisabled: 1,
                pricing: 1,
              }
            );
            console.log("sub====>", products);
            for (let itemss of products) {
              newProducts.push(itemss);
            }
          }
        }
        for (let item of subSubCategory) {
          let products = await Inventory.find(
            { type: "healthcare", categories: item._id + "" },
            {
              productId: 1,
              name: 1,
              categories: 1,
              brand: 1,
              isDisabled: 1,
              pricing: 1,
            }
          );
          console.log("subsub====>", products);

          for (let itemss of products) {
            newProducts.push(itemss);
          }
        }
      }

      if (newProducts.length) {
        let productQuery = [];
        newProducts.map((item) =>
          productQuery.push({ product_id: item._id + "" })
        );
        // console.log(productQuery);
        let pageSize = 10;
        let pageNo = req.body.page;

        var aggregateQuery = MostPurchasedProduct.aggregate();

        aggregateQuery.match({
          $or: productQuery,
        });
        aggregateQuery.sort({ count: -1 });

        const customLabels = {
          totalDocs: "TotalRecords",
          docs: "products",
          limit: "PageSize",
          page: "CurrentPage",
        };
        const aggregatePaginateOptions = {
          page: pageNo,
          limit: pageSize,
          customLabels: customLabels,
        };
        let response = await MostPurchasedProduct.aggregatePaginate(
          aggregateQuery,
          aggregatePaginateOptions
        );
        console.log(response.products);

        for (let ii of response.products) {
          let item = await Inventory.findOne(
            { _id: ii.product_id },
            {
              _id: 1,
              productId: 1,
              name: 1,
              categories: 1,
              brand: 1,
              isDisabled: 1,
              pricing: 1,
            }
          ).lean();
          if (item) {
            let brand = await MasterBrand.findOne(
              { _id: item.brand },
              { title: 1 }
            );

            if (brand) {
              item.brand = brand.title;
            } else {
              item.brand = "";
            }

            item.image = item.pricing[0].image[0];
            if (!item.image.includes(process.env.BASE_URL)) {
              item.image = process.env.BASE_URL.concat(item.image);
            }
            delete item.pricing;

            let categories = [];
            if (req.body.type == "medicine") {
              for (let i of item.categories) {
                let subCategory = await MasterSubCategoryMedicine.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }
              }
              item.categories = categories;
            } else {
              for (let i of item.categories) {
                let subCategory = await MasterSubCategoryHealthcare.findOne({
                  _id: mongoose.Types.ObjectId(i),
                });
                if (subCategory) {
                  categories.push(subCategory.title);
                }

                let subSubCategory =
                  await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                if (subSubCategory) {
                  categories.push(subSubCategory.title);
                }
              }
            }
            item.count = ii.count;
            item.categories = categories;
            result.push(item);
          }
        }
        response.products = result;
        delete response.nextPage;
        console.log(productQuery);

        res.status(200).json({
          status: true,
          data: {
            response,
          },
        });
      } else {
        res.status(200).json({
          status: false,
          data: "No Data",
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
