const _ = require("lodash");
const scheduleLib = require("node-schedule");
const moment = require("moment-timezone");

const firebaseAdmin = require("../../helpers/firebase/firebaseAdmin");
const pushNotification = require("../../models/pushNotification/pushNotification");
const Inventory = require("../../models/inventory");
const MasterSubCategoryHealthcare = require("../../models/mastersettings/subCategoryHealthcare");
const LiveUpdate = require("../../models/articleLiveUpdate");
const ArticleCategory = require("../../models/articleCategory");
// const firebaseAdmin = require("./firebaseAdmin");
// const User = require("../models/User");
const schedule = {};
(schedule.createSchedule = async (data, productName) => {
  try {
    if (data.immediate) {
      const chunks = _.chunk(data.fcmIds, 500);
      //   console.log(chunks);
      let promises = chunks.map((u) => {
        const tokens = [];
        u.forEach((item) => {
          if (item) {
            tokens.push(item);
          }
        });
        const payload = {
          tokens,
          title: data.title,
          message: data.message,
          redirectionType: data.redirectionType,
          type: data.type,
          redirectionId: data.redirectionId,
          image: data.image,
          product_name: productName,
        };
        console.log(payload);
        return firebaseAdmin.sendMulticastNotification(payload);
      });
      await Promise.all(promises);
    } else {
      let date = data.date;
      let jobName = data._id.toString();
      scheduleLib.scheduleJob(jobName, date, async () => {
        console.log("cron Worked on", new Date());
        const chunks = _.chunk(data.fcmIds, 500);
        const promises = chunks.map((u) => {
          const tokens = [];
          u.forEach((item) => {
            if (item) {
              tokens.push(item);
            }
          });
          const payload = {
            tokens,
            title: data.title,
            message: data.message,
            redirectionType: data.redirectionType,
            type: data.type,
            image: data.image,
            redirectionId: data.redirectionId,
            product_name: productName,
          };
          return firebaseAdmin.sendMulticastNotification(payload);
        });
        await Promise.all(promises);
      });
    }
  } catch (e) {
    throw e;
  }
}),
  (schedule.reSchedule = async function () {
    try {
      //   console.log(new Date());
      const scheduledNotifications = await pushNotification.find({
        date: { $gte: new Date() },
      });
      //   console.log(scheduledNotifications);
      for (let data of scheduledNotifications) {
        if (data.image) {
          data.image = process.env.BASE_URL.concat(data.image);
        }
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
          console.log(products);

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
        let date = data.date;
        // console.log(moment(new Date()).local().format());
        let jobName = data._id.toString();
        scheduleLib.scheduleJob(jobName, date, async () => {
          console.log("cron Worked on", new Date());
          const chunks = _.chunk(data.fcmIds, 500);
          const promises = chunks.map((u) => {
            const tokens = [];
            u.forEach((item) => {
              if (item) {
                tokens.push(item);
              }
            });
            const payload = {
              tokens,
              title: data.title,
              message: data.message,
              image: data.image,
              redirectionType: data.redirectionType,
              type: data.type,
              redirectionId: data.redirectionId,
              product_name: productName,
            };
            return firebaseAdmin.sendMulticastNotification(payload);
          });
          await Promise.all(promises);
        });
      }
    } catch (e) {
      throw e;
    }
  });
module.exports = schedule;
