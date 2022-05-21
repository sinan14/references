const mongoose = require('mongoose');
const TopCategory = require('../models/ads/home/topAd1MainAd6Ad8');
const sliders = require('../models/ads/home/slider1234ad25');
const TrendingCategory = require('../models/ads/home/trendingCategory');
const SpotLight = require('../models/ads/home/spotlight');
const PartnerPromotion = require('../models/ads/cart/partnerPromotion');
const editorsChoice = require('../models/ads/seasonal-offers/editorsChoiceVocalLocalEnergizeYourWorkout');
const Article = require('../models/article');
const mainHome = require('../models/ads/home/yogaFitnessExpert');
const FoliofitYoga = require('../models/foliofit/foliofitYoga');
const FolifitFitnessClub = require('../models/foliofit/foliofitFitnessClub');
const nutrichartVitamin = require('../models/foliofit/nutrichartVitamin');
const Brand = require('../models/mastersettings/brand');
const Promotion = require('../models/ads/cart/promotion');
const ad3 = require('../models/ads/home/ad3');
const HealthCareVideo = require('../models/healthCareVideo');
const HealthExpertAdvice = require('../models/healthExpertAdvice');
const healthExpertQnReplay = require('../models/healthExpertQnReplay');
const Like = require('../models/like');
// const User = require('../models/userModel');
const User = require("../models/user");
const ad4 = require('../models/ads/home/ad4');
const ad7 = require('../models/ads/home/ad7');
const nutrichartFood = require('../models/nutrichartFood');
const slider5 = require('../models/ads/home/slider5');
const medicineCategory = require('../models/mastersettings/category');
const RecentlyViewed = require('../models/RecentlyViewed');
const PlanYourDiet = require('../models/ads/home/planYourDiet');
const DietPlan = require('../models/dietPlan');
const Inventory = require('../models/inventory');
const SetNewOffer = require('../models/ads/seasonal-offers/SetNewOffer');
const setNewOfferSub = require('../models/ads/seasonal-offers/setNewOfferSub');
const immunnityBooster = require('../models/ads/seasonal-offers/immunityBooster');
const AdsHomeCart = require('../models/ads/home/cart');
const AdsSeasonalOfferSetYourDeal = require('../models/ads/seasonal-offers/setYourDeal');
const coupons = require('../models/coupon/coupon');
const ScratchedCoupon = require('../models/coupon/scratchedCoupon');
const moment = require("moment-timezone");
const LiveUpdate = require("../models/articleLiveUpdate");
const popupBanner = require("../models/customer/popupBanner");
const MasterUOMValue = require("../models/mastersettings/uomValue");
const Orders = require("../models/orders/order");
const MostPurchasedProduct = require("../models/most/mostPurchasedProducts");
const MasterBrand = require("../models/mastersettings/brand");
const productRating = require("../models/productRating");
const userNotification = require("../models/user/userNotification");




const imgPath = process.env.BASE_URL;
function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + ' years ago';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months ago';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days ago';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours ago';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes ago';
  }
  return 'few seconds ago';
}
function showDiff(date1, date2){
  var dif = date2.getTime() - date1.getTime();
 
  var Seconds = dif / 1000;
  var Seconds_Between_Dates = Math.abs(Seconds);
  return Seconds_Between_Dates
 
}

module.exports = {
  GetMainHome: async (req, res, next) => {
    try {
      let body = req.body;
      if (body.page_no) {
        if (body.page_no == 1) {
          let currentDate = new Date();
          let todayStarting = moment(currentDate).tz(process.env.TIME_ZONE).set({ h: 00, m: 00, s: 00 }).utc()
          let todayEnding = moment(currentDate)
          .tz(process.env.TIME_ZONE)
          .set({ h: 23, m: 59, s: 59 })
    
      let Popup_banner = await popupBanner.aggregate([
        {
          $match: {
              $and:[{from:{$gte:new Date(todayStarting) }},{from:{$lte:new Date(todayEnding)}},{ type: "home" }]
              
          },
        },
        {
          $project: {
            type: 1,
            from:1,
            image: { $concat: [imgPath, '$image'] },
          },
        },
        { $sort: { _id: -1 } }
      ]).limit(1);
      
      let PopupBanner ={}
      console.log('Popup_banner',Popup_banner)
      if(Popup_banner.length){
        PopupBanner.img=Popup_banner[0].image
        PopupBanner.status=true
      }else{
        PopupBanner.img=''
        PopupBanner.status=false
      }

          let TopCategories = await TopCategory.aggregate([
            {
              $match: {
                sliderType: 'topcategories',
              },
            },
            { $project: { image: { $concat: [imgPath, '$image'] }, name: 1 } },
          ]);
          let Slider1 = await sliders.aggregate([
            {
              $match: {
                sliderType: 'slider1',
              },
            },
            {
              $lookup: {
                from: 'mastercategories',
                localField: 'typeId',
                foreignField: '_id',
                as: 'masterCategory',
              },
            },
            {
              $lookup: {
                from: 'mastersubsubcategories',
                localField: 'typeId',
                foreignField: '_id',
                as: 'subCategory',
              },
            },
            {
              $lookup: {
                from: 'mastersubcategoryhealthcares',
                localField: 'typeId',
                foreignField: '_id',
                as: 'subSubCategory',
              },
            },
            {
              $lookup: {
                from: 'products',
                localField: 'typeId',
                foreignField: '_id',
                as: 'product',
              },
            },
            {
              $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$product.pricing",
                preserveNullAndEmptyArrays: true,
              },
            },
            // {
            //   $unwind: "$product.pricing",
            // },
            {
              $project: {
                redirect_type: 1,
                type: 1,
                redirect_id: '$typeId',
                statusLimit:'$product.statusLimit',
                stock:'$product.pricing.stock',
                image: { $concat: [imgPath, '$image'] },
                typeName1: {
                  $ifNull: [
                    { $first: '$subCategory.title' },
                    { $first: '$subSubCategory.title' },
                  ],
                },
                typeName2: {
                  $ifNull: [
                     '$product.name' ,
                    { $first: '$masterCategory.title' },
                  ],
                },
              },
            },
          ]).sort('-updatedAt');
          console.log('@@@@',Slider1)
          for (i = 0; i < Slider1.length; i++) {
            if (Slider1[i].stock > Slider1[i].statusLimit) {
              Slider1[i].stockStatus = "Available";
            } else if (Slider1[i].stock == 0) {
              Slider1[i].stockStatus = "Out of stock";
            } else {
              Slider1[i].stockStatus = "Limited";
            }
            if (Slider1[i].typeName1) {
              Slider1[i].title = Slider1[i].typeName1;
              delete Slider1[i].typeName1;
            } else if (Slider1[i].typeName2) {
              Slider1[i].title = Slider1[i].typeName2;
              delete Slider1[i].typeName2;
            } else {
              Slider1[i].title = '';
            }
          }
        

          let MainCategories = await TopCategory.aggregate([
            {
              $match: {
                sliderType: 'maincategory',
              },
            },
            { $project: { image: { $concat: [imgPath, '$image'] } } },
          ]);

          let MedicineCategory = await medicineCategory.aggregate([
            {
              $match: {
                categoryType: 'medicine',
              },
            },
            { $project: { image: { $concat: [imgPath, '$image'] }, title: 1 } },
          ]);
          let TrendingCategories = await TrendingCategory.aggregate([
            {
              $match: {
                isDisabled: false,
              },
            },
            {
              $lookup: {
                from: 'mastercategories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'masterCategory',
              },
            },
            {
              $lookup: {
                from: 'mastersubsubcategories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'subCategory',
              },
            },
            {
              $lookup: {
                from: 'mastersubcategoryhealthcares',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'subSubCategory',
              },
            },
            {
              $lookup: {
                from: 'products',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'product',
              },
            },
            {
              $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$product.pricing",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                image: { $concat: [imgPath, '$image'] },
                statusLimit:'$product.statusLimit',
                stock:'$product.pricing.stock',
                cat_id: '$categoryId',
                text: '$offerBoxText',
                color: '$offerBoxColor',
                typeName1: {
                  $ifNull: [
                    { $first: '$subCategory.title' },
                    { $first: '$subSubCategory.title' },
                  ],
                },
                typeName2: {
                  $ifNull: [
                     '$product.name' ,
                    { $first: '$masterCategory.title' },
                  ],
                },
              },
            },
          ]);

          for (i = 0; i < TrendingCategories.length; i++) {
            if (TrendingCategories[i].stock > TrendingCategories[i].statusLimit) {
              TrendingCategories[i].stockStatus = "Available";
            } else if (TrendingCategories[i].stock == 0) {
              TrendingCategories[i].stockStatus = "Out of stock";
            } else {
              TrendingCategories[i].stockStatus = "Limited";
            }
            if (TrendingCategories[i].typeName1) {
              TrendingCategories[i].title = TrendingCategories[i].typeName1;
              delete TrendingCategories[i].typeName1;
            } else if (TrendingCategories[i].typeName2) {
              TrendingCategories[i].title = TrendingCategories[i].typeName2;
              delete TrendingCategories[i].typeName2;
            } else {
              TrendingCategories[i].title = '';
            }
          }

          //my orders
          let MyOrdersFirst = await Orders.aggregate([
            {
              $match: {
                userId: mongoose.Types.ObjectId(req.user._id),
    
              },
            },
            {
              $project: {
                _id: 0,
                products:1,
                deliveryDate:1
              },
            },
          ]);
          let MYorders = []
          for(let item of MyOrdersFirst){
            for(let i of item.products){
              delivery = moment(
                item.deliveredDate
              ).format("MMMM Do YYYY")
              id = i.product_id
              image = i.image
              product = i.productName
              MYorders.push(
                {
                  id:id,
                  product:product,
                  image:image,
                  delivery:delivery
                })
            }
          }
          
          // let deliveredProducts = await Orders.findOne({orderStatus: "delivered",userId: mongoose.Types.ObjectId(req.user._id),"products.isRated":{ $exists: false }},{
          //   userId:1,
          //   image:{$first:"$products.image"} ,
          //   product: {$first:"$products.productName"},
          //   product_id: {$first:"$products.product_id"},
          // })
          let forRating = await Orders.aggregate([
            {
              $match: {
                orderStatus: "delivered",
                userId: mongoose.Types.ObjectId(req.user._id),
                "products.isRated":{ $exists: false }

              },
            },
            {
              $unwind: {
                path: "$products",
                preserveNullAndEmptyArrays: true,
              },
            }, 
            {
              $project: {
                _id: 1,
                userId:1,
                image: "$products.image",
                product: "$products.productName",
                product_id: "$products.product_id", 
              },
            },  
          ]);
          let newArray =[]
          console.log("forRating",forRating)

          for(let item of forRating){
           let obj = await productRating.findOne({productId :item.product_id,userId:item.userId }).lean()
           console.log("obj",obj)
           if(!obj){
             newArray.push(item)
           }
          }
          console.log("newArray",newArray)

          if(newArray.length){
            deliveredProducts =newArray[0]
          }else{
            deliveredProducts={}
          }
          // if(!deliveredProducts){
          //   deliveredProducts = {}
          // }
          // let deliveredProducts = await Orders.aggregate([
          //   {
          //     $match: {
          //       $and: [
          //           { orderStatus: "delivered" },
          //           { userId: mongoose.Types.ObjectId(req.user._id) },
          //         ],
          //     },
          //   },
          //   {
          //     $unwind: {
          //       path: "$products",
          //       preserveNullAndEmptyArrays: true,
          //     },
          //   },
          //   {
          //     $project: {
          //       userId:1,
          //     image: "$products.image",
          //     product: "$products.productName",
          //     product_id: "$products.product_id",

          //     // rating_value:1,
          //     },
          //   },
      
          // ]).limit(1)
         
          // for (let item of deliveredProducts) {
           
          //   let rating = await productRating.findOne({userId:item.userId,productId:item.product_id})
          //   delete item._id
          //   delete item.userId
          //   if (rating){
          //     item.rating_value = rating.star
          //   }else{
          //     item.rating_value = 0
          //   }
          // }
          // let deliveredProductss= {}
          // if(deliveredProducts[0]){
          //   deliveredProductss = deliveredProducts[0]
          // }
          
        
          let Ad1 = await TopCategory.aggregate([
            {
              $match: {
                sliderType: 'ad1',
              },
            },
            { $project: { image: { $concat: [imgPath, '$image'] } } },
          ]);
          if (Ad1.length) {
            Ad1 = Ad1[0];
          } else {
            Ad1 = {};
          }

          let SpotLights = await SpotLight.aggregate([
            {
              $match: {
                isDisabled: false,
              },
            },
            {
              $lookup: {
                from: 'mastercategories',
                localField: 'typeId',
                foreignField: '_id',
                as: 'masterCategory',
              },
            },
            {
              $lookup: {
                from: 'mastersubsubcategories',
                localField: 'typeId',
                foreignField: '_id',
                as: 'subCategory',
              },
            },
            {
              $lookup: {
                from: 'mastersubcategoryhealthcares',
                localField: 'typeId',
                foreignField: '_id',
                as: 'subSubCategory',
              },
            },
            {
              $lookup: {
                from: 'products',
                localField: 'typeId',
                foreignField: '_id',
                as: 'product',
              },
            },
            {
              $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$product.pricing",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                image: { $concat: [imgPath, '$image'] },
                statusLimit:'$product.statusLimit',
                stock:'$product.pricing.stock',
                thumb_image: { $concat: [imgPath, '$thumbnail'] },
                type: 1,
                redirect_id: '$typeId',
                isMedimall: 1,
                text: '$offerText',
                color: '$colorCode',
                typeName1: {
                  $ifNull: [
                    { $first: '$subCategory.title' },
                    { $first: '$subSubCategory.title' },
                  ],
                },
                typeName2: {
                  $ifNull: [
                    '$product.name',
                    { $first: '$masterCategory.title' },
                  ],
                },
              },
            },
          ]).sort('-updatedAt');
          for (i = 0; i < SpotLights.length; i++) {
            if (SpotLights[i].stock > SpotLights[i].statusLimit) {
              SpotLights[i].stockStatus = "Available";
            } else if (SpotLights[i].stock == 0) {
              SpotLights[i].stockStatus = "Out of stock";
            } else {
              SpotLights[i].stockStatus = "Limited";
            }
            if (SpotLights[i].typeName1) {
              SpotLights[i].title = SpotLights[i].typeName1;
              delete SpotLights[i].typeName1;
            } else if (SpotLights[i].typeName2) {
              SpotLights[i].title = SpotLights[i].typeName2;
              delete SpotLights[i].typeName2;
            } else {
              SpotLights[i].title = '';
            }
          }

          //hot deals for you
        
          let todayDate = new Date()
          console.log('todayDate', todayDate);
          let ExcitingOffers = {
            details: {},
            products: [],
          };
          let Gre = await AdsSeasonalOfferSetYourDeal.aggregate([
            {
              $match: {
                $and: [
                  { starting_date: { $lte: todayDate } },
                  { ending_date: { $gte: todayDate } },
                ],
              },
            },
            {
              $lookup: {
                from: 'setyourdealsubs',
                localField: '_id',
                foreignField: 'catId',
                as: 'setYourDealSub',
              },
            },
            {
              $lookup: {
                from: 'products',
                localField: 'setYourDealSub.productId',
                foreignField: '_id',
                as: 'product',
              },
            },
          ]).then(async (result) => {
            console.log('result', result);
            let variants = [];
            // let checkStatus = false;
            for (let item of result) {
              for (let j of item.product) {
                for (let i of j.pricing) {
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
                    sku:i.sku,
                    brand_id:j.brand,
                    stock:i.stock,
                    statusLimit:i.statusLimit
                  });
                  break;
                }
              }
            }
            let uom = ''
            if(variants.length){
              for(i=0;i<variants.length;i++){
                var date1 = new Date(variants[i].starting_date);    
                var date2 = new Date(variants[i].ending_date);
                variants[i].timer = showDiff(date1,date2);
                variants[i].brand =await Brand.findOne({_id: mongoose.Types.ObjectId(variants[i].brand_id)},{title:1,'_id': 0})
                uom = await MasterUOMValue.findOne(
                  { _id: mongoose.Types.ObjectId(variants[i].sku) },
                  {
                    uomValue: 1,
                  }
                );
                if (uom) {
                  variants[i].uomValue = uom.uomValue;
                }
                if (variants[i].stock > variants[i].statusLimit) {
                  variants[i].stockStatus = "Available";
                } else if (variants[i].stock == 0) {
                  variants[i].stockStatus = "Out of stock";
                } else {
                  variants[i].stockStatus = "Limited";
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
                  product: i.product,
                  product_id: i.product_id,
                  varient_id: i.varient_id,
                  brand :i.brand.title,
                  uom_value:i.uomValue,
                  stock:i.stock,
                  stockStatus:i.stockStatus,
                  discount: Math.floor(
                    ((i.price - i.spl_price) / i.price) * 100
                  ),
                });
              } else {
                newArray.push({
                  details: {
                    _id: i._id,
                    name: i.name,
                    starting_date : moment(new Date(i.starting_date)).format('YYYY-MM-DD'),
                    ending_date : moment(new Date(i.ending_date)).format('YYYY-MM-DD'), 
                    starting_time: i.starting_time,
                    ending_time: i.ending_time,
                    timer:i.timer
                  },
                  products: [
                    {
                      price: i.price,
                      spl_price: i.spl_price,
                      image: i.image,
                      product: i.product,
                      product_id: i.product_id,
                      varient_id: i.varient_id,
                      brand :i.brand.title,
                      uom_value:i.uomValue,
                      stock:i.stock,
                      stockStatus:i.stockStatus,
                      discount: Math.floor(
                        ((i.price - i.spl_price) / i.price) * 100
                      ),
                    },
                  ],
                });
              }
            }
            if (newArray.length) {
              ExcitingOffers = newArray[0];
            } else {
              ExcitingOffers = {
                details: {},
                products: [],
              };
            }
          });
           

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

         

          let Slider2 = await sliders.aggregate([
            {
              $match: {
                sliderType: 'slider2',
              },
            },
            {
              $lookup: {
                from: 'mastercategories',
                localField: 'typeId',
                foreignField: '_id',
                as: 'masterCategory',
              },
            },
            {
              $lookup: {
                from: 'mastersubsubcategories',
                localField: 'typeId',
                foreignField: '_id',
                as: 'subCategory',
              },
            },
            {
              $lookup: {
                from: 'mastersubcategoryhealthcares',
                localField: 'typeId',
                foreignField: '_id',
                as: 'subSubCategory',
              },
            },
            {
              $lookup: {
                from: 'products',
                localField: 'typeId',
                foreignField: '_id',
                as: 'product',
              },
            },
            {
              $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$product.pricing",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                type: 1,
                redirect_type: 1,
                statusLimit:'$product.statusLimit',
                stock:'$product.pricing.stock',
                redirect_id: '$typeId',
                image: { $concat: [imgPath, '$image'] },
                typeName1: {
                  $ifNull: [
                    { $first: '$subCategory.title' },
                    { $first: '$subSubCategory.title' },
                  ],
                },
                typeName2: {
                  $ifNull: [
                    '$product.name' ,
                    { $first: '$masterCategory.title' },
                  ],
                },
              },
            },
          ]).sort('-updatedAt');
          for (i = 0; i < Slider2.length; i++) {
            if (Slider2[i].stock > Slider2[i].statusLimit) {
              Slider2[i].stockStatus = "Available";
            } else if (Slider2[i].stock == 0) {
              Slider2[i].stockStatus = "Out of stock";
            } else {
              Slider2[i].stockStatus = "Limited";
            }
            if (Slider2[i].typeName1) {
              Slider2[i].title = Slider2[i].typeName1;
              delete Slider2[i].typeName1;
            } else if (Slider2[i].typeName2) {
              Slider2[i].title = Slider2[i].typeName2;
              delete Slider2[i].typeName2;
            } else {
              Slider2[i].title = '';
            }
            if(Slider2[i].redirect_type=="Medfeed"&&Slider2[i].type=="Live Updates"){
            
              let liveUpdate = await LiveUpdate.find().populate({
                path: "category",
                select: ["_id", "name"],
              });
              console.log('Liveupdate',liveUpdate)
              if(liveUpdate.length){
                Slider2[i].title = liveUpdate[0].category.name;
              }else{
                Slider2[i].title = '';

              }
            }
          }
          

          //Recently viewed
          let prod1 = {};
          let prod2 = {};
          let prod3 = {};
          let prod4 = {};

          let recentlyViewed = [];
          let Groom = await RecentlyViewed.aggregate([
            {
              $match: {
                userId: mongoose.Types.ObjectId(req.user._id),
              },
            },
            {
              $lookup: {
                from: 'products',
                localField: 'productId',
                foreignField: '_id',
                as: 'product',
              },
            },
          ])
            .sort('-updatedAt')
            .limit(4)
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
                      product_id: j._id,
                      stock:i.stock,
                      statusLimit:j.statusLimit
                    });
                    break;
                  }
                }
              }
              if (variant[0]) {
                if (variant[0].stock > variant[0].statusLimit) {
                  variant[0].stockStatus = "Available";
                } else if (variant[0].stock == 0) {
                  variant[0].stockStatus = "Out of stock";
                } else {
                  variant[0].stockStatus = "Limited";
                }
                prod1 = variant[0];
              } else {
                prod1 = {};
              }
              if (variant[1]) {
                if (variant[1].stock > variant[1].statusLimit) {
                  variant[1].stockStatus = "Available";
                } else if (variant[1].stock == 0) {
                  variant[1].stockStatus = "Out of stock";
                } else {
                  variant[1].stockStatus = "Limited";
                }
                prod2 = variant[1];
              } else {
                prod2 = {};
              }
              if (variant[2]) {
                if (variant[2].stock > variant[2].statusLimit) {
                  variant[2].stockStatus = "Available";
                } else if (variant[2].stock == 0) {
                  variant[2].stockStatus = "Out of stock";
                } else {
                  variant[2].stockStatus = "Limited";
                }
                prod3 = variant[2];
              } else {
                prod3 = {};
              }
              if (variant[3]) {
                if (variant[3].stock > variant[3].statusLimit) {
                  variant[3].stockStatus = "Available";
                } else if (variant[3].stock == 0) {
                  variant[3].stockStatus = "Out of stock";
                } else {
                  variant[3].stockStatus = "Limited";
                }
                prod4 = variant[3];
              } else {
                prod4 = {};
              }
            });

          let PartnerPromotions = await PartnerPromotion.aggregate([
            { $match: { isDisabled: false } },

            {
              $project: {
                image: { $concat: [imgPath, '$image'] },
                ExternalLink: 1,
              },
            },
          ]);

          let EditorsChoices = [];
          let Grooms = await editorsChoice
            .aggregate([
              {
                $match: {
                  sliderType: 'editors_choice',
                },
              },
              {
                $lookup: {
                  from: 'products',
                  localField: 'ProductId',
                  foreignField: '_id',
                  as: 'product',
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
                      image: process.env.BASE_URL.concat(item.image),
                      product: j.name,
                      product_id: j._id,
                      stock:i.stock,
                      statusLimit:j.statusLimit
                    });
                    break;
                  }
                }
              }
              EditorsChoices = variant;
            });

          let MainArticles = await Article.aggregate([
            {
              $match: {
                homepageMain: true,
              },
            },
            {
              $project: {
                image: { $concat: [imgPath, '$image'] },
                heading: 1,
                description: 1,
              },
            },
          ]);
          if (MainArticles.length) {
            MainArticles = MainArticles[0];
          } else {
            MainArticles = {};
          }
          let SubArticles = await Article.aggregate([
            {
              $match: {
                homepageSub: true,
              },
            },
            {
              $project: {
                image: { $concat: [imgPath, '$image'] },
                heading: 1,
                description: 1,
              },
            },
          ]);

          let mainYoga = await mainHome.aggregate([
            {
              $match: {
                adsType: 'mainyoga',
              },
            },
            {
              $project: {
                categoryId: 1,
                subCategoryId: 1,
                adsType: 1,
              },
            },
          ]);
          if (mainYoga.length) {
            var videoDetails;
            if (mainYoga[0].adsType == 'mainyoga') {
              videoDetails = await FoliofitYoga.findOne(
                { _id: mainYoga[0].subCategoryId },
                {
                  title: 1,
                  video: 1,
                  thumbnail: { $concat: [imgPath, '$thumbnail'] },
                  workoutTime: 1,
                }
              );
            }
            if (videoDetails) {
              mainYoga[0].video = videoDetails.video;
              mainYoga[0].thumbnail = videoDetails.thumbnail;
              mainYoga[0].workoutTime = videoDetails.workoutTime;
              mainYoga[0].title = videoDetails.title;
              delete mainYoga[0].subCategoryId, delete mainYoga[0].adsType;
            }
          }
          if (mainYoga.length) {
            mainYoga = mainYoga[0];
          } else {
            mainYoga = {};
          }
          let subYoga = await mainHome.aggregate([
            {
              $match: {
                adsType: 'subyoga',
              },
            },
            {
              $project: {
                categoryId: 1,
                subCategoryId: 1,
                adsType: 1,
              },
            },
          ]);
          if (subYoga.length) {
            var videoDetails;
            for (i = 0; i < subYoga.length; i++) {
              if (subYoga[i].adsType == 'subyoga') {
                videoDetails = await FoliofitYoga.findOne(
                  { _id: subYoga[i].subCategoryId },
                  {
                    title: 1,
                    video: 1,
                    thumbnail: { $concat: [imgPath, '$thumbnail'] },
                    workoutTime: 1,
                  }
                );
              }
              if (videoDetails) {
                subYoga[i].video = videoDetails.video;
                subYoga[i].thumbnail = videoDetails.thumbnail;
                subYoga[i].workoutTime = videoDetails.workoutTime;
                subYoga[i].title = videoDetails.title;
                delete subYoga[i].subCategoryId, delete subYoga[i].adsType;
              }
            }
          }
          res.status(200).json({
            message: 'home data up to yoga sections',
            error: false,
            data: {
              PopupBanner:PopupBanner,
              TopCategories: TopCategories,
              Slider1: Slider1,
              MainCategories: MainCategories,
              MedicineCategory: MedicineCategory,
              TrendingCategories: TrendingCategories,
              MyOrders: MYorders,
              Rating: deliveredProducts,
              Ad1: Ad1,
              SpotLights: SpotLights,
              ExcitingOffers: ExcitingOffers,
              TopRecommended: TopRecommended,
              Slider2: Slider2,
              recentlyViewed: {
                product1: prod1,
                product2: prod2,
                product3: prod3,
                product4: prod4,
              },
              PartnerPromotions: PartnerPromotions,
              EditorsChoices: EditorsChoices,
              Articles: {
                MainArticles: MainArticles,
                SubArticles: SubArticles,
              },
              yogaVideos: { mainYoga: mainYoga, subYoga: subYoga },
            },
          });
        } else if (body.page_no == 2) {
          let mainFitness = await mainHome.aggregate([
            {
              $match: {
                adsType: 'mainfitness',
              },
            },
            {
              $project: {
                categoryId: 1,
                subCategoryId: 1,
                adsType: 1,
              },
            },
          ]);
          if (mainFitness.length) {
            var videoDetails;
            if (mainFitness[0].adsType == 'mainfitness') {
              videoDetails = await FolifitFitnessClub.findOne(
                { _id: mainFitness[0].subCategoryId },
                {
                  _id: 1,
                  title: 1,
                  video: 1,
                  thumbnail: { $concat: [imgPath, '$thumbnail'] },
                }
              );
            }
            if (videoDetails) {
              mainFitness[0].video = videoDetails.video;
              mainFitness[0].thumbnail = videoDetails.thumbnail;
              mainFitness[0]._id = videoDetails._id;
              mainFitness[0].title = videoDetails.title;
              delete mainFitness[0].subCategoryId,
                delete mainFitness[0].adsType;
            }
          }
          if (mainFitness.length) {
            mainFitness = mainFitness[0];
          } else {
            mainFitness = {};
          }

          let subFitness = await mainHome.aggregate([
            {
              $match: {
                adsType: 'subfitness',
              },
            },
            {
              $project: {
                categoryId: 1,
                subCategoryId: 1,
                adsType: 1,
              },
            },
          ]);

          if (subFitness.length) {
            var videoDetails;
            for (i = 0; i < subFitness.length; i++) {
              if (subFitness[i].adsType == 'subfitness') {
                videoDetails = await FolifitFitnessClub.findOne(
                  { _id: subFitness[i].subCategoryId },
                  {
                    _id: 1,
                    title: 1,
                    video: 1,
                    thumbnail: { $concat: [imgPath, '$thumbnail'] },
                  }
                );
              }
              if (videoDetails) {
                subFitness[i].video = videoDetails.video;
                subFitness[i].thumbnail = videoDetails.thumbnail;
                subFitness[i]._id = videoDetails._id;
                subFitness[i].title = videoDetails.title;
                delete subFitness[i].subCategoryId,
                  delete subFitness[i].adsType;
              }
            }
          }

          let nutrichartVitamins = await nutrichartVitamin.aggregate([
            {
              $project: {
                image: { $concat: [imgPath, '$image'] },
                title: 1,
              },
            },
          ]);
          let Ad2 = await sliders.aggregate([
            {
              $match: {
                sliderType: 'ad2',
              },
            },
            {
              $lookup: {
                from: 'mastercategories',
                localField: 'typeId',
                foreignField: '_id',
                as: 'masterCategory',
              },
            },
            {
              $lookup: {
                from: 'mastersubsubcategories',
                localField: 'typeId',
                foreignField: '_id',
                as: 'subCategory',
              },
            },
            {
              $lookup: {
                from: 'mastersubcategoryhealthcares',
                localField: 'typeId',
                foreignField: '_id',
                as: 'subSubCategory',
              },
            },
            {
              $lookup: {
                from: 'products',
                localField: 'typeId',
                foreignField: '_id',
                as: 'product',
              },
            },
            {
              $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$product.pricing",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                type: 1,
                redirect_type: 1,
                statusLimit:'$product.statusLimit',
                stock:'$product.pricing.stock',
                redirect_id: '$typeId',
                image: { $concat: [imgPath, '$image'] },
                typeName1: {
                  $ifNull: [
                    { $first: '$subCategory.title' },
                    { $first: '$subSubCategory.title' },
                  ],
                },
                typeName2: {
                  $ifNull: [
                    '$product.name' ,
                    { $first: '$masterCategory.title' },
                  ],
                },
              },
            },
          ]);
          for (i = 0; i < Ad2.length; i++) {
            if (Ad2[i].stock > Ad2[i].statusLimit) {
              Ad2[i].stockStatus = "Available";
            } else if (Ad2[i].stock == 0) {
              Ad2[i].stockStatus = "Out of stock";
            } else {
              Ad2[i].stockStatus = "Limited";
            }
            if (Ad2[i].typeName1) {
              Ad2[i].title = Ad2[i].typeName1;
              delete Ad2[i].typeName1;
            } else if (Ad2[i].typeName2) {
              Ad2[i].title = Ad2[i].typeName2;
              delete Ad2[i].typeName2;
            } else {
              Ad2[i].title = '';
            }
          }
          if (Ad2.length) {
            Ad2 = Ad2[0];
          } else {
            Ad2 = {};
          }

          let ShopByBrands = [];
          let ShopByBr = await Brand.aggregate([
            {
              $match: {
                isShop: true,
              },
            },
            {
              $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: 'brand',
                as: 'product',
              },
            },
          ]).then(async (result) => {
            let variants = [];
            for (let item of result) {
              for (let j of item.product) {
                for (let i of j.pricing) {
                  if (item._id + '' == j.brand + '') {
                    variants.push({
                      image: process.env.BASE_URL.concat(item.image),
                      brand_id: item._id,
                      product_image: i.image[0],
                      product: j.name,
                      product_id: j._id,
                      stock:i.stock,
                      statusLimit:j.statusLimit
                    });
                    break;
                  }
                }
              }
            }
            // ShopByBrands = variants;
            
            if(variants.length){
              
              let newArray = [];
            for (let i of variants) {
              let obj = newArray.find((o) => o._id == i.brand_id);
              if (obj) {
                newArray[newArray.indexOf(obj)].products.push({
                  // product_image: i.product_image,
                  title: i.product,
                  image_url: process.env.BASE_URL.concat(i.product_image),
                  id: i.product_id,
                });
              } else {
                newArray.push({
                  _id: i.brand_id,
                  image: i.image,
                  products: [
                    {
                      // product_image: i.product_image,
                      title: i.product,
                      image_url: process.env.BASE_URL.concat(i.product_image),
                      id: i.product_id,
                    },
                  ],
                });
              }
            }
            ShopByBrands = newArray;
          }
          });

          let Promotions = await Promotion.aggregate([
            { $match: { isDisabled: false } },

            {
              $project: {
                termsConditions: 1,
                image: { $concat: [imgPath, '$image'] },
              },
            },
          ]);
          let Ad3 = await ad3.aggregate([
            {
              $match: {
                isDisabled: false,
              },
            },
            {
              $project: {
                image: { $concat: [imgPath, '$image'] },
                type: '$redirect_type',
              },
            },
          ]);
          if (Ad3.length) {
            Ad3[0].redirect_type='Medfeed'
            Ad3 = Ad3[0];
          } else {
            Ad3 = {};
          }
          let HealthCareMain = await HealthCareVideo.aggregate([
            {
              $match: {
                homepageMain: true,
              },
            },
            {
              $project: {
                name: 1,
                video: 1,
                thumbnail: { $concat: [imgPath, '$thumbnail'] },
              },
            },
          ]);
          if (HealthCareMain.length) {
            HealthCareMain = HealthCareMain[0];
          } else {
            HealthCareMain = {};
          }
          let HealthCareSub = await HealthCareVideo.aggregate([
            {
              $match: {
                homepageSub: true,
              },
            },
            {
              $project: {
                name: 1,
                video: 1,
                thumbnail: { $concat: [imgPath, '$thumbnail'] },
              },
            },
          ]);
          let user = req.user._id;
          let health_advice = await HealthExpertAdvice.aggregate([
            {
              $project: {
                id: '$_id',
                question: 1,
                posted_on: '$createdAt',
                posted_by: '$userName',
                userImage: 1,
                type: "advice",

              },
            },
          ]).limit(5);
          for (j = 0; j < health_advice.length; j++) {
            health_advice[j].userImage = process.env.BASE_URL.concat(
              health_advice[j].userImage
            );
            delete health_advice[j]._id;
            health_advice[j].like_count = await Like.countDocuments({
              contentId: mongoose.Types.ObjectId(health_advice[j].id),
            });
            let isLiked = await Like.findOne({
              type: 'advice',
              contentId: mongoose.Types.ObjectId(health_advice[j].id),
              userId: req.user._id,
            });
            if (isLiked) {
              health_advice[j].is_liked = 1;
            } else {
              health_advice[j].is_liked = 0;
            }
            let time = timeSince(health_advice[j].posted_on);
            health_advice[j].posted_on = time;
            let objdata = await healthExpertQnReplay.aggregate([
              {
                $match: {
                  question_id: mongoose.Types.ObjectId(health_advice[j].id),
                },
              },
              {
                $project: {
                  reply_id: '$_id',
                  answer: '$reply',
                  replied_by: '$repliedBy',
                  replay_posted_on: '$createdAt',
                  image: { $concat: [imgPath, '$image'] }
                },
              },
            ]);
            if (objdata.length) {
              delete objdata[0]._id;
              objdata[0].reply_like_count = await Like.countDocuments({
                contentId: mongoose.Types.ObjectId(objdata[0].reply_id),
              });

              let sin = timeSince(objdata[0].replay_posted_on);
              if (objdata[0].image) {
                health_advice[j].admin_image = 
                  objdata[0].image

              } else {
                health_advice[j].admin_image = process.env.BASE_URL.concat(
                  "medfeed/head.jpeg"
                ); 
              }
              health_advice[j].replay_posted_on = sin;
              health_advice[j].answer = objdata[0].answer;
              health_advice[j].replied_by = objdata[0].replied_by;
              health_advice[j].reply_like_count = objdata[0].reply_like_count;
              health_advice[j].reply_isLiked = objdata[0].reply_isLiked;
              health_advice[j].reply_id = objdata[0].reply_id;
            }
          }
          let Ad4 = await ad4.aggregate([
            {
              $match: {
                isDisabled: false,
              },
            },
            {
              $project: { image: { $concat: [imgPath, '$image'] }, link: 1 },
            },
          ]);
          if (Ad4.length) {
            Ad4 = Ad4[0];
          } else {
            Ad4 = {};
          }
          //plan your diet
          let DietPlans = await PlanYourDiet.find(
            { isDisabled: false },
            {
              categoryId: 1,
            }
          ).lean();
          PlanYourDiets = [];
          for (let item of DietPlans) {
            let planYourDiet = await DietPlan.findOne({
              _id: mongoose.Types.ObjectId(item.categoryId),
            });
            if (planYourDiet) {
              PlanYourDiets.push({
                categoryId: DietPlans.categoryId,
                title: planYourDiet.name,
                id: planYourDiet._id,
                image: process.env.BASE_URL.concat(planYourDiet.image),
              });
            }
          }
          let Slider3 = await sliders.aggregate([
            {
              $match: {
                sliderType: 'slider3',
              },
            },
            {
              $lookup: {
                from: 'mastercategories',
                localField: 'typeId',
                foreignField: '_id',
                as: 'masterCategory',
              },
            },
            {
              $lookup: {
                from: 'mastersubsubcategories',
                localField: 'typeId',
                foreignField: '_id',
                as: 'subCategory',
              },
            },
            {
              $lookup: {
                from: 'mastersubcategoryhealthcares',
                localField: 'typeId',
                foreignField: '_id',
                as: 'subSubCategory',
              },
            },
            {
              $lookup: {
                from: 'products',
                localField: 'typeId',
                foreignField: '_id',
                as: 'product',
              },
            },
            {
              $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$product.pricing",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                type: 1,
                redirect_id: '$typeId',
                stock:'$product.pricing.stock',
                statusLimit:'$product.statusLimit',
                redirect_type: 1,
                image: { $concat: [imgPath, '$image'] },
                typeName1: {
                  $ifNull: [
                    { $first: '$subCategory.title' },
                    { $first: '$subSubCategory.title' },
                  ],
                },
                typeName2: {
                  $ifNull: [
                    '$product.name' ,
                    { $first: '$masterCategory.title' },
                  ],
                },
              },
            },
          ]).sort('-updatedAt');
          for (i = 0; i < Slider3.length; i++) {
            if (Slider3[i].stock > Slider3[i].statusLimit) {
              Slider3[i].stockStatus = "Available";
            } else if (Slider3[i].stock == 0) {
              Slider3[i].stockStatus = "Out of stock";
            } else {
              Slider3[i].stockStatus = "Limited";
            }
            if (Slider3[i].typeName1) {
              Slider3[i].title = Slider3[i].typeName1;
              delete Slider3[i].typeName1;
            } else if (Slider3[i].typeName2) {
              Slider3[i].title = Slider3[i].typeName2;
              delete Slider3[i].typeName2;
            } else {
              Slider3[i].title = '';
            }
          }

          //combo offer
          let ComboOffers = await Inventory.aggregate([
            {
              $match: {
                offerType: 'Combo Offer',
              },
            },
            {
              $unwind: '$pricing',
            },
            {
              $project: {
                product_id: '$_id',
                statusLimit:1,
                product: '$name',
                price: '$pricing.price',
                spl_price: '$pricing.specialPrice',
                image: '$pricing.image',
                varient_id: '$pricing._id',
                sku: '$pricing.sku',
                brand_id: '$brand',
                stock:'$pricing.stock',

              },
            },
          ]).sort("-updatedAt").limit(10);
          let offer_percent = 0;
          let uom =''
          for (var i = 0; i < ComboOffers.length; i++) {
            if (ComboOffers[i].stock > ComboOffers[i].statusLimit) {
              ComboOffers[i].stockStatus = "Available";
            } else if (ComboOffers[i].stock == 0) {
              ComboOffers[i].stockStatus = "Out of stock";
            } else {
              ComboOffers[i].stockStatus = "Limited";
            }
            ComboOffers[i].offer_percent = Math.floor(
              ((ComboOffers[i].price - ComboOffers[i].spl_price) /
                ComboOffers[i].price) *
                100
            );
            ComboOffers[i].brand =await Brand.findOne({_id: mongoose.Types.ObjectId(ComboOffers[i].brand_id)},{title:1,'_id': 0})
            ComboOffers[i].brand = ComboOffers[i].brand.title,
             uom = await MasterUOMValue.findOne(
              { _id: mongoose.Types.ObjectId(ComboOffers[i].sku) },
              {
                uomValue: 1,
              }
            );
            if (uom) {
              ComboOffers[i].uomValue = uom.uomValue;
            }
            delete ComboOffers[i]._id;
            ComboOffers[i].image = process.env.BASE_URL.concat(
              ComboOffers[i].image[0]
            );
          }

          //seasonal offers set new offer

          let New = await SetNewOffer.aggregate([
            {
              $match: {
                sliderType: 'SetNewOffer',
              },
            },
            {
              $project: {
                name: 1,
              },
            },
          ]);

          let NewOffers = [];
          if (New.length) {
            
            let Gr = await setNewOfferSub
            .aggregate([
              {
                $match: {
                  CatId: mongoose.Types.ObjectId(New[0]._id),
                },
              },
              {
                $lookup: {
                  from: 'products',
                  localField: 'ProductId',
                  foreignField: '_id',
                  as: 'product',
                },
              },
            ])
            .then(async (result) => {
              let variant = [];
              for (let item of result) {
                for (let j of item.product) {
                  for (let i of j.pricing) {
                    variant.push({
                      image: process.env.BASE_URL.concat(i.image[0]),
                      id: j._id,
                      title: j.name,
                      statusLimit:j.statusLimit,
                      stock:i.stock,
                    });
                    break;
                  }
                }
              }
              NewOffers = variant;
            });
            New = New[0];
          } else {
            New = {};
             NewOffers = [];
          }

          //vocal local
          let VocalLocal = [];
          let G = await editorsChoice
            .aggregate([
              {
                $match: {
                  sliderType: 'vocal_local',
                },
              },
              {
                $lookup: {
                  from: 'products',
                  localField: 'ProductId',
                  foreignField: '_id',
                  as: 'product',
                },
              },
            ])
            .then(async (result) => {
              let variant = [];
              for (let item of result) {
                for (let j of item.product) {
                  for (let i of j.pricing) {
                    variant.push({
                      image: process.env.BASE_URL.concat(item.image),
                      product_id: j._id,
                      product: j.name,
                      stock:i.stock,
                      statusLimit:j.statusLimit
                    });
                    break;
                  }
                }
              }
              VocalLocal = variant;
            });

          //immunity booster
          let ImmunnityBooster = [];
          let GImmunnityBoosters = await immunnityBooster
            .aggregate([
              {
                $match: {
                  isDisabled: false,
                },
              },
              {
                $lookup: {
                  from: 'products',
                  localField: 'ProductId',
                  foreignField: '_id',
                  as: 'product',
                },
              },
            ])
            .then(async (result) => {
              console.log('result', result);
              let variant = [];
              for (let item of result) {
                for (let j of item.product) {
                  if (j.pricing) {
                    for (let i of j.pricing) {
                      variant.push({
                        price: i.price,
                        spl_price: i.specialPrice,
                        image: process.env.BASE_URL.concat(i.image[0]),
                        product: j.name,
                        product_id: j._id,
                        stock:i.stock,
                        statusLimit:j.statusLimit
                      });
                      break;
                    }
                  }
                }
              }
              ImmunnityBooster = variant;
            });
          let discount = 0;
          for (var i = 0; i < ImmunnityBooster.length; i++) {
            ImmunnityBooster[i].discount = Math.floor(
              ((ImmunnityBooster[i].price - ImmunnityBooster[i].spl_price) /
                ImmunnityBooster[i].price) *
                100
            );
            delete ImmunnityBooster[i]._id;
            delete ImmunnityBooster[i].price;
            delete ImmunnityBooster[i].spl_price;
          }

          let Ad5 = await sliders.aggregate([
            {
              $match: {
                sliderType: 'ad5',
              },
            },
            {
              $project: {
                image: { $concat: [imgPath, '$image'] },
                redirect_type: 1,
                type: 1,
                redirect_id: '$typeId',
              },
            },
          ]);
          if (Ad5.length) {
            Ad5 = Ad5[0];
          } else {
            Ad5 = {};
          }
          let Slider4 = await sliders.aggregate([
            {
              $match: {
                sliderType: 'slider4',
              },
            },
            {
              $lookup: {
                from: 'mastercategories',
                localField: 'typeId',
                foreignField: '_id',
                as: 'masterCategory',
              },
            },
            {
              $lookup: {
                from: 'mastersubsubcategories',
                localField: 'typeId',
                foreignField: '_id',
                as: 'subCategory',
              },
            },
            {
              $lookup: {
                from: 'mastersubcategoryhealthcares',
                localField: 'typeId',
                foreignField: '_id',
                as: 'subSubCategory',
              },
            },
            {
              $lookup: {
                from: 'products',
                localField: 'typeId',
                foreignField: '_id',
                as: 'product',
              },
            },
            {
              $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$product.pricing",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                type: 1,
                redirect_type: 1,
                redirect_id: '$typeId',
                image: { $concat: [imgPath, '$image'] },
                typeName1: {
                  $ifNull: [
                    { $first: '$subCategory.title' },
                    { $first: '$subSubCategory.title' },
                  ],
                },
                typeName2: {
                  $ifNull: [
                    '$product.name',
                    { $first: '$masterCategory.title' },
                  ],
                },
              },
            },
          ]).sort('-updatedAt');
          for (i = 0; i < Slider4.length; i++) {
            if (Slider4[i].typeName1) {
              Slider4[i].title = Slider4[i].typeName1;
              delete Slider4[i].typeName1;
            } else if (Slider4[i].typeName2) {
              Slider4[i].title = Slider4[i].typeName2;
              delete Slider4[i].typeName2;
            } else {
              Slider4[i].title = '';
            }
          }

          let Ad6 = await TopCategory.aggregate([
            {
              $match: {
                sliderType: 'ad6',
              },
            },
            { $project: { image: { $concat: [imgPath, '$image'] } } },
          ]);
          if (Ad6.length) {
            Ad6 = Ad6[0];
          } else {
            Ad6 = {};
          }
          let EnergizeYourWorkout = await editorsChoice.aggregate([
            {
              $match: {
                sliderType: 'energize_workout',
              },
            },
            {
              $lookup: {
                from: 'mastercategories',
                localField: 'ProductId',
                foreignField: '_id',
                as: 'masterCategory',
              },
            },
            {
              $lookup: {
                from: 'mastersubsubcategories',
                localField: 'ProductId',
                foreignField: '_id',
                as: 'subCategory',
              },
            },
            {
              $lookup: {
                from: 'mastersubcategoryhealthcares',
                localField: 'ProductId',
                foreignField: '_id',
                as: 'subSubCategory',
              },
            },
            {
              $lookup: {
                from: 'products',
                localField: 'ProductId',
                foreignField: '_id',
                as: 'product',
              },
            },
            {
              $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$product.pricing",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                image: { $concat: [imgPath, '$image'] },
                statusLimit:'$product.statusLimit',
                stock:'$product.pricing.stock',
                categoryId: 1,
                ProductId: 1,
                typeName1: {
                  $ifNull: [
                    { $first: '$subCategory.title' },
                    { $first: '$subSubCategory.title' },
                  ],
                },
                typeName2: {
                  $ifNull: [
                     '$product.name',
                    { $first: '$masterCategory.title' },
                  ],
                },
              },
            },
          ]);

          for (i = 0; i < EnergizeYourWorkout.length; i++) {
            if (EnergizeYourWorkout[i].stock > EnergizeYourWorkout[i].statusLimit) {
              EnergizeYourWorkout[i].stockStatus = "Available";
            } else if (EnergizeYourWorkout[i].stock == 0) {
              EnergizeYourWorkout[i].stockStatus = "Out of stock";
            } else {
              EnergizeYourWorkout[i].stockStatus = "Limited";
            }
            if (EnergizeYourWorkout[i].typeName1) {
              EnergizeYourWorkout[i].title = EnergizeYourWorkout[i].typeName1;
              delete EnergizeYourWorkoutEnergizeYourWorkout[i].typeName1;
            } else if (EnergizeYourWorkout[i].typeName2) {
              EnergizeYourWorkout[i].title = EnergizeYourWorkout[i].typeName2;
              delete EnergizeYourWorkout[i].typeName2;
            } else {
              EnergizeYourWorkout[i].title = '';
            }
          }

          let Ad7 = await ad7.aggregate([
            {
              $match: {
                isDisabled: false,
              },
            },
            {
              $project: {
                image: { $concat: [imgPath, '$image'] },
                couponCode: 1,
              },
            },
          ]);
          if (Ad7.length) {
            Ad7 = Ad7[0];
          } else {
            Ad7 = {};
          }
          let NutriChart = await nutrichartFood.aggregate([
            {
              $match: {
                recommended: true,
                recommended_isDeleted: false,
              },
            },
            {
              $project: {
                image: { $concat: [imgPath, '$image'] },
                title: 1,
                category: 1,
              },
            },
          ]);
          //cart your med essentials
          var med_essential = await AdsHomeCart.aggregate([
            {
              $match: {
                isDisabled: false,
              },
            },
            {
              $lookup: {
                from: 'mastersubcategoryhealthcares',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'subCategory',
              },
            },
            {
              $unwind: {
                path: '$subCategory',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$product.pricing",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                categoryId:'$subCategory._id',
                category: '$subCategory.title',
                image: { $concat: [imgPath, '$subCategory.image'] },
              },
            },
          ]);
          let Slider5 = await slider5.aggregate([
            {
              $match: {
                isDisabled: false,
              },
            },
            {
              $lookup: {
                from: 'mastercategories',
                localField: 'typeId',
                foreignField: '_id',
                as: 'masterCategory',
              },
            },
            {
              $lookup: {
                from: 'mastersubsubcategories',
                localField: 'typeId',
                foreignField: '_id',
                as: 'subCategory',
              },
            },
            {
              $lookup: {
                from: 'mastersubcategoryhealthcares',
                localField: 'typeId',
                foreignField: '_id',
                as: 'subSubCategory',
              },
            },
            {
              $lookup: {
                from: 'products',
                localField: 'typeId',
                foreignField: '_id',
                as: 'product',
              },
            },
            {
              $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$product.pricing",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                type: 1,
                redirect_id: '$typeId',
                statusLimit:'$product.statusLimit',
                stock:'$product.pricing.stock',
                image: { $concat: [imgPath, '$image'] },
                typeName1: {
                  $ifNull: [
                    { $first: '$subCategory.title' },
                    { $first: '$subSubCategory.title' },
                  ],
                },
                typeName2: {
                  $ifNull: [
                    '$product.name',
                    { $first: '$masterCategory.title' },
                  ],
                },
              },
            },
          ]).sort('-updatedAt');
          for (i = 0; i < Slider5.length; i++) {
            if (Slider5[i].stock > Slider5[i].statusLimit) {
              Slider5[i].stockStatus = "Available";
            } else if (Slider5[i].stock == 0) {
              Slider5[i].stockStatus = "Out of stock";
            } else {
              Slider5[i].stockStatus = "Limited";
            }
            if (Slider5[i].typeName1) {
              Slider5[i].title = Slider5[i].typeName1;
              delete Slider5[i].typeName1;
            } else if (Slider5[i].typeName2) {
              Slider5[i].title = Slider5[i].typeName2;
              delete Slider5[i].typeName2;
            } else {
              Slider5[i].title = '';
            }
          }

          let TrendingBrands = await Brand.aggregate([
            {
              $match: {
                isTrending: true,
              },
            },
            { $project: { image: { $concat: [imgPath, '$image'] }, title: 1 } },
          ]);
          let Ad8 = await TopCategory.aggregate([
            {
              $match: {
                sliderType: 'ad8',
              },
            },
            { $project: { image: { $concat: [imgPath, '$image'] } } },
          ]);
          if (Ad8.length) {
            Ad8 = Ad8[0];
          } else {
            Ad8 = {};
          }
          //amazing deals
          const { _id: userId } = req.user;

          const customerType = 'normal';

          const scratchableAndUpComingCoupons = await coupons.aggregate([
            {
              $match: {
                customerType,
                to: { $gte: new Date() },
                isDisabled: false,
              },
            },

            {
              $project: {
                image: { $concat: [process.env.BASE_URL, '$image'] },
                _id: 1,
                name: 1,
                code: 1,
                from: 1,
                to: 1,
                percentage: 1,
              },
            },
          ]);

          //get scratched coupons
          const scratchableCouponsIds = scratchableAndUpComingCoupons.map(
            (coupon) => coupon._id
          );
          let scratchedCouponIds = await ScratchedCoupon.find(
            { userId, couponId: { $in: scratchableCouponsIds } },
            { couponId: 1, _id: 0 }
          );
          scratchedCouponIds = scratchedCouponIds.map((scratchedCoupon) =>
            scratchedCoupon.couponId.toString()
          );

          //filter scratchable and upcoming coupons
          const scratchableCoupons = [];
          const upComingCoupons = [];
          const scratchedCoupons = [];
          scratchableAndUpComingCoupons.map((coupon) => {
            if (scratchedCouponIds.includes(coupon._id.toString())) {
              scratchableCoupons.push(coupon);
            } else {
              upComingCoupons.push({ fromDate: coupon.from });
              if (new Date().getTime() >= new Date(coupon.from).getTime()) {
                scratchableCoupons.push(coupon);
              } else {
                upComingCoupons.push({ fromDate: coupon.from });
              }
            }
          });
          res.status(200).json({
            message: 'success',
            error: false,
            data: {
              // TopCategories: TopCategories,
              // Slider1: Slider1,
              // MainCategories: MainCategories,
              // MedicineCategory:MedicineCategory,
              // TrendingCategories: TrendingCategories,
              // MyOrders:MyOrders,
              // Ad1: Ad1,
              // SpotLights: SpotLights,
              // ExcitingOffers:ExcitingOffers,
              // TopRecommended:TopRecommended,
              // Slider2:Slider2,
              // RecentlyViewed:RecentlyViewed,
              // PartnerPromotions: PartnerPromotions,
              // EditorsChoices: EditorsChoices,
              // Articles: {MainArticles:MainArticles},SubArticles,
              // yogaVideos: {mainYoga:mainYoga},
              // subYoga,
              fitnessVideos: {
                mainFitness: mainFitness,
                subFitness: subFitness,
              },
              nutrichartVitamins: nutrichartVitamins,
              Ad2: Ad2,
              ShopByBrands: ShopByBrands,
              Promotions: Promotions,
              Ad3: Ad3,
              HealthCareVideos: {
                HealthCareMain: HealthCareMain,
                HealthCareSub: HealthCareSub,
              },
              health_advice: health_advice,
              Ad4: Ad4,
              PlanYourDiets: PlanYourDiets,
              Slider3: Slider3,
              ComboOffers: ComboOffers,
              NewOffers: { category: New, products: NewOffers },
              VocalLocal: VocalLocal,
              ImmunnityBooster: ImmunnityBooster,
              Ad5: Ad5,
              Slider4: Slider4,
              Ad6: Ad6,
              EnergizeYourWorkout: EnergizeYourWorkout,
              Ad7: Ad7,
              NutriChart: NutriChart,
              med_essential: med_essential,
              Slider5: Slider5,
              TrendingBrands: TrendingBrands,
              Ad8: Ad8,
              amazingDeals: scratchableCoupons,
            },
          });
        }
      } else {
        res.status(200).json({
          message: 'please add page number and try again',
          error: true,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  submitRating: async (req, res, next) => {
    try {
     
          var data = req.body;
          data.userId=req.user._id
         let validUser = await User.findOne({_id:data.userId})
         if(validUser){
          let validOrder = await Orders.findOne({_id:data.orderObjectId})
          if(validOrder){
            let validProduct = await Inventory.findOne({_id:data.productId})
           if(validProduct){
             let userRated = await productRating.findOne({userId:req.user._id,productId:data.productId})
             console.log('userRated',userRated)
             if(!userRated){
              let schemaObject = new productRating(data);
              console.log('##################',data)
              await Orders.updateOne(
                { _id:mongoose.Types.ObjectId(data.orderObjectId) ,"products.product_id": mongoose.Types.ObjectId(data.productId) },
                {
                  $set: {
                    "products.$.isRated" :true
                  },
                }
              )
              
          schemaObject.save().then((response) => {
            console.log('##################',response)
            res.status(200).json({
              error: false,
              message: 'productRating added successfully',
            });
          });
             }else{
              res.status(200).json({
                error: true,
                message: 'user is already rated to this product',
              });
             }
            
           }else{
            res.status(200).json({
              error: true,
              message: 'something went wrong Invalid product',
            });
           }
          }else{
            res.status(200).json({
              error: true,
              message: 'something went wrong Invalid order',
            });
          }
 
         }else{
          res.status(200).json({
            error: true,
            message: 'something went wrong please login and try',
          });
         }
       
      
    } catch (error) {
      next(error);
    }
  },
  getDeliveredProducts: async (req, res, next) => {
    try {
       
        const deliveredProducts = await Orders.aggregate([
            {
              $match: {
                $and: [
                    { orderStatus: "delivered" },
                    { userId: mongoose.Types.ObjectId(req.user._id) },
                  ],
              },
            },
            {
              $unwind: {
                path: "$products",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
              id:"$_id",
              image: "$products.image",
              product: "$products.productName",
              product_id: "$products.product_id",

              // rating_value:1,
              },
            },
      
          ]);
         
          for (let item of deliveredProducts) {
            let rating = await productRating.findOne({userId:item.userId,productId:item.product_id})
            if (rating){
              item.rating_value = rating.star
            }else{
              item.rating_value = 0
            }
          }
          return res.json({
            error: false,
            message: deliveredProducts.length
              ? "deliveredProducts found."
              : "empty deliveredProducts orders.",
            data: {
              deliveredProducts,
            },
          });
    } catch (error) {
        next(error);
    }
  },
  getUserNotifications: async (req, res, next) => {
    try {
      const UserNotification = await userNotification.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(req.user._id)
          },
        },
        {
          $unwind: {
            path: "$cartDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            orderId: 1,
            orderObjectId:1,
            paymentType: 1,
            orderStatus: 1,
            message:1,
            isRead:1,
            arrivingDate:1,
            createdAt:1

          },
        },
        { $sort: { _id: -1 } }
      ]);
      let notificationCount = await userNotification.countDocuments({ userId: mongoose.Types.ObjectId(req.user._id),isRead:false})
      for(let item of UserNotification){
        item.arrivingDate = moment(
          item.arrivingDate
        ).format("MMMM Do YYYY")
        item.createdAt = timeSince(item.createdAt);
      }
      return res.json({
        error: false,
        message: UserNotification.length
          ? "UserNotification found."
          : "Empty UserNotification.",
        data: {
          UserNotification,
          notificationCount
        },
      });
    } catch (error) {
      next(error);
    }
  },
  changeNotificationReadStatus: async (req, res, next) => {
    try {
      let data = req.body;
      let validNotification = await userNotification.findOne({
        userId: req.user._id,_id: data.notificationId,
      });
      if (validNotification) {
        await userNotification.updateOne(
          { _id: data.notificationId },
          {
            $set: {
              isRead:true,
            },
          }
        )
          .then(async (response) => {
            res.status(200).json({
              error: false,
              message: "user notification status updated successfully",
            });
          })
          .catch(async (error) => {
            res.status(200).json({
              error: true,
              message: error,
            });
          });
      } else {
        res.status(200).json({
          status: false,
          message: "something went wrong please login and continue",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteNotification: async (req, res, next) => {
    try {
      let result = await userNotification.findOne({
        _id: mongoose.Types.ObjectId(req.body.id),isRead:true
      });
      if (result) {
       
        userNotification.deleteOne({   _id: mongoose.Types.ObjectId(req.body.id) })
          .then((_) => {
            res.status(200).json({
              status: true,
              data: "Data removed successfully",
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
          data: "invalid id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteAllNotifications: async (req, res, next) => {
    try {
      let result = await userNotification.find({
        userId: mongoose.Types.ObjectId(req.user._id),isRead:true
      });
      if (result.length) {
       
        userNotification.deleteMany({   userId: mongoose.Types.ObjectId(req.user._id),isRead:true})
          .then((_) => {
            res.status(200).json({
              status: true,
              data: "Data removed successfully",
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
          data: "invalid id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
