const mongoose = require('mongoose')
const adsMedPride = require("../../models/ads/profile/medPride")
const specialPremiumCrud = require("../../models/premium/specialPriceCrudPremium");
const TermsAndCondition = require("../../models/usermanagement/termsandcondition");
const coupons = require("../../models/coupon/coupon");
const UserAppliedCoupons = require("../../models/cart/userAppliedCoupons");
const PremiumUser = require("../../models/user/premiumUser");


module.exports = {
    getMedpride: async (req, res, next) => {
        try {
            let result = await adsMedPride.aggregate([
                {$match:{ isDisabled: false }},
                {$project: {
                    _id: 0,
                    image: { $concat: [process.env.BASE_URL, "$image"] },
                }}
            ]);

            let premiumPackages = await specialPremiumCrud.find({},{
                name: 1,
                month: 1,
                price: 1,
                specialPrice: 1
            }).lean()

            for(let package of premiumPackages) {
                let discountAmount = package.price - package.specialPrice
                package.offer_percentage = Math.floor((discountAmount/package.price)*100)
            }

            // terms and condition
            let TermsAndConditions = await TermsAndCondition.findOne({
                type: 'Medpride Membership'
            },{
                _id: 0,
                description: 1
            })

            const Type = "Premium Subscription";

            const scratchableAndUpComingCoupons = await coupons.aggregate([
              {
                $match: {
                  type:Type,
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
                  type:1,
                  termsAndCondition:1,
                  percentage:1
                },
              },
            ]);
             //coupon applied discount for med cart
             let userId = req.user._id
      let userAppliedCoupon = await UserAppliedCoupons.aggregate([
        {
          $match: { userId, isCouponApplied: true, couponType: "Premium Subscription" },
        },
        {
          $lookup: {
            from: "coupons",
            localField: "couponId",
            foreignField: "_id",
            as: "coupon",
          },
        },
        {
          $unwind: "$coupon",
        },
        {
          $project: {
            couponId: 1,
            couponType: 1,
            category: "$coupon.category",
            purchaseAmount: "$coupon.purchaseAmount",
            percentage: "$coupon.percentage",
            maximumAmount: "$coupon.maximumAmount",
            to: "$coupon.to",
            code: "$coupon.code",
            name: "$coupon.name",
            termsAndCondition:"$coupon.termsAndCondition"
          },
        },
      ]);

      userAppliedCoupon = userAppliedCoupon[0];
      if (!userAppliedCoupon) {
        userAppliedCoupon ={};
      }
      // premium user checking
      let premiumUser={}
      let premiumUsers = await PremiumUser.findOne({
        userId: req.user._id
    },{
        active:1
    })
    if(premiumUsers){
        if(premiumUsers.active == true){
            premiumUser=true
        }else{
            premiumUser=false
        }
    } else{
        premiumUser=false
    } 
    

            return res.status(200).json({
                error: false,
                message: 'Medpride details are',
                data: {
                    banners: result,
                    premium_packages: premiumPackages,
                    termsAndConditions: TermsAndConditions,
                    scratchableAndUpComingCoupons:scratchableAndUpComingCoupons,
                    userAppliedCoupon:userAppliedCoupon,
                    premiumUser:premiumUser
                }
            });

        } catch (error) {
            next(error);
        }
    },
}