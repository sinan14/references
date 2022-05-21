const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const imgPath = process.env.BASE_URL;

const WebHomeSlider = require("../../models/ads/web/webHomeSlider");
const AdsMedimallTopCategories = require("../../models/ads/medimall/topCategories");
const MasterBrand = require("../../models/mastersettings/brand");
const Inventory = require("../../models/inventory");
const AdsMedimallSliderTopWishRecent = require("../../models/ads/medimall/sliderTopWishRecent");
const adsPromotion = require("../../models/ads/cart/promotion");

const FoliofitTestimonial = require("../../models/foliofit/foliofitTestimonial");
const webType = "web";
const medimallSliderType = "slider7";

const Articles = require("../../models/article");
const ArticleCategory = require("../../models/articleCategory");
const AdsHomeCart = require("../../models/ads/home/cart");
const AdsSeasonalOfferSetYourDeal = require("../../models/ads/seasonal-offers/setYourDeal");
const inventoryFavourite = require("../../models/inventoryFavourites");
const MasterPolicy = require("../../models/mastersettings/masterPolicy");
const MasterDeliveryChargeTime = require("../../models/mastersettings/deliveryChargeTime");
const MasterUOM = require("../../models/mastersettings/uom");
const MasterUOMValue = require("../../models/mastersettings/uomValue");
const WebBanner = require("../../models/ads/web/webBanner");
const MasterSubCategoryHealthcare = require("../../models/mastersettings/subCategoryHealthcare");
const specialPremiumCrud = require("../../models/premium/specialPriceCrudPremium");
const coupons = require("../../models/coupon/coupon");
const UserAppliedCoupons = require("../../models/cart/userAppliedCoupons");

const Cart = require("../../models/cart");
const AdsHowToOrderMedicine = require("../../models/ads/cart/howToOrderMedicine");
const AdsMedimallTopIconCatHealth = require("../../models/ads/medimall/topIconCatHealth");
const AdsOrderMedicineSlider = require("../../models/ads/cart/ordermedicineslider");
const AdsOrderMedicine3Icon = require("../../models/ads/cart/ordermedicine3icon");
const MasterCategory = require("../../models/mastersettings/category");
const MostPurchasedProduct = require("../../models/most/mostPurchasedProducts");
const mostSearchProduct = require("../../models/mostSearchedProducts");
const Read = require("../../models/read");
const productRating = require("../../models/productRating");
//validations
const {
  validateRemoveCouponFromTheCart,
} = require("../../validations/cart/cartValidations");

const doRemoveCouponFromTheCart = (userId, { couponId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      //validate incoming data
      const dataValidation = await validateRemoveCouponFromTheCart({
        couponId,
      });
      if (dataValidation.error) {
        const message = dataValidation.error.details[0].message.replace(
          /"/g,
          ""
        );
        return resolve({
          statusCode: 200,
          error: true,
          message: message,
        });
      }

      //delete from user applied coupon
      let deleteAppliedCoupon = await UserAppliedCoupons.findOneAndDelete({
        userId,
        couponId,
        isCouponApplied: true,
      });

      if (!deleteAppliedCoupon) {
        return resolve({
          statusCode: 200,
          error: true,
          message: "Invalid applied coupon.",
        });
      }

      //decrement count of times this coupon is used

      await coupons.updateOne(
        { _id: couponId },
        { $inc: { totalTimesUsed: -1 } }
      );

      return resolve({
        statusCode: 200,
        error: false,
        message: "Applied Coupon removed successfully.",
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  // Get the home page details
  getWebHomePage: async (req, res, next) => {
    try {
      // Ads - web - home slider (slder 1 )
      let mainSlider = await WebHomeSlider.aggregate([
        {
          $lookup: {
            from: "mastersubcategoryhealthcares",
            localField: "redirection_id",
            foreignField: "_id",
            as: "subCategory",
          },
        },
        {
          $unwind: {
            path: "$subCategory",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 1,
            image: { $concat: [imgPath, "$image"] },
            redirection_type: 1,
            redirection_id: 1,
            categoryId: "$subCategory.categoryId",
          },
        },
      ]);

      //Categories to bag - (Ads -medimall - Top categories )
      let categoriesToBag = await AdsMedimallTopCategories.aggregate([
        {
          $match: {
            isDisabled: false,
          },
        },
        // {
        //     $lookup: {
        //         from: "mastercategories",
        //         localField: "categoryId",
        //         foreignField: "_id",
        //         as: "masterCategory",
        //     },
        // },
        {
          $lookup: {
            from: "mastersubcategoryhealthcares",
            localField: "categoryId",
            foreignField: "_id",
            as: "subCategory",
          },
        },
        {
          $project: {
            _id: 1,
            image: { $concat: [imgPath, "$image"] },
            categoryName: { $first: "$subCategory.title" },
            subCategoryId: { $first: "$subCategory._id" },
            categoryId: { $first: "$subCategory.categoryId" },
            // categoryName: { $ifNull: [  { $first: "$masterCategory.title"}, { $first: "$subCategory.title" }] },
            // categoryId : { $ifNull: [  { $first: "$masterCategory._id"}, { $first: "$subCategory._id" }] },
            offerPercentage: 1,
          },
        },
      ]);

      //Featured brands - ( master settings - Featured brands)
      let featuredBrands = await MasterBrand.find(
        { isFeatured: true, isDisabled: false },
        {
          title: 1,
          image: { $concat: [imgPath, "$image"] },
        }
      ).lean();
      for (let brands of featuredBrands) {
        let count = await Inventory.find({
          brand: brands._id,
        }).countDocuments();
        brands.count = count;
      }

      // Slider - (Ads - medimall - slider 7 )
      let slider = await AdsMedimallSliderTopWishRecent.aggregate([
        {
          $match: {
            sliderType: medimallSliderType,
            isDisabled: false,
          },
        },
        {
          $lookup: {
            from: "mastersubcategoryhealthcares",
            localField: "typeId",
            foreignField: "_id",
            as: "subCategory",
          },
        },
        {
          $unwind: {
            path: "$subCategory",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            typeId: 1,
            image: { $concat: [imgPath, "$image"] },
            sliderType: 1,
            categoryId: "$subCategory.categoryId",
            type: {
              $cond: {
                if: { $eq: ["$type", 0] },
                then: "product",
                else: "category",
              },
            },
          },
        },
      ]);

      // for (let item of slider) {
      //   if (item.type == "category") {
      //     item.typeId = item.categoryId;
      //     delete item.categoryId;
      //   }
      // }

      //   Offers from our payment partners - (Ads -promotion - promotion)
      let offers = await adsPromotion.find(
        {},
        {
          termsConditions: 1,
          image: { $concat: [imgPath, "$image"] },
        }
      );
      //Our Happy customers - ( Foliofit - Testmonial - Web )
      let customers = await FoliofitTestimonial.find(
        { testimonialType: webType, isDisabled: false },
        {
          image: { $concat: [imgPath, "$image"] },
        }
      );

      //Med article - ( medfeed -med article - Trending )
      let medArticles = await Articles.find(
        { trending: true },
        {
          _id: 1,
          heading: 1,
          authorName: 1,
          image: { $concat: [imgPath, "$image"] },
          description: 1,
          date: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
          categories: 1,
        }
      ).lean();

      if (medArticles) {
        for (let articles of medArticles) {
          articles.title = "";
          if (articles.categories) {
            let subCategory = await ArticleCategory.findOne({
              _id: mongoose.Types.ObjectId(articles.categories[0]),
            });

            if (subCategory) {
              articles.title = subCategory.name;
            }
          }
          delete articles.categories;
        }
      }

      //Shop by concern - ( ads -home -cart your med essentials )
      var shopConcern = await AdsHomeCart.aggregate([
        {
          $match: {
            isDisabled: false,
          },
        },
        {
          $lookup: {
            from: "mastersubcategoryhealthcares",
            localField: "categoryId",
            foreignField: "_id",
            as: "subCategory",
          },
        },
        {
          $unwind: {
            path: "$subCategory",
            // preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            name: "$subCategory.title",
            subCategoryId: "$subCategory._id",
            categoryId: "$subCategory.categoryId",
            image: { $concat: [imgPath, "$subCategory.image"] },
          },
        },
      ]);

      //Popular health care products - Most selling products
      var productDetails = [];

      let mostPurchased = await MostPurchasedProduct.aggregate([
        {
          $match: {
            productType: "healthcare",
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]).limit(20);
      console.log(mostPurchased);
      let items = [];
      for (let ii of mostPurchased) {
        productDetails = await Inventory.find(
          { _id: ii.product_id, isDisabled: false },
          // productDetails = await Inventory.find(
          //   { type: "healthcare" ,isDisabled:false },
          {
            name: 1,
            "pricing.image": 1,
            "pricing.price": 1,
            "pricing.specialPrice": 1,
            "pricing.stock": 1,
            "pricing._id": 1,
            "pricing.sku": 1,
            "pricing.uom": 1,
            brand: 1,
          }
        )
          .populate({ path: "brand", select: ["title"] })
          .sort("-id")
          .limit(16);
        console.log(productDetails);
        //let items = [];
        for (let item of productDetails) {
          var checkStock = false;
          var data = {
            product_id: item._id,
            title: item.name,
            brand: item.brand.title,
            prescription: false,
          };
          if (item.pricing) {
            for (let pricing of item.pricing) {
              if (!checkStock) {
                if (pricing.stock > 0) {
                  checkStock = true;
                  data.image = "";
                  data.discount = 0;
                  data.uom = "";
                  data.uomValue = "";
                  data.varient_id = "";

                  if (pricing.image[0]) {
                    if (pricing.image[0].includes(imgPath)) {
                      data.image = pricing.image[0];
                    } else {
                      data.image = imgPath.concat(pricing.image[0]);
                    }
                  }
                  let discountPercentage = Math.round(
                    ((pricing.price - pricing.specialPrice) / pricing.price) *
                      100
                  );
                  if (discountPercentage > 0 && discountPercentage < 100) {
                    data.discount = discountPercentage;
                  }

                  let uomValue = await MasterUOMValue.findOne(
                    { _id: mongoose.Types.ObjectId(pricing.sku) },
                    {
                      uomValue: 1,
                    }
                  );
                  if (uomValue) {
                    data.uomValue = uomValue.uomValue;
                  }

                  let masterUom = await MasterUOM.findOne(
                    { _id: mongoose.Types.ObjectId(pricing.uom) },
                    {
                      title: 1,
                    }
                  );
                  if (masterUom) {
                    data.uom = masterUom.title;
                  }
                  data.varient_id = pricing._id;
                  data.price = pricing.price;
                  data.spl_price = pricing.specialPrice;
                  items.push(data);
                }
              }
            }
          }
        }
      }
      for (let fav of items) {
        let isFav = await inventoryFavourite.findOne({
          userId: req.user._id,
          productId: mongoose.Types.ObjectId(fav.product_id),
          productUomId: mongoose.Types.ObjectId(fav.varient_id),
        });
        if (isFav) {
          fav.isFavorite = true;
        } else {
          fav.isFavorite = false;
        }
      }

      // ads - cart -   how to order medicine
      let orderMedicine = await AdsHowToOrderMedicine.find(
        { isDisabled: false },
        {
          video: 1,
        }
      );

      //Hot deals for you - ads-seasonal offers - set your deal

      let todayDate = new Date();
      console.log("todayDate", todayDate);
      let hotDeals = {};
      let Gre = await AdsSeasonalOfferSetYourDeal.aggregate([
        {
          $match: {
            $and: [
              { starting_date: { $lte: new Date(todayDate) } },
              { ending_date: { $gte: new Date(todayDate) } },
            ],
          },
        },
        {
          $lookup: {
            from: "setyourdealsubs",
            localField: "_id",
            foreignField: "catId",
            as: "setYourDealSub",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "setYourDealSub.productId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $lookup: {
            from: "masterbrands",
            localField: "product.brand",
            foreignField: "_id",
            as: "brand",
          },
        },

        {
          $unwind: {
            path: "$brand",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]).then(async (result) => {
        console.log("result", result);
        let variants = [];
        for (let item of result) {
          for (let j of item.product) {
            for (let i of j.pricing) {
              let uomValue = await MasterUOMValue.findOne(
                { _id: mongoose.Types.ObjectId(i.sku) },
                {
                  uomValue: 1,
                }
              );
              if (uomValue) {
                i.uomValue = uomValue.uomValue;
              }

              let masterUom = await MasterUOM.findOne(
                { _id: mongoose.Types.ObjectId(i.uom) },
                {
                  title: 1,
                }
              );
              if (masterUom) {
                i.uom = masterUom.title;
              }

              variants.push({
                _id: item._id,
                name: item.name,
                starting_date: item.starting_date,
                ending_date: item.ending_date,
                starting_time: item.starting_time,
                ending_time: item.ending_time,

                price: i.price,
                spl_price: i.specialPrice,
                image: process.env.BASE_URL.concat(i.image[0]),
                product: j.name,
                product_id: j._id,
                varient_id: i._id,
                brand_name: item.brand.title,
                brand_id: item.brand._id,
                prescription: item.prescription,
                uom: i.uom,
                uomValue: i.uomValue,
              });
              break;
            }
          }
        }
        let newArray = [];
        for (let i of variants) {
          let obj = newArray.find((o) => o.details._id == i._id);
          if (obj) {
            newArray[newArray.indexOf(obj)].products.push({
              price: i.price,
              spl_price: i.spl_price,
              image: i.image,
              title: i.product,
              product_id: i.product_id,
              varient_id: i.varient_id,
              brand: i.brand_name,
              brand_id: i.brand_id,
              prescription: i.prescription,
              uom: i.uom,
              uomValue: i.uomValue,
              discount: Math.floor(((i.price - i.spl_price) / i.price) * 100),
              prescription: false,
            });
          } else {
            newArray.push({
              details: {
                _id: i._id,
                name: i.name,
                starting_date: i.starting_date,
                ending_date: i.ending_date,
                starting_time: i.starting_time,
                ending_time: i.ending_time,
              },
              products: [
                {
                  price: i.price,
                  spl_price: i.spl_price,
                  image: i.image,
                  title: i.product,
                  product_id: i.product_id,
                  varient_id: i.varient_id,
                  brand: i.brand_name,
                  brand_id: i.brand_id,
                  prescription: i.prescription,
                  uom: i.uom,
                  uomValue: i.uomValue,
                  prescription: false,
                  discount: Math.floor(
                    ((i.price - i.spl_price) / i.price) * 100
                  ),
                },
              ],
            });
          }
        }
        hotDeals = newArray;
      });

      // Top Categories -  master settings - category -healthcare)
      let topCategories = await MasterCategory.find(
        { categoryType: "healthcare", isDisabled: false },
        {
          title: 1,
        }
      );

      // Top Brands -  master settings - brand -promoted)
      let topBrands = await MasterBrand.find(
        { isPromoted: true, isDisabled: false },
        {
          title: 1,
        }
      );

      // Most searched Brands -  master settings - brand -trending)
      let mostSearchedBrands = await MasterBrand.find(
        { isTrending: true, isDisabled: false },
        {
          title: 1,
        }
      );

      // Top Selling Products - Inventory - healthcare -Most buyed)
      let mostBuyedProducts = await MostPurchasedProduct.aggregate([
        {
          $match: {
            productType: "healthcare",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "product_id",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $match: {
            "product.isDisabled": false,
          },
        },
        {
          $lookup: {
            from: "masterbrands",
            localField: "product.brand",
            foreignField: "_id",
            as: "brand",
          },
        },
        {
          $project: {
            _id: 0,
            product_id: "$product_id",
            title: { $first: "$product.name" },
            brand: { $first: "$brand.title" },
            metaTitle: {
              $cond: [
                { $ifNull: [{ $first: "$product.metaTitle" }, false] },
                { $first: "$product.metaTitle" },
                "",
              ],
            },
          },
        },
      ])
        .limit(10)
        .sort({ _id: -1 });

      // Most searched healthcare products - Inventory - healthcare -Most searched)
      let mostSearchedProducts = await mostSearchProduct.find(
        { type: "healthcare" },
        {
          productId: 1,
        }
      );
      let mostSearchedProductDetails = [];
      for (let ii of mostSearchedProducts) {
        let item = await Inventory.findOne(
          { _id: ii.productId },
          {
            _id: 0,
            product_id: "$_id",
            title: "$name",
            brand: 1,
            metaTitle: {
              $cond: [{ $ifNull: ["$metaTitle", false] }, "$metaTitle", ""],
            },
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

          mostSearchedProductDetails.push(item);
        }
      }

      // Most viewed articles - Medfeed - Article -Most viewed)
      let result = await Read.aggregate([
        { $match: { type: "article" } },
        {
          $project: {
            _id: 1,
            type: 1,
            contentId: 1,
            read_count: 1,
          },
        },
        {
          $sort: { read_count: 1 },
        },
        { $limit: 10 },
      ]);

      let articles = [];

      for (single of result) {
        let article = await Articles.findOne(
          {
            _id: mongoose.Types.ObjectId(single.contentId),
          },
          { heading: 1 }
        ).lean();
        if (article) {
          articles.push(article);
        }
      }

      res.status(200).json({
        message: "success",
        error: false,
        data: {
          mainSlider: mainSlider,
          categoriesToBag: categoriesToBag,
          featuredBrands: featuredBrands,
          slider: slider,
          offers: offers,
          customers: customers,
          medArticles: medArticles,
          shopConcern: shopConcern,
          popularProducts: items,
          hotDeals: hotDeals,
          orderMedicine: orderMedicine,
          topCategories: topCategories,
          topBrands: topBrands,
          mostSearchedBrands: mostSearchedBrands,
          mostBuyedProducts: mostBuyedProducts,
          mostSearchedProducts: mostSearchedProductDetails,
          mostViewedArticles: articles,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get web product details page
  getWebProductDetails: async (req, res, next) => {
    try {
      let productDetails = [];
      productDetails = await Inventory.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.body.id),
          },
        },
        {
          $project: {
            title: "$name",
            brand: 1,
            direction_use: {
              $cond: [
                { $ifNull: ["$directionsOfUse", false] },
                "$directionsOfUse",
                "",
              ],
            },
            "pricing._id": 1,
            "pricing.image": 1,
            "pricing.expiryDate": 1,
            "pricing.price": 1,
            "pricing.specialPrice": 1,
            "pricing.uom": 1,
            "pricing.sku": 1,
            "pricing.stock": 1,
            "pricing.video": 1,
            description: {
              $cond: [{ $ifNull: ["$moreInfo", false] }, "$moreInfo", ""],
            },
            substitutions: 1,
            relatedProducts: 1,
            statusLimit: 1,
            productDetails: {
              $cond: [{ $ifNull: ["$description", false] }, "$description", ""],
            },
            ingredients: {
              $cond: [{ $ifNull: ["$content", false] }, "$content", ""],
            },
            sideEffects: {
              $cond: [{ $ifNull: ["$sideEffects", false] }, "$sideEffects", ""],
            },
            warning: {
              $cond: [{ $ifNull: ["$warning", false] }, "$warning", ""],
            },
            metaTitles: {
              $cond: [{ $ifNull: ["$metaTitles", false] }, "$metaTitles", ""],
            },
            metaDescription: {
              $cond: [
                { $ifNull: ["$metaDescription", false] },
                "$metaDescription",
                "",
              ],
            },
            policy: 1,
          },
        },
      ]);

      for (let items of productDetails) {
        let reProducts = [];
        let subProducts = [];
        let pricings = [];
        let pricingDetails = [];

        // policy details in product (get return days)
        let policy = await MasterPolicy.findOne(
          { _id: items.policy },
          { return: 1 }
        );
        items.policyReturn = "";
        if (policy) {
          items.policyReturn = policy.return;
          delete items.policy;
        }

        // Delivery time in master settings
        let delveryTime = await MasterDeliveryChargeTime.findOne(
          { level: "Any store to main store" },
          { DeliveryTime: 1 }
        );
        items.delveryTime = "";
        if (delveryTime) {
          items.delveryTime = delveryTime.DeliveryTime;
        }

        // related products listing
        if (items.relatedProducts) {
          for (let item of items.relatedProducts) {
            let product = await Inventory.findOne(
              { _id: mongoose.Types.ObjectId(item) },
              {
                name: 1,
                "pricing.image": 1,
                "pricing.price": 1,
                "pricing.specialPrice": 1,
                "pricing.uom": 1,
                "pricing.sku": 1,
                "pricing.stock": 1,
                "pricing._id": 1,
                statusLimit: 1,
              }
            );

            if (product) {
              let data;
              for (let pricing of product.pricing) {
                if (pricing.stock > 0) {
                  data = {
                    _id: product._id,
                    title: product.name,
                  };
                  data.image = "";
                  data.discount = 0;
                  if (pricing.image[0]) {
                    data.image = imgPath.concat(pricing.image[0]);
                  }

                  let discountPercentage = Math.round(
                    ((pricing.price - pricing.specialPrice) / pricing.price) *
                      100
                  );

                  if (discountPercentage > 0 && discountPercentage < 100) {
                    data.discount = discountPercentage;
                  }
                  data.price = pricing.price;
                  data.spl_price = pricing.specialPrice;

                  if (product.statusLimit < pricing.stock) {
                    data.stockstatus = "Available";
                  } else {
                    data.stockstatus = "Limited";
                  }

                  break;
                }
              }

              if (data !== undefined && data !== null) {
                reProducts.push(data);
              }
            }
          }
          items.relatedProducts = reProducts;
        } else {
          items.relatedProducts = [];
        }
        // substitution products listing
        if (items.substitutions) {
          for (let subItem of items.substitutions) {
            let product = await Inventory.findOne(
              { _id: mongoose.Types.ObjectId(subItem) },
              {
                name: 1,
                "pricing.image": 1,
                "pricing.price": 1,
                "pricing.specialPrice": 1,
                "pricing.uom": 1,
                "pricing.sku": 1,
                "pricing.stock": 1,
                "pricing._id": 1,
                statusLimit: 1,
              }
            );

            if (product) {
              let subData;

              for (let pricing of product.pricing) {
                if (pricing.stock > 0) {
                  subData = {
                    _id: product._id,
                    title: product.name,
                  };
                  subData.image = "";
                  subData.discount = 0;
                  if (pricing.image[0]) {
                    subData.image = imgPath.concat(pricing.image[0]);
                  }

                  // let discountPercentage =
                  //   ((pricing.price - pricing.specialPrice) / pricing.price) *
                  //   100;
                  let discountPercentage = Math.round(
                    ((pricing.price - pricing.specialPrice) / pricing.price) *
                      100
                  );
                  if (discountPercentage > 0 && discountPercentage < 100) {
                    subData.discount = discountPercentage;
                  }
                  subData.price = pricing.price;
                  subData.spl_price = pricing.specialPrice;
                  if (product.statusLimit < pricing.stock) {
                    subData.stockstatus = "Available";
                  } else {
                    subData.stockstatus = "Limited";
                  }

                  break;
                }
              }

              if (subData !== undefined && subData !== null) {
                subProducts.push(subData);
              }
              // subProducts.push(subData)
            }
          }
          items.substitutions = subProducts;
        } else {
          items.substitutions = [];
        }

        // getting brand
        let brand = await MasterBrand.findOne(
          { _id: items.brand },
          { title: 1 }
        );

        if (brand) {
          items.brand = brand.title;
        } else {
          items.brand = "";
        }

        for (let pricing of items.pricing) {
          pricingDetails = {
            _id: pricing._id,
          };
          let uomTitle = "";
          let uomValue = await MasterUOMValue.findOne(
            { _id: mongoose.Types.ObjectId(pricing.sku) },
            {
              uomValue: 1,
            }
          );
          if (uomValue) {
            uomValue = uomValue.uomValue;
          }
          let uom = await MasterUOM.findOne(
            { _id: mongoose.Types.ObjectId(pricing.uom) },
            {
              title: 1,
            }
          );
          if (uom) {
            uom = uom.title;
          }

          // pricingDetails.image = "";
          pricingDetails.discount = 0;
          pricingDetails.expire_on = "";

          pricingDetails.imageArray = [];

          if (pricing.image[0]) {
            for (let image of pricing.image) {
              pricingDetails.imageArray.push({
                url: imgPath.concat(image),
                isImage: 0,
              });
            }
          }

          if (pricing.expiryDate) {
            pricingDetails.expire_on =
              "will be expired on " + pricing.expiryDate;
          }
          if (pricing.video) {
            // pricingDetails.video = pricing.video;
            pricingDetails.imageArray.push({ url: pricing.video, isImage: 1 });
          }

          if (pricing.stock > items.statusLimit) {
            pricingDetails.stockStatus = "Available";
          } else if (pricing.stock == 0) {
            pricingDetails.stockStatus = "Out of stock";
          } else {
            pricingDetails.stockStatus = "Limited";
          }

          let discountPercentage = Math.round(
            ((pricing.price - pricing.specialPrice) / pricing.price) * 100
          );
          if (discountPercentage > 0 && discountPercentage < 100) {
            pricingDetails.discount = discountPercentage;
          }

          pricingDetails.price = pricing.price;
          pricingDetails.spl_price = pricing.specialPrice;
          pricingDetails.uomValue = uomValue;
          pricingDetails.uom = uom;

          // checking product exist in cart
          let cart = await Cart.findOne({
            variantId: pricing._id,
            userId: req.user._id,
          });

          if (cart) {
            pricingDetails.is_cart = 1;
            pricingDetails.cartId = cart._id;
            pricingDetails.quantity = cart.quantity;
          } else {
            pricingDetails.is_cart = 0;
            pricingDetails.cartId = "";
            pricingDetails.quantity = 0;
          }

          pricings.push(pricingDetails);
        }

        items.pricing = pricings;
        items.cashOnDelivery = true;

        let averageRating = await productRating.aggregate([
          {
            $match: {
              productId: mongoose.Types.ObjectId(req.body.id),
            },
          },
          {
            $group: {
              _id: "$productId",
              sum: { $sum: 1 },
              avgStar: { $avg: "$star" },
            },
          },
          { $project: { sum: 1, avgStar: { $round: ["$avgStar", 1] } } },
        ]);
        let average = 0
        let ratingCount =  0
        if(averageRating[0]?.avgStar){
         average = averageRating[0].avgStar;
         ratingCount = averageRating[0].sum;
        }

        let starRating = await productRating.aggregate([
          {
            $match: {
              productId: mongoose.Types.ObjectId(req.body.id),
            },
          },
          {
            $group: {
              _id: "$star",
              sum: { $sum: 1 },
            },
          },
          {
            $project: {
              percent: {
                $round: {
                  $multiply: [{ $divide: ["$sum", ratingCount] }, 100],
                },
              },
            },
          },
        ]);    
        const result ={}
        for(const {_id,percent} of starRating){
          result[_id]= percent
        }
        if(result["1"] == undefined) result[1] =0 
        if(result["2"] == undefined) result[2] =0
        if(result["3"] == undefined) result[3] =0 
        if(result["4"] == undefined) result[4] =0
        if(result["5"] == undefined) result[5] =0
        items.star_rating = result
        // items.star_rating = [
        //   {
        //     1: "20",
        //     2: "40",
        //     3: "50",
        //     4: "100",
        //     5: "50",
        //   },
        // ];

        items.rating = average;
      }

      if (!productDetails.length) {
        productDetails[0] = {};
      }
      res.status(200).json({
        error: false,
        message: "Products details are",
        data: {
          products: productDetails[0],
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getWebProductByBrandId: async (req, res, next) => {
    try {

      let banner = await WebBanner.aggregate([
        {
          $lookup: {
            from: "mastersubcategoryhealthcares",
            localField: "redirection_id",
            foreignField: "_id",
            as: "subCategory",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "redirection_id",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $lookup: {
            from: "masterbrands",
            localField: "product.brand",
            foreignField: "_id",
            as: "brand",
          },
        },
        {
          $project: {
            _id: 1,
            redirection_type: 1,
            redirection_id: 1,
            categoryId: { $first: "$subCategory.categoryId" },
            image: { $concat: [imgPath, "$image"] },
            typeName: {
              $ifNull: [
                { $first: "$subCategory.title" },
                { $first: "$product.name" },
              ],
            },
            brand: { $first: "$brand.title" },
            metaTitles: { $first: "$product.metaTitles" },
          },
        },
      ]);

      let items = [];
      let productDetails = await Inventory.find(
        { brand: req.body.brandId, type: "healthcare" },
        {
          name: 1,
          statusLimit: 1,
          "pricing.image": 1,
          "pricing.price": 1,
          "pricing.specialPrice": 1,
          "pricing.uom": 1,
          "pricing.sku": 1,
          "pricing.stock": 1,
          "pricing._id": 1,
          metaTitles: {
            $cond: [{ $ifNull: ["$metaTitles", false] }, "$metaTitles", ""],
          },
          metaDescription: {
            $cond: [
              { $ifNull: ["$metaDescription", false] },
              "$metaDescription",
              "",
            ],
          },
        }
      )
        .sort("-id")
        .populate({ path: "brand", select: ["title"] })
        .lean();
      // .limit(limit)
      // .skip(skip);

      for (let item of productDetails) {
        
        // get average rating
        let averageRating = await productRating.aggregate([
          {
            $match: {
              productId: mongoose.Types.ObjectId(item._id),
            },
          },
          {
            $group: {
              _id: "$productId",
              avgStar: { $avg: "$star" },
            },
          },
          { $project: { avgStar: { $round: ["$avgStar", 1] } } },
        ]);
        let average = 0
        if(averageRating[0]?.avgStar){
         average = averageRating[0].avgStar;
        }
        let uomTitle = "";

        var data = {
          _id: item._id,
          title: item.name,
          brandName: item.brand.title,
          prescription: false,
          rating: average,
          metaTitles: item.metaTitles,
          metaDescription: item.metaDescription,
        };
        let checkStatus = false;
        for (let pricing of item.pricing) {
          if (pricing.stock > 0) {
            checkStatus = true;
            if (pricing.stock > item.statusLimit) {
              data.stockStatus = "Available";
            } else {
              data.stockStatus = "Limited";
            }
            let uom = await MasterUOMValue.findOne(
              { _id: mongoose.Types.ObjectId(pricing.sku) },
              {
                uomValue: 1,
              }
            );
            if (uom) {
              uomTitle = uom.uomValue;
            }
            data.image = "";
            data.discount = 0;
            if (pricing.image[0]) {
              data.image = imgPath.concat(pricing.image[0]);
            }
            let discountPercentage = Math.round(
              ((pricing.price - pricing.specialPrice) / pricing.price) * 100
            );
            if (discountPercentage > 0 && discountPercentage < 100) {
              data.discount = discountPercentage;
            }

            data.price = pricing.price;
            data.spl_price = pricing.specialPrice;
            data.uom = uomTitle;
            data.varientId = pricing._id;
            items.push(data);
            break;
          }
        }

        // If all varients are null then take the first varient of product
        if (!checkStatus) {
          data.stockStatus = "Out of stock";
          let uom = await MasterUOMValue.findOne(
            { _id: mongoose.Types.ObjectId(item.pricing[0].sku) },
            {
              uomValue: 1,
            }
          );
          if (uom) {
            uomTitle = uom.uomValue;
          }
          data.image = "";
          data.discount = 0;
          if (item.pricing[0].image[0]) {
            data.image = imgPath.concat(item.pricing[0].image[0]);
          }
          let discountPercentage = Math.round(
            ((item.pricing[0].price - item.pricing[0].specialPrice) /
              item.pricing[0].price) *
              100
          );
          if (discountPercentage > 0 && discountPercentage < 100) {
            data.discount = discountPercentage;
          }
          data.price = item.pricing[0].price;
          data.spl_price = item.pricing[0].specialPrice;
          data.uom = uomTitle;
          data.varientId = item.pricing[0]._id;
          items.push(data);
        }
      }

      let limit = 0;
      if (req.body.limit) {
        limit = parseInt(req.body.limit);
      }

      if (limit == 0) limit = 30;

      let page = parseInt(req.body.page) - 1;

      let nextPage = false;
      let start = page * limit;
      let end = page * limit + limit;
      let products = items.slice(start, end);
      if (items.length > end) {
        nextPage = true;
      } else {
        nextPage = false;
      }
      if (items.length == 0) {
        nextPage = false;
      }
      let totalPage = Math.ceil(items.length / limit);
      res.status(200).json({
        error: false,
        message: "Products are",
        data: {
          banner: banner,
          productDetails: {
            totalPage,
            nextPage,
            products,
          },
          //favouriteCount: favouriteCount,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getMedpride: async (req, res, next) => {
    try {
      const Type = "Premium Subscription";

      const scratchableAndUpComingCoupons = await coupons.aggregate([
        {
          $match: {
            type: Type,
            to: { $gte: new Date() },
            isDisabled: false,
          },
        },

        {
          $project: {
            image: { $concat: [process.env.BASE_URL, "$image"] },
            _id: 1,
            name: 1,
            code: 1,
            from: 1,
            to: 1,
            type: 1,
            percentage: 1,
            termsAndCondition: 1,
          },
        },
      ]);
      return res.status(200).json({
        error: false,
        message: "Medpride details are",
        data: {
          scratchableAndUpComingCoupons: scratchableAndUpComingCoupons,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  applyPremiumCoupon: async (req, res, next) => {
    try {
      let userId = req.user._id;
      let couponId = req.body.couponId;
      if (couponId) {
        // let premiumCardId =req.body.premiumCardId
        let validCoupon = await coupons.findOne({
          _id: couponId,
        });
        if (validCoupon) {
          let validPremiumCard = await specialPremiumCrud.find({}).lean();
          console.log("validPremiumCard", validPremiumCard);
          if (validPremiumCard.length) {
            for (i = 0; i < validPremiumCard.length; i++) {
              if (
                validCoupon.purchaseAmount <= validPremiumCard[i].specialPrice
              ) {
                let numberOfTimesUserAppliedThisCoupon =
                  await UserAppliedCoupons.find({
                    userId,
                    couponType: validCoupon.type,
                    couponId: validCoupon._id,
                  }).countDocuments();
                if (
                  validCoupon.totalTimesUsed >= validCoupon.maximumUser ||
                  numberOfTimesUserAppliedThisCoupon >=
                    validCoupon.numberPerUser
                ) {
                  validPremiumCard[i].message =
                    " this coupon is not applicable for this user ";
                  validPremiumCard[i].discountPrice =
                    validPremiumCard[i].specialPrice;
                  validPremiumCard[i].error = true;
                  let discountAmount =
                    validPremiumCard[i].price -
                    validPremiumCard[i].specialPrice;
                  validPremiumCard[i].offer_percentage =
                    (discountAmount / validPremiumCard[i].price) * 100;
                } else {
                  // let discountPrice =0

                  let discount =
                    validPremiumCard[i].specialPrice *
                    (validCoupon.percentage / 100);
                  validPremiumCard[i].discountPrice = Math.floor(
                    validPremiumCard[i].specialPrice - discount
                  );
                  console.log(validPremiumCard[i]);
                  if (discount > validCoupon.maximumAmount) {
                    console.log(validPremiumCard[i], "in if");
                    validPremiumCard[i].discountPrice = Math.floor(
                      validPremiumCard[i].specialPrice -
                        validCoupon.maximumAmount
                    );
                  }
                  validPremiumCard[i].message = " ";
                  validPremiumCard[i].error = false;
                  let discountAmount =
                    validPremiumCard[i].price -
                    validPremiumCard[i].specialPrice;
                  validPremiumCard[i].offer_percentage = Math.floor(
                    (discountAmount / validPremiumCard[i].price) * 100
                  );
                }
              } else {
                validPremiumCard[i].message =
                  " this coupon is not applicable for this user ";
                validPremiumCard[i].discountPrice =
                  validPremiumCard[i].specialPrice;
                validPremiumCard[i].error = true;
                let discountAmount =
                  validPremiumCard[i].price - validPremiumCard[i].specialPrice;
                validPremiumCard[i].offer_percentage = Math.floor(
                  (discountAmount / validPremiumCard[i].price) * 100
                );
              }
            }
            //save new applied coupon
            await new UserAppliedCoupons({
              userId,
              couponType: validCoupon.type,
              couponId: validCoupon._id,
            }).save();

            //increment count of times this coupon is used

            await coupons.updateOne(
              { _id: validCoupon._id },
              { $inc: { totalTimesUsed: 1 } }
            );
            return res.status(200).json({
              error: false,
              message: " applied successfully",
              data: {
                validPremiumCard: validPremiumCard,
              },
            });
          } else {
            return res.status(200).json({
              error: true,
              message: "Inval id premium subscription ",
            });
          }
        } else {
          return res.status(200).json({
            error: true,
            message: "Invalid Coupon code",
          });
        }
      } else {
        return res.status(200).json({
          error: true,
          message: "Invalid premium subscription ",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  removePremiumCoupon: async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      await doRemoveCouponFromTheCart(userId, req.body).then(
        ({ statusCode, error, message }) => {
          return res.status(statusCode).json({ error, message });
        }
      );
    } catch (error) {
      next(error);
    }
  },

  // Get the order medicine page in web
  getWebOrderMedicineOnline: async (req, res, next) => {
    try {
      // get cart count of user
      let cartCount = await Cart.countDocuments({
        userId: mongoose.Types.ObjectId(req.user._id),
      });

      // ads - cart -  how to order medicine
      let orderMedicine = await AdsHowToOrderMedicine.findOne(
        { isDisabled: false },
        {
          type: 1,
          thumbnail: { $concat: [imgPath, "$thumbnail"] },
          video: 1,
        }
      );

      // ads - cart - order madicine - 3 icon
      let orderMedicine3icon = await AdsOrderMedicine3Icon.findOne(
        { isDisabled: false },
        {
          name: 1,
          image: { $concat: [imgPath, "$image"] },
        }
      );

      // get 3 icons (ads -medimall -top 3 icons)
      let top3Icons = await AdsMedimallTopIconCatHealth.find(
        { sliderType: "top3icons" },
        {
          sliderType: 1,
          image: { $concat: [imgPath, "$image"] },
        }
      );

      // get 3 icons (ads -medimall -top 3 icons)
      let prescription = await AdsMedimallTopIconCatHealth.findOne(
        { sliderType: "top3iconsprescription" },
        {
          sliderType: 1,
          image: { $concat: [imgPath, "$image"] },
        }
      );

      // get 3 icons (ads -medimall -top 3 icons prescription)
      //  let top3Icons = await AdsMedimallTopIconCatHealth.aggregate([
      //   {
      //     $match: {
      //       $or:[{sliderType: "top3icons"},{sliderType: "top3iconsprescription"}]
      //     },
      //   },
      //   { $project: {sliderType:1, image: { $concat: [imgPath, "$image"] } } },
      // ]);

      var slider = await AdsOrderMedicineSlider.aggregate([
        {
          $match: {
            sliderType: "OrderMedicineSlider",
            isDisabled: false,
          },
        },
        {
          $lookup: {
            from: "mastersubcategoryhealthcares",
            localField: "typeId",
            foreignField: "_id",
            as: "subCategory",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "typeId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $lookup: {
            from: "masterbrands",
            localField: "product.brand",
            foreignField: "_id",
            as: "brand",
          },
        },
        {
          $project: {
            _id: 1,
            type: {
              $cond: {
                if: { $eq: ["$type", 1] },
                then: "product",
                else: "category",
              },
            },
            typeId: 1,
            categoryId: { $first: "$subCategory.categoryId" },
            image: { $concat: [imgPath, "$image"] },
            typeName: {
              $ifNull: [
                { $first: "$subCategory.title" },
                { $first: "$product.name" },
              ],
            },
            brand: { $first: "$brand.title" },
            metaTitles: { $first: "$product.metaTitles" },
          },
        },
      ]);

      res.status(200).json({
        message: "success",
        error: false,
        data: {
          orderMedicine3icon: orderMedicine3icon,
          orderMedicine: orderMedicine,
          prescription: prescription,
          top3Icons: top3Icons,
          slider: slider,
          cartCount: cartCount,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
