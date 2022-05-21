const mongoose = require("mongoose");
const moment = require("moment-timezone");
const fs = require("fs");
const scheduleLib = require("node-schedule");

const pushNotification = require("../../models/pushNotification/pushNotification");
const schedule = require("./schedule");
const User = require("../../models/user");

const Inventory = require("../../models/inventory");
const MasterSubCategoryHealthcare = require("../../models/mastersettings/subCategoryHealthcare");
const LiveUpdate = require("../../models/articleLiveUpdate");
const ArticleCategory = require("../../models/articleCategory");

const imgPath = process.env.BASE_URL;
const deleteSchedule = (id) => {
  const list = scheduleLib.scheduledJobs;
  const currentJob = list[id];
  if (currentJob) {
    console.log(currentJob);
    currentJob.cancel();
  }
};
module.exports = {
  addPushNotification: async (req, res, next) => {
    try {
      // console.log(req.body);
      let token = [
        "f2MiZnt1Szmh1Jz-4BXiAy:APA91bGF68poL8PJ45GGmVzzqvLYFb1K5eKvyZEveiGSLGvQBHmKtKzjki1hg3D30bP0tjiWxg9232HNdFnh0acbsXUROjItKDT9Hn-Aj5Bi_BG32U93rRPGbyiP0RcYs6I1Hx54H1GT",
      ];
      if (!req.body.userIds.length) {
        return res.status(200).json({
          status: false,
          data: "No Users Found",
        });
      }
      let userResult = await User.find({ _id: req.body.userIds });
      for (let item of userResult) {
        if (item.fcmId) {
          token.push(item.fcmId);
        }
      }

      if (token.length) {
        let time = req.body.time.split(":");
        //   console.log(new Date());
        let data = {
          segment: req.body.segment,
          fcmIds: token,
          userIds: req.body.userIds,
          time: req.body.time,
          date: moment(req.body.date)
            .tz(process.env.TIME_ZONE)
            .set({ h: parseInt(time[0]), m: time[1], s: 00 })
            .utc()
            .format(),
          title: req.body.title,
          message: req.body.message,
          image: req.body.image,
          redirectionType: req.body.redirectionType,
          type: req.body.type,
          redirectionId: req.body.redirectionId,
          immediate: req.body.immediate,
        };
        if (req.file) {
          data.image = `popup/${req.file.filename}`;
        }
        if (req.body.immediate == "true") {
          data.date = new Date();
        }

        let newObj = new pushNotification(data);
        newObj.save().then(async () => {
          if (newObj.image) {
            newObj.image = process.env.BASE_URL.concat(newObj.image);
          }
          let productName = "";
          if (newObj.type == "product") {
            let products = await Inventory.findOne({
              _id: newObj.redirectionId,
            });
            // console.log(products);

            if (products) {
              productName = products.name;
            } else {
              productName = "";
            }
          }
          if (newObj.type == "category") {
            let products = await MasterSubCategoryHealthcare.findOne({
              _id: newObj.redirectionId,
            });
            // console.log(products);

            if (products) {
              productName = products.title;
            } else {
              productName = "";
            }
          }
          // console.log(productName);
          if (newObj.type == "Live Updates"){
            let liveUpdateResult = await LiveUpdate.findOne({})
            if(liveUpdateResult){
              newObj.redirectionId = liveUpdateResult.category
              let articleResult = await ArticleCategory.findOne({_id:liveUpdateResult.category})
                  if(articleResult){
                    productName = articleResult.name
                  }
            }

          }

          let data = await schedule.createSchedule(newObj, productName);
          res.status(200).json({
            status: true,
            data: "Push Notification added Successfully",
            new: data,
          });
        });
      } else {
        res.status(200).json({
          status: false,
          data: "No FcmIds Found",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getScheduled: async (req, res, next) => {
    try {
      console.log(scheduleLib.scheduledJobs);
      let user = ["6110c4236f0bc52b81535519", "61134d7b7b3b4623336ad465"];
      let result = await User.find({ _id: user });
      console.log(result);

      res.status(200).json({
        status: true,
        data: "Push Notification added Successfully",
      });
    } catch (error) {
      next(error);
    }
  },
  editPushNotification: async (req, res, next) => {
    try {
      let existing = await pushNotification.findOne({ _id: req.params.id });
      if (existing) {
        let token = [
          "f2MiZnt1Szmh1Jz-4BXiAy:APA91bGF68poL8PJ45GGmVzzqvLYFb1K5eKvyZEveiGSLGvQBHmKtKzjki1hg3D30bP0tjiWxg9232HNdFnh0acbsXUROjItKDT9Hn-Aj5Bi_BG32U93rRPGbyiP0RcYs6I1Hx54H1GT",
        ];
        if (!req.body.userIds.length) {
          return res.status(200).json({
            status: false,
            data: "No Users Found",
          });
        }
        let userResult = await User.find({ _id: req.body.userIds });
        for (let item of userResult) {
          if (item.fcmId) {
            token.push(item.fcmId);
          }
        }
        if (token.length) {
          let time = req.body.time.split(":");
          //   console.log(new Date());
          let data = {
            segment: req.body.segment,
            fcmIds: token,
            userIds: req.body.userIds,
            time: req.body.time,
            date: moment(req.body.date)
              .tz(process.env.TIME_ZONE)
              .set({ h: parseInt(time[0]), m: time[1], s: 00 })
              .utc()
              .format(),
            title: req.body.title,
            message: req.body.message,
            redirectionType: req.body.redirectionType,
            type: req.body.type,
            redirectionId: req.body.redirectionId,
            immediate: req.body.immediate,
          };
          if (existing.image) {
            data.image = existing.image;
          }
          if (req.file) {
            data.image = `popup/${req.file.filename}`;
          }
          if (req.body.immediate == "true") {
            data.date = new Date();
          }

          await pushNotification
            .updateOne({ _id: req.params.id }, data)
            .then(async () => {
              let data = await pushNotification.findOne({
                _id: req.params.id,
              });
              let productName = "";
              if (data.type == "product") {
                let products = await Inventory.findOne({
                  _id: data.redirectionId,
                });
                console.log(products);

                if (products) {
                  productName = products.name;
                } else {
                  productName = "";
                }
              }
              if (data.type == "category") {
                let products = await MasterSubCategoryHealthcare.findOne({
                  _id: data.redirectionId,
                });

                if (products) {
                  productName = products.title;
                } else {
                  productName = "";
                }
              }
              if (data.type == "Live Updates"){
                let liveUpdateResult = await LiveUpdate.findOne({})
                if(liveUpdateResult){
                  data.redirectionId = liveUpdateResult.category
                  let articleResult = await ArticleCategory.findOne({_id:liveUpdateResult.category})
                  if(articleResult){
                    productName = articleResult.name
                  }
                }
              }
              console.log(productName);

              deleteSchedule(req.params.id);
              await schedule.createSchedule(data, productName);
              res.status(200).json({
                status: true,
                data: "Push Notification Edited Successfully",
              });
            });
        } else {
          res.status(200).json({
            status: false,
            data: "No FcmId Found",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          data: "Invalid Id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getScheduledByID: async (req, res, next) => {
    try {
      let result = await pushNotification
        .findOne(
          { _id: req.params.id },
          {
            fcmIds: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          }
        )
        .lean();
      if (result.image) {
        result.image = process.env.BASE_URL.concat(result.image);
      }
      res.status(200).json({
        status: true,
        data: {
          result,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getPastScheduledNotification: async (req, res, next) => {
    try {
      let result = await pushNotification
        .find(
          { date: { $lte: new Date() } },
          {
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          }
        ).sort({ _id: -1 })
        .lean();
      res.status(200).json({
        status: true,
        data: {
          result,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  listScheduledNotification: async (req, res, next) => {
    try {
      let result = await pushNotification
        .find(
          { date: { $gte: new Date() } },
          {
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          }
        ).sort({ _id: -1 })
        .lean();
      res.status(200).json({
        status: true,
        data: {
          result,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
