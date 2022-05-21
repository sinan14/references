const moment = require("moment-timezone");
const axios = require("axios");
const { createWriteStream } = require("fs");

const extractTextFromHTMLElement = (HTMLString) => {
  return HTMLString.replace(/<[^>]+>/g, " ").replace(/\s\s+/g, " ");
};

const addZeroes = (num) => {
  return num.toFixed(Math.max(((num + "").split(".")[1] || "").length, 2));
};

const convertAllNumberObjectPropertiesToString = (object) => {
  Object.keys(object).forEach((key) => {
    if (typeof object[key] === "number") {
      object[key] = "" + object[key];
    }
  });

  return object;
};

const calculateDeliveryTimeAndDeliveryDateByHours = (deliveryTimeInHours) => {
  let days = Math.floor(deliveryTimeInHours / 24);
  let remainder = deliveryTimeInHours % 24;
  let hours = Math.floor(remainder);

  return {
    deliveryTime: `${
      days
        ? `${days} ${days === 1 ? "day" : "days"} ${
            hours ? `and ${hours} ${hours === 1 ? "hour" : "hours"}` : ""
          }`
        : `${hours} ${hours === 1 ? "hour" : "hours"}`
    }`,
    deliveryDate: moment()
      .add(days, "days")
      .add(hours, "hours")
      .tz(process.env.TIME_ZONE)
      .format("YYYY-MM-DD HH:MM:SS"),
  };
};

const getOrderId = (previousOrderId, previousOrderCreatedAt) => {
  const previousOrderCreatedDayAndMonth = moment(previousOrderCreatedAt)
    .tz(process.env.TIME_ZONE)
    .format("MMDD");
  const previousOrderIdWithoutCount = `F${previousOrderCreatedDayAndMonth}`;

  const previousOrderCount = previousOrderId.replace(
    previousOrderIdWithoutCount,
    ""
  );

  const currentOrderDayAndMonth = moment()
    .tz(process.env.TIME_ZONE)
    .format("MMDD");

  let orderId;

  //if same date increment order count
  let count = parseInt(previousOrderCount) + 1;
  if (!count) count = 1000;
  orderId = `F${currentOrderDayAndMonth}${count}`;

  return orderId;
};

const downloadImage = (url, path) => {
  return new Promise(async (resolve, reject) => {
    await axios({
      url,
      method: "GET",
      responseType: "stream",
    })
      .then((response) => {
        try {
          response.data.pipe(createWriteStream(path)).on(
            "finish",
            resolve({
              status: true,
              message: "Image downloaded successfully",
            })
          );
        } catch (error) {
          resolve({ status: false, message: error });
        }
      })
      .catch((error) => resolve({ status: false, message: error }));
  });
};

module.exports = {
  extractTextFromHTMLElement,
  addZeroes,
  convertAllNumberObjectPropertiesToString,
  calculateDeliveryTimeAndDeliveryDateByHours,
  getOrderId,
  downloadImage,
};
