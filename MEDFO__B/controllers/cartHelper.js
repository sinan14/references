const mongoose = require("mongoose");
const cart = require("../models/cart");
const product = require("../models/inventory");
const RecentlyViewed = require("../models/RecentlyViewed");

const imgPath = process.env.BASE_URL;

module.exports = {
    
    checkDuplicateCart: async (data) => {
        let duplicateVariant = await cart.findOne(
            {
                $and: [
                    {userId: mongoose.Types.ObjectId(data.userId)},
                    {product_id: mongoose.Types.ObjectId(data.product_id)},
                ]

            }
        )
        
        if (duplicateVariant != null) {                
            return true;
        } else {               
            return false;
        }
        
    },
    getProductDetails: async (product_id) => {
        let data = await product.findOne({_id: mongoose.Types.ObjectId(product_id)});
        return data;
    },
    arrangeDataForCart: (data) => {
        
        return data = {
            product_id: mongoose.Types.ObjectId(data.product_id),
            variantId: mongoose.Types.ObjectId(data.variantId),
            userId: mongoose.Types.ObjectId(data.userId),
            quantity: Number(data.quantity)
        }
    },
    getPriceDetails: (data) => {
        let special_price = 0;
        let real_price = 0;
        let discount = 0;
        let singleProTotal = 0;
        special_price = data.special_price;
        real_price = data.real_price;
        discount = data.real_price - data.special_price
        if(data.special_price){
            singleProTotal = data.quantity * special_price
        }else{
            singleProTotal = data.quantity * real_price
        }
             
        return ({special_price: special_price, real_price: real_price,discount:discount, singleProTotal: singleProTotal})

      if (duplicateVariant != null) {
        return true;
      } else {
        return false;
      }
    },
    checkDuplicateHistory: async (data) => {
        console.log(data);
        let duplicateVariant = await RecentlyViewed.findOne({
          $and: [
            { userId: mongoose.Types.ObjectId(data.userId) },
            { productId: mongoose.Types.ObjectId(data.productId) },
          ],
        });
  
      if (duplicateVariant != null) {
        return true;
      } else {
        return false;
      }
    },
  
    
};
