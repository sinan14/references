const mongoose = require("mongoose");
const moment = require("moment-timezone");

const User = require("../models/user");
const adsReferEarn = require("../models/ads/profile/referEarn");
const UserCard = require("../models/userCard");
const TermsAndCondition = require("../models/usermanagement/termsandcondition");

module.exports = {
  getReferralDetails: async (req, res, next) => {
    try {
      let referImage = await adsReferEarn.aggregate([
        { $match: { isDisabled: false } },
        {
          $project: {
            title: 1,
            image: { $concat: [process.env.BASE_URL, "$image"] },
          },
        },
      ]);

      let referralCode = await User.findOne(
        { _id: mongoose.Types.ObjectId(req.user._id) },
        {
          referralCode: 1,
        }
      );

      // terms and conditions
      let termsConditions = await TermsAndCondition.findOne(
        { type: "ReferAndEarn" },
        { type: 1, description: 1 }
      );

      let response = {
        title: "",
        image: "",
        referralCode: referralCode.referralCode,
        termsConditions: termsConditions
      };

      if (referImage.length) {
        response.title = referImage[0].title;
        response.image = referImage[0].image;
      }

      return res.status(200).json({
        error: false,
        message: "Referral details are",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
  applyReferralCode: async (req, res, next) => {
    try {
      // checking for referral code parameter
      if (!req.body.referralCode) {
        return res.status(200).json({
          error: true,
          message: "referralCode missing",
        });
      }

      // checking whether code is valid or not
      let validCode = await User.findOne({
        referralCode: req.body.referralCode,
      });

      if (!validCode) {
        return res.status(200).json({
          error: true,
          message: "Invalid referral code",
        });
      }

      return res.status(200).json({
        error: false,
        message: "Valid code",
      });
    } catch (error) {
      next(error);
    }
  },
  //swipe card details
  getSwipeCardDetails: async (req, res, next) => {
    try {
      let SwipeCardDetails = await UserCard.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(req.user._id),
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
            customerId: 1,
            userId: 1,
            expDate: 1,
            QrCodeImage: { $concat: [process.env.BASE_URL, "$QrCodeImage"] },
            name: "$user.name",
          },
        },
      ]);

      for (let item of SwipeCardDetails) {
        item.expDate = moment(item.expDate).format("MM/YY");
      }

      return res.status(200).json({
        error: false,
        message: "user swipe card details are",
        data: SwipeCardDetails,
      });
    } catch (error) {
      next(error);
    }
  },
};
