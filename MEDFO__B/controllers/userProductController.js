const mongoose = require("mongoose");
const fs = require("fs");
const MasterSubCategoryHealthcare = require("../models/mastersettings/subCategoryHealthcare");
const AdsMedimallTopIconCatHealth = require("../models/ads/medimall/topIconCatHealth");
const Inventory = require("../models/inventory");
const MasterUOMValue = require("../models/mastersettings/uomValue");
const MasterBrand = require("../models/mastersettings/brand");
const AdsHomeCart = require("../models/ads/home/cart");
const InventoryFavourite = require("../models/inventoryFavourites");
const MasterSubSubCategoryHealthcare = require("../models/mastersettings/subSubCategory");
const categoryTypeHealth = "healthcare";
const WebBanner = require("../models/ads/web/webBanner");
const Cart = require("../models/cart");
const adsHowToOrderMedicine = require("../models/ads/cart/howToOrderMedicine")
const adsOrderMedicineSlider = require("../models/ads/cart/ordermedicineslider")
const MasterCategory = require("../models/mastersettings/category");
const adsOrderMedicine3Icon = require("../models/ads/cart/ordermedicine3icon")
var categoryTypeMedicine = "medicine";
const imgPath = process.env.BASE_URL;

module.exports = {
  getCategoryInCartYourMedessential: async (req, res, next) => {
    try {
      let banner = "";
      var limit = 0;
      if (req.body.limit) {
        limit = parseInt(req.body.limit);
      }
      if (limit == 0) limit = 10;
      var skip = (parseInt(req.body.page) - 1) * parseInt(limit);

      // --------Ads medimall healthcare banner
      healthcareBanner = await AdsMedimallTopIconCatHealth.findOne(
        { sliderType: categoryTypeHealth, isDisabled: false },
        {
          image: { $concat: [imgPath, "$image"] },
          _id: 0,
        }
      )
        .sort("-id")
        .limit(limit)
        .skip(skip);

      if (healthcareBanner) {
        banner = healthcareBanner.image;
      }

      //favourite count
      let favouriteCount = await InventoryFavourite.find({
        userId: req.user._id,
      }).countDocuments();
      // sub category listing in healthcare
      // let subCategories = await MasterSubCategoryHealthcare.find(
      //     { categoryId:req.body.cat_id, isDisabled: false},
      //     {
      //         title: 1,
      //         image: { $concat: [imgPath, "$image"] }
      //     }
      // );

      // Getting category details from ads -home -cart your med essntials
      //              let subCategories = await AdsHomeCart.find(
      //                 { isDisabled: false},
      //                 {
      //                     title: 1,
      //                     image: { $concat: [imgPath, "$image"] }
      //                 }
      //             );
      // console.log(subCategories)
      var subCategories = await AdsHomeCart.aggregate([
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
            //preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            title: "$subCategory.title",
            image: { $concat: [imgPath, "$subCategory.image"] },
            categoryId: 1,
          },
        },
      ]);

      // dumy data (we need most buyed product under this category)
      let items = [];
      for (let ids of subCategories) {
        let strId = String(ids.categoryId);
        let productDetails = await Inventory.find(
          { categories: strId },
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
        ).populate({ path: "brand", select: ["title"] })
          .sort("-id")
          .limit(limit)
          .skip(skip);
        for (let item of productDetails) {
          let checkStock = false;
          let uomTitle = "";
          var data = {
            _id: item._id,
            title: item.name,
            brand:item.brand.title
          };

          // Getting pricing details of each varient
          for (let pricing of item.pricing) {
            if (pricing.stock > 0) {
              checkStock = true;
              if (pricing.stock < item.statusLimit) {
                data.stockStatus = "Limited";
              } else {
                data.stockStatus = "Available";
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
              data.discount = "";
              if (pricing.image[0]) {
                data.image = imgPath.concat(pricing.image[0]);
              }
              let discountPercentage = Math.round(
                ((pricing.price - pricing.specialPrice) / pricing.price) * 100
              );
              if (discountPercentage > 0 && discountPercentage < 100) {
                data.discount = discountPercentage + "%";
              }
              data.price = pricing.price;
              data.spl_price = pricing.specialPrice;
              data.uom = uomTitle;
              data.varientId = pricing._id;
              items.push(data);
              break;
            }
          }

          // If no stock is available for varient then take the first varient
          if (!checkStock) {
            data.stockStatus = "Out of stock";
            if (item?.pricing[0]) {
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
              data.discount = "";
              if (item.pricing[0].image[0]) {
                data.image = imgPath.concat(item.pricing[0].image[0]);
              }
              let discountPercentage = Math.round(
                ((item.pricing[0].price - item.pricing[0].specialPrice) /
                  item.pricing[0].price) *
                  100
              );
              if (discountPercentage > 0 && discountPercentage < 100) {
                data.discount = discountPercentage + "%";
              }
  
              data.price = item.pricing[0].price;
              data.spl_price = item.pricing[0].specialPrice;
              data.uom = uomTitle;
              data.varientId = item.pricing[0]._id;
            }else{
              data.image = "";
              data.discount = "";
              data.price = 0;
              data.spl_price = 0;
              data.uom = uomTitle;
              data.varientId = "";
            }
           

            items.push(data);
          }
        }
      }
      const titles = items.map((o) => o.title);
      const productDetails = items.filter(
        ({ title }, index) => !titles.includes(title, index + 1)
      );

      let cartCount = await Cart.countDocuments({
        userId: mongoose.Types.ObjectId(req.user._id),
      });

      res.status(200).json({
        error: false,
        message: "Products are",
        data: {
          banner: banner,
          subCategory: subCategories,
          products: productDetails,
          favouriteCount: favouriteCount,
          cartCount:cartCount
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getProductByBrandId: async (req, res, next) => {
    
    try {
      let banner = "";  
    
      var limit = 0;
      if (req.body.limit) {
        limit = parseInt(req.body.limit);
      }
      if (limit == 0) limit = 30;
      var skip = (parseInt(req.body.page) - 1) * parseInt(limit);

      //favourite count
      let favouriteCount = await InventoryFavourite.find({
        userId: req.user._id,
      }).countDocuments();


      // --------Banner in brand
      brandBanner = await MasterBrand.findOne(
        { _id: req.body.brandId, isDisabled: false },
        {
          banner: { $concat: [imgPath, "$banner"] },
          _id: 0,
        }
      );

      if (brandBanner) {
        banner = brandBanner.banner;
      }

   

      let items = [];
      let productDetails = await Inventory.find(
        { brand: req.body.brandId,type:"healthcare" },
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
        }
      ).populate({ path: "brand", select: ["title"] })
        .sort("-id")
        .limit(limit)
        .skip(skip);

      for (let item of productDetails) {
        let uomTitle = "";

        var data = {
          _id: item._id,
          title: item.name,
          brand:item.brand.title
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
            data.discount = "";
            if (pricing.image[0]) {
              data.image = imgPath.concat(pricing.image[0]);
            }
            let discountPercentage = Math.round(
              ((pricing.price - pricing.specialPrice) / pricing.price) * 100
            );
            if (discountPercentage > 0 && discountPercentage < 100) {
              data.discount = discountPercentage + "%";
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
          data.discount = "";
          if (item.pricing[0].image[0]) {
            data.image = imgPath.concat(item.pricing[0].image[0]);
          }
          let discountPercentage = Math.round(
            ((item.pricing[0].price - item.pricing[0].specialPrice) /
              item.pricing[0].price) *
              100
          );
          if (discountPercentage > 0 && discountPercentage < 100) {
            data.discount = discountPercentage + "%";
          }
          data.price = item.pricing[0].price;
          data.spl_price = item.pricing[0].specialPrice;
          data.uom = uomTitle;
          data.varientId = item.pricing[0]._id;
          items.push(data);
        }
      }


      let cartCount = await Cart.countDocuments({
        userId: mongoose.Types.ObjectId(req.user._id),
      });

      res.status(200).json({
        error: false,
        message: "Products are",
        data: {
          banner: banner,
          products: items,
          favouriteCount: favouriteCount,
          cartCount:cartCount
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // get sub sub category (App)
  getSubSubCategory: async (req, res, next) => {
    try {
        console.log(req.body._id)
      let products = [];
      let category = [];
      let banner = "";
      let productBrands = [];
      let subcategoryBanner = await MasterSubCategoryHealthcare.find(
        { _id: req.body.cat_id, isDisabled: false },
        {
          banner: { $concat: [imgPath, "$banner"] },
        }
      );

      if (subcategoryBanner.length != 0) {
        banner = subcategoryBanner[0].banner;
      }
      //favourite count
      let favouriteCount = await InventoryFavourite.find({
        userId: req.user._id,
      }).countDocuments();

      let subSubcategoryDetails = await MasterSubSubCategoryHealthcare.find(
        { subCategoryId: req.body.cat_id, isDisabled: false },
        {
          title: 1,
          image: { $concat: [imgPath, "$image"] },
        }
      )
        .sort("-id")
        .lean();

      let is_subSubCategory = true;
      if (subSubcategoryDetails.length == 0) {
        is_subSubCategory = false;
        subSubcategoryDetails.push({ _id: req.body.cat_id });
      }

      let brands = await MasterBrand.find(
        { isPromoted: true, isDisabled: false },
        {
          title: 1,
          baner: { $concat: [imgPath, "$banner"] },
          image: { $concat: [imgPath, "$image"] },
        }
      );

      let items = [];
      for (let ids of subSubcategoryDetails) {
        let productDetails = await Inventory.find(
          {
            categories: ids._id + "",
            isDisabled: false,
            type: categoryTypeHealth,
          },
          {
            name: 1,          
            brand: 1,
          }
        )
        .populate({ path: "brand", select: ["title"] })
          .sort("-id")
          .lean();
        for (let item of productDetails) {
          let brand ={
              title:item.brand.title,
              _id:item.brand._id
          }
          if (brand) {
            /* checking product brand name exist or not  */
            if (!productBrands.some((e) => e.title === brand.title)) {
              productBrands.push(brand);
            }
          }
        }
        if (!is_subSubCategory) {
          ids._id = "";
          ids.title = "";
          ids.image = "";
        }
      }

      // get cart count
      let cartCount = await Cart.countDocuments({
        userId: mongoose.Types.ObjectId(req.user._id),
      });


    
      res.status(200).json({
        error: false,
        message: "Products are",
        data: {
          banner: banner,
          sub_subcategory: subSubcategoryDetails,
          is_subSubCategory: is_subSubCategory,
          favouriteCount: favouriteCount,
          product_brands: productBrands,
          brands: brands,
          cartCount:cartCount
       
        },
      });
    } catch (error) {
      next(error);
    }
  },


  // get products based on sub sub category id
  getAllProducts: async (req, res, next) => {
      try {
          
          let items = [];
          let productDetails = await Inventory.find(
            {
              categories: req.body.cat_id ,
              isDisabled: false,
              type: "healthcare",
            },
            {
              name: 1,
              statusLimit: 1,
              "pricing.image": 1,
              "pricing.price": 1,
              "pricing.specialPrice": 1,
              "pricing.uom": 1,
              "pricing.sku": 1,
              "pricing.stock": 1,
              "pricing._id": 1
            }
          ).populate({ path: "brand", select: ["title"] }).sort({$natural:-1})
          let count =0
          for (let item of productDetails) {
              count++        
              if(count == 5){
                
                var data = {
                  _id: "",
                  title: "",
                  brand: "",
                  stockStatus : "",
                  image : "",
                  discount : "",
                  price : 0,
                  spl_price : 0,
                  uom : "",
                  varientId :""
                };
                
                items.push(data);
                
              }
              if(count == 9){
                var data = {
                  _id: "",
                  title: "",
                  brand: "",
                  stockStatus : "",
                  image : "",
                  discount : "",
                  price : 0,
                  spl_price :0,
                  uom : "",
                  varientId :""
                };            
                items.push(data);
                
              }
            var checkStock = false;
            let uomTitle = "";
  
            var data = {
              _id: item._id,
              title: item.name,
              brand:item.brand.title
            };
          
            if (item?.pricing) {
            
              for (let pricing of item.pricing) {                 
                  if (!checkStock) {
                    
                    if (pricing.stock > 0) {
                  
                      if (pricing.stock < item.statusLimit) {
                        data.stockStatus = "Limited";
                      } else {
                        data.stockStatus = "Available";
                      }
                      checkStock = true;
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
                      data.discount = "";
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
                        data.discount = discountPercentage + "%";
                      }
  
                      data.price = pricing.price;
                      data.spl_price = pricing.specialPrice;
                      data.uom = uomTitle;
                      data.varientId = pricing._id;
  
                      items.push(data);
                    
                    }
                  }                  
              } 
              if (!checkStock) {
                if (item?.pricing[0]) {
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
                  data.discount = "";
                  if (item.pricing[0].image[0]) {
                    data.image = imgPath.concat(item.pricing[0].image[0]);
                  }
                  let discountPercentage = Math.round(
                    ((item.pricing[0].price - item.pricing[0].specialPrice) /
                      item.pricing[0].price) *
                      100
                  );
                  if (discountPercentage > 0 && discountPercentage < 100) {
                    data.discount = discountPercentage + "%";
                  }
    
                  data.price = item.pricing[0].price;
                  data.spl_price = item.pricing[0].specialPrice;
                  data.uom = uomTitle;
                  data.varientId = item.pricing[0]._id;
                  items.push(data)
                }
              
                  
                }         
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
            status: true,
            data: {
              totalPage,
              nextPage,
              products,
            },
          });
      } catch (error) {
        next(error);
      }
  },  


  // Get the home page details
  getOrderMedicineOnline: async (req, res, next) => {
    try {


      // get cart count of user
      let cartCount = await Cart.countDocuments({
        userId: mongoose.Types.ObjectId(req.user._id),
      });


      // ads - cart -  how to order medicine
      let orderMedicine = await adsHowToOrderMedicine.findOne(
        { isDisabled: false },
        {
            type: 1,
            thumbnail: { $concat: [imgPath, "$thumbnail"] },
            video: 1
        }
      );

        // ads - cart - order madicine - 3 icon 
        let orderMedicine3icon = await adsOrderMedicine3Icon.findOne(
          { isDisabled: false },
          {
              name: 1,
              image: { $concat: [imgPath, "$image"] }
          }
        );

      // get 3 icons (ads -medimall -top 3 icons)
      let top3Icons = await AdsMedimallTopIconCatHealth.find(
        { sliderType: "top3icons"},
        {
            sliderType:1,
            image: { $concat: [imgPath, "$image"] }
        }
      );

       // get 3 icons (ads -medimall -top 3 icons)
       let prescription = await AdsMedimallTopIconCatHealth.findOne(
        { sliderType: "top3iconsprescription"},
        {
            sliderType:1,
            image: { $concat: [imgPath, "$image"] }
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



      var slider = await adsOrderMedicineSlider.aggregate([
        {
            $match: {
              sliderType: "OrderMedicineSlider", isDisabled: false
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
            $project: {
                _id: 1,
                type:
                {
                  $cond: { if: { $eq: [ "$type", 1 ] }, then: "product", else: "category" }
                },
                typeId: 1,
                image: { $concat: [imgPath, "$image"] },
                typeName: { $ifNull: [  { $first: "$subCategory.title"}, { $first: "$product.name" }] }
            },
        },
        ]);
     
  
      res.status(200).json({
        message: "success",
        error: false,
        data: {
          orderMedicine3icon:orderMedicine3icon,
          orderMedicine: orderMedicine,
          prescription:prescription,
          top3Icons: top3Icons,
          slider:slider,
          cartCount:cartCount
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getActiveMedicineCategories: async (req, res, next) => {
    try {
        let result = await MasterCategory.find(
            { categoryType: categoryTypeMedicine, isDisabled: false },
            {
                title: 1,
                image: { $concat: [imgPath, "$image"] }
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
};
