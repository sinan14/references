const mongoose = require("mongoose");
const SpotLight = require("../models/ads/home/spotlight");
const sliders = require("../models/ads/medimall/sliderTopWishRecent");
const AdsMedimallTopIconCatHealth = require("../models/ads/medimall/topIconCatHealth");
const MainCategory = require("../models/ads/medimall/mainCategory");
const topCategory = require("../models/ads/medimall/topCategories");
const Brand = require("../models/mastersettings/brand");
const editorsChoice = require("../models/ads/seasonal-offers/editorsChoiceVocalLocalEnergizeYourWorkout");
const Promotion = require("../models/ads/cart/promotion");
const budgetStore = require("../models/ads/seasonal-offers/budgetStore");
const grooming = require("../models/ads/medimall/grooming");
const cart = require("../models/cart");
const InventorySuggested = require("../models/inventorySuggested");
const Notification = require("../models/user_notification");
const InventoryFavourite = require("../models/inventoryFavourites");
const AdsHomeCart = require("../models/ads/home/cart");
const Products = require("../models/inventory");
const Category = require("../models/mastersettings/category");
const AdsHomeSlider1234ad25 = require("../models/ads/home/slider1234ad25");
const AdsSeasonalOfferSetYourDeal = require("../models/ads/seasonal-offers/setYourDeal");
const MasterUOMValue = require("../models/mastersettings/uomValue");
const popupBanner = require("../models/customer/popupBanner");
const moment = require("moment-timezone");
const MostPurchasedProduct = require("../models/most/mostPurchasedProducts");
const MasterBrand = require("../models/mastersettings/brand");
const mostFavouriteProduct = require("../models/inventoryMostFavourite");
const Inventory = require('../models/inventory');

const imgPath = process.env.BASE_URL;

module.exports = {
  GetMedimalMainHome: async (req, res, next) => {
    try {
      let cart_count = await cart.countDocuments({
        userId: mongoose.Types.ObjectId(req.user._id),
      });
      let favouriteCount = await InventoryFavourite.find({
        userId: req.user._id,
      }).countDocuments();
      let currentDate = new Date();
      let todayStarting = moment(currentDate)
        .tz(process.env.TIME_ZONE)
        .set({ h: 00, m: 00, s: 00 })
        .utc();
      let todayEnding = moment(currentDate)
        .tz(process.env.TIME_ZONE)
        .set({ h: 23, m: 59, s: 59 });

      let Popup_banner = await popupBanner
        .aggregate([
          {
            $match: {
              $and: [
                { from: { $gte: new Date(todayStarting) } },
                { from: { $lte: new Date(todayEnding) } },
                { type: "medimall" },
              ],
            },
          },
          {
            $project: {
              type: 1,
              from: 1,
              image: { $concat: [imgPath, "$image"] },
            },
          },
          { $sort: { _id: -1 } }
        ])
        .limit(1);
      let PopupBanner = {};
      console.log("Popup_banner", Popup_banner);
      if (Popup_banner.length) {
        PopupBanner.img = Popup_banner[0].image;
        PopupBanner.status = true;
      } else {
        PopupBanner.img = "";
        PopupBanner.status = false;
      }
      let spotlight = await SpotLight.aggregate([
        {
          $match: {
            isMedimall: true,
          },
        },
        {
          $lookup: {
            from: "mastercategories",
            localField: "typeId",
            foreignField: "_id",
            as: "masterCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubsubcategories",
            localField: "typeId",
            foreignField: "_id",
            as: "subCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubcategoryhealthcares",
            localField: "typeId",
            foreignField: "_id",
            as: "subSubCategory",
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
          $project: {
            type: 1,
            offerText: 1,
            colorCode: 1,
            redirect_id: "$typeId",
            image: { $concat: [imgPath, "$image"] },
            typeName1: {
              $ifNull: [
                { $first: "$subCategory.title" },
                { $first: "$subSubCategory.title" },
              ],
            },
            typeName2: {
              $ifNull: [
                { $first: "$product.name" },
                { $first: "$masterCategory.title" },
              ],
            },
          },
        },
      ]).sort("-updatedAt");
      for (i = 0; i < spotlight.length; i++) {
        if (spotlight[i].typeName1) {
          spotlight[i].title = spotlight[i].typeName1;
          delete spotlight[i].typeName1;
        } else if (spotlight[i].typeName2) {
          spotlight[i].title = spotlight[i].typeName2;
          delete spotlight[i].typeName2;
        } else {
          spotlight[i].title = "";
        }
      }
      let spotlightWarp = await SpotLight.aggregate([
        {
          $match: {
            isMedimall: true,
          },
        },
        {
          $project: { thumbnail: { $concat: [imgPath, "$thumbnail"] } },
        },
      ])
        .sort("-updatedAt")
        .limit(1);

      if (spotlightWarp.length) {
        spotlightWarp = spotlightWarp[0];
      } else {
        spotlightWarp = {};
      }

      let Slider1 = await sliders.aggregate([
        {
          $match: {
            sliderType: "slider1",
          },
        },
        {
          $lookup: {
            from: "mastercategories",
            localField: "typeId",
            foreignField: "_id",
            as: "masterCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubsubcategories",
            localField: "typeId",
            foreignField: "_id",
            as: "subCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubcategoryhealthcares",
            localField: "typeId",
            foreignField: "_id",
            as: "subSubCategory",
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
          $project: {
            type: 1,
            redirect_id: "$typeId",
            image: { $concat: [imgPath, "$image"] },
            typeName1: {
              $ifNull: [
                { $first: "$subCategory.title" },
                { $first: "$subSubCategory.title" },
              ],
            },
            typeName2: {
              $ifNull: [
                { $first: "$product.name" },
                { $first: "$masterCategory.title" },
              ],
            },
          },
        },
      ]);
      for (i = 0; i < Slider1.length; i++) {
        if (Slider1[i].typeName1) {
          Slider1[i].title = Slider1[i].typeName1;
          delete Slider1[i].typeName1;
        } else if (Slider1[i].typeName2) {
          Slider1[i].title = Slider1[i].typeName2;
          delete Slider1[i].typeName2;
        } else {
          Slider1[i].title = "";
        }
      }

      let top3Icons = await AdsMedimallTopIconCatHealth.aggregate([
        {
          $match: {
            $or: [
              { sliderType: "top3icons" },
              { sliderType: "top3iconsprescription" },
            ],
          },
        },
        { $project: { image: { $concat: [imgPath, "$image"] } } },
      ]);

      let mainCategory = await MainCategory.aggregate([
        {
          $match: {
            isDisabled: false,
          },
        },
        {
          $project: {
            image: { $concat: [imgPath, "$image"] },
            text: "$offerText",
          },
        },
      ]);
      //hot deals for you
      let todayDate = new Date();
      console.log("todayDate", todayDate);
      let HotDealsFor = [];
      let details = {};
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
      ]).then(async (result) => {
        console.log("result", result);
        let variants = [];
        for (let item of result) {
          for (let j of item.product) {
            for (let i of j.pricing) {
              details = {
                deal_id: item._id,
                deal_name: item.name,
              };
              variants.push({
                brand_id: j.brand,
                price: i.price,
                spl_price: i.specialPrice,
                image: process.env.BASE_URL.concat(i.image[0]),
                product: j.name,
                product_id: j._id,
                varient_id: i._id,
                sku: i.sku,
              });
              break;
            }
          }
        }

        HotDealsFor = variants;
      });
      let discount = 0;
      let uom = "";
      for (var i = 0; i < HotDealsFor.length; i++) {
        HotDealsFor[i].brand = await Brand.findOne(
          { _id: mongoose.Types.ObjectId(HotDealsFor[i].brand_id) },
          { title: 1, _id: 0 }
        );
        HotDealsFor[i].discount = Math.floor(
          ((HotDealsFor[i].price - HotDealsFor[i].spl_price) /
            HotDealsFor[i].price) *
            100
        );
        delete HotDealsFor[i]._id;
        delete HotDealsFor[i].brand_id;
        uom = await MasterUOMValue.findOne(
          { _id: mongoose.Types.ObjectId(HotDealsFor[i].sku) },
          {
            uomValue: 1,
          }
        );
        if (uom) {
          HotDealsFor[i].uomValue = uom.uomValue;
        }
      }
      for (var i = 0; i < HotDealsFor.length; i++) {
        HotDealsFor[i].brand = HotDealsFor[i].brand.title;
      }
      if (HotDealsFor.length) {
        HotDealsForYou = {
          deal_id: details.deal_id,
          deal_name: details.deal_name,
          Products: HotDealsFor,
        };
      } else {
        HotDealsForYou = {
          deal_id: "",
          deal_name: "",
          Products: [],
        };
      }

      let TopCategorys = await topCategory.aggregate([
        {
          $match: {
            isDisabled: false,
          },
        },
        {
          $lookup: {
            from: "mastercategories",
            localField: "categoryId",
            foreignField: "_id",
            as: "masterCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubsubcategories",
            localField: "categoryId",
            foreignField: "_id",
            as: "subCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubcategoryhealthcares",
            localField: "categoryId",
            foreignField: "_id",
            as: "subSubCategory",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "categoryId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $project: {
            image: { $concat: [imgPath, "$image"] },
            cat_id: "$categoryId",
            offerPercentage: "$offerPercentage",
            typeName1: {
              $ifNull: [
                { $first: "$subCategory.title" },
                { $first: "$subSubCategory.title" },
              ],
            },
            typeName2: {
              $ifNull: [
                { $first: "$product.name" },
                { $first: "$masterCategory.title" },
              ],
            },
          },
        },
      ]);
      console.log("TopCategorys", TopCategorys);
      for (i = 0; i < TopCategorys.length; i++) {
        if (TopCategorys[i].typeName1) {
          TopCategorys[i].title = TopCategorys[i].typeName1;
          delete TopCategorys[i].typeName1;
        } else if (TopCategorys[i].typeName2) {
          TopCategorys[i].title = TopCategorys[i].typeName2;
          delete TopCategorys[i].typeName2;
        } else {
          TopCategorys[i].title = "";
        }
      }

      //cart your med essentials
      var med_essential = await AdsHomeCart.aggregate([
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
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: "$subCategory._id",
            category: "$subCategory.title",
            image: { $concat: [imgPath, "$subCategory.image"] },
          },
        },
      ]);

      let Slider2 = await sliders.aggregate([
        {
          $match: {
            sliderType: "slider2",
          },
        },
        {
          $lookup: {
            from: "mastercategories",
            localField: "typeId",
            foreignField: "_id",
            as: "masterCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubsubcategories",
            localField: "typeId",
            foreignField: "_id",
            as: "subCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubcategoryhealthcares",
            localField: "typeId",
            foreignField: "_id",
            as: "subSubCategory",
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
          $project: {
            type: 1,
            redirect_id: "$typeId",
            image: { $concat: [imgPath, "$image"] },
            typeName1: {
              $ifNull: [
                { $first: "$subCategory.title" },
                { $first: "$subSubCategory.title" },
              ],
            },
            typeName2: {
              $ifNull: [
                { $first: "$product.name" },
                { $first: "$masterCategory.title" },
              ],
            },
          },
        },
      ]);
      for (i = 0; i < Slider2.length; i++) {
        if (Slider2[i].typeName1) {
          Slider2[i].title = Slider2[i].typeName1;
          delete Slider2[i].typeName1;
        } else if (Slider2[i].typeName2) {
          Slider2[i].title = Slider2[i].typeName2;
          delete Slider2[i].typeName2;
        } else {
          Slider2[i].title = "";
        }
      }

      let ShopByBrands = await Brand.aggregate([
        {
          $match: {
            isShop: true,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "brand",
            as: "product",
          },
        },
        {
          $project: {
            image: { $concat: [imgPath, "$image"] },
            title: 1,
          },
        },
      ]);

      let Slider3 = await sliders.aggregate([
        {
          $match: {
            sliderType: "slider3",
          },
        },
        {
          $lookup: {
            from: "mastercategories",
            localField: "typeId",
            foreignField: "_id",
            as: "masterCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubsubcategories",
            localField: "typeId",
            foreignField: "_id",
            as: "subCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubcategoryhealthcares",
            localField: "typeId",
            foreignField: "_id",
            as: "subSubCategory",
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
          $project: {
            type: 1,
            redirect_id: "$typeId",
            image: { $concat: [imgPath, "$image"] },
            typeName1: {
              $ifNull: [
                { $first: "$subCategory.title" },
                { $first: "$subSubCategory.title" },
              ],
            },
            typeName2: {
              $ifNull: [
                { $first: "$product.name" },
                { $first: "$masterCategory.title" },
              ],
            },
          },
        },
      ]);
      for (i = 0; i < Slider3.length; i++) {
        if (Slider3[i].typeName1) {
          Slider3[i].title = Slider3[i].typeName1;
          delete Slider3[i].typeName1;
        } else if (Slider3[i].typeName2) {
          Slider3[i].title = Slider3[i].typeName2;
          delete Slider3[i].typeName2;
        } else {
          Slider3[i].title = "";
        }
      }

      //BestSellers
      let BestSellers =[]
      let results = await mostFavouriteProduct.aggregate([
        {
          $match:{
            type: "healthcare",
          }
        },{
          $sort:{
            count: -1
          }
        }
      ]);
      console.log('results',results)
      for (let ii of results) {
        let item = await Inventory.findOne(
          { _id: ii.productId },
          {
            id:'$_id',
            productId:1,
            product: '$name',
            brand: 1,
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
         let uom = await MasterUOMValue.findOne(
            { _id: mongoose.Types.ObjectId(item.pricing[0].sku) },
            {
              uomValue: 1,
            }
          );
          if (uom) {
            item.uomValue = uom.uomValue;
          }else{
            item.uomValue = ''
          }
          item.image = item.pricing[0].image[0];
          if (!item.image.includes(process.env.BASE_URL)) {
            item.image = process.env.BASE_URL.concat(item.image);
          }
          item.price = item.pricing[0].price;
          item.spl_price = item.pricing[0].specialPrice;
          item.discount = item.price - item.spl_price;
          item.varient_id = item.pricing[0]._id
          delete item.pricing;
          delete item._id;

          BestSellers.push(item);
        }
      }
     
      let Slider4 = await sliders.aggregate([
        {
          $match: {
            sliderType: "slider4",
          },
        },
        {
          $lookup: {
            from: "mastercategories",
            localField: "typeId",
            foreignField: "_id",
            as: "masterCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubsubcategories",
            localField: "typeId",
            foreignField: "_id",
            as: "subCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubcategoryhealthcares",
            localField: "typeId",
            foreignField: "_id",
            as: "subSubCategory",
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
          $project: {
            type: 1,
            redirect_id: "$typeId",
            image: { $concat: [imgPath, "$image"] },
            typeName1: {
              $ifNull: [
                { $first: "$subCategory.title" },
                { $first: "$subSubCategory.title" },
              ],
            },
            typeName2: {
              $ifNull: [
                { $first: "$product.name" },
                { $first: "$masterCategory.title" },
              ],
            },
          },
        },
      ]);
      for (i = 0; i < Slider4.length; i++) {
        if (Slider4[i].typeName1) {
          Slider4[i].title = Slider4[i].typeName1;
          delete Slider4[i].typeName1;
        } else if (Slider4[i].typeName2) {
          Slider4[i].title = Slider4[i].typeName2;
          delete Slider4[i].typeName2;
        } else {
          Slider4[i].title = "";
        }
      }

      let FeaturedBrands = await Brand.aggregate([
        {
          $match: {
            isFeatured: true,
          },
        },
        {
          $project: {
            image: { $concat: [imgPath, "$image"] },
            title: 1,
          },
        },
      ]);
      // top recommendations
      let TopRecommended =[]
      let result = await MostPurchasedProduct.aggregate([
        {
          $match:{
            productType: "healthcare",
          }
        },{
          $sort:{
            count: -1
          }
        }
      ]);
      console.log('result',result)
      for (let ii of result) {
        let item = await Inventory.findOne(
          { _id: ii.product_id },
          {
            id:'$_id',
            productId:1,
            product: '$name',
            brand: 1,
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
          item.price = item.pricing[0].price;
          item.spl_price = item.pricing[0].specialPrice;
          item.discount = item.price - item.spl_price;
          delete item.pricing;
          delete item._id;

          TopRecommended.push(item);
        }
      }
      // let TopRecommended = [
      //   {
      //     id: "61719db09081670e5c4232f3",
      //     image:
      //       "http://143.110.240.107:8000/inventory/image_1634837163744.jpg",
      //     product: "test p351",
      //     brand: "SDL Test brand",
      //     price: 2532,
      //     spl_price: 1592,
      //     discount: 37,
      //   },
      //   {
      //     id: "6172aca82a18e03db8213a02",
      //     image:
      //       "http://143.110.240.107:8000/inventory/image_1634905184129.jpeg",
      //     product: "SDL COVID 19 Pdt",
      //     brand: "SDL Test brand",
      //     price: 500,
      //     spl_price: 400,
      //     discount: 20,
      //   },
      // ];
      let TopDeals = await sliders.aggregate([
        {
          $match: {
            sliderType: "topdeals",
          },
        },
        {
          $lookup: {
            from: "mastercategories",
            localField: "typeId",
            foreignField: "_id",
            as: "masterCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubsubcategories",
            localField: "typeId",
            foreignField: "_id",
            as: "subCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubcategoryhealthcares",
            localField: "typeId",
            foreignField: "_id",
            as: "subSubCategory",
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
          $unwind: "$product",
        },
        {
          $unwind: "$product.pricing",
        },
        {
          $lookup: {
            from: "masteruomvalues",
            localField: "product.pricing.sku",
            foreignField: "_id",
            as: "uomValue",
          },
        },

        {
          $unwind: {
            path: "$uomValue",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            type: 1,
            redirect_id: "$typeId",
            image: { $concat: [imgPath, "$image"] },
            uomValue: "$uomValue.uomValue",
            typeName1: {
              $ifNull: [
                { $first: "$subCategory.title" },
                { $first: "$subSubCategory.title" },
              ],
            },
            typeName2: {
              $ifNull: ["$product.name", { $first: "$masterCategory.title" }],
            },
          },
        },
      ]);
      for (i = 0; i < TopDeals.length; i++) {
        if (TopDeals[i].typeName1) {
          TopDeals[i].title = TopDeals[i].typeName1;
          delete TopDeals[i].typeName1;
        } else if (TopDeals[i].typeName2) {
          TopDeals[i].title = TopDeals[i].typeName2;
          delete TopDeals[i].typeName2;
        } else {
          TopDeals[i].title = "";
        }
      }

      let Slider5 = await sliders.aggregate([
        {
          $match: {
            sliderType: "slider5",
          },
        },
        {
          $lookup: {
            from: "mastercategories",
            localField: "typeId",
            foreignField: "_id",
            as: "masterCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubsubcategories",
            localField: "typeId",
            foreignField: "_id",
            as: "subCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubcategoryhealthcares",
            localField: "typeId",
            foreignField: "_id",
            as: "subSubCategory",
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
          $project: {
            type: 1,
            redirect_id: "$typeId",
            image: { $concat: [imgPath, "$image"] },
            typeName1: {
              $ifNull: [
                { $first: "$subCategory.title" },
                { $first: "$subSubCategory.title" },
              ],
            },
            typeName2: {
              $ifNull: [
                { $first: "$product.name" },
                { $first: "$masterCategory.title" },
              ],
            },
          },
        },
      ]);
      for (i = 0; i < Slider5.length; i++) {
        if (Slider5[i].typeName1) {
          Slider5[i].title = Slider5[i].typeName1;
          delete Slider5[i].typeName1;
        } else if (Slider5[i].typeName2) {
          Slider5[i].title = Slider5[i].typeName2;
          delete Slider5[i].typeName2;
        } else {
          Slider5[i].title = "";
        }
      }
      //vocal local
      let VocalLocal = [];
      let G = await editorsChoice
        .aggregate([
          {
            $match: {
              sliderType: "vocal_local",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "ProductId",
              foreignField: "_id",
              as: "product",
            },
          },
        ])
        .then(async (result) => {
          let variant = [];
          for (let item of result) {
            for (let j of item.product) {
              for (let i of j.pricing) {
                variant.push({
                  price: i.price,
                  spl_price: i.specialPrice,
                  image: process.env.BASE_URL.concat(i.image[0]),
                  product: j.name,
                  id: j._id,
                  brand_id: j.brand,
                });
                break;
              }
            }
          }
          VocalLocal = variant;
        });
      let offer = 0;
      for (var i = 0; i < VocalLocal.length; i++) {
        VocalLocal[i].brand = await Brand.findOne(
          { _id: mongoose.Types.ObjectId(VocalLocal[i].brand_id) },
          { title: 1, _id: 0 }
        );
        VocalLocal[i].offer = Math.floor(
          ((VocalLocal[i].price - VocalLocal[i].spl_price) /
            VocalLocal[i].price) *
            100
        );
        delete VocalLocal[i]._id;
        delete VocalLocal[i].brand_id;
      }
      for (var i = 0; i < VocalLocal.length; i++) {
        VocalLocal[i].brand = VocalLocal[i].brand.title;
      }

      let Promotions = await Promotion.aggregate([
        { $match: { isDisabled: false } },

        {
          $project: {
            image: { $concat: [imgPath, "$image"] },
            termsConditions: 1,
          },
        },
      ]);
      let BudgetStore = await budgetStore.aggregate([
        {
          $match: {
            sliderType: "BudgetStore",
          },
        },
        {
          $lookup: {
            from: "mastercategories",
            localField: "categoryId",
            foreignField: "_id",
            as: "masterCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubsubcategories",
            localField: "categoryId",
            foreignField: "_id",
            as: "subCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubcategoryhealthcares",
            localField: "categoryId",
            foreignField: "_id",
            as: "subSubCategory",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "categoryId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $project: {
            image: { $concat: [imgPath, "$image"] },
            priceUnder: 1,
            categoryId: 1,
            typeName1: {
              $ifNull: [
                { $first: "$subCategory.title" },
                { $first: "$subSubCategory.title" },
              ],
            },
            typeName2: {
              $ifNull: [
                { $first: "$product.name" },
                { $first: "$masterCategory.title" },
              ],
            },
          },
        },
      ]);
      for (i = 0; i < BudgetStore.length; i++) {
        if (BudgetStore[i].typeName1) {
          BudgetStore[i].title = BudgetStore[i].typeName1;
          delete BudgetStore[i].typeName1;
        } else if (BudgetStore[i].typeName2) {
          BudgetStore[i].title = BudgetStore[i].typeName2;
          delete BudgetStore[i].typeName2;
        } else {
          BudgetStore[i].title = "";
        }
      }

      let Slider6 = await sliders.aggregate([
        {
          $match: {
            sliderType: "slider6",
          },
        },
        {
          $lookup: {
            from: "mastercategories",
            localField: "typeId",
            foreignField: "_id",
            as: "masterCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubsubcategories",
            localField: "typeId",
            foreignField: "_id",
            as: "subCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubcategoryhealthcares",
            localField: "typeId",
            foreignField: "_id",
            as: "subSubCategory",
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
          $project: {
            type: 1,
            redirect_id: "$typeId",
            image: { $concat: [imgPath, "$image"] },
            typeName1: {
              $ifNull: [
                { $first: "$subCategory.title" },
                { $first: "$subSubCategory.title" },
              ],
            },
            typeName2: {
              $ifNull: [
                { $first: "$product.name" },
                { $first: "$masterCategory.title" },
              ],
            },
          },
        },
      ]);
      for (i = 0; i < Slider6.length; i++) {
        if (Slider6[i].typeName1) {
          Slider6[i].title = Slider6[i].typeName1;
          delete Slider6[i].typeName1;
        } else if (Slider6[i].typeName2) {
          Slider6[i].title = Slider6[i].typeName2;
          delete Slider6[i].typeName2;
        } else {
          Slider6[i].title = "";
        }
      }

      let Grooming = [];
      let Groomings = await grooming
        .aggregate([
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "product",
            },
          },
        ])
        .then(async (result) => {
          let variant = [];
          for (let item of result) {
            for (let j of item.product) {
              for (let i of j.pricing) {
                variant.push({
                  _id: j._id,
                  image: process.env.BASE_URL.concat(i.image[0]),
                  product: j.name,
                });
              }
            }
          }
          Grooming = variant;
        });

      let Slider7 = await sliders.aggregate([
        {
          $match: {
            sliderType: "slider7",
          },
        },
        {
          $lookup: {
            from: "mastercategories",
            localField: "typeId",
            foreignField: "_id",
            as: "masterCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubsubcategories",
            localField: "typeId",
            foreignField: "_id",
            as: "subCategory",
          },
        },
        {
          $lookup: {
            from: "mastersubcategoryhealthcares",
            localField: "typeId",
            foreignField: "_id",
            as: "subSubCategory",
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
          $project: {
            type: 1,
            redirect_id: "$typeId",
            image: { $concat: [imgPath, "$image"] },
            typeName1: {
              $ifNull: [
                { $first: "$subCategory.title" },
                { $first: "$subSubCategory.title" },
              ],
            },
            typeName2: {
              $ifNull: [
                { $first: "$product.name" },
                { $first: "$masterCategory.title" },
              ],
            },
          },
        },
      ]);
      for (i = 0; i < Slider7.length; i++) {
        if (Slider7[i].typeName1) {
          Slider7[i].title = Slider7[i].typeName1;
          delete Slider7[i].typeName1;
        } else if (Slider7[i].typeName2) {
          Slider7[i].title = Slider7[i].typeName2;
          delete Slider7[i].typeName2;
        } else {
          Slider7[i].title = "";
        }
      }
      let Sixcategorys = await AdsMedimallTopIconCatHealth.aggregate([
        {
          $match: {
            sliderType: "6categories",
          },
        },
        {
          $project: {
            image: { $concat: [imgPath, "$image"] },
          },
        },
      ]);

      res.status(200).json({
        message: "medimall Home data",
        error: false,
        data: {
          cart_count: cart_count,
          favouriteCount: favouriteCount,
          PopupBanner: PopupBanner,
          spotlightWarp: spotlightWarp,
          spotlight: spotlight,
          Slider1: Slider1,
          top3Icons: top3Icons,
          mainCategory: mainCategory,
          HotDealsForYou: HotDealsForYou,
          TopCategorys: TopCategorys,
          med_essential: med_essential,
          Slider2: Slider2,
          ShopByBrands: ShopByBrands,
          Slider3: Slider3,
          BestSellers: BestSellers,
          Slider4: Slider4,
          FeaturedBrands: FeaturedBrands,
          TopRecommended: TopRecommended,
          TopDeals: TopDeals,
          Slider5: Slider5,
          VocalLocal: VocalLocal,
          Promotions: Promotions,
          BudgetStore: BudgetStore,
          Slider6: Slider6,
          Grooming: Grooming,
          Slider7: Slider7,
          Sixcategorys: Sixcategorys,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getSuggestedProducts: async (req, res, next) => {
    try {
      let count = 1;
      let pageSize = 0;
      if (req.body.limit) {
        pageSize = req.body.limit;
      } else {
        pageSize = 10;
      }
      var skip = (parseInt(req.body.page) - 1) * parseInt(req.body.limit);
      // let pageSize = req.body.limit;
      let pageNo = req.body.page;
      // let startDate = new Date(req.body.startDate);
      // let endDate = new Date(req.body.endDate);
      // console.log('1234567',startDate,endDate)
      // var limit = parseInt(req.body.limit);
      // if (limit == 0) limit = 10;
      // var skip = (parseInt(req.body.page) - 1) * parseInt(limit);
      var aggregateQuery = InventorySuggested.aggregate([
        {
          $match: {
            isApproved: false,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            title: 1,
            userId: 1,
            name: "$user.name",
            phone: "$user.phone",
            customerId: "$user.customerId",
          },
        },
      ]);

      const customLabels = {
        totalDocs: "TotalRecords",
        docs: "users",
        limit: "PageSize",
        page: "CurrentPage",
      };

      const aggregatePaginateOptions = {
        page: pageNo,
        limit: pageSize,
        customLabels: customLabels,
      };
      let response = await InventorySuggested.aggregatePaginate(
        aggregateQuery,
        aggregatePaginateOptions
      );
      let finalResult = response.users.reverse();

      for (let item of finalResult) {
        count = skip++;
        item.sl = count;
      }

      res.status(200).json({
        error: false,
        data: finalResult,
        data: {
          finalResult: finalResult,
          hasPrevPage: response.hasPrevPage,
          hasNextPage: response.hasNextPage,
          total_items: response.TotalRecords,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getDateSuggestedProducts: async (req, res, next) => {
    try {
      let count = 0;
      let pageSize = 0;
      if (req.body.limit) {
        pageSize = req.body.limit;
      } else {
        pageSize = 10;
      }
      let pageNo = req.body.page;
      let startDate = new Date(req.body.startDate);
      let endDate = new Date(req.body.endDate);
      var skip = (parseInt(req.body.page) - 1) * parseInt(req.body.limit);
      // console.log('1234567',startDate,endDate)
      // var limit = parseInt(req.body.limit);
      // if (limit == 0) limit = 10;
      // var skip = (parseInt(req.body.page) - 1) * parseInt(limit);
      var aggregateQuery = InventorySuggested.aggregate([
        {
          $match: {
            updatedAt: { $gte: startDate, $lte: endDate },
            isApproved: false,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            title: 1,
            name: "$user.name",
            phone: "$user.phone",
            customerId: "$user.customerId",
          },
        },
      ]);

      const customLabels = {
        totalDocs: "TotalRecords",
        docs: "users",
        limit: "PageSize",
        page: "CurrentPage",
      };

      const aggregatePaginateOptions = {
        page: pageNo,
        limit: pageSize,
        customLabels: customLabels,
      };
      let response = await InventorySuggested.aggregatePaginate(
        aggregateQuery,
        aggregatePaginateOptions
      );
      let finalResult = response.users.reverse();

      for (let item of finalResult) {
        count = skip++;
        item.sl = count;
      }

      res.status(200).json({
        error: false,
        data: finalResult,
        data: {
          finalResult: finalResult,
          hasPrevPage: response.hasPrevPage,
          hasNextPage: response.hasNextPage,
          total_items: response.TotalRecords,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  approveSuggestedProducts: async (req, res, next) => {
    try {
      let data = req.body;
      InventorySuggested.updateOne(
        { _id: data.id },
        {
          $set: {
            isApproved: data.status,
          },
        }
      )
        .then(async (_) => {
          let product = await InventorySuggested.findOne({ _id: req.body.id });
          let data = {
            notification_content:
              "your request is accepted and product added check it now",
            notification_type: "requested_product",
            userId: product.userId,
          };
          let schemaObj = Notification(data);
          schemaObj.save();
          res.status(200).json({
            error: false,
            data: "Status Updated Succesfully",
          });
        })
        .catch((err) => {
          res.status(200).json({
            error: true,
            data: err,
          });
        });
    } catch (error) {
      next(error);
    }
  },
};
