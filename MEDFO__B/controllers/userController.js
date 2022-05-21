const QRCode = require("qrcode");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
var qs = require("querystring");
var http = require("http");

const _ = require("lodash");
const user = require("../models/user");
const otpChecking = require("../models/otpChecking");
const forgotOtpChecking = require("../models/forgotOtpChecking");
const ArticleCategory = require("../models/articleCategory");
const AdsFoliofitSlider1 = require("../models/ads/foliofit/slider1");
const AdsMedfeedSlider1 = require("../models/ads/medfeed/slider1");
const medfeedMainSections = require("../models/medfeedMainSection");
const Articles = require("../models/article");
const HealthcareVideoCategory = require("../models/healthcareVideoCategory");
const HealthcareVideos = require("../models/healthCareVideo");
const Like = require("../models/like");
const Save = require("../models/save");
const AdsMedfeedMainQuizExpert = require("../models/ads/medfeed/mainQuizExpert");
const HealthExpertAdvice = require("../models/healthExpertAdvice");
const healthExpertQnReplay = require("../models/healthExpertQnReplay");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
// const User = require("../models/userModel");
const LiveUpdate = require("../models/articleLiveUpdate");
const DietPlan = require("../models/dietPlan");
const DietDay = require("../models/dietDay");
const foliofitMainSections = require("../models/foliofitMainSection");
const nutrichartCategory = require("../models/nutrichartCategory");
const nutrichartVitamin = require("../models/foliofit/nutrichartVitamin");
const nutrichartCategoryBased = require("../models/foliofit/nutrichartCategoryBased");
const AdsFoliofitBanner = require("../models/ads/foliofit/banner");
const nutrichartFood = require("../models/nutrichartFood");
const healthReminder = require("../models/healthReminder");
const healthCalculator = require("../models/HealthCalculator");
const AdsFoliofitSlider2 = require("../models/ads/foliofit/slider2");
const AdsFoliofitAd1Slider = require("../models/ads/foliofit/ad1slider");
const AdsFoliofitSlider3 = require("../models/ads/foliofit/slider3");
const foliofitHomePage = require("../models/foliofit/foliofitMasterHome");
const FoliofitMasterYogaHome = require("../models/foliofit/foliofitMasterYogaHome");
const AdsFoliofitMainCategory = require("../models/ads/foliofit/mainCategory");
const webBanner = require("../models/ads/web/webBanner");
const AdsSeasonalOfferBudgetStore = require("../models/ads/seasonal-offers/budgetStore");
const MedCoin = require("../models/medcoin/medCoin");
const MedCoinDetails = require("../models/medcoin/medCoinDetails");

const foliofitRating = require("../models/foliofitRating");
const Notification = require("../models/user_notification");
const RecentlyViewed = require("../models/RecentlyViewed");
const cartHelper = require("./cartHelper");
const referalPolicy = require("../models/coupon/referalPolicy");
const referalPolicyStatement = require("../models/coupon/referalPolicyStatment");
const popupBanner = require("../models/customer/popupBanner");
const UserCard = require("../models/userCard");
const cancelOrderReason = require("../models/cancelOrderReason");
const MostPurchasedProduct = require("../models/most/mostPurchasedProducts");
const PackingPending = require("../models/orders/packingPending");
const ReviewPending = require("../models/orders/reviewPending");
const productRating = require("../models/productRating");
const Payments = require("../models/payments/payments");
const { razorpay } = require("../constants/paymentGateways/paymentGateway");

const {
  incrementOrDecrementAdminMedCoinBalance,
  doGetMedCoinDetails,
} = require("./medcoin/medCoinController");

const {
  doGetProductDetailsByProductAndVariantId,
} = require("./orders/orderManagaementController");

const {
  generatePdf,
} = require("../helpers/PDFs/Order-Invoice/generate-pdf-with-puppeteer");

const {
  generateOrderReturnRequestEMailTemplate,
} = require("../email/templates/order");
const {
  generateOrderCancelledEMailTemplate,
} = require("../email/templates/order");
const { sendMail } = require("../email/email");

const moment = require("moment-timezone");

const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const axios = require("axios");
const randomize = require("randomatic");

const nutrichart = "nutrichart";
const imgPath = process.env.BASE_URL;
function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return "few seconds ago";
}

function dynamicSort(property) {
  let sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    let result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}
/* Get Foliofit Home 
============================================= */

const FoliofitMasterFitnessMainHomeFullbodyHealthy = require("../models/foliofit/foliofitMasterFitnessHomeFullbodyHealthy");
const foliofitWeeklyWorkout = require("../models/foliofit/foliofitMasterWeekly");
const AdsHomeYogaFitnessExpert = require("../models/ads/home/yogaFitnessExpert");
//const AdsFoliofitBanner = require("../models/ads/foliofit/banner");
var fitnessTypeBanner = "fitness";
// const AdsFoliofitAd1Slider = require("../models/ads/foliofit/ad1slider");

var fitnessTypeHome = "homeworkouts";
var fitnessTypeFullBody = "fullbodyworkouts";
var fitnessTypeHealthyJourney = "healthyjourney";
var fitnessTypeMain = "maincategory";
// End Get Foliofit Home

/* Get Yoga Home 
============================================= */
const FoliofitMasterYogaMainCategory = require("../models/foliofit/foliofitMasterYogaMain");
const FoliofitMasterYogaHealthyRecommended = require("../models/foliofit/foliofitMasterYogaHealthyRecommended");
const FoliofitTestimonial = require("../models/foliofit/foliofitTestimonial");
const HealthTip = require("../models/healthTip");
const FolifitFitnessClub = require("../models/foliofit/foliofitFitnessClub");
const { response } = require("express");
const yoga = "yoga";
const yogaTypeHealthy = "healthy";
const yogaTypeRecommended = "recommended";
const foliofitType = "foliofit";

// End Get Foliofit Home
const FoliofitMasterYogaWeekly = require("../models/foliofit/foliofitMasterYogaWeekly");
const FoliofitYoga = require("../models/foliofit/foliofitYoga");
const bmiCount = require("../models/bmiCount");
const proCategory = require("../models/proCategory");
const product = require("../models/Product");

/* Master settings - Medimall - categoires
============================================= */
const MasterCategory = require("../models/mastersettings/category");
const MasterSubCategoryHealthcare = require("../models/mastersettings/subCategoryHealthcare");

const AdsMedimallTopIconCatHealth = require("../models/ads/medimall/topIconCatHealth");
const Inventory = require("../models/inventory");
const MasterSubSubCategoryHealthcare = require("../models/mastersettings/subSubCategory");
const MasterUOMValue = require("../models/mastersettings/uomValue");
const AdsMedimallSliderTopWishRecent = require("../models/ads/medimall/sliderTopWishRecent");

const Store = require("../models/store");
const InventoryFavourite = require("../models/inventoryFavourites");
const InventorySuggested = require("../models/inventorySuggested");
const StoreProduct = require("../models/store_products");
const Cart = require("../models/cart");

const UserAddress = require("../models/userAddress");
const AdsProfileAddress = require("../models/ads/profile/address");
const MasterBrand = require("../models/mastersettings/brand");
const MasterSubCategoryMedicine = require("../models/mastersettings/subCategoryMedicine");
const MasterUomValue = require("../models/mastersettings/uomValue");
const MasterUOM = require("../models/mastersettings/uom");

const MasterPolicy = require("../models/mastersettings/masterPolicy");
const MasterDeliveryChargeTime = require("../models/mastersettings/deliveryChargeTime");
const MasterSubSubCategory = require("../models/mastersettings/subSubCategory");
const { insertMany } = require("../models/user");
const mostSearchProduct = require("../models/mostSearchedProducts");
const Order = require("../models/orders/order");
const mostFavouriteProduct = require("../models/inventoryMostFavourite");
const UserSubscription = require("../models/orders/userSubscription");
const { checkIfStockAvailable } = require("./cart/cartController");
const ad1MedFillMedPride = require("../models/ads/profile/ad1MedFill");
const returnOrderReason = require("../models/returnOrderReason");
const returnOrders = require("../models/returnOrders");
const PrescriptionAwaited = require("../models/orders/prescriptionAwaited");
const PaymentAwaited = require("../models/orders/paymentAwaited");
const PickupPending = require("../models/orders/pickupPending");

const {
  validateCancelReason,
} = require("../validations/order/orderValidation");

const {
  validateReturnOrder,
  validateReturnOrderBankDetails,
} = require("../validations/order/returnOrderValidation");

const {
  validateUpdatePrescriptionsOfSubscription,
} = require("../validations/subscription/subscriptionValidation");

var categoryTypeHealth = "healthcare";
const bannerWishlist = "wishlist";
const bannerRecentlist = "recentlyviewed";

let APIKEY = process.env.OTPAPIKEY;
const TwoFactor = new (require("2factor"))(APIKEY);

const createToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return "few seconds ago";
}

function chunkArray(myArray, chunk_size) {
  var results = [];

  while (myArray.length) {
    results.push(myArray.splice(0, chunk_size));
  }

  return results;
}

async function sendOtp(mobile, otp) {
  console.log("in function", mobile, otp);

  let otpOptions = {
    method: "GET",
    hostname: "2factor.in",
    port: null,
    path: `/API/V1/${process.env.OTPAPIKEY}1/SMS/${mobile}/${otp}`,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  };

  let returnFromService;

  let otpReq = await http.request(otpOptions, function (res) {
    let chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      let body = Buffer.concat(chunks);
      console.log("in http", body.toString());

      returnFromService = body.toString();
    });
  });

  await otpReq.write(qs.stringify({}));
  await otpReq.end();

  console.log("before return");
  return returnFromService;
}

module.exports = {
  phoneVerification: async (req, res, next) => {
    // try {
    //   if (req.body.phone) {
    //     if (!req.body.countryCode) {
    //       return res.json({
    //         error: true,
    //         message: 'Country code missing',
    //         data: {}
    //       })
    //     }

    //     let existing = await user.findOne({ phone: req.body.phone, countryCode: req.body.countryCode});

    //     let phoneNumber = req.body.countryCode+req.body.phone

    //     if (!existing) {
    //       if (req.body.phone.length == 10) {
    //         let otp = Math.floor(1000 + Math.random() * 9000);

    //         // TwoFactor.sendOTP(req.body.phone, {
    //         //   otp: otp,
    //         //   template: "MEDIMALL",
    //         // }).then(
    //         //   async (sessionId) => {
    //         //     let tempAdded = await otpChecking.findOne({
    //         //       phone: req.body.phone,
    //         //     });
    //         //     if (tempAdded != null) {
    //         //       otpChecking
    //         //         .updateOne(
    //         //           { phone: req.body.phone },
    //         //           { $set: { otpId: sessionId } }
    //         //         )
    //         //         .then((response) => {
    //         //           res.status(200).json({
    //         //             error: false,
    //         //             message: "OTP has sent to your phone number",
    //         //             data: { mode: 0 },
    //         //           });
    //         //         });
    //         //     } else {
    //         //       let schemaObj = otpChecking({
    //         //         otpId: sessionId,
    //         //         phone: req.body.phone,
    //         //       });
    //         //       schemaObj.save().then((response) => {
    //         //         res.status(200).json({
    //         //           error: false,
    //         //           message: "OTP has sent to your phone number",
    //         //           data: { mode: 0 },
    //         //         });
    //         //       });
    //         //     }
    //         //   },
    //         //   (error) => {
    //         //     res.status(200).json({
    //         //       error: true,
    //         //       message: "" + error,
    //         //       data: { mode: 2 },
    //         //     });
    //         //   }
    //         // );

    //         // ___________ || ** new otp method ** || __________ \\
    //         axios({
    //           url: `http://2factor.in/API/V1/${process.env.OTPAPIKEY}/SMS/${phoneNumber}/${otp}`,
    //           method: "GET",
    //           headers: {
    //             Accept: "application/json",
    //             "Content-Type": "application/x-www-form-urlencoded",
    //           },
    //         })
    //           .then(async (response) => {
    //             console.log("in controller^^^^", response.data);

    //             if (response.data.Status == "Success") {
    //               let tempAdded = await otpChecking.findOne({
    //                 phone: phoneNumber,
    //               });

    //               if (tempAdded != null) {
    //                 otpChecking
    //                   .updateOne(
    //                     { phone: phoneNumber },
    //                     { $set: { otpId: response.data.Details } }
    //                   )
    //                   .then((response) => {
    //                     return res.status(200).json({
    //                       error: false,
    //                       message: "OTP has sent to your phone number",
    //                       data: { mode: 0 },
    //                     });
    //                   });
    //               } else {
    //                 let schemaObj = otpChecking({
    //                   otpId: response.data.Details,
    //                   phone: phoneNumber,
    //                 });
    //                 schemaObj.save().then((response) => {
    //                   return res.status(200).json({
    //                     error: false,
    //                     message: "OTP has sent to your phone number",
    //                     data: { mode: 0 },
    //                   });
    //                 });
    //               }
    //             } else {
    //               return res.status(200).json({
    //                 error: true,
    //                 message: response.data.Details,
    //               });
    //             }
    //           })
    //           .catch((resp) => {
    //             console.log("in catch^^^^", resp.response.data);
    //             return res.status(200).json({
    //               error: true,
    //               message: resp.response.data.Details,
    //               data: { mode: 2 },
    //             });
    //           });
    //       } else {
    //         res.status(200).json({
    //           error: true,
    //           message: "invalid phone number",
    //           data: { mode: 2 },
    //         });
    //       }
    //     } else {
    //       // Normal registered user
    //       if (existing.email && existing.password && existing.name) {
    //         res.status(200).json({
    //           error: false,
    //           message: "Registered user",
    //           data: { mode: 1 },
    //         });
    //       } else {
    //         // Registered user who didn't added profile details(email, password)
    //         let otp = Math.floor(1000 + Math.random() * 9000);

    //         // TwoFactor.sendOTP(req.body.phone, {
    //         //   otp: otp,
    //         //   template: "MEDIMALL",
    //         // }).then(
    //         //   async (sessionId) => {
    //         //     console.log("new otp id", sessionId);
    //         //     let tempAdded = await otpChecking.findOne({
    //         //       phone: req.body.phone,
    //         //     });
    //         //     console.log("temp::", tempAdded);

    //         //     if (tempAdded != null) {
    //         //       otpChecking
    //         //         .updateOne(
    //         //           { phone: req.body.phone },
    //         //           { $set: { otpId: sessionId, isSigningIn: true } }
    //         //         )
    //         //         .then((response) => {
    //         //           res.status(200).json({
    //         //             error: false,
    //         //             message:
    //         //               "OTP has sent to the registered user who didn't updated profile",
    //         //             data: { mode: 0 },
    //         //           });
    //         //         });
    //         //     } else {
    //         //       let schemaObj = otpChecking({
    //         //         otpId: sessionId,
    //         //         phone: req.body.phone,
    //         //         isSigningIn: true,
    //         //       });
    //         //       schemaObj.save().then((response) => {
    //         //         res.status(200).json({
    //         //           error: false,
    //         //           message:
    //         //             "OTP has sent to the registered user who didn't updated profile",
    //         //           data: { mode: 0 },
    //         //         });
    //         //       });
    //         //     }
    //         //   },
    //         //   (error) => {
    //         //     res.status(200).json({
    //         //       error: true,
    //         //       message: "otp error-" + error,
    //         //       data: { mode: 2 },
    //         //     });
    //         //   }
    //         // );

    //         axios({
    //           url: `http://2factor.in/API/V1/${process.env.OTPAPIKEY}/SMS/${phoneNumber}/${otp}`,
    //           method: "GET",
    //           headers: {
    //             Accept: "application/json",
    //             "Content-Type": "application/x-www-form-urlencoded",
    //           },
    //         })
    //           .then(async (response) => {
    //             console.log("new otp id", response.data.Details);

    //             if (response.data.Status === "Success") {
    //               let tempAdded = await otpChecking.findOne({
    //                 phone: phoneNumber,
    //               });
    //               console.log("temp::", tempAdded);

    //               if (tempAdded != null) {
    //                 otpChecking
    //                   .updateOne(
    //                     { phone: phoneNumber },
    //                     {
    //                       $set: {
    //                         otpId: response.data.Details,
    //                         isSigningIn: true,
    //                       },
    //                     }
    //                   )
    //                   .then((response) => {
    //                     return res.status(200).json({
    //                       error: false,
    //                       message:
    //                         "OTP has sent to the registered user who didn't updated profile",
    //                       data: { mode: 0 },
    //                     });
    //                   });
    //               } else {
    //                 let schemaObj = otpChecking({
    //                   otpId: response.data.Details,
    //                   phone: phoneNumber,
    //                   isSigningIn: true,
    //                 });
    //                 schemaObj.save().then((response) => {
    //                   return res.status(200).json({
    //                     error: false,
    //                     message:
    //                       "OTP has sent to the registered user who didn't updated profile",
    //                     data: { mode: 0 },
    //                   });
    //                 });
    //               }
    //             }
    //           })
    //           .catch((resp) => {
    //             console.log("in catch^^^^", resp.response.data);
    //             return res.status(200).json({
    //               error: true,
    //               message: resp.response.data.Details,
    //               data: { mode: 2 },
    //             });
    //           });
    //       }
    //     }
    //   } else {
    //     res.status(200).json({
    //       error: true,
    //       message: "phone number missing",
    //       data: { mode: 2 },
    //     });
    //   }
    // } catch (error) {
    //   next(error);
    // }

    //********************** Function Before Country Code Implementation ****************** *//

    try {
      if (req.body.phone) {
        // if (!req.body.countryCode) {
        //   return res.json({
        //     error: true,
        //     message: 'Country code missing',
        //     data: {}
        //   })
        // }

        let existing = await user.findOne({ phone: req.body.phone });

        if (!existing) {
          if (req.body.phone.length == 10) {
            let otp = Math.floor(1000 + Math.random() * 9000);

            // TwoFactor.sendOTP(req.body.phone, {
            //   otp: otp,
            //   template: "MEDIMALL",
            // }).then(
            //   async (sessionId) => {
            //     let tempAdded = await otpChecking.findOne({
            //       phone: req.body.phone,
            //     });
            //     if (tempAdded != null) {
            //       otpChecking
            //         .updateOne(
            //           { phone: req.body.phone },
            //           { $set: { otpId: sessionId } }
            //         )
            //         .then((response) => {
            //           res.status(200).json({
            //             error: false,
            //             message: "OTP has sent to your phone number",
            //             data: { mode: 0 },
            //           });
            //         });
            //     } else {
            //       let schemaObj = otpChecking({
            //         otpId: sessionId,
            //         phone: req.body.phone,
            //       });
            //       schemaObj.save().then((response) => {
            //         res.status(200).json({
            //           error: false,
            //           message: "OTP has sent to your phone number",
            //           data: { mode: 0 },
            //         });
            //       });
            //     }
            //   },
            //   (error) => {
            //     res.status(200).json({
            //       error: true,
            //       message: "" + error,
            //       data: { mode: 2 },
            //     });
            //   }
            // );

            // ___________ || ** new otp method ** || __________ \\
            axios({
              url: `http://2factor.in/API/V1/${process.env.OTPAPIKEY}/SMS/${req.body.phone}/${otp}`,
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
              },
            })
              .then(async (response) => {
                console.log("in controller^^^^", response.data);

                if (response.data.Status == "Success") {
                  let tempAdded = await otpChecking.findOne({
                    phone: req.body.phone,
                  });

                  if (tempAdded != null) {
                    otpChecking
                      .updateOne(
                        { phone: req.body.phone },
                        { $set: { otpId: response.data.Details } }
                      )
                      .then((response) => {
                        return res.status(200).json({
                          error: false,
                          message: "OTP has sent to your phone number",
                          data: { mode: 0 },
                        });
                      });
                  } else {
                    let schemaObj = otpChecking({
                      otpId: response.data.Details,
                      phone: req.body.phone,
                    });
                    schemaObj.save().then((response) => {
                      return res.status(200).json({
                        error: false,
                        message: "OTP has sent to your phone number",
                        data: { mode: 0 },
                      });
                    });
                  }
                } else {
                  return res.status(200).json({
                    error: true,
                    message: response.data.Details,
                  });
                }
              })
              .catch((resp) => {
                console.log("in catch^^^^", resp.response.data);
                return res.status(200).json({
                  error: true,
                  message: resp.response.data.Details,
                  data: { mode: 2 },
                });
              });
          } else {
            res.status(200).json({
              error: true,
              message: "invalid phone number",
              data: { mode: 2 },
            });
          }
        } else {
          // Normal registered user
          if (existing.email && existing.password && existing.name) {
            res.status(200).json({
              error: false,
              message: "Registered user",
              data: { mode: 1 },
            });
          } else {
            // Registered user who didn't added profile details(email, password)
            let otp = Math.floor(1000 + Math.random() * 9000);

            // TwoFactor.sendOTP(req.body.phone, {
            //   otp: otp,
            //   template: "MEDIMALL",
            // }).then(
            //   async (sessionId) => {
            //     console.log("new otp id", sessionId);
            //     let tempAdded = await otpChecking.findOne({
            //       phone: req.body.phone,
            //     });
            //     console.log("temp::", tempAdded);

            //     if (tempAdded != null) {
            //       otpChecking
            //         .updateOne(
            //           { phone: req.body.phone },
            //           { $set: { otpId: sessionId, isSigningIn: true } }
            //         )
            //         .then((response) => {
            //           res.status(200).json({
            //             error: false,
            //             message:
            //               "OTP has sent to the registered user who didn't updated profile",
            //             data: { mode: 0 },
            //           });
            //         });
            //     } else {
            //       let schemaObj = otpChecking({
            //         otpId: sessionId,
            //         phone: req.body.phone,
            //         isSigningIn: true,
            //       });
            //       schemaObj.save().then((response) => {
            //         res.status(200).json({
            //           error: false,
            //           message:
            //             "OTP has sent to the registered user who didn't updated profile",
            //           data: { mode: 0 },
            //         });
            //       });
            //     }
            //   },
            //   (error) => {
            //     res.status(200).json({
            //       error: true,
            //       message: "otp error-" + error,
            //       data: { mode: 2 },
            //     });
            //   }
            // );

            axios({
              url: `http://2factor.in/API/V1/${process.env.OTPAPIKEY}/SMS/${req.body.phone}/${otp}`,
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
              },
            })
              .then(async (response) => {
                console.log("new otp id", response.data.Details);

                if (response.data.Status === "Success") {
                  let tempAdded = await otpChecking.findOne({
                    phone: req.body.phone,
                  });
                  console.log("temp::", tempAdded);

                  if (tempAdded != null) {
                    otpChecking
                      .updateOne(
                        { phone: req.body.phone },
                        {
                          $set: {
                            otpId: response.data.Details,
                            isSigningIn: true,
                          },
                        }
                      )
                      .then((response) => {
                        return res.status(200).json({
                          error: false,
                          message:
                            "OTP has sent to the registered user who didn't updated profile",
                          data: { mode: 0 },
                        });
                      });
                  } else {
                    let schemaObj = otpChecking({
                      otpId: response.data.Details,
                      phone: req.body.phone,
                      isSigningIn: true,
                    });
                    schemaObj.save().then((response) => {
                      return res.status(200).json({
                        error: false,
                        message:
                          "OTP has sent to the registered user who didn't updated profile",
                        data: { mode: 0 },
                      });
                    });
                  }
                }
              })
              .catch((resp) => {
                console.log("in catch^^^^", resp.response.data);
                return res.status(200).json({
                  error: true,
                  message: resp.response.data.Details,
                  data: { mode: 2 },
                });
              });
          }
        }
      } else {
        res.status(200).json({
          error: true,
          message: "phone number missing",
          data: { mode: 2 },
        });
      }
    } catch (error) {
      next(error);
    }
  },
  verifyOTP: async (req, res, next) => {
    // try {
    //   if (req.body.otp && req.body.phone && req.body.countryCode) {
    //     let phoneNumber = req.body.countryCode + req.body.phone
    //     let tempOtpDetails = await otpChecking.findOne({
    //       phone: phoneNumber,
    //     });
    //     console.log("temp saved::", tempOtpDetails);
    //     TwoFactor.verifyOTP(tempOtpDetails.otpId, req.body.otp).then(
    //       async (response) => {
    //         await otpChecking.deleteOne({ phone: phoneNumber });

    //         if (tempOtpDetails.isSigningIn) {
    //           user
    //             .findOne({ phone: req.body.phone, countryCode: req.body.countryCode })
    //             .then((response) => {
    //               const token = createToken(response._id);
    //               return res.status(200).json({
    //                 error: false,
    //                 message: "Verified",
    //                 data: {
    //                   fcmId: "fcmId",
    //                   token: token,
    //                   name: response.name,
    //                 },
    //               });
    //             })
    //             .catch((error) => {
    //               console.log("response_id", error);
    //               return res.status(200).json({
    //                 error: true,
    //                 message: error + "",
    //                 data: {
    //                   fcmId: "",
    //                   token: "",
    //                 },
    //               });
    //             });
    //           if (req.body.fcmId) {
    //             await user.updateOne(
    //               { phone: req.body.phone, countryCode: req.body.countryCode },
    //               { fcmId: req.body.fcmId }
    //             );
    //           }
    //         } else {
    //           let allUsers = await user.find({ customerId: { $exists: true } });

    //           let newCustomerId = "";

    //           var dateVar = new Date();
    //           let lastTwoDigitsOfYear = dateVar
    //             .getFullYear()
    //             .toString()
    //             .substr(-2);
    //           let twoDigitMonth = ("0" + (dateVar.getMonth() + 1)).slice(-2);

    //           if (allUsers.length) {
    //             let lastUserId = allUsers[allUsers.length - 1].customerId;

    //             // splitted with spaces
    //             let splittedCustomerId = lastUserId.split(" ");
    //             let newCount =
    //               parseInt(splittedCustomerId[splittedCustomerId.length - 1]) +
    //               1;

    //             newCustomerId = `UIN MDFL ${lastTwoDigitsOfYear} ${twoDigitMonth} ${newCount}`;
    //           } else {
    //             newCustomerId = `UIN MDFL ${lastTwoDigitsOfYear} ${twoDigitMonth} 12000`;
    //           }

    //           let schemaObj = user({
    //             countryCode: req.body.countryCode,
    //             phone: req.body.phone,
    //             customerId: newCustomerId,
    //           });

    //           schemaObj
    //             .save()
    //             .then(async (response) => {
    //               const token = createToken(response._id);
    //               let expDate = response.createdAt;
    //               let additionOfYears = 2;
    //               expDate.setFullYear(expDate.getFullYear() + additionOfYears);

    //               const generateQRCode = async (text) => {
    //                 try {
    //                   await QRCode.toFile(
    //                     `public/images/qrCodes/${response.customerId}.png`,
    //                     text
    //                   );
    //                 } catch (error) {
    //                   console.log(error);
    //                 }
    //               };
    //               generateQRCode(
    //                 `http://143.110.240.107:8000/customer/get_user_card_details/${response._id}`
    //               );
    //               let QrCodeImage = `medfeed/qrCodes/${response.customerId}.png`;

    //               let dataObj = UserCard({
    //                 userId: response._id,
    //                 customerId: response.customerId,
    //                 expDate: expDate,
    //                 QrCodeImage: QrCodeImage,
    //               });
    //               dataObj.save();

    //               return res.status(200).json({
    //                 error: false,
    //                 message: "user created",
    //                 data: {
    //                   fcmId: "fcmId",
    //                   token: token,
    //                 },
    //               });
    //             })
    //             .catch((error) => {
    //               return res.status(200).json({
    //                 error: true,
    //                 message: "" + error,
    //                 data: {
    //                   fcmId: "",
    //                   token: "",
    //                 },
    //               });
    //             });
    //         }
    //       },
    //       (error) => {
    //         return res.status(200).json({
    //           error: true,
    //           message: "" + error,
    //           data: {
    //             fcmId: "",
    //             token: "",
    //           },
    //         });
    //       }
    //     );
    //   } else {
    //     return res.status(200).json({
    //       error: true,
    //       message: "otp or mobile number missing",
    //       data: {
    //         fcmId: "",
    //         token: "",
    //       },
    //     });
    //   }
    // } catch (error) {
    //   console.log("error__", error);
    //   return res.status(200).json({
    //     error: true,
    //     message: "Something went wrong",
    //     data: {
    //       fcmId: "",
    //       token: "",
    //     },
    //   });
    // }

    // ****************************** Function Before Country Code ************************** //

    try {
      if (req.body.otp && req.body.phone) {
        let tempOtpDetails = await otpChecking.findOne({
          phone: req.body.phone,
        });
        console.log("temp saved::", tempOtpDetails);
        TwoFactor.verifyOTP(tempOtpDetails.otpId, req.body.otp).then(
          async (response) => {
            await otpChecking.deleteOne({ phone: req.body.phone });

            if (tempOtpDetails.isSigningIn) {
              user
                .findOne({ phone: req.body.phone })
                .then((response) => {
                  const token = createToken(response._id);
                  res.status(200).json({
                    error: false,
                    message: "Verified",
                    data: {
                      fcmId: "fcmId",
                      token: token,
                      name: response.name,
                    },
                  });
                })
                .catch((error) => {
                  console.log("response_id", error);
                  res.status(200).json({
                    error: true,
                    message: error + "",
                    data: {
                      fcmId: "",
                      token: "",
                    },
                  });
                });
              if (req.body.fcmId) {
                await user.updateOne(
                  { phone: req.body.phone },
                  { fcmId: req.body.fcmId }
                );
              }
            } else {
              let allUsers = await user.find({ customerId: { $exists: true } });

              let newCustomerId = "";

              var dateVar = new Date();
              let lastTwoDigitsOfYear = dateVar
                .getFullYear()
                .toString()
                .substr(-2);
              let twoDigitMonth = ("0" + (dateVar.getMonth() + 1)).slice(-2);

              if (allUsers.length) {
                let lastUserId = allUsers[allUsers.length - 1].customerId;

                // splitted with spaces
                let splittedCustomerId = lastUserId.split(" ");
                let newCount =
                  parseInt(splittedCustomerId[splittedCustomerId.length - 1]) +
                  1;

                newCustomerId = `UIN MDFL ${lastTwoDigitsOfYear} ${twoDigitMonth} ${newCount}`;
              } else {
                newCustomerId = `UIN MDFL ${lastTwoDigitsOfYear} ${twoDigitMonth} 12000`;
              }

              let schemaObj = user({
                phone: req.body.phone,
                customerId: newCustomerId,
              });

              schemaObj
                .save()
                .then(async (response) => {
                  const token = createToken(response._id);
                  let expDate = response.createdAt;
                  let additionOfYears = 2;
                  expDate.setFullYear(expDate.getFullYear() + additionOfYears);

                  const generateQRCode = async (text) => {
                    try {
                      await QRCode.toFile(
                        `public/images/qrCodes/${response.customerId}.png`,
                        text
                      );
                    } catch (error) {
                      console.log(error);
                    }
                  };
                  generateQRCode(
                    `http://143.110.240.107:8000/customer/get_user_card_details/${response._id}`
                  );
                  let QrCodeImage = `medfeed/qrCodes/${response.customerId}.png`;

                  let dataObj = UserCard({
                    userId: response._id,
                    customerId: response.customerId,
                    expDate: expDate,
                    QrCodeImage: QrCodeImage,
                  });
                  dataObj.save();

                  res.status(200).json({
                    error: false,
                    message: "user created",
                    data: {
                      fcmId: "fcmId",
                      token: token,
                    },
                  });
                })
                .catch((error) => {
                  res.status(200).json({
                    error: true,
                    message: "" + error,
                    data: {
                      fcmId: "",
                      token: "",
                    },
                  });
                });
            }
          },
          (error) => {
            res.status(200).json({
              error: true,
              message: "" + error,
              data: {
                fcmId: "",
                token: "",
              },
            });
          }
        );
      } else {
        res.status(200).json({
          error: true,
          message: "otp or mobile number missing",
          data: {
            fcmId: "",
            token: "",
          },
        });
      }
    } catch (error) {
      console.log("error__", error);
      return res.status(200).json({
        error: true,
        message: "Something went wrong",
        data: {
          fcmId: "",
          token: "",
        },
      });
    }
  },
  update_profile: async (req, res, next) => {
    try {
      console.log("update_profile__incoming::__", req.body);
      let body = req.body;
      if (body.name && body.email && body.password && body.reEnterPassword) {
        if (body.password.length >= 8) {
          if (body.password === body.reEnterPassword) {
            let existingEmail = await user.findOne({ email: body.email });

            if (!existingEmail) {
              let randomCode = randomize("A0", 4);
              let referralCode = `MDML${randomCode}`;

              let data = {
                name: body.name,
                email: body.email,
                password: body.password,
                referralCode: referralCode,
                fcmId: body.fcmId,
              };

              data.password = await bcrypt.hash(data.password, 12);

              let userDetails = await user.findOne({
                _id: mongoose.Types.ObjectId(req.user._id),
              });
              user
                .updateOne({ phone: userDetails.phone }, data)
                .then(async (response) => {
                  if (response.nModified == 1) {
                    console.log("respo", response);

                    // __ logic for referral code applying __ \\
                    if (req.body.referralCode) {
                      // checking whether it is valid or not
                      let validReferralCode = await user.findOne({
                        referralCode: req.body.referralCode,
                      });

                      if (validReferralCode) {
                        console.log("valid referral code(())");
                        let today = new Date();

                        // finding referral policy
                        let referral_policy = await referalPolicy
                          .find({
                            $and: [
                              { from: { $lte: today } },
                              { to: { $gte: today } },
                            ],
                          })
                          .sort({ _id: -1 });

                        if (referral_policy.length) {
                          referral_policy = referral_policy[0];
                          console.log("referral policy::", referral_policy);

                          let referralbenefitCoin = parseInt(
                            referral_policy.referalUser
                          );

                          let newUserBenefitCoin = parseInt(
                            referral_policy.newUser
                          );

                          if (referral_policy.benefit == "immediate") {
                            // adding med coin to referred user

                            //decrement admin balance

                            await incrementOrDecrementAdminMedCoinBalance(
                              "dec",
                              referralbenefitCoin
                            );

                            //get admin balance

                            const { availableBalance } =
                              (await doGetMedCoinDetails()) || {};

                            const referredUser = await user.findOne({
                              _id: mongoose.Types.ObjectId(
                                validReferralCode._id
                              ),
                            });

                            if (!referredUser.medCoin) {
                              referredUser.medCoin = 0;
                            }

                            //create med coin statement for referred user
                            await MedCoin({
                              medCoinCount: referralbenefitCoin,
                              customerId: validReferralCode._id,
                              type: "refer and earn",
                              balance: availableBalance,
                              customerBalance:
                                referredUser.medCoin + referralbenefitCoin,
                            }).save();

                            user.updateOne(
                              {
                                _id: mongoose.Types.ObjectId(
                                  validReferralCode._id
                                ),
                              },
                              {
                                $inc: {
                                  medCoin: referralbenefitCoin,
                                },
                              }
                            );

                            let referStatement = {
                              policyId: referral_policy._id,
                              newUser: req.user._id,
                              referredId: validReferralCode._id,
                            };
                            let newStat =
                              referalPolicyStatement(referStatement);
                            newStat.save();
                            console.log("in immediate");

                            //update admin med coin balance

                            await incrementOrDecrementAdminMedCoinBalance(
                              "dec",
                              newUserBenefitCoin
                            );

                            const newUser = await user.findOne({
                              _id: mongoose.Types.ObjectId(req.user._id),
                            });

                            //create med coin statement for new user
                            await MedCoin({
                              medCoinCount: newUserBenefitCoin,
                              customerId: req.user._id,
                              type: "refer and earn",
                              balance: availableBalance - newUserBenefitCoin,
                              customerBalance:
                                newUser.medCoin + newUserBenefitCoin,
                            }).save();

                            // adding medcoin to new user
                            user
                              .updateOne(
                                {
                                  _id: mongoose.Types.ObjectId(req.user._id),
                                },
                                {
                                  $inc: {
                                    medCoin: newUserBenefitCoin,
                                  },
                                }
                              )
                              .then((resp) => {
                                return res.status(200).json({
                                  error: false,
                                  message:
                                    "details added | logged in successfully",
                                });
                              });
                          } else {
                            console.log("in first order");
                            user
                              .updateOne(
                                {
                                  _id: mongoose.Types.ObjectId(req.user._id),
                                },
                                {
                                  $set: {
                                    isUserEligibleForReferralFirstOrderCoin: true,
                                    firstOrderMedcoin: referral_policy.newUser,
                                    referredUserId: mongoose.Types.ObjectId(
                                      validReferralCode._id
                                    ),
                                    referredUserMedCoinCount:
                                      referralbenefitCoin,
                                    referralPolicyId: referral_policy._id,
                                  },
                                }
                              )
                              .then((_) => {
                                return res.status(200).json({
                                  error: false,
                                  message:
                                    "details added | logged in successfully",
                                });
                              });
                          }
                        } else {
                          console.log("in not found referral policy");

                          return res.status(200).json({
                            error: false,
                            message: "details added | logged in successfully",
                          });
                        }
                      } else {
                        return res.status(200).json({
                          error: true,
                          message: "Invalid referralCode",
                        });
                      }
                      // __ referral logic ends __ \\
                    } else {
                      console.log("in no incoming referral policy");

                      return res.status(200).json({
                        error: false,
                        message: "details added | logged in successfully",
                      });
                    }
                  } else {
                    return res.status(200).json({
                      error: true,
                      message: "something went wrong",
                    });
                  }
                })
                .catch((error) => {
                  return res.status(200).json({
                    error: true,
                    message: error + "",
                  });
                });
            } else {
              return res.status(200).json({
                error: true,
                message: "Email already exists",
              });
            }
          } else {
            return res.status(200).json({
              error: true,
              message: "confirm password not matched",
            });
          }
        } else {
          return res.status(200).json({
            error: true,
            message: "password should be atleast 8 characters",
          });
        }
      } else {
        return res.status(200).json({
          error: true,
          message: "Please fill all neccessary data",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  signin: async (req, res, next) => {
    // try {
    //   if (req.body.password && req.body.phone && req.body.countryCode) {
    //     let userDetail = await user.findOne({ phone: req.body.phone, countryCode: req.body.countryCode });
    //     if (userDetail) {
    //       let verified = await bcrypt.compare(
    //         req.body.password,
    //         userDetail.password
    //       );
    //       if (verified) {
    //         const token = createToken(userDetail._id);
    //         phone = "";
    //         res.status(200).json({
    //           error: false,
    //           message: "Logged in successfully",
    //           data: {
    //             fcmId: "fcmId",
    //             token: token,
    //             name: userDetail.name,
    //           },
    //         });
    //         if (req.body.fcmId) {
    //           await user.updateOne(
    //             { phone: req.body.phone, countryCode: req.body.countryCode },
    //             { fcmId: req.body.fcmId }
    //           );
    //         }
    //       } else {
    //         res.status(200).json({
    //           error: true,
    //           message: "invalid password",
    //           data: {
    //             fcmId: "",
    //             token: "",
    //           },
    //         });
    //       }
    //     } else {
    //       res.status(200).json({
    //         error: true,
    //         message: "Phone number missing | user not found",
    //         data: {
    //           fcmId: "",
    //           token: "",
    //         },
    //       });
    //     }
    //   } else {
    //     res.status(200).json({
    //       error: true,
    //       message: "Credentials missing",
    //       data: {
    //         fcmId: "",
    //         token: "",
    //       },
    //     });
    //   }
    // } catch (error) {
    //   next(error);
    // }

    // ***************************** Functin Before Country Code ********************* //

    try {
      if (req.body.password && req.body.phone) {
        let userDetail = await user.findOne({ phone: req.body.phone });
        if (userDetail) {
          let verified = await bcrypt.compare(
            req.body.password,
            userDetail.password
          );
          if (verified) {
            const token = createToken(userDetail._id);
            phone = "";
            res.status(200).json({
              error: false,
              message: "Logged in successfully",
              data: {
                fcmId: "fcmId",
                token: token,
                name: userDetail.name,
              },
            });
            if (req.body.fcmId) {
              await user.updateOne(
                { phone: req.body.phone },
                { fcmId: req.body.fcmId }
              );
            }
          } else {
            res.status(200).json({
              error: true,
              message: "invalid password",
              data: {
                fcmId: "",
                token: "",
              },
            });
          }
        } else {
          res.status(200).json({
            error: true,
            message: "Phone number missing | user not found",
            data: {
              fcmId: "",
              token: "",
            },
          });
        }
      } else {
        res.status(200).json({
          error: true,
          message: "Credentials missing",
          data: {
            fcmId: "",
            token: "",
          },
        });
      }
    } catch (error) {
      next(error);
    }
  },
  signinWithOtp: async (req, res, next) => {
    try {
      if (req.body.phone.length == 10) {
        let otp = Math.floor(1000 + Math.random() * 9000);

        // TwoFactor.sendOTP(req.body.phone, {
        //   otp: otp,
        //   template: "MEDIMALL",
        // }).then(
        //   async (sessionId) => {
        //     let tempAdded = await otpChecking.findOne({
        //       phone: req.body.phone,
        //     });

        //     console.log("templLL", tempAdded);
        //     if (tempAdded != null) {
        //       otpChecking
        //         .updateOne(
        //           { phone: req.body.phone },
        //           { $set: { otpId: sessionId, isSigningIn: true } }
        //         )
        //         .then((response) => {
        //           console.log("response:", response);
        //           res.status(200).json({
        //             error: false,
        //             message: "OTP has sent to your phone number",
        //           });
        //         });
        //     } else {
        //       let schemaObj = otpChecking({
        //         otpId: sessionId,
        //         phone: req.body.phone,
        //         isSigningIn: true,
        //       });
        //       schemaObj.save().then((response) => {
        //         console.log("response:", response);
        //         return res.status(200).json({
        //           error: false,
        //           message: "OTP has sent to your phone number",
        //         });
        //       });
        //     }
        //   },
        //   (error) => {
        //     res.status(200).json({
        //       error: true,
        //       message: "otp error-" + error,
        //     });
        //   }
        // );

        // ___________ || ** new otp method ** || __________ \\
        let phoneNumber = req.body.phone;

        axios({
          url: `http://2factor.in/API/V1/${process.env.OTPAPIKEY}/SMS/${phoneNumber}/${otp}`,
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
          .then(async (response) => {
            console.log("in controller^^^^", response.data);
            if (response.data.Status == "Success") {
              let tempAdded = await otpChecking.findOne({
                phone: phoneNumber,
              });

              console.log("templLL", tempAdded);
              if (tempAdded != null) {
                otpChecking
                  .updateOne(
                    { phone: phoneNumber },
                    {
                      $set: { otpId: response.data.Details, isSigningIn: true },
                    }
                  )
                  .then((response) => {
                    console.log("response:", response);
                    res.status(200).json({
                      error: false,
                      message: "OTP has sent to your phone number",
                    });
                  });
              } else {
                let schemaObj = otpChecking({
                  otpId: response.data.Details,
                  phone: phoneNumber,
                  isSigningIn: true,
                });
                schemaObj.save().then((response) => {
                  console.log("response:", response);
                  return res.status(200).json({
                    error: false,
                    message: "OTP has sent to your phone number",
                  });
                });
              }
            } else {
              return res.status(200).json({
                error: true,
                message: response.data.Details,
              });
            }
          })
          .catch((resp) => {
            console.log("in catch^^^^", resp.response.data);
            return res.status(200).json({
              error: true,
              message: resp.response.data.Details,
            });
          });
      } else {
        res.status(200).json({
          error: true,
          message: "Invalid phone number or country code missing",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  forgotSendOtp: async (req, res, next) => {
    // try {
    //   if (req.body.phone && req.body.countryCode) {
    //     let validNumber = await user.findOne({ phone: req.body.phone, countryCode: req.body.countryCode });
    //     if (validNumber) {
    //       let otp = Math.floor(1000 + Math.random() * 9000);
    //       // TwoFactor.sendOTP(req.body.phone, {
    //       //   otp: otp,
    //       //   template: "MEDIMALL",
    //       // }).then(
    //       //   async (sessionId) => {
    //       //     let tempAdded = await forgotOtpChecking.findOne({
    //       //       phone: req.body.phone,
    //       //     });

    //       //     if (tempAdded != null) {
    //       //       forgotOtpChecking
    //       //         .updateOne(
    //       //           { phone: req.body.phone },
    //       //           { $set: { sessionId: sessionId } }
    //       //         )
    //       //         .then((response) => {
    //       //           res.status(200).json({
    //       //             error: false,
    //       //             message: "OTP has sent to your phone number",
    //       //           });
    //       //         });
    //       //     } else {
    //       //       let schemaObj = forgotOtpChecking({
    //       //         sessionId: sessionId,
    //       //         phone: req.body.phone,
    //       //       });
    //       //       schemaObj.save().then((response) => {
    //       //         res.status(200).json({
    //       //           error: false,
    //       //           message: "OTP has sent to your phone number",
    //       //         });
    //       //       });
    //       //     }
    //       //   },
    //       //   (error) => {
    //       //     res.status(200).json({
    //       //       error: true,
    //       //       message: "otp error-" + error,
    //       //     });
    //       //   }
    //       // );

    //       // ___________ || ** new otp method ** || __________ \\
    //       let phoneNumber = req.body.countryCode + req.body.phone
    //       axios({
    //         url: `http://2factor.in/API/V1/${process.env.OTPAPIKEY}/SMS/${phoneNumber}/${otp}`,
    //         method: "GET",
    //         headers: {
    //           Accept: "application/json",
    //           "Content-Type": "application/x-www-form-urlencoded",
    //         },
    //       })
    //         .then(async (response) => {
    //           if (response.data.Status == "Success") {
    //             let tempAdded = await forgotOtpChecking.findOne({
    //               phone: phoneNumber,
    //             });

    //             if (tempAdded != null) {
    //               forgotOtpChecking
    //                 .updateOne(
    //                   { phone: phoneNumber },
    //                   { $set: { sessionId: response.data.Details } }
    //                 )
    //                 .then((response) => {
    //                   return res.status(200).json({
    //                     error: false,
    //                     message: "OTP has sent to your phone number",
    //                   });
    //                 });
    //             } else {
    //               let schemaObj = forgotOtpChecking({
    //                 sessionId: response.data.Details,
    //                 phone: phoneNumber,
    //               });
    //               schemaObj.save().then((response) => {
    //                 return res.status(200).json({
    //                   error: false,
    //                   message: "OTP has sent to your phone number",
    //                 });
    //               });
    //             }
    //           } else {
    //             return res.status(200).json({
    //               error: true,
    //               message: response.data.Details,
    //             });
    //           }
    //         })
    //         .catch((resp) => {
    //           console.log("in catch^^^^", resp.response.data);
    //           return res.status(200).json({
    //             error: true,
    //             message: resp.response.data.Details,
    //           });
    //         });
    //     } else {
    //       return res.status(200).json({
    //         error: true,
    //         message: "invalid phone number",
    //       });
    //     }
    //   } else {
    //     res.status(200).json({
    //       error: true,
    //       message: "Phone number missing",
    //     });
    //   }
    // } catch (error) {
    //   next(error);
    // }

    // ***************************** Function Before Country Code ************************* //

    try {
      if (req.body.phone) {
        let validNumber = await user.findOne({ phone: req.body.phone });
        if (validNumber) {
          let otp = Math.floor(1000 + Math.random() * 9000);
          // TwoFactor.sendOTP(req.body.phone, {
          //   otp: otp,
          //   template: "MEDIMALL",
          // }).then(
          //   async (sessionId) => {
          //     let tempAdded = await forgotOtpChecking.findOne({
          //       phone: req.body.phone,
          //     });

          //     if (tempAdded != null) {
          //       forgotOtpChecking
          //         .updateOne(
          //           { phone: req.body.phone },
          //           { $set: { sessionId: sessionId } }
          //         )
          //         .then((response) => {
          //           res.status(200).json({
          //             error: false,
          //             message: "OTP has sent to your phone number",
          //           });
          //         });
          //     } else {
          //       let schemaObj = forgotOtpChecking({
          //         sessionId: sessionId,
          //         phone: req.body.phone,
          //       });
          //       schemaObj.save().then((response) => {
          //         res.status(200).json({
          //           error: false,
          //           message: "OTP has sent to your phone number",
          //         });
          //       });
          //     }
          //   },
          //   (error) => {
          //     res.status(200).json({
          //       error: true,
          //       message: "otp error-" + error,
          //     });
          //   }
          // );

          // ___________ || ** new otp method ** || __________ \\
          axios({
            url: `http://2factor.in/API/V1/${process.env.OTPAPIKEY}/SMS/${req.body.phone}/${otp}`,
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
            .then(async (response) => {
              if (response.data.Status == "Success") {
                let tempAdded = await forgotOtpChecking.findOne({
                  phone: req.body.phone,
                });

                if (tempAdded != null) {
                  forgotOtpChecking
                    .updateOne(
                      { phone: req.body.phone },
                      { $set: { sessionId: response.data.Details } }
                    )
                    .then((response) => {
                      return res.status(200).json({
                        error: false,
                        message: "OTP has sent to your phone number",
                      });
                    });
                } else {
                  let schemaObj = forgotOtpChecking({
                    sessionId: response.data.Details,
                    phone: req.body.phone,
                  });
                  schemaObj.save().then((response) => {
                    return res.status(200).json({
                      error: false,
                      message: "OTP has sent to your phone number",
                    });
                  });
                }
              } else {
                return res.status(200).json({
                  error: true,
                  message: response.data.Details,
                });
              }
            })
            .catch((resp) => {
              console.log("in catch^^^^", resp.response.data);
              return res.status(200).json({
                error: true,
                message: resp.response.data.Details,
              });
            });
        } else {
          return res.status(200).json({
            error: true,
            message: "invalid phone number",
          });
        }
      } else {
        res.status(200).json({
          error: true,
          message: "Phone number missing",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  resetPassword: async (req, res, next) => {
    // try {
    //   if (
    //     req.body.otp &&
    //     req.body.phone &&
    //     req.body.countryCode &&
    //     req.body.new_password &&
    //     req.body.confirm_new_password
    //   ) {

    //     let phoneNumber = req.body.countryCode + req.body.phone

    //     let tempOtpDetails = await forgotOtpChecking.findOne({
    //       phone: phoneNumber,
    //     });
    //     TwoFactor.verifyOTP(tempOtpDetails.sessionId, req.body.otp).then(
    //       async (response) => {
    //         console.log("verified::::");
    //         await forgotOtpChecking.deleteOne({ phone: phoneNumber });

    //         let data = req.body;

    //         if (data.new_password.length >= 8) {
    //           if (data.new_password == data.confirm_new_password) {
    //             let newPassword = await bcrypt.hash(data.new_password, 12);

    //             user
    //               .updateOne(
    //                 { phone: req.body.phone, countryCode: req.body.countryCode },
    //                 { $set: { password: newPassword } }
    //               )
    //               .then(async (response) => {
    //                 user
    //                   .findOne({ phone: req.body.phone, countryCode: req.body.countryCode })
    //                   .then((response) => {
    //                     const token = createToken(response._id);
    //                     return res.status(200).json({
    //                       error: false,
    //                       message: "Password changed",
    //                       data: {
    //                         fcmId: "fcmId",
    //                         token: token,
    //                       },
    //                     });
    //                   })
    //                   .catch((error) => {
    //                     return res.status(200).json({
    //                       error: true,
    //                       message: error + "",
    //                       data: {
    //                         fcmId: "",
    //                         token: "",
    //                       },
    //                     });
    //                   });
    //                 if (req.body.fcmId) {
    //                   await user.updateOne(
    //                     { phone: req.body.phone, countryCode: req.body.countryCode },
    //                     { fcmId: req.body.fcmId }
    //                   );
    //                 }
    //               })
    //               .catch((error) => {
    //                 res.status(200).json({
    //                   error: true,
    //                   message: error + "",
    //                   data: {
    //                     fcmId: "",
    //                     token: "",
    //                   },
    //                 });
    //               });
    //           } else {
    //             res.status(200).json({
    //               error: true,
    //               message: "confirm password not matched",
    //               data: {
    //                 fcmId: "",
    //                 token: "",
    //               },
    //             });
    //           }
    //         } else {
    //           res.status(200).json({
    //             error: true,
    //             message: "password should be atleast 8 characters",
    //             data: {
    //               fcmId: "",
    //               token: "",
    //             },
    //           });
    //         }
    //       },
    //       (error) => {
    //         res.status(200).json({
    //           error: true,
    //           message: "" + error,
    //           data: {
    //             fcmId: "",
    //             token: "",
    //           },
    //         });
    //       }
    //     );
    //   } else {
    //     res.status(200).json({
    //       error: true,
    //       message: "Neccessary details missing",
    //       data: {
    //         fcmId: "",
    //         token: "",
    //       },
    //     });
    //   }
    // } catch (error) {
    //   next(error);
    // }

    // *************************** Function Before Country Code **************************** //

    try {
      if (
        req.body.otp &&
        req.body.phone &&
        req.body.new_password &&
        req.body.confirm_new_password
      ) {
        let tempOtpDetails = await forgotOtpChecking.findOne({
          phone: req.body.phone,
        });
        TwoFactor.verifyOTP(tempOtpDetails.sessionId, req.body.otp).then(
          async (response) => {
            console.log("verified::::");
            await forgotOtpChecking.deleteOne({ phone: req.body.phone });

            let data = req.body;

            if (data.new_password.length >= 8) {
              if (data.new_password == data.confirm_new_password) {
                let newPassword = await bcrypt.hash(data.new_password, 12);

                user
                  .updateOne(
                    { phone: req.body.phone },
                    { $set: { password: newPassword } }
                  )
                  .then(async (response) => {
                    user
                      .findOne({ phone: req.body.phone })
                      .then((response) => {
                        const token = createToken(response._id);
                        res.status(200).json({
                          error: false,
                          message: "Password changed",
                          data: {
                            fcmId: "fcmId",
                            token: token,
                          },
                        });
                      })
                      .catch((error) => {
                        res.status(200).json({
                          error: true,
                          message: error + "",
                          data: {
                            fcmId: "",
                            token: "",
                          },
                        });
                      });
                    if (req.body.fcmId) {
                      await user.updateOne(
                        { phone: req.body.phone },
                        { fcmId: req.body.fcmId }
                      );
                    }
                  })
                  .catch((error) => {
                    res.status(200).json({
                      error: true,
                      message: error + "",
                      data: {
                        fcmId: "",
                        token: "",
                      },
                    });
                  });
              } else {
                res.status(200).json({
                  error: true,
                  message: "confirm password not matched",
                  data: {
                    fcmId: "",
                    token: "",
                  },
                });
              }
            } else {
              res.status(200).json({
                error: true,
                message: "password should be atleast 8 characters",
                data: {
                  fcmId: "",
                  token: "",
                },
              });
            }
          },
          (error) => {
            res.status(200).json({
              error: true,
              message: "" + error,
              data: {
                fcmId: "",
                token: "",
              },
            });
          }
        );
      } else {
        res.status(200).json({
          error: true,
          message: "Neccessary details missing",
          data: {
            fcmId: "",
            token: "",
          },
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getExpertAdviceWithBanner: async (req, res, next) => {
    try {
      let banner = await AdsMedfeedMainQuizExpert.aggregate([
        { $match: { sliderType: "expertadvise" } },
        {
          $project: { id: "$_id", image: 1 },
        },
      ]);

      if (banner.length) {
        delete banner[0]._id;
        banner[0].image = process.env.BASE_URL.concat(banner[0].image);
      }
      let health_advice = await HealthExpertAdvice.aggregate([
        {
          $project: {
            id: "$_id",
            question: 1,
            // userId: 1,
            posted_on: "$createdAt",
            type: "advice",
            user_pic: "$userImage",
            posted_by: "$userName",
          },
        },
      ]);
      let user = req.user._id;
      let count = await HealthExpertAdvice.countDocuments({
        userId: mongoose.Types.ObjectId(user),
      });
      console.log("health advice", health_advice);
      for (j = 0; j < health_advice.length; j++) {
        if (health_advice[j].user_pic) {
          health_advice[j].user_pic = process.env.BASE_URL.concat(
            health_advice[j].user_pic
          );
        }

        delete health_advice[j]._id;
        health_advice[j].like_count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(health_advice[j].id),
        });
        // result[j] = result[j].toJSON();
        // is added wishlist (liked)
        let isLiked = await Like.findOne({
          type: "advice",
          contentId: mongoose.Types.ObjectId(health_advice[j].id),
          userId: req.user._id,
        });

        console.log(j, "q isliked:", isLiked);

        if (isLiked) {
          health_advice[j].is_liked = 1;
        } else {
          health_advice[j].is_liked = 0;
        }

        let since = timeSince(health_advice[j].posted_on);

        health_advice[j].posted_on = since;
        let objdata = await healthExpertQnReplay.aggregate([
          {
            $match: {
              question_id: mongoose.Types.ObjectId(health_advice[j].id),
            },
          },
          {
            $project: {
              reply_id: "$_id",
              answer: "$reply",
              replied_by: "$repliedBy",
              replay_posted_on: "$createdAt",
              reply_type: "adviceReply",
              // posted_by: "$userId",
              image: 1,
            },
          },
        ]);

        // health_advice_replay.push(objdata);
        if (objdata.length) {
          delete objdata[0]._id;

          objdata[0].reply_like_count = await Like.countDocuments({
            contentId: mongoose.Types.ObjectId(objdata[0].reply_id),
          });
          console.log("count_replay@@@@@@", objdata[0].reply_like_count);

          // result[j] = result[j].toJSON();
          // is added wishlist (liked)
          var reply_isLiked = await Like.findOne({
            type: "adviceReply",
            contentId: mongoose.Types.ObjectId(objdata[0].reply_id),
            userId: req.user._id,
          });
          console.log("replay_isLiked", reply_isLiked);
          if (reply_isLiked) {
            objdata[0].reply_isLiked = 1;
          } else {
            objdata[0].reply_isLiked = 0;
          }
          if (objdata[0].image) {
            health_advice[j].admin_image = process.env.BASE_URL.concat(
              objdata[0].image
            );
          } else {
            health_advice[j].admin_image =
              process.env.BASE_URL.concat("medfeed/head.jpeg");
          }
          let time = timeSince(objdata[0].replay_posted_on);

          health_advice[j].replay_posted_on = time;
          // health_advice_replay.push(count_replay,replay_isLiked)
          health_advice[j].answer = objdata[0].answer;
          health_advice[j].replied_by = objdata[0].replied_by;
          // health_advice[j].reply_posted_on = objdata[0].replay_posted_on
          health_advice[j].reply_like_count = objdata[0].reply_like_count;
          health_advice[j].reply_isLiked = objdata[0].reply_isLiked;
          health_advice[j].reply_id = objdata[0].reply_id;
          health_advice[j].reply_type = objdata[0].reply_type;
        }
      }
      // let health_advice = await HealthExpertAdvice.aggregate([
      //   {
      //     $project: {
      //       id: "$_id",
      //       question: 1,
      //       answer: "$reply",
      //       replied_by: "$repliedBy",
      //       posted_by: "$userId",
      //       posted_on: "$createdAt",
      //     },
      //   },
      // ]);

      // console.log("health_advice", health_advice);
      // console.log("rrrr", req.user);
      // for (j = 0; j < health_advice.length; j++) {
      //   delete health_advice[j]._id;
      //   let count = await Like.countDocuments({
      //     contentId: mongoose.Types.ObjectId(health_advice[j]._id),
      //   });
      //   // health_advice[j] = health_advice[j].toJSON();
      //   health_advice[j].like_count = count;
      //   console.log("health_advice[111]", health_advice[j]);
      //   // is added wishlist (liked)
      //   let isLiked = await Like.findOne({
      //     type: "advice",
      //     contentId: mongoose.Types.ObjectId(health_advice[j]._id),
      //     userId: req.user._id,
      //   });

      //   if (isLiked) {
      //     health_advice[j].is_liked = 1;
      //   } else {
      //     health_advice[j].is_liked = 0;
      //   }
      //   let user = await User.findOne({
      //     _id: mongoose.Types.ObjectId(health_advice[j].posted_by),
      //   });
      //   console.log("user", user);
      //   if (health_advice[j].user_pic) {
      //     health_advice[j].user_pic = process.env.BASE_URL.concat(user.image);
      //   } else {
      //     health_advice[j].user_pic = "./public/images/default/user_pic.jpg";
      //   }

      //   health_advice[j].posted_by = user.name;
      // }

      res.status(200).json({
        error: false,
        message: "success",
        data: {
          banner: banner[0],
          health_advice: health_advice.reverse(),
          count,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getHealthCareVideoCategories: async (req, res, next) => {
    try {
      let mainCategories = await HealthcareVideoCategory.find(
        { parent: "main" },
        { name: 1 }
      );

      console.log("main cats:", mainCategories);

      let structure = [];

      for (i = 0; i < mainCategories.length; i++) {
        let subCategories = await HealthcareVideoCategory.find(
          { parent: mongoose.Types.ObjectId(mainCategories[i]._id) },
          { name: 1, image: 1 }
        );

        for (j = 0; j < subCategories.length; j++) {
          subCategories[j].image = process.env.BASE_URL.concat(
            subCategories[j].image
          );
        }

        let splittedArray = chunkArray(subCategories, 3);

        mainCategories[i] = mainCategories[i].toJSON();
        mainCategories[i].sub_category = splittedArray;

        structure.push(mainCategories[i]);
      }

      res.status(200).json({
        error: false,
        message: "success",
        data: { category: structure },
      });
    } catch (error) {
      next(error);
    }
  },
  medfeedHome: async (req, res, next) => {
    try {
      // Bookmark Count
      let bookmarkCount = await Save.countDocuments({
        userId: mongoose.Types.ObjectId(req.user._id),
      });
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
                { type: "medfeed" },
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
          { $sort: { _id: -1 } },
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
      // Banner *******
      let banner = await AdsMedfeedSlider1.find(
        {},
        {
          isDisabled: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        }
      );

      banner.map((e, i) => {
        e.image = process.env.BASE_URL.concat(e.image);
        e = e.toJSON();
        e.redirection_id = 0;
      });

      // Main Sections *******
      let mainSections = await AdsMedfeedMainQuizExpert.find(
        { sliderType: "maincategory", isDisabled: false },
        {
          image: { $concat: [imgPath, "$image"] },
        }
      ).lean();
      let newArray = [];
      if (mainSections.length) {
        newArray = mainSections.slice(0, 4);
        let liveUpdateImage = await LiveUpdate.find(
          {},
          {
            image: { $concat: [imgPath, "$image"] },
          }
        ).lean();
        newArray.push(liveUpdateImage[0]);
        newArray.push(mainSections[4]);
        console.log("@@@@@@@@@@@@@22", newArray);
        for (let item of newArray) {
          console.log("@@@", item);
          delete item._id;
          item.name = "";
        }
      }
      let liveUpdate = await LiveUpdate.find().populate({
        path: "category",
        select: ["_id", "name"],
      });
      // mainSections.map((e, i) => {
      //     // e.image = process.env.BASE_URL.concat(e.image);
      //     delete e._id
      //     // if (e.name == "Live Updates") {
      //     //     e.image = process.env.BASE_URL.concat(liveUpdate[0].image);
      //     // }
      // });

      // liveUpdate[0].category_id = liveUpdate[0]._id
      // liveUpdate[0].category_name = liveUpdate[0].name

      // delete liveUpdate[0]._id
      // delete liveUpdate[0].name

      // Articles *******
      let categories = await ArticleCategory.find(
        { homepage: true },
        {
          isDisabled: 0,
          parent: 0,
          homepage: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        }
      );

      let ids = [];

      categories.map((e, i) => {
        ids.push(e._id + "");
      });

      let structure = [];
      let videoStructure = [];

      //articles
      for (i = 0; i < ids.length; i++) {
        let articles = await Articles.find(
          { categories: ids[i] },
          {
            _id: 1,
            heading: 1,
            readTime: 1,
            createdAt: 1,
            image: 1,
          }
        );
        articles.reverse();

        if (articles.length) {
          articles = articles.slice(0, 3);
          let category = await ArticleCategory.findOne(
            { _id: mongoose.Types.ObjectId(ids[i]) },
            {
              _id: 1,
              name: 1,
              parent: 1,
            }
          ).lean();

          if (category.parent != "main") {
            let maincategory = await ArticleCategory.findOne({
              _id: mongoose.Types.ObjectId(category.parent),
            });

            category.maincategory_id = maincategory._id;
            category.maincategory_name = maincategory.name;
          }

          delete category.parent;

          for (j = 0; j < articles.length; j++) {
            let count = await Like.countDocuments({
              contentId: mongoose.Types.ObjectId(articles[j]._id),
            });
            articles[j] = articles[j].toJSON();
            articles[j].like_count = count;

            let isSaved = await Save.findOne({
              type: "article",
              contentId: mongoose.Types.ObjectId(articles[j]._id),
              userId: req.user._id,
            });

            if (isSaved) {
              articles[j].is_saved = 1;
            } else {
              articles[j].is_saved = 0;
            }

            // is liked
            let isLiked = await Like.findOne({
              type: "article",
              contentId: mongoose.Types.ObjectId(articles[j]._id),
              userId: req.user._id,
            });

            if (isLiked) {
              articles[j].is_liked = 1;
            } else {
              articles[j].is_liked = 0;
            }

            articles[j].image = process.env.BASE_URL.concat(articles[j].image);

            articles[j].title = articles[j].heading;
            delete articles[j].heading;

            articles[j].type = "article";

            let since = timeSince(articles[j].createdAt);

            articles[j].createdAt = since;
          }

          let temp = category;
          console.log("articles::", articles);
          temp.article_list = articles;

          structure.push(temp);
        }
      }

      //videos
      let videoCategories = await HealthcareVideoCategory.find(
        { homepage: true },
        {
          name: 1,
        }
      );

      let videoIds = [];

      videoCategories.map((e, i) => {
        videoIds.push(e._id + "");
      });

      for (i = 0; i < videoIds.length; i++) {
        let healthcareVideos = await HealthcareVideos.find(
          { subCategories: { $in: [videoIds[i]] } },
          {
            subCategories: 0,
            homepageMain: 0,
            homepageSub: 0,
            updatedAt: 0,
            __v: 0,
          }
        );
        healthcareVideos.reverse();

        if (healthcareVideos.length) {
          console.log("id:", ids[i]);
          healthcareVideos = healthcareVideos.slice(0, 3);
          let videoCategory = await HealthcareVideoCategory.findOne(
            { _id: mongoose.Types.ObjectId(videoIds[i]) },
            {
              _id: 1,
              name: 1,
              parent: 1,
            }
          ).lean();

          if (videoCategory.parent != "main") {
            let maincategory = await HealthcareVideoCategory.findOne({
              _id: mongoose.Types.ObjectId(videoCategory.parent),
            });

            videoCategory.maincategory_id = maincategory._id;
            videoCategory.maincategory_name = maincategory.name;
          }

          delete videoCategory.parent;

          for (j = 0; j < healthcareVideos.length; j++) {
            let count = await Like.countDocuments({
              contentId: mongoose.Types.ObjectId(healthcareVideos[j]._id),
            });
            healthcareVideos[j] = healthcareVideos[j].toJSON();
            healthcareVideos[j].like_count = count;

            let isSaved = await Save.findOne({
              type: "healthcareVideo",
              contentId: mongoose.Types.ObjectId(healthcareVideos[j]._id),
              userId: req.user._id,
            });

            if (isSaved) {
              healthcareVideos[j].is_saved = 1;
            } else {
              healthcareVideos[j].is_saved = 0;
            }

            // is liked
            let isLiked = await Like.findOne({
              type: "healthcareVideo",
              contentId: mongoose.Types.ObjectId(healthcareVideos[j]._id),
              userId: req.user._id,
            });

            if (isLiked) {
              healthcareVideos[j].is_liked = 1;
            } else {
              healthcareVideos[j].is_liked = 0;
            }

            healthcareVideos[j].type = "healthcareVideo";

            let since = timeSince(healthcareVideos[j].createdAt);

            healthcareVideos[j].createdAt = since;

            healthcareVideos[j].title = healthcareVideos[j].name;
            delete healthcareVideos[j].name;

            healthcareVideos[j].thumbnail = process.env.BASE_URL.concat(
              healthcareVideos[j].thumbnail
            );
          }

          console.log("cate:", videoCategory);

          let temp = videoCategory;
          temp.videos_list = healthcareVideos;

          videoStructure.push(temp);
        }
      }

      let data = {
        PopupBanner: PopupBanner,
        bookmark_count: bookmarkCount,
        banner: banner,
        articles: structure,
        health_videos: videoStructure,
      };
      if (newArray.length) {
        data.category = newArray;
      } else {
        data.category = [];
      }
      if (liveUpdate.length) {
        data.live_updates = liveUpdate[0].category;
      } else {
        data.live_updates = {};
      }

      // let articles = await Articles.find({ categories:{ $elemMatch: {$in:array}}})
      // console.log('aa',articles)
      res.status(200).json({
        message: "success",
        error: false,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
  getMedcoinCount: async (req, res, next) => {
    try {
      let medCoin = await user.findOne({ _id: req.user._id }, { medCoin: 1 });
      res.status(200).json({
        status: true,
        data: medCoin,
      });
    } catch (error) {
      next(error);
    }
  },
  getFoliofitHome: async (req, res, next) => {
    try {
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
                { type: "foliofit" },
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
          { $sort: { _id: -1 } },
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
      // Fetching ads slider 1
      let foliofitSlider1 = await AdsFoliofitSlider1.aggregate([
        {
          $project: {
            id: "$_id",
            image: 1,
            type: 1,
            redirection_title: "$redirectTo",
          },
        },
      ]);
      foliofitSlider1.map((e, i) => {
        e.image = process.env.BASE_URL.concat(e.image);
        // e.redirection_id = 0;
        delete e._id;
      });

      // Foliofit main sections
      let mainSections = await AdsFoliofitMainCategory.aggregate([
        {
          $project: {
            category_id: "$_id",
            category_name: "$name",
            cat_image: "$image",
          },
        },
      ]);

      mainSections.map((e, i) => {
        e.cat_image = process.env.BASE_URL.concat(e.cat_image);
        delete e._id;
      });
      // Fetching ads slider 2

      let foliofitSlider2 = await AdsFoliofitSlider2.aggregate([
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
            id: "$_id",
            type: "$type",
            redirection_id: "$typeId",
            image: { $concat: [imgPath, "$image"] },
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
      ]).sort("-updatedAt");
      for (i = 0; i < foliofitSlider2.length; i++) {
        delete foliofitSlider2[i]._id;

        if (foliofitSlider2[i].typeName1) {
          foliofitSlider2[i].redirection_title = foliofitSlider2[i].typeName1;
          delete foliofitSlider2[i].typeName1;
        } else if (foliofitSlider2[i].typeName2) {
          foliofitSlider2[i].redirection_title = foliofitSlider2[i].typeName2;
          delete foliofitSlider2[i].typeName2;
        } else {
          foliofitSlider2[i].redirection_title = "";
        }
      }
      // let foliofitSlider2 = await AdsFoliofitSlider2.aggregate([
      //   {
      //     $project: {
      //       id: "$_id",
      //       type: "$type",
      //       redirection_id: "$typeId",
      //       image: "$image",
      //     },
      //   },
      // ]);

      // if (foliofitSlider2.length) {
      //   for (i = 0; i < foliofitSlider2.length; i++) {
      //     if (foliofitSlider2[i].type == 0) {
      //       let result1 = await Inventory.findOne(
      //         {
      //           _id: mongoose.Types.ObjectId(foliofitSlider2[i].redirection_id),
      //         },
      //         { title: 1 }
      //       );
      //       if (result1) {
      //         foliofitSlider2[i].redirection_title = result1.title;
      //       }else{
      //         foliofitSlider2[i].redirection_title = ''
      //       }
      //     } else if((foliofitSlider2[i].type == 1)){
      //       let result2 = await proCategory.findOne(
      //         {
      //           _id: mongoose.Types.ObjectId(foliofitSlider2[i].redirection_id),
      //         },
      //         { title: 1 }
      //       );
      //       if (result2) {
      //         foliofitSlider2[i].redirection_title = result2.title;
      //       }else{
      //         foliofitSlider2[i].redirection_title = ''
      //       }
      //     }else{
      //       foliofitSlider2[i].redirection_title = ''
      //     }

      //   }
      // }
      // foliofitSlider2.map((e, i) => {
      //   e.image = process.env.BASE_URL.concat(e.image);
      //   // e.redirection_id = 0;
      //   delete e._id;
      // });

      // Fetching ads ad 1
      let foliofitAd1 = await AdsFoliofitAd1Slider.aggregate([
        {
          $match: {
            sliderType: "ad1",
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
            type: "$type",
            id: "$_id",
            redirection_id: "$typeId",
            image: { $concat: [imgPath, "$image"] },
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
      ]).sort("-updatedAt");
      for (i = 0; i < foliofitAd1.length; i++) {
        delete foliofitAd1[i]._id;

        if (foliofitAd1[i].typeName1) {
          foliofitAd1[i].redirection_title = foliofitAd1[i].typeName1;
          delete foliofitAd1[i].typeName1;
        } else if (foliofitAd1[i].typeName2) {
          foliofitAd1[i].redirection_title = foliofitAd1[i].typeName2;
          delete foliofitAd1[i].typeName2;
        } else {
          foliofitAd1[i].redirection_title = "";
        }
      }
      // let foliofitAd1 = await AdsFoliofitAd1Slider.aggregate([
      //   {
      //     $match: {
      //       sliderType: "ad1",
      //     },
      //   },
      //   {
      //     $project: {
      //       type: "$type",
      //       id: "$_id",
      //       redirection_id: "$typeId",
      //       image: "$image",
      //     },
      //   },
      // ]);
      // if (foliofitAd1.length) {
      //   for (i = 0; i < foliofitAd1.length; i++) {
      //     if (foliofitAd1[i].type == 0) {
      //       let result5 = await Inventory.findOne(
      //         { _id: mongoose.Types.ObjectId(foliofitAd1[i].redirection_id) },
      //         { title: 1 }
      //       );
      //       if (result5) {
      //         foliofitAd1[i].redirection_title = result5.title;
      //       }else{
      //         foliofitAd1[i].redirection_title = ''
      //       }
      //     } else if (foliofitAd1[i].type == 1){
      //       let result6 = await proCategory.findOne(
      //         { _id: mongoose.Types.ObjectId(foliofitAd1[i].redirection_id) },
      //         { title: 1 }
      //       );
      //       if (result6) {
      //         foliofitAd1[i].redirection_title = result6.title;
      //       }else{
      //         foliofitAd1[i].redirection_title = ''
      //       }
      //     }else{
      //       foliofitAd1[i].redirection_title = ''
      //     }
      //   }
      // }

      // foliofitAd1.map((e, i) => {
      //   e.image = process.env.BASE_URL.concat(e.image);
      //   // e.redirection_id = 0;
      //   delete e._id;
      // });
      // Fetching ads slider 3
      let FoliofitSlider3 = await AdsFoliofitSlider3.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: {
            path: "$product",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            id: "$_id",
            redirection_id: "$productId",
            image: { $concat: [imgPath, "$image"] },
            redirection_title: "$product.name",
          },
        },
      ]);
      // if (FoliofitSlider3.length) {
      //   for (i = 0; i < FoliofitSlider3.length; i++) {
      //   delete FoliofitSlider3[i]._id;

      //     let result3 = await Inventory.findOne(
      //       { _id: mongoose.Types.ObjectId(FoliofitSlider3[i].redirection_id) },
      //       { title: 1 }
      //     );
      //     if (result3) {
      //       FoliofitSlider3[i].redirection_title = result3.title;
      //     }else{
      //       FoliofitSlider3[i].redirection_title = "";

      //     }
      //   }
      // }
      FoliofitSlider3.map((e, i) => {
        // e.image = process.env.BASE_URL.concat(e.image);
        // e.redirection_id = 0;
        delete e._id;
      });
      let catId = await foliofitHomePage.find({});
      let workout_routine = [];
      if (catId.length) {
        console.log("33333", catId);
        // let workout_routine = [];
        let result;
        let resultMain =
          await FoliofitMasterFitnessMainHomeFullbodyHealthy.findById(
            catId[0].category
          ).lean();
        if (resultMain) result = resultMain;
        let resultOther = await foliofitWeeklyWorkout
          .findById(catId[0].category)
          .lean();
        if (resultOther) result = resultOther;
        console.log("#####3", result);
        for (let id of result.videos) {
          let video = await FolifitFitnessClub.findOne(
            { _id: id },
            {
              title: 1,
              video: 1,
              image: { $concat: [imgPath, "$thumbnail"] },
            }
          ).lean();
          // console.log(video);
          if (video) {
            video.categoryId = catId[0].category;
            workout_routine.push(video);
          }
        }
      }
      let yoga_asanas = [];
      let category = await FoliofitMasterYogaHome.findOne({});
      console.log("category", category);
      // if(category){
      //   var categoryId =category[0].categoryId
      // }
      // yoga_asanas.push(categoryId=category[0].categoryId)
      let yoga;
      if (category) {
        resultMain = await FoliofitMasterYogaMainCategory.findOne(
          { _id: mongoose.Types.ObjectId(category.categoryId) },
          { videos: 1 }
        );
        console.log("resultMain", resultMain);
        resultOther = await FoliofitMasterYogaHealthyRecommended.findOne(
          { _id: mongoose.Types.ObjectId(category.categoryId) },
          { videos: 1 }
        );
        console.log("resultOther", resultOther);
        resultWeekly = await FoliofitMasterYogaWeekly.findOne(
          { _id: mongoose.Types.ObjectId(category.categoryId) },
          { videos: 1 }
        );
        console.log("resultWeekly", resultWeekly);
        if (resultMain) {
          yoga = resultMain;
        } else if (resultOther) {
          yoga = resultOther;
        } else if (resultWeekly) {
          yoga = resultWeekly;
        }
        console.log("yogaa", yoga);
        if (yoga) {
          for (let ids of yoga.videos) {
            let video = await FoliofitYoga.findOne(
              { _id: mongoose.Types.ObjectId(ids) },
              {
                title: 1,
                video: 1,
                thumbnail: { $concat: [imgPath, "$thumbnail"] },
                workoutTime: 1,
              }
            ).lean();
            if (video) {
              video.categoryId = category.categoryId;

              yoga_asanas.push(video);
            }
          }
        }

        //  let  video = await FoliofitYoga.find({"_id" : {"$in" : yoga.videos}},
        //   {
        //       title:1,
        //       image:{ $concat: [ imgPath,"$thumbnail" ] },
        //       video:1,
        //       workoutTime:1,
        //   }).lean()
        //   if(video){
        //     if(categoryId){
        //    video[0].categoryId=categoryId
        //     }
        //    yoga_asanas.push(video[0])
        //   } else{
        //     yoga_asanas = []
        //   }
      }

      let home_testimonial = await FoliofitTestimonial.aggregate([
        { $match: { testimonialType: foliofitType, isDisabled: false } },
        { $project: { _id: 1, image: { $concat: [imgPath, "$image"] } } },
      ]);
      let userData = {};
      req.user = req.user.toJSON();
      if (req.user) {
        userData.userId = req.user._id;
        userData.userName = req.user.name;
        if (req.user.image) {
          userData.userImage = process.env.BASE_URL.concat(req.user.image);
        } else {
          userData.userImage = process.env.BASE_URL.concat("medfeed/head.jpeg");
        }
        let count1 = await Save.countDocuments({
          userId: mongoose.Types.ObjectId(req.user._id),
          type: "fitnessClub",
        });
        let count2 = await Save.countDocuments({
          userId: mongoose.Types.ObjectId(req.user._id),
          type: "yoga",
        });
        userData.fav_count = count1 + count2;
      } else {
        userData.userName = "guest";
        userData.userImage = process.env.BASE_URL.concat("medfeed/head.jpeg");
        userData.fav_count = 0;
      }

      res.status(200).json({
        message: "success",
        error: false,
        data: {
          PopupBanner: PopupBanner,
          banner: foliofitSlider1,
          category: mainSections,
          home_ads: foliofitSlider2,
          workout_routine: workout_routine,
          yoga_asanas: yoga_asanas,
          home_ads1: FoliofitSlider3,
          home_testimonial: home_testimonial,
          foliofitAd1: foliofitAd1[0],
          userData: userData,
          // home_ads: [{
          //     category_id: 0,
          //     category_name: "Fitness club",
          //     cat_image: "Image path",
          // }, ],
          // workout_routine: [{
          //     id: 1,
          //     title: "Session1",
          //     image: "image path",
          //     video: "video path",
          // }, ],
          // yoga_asanas: [{
          //         id: 1,
          //         title: "Session1",
          //         image: "image path",
          //         video: "video path",
          //     },
          //     {
          //         id: 1,
          //         title: "Session2",
          //         image: "image path",
          //         video: "video path",
          //     },
          // ],
          // home_ads1: [{
          //         id: 1,
          //         image: "image path",
          //         redirection_type: "yoga",
          //         redirection_id: "0",
          //     },
          //     {
          //         id: 1,
          //         image: "image path",
          //         redirection_type: "gym",
          //         redirection_id: "0",
          //     },
          // ],
          // home_testimonial: [{
          //         id: 1,
          //         image: "image path",
          //     },
          //     {
          //         id: 1,
          //         image: "image path",
          //     },
          // ],
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getDietRegimeCat: async (req, res, next) => {
    try {
      const data = await DietPlan.aggregate([
        { $match: { isDisabled: false } },
        {
          $project: {
            name: 1,
            image: 1,
          },
        },
        { $sort: { _id: -1 } },
      ]);

      data.map((e, i) => {
        e.image = process.env.BASE_URL.concat(e.image);
      });

      let isRated = await foliofitRating
        .findOne({
          type: "dietRegime",
          userId: mongoose.Types.ObjectId(req.user._id),
        })
        .lean();
      let is_rating_added = false;

      if (isRated) {
        is_rating_added = true;
      }

      if (data) {
        res.status(200).json({
          message: "success",
          error: false,
          data: data,
          is_rating_added: is_rating_added,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getDietDays: async (req, res, next) => {
    try {
      let pageSize = req.body.limit;
      let pageNo = req.body.page;
      var aggregateQuery = DietDay.aggregate([
        { $match: { dietPlan: new mongoose.Types.ObjectId(req.body.id) } },
        {
          $project: {
            day: 1,
            title: 1,
            image: 1,
          },
        },
      ]);
      const customLabels = {
        totalDocs: "TotalRecords",
        docs: "diet_days",
        limit: "PageSize",
        page: "CurrentPage",
      };

      const aggregatePaginateOptions = {
        page: pageNo,
        limit: pageSize,
        customLabels: customLabels,
      };
      let response = await DietDay.aggregatePaginate(
        aggregateQuery,
        aggregatePaginateOptions
      );

      // Attach day ang image url in response
      let dayDet = "Day ";
      response.diet_days.map((e, i) => {
        e.image = process.env.BASE_URL.concat(e.image);
        e.day = dayDet.concat(e.day);
      });

      res.status(200).json({
        message: "success",
        error: false,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
  getDietDaysDetails: async (req, res, next) => {
    try {
      const result = await DietDay.findOne(
        { _id: req.params.id },
        { __v: 0, createdAt: 0, updatedAt: 0 }
      );

      result.image = process.env.BASE_URL.concat(result.image);
      let dayDet = "Day";
      result.day = dayDet.concat(result.day);
      result.morning.map((e, i) => {
        e.image = process.env.BASE_URL.concat(e.image);
      });
      result.afterNoon.map((e, i) => {
        e.image = process.env.BASE_URL.concat(e.image);
      });
      result.evening.map((e, i) => {
        e.image = process.env.BASE_URL.concat(e.image);
      });
      result.night.map((e, i) => {
        e.image = process.env.BASE_URL.concat(e.image);
      });

      if (!result)
        res.status(200).json({ message: "Id not found", error: true });
      res.status(200).json({
        message: "success",
        error: false,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  getNutriChart: async (req, res, next) => {
    try {
      const banner = await AdsFoliofitBanner.findOne(
        { bannerType: nutrichart, isDisabled: false },
        {
          categoryId: 1,
          image: 1,
          bannerType: 1,
        }
      ).lean();
      banner.image = process.env.BASE_URL.concat(banner.image);
      let result1 = await nutrichartCategory.findOne(
        {
          _id: mongoose.Types.ObjectId(banner.categoryId),
        },
        { title: 1 }
      );
      let result2 = await nutrichartVitamin.findOne(
        {
          _id: mongoose.Types.ObjectId(banner.categoryId),
        },
        { title: 1 }
      );
      let result3 = await nutrichartCategoryBased.findOne(
        {
          _id: mongoose.Types.ObjectId(banner.categoryId),
        },
        { title: 1 }
      );

      if (result1) {
        banner.title = result1.title;
      } else if (result2) {
        banner.title = result2.title;
      } else {
        banner.title = result3.title;
      }
      const catagories = await nutrichartCategory.find(
        {},
        {
          title: 1,
          image: 1,
        }
      );
      for (i = 0; i < catagories.length; i++) {
        catagories[i].image = process.env.BASE_URL.concat(catagories[i].image);
      }
      const vitamins = await nutrichartVitamin.find(
        {},
        {
          title: 1,
          image: 1,
        }
      );
      for (k = 0; k < vitamins.length; k++) {
        vitamins[k].image = process.env.BASE_URL.concat(vitamins[k].image);
      }
      const category_based = await nutrichartCategoryBased.find(
        {},
        {
          title: 1,
          image: 1,
        }
      );
      for (x = 0; x < category_based.length; x++) {
        category_based[x].image = process.env.BASE_URL.concat(
          category_based[x].image
        );
      }
      const items = await nutrichartFood.find(
        { recommended: true },
        {
          image: 1,
          title: 1,
        }
      );
      for (y = 0; y < items.length; y++) {
        items[y].image = process.env.BASE_URL.concat(items[y].image);
      }
      const data = {
        banner: banner,
        catagories: catagories,
        vitamins: vitamins,
        category_based: category_based,
        items: items,
      };
      const response = {
        message: "Success",
        error: false,
        data: data,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
  addHealthReminder: async (req, res, next) => {
    try {
      let existing = await healthReminder.findOne({
        userId: req.user._id,
        type: req.body.type,
      });
      if (existing) {
        const data = {
          type: req.body.type,
          userId: req.user._id,
          session: req.body.session,
        };
        await healthReminder
          .updateOne({ userId: req.user._id, type: req.body.type }, data)
          .then((response) => {
            console.log(response);
            res.status(200).json({
              error: false,
              message: "Health Reminder Added",
              data: {},
            });
          });
      } else {
        const data = {
          type: req.body.type,
          userId: req.user._id,
          session: req.body.session,
        };
        const obj = new healthReminder(data);
        obj.save((_) => {
          res.status(200).json({
            error: false,
            message: "Health Reminder Added",
            data: {},
          });
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getHealthReminder: async (req, res, next) => {
    try {
      let result;
      let result1 = await healthReminder.findOne(
        { userId: req.user._id, type: req.body.type },
        {
          type: 1,
          session: 1,
        }
      );
      if (result1) {
        result = result1;
      } else {
        result = {};
      }
      res.status(200).json({
        error: false,
        message: "Success",
        data: {
          result,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  addHealthCalculator: async (req, res, next) => {
    try {
      const bmi = await healthCalculator.findOne({
        userId: mongoose.Types.ObjectId(req.user._id),
      });
      if (!bmi) {
        const data = {
          userId: req.user._id,
          bmi: req.body.status,
        };
        const obj = new healthCalculator(data);
        obj.save((_) => {
          const response = {
            message: "Successfully Updated",
            error: false,
          };
          res.status(200).json(response);
        });
      } else {
        const result = await healthCalculator.updateOne(
          { userId: req.user._id },
          { bmi: req.body.status }
        );
        if (result.nModified == 1) {
          const response = {
            message: "Successfully Updated",
            error: false,
          };
          res.status(200).json(response);
        } else {
          const response = {
            message: "Not Updated",
            error: false,
          };
          res.status(200).json(response);
        }
      }
    } catch (error) {
      next(error);
    }
  },

  /* Get Foliofit Home 
    ============================================= */

  getFitnessClub: async (req, res, next) => {
    try {
      const imgPath = process.env.BASE_URL;
      // Fetching foliofit master main category
      let category =
        await FoliofitMasterFitnessMainHomeFullbodyHealthy.aggregate([
          { $match: { fitnessType: fitnessTypeMain, isDisabled: false } },
          {
            $project: {
              category_name: "$title",
              cat_image: { $concat: [imgPath, "$icon"] },
            },
          },
        ]);

      // Fetching foliofit master home workout
      let home_workout =
        await FoliofitMasterFitnessMainHomeFullbodyHealthy.aggregate([
          { $match: { fitnessType: fitnessTypeHome, isDisabled: false } },
          {
            $project: {
              name: "$title",
              image: { $concat: [imgPath, "$icon"] },
            },
          },
        ]);

      // Fetching foliofit master full body workout
      let fullbody_workout =
        await FoliofitMasterFitnessMainHomeFullbodyHealthy.aggregate([
          { $match: { fitnessType: fitnessTypeFullBody, isDisabled: false } },
          {
            $project: {
              name: "$title",
              image: { $concat: [imgPath, "$icon"] },
            },
          },
        ]);

      // Fetching foliofit master Healthy Journey workout
      let healthy_journey =
        await FoliofitMasterFitnessMainHomeFullbodyHealthy.aggregate([
          {
            $match: {
              fitnessType: fitnessTypeHealthyJourney,
              isDisabled: false,
            },
          },
          {
            $project: {
              name: "$title",
              image: { $concat: [imgPath, "$icon"] },
            },
          },
        ]);

      // Fetching foliofit master weekly workout
      let weekly_workout = await foliofitWeeklyWorkout.aggregate([
        { $project: { name: "$title" } },
      ]);

      // Fetching foliofit fitness club banner (ads floiofit fitness club banner)
      let banner = await AdsFoliofitBanner.aggregate([
        { $match: { bannerType: fitnessTypeBanner, isDisabled: false } },
        {
          $project: {
            image: { $concat: [imgPath, "$image"] },
            redirection_type: "$categoryId",
          },
        },
      ]);

      // Fetching foliofit fitness club Slider (ads floiofit fitness club slider)
      let slider = await AdsFoliofitAd1Slider.aggregate([
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
            redirection_id: "$typeId",
            redirection_type: "$type",
            image: { $concat: [imgPath, "$image"] },
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
      ]).sort("-updatedAt");
      for (i = 0; i < slider.length; i++) {
        if (slider[i].typeName1) {
          slider[i].redirection_title = slider[i].typeName1;
          delete slider[i].typeName1;
        } else if (slider[i].typeName2) {
          slider[i].redirection_title = slider[i].typeName2;
          delete slider[i].typeName2;
        } else {
          slider[i].redirection_title = "";
        }
      }
      // let slider = await AdsFoliofitAd1Slider.aggregate([
      //   { $match: { sliderType: fitnessTypeBanner, isDisabled: false } },
      //   {
      //     $project: {
      //       image: "$image",
      //       redirection_id: "$typeId",
      //       redirection_type: "$type",
      //     },
      //   },
      // ]);

      // slider.map((e, i) => {
      //   e.image = process.env.BASE_URL.concat(e.image);
      //   if (e.redirection_id == "0") {
      //     e.redirection_id = "product";
      //   } else {
      //     e.redirection_id = "category";
      //   }
      // });

      // Checking whether user rated for yoga or not
      let isRated = await foliofitRating
        .findOne({
          type: "fitness",
          userId: mongoose.Types.ObjectId(req.user._id),
        })
        .lean();
      let is_rating_added = false;

      if (isRated) {
        is_rating_added = true;
      }
      let count1 = await Save.countDocuments({
        userId: mongoose.Types.ObjectId(req.user._id),
        type: "fitnessClub",
      });
      let count2 = await Save.countDocuments({
        userId: mongoose.Types.ObjectId(req.user._id),
        type: "yoga",
      });
      let count = count1 + count2;

      res.status(200).json({
        message: "success",
        error: false,
        data: {
          category: category,
          home_workout: home_workout,
          fullbody_workout: fullbody_workout,
          weekly_workout: weekly_workout,
          healthy_journey: healthy_journey,
          banner: banner[0],
          slider: slider,
          is_rating_added: is_rating_added,
          count: count,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /* Nutri chart category (Foliofit -Nutrichart ) 
    ============================================= */
  viewAllNutrichartFoods: async (req, res, next) => {
    try {
      let result1 = await nutrichartCategory.findOne({
        _id: mongoose.Types.ObjectId(req.body.id),
      });
      let result2 = await nutrichartVitamin.findOne({
        _id: mongoose.Types.ObjectId(req.body.id),
      });
      let result3 = await nutrichartCategoryBased.findOne({
        _id: mongoose.Types.ObjectId(req.body.id),
      });
      let result;
      if (result1) {
        result = result1;
      } else if (result2) {
        result = result2;
      } else {
        result = result3;
      }
      if (result) {
        let veg = await nutrichartFood.aggregate([
          {
            $match: {
              $and: [
                {
                  $or: [
                    {
                      category: mongoose.Types.ObjectId(req.body.id),
                    },
                    {
                      categoriesBased: { $in: [req.body.id] },
                    },
                    {
                      niceToAvoid: { $in: [req.body.id] },
                    },
                    {
                      vitamins: { $in: [req.body.id] },
                    },
                  ],
                },
                {
                  veg: true,
                },
              ],
            },
          },
          {
            $project: {
              title: 1,
              image: 1,
              category: 1,
            },
          },
        ]);
        veg.map((e, i) => {
          e.image = process.env.BASE_URL.concat(e.image);
        });
        let non = await nutrichartFood.aggregate([
          {
            $match: {
              $and: [
                {
                  $or: [
                    {
                      category: mongoose.Types.ObjectId(req.body.id),
                    },
                    {
                      categoriesBased: { $in: [req.body.id] },
                    },
                    {
                      niceToAvoid: { $in: [req.body.id] },
                    },
                    {
                      vitamins: { $in: [req.body.id] },
                    },
                  ],
                },
                {
                  veg: false,
                },
              ],
            },
          },
          {
            $project: {
              title: 1,
              image: 1,
              category: 1,
            },
          },
        ]);
        non.map((e, i) => {
          e.image = process.env.BASE_URL.concat(e.image);
        });
        res.status(200).json({
          status: true,
          data: { veg, non },
        });
      } else {
        res.status(200).json({
          status: false,
          data: "invalid category id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  // getNutrichartCategory: async (req, res, next) => {
  //     try {
  //         let result = await nutrichartCategory.find({}, { title: 1, image: 1 });

  //         result.map((e, i) => {
  //             e.image = process.env.BASE_URL.concat(e.image);
  //         });
  //         res.status(200).json({
  //             status: true,
  //             data: result,
  //         });
  //     } catch (error) {
  //         next(error);
  //     }
  // },

  //viewAllNutrichartFoodsByCalorie
  viewAllNutrichartFoodsByCalorie: async (req, res, next) => {
    try {
      let category = await nutrichartCategoryBased.findOne({
        _id: mongoose.Types.ObjectId(req.body.id),
      });
      if (category) {
        let veg = await nutrichartFood.aggregate([
          {
            $match: {
              $and: [
                {
                  $or: [
                    {
                      category: mongoose.Types.ObjectId(req.body.id),
                    },
                    {
                      categoriesBased: { $in: [req.body.id] },
                    },
                    {
                      niceToAvoid: { $in: [req.body.id] },
                    },
                  ],
                },
                {
                  veg: true,
                },
              ],
            },
          },
          {
            $project: {
              title: 1,
              image: 1,
              category: 1,
            },
          },
        ]);
        veg.map((e, i) => {
          e.image = process.env.BASE_URL.concat(e.image);
        });
        let non = await nutrichartFood.aggregate([
          {
            $match: {
              $and: [
                {
                  $or: [
                    {
                      category: mongoose.Types.ObjectId(req.body.id),
                    },
                    {
                      categoriesBased: { $in: [req.body.id] },
                    },
                    {
                      niceToAvoid: { $in: [req.body.id] },
                    },
                  ],
                },
                {
                  veg: false,
                },
              ],
            },
          },
          {
            $project: {
              title: 1,
              image: 1,
              category: 1,
            },
          },
        ]);
        non.map((e, i) => {
          e.image = process.env.BASE_URL.concat(e.image);
        });
        let niceToAvoid = await nutrichartFood.aggregate([
          {
            $match: {
              niceToAvoid: { $in: [req.body.id] },
            },
          },
          {
            $project: {
              title: 1,
              image: 1,
              category: 1,
            },
          },
        ]);
        niceToAvoid.map((e, i) => {
          e.image = process.env.BASE_URL.concat(e.image);
        });
        // let niceToAvoid = await nutrichartFood.find({
        //   niceToAvoid: { $in: req.body.id },
        // });
        // res.status(200).json({
        //   status: true,
        //   data: { veg, non, niceToAvoid },
        // });
        res.status(200).json({
          status: true,
          data: { veg, non, niceToAvoid },
        });
      } else {
        res.status(200).json({
          status: false,
          data: "invalid category id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  /* Nutri chart Details  (Foliofit -Nutrichart ) 
    ============================================= */
  getNutrichartDetails: async (req, res, next) => {
    try {
      let imgPath = process.env.BASE_URL;
      let result = await nutrichartFood.findOne(
        { _id: mongoose.Types.ObjectId(req.body.id) },
        {
          title: 1,
          description: 1,
          image: { $concat: [imgPath, "$image"] },
          banner: { $concat: [imgPath, "$banner"] },
        }
      );
      if (result) {
        res.status(200).json({
          status: true,
          data: result,
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

  /* Get Foliofit Home 
    ============================================= */

  getYogaHome: async (req, res, next) => {
    try {
      let imgPath = process.env.BASE_URL;
      // Fetching foliofit master yoga main category
      let category = await FoliofitMasterYogaMainCategory.aggregate([
        { $match: { isDisabled: false } },
        {
          $project: { title: "$title", image: { $concat: [imgPath, "$icon"] } },
        },
      ]);

      // Fetching foliofit master Yoga Start Your Healthy
      let start_healthy = await FoliofitMasterYogaHealthyRecommended.aggregate([
        { $match: { yogaType: yogaTypeHealthy, isDisabled: false } },
        { $project: { image: { $concat: [imgPath, "$icon"] } } },
      ]);

      // Fetching foliofit master Recommended
      let weekly_workout = await FoliofitMasterYogaHealthyRecommended.aggregate(
        [
          { $match: { yogaType: yogaTypeRecommended, isDisabled: false } },
          {
            $project: {
              title: "$title",
              image: { $concat: [imgPath, "$icon"] },
            },
          },
        ]
      );

      let weekly_workout_days = await FoliofitMasterYogaWeekly.aggregate([
        { $match: { isDisabled: false } },
        {
          $project: {
            title: "$title",
          },
        },
      ]);

      // Fetching foliofit yoga  banner (ads floiofit yoga banner)
      let banner = await AdsFoliofitBanner.aggregate([
        { $match: { bannerType: yoga, isDisabled: false } },
        { $project: { image: "$image", redirection_type: "$categoryId" } },
      ]);

      banner.map((e, i) => {
        e.image = process.env.BASE_URL.concat(e.image);
        e.type = "category";
      });

      //Fetching foliofit yoga Slider (ads floiofit yoga slider)
      let slider = await AdsFoliofitAd1Slider.aggregate([
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
            redirection_id: "$typeId",
            redirection_type: "$type",
            image: { $concat: [imgPath, "$image"] },
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
      ]).sort("-updatedAt");
      for (i = 0; i < slider.length; i++) {
        if (slider[i].typeName1) {
          slider[i].redirection_title = slider[i].typeName1;
          delete slider[i].typeName1;
        } else if (slider[i].typeName2) {
          slider[i].redirection_title = slider[i].typeName2;
          delete slider[i].typeName2;
        } else {
          slider[i].redirection_title = "";
        }
      }
      // let slider = await AdsFoliofitAd1Slider.aggregate([
      //   { $match: { sliderType: yoga, isDisabled: false } },
      //   {
      //     $project: { image: "$image", type: "$type", redirect_id: "$typeId" },
      //   },
      // ]);

      // slider.map((e, i) => {
      //   e.image = process.env.BASE_URL.concat(e.image);
      //   if (e.type == "0") {
      //     e.type = "product";
      //   } else {
      //     e.type = "category";
      //   }
      // });

      // Fetching foliofit Testimonial
      let testimonial = await FoliofitTestimonial.aggregate([
        { $match: { testimonialType: yoga, isDisabled: false } },
        { $project: { _id: 0, image: { $concat: [imgPath, "$image"] } } },
      ]);

      // Checking whether user rated for yoga or not
      let isRated = await foliofitRating
        .findOne({
          type: "yoga",
          userId: mongoose.Types.ObjectId(req.user._id),
        })
        .lean();
      let is_rating_added = false;

      if (isRated) {
        is_rating_added = true;
      }
      let count1 = await Save.countDocuments({
        userId: mongoose.Types.ObjectId(req.user._id),
        type: "fitnessClub",
      });
      let count2 = await Save.countDocuments({
        userId: mongoose.Types.ObjectId(req.user._id),
        type: "yoga",
      });
      let count = count1 + count2;
      res.status(200).json({
        message: "success",
        error: false,
        data: {
          category: category,
          start_healthy: start_healthy,
          weekly_workout: weekly_workout,
          weekly_workout_days: weekly_workout_days,
          testimonial: testimonial,
          banner: banner[0],
          slider: slider,
          is_rating_added: is_rating_added,
          count: count,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  searchMedfeed: async (req, res, next) => {
    try {
      let keyword = req.body.keyword;
      // console.log(keyword)
      if (keyword) {
        let articleResult = [];
        let HealthCareResult = [];
        let HealthTipResult = [];

        let article = await Articles.find(
          {
            $or: [{ $text: { $search: `"\"${keyword}\""` } }],
          },
          {
            _id: 1,
            title: "$heading",
            image: 1,
            readTime: 1,
            createdAt: 1,
          }
        ).lean();
        for (let item of article) {
          let count = await Like.countDocuments({
            contentId: mongoose.Types.ObjectId(item._id),
          });
          item.like_count = count;
          // is liked
          let isLiked = await Like.findOne({
            type: "article",
            contentId: mongoose.Types.ObjectId(item._id),
            userId: req.user._id,
          });

          if (isLiked) {
            item.is_liked = 1;
          } else {
            item.is_liked = 0;
          }
          let isSaved = await Save.findOne({
            type: "article",
            contentId: mongoose.Types.ObjectId(item._id),
            userId: req.user._id,
          });

          if (isSaved) {
            item.is_saved = 1;
          } else {
            item.is_saved = 0;
          }
          item.image = process.env.BASE_URL.concat(item.image);
          item.video = "";
          item.thumbnail = "";
          item.duration = "";
          item.description = "";
          let since = timeSince(item.createdAt);
          item.createdAt = since;
          item.type = "article";
          articleResult.push(item);
        }
        let healthcareVideo = await HealthcareVideos.find(
          {
            $or: [{ $text: { $search: `"\"${keyword}\""` } }],
          },
          {
            _id: 1,
            title: "$name",
            thumbnail: 1,
            video: 1,
            createdAt: 1,
            duration: 1,
          }
        ).lean();
        for (let itemVideo of healthcareVideo) {
          let count = await Like.countDocuments({
            contentId: mongoose.Types.ObjectId(itemVideo._id),
          });
          itemVideo.like_count = count;
          // is liked
          let isLiked = await Like.findOne({
            type: "healthcareVideo",
            contentId: mongoose.Types.ObjectId(itemVideo._id),
            userId: req.user._id,
          });

          if (isLiked) {
            itemVideo.is_liked = 1;
          } else {
            itemVideo.is_liked = 0;
          }

          let isSaved = await Save.findOne({
            type: "healthcareVideo",
            contentId: mongoose.Types.ObjectId(itemVideo._id),
            userId: req.user._id,
          });

          if (isSaved) {
            itemVideo.is_saved = 1;
          } else {
            itemVideo.is_saved = 0;
          }
          let since = timeSince(itemVideo.createdAt);
          itemVideo.createdAt = since;
          itemVideo.thumbnail = process.env.BASE_URL.concat(
            itemVideo.thumbnail
          );
          itemVideo.readTime = "";
          itemVideo.image = "";
          itemVideo.description = "";
          itemVideo.type = "healthcareVideo";
          HealthCareResult.push(itemVideo);
        }
        let healthTip = await HealthTip.find(
          {
            $or: [{ $text: { $search: `"\"${keyword}\""` } }],
          },
          {
            _id: 1,
            title: "$heading",
            image: 1,
            description: 1,
            createdAt: 1,
            readTime: 1,
          }
        ).lean();
        for (let itemTip of healthTip) {
          let count = await Like.countDocuments({
            contentId: mongoose.Types.ObjectId(itemTip._id),
          });
          // is liked
          let isLiked = await Like.findOne({
            type: "healthTip",
            contentId: mongoose.Types.ObjectId(itemTip._id),
            userId: req.user._id,
          });

          if (isLiked) {
            itemTip.is_liked = 1;
          } else {
            itemTip.is_liked = 0;
          }
          itemTip.isSaved = 0;
          itemTip.like_count = count;
          let since = timeSince(itemTip.createdAt);
          itemTip.createdAt = since;
          itemTip.image = process.env.BASE_URL.concat(itemTip.image);
          itemTip.video = "";
          itemTip.thumbnail = "";
          itemTip.type = "healthTip";
          itemTip.duration = "";
          HealthTipResult.push(itemTip);
        }
        let allResult = [
          ...HealthTipResult,
          ...HealthCareResult,
          ...articleResult,
        ];
        res.status(200).json({
          message: "success",
          error: false,
          data: {
            allResult,
          },
        });
      } else {
        res.status(200).json({
          error: true,
          data: "Please enter search keyword",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getFitnessClubSession: async (req, res, next) => {
    try {
      let session = [];
      let category;
      let id = req.body.cat_id;
      console.log(id);
      let fitness = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne(
        { _id: id },
        {
          title: 1,
          subTitle: 1,
          benefits: 1,
          banner: { $concat: [imgPath, "$banner"] },
          videos: 1,
        }
      ).lean();
      if (fitness) category = fitness;
      let workout = await foliofitWeeklyWorkout
        .findOne(
          { _id: id },
          {
            title: 1,
            subTitle: 1,
            benefits: 1,
            banner: { $concat: [imgPath, "$banner"] },
            videos: 1,
          }
        )
        .lean();
      if (workout) {
        category = workout;
      }
      for (let ids of category.videos) {
        let video = await FolifitFitnessClub.findById(ids, {
          title: 1,
          time: "$workoutTime",
          thumbnail: { $concat: [imgPath, "$thumbnail"] },
          gif: 1,
          video: 1,
          descriptionEnglish: 1,
          descriptionMalayalam: 1,
        }).lean();
        if (video) {
          let fav = await Save.findOne({
            contentId: video._id,
            type: "fitnessClub",
            userId: req.user._id,
          });
          if (fav) {
            video.is_fav = 1;
          } else {
            video.is_fav = 0;
          }
          session.push(video);
        }
      }
      if (category) {
        delete category.videos;
      }
      for (let item of session) {
        if (item.gif.type == 1) {
          item.gif.gifImage = process.env.BASE_URL.concat(item.gif.gifImage);
        } else {
          item.gif.gifVideo = process.env.BASE_URL.concat(item.gif.gifVideo);
        }
      }

      res.status(200).json({
        error: true,
        data: {
          category,
          session,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getFitnessClubSessionById: async (req, res, next) => {
    try {
      let video = await FolifitFitnessClub.findById(req.body.sess_id, {
        title: 1,
        time: "$workoutTime",
        thumbnail: { $concat: [imgPath, "$thumbnail"] },
        gif: 1,
        video: 1,
        descriptionEnglish: 1,
        descriptionMalayalam: 1,
      }).lean();
      if (video) {
        if (video.gif.type == 1) {
          video.gif.gifImage = process.env.BASE_URL.concat(video.gif.gifImage);
        } else {
          video.gif.gifVideo = process.env.BASE_URL.concat(video.gif.gifVideo);
        }
        res.status(200).json({
          error: true,
          data: {
            session: video,
          },
        });
      } else {
        res.status(200).json({
          error: true,
          data: {
            session: {},
          },
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getFitnessClubSessionDetails: async (req, res, next) => {
    try {
      let session = [];
      let category;
      let id = req.body.cat_id;
      let sessionVideo = {};
      console.log(id);
      let fitness = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne(
        { _id: id },
        {
          title: 1,
          videos: 1,
        }
      ).lean();
      if (fitness) category = fitness;
      let workout = await foliofitWeeklyWorkout
        .findOne(
          { _id: id },
          {
            title: 1,
            videos: 1,
          }
        )
        .lean();
      if (workout) {
        category = workout;
      }
      for (let ids of category.videos) {
        let video = await FolifitFitnessClub.findById(ids, {
          title: 1,
          time: "$workoutTime",
          thumbnail: { $concat: [imgPath, "$thumbnail"] },
          gif: 1,
          video: 1,
          descriptionEnglish: 1,
          descriptionMalayalam: 1,
        }).lean();
        if (video) {
          if (video._id == req.body.sess_id) {
            sessionVideo = video;
          }
          let fav = await Save.findOne({
            contentId: video._id,
            type: "fitnessClub",
            userId: req.user._id,
          });
          if (fav) {
            video.is_fav = 1;
          } else {
            video.is_fav = 0;
          }
          session.push(video);
        }
      }
      if (category) {
        delete category.videos;
      }
      for (let item of session) {
        if (item.gif.type == 1) {
          item.gif.gifImage = process.env.BASE_URL.concat(item.gif.gifImage);
        } else {
          item.gif.gifVideo = process.env.BASE_URL.concat(item.gif.gifVideo);
        }
      }
      let count1 = await Save.countDocuments({
        userId: mongoose.Types.ObjectId(req.user._id),
        type: "fitnessClub",
      });
      let count2 = await Save.countDocuments({
        userId: mongoose.Types.ObjectId(req.user._id),
        type: "yoga",
      });
      let count = count1 + count2;

      res.status(200).json({
        error: true,
        data: {
          category,
          sessionDetails: sessionVideo,
          allSession: session,
          count: count,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getYogaSessions: async (req, res, next) => {
    try {
      let session = [];
      let category;
      let id = req.body.cat_id;
      let yoga = await FoliofitMasterYogaMainCategory.findOne(
        { _id: id },
        {
          title: 1,
          subTitle: 1,
          benefits: 1,
          banner: { $concat: [imgPath, "$banner"] },
          videos: 1,
        }
      ).lean();
      if (yoga) category = yoga;
      let healthy = await FoliofitMasterYogaHealthyRecommended.findOne(
        { _id: id },
        {
          title: 1,
          subTitle: 1,
          benefits: 1,
          banner: { $concat: [imgPath, "$banner"] },
          videos: 1,
        }
      ).lean();
      if (healthy) {
        category = healthy;
      }
      let weekly = await FoliofitMasterYogaWeekly.findOne(
        { _id: id },
        {
          title: 1,
          subTitle: 1,
          benefits: 1,
          banner: { $concat: [imgPath, "$image"] },
          videos: 1,
        }
      ).lean();
      if (weekly) {
        category = weekly;
      }

      for (let ids of category.videos) {
        let video = await FoliofitYoga.findById(ids, {
          title: 1,
          time: "$workoutTime",
          thumbnail: { $concat: [imgPath, "$thumbnail"] },
          video: 1,
        }).lean();
        if (video) {
          let fav = await Save.findOne({
            contentId: video._id,
            type: "yoga",
            userId: req.user._id,
          });
          if (fav) {
            video.is_fav = 1;
          } else {
            video.is_fav = 0;
          }
          // session.push(video);
          session.push(video);
        }
      }
      if (category) {
        delete category.videos;
      }
      let count1 = await Save.countDocuments({
        userId: mongoose.Types.ObjectId(req.user._id),
        type: "fitnessClub",
      });
      let count2 = await Save.countDocuments({
        userId: mongoose.Types.ObjectId(req.user._id),
        type: "yoga",
      });
      category.fav_count = count1 + count2;
      res.status(200).json({
        error: true,
        data: {
          category,
          session,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getYogaSessionById: async (req, res, next) => {
    try {
      let video = await FoliofitYoga.findById(req.body.sess_id, {
        title: 1,
        time: "$workoutTime",
        thumbnail: { $concat: [imgPath, "$thumbnail"] },
        video: 1,
      }).lean();
      if (video) {
        // if(video.gif.type==1){
        //   video.gif.gifImage = process.env.BASE_URL.concat(video.gif.gifImage)
        // }else{
        //   video.gif.gifVideo = process.env.BASE_URL.concat(video.gif.gifVideo)
        // }
        res.status(200).json({
          error: true,
          data: {
            session: video,
          },
        });
      } else {
        res.status(200).json({
          error: true,
          data: {
            session: {},
          },
        });
      }
    } catch (error) {
      next(error);
    }
  },

  getFitnessClubBookmark: async (req, res, next) => {
    try {
      let result = [];
      let fitness = await Save.find({
        userId: mongoose.Types.ObjectId(req.user._id),
        type: "fitnessClub",
      });
      let yog = await Save.find({
        userId: mongoose.Types.ObjectId(req.user._id),
        type: "yoga",
      });
      let saved_list = [...fitness, ...yog];
      console.log(saved_list);
      for (let item of saved_list) {
        console.log(item.type);
        let fitnessVideo = await FolifitFitnessClub.findOne(
          { _id: mongoose.Types.ObjectId(item.contentId) },
          {
            title: 1,
            time: "$workoutTime",
            thumbnail: { $concat: [imgPath, "$thumbnail"] },
          }
        ).lean();
        let yogaVideo = await FoliofitYoga.findById(
          { _id: mongoose.Types.ObjectId(item.contentId) },
          {
            title: 1,
            time: "$workoutTime",
            thumbnail: { $concat: [imgPath, "$thumbnail"] },
          }
        ).lean();

        if (fitnessVideo) {
          console.log();
          fitnessVideo.type = item.type;
          result.push(fitnessVideo);
        }
        if (yogaVideo) {
          yogaVideo.type = item.type;
          result.push(yogaVideo);
        }
      }
      res.status(200).json({
        error: true,
        data: {
          result,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getBmiDetails: async (req, res, next) => {
    try {
      let existing = await bmiCount.find();
      if (existing.length == 0) {
        console.log("in if");
        const data = {
          count: 1000000,
        };
        const obj = bmiCount(data);
        obj.save();
      } else {
        await bmiCount.updateOne(
          { _id: existing[0]._id },
          { $inc: { count: 1 } }
        );
      }
      let counts = await bmiCount.find();
      let userName = await user.findOne({
        _id: mongoose.Types.ObjectId(req.user._id),
      });
      let bmiStatus = await healthCalculator.findOne({ userId: req.user._id });

      res.status(200).json({
        error: true,
        data: {
          count: counts[0].count,
          name: userName.name,
          status: bmiStatus.bmi,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getFoliofitClubBookmarkByType: async (req, res, next) => {
    try {
      let result = [];
      if (req.body.type == "fitnessClub") {
        let saved_list = await Save.find({
          userId: mongoose.Types.ObjectId(req.user._id),
          type: "fitnessClub",
        });
        for (let item of saved_list) {
          let fitnessVideo = await FolifitFitnessClub.findOne(
            { _id: mongoose.Types.ObjectId(item.contentId) },
            {
              title: 1,
              time: "$workoutTime",
              thumbnail: { $concat: [imgPath, "$thumbnail"] },
            }
          ).lean();
          if (fitnessVideo) {
            result.push(fitnessVideo);
          }
        }
      }
      if (req.body.type == "yoga") {
        let saved_list = await Save.find({
          userId: mongoose.Types.ObjectId(req.user._id),
          type: "yoga",
        });
        for (let item of saved_list) {
          let yogaVideo = await FoliofitYoga.findById(
            { _id: mongoose.Types.ObjectId(item.contentId) },
            {
              title: 1,
              time: "$workoutTime",
              thumbnail: { $concat: [imgPath, "$thumbnail"] },
              video: 1,
            }
          ).lean();
          if (yogaVideo) {
            result.push(yogaVideo);
          }
        }
      }
      res.status(200).json({
        error: true,
        data: {
          result,
        },
      });
    } catch (error) {}
  },
  getVimeoGif: async (req, res, next) => {
    try {
      let config = {
        headers: {
          Authorization: "Bearer " + process.env.VIMEO_ACCESS_TOKEN,
        },
      };
      axios
        .get(`https://api.vimeo.com/videos/${req.body.gifId}`, config)
        .then((response) => {
          console.log(response.data);
          res.status(200).json({
            error: true,
            data: "hi",
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(200).json({
            error: true,
            data: {},
          });
        });
    } catch (error) {}
  },

  /* Master settings 
    ============================================= */
  getCategoriesOld: async (req, res, next) => {
    try {
      // let healthcareBanner = []
      let category = [];
      let productDetails = []; // most buyed products.Pending

      let healthcareBanner = "";
      var limit = 0;
      if (req.body.limit) {
        limit = parseInt(req.body.limit);
      }

      if (limit == 0) limit = 12;
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
        healthcareBanner = healthcareBanner.image;
      } else {
        healthcareBanner = "";
      }

      // --------active category in healthcare (master settings)

      category = await MasterCategory.find(
        { categoryType: categoryTypeHealth, isDisabled: false },
        {
          title: 1,
          image: { $concat: [imgPath, "$image"] },
        }
      )
        .sort("-id")
        .limit(limit)
        .skip(skip)
        .exec(async function (err, category) {
          var productDetails = [];
          // for (let ids of category) {
          productDetails = await Inventory.find(
            { type: "healthcare" },
            {
              name: 1,
              "pricing.image": 1,
              "pricing.price": 1,
              "pricing.specialPrice": 1,
              "pricing.uom": 1,
              "pricing.sku": 1,
              "pricing.stock": 1,
              "pricing._id": 1,
            }
          )
            .sort("-id")
            .limit(limit)
            .skip(skip);
          let items = [];
          for (let item of productDetails) {
            // let uomTitle =""

            // let uom  = await MasterUOMValue.findOne(
            //     { _id: mongoose.Types.ObjectId(item.pricing[0].sku) },
            //     {
            //         uomValue: 1
            //     }
            // )

            // if(uom){
            //     uomTitle = uom.uomValue
            // }
            // let data = {
            //     _id: item._id,
            //     image : item.pricing[0].image[0],
            //     title : item.name,
            //     price : item.pricing[0].price,
            //     spl_price : item.pricing[0].specialPrice,
            //     uom : uomTitle,
            // }
            // items.push(data)

            var checkStock = false;
            let uomTitle = "";

            var data = {
              _id: item._id,
              title: item.name,
            };

            for (let pricing of item.pricing) {
              if (!checkStock) {
                if (pricing.stock > 0) {
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
                    data.image = imgPath.concat(pricing.image[0]);
                  }

                  let discountPercentage =
                    ((pricing.price - pricing.specialPrice) / pricing.price) *
                    100;
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
          }
          res.status(200).json({
            error: false,
            message: "Categories are",
            data: {
              image: healthcareBanner,
              category: category,
              products: items,
            },
          });
        });
    } catch (error) {
      next(error);
    }
  },
  getCategories: async (req, res, next) => {
    try {
      // let healthcareBanner = []
      let category = [];
      let productDetails = []; // most buyed products

      let healthcareBanner = "";
      var limit = 0;
      if (req.body.limit) {
        limit = parseInt(req.body.limit);
      }

      if (limit == 0) limit = 30;
      var skip = (parseInt(req.body.page) - 1) * parseInt(limit);

      // --------Ads medimall healthcare banner
      healthcareBanner = await AdsMedimallTopIconCatHealth.findOne(
        { sliderType: categoryTypeHealth, isDisabled: false },
        {
          image: { $concat: [imgPath, "$image"] },
          _id: 0,
        }
      );

      if (healthcareBanner) {
        healthcareBanner = healthcareBanner.image;
      } else {
        healthcareBanner = "";
      }

      //favourite count
      let favouriteCount = await InventoryFavourite.find({
        userId: req.user._id,
      }).countDocuments();

      // --------active category in healthcare (master settings)

      category = await MasterCategory.find(
        { categoryType: categoryTypeHealth, isDisabled: false },
        {
          title: 1,
          image: { $concat: [imgPath, "$image"] },
        }
      );

      // var productDetails = []
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
      let items = [];
      for (let ii of mostPurchased) {
        productDetails = await Inventory.find(
          { _id: ii.product_id, isDisabled: false },
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
        )
          .populate({ path: "brand", select: ["title"] })
          .sort("-id")
          .limit(limit)
          .skip(skip);
        // let items = [];
        for (let item of productDetails) {
          var checkStock = false;
          let uomTitle = "";

          var data = {
            _id: item._id,
            title: item.name,
            brand: item.brand.title,
          };
          if (item.pricing) {
            for (let pricing of item.pricing) {
              if (!checkStock) {
                if (pricing.stock > 0) {
                  if (pricing.stock < item.statusLimit) {
                    data.stockStatus = "Limited";
                  } else {
                    data.stockStatus = "Available";
                  }
                  checkStock = true;
                  if (pricing?.sku) {
                    let uom = await MasterUOMValue.findOne(
                      { _id: mongoose.Types.ObjectId(pricing.sku) },
                      {
                        uomValue: 1,
                      }
                    );
                    if (uom) {
                      uomTitle = uom.uomValue;
                    }
                  }
                  data.image = "";
                  data.discount = "";

                  if (pricing?.image[0]) {
                    //   data.image = imgPath.concat(pricing.image[0])
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
              data.stockStatus = "Out of stock";
              //console.log(item?.pricing[0], "category item");
              if (item?.pricing[0]?.sku) {
                let uom = await MasterUOMValue.findOne(
                  { _id: mongoose.Types.ObjectId(item.pricing[0].sku) },
                  {
                    uomValue: 1,
                  }
                );
                if (uom) {
                  uomTitle = uom.uomValue;
                }
              }

              data.image = "";
              data.discount = "";
              if (item?.pricing[0]?.image[0]) {
                data.image = imgPath.concat(item.pricing[0].image[0]);
              }
              if (item?.pricing[0]) {
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
              } else {
                data.price = 0;
                data.spl_price = 0;
                data.uom = uomTitle;
                data.varientId = "";
              }

              items.push(data);
            }
          }
        }
      }

      // get cart count
      let cartCount = await Cart.countDocuments({
        userId: mongoose.Types.ObjectId(req.user._id),
      });

      res.status(200).json({
        error: false,
        message: "Categories are",
        data: {
          image: healthcareBanner,
          category: category,
          products: items,
          favouriteCount: favouriteCount,
          cartCount: cartCount,
        },
      });
      // })
    } catch (error) {
      next(error);
    }
  },

  getSubCategories: async (req, res, next) => {
    try {
      let products = [];
      let category = [];

      var limit = 0;
      if (req.body.limit) {
        limit = parseInt(req.body.limit);
      }
      if (limit == 0) limit = 30;
      var skip = (parseInt(req.body.page) - 1) * parseInt(limit);

      category = await MasterCategory.findOne(
        { _id: req.body.cat_id, isDisabled: false },
        {
          title: 1,
          image: { $concat: [imgPath, "$image"] },
        }
      );

      //favourite count
      let favouriteCount = await InventoryFavourite.find({
        userId: req.user._id,
      }).countDocuments();

      if (category) {
        let sub_category = [];

        sub_category = await MasterSubCategoryHealthcare.find(
          { categoryId: req.body.cat_id, isDisabled: false },
          {
            title: 1,
            image: { $concat: [imgPath, "$image"] },
          }
        );

        let subCategories = [];
        //  let subsubCategoryArray = [];
        // Get the count of products under  sub sub category
        if (sub_category) {
          for (let ids of sub_category) {
            var data = {
              _id: ids._id,
              title: ids.title,
              image: ids.image,
            };

            let subSubCategory = await MasterSubSubCategoryHealthcare.find({
              subCategoryId: ids._id,
              isDisabled: false,
            });
            data.productCount = 0;

            if (subSubCategory.length) {
              let proCount = 0;
              for (let subIds of subSubCategory) {
                // subsubCategoryArray.push(subIds._id)
                productCount = await Inventory.find({
                  categories: { $in: subIds._id + "" },
                  isDisabled: false,
                  type: categoryTypeHealth,
                }).countDocuments();
                proCount = proCount + productCount;
              }
              data.productCount = proCount;
              subCategories.push(data);
            } else {
              productCount = await Inventory.find({
                categories: { $in: ids._id + "" },
                isDisabled: false,
                type: categoryTypeHealth,
              }).countDocuments();
              data.productCount = productCount;
              subCategories.push(data);
            }
          }
        }

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
        let items = [];

        let subCategoryIdArray = [];
        // console.log(subsubCategoryArray)
        for (let sub of subCategories) {
          subCategoryIdArray.push(sub._id + "");
        }
        // let concatCategoryArray =  subCategoryIdArray.concat(subsubCategoryArray)
        for (let ii of mostPurchased) {
          var productDetails = [];
          productDetails = await Inventory.find(
            {
              _id: ii.product_id,
              isDisabled: false,
              categories: { $in: subCategoryIdArray },
            },
            {
              name: 1,
              "pricing.image": 1,
              "pricing.price": 1,
              "pricing.specialPrice": 1,
              "pricing.uom": 1,
              "pricing.sku": 1,
              "pricing.stock": 1,
              "pricing._id": 1,
            }
          )
            .populate({ path: "brand", select: ["title"] })
            .sort("-id")
            .limit(limit)
            .skip(skip);

          // let items = [];
          for (let item of productDetails) {
            var checkStock = false;
            let uomTitle = "";

            var data = {
              _id: item._id,
              title: item.name,
              brand: item.brand.title,
            };
            if (item.pricing) {
              for (let pricing of item.pricing) {
                if (!checkStock) {
                  if (pricing.stock > 0) {
                    if (pricing.stock < item.statusLimit) {
                      data.stockStatus = "Limited";
                    } else {
                      data.stockStatus = "Available";
                    }
                    checkStock = true;
                    if (pricing?.sku) {
                      let uom = await MasterUOMValue.findOne(
                        { _id: mongoose.Types.ObjectId(pricing.sku) },
                        {
                          uomValue: 1,
                        }
                      );
                      if (uom) {
                        uomTitle = uom.uomValue;
                      }
                    }

                    data.image = "";
                    data.discount = "";

                    if (pricing?.image[0]) {
                      //data.image = imgPath.concat(pricing.image[0]);
                      if (pricing.image[0].includes(imgPath)) {
                        data.image = pricing.image[0];
                      } else {
                        data.image = imgPath.concat(pricing.image[0]);
                      }
                    }
                    // if (item?.pricing[0]) {
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
                    // }else{
                    //   data.price = 0;
                    //   data.spl_price = 0;
                    //   data.uom = uomTitle;
                    //   data.varientId = "";
                    // }

                    items.push(data);
                  }
                }
              }

              // if stock is zero then take the first varient from product details
              if (!checkStock) {
                data.stockStatus = "Out of stock";
                if (item?.pricing[0]?.sku) {
                  let uom = await MasterUOMValue.findOne(
                    { _id: mongoose.Types.ObjectId(item.pricing[0].sku) },
                    {
                      uomValue: 1,
                    }
                  );
                  if (uom) {
                    uomTitle = uom.uomValue;
                  }
                }

                data.image = "";
                data.discount = "";

                if (item?.pricing[0]?.image[0]) {
                  data.image = imgPath.concat(item.pricing[0].image[0]);
                }

                if (item?.pricing[0]) {
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
                } else {
                  data.price = 0;
                  data.spl_price = 0;
                  data.uom = uomTitle;
                  data.varientId = "";
                }

                items.push(data);
              }
            }
          }
        }

        // get cart count
        let cartCount = await Cart.countDocuments({
          userId: mongoose.Types.ObjectId(req.user._id),
        });

        res.status(200).json({
          error: false,
          message: "Sub categories are",
          data: {
            image: category.image,
            category: category.title,
            sub_category: subCategories,
            products: items,
            favouriteCount: favouriteCount,
            cartCount: cartCount,
          },
        });
        // });
      } else {
        res.status(200).json({
          error: false,
          message: "No data found",
          data: {
            image: "",
            category: "",
            sub_category: "",
            products: "",
            favouriteCount: 0,
            cartCount: 0,
          },
        });
      }

      // Most buyed product listing - Pending
    } catch (error) {
      next(error);
    }
  },

  getProducts: async (req, res, next) => {
    try {
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
      let limit = 0;
      if (req.body.limit) {
        limit = parseInt(req.body.limit);
      }

      if (limit == 0) limit = 30;
      var skip = (parseInt(req.body.page) - 1) * parseInt(limit);

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
        //  console.log(ids._id)
        ids.products = [];
        let productDetails = await Inventory.find(
          {
            categories: ids._id + "",
            isDisabled: false,
            type: categoryTypeHealth,
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
            "pricing._id": 1,
            brand: 1,
          }
        )
          .sort({ $natural: -1 })
          .limit(limit)
          .skip(skip)
          .lean();

        let count = 0;
        for (let item of productDetails) {
          //console.log(item._id);
          count++;
          if (count == 5) {
            var data = {
              _id: "",
              title: "",
              stockStatus: "",
              image: "",
              discount: "",
              price: 0,
              spl_price: 0,
              uom: "",
              varientId: "",
            };

            ids.products.push(data);
          }
          if (count == 9) {
            var data = {
              _id: "",
              title: "",
              stockStatus: "",
              image: "",
              discount: "",
              price: 0,
              spl_price: 0,
              uom: "",
              varientId: "",
            };
            ids.products.push(data);
          }

          var checkStock = false;
          let uomTitle = "";

          var data = {
            _id: item._id,
            title: item.name,
          };

          let brand = await MasterBrand.findOne(
            { _id: mongoose.Types.ObjectId(item.brand) },
            {
              title: 1,
            }
          );
          if (brand) {
            //data.brand = brand.title;
            /* checking product brand name exist or not  */
            if (!productBrands.some((e) => e.title === brand.title)) {
              productBrands.push(brand);
            }
          }
          if (item.pricing) {
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

                  // items.push(data)

                  ids.products.push(data);
                }
              }
            }

            if (!checkStock) {
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

              ids.products.push(data);
              // items.push(data)
            }
          }
        }

        if (!is_subSubCategory) {
          ids._id = "";
          ids.title = "";
          ids.image = "";
        }
      }

      // let pageSize=0;
      // if(req.body.limit){
      //    pageSize = req.body.limit;
      // }else{
      //    pageSize = 10;
      // }
      // let pageNo = req.body.page;
      // const customLabels = {
      //   totalDocs: "TotalRecords",
      //   docs: "products",
      //   limit: "PageSize",
      //   page: "CurrentPage",
      // };

      // const aggregatePaginateOptions = {
      //   page: pageNo,
      //   limit: pageSize,
      //   customLabels: customLabels,
      // };
      // let response = await Inventory.aggregatePaginate(
      //   subSubcategoryDetails,
      //   aggregatePaginateOptions
      // );

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
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getProductDetails: async (req, res, next) => {
    try {
      //favourite count
      let favouriteCount = await InventoryFavourite.find({
        userId: req.user._id,
      }).countDocuments();

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
        if (items.direction_use == "undefined") {
          items.direction_use = "";
        }
        if (items.description == "undefined") {
          items.description = "";
        }
        if (items.productDetails == "undefined") {
          items.productDetails = "";
        }
        if (items.ingredients == "undefined") {
          items.ingredients = "";
        }
        if (items.sideEffects == "undefined") {
          items.sideEffects = "";
        }
        if (items.warning == "undefined") {
          items.warning = "";
        }
        if (items.metaTitles == "undefined") {
          items.metaTitles = "";
        }
        if (items.metaDescription == "undefined") {
          items.metaDescription = "";
        }

        let reProducts = [];
        let subProducts = [];
        let pricings = [];
        let outOfStockPricings = [];
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

          // Checking varient is in favourite
          let is_fav = 0;

          let favourite = await InventoryFavourite.findOne({
            productUomId: mongoose.Types.ObjectId(pricing._id),
            userId: mongoose.Types.ObjectId(req.user._id),
          }).countDocuments();

          if (favourite > 0) {
            is_fav = 1;
          }

          // pricingDetails.image = "";
          pricingDetails.discount = 0;
          pricingDetails.expire_on = "";
          pricingDetails.is_fav = is_fav;

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

          if (pricingDetails.stockStatus == "Out of stock") {
            outOfStockPricings.push(pricingDetails);
          } else {
            pricings.push(pricingDetails);
          }
        }

        items.pricing = [...pricings, ...outOfStockPricings];
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
        let average = 0;
        let ratingCount = 0;
        if (averageRating[0]?.avgStar) {
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
        const result = {};
        for (const { _id, percent } of starRating) {
          result[_id] = percent;
        }
        if (result["1"] == undefined) result[1] = 0;
        if (result["2"] == undefined) result[2] = 0;
        if (result["3"] == undefined) result[3] = 0;
        if (result["4"] == undefined) result[4] = 0;
        if (result["5"] == undefined) result[5] = 0;
        items.star_rating = result;

        items.rating = average;

        // dummy data----------
        // items.star_rating = [
        //   {
        //     1: "20",
        //     2: "40",
        //     3: "50",
        //     4: "100",
        //     5: "50",
        //   },
        // ];
        // items.rating = 4;
      }

      //recently viwed products  code
      let history = {};
      history.productId = req.body.id;
      history.userId = req.user._id;
      let duplicate = await cartHelper.checkDuplicateHistory(history);
      if (!duplicate) {
        let validProduct = await cartHelper.getProductDetails(
          history.productId
        );
        if (validProduct) {
          let HistoryCount = await RecentlyViewed.countDocuments({
            userId: mongoose.Types.ObjectId(req.user._id),
          });
          if (HistoryCount > 20) {
            await RecentlyViewed.deleteOne({
              userId: mongoose.Types.ObjectId(req.user._id),
            });
          }
          let newHistory = new RecentlyViewed(history);
          newHistory.save();
        }
      }

      if (!productDetails.length) {
        productDetails[0] = {};
      }

      // get cart count
      let cartCount = await Cart.countDocuments({
        userId: mongoose.Types.ObjectId(req.user._id),
      });

      res.status(200).json({
        error: false,
        message: "Products details are",
        data: {
          products: productDetails[0],
          favouriteCount: favouriteCount,
          cartCount: cartCount,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /* check pincode availble or not
    ============================================= */
  pincodeCheck: async (req, res, next) => {
    try {
      let pincode = req.body.pincode;
      let storeProductDetails = "";

      // checking pincode available
      let result = await Store.findOne(
        {
          isDisabled: false,
          serviceablePincodes: {
            $elemMatch: {
              code: pincode,
              active: true,
            },
          },
        },
        {
          name: 1,
          parent: 1,
        }
      );
      console.log("store :" + result);

      let isMaster = false;

      if (result) {
        if (result.parent) {
          const parent = result.parent;
          // check quantity exist in store
          let storeProductExist = await StoreProduct.findOne({
            storeId: result._id,
            varientId: req.body.varientId,
            stock: { $gte: 1 },
          }).populate({ path: "storeId", select: ["_id", "name", "parent"] });
          console.log("storeProductExist1 :" + storeProductExist);
          if (storeProductExist) {
            res.status(200).json({
              error: false,
              message: "Delivery Available",
              data: {
                pincode: pincode,
                price: storeProductExist.price,
                special_price: storeProductExist.specialPrice,
                stock: storeProductExist.stock,
              },
            });
          } else {
            // check quantity exist in next store
            let storeProductExist = await StoreProduct.findOne({
              storeId: result.parent,
              varientId: req.body.varientId,
              stock: { $gte: 1 },
            }).populate({ path: "storeId", select: ["_id", "name", "parent"] });
            console.log("storeProductExist2 :" + storeProductExist);
            if (storeProductExist) {
              res.status(200).json({
                error: false,
                message: "Delivery Available",
                data: {
                  pincode: pincode,
                  price: storeProductExist.price,
                  special_price: storeProductExist.specialPrice,
                  stock: storeProductExist.stock,
                },
              });
            } else {
              // get the parent store id
              let result = await Store.findOne(
                {
                  isDisabled: false,
                  _id: parent,
                },
                {
                  name: 1,
                  parent: 1,
                }
              );
              console.log(result);
              if (parent) {
                let storeProductExist = await StoreProduct.findOne({
                  storeId: result._id,
                  varientId: req.body.varientId,
                  stock: { $gte: 1 },
                }).populate({
                  path: "storeId",
                  select: ["_id", "name", "parent"],
                });
                console.log("storeProductExist3 :" + storeProductExist);
                if (storeProductExist) {
                  res.status(200).json({
                    error: false,
                    message: "Delivery Available",
                    data: {
                      pincode: pincode,
                      price: storeProductExist.price,
                      special_price: storeProductExist.specialPrice,
                      stock: storeProductExist.stock,
                    },
                  });
                } else {
                  //   master
                }
              } else {
                // master
              }
            }
          }
        } else {
          // master
        }
      } else {
        res.status(200).json({
          error: true,
          message: "Delivery not Available",
          data: {
            pincode: pincode,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /* Update or remove products in favourite list
    ============================================= */
  updateFavorites: async (req, res, next) => {
    try {
      let data = req.body;
      let userId = req.user._id;
      let isProduct = await Inventory.findOne({
        _id: data.productId,
      });
      // checking product id exist or not
      if (isProduct) {
        // checking product varient exist or not
        // let isProductVarient = await Inventory.findOne({
        //   "pricing._id": mongoose.Types.ObjectId(data.varientId),
        //   _id: data.productId,
        // });

        const validProduct = await Inventory.findOne({
          _id: data.productId,
          "pricing._id": {
            $in: [mongoose.Types.ObjectId(data.varientId)],
          },
          isDisabled: false,
        });

        if (validProduct) {
          const variantDetails = _.find(validProduct.pricing, {
            _id: mongoose.Types.ObjectId(data.varientId),
          });

          // checking favourite exist or not
          let existFavourite = await InventoryFavourite.findOne({
            userId: userId,
            productUomId: data.varientId,
          });

          // if product is not existing then it is added to favourites
          if (!existFavourite) {
            data.userId = userId;
            data.productUomId = data.varientId;
            data.variantDetails = variantDetails;
            let schemaObj = new InventoryFavourite(data);
            schemaObj
              .save()
              .then(async (response) => {
                let existing = await mostFavouriteProduct.findOne({
                  productId: data.productId,
                });

                if (existing) {
                  await mostFavouriteProduct.updateOne(
                    {
                      productId: data.productId,
                    },
                    { $inc: { count: 1 } }
                  );
                } else {
                  let obj = {
                    productId: data.productId,
                    count: 1,
                    type: validProduct.type,
                  };

                  let newObj = mostFavouriteProduct(obj);
                  newObj.save();
                }

                res.status(200).json({
                  error: false,
                  status: true,
                  message: "Favourites added successfully",
                });
              })
              .catch(async (error) => {
                res.status(200).json({
                  error: true,
                  data: error.message,
                });
              });
          } else {
            InventoryFavourite.deleteOne({
              _id: mongoose.Types.ObjectId(existFavourite._id),
            }).then(async (response) => {
              let existing = await mostFavouriteProduct.findOne({
                productId: data.productId,
              });
              if (existing) {
                if (existing.count > 1) {
                  await mostFavouriteProduct.updateOne(
                    {
                      productId: data.productId,
                    },
                    { $inc: { count: -1 } }
                  );
                } else {
                  await mostFavouriteProduct.deleteOne({
                    _id: mongoose.Types.ObjectId(existing._id),
                  });
                }
              }
              res.status(200).json({
                error: false,
                status: false,
                message: "Favourites removed successfully",
              });
            });
          }
        } else {
          res.status(200).json({
            error: true,
            message: "Invalid varient id",
          });
        }
      } else {
        res.status(200).json({
          error: true,
          message: "Invalid product id",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  getFavourite: async (req, res, next) => {
    try {
      let products = [];
      let category = [];
      let banner = "";
      let banner_redtype = "";
      let recent_redtype = "";
      var bannerImage = await AdsMedimallSliderTopWishRecent.aggregate([
        {
          $match: {
            sliderType: bannerWishlist,
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
          $project: {
            _id: 1,
            type: 1,
            typeId: 1,
            image: { $concat: [imgPath, "$image"] },
            sliderType: 1,
            name: {
              $ifNull: [
                { $first: "$subCategory.title" },
                { $first: "$product.name" },
              ],
            },
          },
        },
      ]);
      if (bannerImage.length) {
        if (bannerImage[0].type == 0) banner_redtype = "product";
        else banner_redtype = "category";
        wishlistBanner = {
          image: bannerImage[0].image,
          redirectionType: banner_redtype,
          redirectionId: bannerImage[0].typeId,
          name: bannerImage[0].name,
        };
      } else {
        wishlistBanner = {
          image: "",
          redirectionType: "",
          redirectionId: "",
          name: "",
        };
      }

      var bannerRecentImage = await AdsMedimallSliderTopWishRecent.aggregate([
        {
          $match: {
            sliderType: bannerRecentlist,
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
          $project: {
            _id: 1,
            type: 1,
            typeId: 1,
            image: { $concat: [imgPath, "$image"] },
            sliderType: 1,
            name: {
              $ifNull: [
                { $first: "$subCategory.title" },
                { $first: "$product.name" },
              ],
            },
          },
        },
      ]);

      if (bannerRecentImage.length) {
        if (bannerRecentImage[0].type == 0) recent_redtype = "product";
        else recent_redtype = "category";
        recently_viewedBanner = {
          image: bannerRecentImage[0].image,
          redirectionType: recent_redtype,
          redirectionId: bannerRecentImage[0].typeId,
          name: bannerRecentImage[0].name,
        };
      } else {
        recently_viewedBanner = {
          image: "",
          redirectionType: "",
          redirectionId: "",
          name: "",
        };
      }

      let favourites = await InventoryFavourite.find(
        { userId: req.user._id },
        {
          productUomId: 1,
          productId: 1,
          isDisabled: 1,
          variantDetails: 1,
        }
      ).sort("-id");
      let items = [];

      for (let ids of favourites) {
        let productDetails = await Inventory.find(
          // { "pricing._id": mongoose.Types.ObjectId(ids.productUomId) },
          { _id: mongoose.Types.ObjectId(ids.productId) },
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
            brand: 1,
            isDisabled: 1,
          }
        )
          .populate({ path: "brand", select: ["title"] })
          .sort("-id");
        let isVarient = false;
        for (let item of productDetails) {
          let uomTitle = "";

          var data = {
            _id: item._id,
            title: item.name,
            brand: item.brand.title,
          };
          for (let pricing of item.pricing) {
            if (pricing._id == ids.productUomId + "") {
              isVarient = true;
              if (item.isDisabled == true) {
                data.stockStatus = "Out of stock";
              } else if (pricing.stock > item.statusLimit) {
                data.stockStatus = "Available";
              } else if (pricing.stock == 0) {
                data.stockStatus = "Out of stock";
              } else {
                data.stockStatus = "Limited";
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

              let cart = await Cart.findOne({
                variantId: pricing._id,
                userId: req.user._id,
              });

              if (cart) {
                data.is_cart = 1;
              } else {
                data.is_cart = 0;
              }

              data.real_price = pricing.price;
              data.spl_price = pricing.specialPrice;
              data.quantity = uomTitle;
              data.varient_id = pricing._id;
              // data.brand = brandName;

              items.push(data);
              break;
              //}
            }
          }

          // if varient id is not availble then take the details from inventory favourites
          if (!isVarient) {
            data.stockStatus = "Out of stock";
            let uomTitle = "";
            if (ids?.variantDetails?.sku) {
              let uom = await MasterUOMValue.findOne(
                { _id: mongoose.Types.ObjectId(ids.variantDetails.sku) },
                {
                  uomValue: 1,
                }
              );
              if (uom) {
                uomTitle = uom.uomValue;
              }
            }

            if (ids?.variantDetails?.image[0]) {
              data.image = imgPath.concat(ids.variantDetails.image[0]);
            }

            let discountPercentage = Math.round(
              ((ids.variantDetails.price - ids.variantDetails.specialPrice) /
                ids.variantDetails.price) *
                100
            );
            if (discountPercentage > 0 && discountPercentage < 100) {
              data.discount = discountPercentage;
            }
            data.is_cart = 0;
            data.real_price = ids.variantDetails.price;
            data.spl_price = ids.variantDetails.specialPrice;
            data.quantity = uomTitle;
            data.varient_id = ids.variantDetails._id;

            items.push(data);
          }
        }

        if (items) {
          products = items;
        }
      }

      let History = [];
      let Groom = await RecentlyViewed.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(req.user._id),
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
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
        let variant = [];
        for (let item of result) {
          for (let j of item.product) {
            for (let i of j.pricing) {
              let cart = await Cart.findOne({
                product_id: j._id,
                userId: req.user._id,
              });
              let is_cart = 0;
              if (cart) {
                is_cart = 1;
              }
              let stockStatus = "";

              // checking stock status
              if (i.stock > j.statusLimit) {
                stockStatus = "Available";
              } else if (i.stock == 0) {
                stockStatus = "Out of stock";
              } else {
                stockStatus = "Limited";
              }

              if (!j.isDisabled) {
                variant.push({
                  price: i.price,
                  spl_price: i.specialPrice,
                  image: process.env.BASE_URL.concat(i.image[0]),
                  description: j.description,
                  product: j.name,
                  product_id: j._id,
                  varient_id: i._id,
                  brand_name: item.brand.title,
                  brand_id: item.brand._id,
                  is_cart: is_cart,
                  stockStatus: stockStatus,
                });
                break;
              }
            }
          }
        }

        History = variant;
      });
      let discount = 0;
      for (var i = 0; i < History.length; i++) {
        History[i].discount = Math.floor(
          ((History[i].price - History[i].spl_price) / History[i].price) * 100
        );
      }
      let cart_count = await Cart.countDocuments({
        userId: mongoose.Types.ObjectId(req.user._id),
      });

      res.status(200).json({
        error: false,
        message: "Favourites data are",
        data: {
          cart_count: cart_count,
          wishlist: { banner: wishlistBanner, products },
          recently_viewed: { banner: recently_viewedBanner, prodcuts: History },
        },
      });
    } catch (error) {
      next(error);
    }
  },
  suggestProduct: async (req, res, next) => {
    try {
      let data = req.body;
      data.userId = req.user._id;
      let result = await InventorySuggested.findOne({
        title: data.title,
        userId: data.userId,
      });
      if (!result) {
        let schemaObj = new InventorySuggested(data);
        schemaObj
          .save()
          .then((response) => {
            res.status(200).json({
              error: false,
              message: "Product requested",
            });
          })
          .catch(async (error) => {
            res.status(200).json({
              status: false,
              data: error,
            });
          });
      } else {
        res.status(200).json({
          error: false,
          message:
            "your suggestion's been already recorded and shall be added soon",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  getSuggestProducts: async (req, res, next) => {
    try {
      let data = {};
      if (req.user) {
        data.userId = req.user._id;
        data.userName = req.user.name;
        if (req.user.image) {
          data.userImage = process.env.BASE_URL.concat(req.user.image);
        } else {
          data.userImage = process.env.BASE_URL.concat("medfeed/head.jpeg");
        }
        res.status(200).json({
          error: false,
          message: "user details are",
          data: data,
        });
      } else {
        res.status(200).json({
          error: true,
          message: "please login and try again",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  ListNotification: async (req, res, next) => {
    try {
      let userId = req.user._id;

      let notification = await Notification.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(userId),
            notification_type: "requested_product",
          },
        },
        {
          $project: {
            notification_content: 1,
            // userId: 1,
            date: "$createdAt",
          },
        },
      ]);
      if (notification.length) {
        for (i = 0; i < notification.length; i++) {
          let time = timeSince(notification[i].date);
          notification[i].date = time;
        }
        res.status(200).json({
          error: false,
          message: "user notfications are are",
          data: notification,
        });
      } else {
        res.status(200).json({
          error: false,
          message: "you have no notification yet",
          data: [],
        });
      }
    } catch (error) {
      next(error);
    }
  },
  searchInventory: async (req, res, next) => {
    try {
      let result = [];
      let productIds = [];
      let finalResult = [];
      let categories = [];
      let keyword = req.body.keyword;
      let brand = await MasterBrand.find({
        title: { $regex: `${keyword}`, $options: "i" },
      });
      let subCategory = await MasterSubCategoryMedicine.find({
        title: { $regex: `${keyword}`, $options: "i" },
        isDisabled: false,
      }).lean();
      let subhealthCareCategory = await MasterSubCategoryHealthcare.find({
        title: { $regex: `${keyword}`, $options: "i" },
        isDisabled: false,
      }).lean();
      if (subhealthCareCategory.length) {
        let subsubCat = [];
        for (let ii of subhealthCareCategory) {
          subsubCat.push(ii._id);
        }
        let subSubCategory1 = await MasterSubSubCategory.find({
          subCategoryId: subsubCat,
          isDisabled: false,
        }).lean();
        if (subSubCategory1.length) {
          subSubCategory1.map((category) =>
            categories.push(category._id.toString())
          );
        }
      }
      let subSubCategory = await MasterSubSubCategory.find({
        title: { $regex: `${keyword}`, $options: "i" },
        isDisabled: false,
      }).lean();
      let productByName = await Inventory.find(
        {
          isDisabled: false,
          $or: [
            { name: { $regex: `${keyword}`, $options: "i" } },
            { tags: { $regex: `${keyword}`, $options: "i" } },
          ],
        },
        {
          tags: 1,
          type: 1,
          productId: 1,
          prescription: 1,
          name: 1,
          brand: 1,
          statusLimit: 1,
          "pricing.image": 1,
          "pricing.price": 1,
          "pricing.specialPrice": 1,
          "pricing.uom": 1,
          "pricing.sku": 1,
          "pricing.stock": 1,
          "pricing._id": 1,
          "pricing.expiryDate": 1,

          categories: 1,
        }
      )
        .populate({ path: "brand", select: ["title"] })
        .lean();
      for (let item of productByName) {
        result.push(item);
      }

      if (subCategory.length) {
        subCategory.map((category) => categories.push(category._id.toString()));
      }
      if (subhealthCareCategory.length) {
        subhealthCareCategory.map((category) =>
          categories.push(category._id.toString())
        );
      }
      if (subSubCategory.length) {
        subSubCategory.map((category) =>
          categories.push(category._id.toString())
        );
      }
      if (categories.length) {
        let products = await Inventory.find(
          { categories: { $in: categories }, isDisabled: false },
          {
            type: 1,
            tags: 1,
            productId: 1,
            prescription: 1,
            name: 1,
            brand: 1,
            statusLimit: 1,
            "pricing.image": 1,
            "pricing.price": 1,
            "pricing.specialPrice": 1,
            "pricing.uom": 1,
            "pricing.sku": 1,
            "pricing.stock": 1,
            "pricing._id": 1,
            "pricing.expiryDate": 1,
            categories: 1,
          }
        )
          .populate({ path: "brand", select: ["title"] })
          .lean();
        for (let product of products) {
          result.push(product);
        }
      }
      if (brand.length) {
        let sortBybrand = brand.length ? true : false;
        let sortByBrandQuery = [];
        if (sortBybrand) {
          brand.map((brand) =>
            sortByBrandQuery.push({ brand: mongoose.Types.ObjectId(brand._id) })
          );
        }
        // for (let item of brand) {
        let products = await Inventory.find(
          { ...(sortBybrand && { $or: sortByBrandQuery }), isDisabled: false },
          {
            type: 1,
            tags: 1,
            productId: 1,
            prescription: 1,
            name: 1,
            brand: 1,
            statusLimit: 1,
            "pricing.image": 1,
            "pricing.price": 1,
            "pricing.specialPrice": 1,
            "pricing.uom": 1,
            "pricing.sku": 1,
            "pricing.stock": 1,
            "pricing._id": 1,
            "pricing.expiryDate": 1,

            categories: 1,
          }
        )
          .populate({ path: "brand", select: ["title"] })
          .lean();
        for (let product of products) {
          result.push(product);
        }
        // }
      }

      for (let item of result) {
        if (!productIds.includes(item.productId)) {
          productIds.push(item.productId);
          var checkStock = false;
          let uomTitle = "";
          let uomValueTitle = "";

          var data = {
            _id: item._id,
            title: item.name,
            brand: item.brand,
            prescription: item.prescription,
            type: item.type,
            tags: item.tags,
            rating: "4.5",
          };
          if (!data.prescription) {
            data.prescription = false;
          }
          if (item.pricing) {
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

                  let masterUomTitle = await MasterUOM.findOne(
                    { _id: mongoose.Types.ObjectId(pricing.uom) },
                    {
                      title: 1,
                    }
                  );
                  if (masterUomTitle) {
                    uomValueTitle = masterUomTitle.title;
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
                    data.discount = discountPercentage;
                  }

                  data.price = pricing.price;
                  data.spl_price = pricing.specialPrice;
                  data.uom = uomValueTitle;
                  data.uomValue = uomTitle;
                  data.varientId = pricing._id;
                  if (item.type == "medicine") {
                    const expiryDate = new Date(
                      moment(pricing.expiryDate, "YYYY-MM-DD")
                    ).getTime();
                    const currentExpiredTime = new Date(
                      moment().tz("Asia/Kolkata").utc()
                    ).getTime();
                    if (currentExpiredTime < expiryDate) {
                      finalResult.push(data);
                    }
                  } else {
                    finalResult.push(data);
                  }
                }
              }
            }
            if (!checkStock) {
              data.stockStatus = "Out of stock";
              if (item.pricing.length) {
                if (item.pricing[0]?.sku) {
                  let uom = await MasterUOMValue.findOne(
                    { _id: mongoose.Types.ObjectId(item.pricing[0].sku) },
                    {
                      uomValue: 1,
                    }
                  );
                  if (uom) {
                    uomTitle = uom.uomValue;
                  }
                }
                if (item.pricing[0]?.uom) {
                  let masterUomTitle = await MasterUOM.findOne(
                    { _id: mongoose.Types.ObjectId(item.pricing[0].uom) },
                    {
                      title: 1,
                    }
                  );
                  if (masterUomTitle) {
                    uomValueTitle = masterUomTitle.title;
                  }
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
                  data.discount = discountPercentage;
                }

                data.price = item.pricing[0].price;
                data.spl_price = item.pricing[0].specialPrice;
                data.uom = uomValueTitle;
                data.uomValue = uomTitle;
                data.varientId = item.pricing[0]._id;
                finalResult.push(data);
              }
            }
          }
        }
      }
      let page = parseInt(req.body.page) - 1;
      let limit = parseInt(req.body.limit);

      let nextPage = false;
      let start = page * limit;
      let end = page * limit + limit;
      let newResult = finalResult.slice(start, end);
      if (finalResult.length > end) {
        nextPage = true;
      } else {
        nextPage = false;
      }
      if (finalResult.length == 0) {
        nextPage = false;
      }
      let totalPage = Math.ceil(finalResult.length / limit);
      res.status(200).json({
        status: true,
        data: {
          result: newResult,
          nextPage: nextPage,
          totalPage: totalPage,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getWebCategoriess: async (req, res, next) => {
    try {
      let banner = await webBanner
        .findOne(
          {},
          {
            image: { $concat: [process.env.BASE_URL, "$image"] },
            redirection_type: 1,
            redirection_id: 1,
          }
        )
        .lean();
      if (banner) {
        if (banner.redirection_type == "product") {
          let productss = await Inventory.findOne(
            {
              _id: banner.redirection_id,
            },
            {
              name: 1,
              metaTitles: 1,
              brand: 1,
            }
          ).populate({ path: "brand", select: ["_id", "title"] });
          if (productss) {
            banner.product = productss;
          }
        } else {
          let categories = await MasterSubCategoryHealthcare.findOne({
            _id: banner.redirection_id,
          });
          if (categories) {
            banner.categoryId = categories.categoryId;
          }
        }
      }
      let category = await MasterCategory.find(
        { categoryType: categoryTypeHealth, isDisabled: false },
        {
          title: 1,
          image: { $concat: [imgPath, "$image"] },
        }
      );
      res.status(200).json({
        status: true,
        data: category,
        banner,
      });
    } catch (error) {
      next(error);
    }
  },
  getWebSubCategoriess: async (req, res, next) => {
    try {
      let mainCategory = await MasterCategory.findOne(
        { _id: req.body.cat_id },
        {
          title: 1,
        }
      );
      let category = await MasterSubCategoryHealthcare.find(
        { categoryId: req.body.cat_id, isDisabled: false },
        {
          title: 1,
          image: { $concat: [imgPath, "$image"] },
        }
      );
      res.status(200).json({
        status: true,
        data: {
          category,
          mainCategory,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getWebProductListBySubcatgory: async (req, res, next) => {
    try {
      let subSubCategory = await MasterSubSubCategoryHealthcare.find(
        { subCategoryId: req.body.sub_id },
        {
          title: 1,
          image: { $concat: [process.env.BASE_URL, "$image"] },
        }
      ).lean();
      let items = [];
      let categories = [];
      if (subSubCategory.length) {
        subSubCategory.map((item) => categories.push(item._id.toString()));
      } else {
        categories.push(req.body.sub_id);
      }

      // for (let ids of subSubCategory) {
      let productDetails = await Inventory.find(
        {
          categories: { $in: categories },
          type: "healthcare",
        },
        {
          name: 1,
          brand: 1,
          metaTitles: 1,
          prescription: 1,
          statusLimit: 1,
          metaDescription: 1,
          "pricing.image": 1,
          "pricing.price": 1,
          "pricing.specialPrice": 1,
          "pricing.uom": 1,
          "pricing.sku": 1,
          "pricing.stock": 1,
          "pricing._id": 1,
          categories: 1,
        }
      )
        .populate({ path: "brand", select: ["_id", "title"] })
        .sort({ _id: -1 });
      for (let item of productDetails) {
        var checkStock = false;
        let uomTitle = "";

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
        let average = 0;
        if (averageRating[0]?.avgStar) {
          average = averageRating[0].avgStar;
        }

        var data = {
          _id: item._id,
          title: item.name,
          categories: item.categories,
          brand: item.brand,
          rating: average,
          prescription: item.prescription,
          metaDescription: item.metaDescription,
          metaTitles: item.metaTitles,
        };
        if (item.pricing.length) {
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
              }
            }
          }

          if (!checkStock) {
            data.stockStatus = "Out of stock";
            if (item.pricing[0]?.sku) {
              let uom = await MasterUOMValue.findOne(
                { _id: mongoose.Types.ObjectId(item.pricing[0].sku) },
                {
                  uomValue: 1,
                }
              );
              if (uom) {
                uomTitle = uom.uomValue;
              }
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
      }
      // }
      let brands = [];
      let brandIds = [];
      for (let item of items) {
        if (item.brand) {
          if (!brandIds.includes(item.brand._id + "")) {
            brandIds.push(item.brand._id + "");
            brands.push({
              _id: item.brand._id,
              name: item.brand.title,
              count: 0,
            });
          }
        }
      }
      //Brand Listing
      for (let brand of brands) {
        for (let product of items) {
          if (product.brand) {
            if (product.brand._id == brand._id) {
              brand.count++;
            }
          }
        }
      }
      let newBrand = [...new Set(brands)];

      //Category Listing

      for (let item of subSubCategory) {
        let count = 0;
        for (let itm of items) {
          if (itm.categories.includes(item._id + "")) {
            count++;
            item.count = count;
          }
        }
      }

      let popularBrand = await MasterBrand.find(
        { isDisabled: false, isPromoted: true },
        {
          image: { $concat: [process.env.BASE_URL, "$image"] },
          title: 1,
        }
      );

      let banner = await webBanner
        .findOne(
          {},
          {
            image: { $concat: [process.env.BASE_URL, "$image"] },
            redirection_type: 1,
            redirection_id: 1,
          }
        )
        .lean();
      if (banner) {
        if (banner.redirection_type == "product") {
          let productss = await Inventory.findOne(
            {
              _id: banner.redirection_id,
            },
            {
              name: 1,
              metaTitles: 1,
              brand: 1,
            }
          ).populate({ path: "brand", select: ["_id", "title"] });
          if (productss) {
            banner.product = productss;
          }
        } else {
          let subCategories = await MasterSubCategoryHealthcare.findOne({
            _id: banner.redirection_id,
          });
          if (subCategories) {
            banner.categoryId = subCategories.categoryId;
          }
        }
      }
      let page = parseInt(req.body.page) - 1;
      let limit = parseInt(req.body.limit);

      let nextPage = false;
      let start = page * limit;
      let end = page * limit + limit;
      let newResult = items.slice(start, end);
      if (items.length > end) {
        nextPage = true;
      } else {
        nextPage = false;
      }
      if (items.length == 0) {
        nextPage = false;
      }
      let totalPage = Math.ceil(items.length / limit);
      for (let item of newResult) {
        if (item.brand?.title) {
          item.brand = item.brand.title;
        } else {
          item.brand = "";
        }
      }
      res.status(200).json({
        status: true,
        data: {
          subSubCategory,
          brands: newBrand,
          popularBrand,
          banner,
          totalPage,
          nextPage,
          newResult,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getHistoryProducts: async (req, res, next) => {
    try {
      let History = [];
      let Groom = await RecentlyViewed.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(req.user._id),
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product",
          },
        },
      ]).then(async (result) => {
        let variant = [];
        for (let item of result) {
          for (let j of item.product) {
            for (let i of j.pricing) {
              variant.push({
                real_price: i.price,
                special_price: i.specialPrice,
                image: i.image[0],
                title: j.name,
                description: j.description,
              });
              break;
            }
          }
        }
        History = variant;
      });

      res.status(200).json({
        error: false,
        message: "Products are",
        data: {
          History: History,
        },
      });
    } catch (error) {
      next(error);
      next(error);
    }
  },
  sortProductDetails: async (req, res, next) => {
    try {
      console.log(req.body);
      //Sort Products by brands
      let sortByBrandsArray = req.body.brands;
      let sortBybrand = sortByBrandsArray?.length ? true : false;
      let sortByBrandQuery = [];
      if (sortBybrand) {
        sortByBrandsArray.map((brand) =>
          sortByBrandQuery.push({ brand: mongoose.Types.ObjectId(brand) })
        );
      }

      //Sort prodcuts by Sub Sub Category
      let sortBySubCategoryArray = req.body.subCategories;
      let sortBySubCategories = sortBySubCategoryArray?.length ? true : false;
      let sortBySubCategoriesQuery;
      if (sortBySubCategories) {
        sortBySubCategoriesQuery = {
          categories: { $in: sortBySubCategoryArray },
        };
        let items = [];
        // for (let ids of subSubCategory) {
        let productDetails = await Inventory.find(
          {
            ...(sortBybrand && { $or: sortByBrandQuery }),
            ...(sortBySubCategories && sortBySubCategoriesQuery),
            isDisabled: false,
          },
          {
            name: 1,
            brand: 1,
            statusLimit: 1,
            "pricing.image": 1,
            "pricing.price": 1,
            "pricing.specialPrice": 1,
            "pricing.uom": 1,
            "pricing.sku": 1,
            "pricing.stock": 1,
            "pricing._id": 1,
            categories: 1,
          }
        )
          .populate({ path: "brand", select: ["_id", "title"] })
          .sort({ _id: -1 });
        for (let item of productDetails) {
          var checkStock = false;
          let uomTitle = "";

          var data = {
            _id: item._id,
            title: item.name,
            categories: item.categories,
            brand: item.brand,
            rating: "4.5",
          };
          if (item.pricing.length) {
            for (let pricing of item.pricing) {
              if (
                req.body.minPrice <= pricing.specialPrice &&
                req.body.maxPrice >= pricing.specialPrice
              ) {
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
                      data.discount = discountPercentage;
                    }

                    data.price = pricing.price;
                    data.spl_price = pricing.specialPrice;
                    data.uom = uomTitle;
                    data.varientId = pricing._id;

                    items.push(data);
                  }
                }
              }
            }
            if (!req.body.isIncludeOutOfStock) {
              if (
                req.body.minPrice <= item.pricing[0].specialPrice &&
                req.body.maxPrice >= item.pricing[0].specialPrice
              ) {
                if (!checkStock) {
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
                    data.discount = discountPercentage;
                  }

                  data.price = item.pricing[0].price;
                  data.spl_price = item.pricing[0].specialPrice;
                  data.uom = uomTitle;
                  data.varientId = item.pricing[0]._id;

                  items.push(data);
                }
              }
            }
          }
        }
        // }
        //Discount
        let sortByDiscounts = req.body.discounts;
        let sortByDiscount = sortByDiscounts?.length ? true : false;
        if (sortByDiscount) {
          let products = [];
          for (let amount of sortByDiscounts) {
            for (let item of items) {
              if (amount == 1) {
                if (10 >= item.discount) {
                  if (!products.includes(item)) {
                    products.push(item);
                  }
                }
              } else {
                if (amount <= item.discount) {
                  if (!products.includes(item)) {
                    products.push(item);
                  }
                }
              }
            }
          }
          items = products;
        }

        for (let i of items) {
          // console.log(i.discount.length);
          if (!i.discount == "") {
            i.discount = i.discount + "%";
          }
        }

        if (req.body.sort == "lowToHigh") {
          items = items.sort(dynamicSort("spl_price"));
        }
        if (req.body.sort == "highToLow") {
          items = items.sort(dynamicSort("spl_price")).reverse();
        }

        let page = parseInt(req.body.page) - 1;
        let limit = parseInt(req.body.limit);

        let nextPage = false;
        let start = page * limit;
        let end = page * limit + limit;
        let newResult = items.slice(start, end);
        if (items.length > end) {
          nextPage = true;
        } else {
          nextPage = false;
        }
        if (items.length == 0) {
          nextPage = false;
        }
        let totalPage = Math.ceil(items.length / limit);
        for (let item of newResult) {
          if (item.brand?.title) {
            item.brand = item.brand.title;
          } else {
            item.brand = "";
          }
        }

        res.status(200).json({
          status: true,
          data: {
            totalPage,
            nextPage,
            newResult,
          },
        });
      } else {
        let subSubCategory = await MasterSubSubCategoryHealthcare.find(
          { subCategoryId: req.body.sub_id },
          {
            title: 1,
          }
        ).lean();
        let categories = [];
        if (subSubCategory.length) {
          subSubCategory.map((item) => categories.push(item._id.toString()));
        } else {
          categories.push(req.body.sub_id);
        }
        let items = [];
        // for (let ids of subSubCategory) {
        let productDetails = await Inventory.find(
          {
            categories: { $in: categories },
            ...(sortBybrand && { $or: sortByBrandQuery }),
            isDisabled: false,
          },
          {
            name: 1,
            brand: 1,
            statusLimit: 1,
            "pricing.image": 1,
            "pricing.price": 1,
            "pricing.specialPrice": 1,
            "pricing.uom": 1,
            "pricing.sku": 1,
            "pricing.stock": 1,
            "pricing._id": 1,
            categories: 1,
          }
        )
          .populate({ path: "brand", select: ["_id", "title"] })
          .sort({ _id: -1 });
        for (let item of productDetails) {
          var checkStock = false;
          let uomTitle = "";

          var data = {
            _id: item._id,
            title: item.name,
            categories: item.categories,
            brand: item.brand,
            rating: "4.5",
          };
          if (item.pricing.length) {
            for (let pricing of item.pricing) {
              if (
                req.body.minPrice <= pricing.specialPrice &&
                req.body.maxPrice >= pricing.specialPrice
              ) {
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
                      data.discount = discountPercentage;
                    }

                    data.price = pricing.price;
                    data.spl_price = pricing.specialPrice;
                    data.uom = uomTitle;
                    data.varientId = pricing._id;

                    items.push(data);
                  }
                }
              }
            }
            if (!req.body.isIncludeOutOfStock) {
              // console.log("hi");
              if (
                req.body.minPrice <= item.pricing[0].specialPrice &&
                req.body.maxPrice >= item.pricing[0].specialPrice
              ) {
                if (!checkStock) {
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
                    data.discount = discountPercentage;
                  }

                  data.price = item.pricing[0].price;
                  data.spl_price = item.pricing[0].specialPrice;
                  data.uom = uomTitle;
                  data.varientId = item.pricing[0]._id;

                  items.push(data);
                }
              }
            }
          }
        }
        // }
        //Discount
        let sortByDiscounts = req.body.discounts;
        let sortByDiscount = sortByDiscounts?.length ? true : false;
        if (sortByDiscount) {
          let products = [];
          for (let amount of sortByDiscounts) {
            for (let item of items) {
              if (amount == 1) {
                if (10 >= item.discount) {
                  if (!products.includes(item)) {
                    products.push(item);
                  }
                }
              } else {
                if (amount <= item.discount) {
                  if (!products.includes(item)) {
                    products.push(item);
                  }
                }
              }
            }
          }
          items = products;
        }
        for (let i of items) {
          console.log(i.discount);
          if (!i.discount == "") {
            i.discount = i.discount + "%";
          }
        }
        if (req.body.sort == "lowToHigh") {
          items = items.sort(dynamicSort("spl_price"));
        }
        if (req.body.sort == "highToLow") {
          items = items.sort(dynamicSort("spl_price")).reverse();
        }
        let page = parseInt(req.body.page) - 1;
        let limit = parseInt(req.body.limit);

        let nextPage = false;
        let start = page * limit;
        let end = page * limit + limit;
        let newResult = items.slice(start, end);
        if (items.length > end) {
          nextPage = true;
        } else {
          nextPage = false;
        }
        if (items.length == 0) {
          nextPage = false;
        }
        let totalPage = Math.ceil(items.length / limit);
        for (let item of newResult) {
          if (item.brand?.title) {
            item.brand = item.brand.title;
          } else {
            item.brand = "";
          }
        }

        res.status(200).json({
          status: true,
          data: {
            totalPage,
            nextPage,
            newResult,
          },
        });

        // return res.json({status:'ok'})
        // console.log(req.body.brand[0])
        // let subSubCategory = await MasterSubSubCategoryHealthcare.find(
        //     { subCategoryId: req.body.sub_id },
        //     {
        //         title: 1,
        //     }
        // );
      }
    } catch (error) {}
  },
  getSearchSuggestion: async (req, res, next) => {
    try {
      let keyword = req.body.keyword;
      let finalResult = [];
      let brand = await MasterBrand.find({
        title: { $regex: `${keyword}`, $options: "i" },
        isDisabled: false,
      }).lean();
      let subCategory = await MasterSubCategoryMedicine.find({
        title: { $regex: `${keyword}`, $options: "i" },
        isDisabled: false,
      }).lean();
      let subhealthCareCategory = await MasterSubCategoryHealthcare.find({
        title: { $regex: `${keyword}`, $options: "i" },
        isDisabled: false,
      }).lean();
      let subSubCategory = await MasterSubSubCategory.find({
        title: { $regex: `${keyword}`, $options: "i" },
        isDisabled: false,
      }).lean();
      let productByName = await Inventory.find({
        $or: [
          { name: { $regex: `${keyword}`, $options: "i" } },
          { tags: { $regex: `${keyword}`, $options: "i" } },
        ],
        isDisabled: false,
      }).lean();
      for (let item of productByName) {
        if (!finalResult.includes(item.name)) {
          finalResult.push(item.name);
        }
      }
      for (let item of brand) {
        if (!finalResult.includes(item.title)) {
          finalResult.push(item.title);
        }
      }
      for (let item of subCategory) {
        if (!finalResult.includes(item.title)) {
          finalResult.push(item.title);
        }
      }
      for (let item of subhealthCareCategory) {
        if (!finalResult.includes(item.title)) {
          finalResult.push(item.title);
        }
      }
      for (let item of subSubCategory) {
        if (!finalResult.includes(item.title)) {
          finalResult.push(item.title);
        }
      }
      let page = parseInt(req.body.page) - 1;
      let limit = parseInt(req.body.limit);

      let nextPage = false;
      let start = page * limit;
      let end = page * limit + limit;
      let newResult = finalResult.slice(start, end);
      if (finalResult.length > end) {
        nextPage = true;
      } else {
        nextPage = false;
      }
      if (finalResult.length == 0) {
        nextPage = false;
      }
      let totalPage = Math.ceil(finalResult.length / limit);
      res.status(200).json({
        status: true,
        data: {
          result: newResult,
          nextPage: nextPage,
          totalPage: totalPage,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getBudgetStoreProducts: async (req, res, next) => {
    try {
      let result = await AdsSeasonalOfferBudgetStore.findOne(
        {
          _id: req.body.banner_id,
        },
        {
          categoryId: 1,
          priceUnder: 1,
          image: { $concat: [process.env.BASE_URL, "$image"] },
        }
      );
      if (result) {
        let mainCat = await MasterSubCategoryHealthcare.findOne(
          { _id: result.categoryId },
          {
            // title: 1,
            image: { $concat: [process.env.BASE_URL, "$banner"] },
          }
        ).lean();
        if (mainCat) {
          if (!mainCat.image) {
            mainCat.image = {};
          }
        }

        let subSubCategory = await MasterSubSubCategoryHealthcare.find(
          { subCategoryId: mongoose.Types.ObjectId(result.categoryId) },
          {
            title: 1,
            // image: { $concat: [process.env.BASE_URL, "$image"] },
          }
        ).lean();
        console.log(subSubCategory);
        let items = [];
        let categories = [];
        if (subSubCategory.length) {
          subSubCategory.map((item) => categories.push(item._id.toString()));
        } else {
          categories.push(result.categoryId.toString());
        }
        console.log(categories);

        let productDetails = await Inventory.find(
          {
            categories: { $in: categories },
            type: "healthcare",
          },
          {
            name: 1,
            brand: 1,
            statusLimit: 1,
            "pricing.image": 1,
            "pricing.price": 1,
            "pricing.specialPrice": 1,
            "pricing.uom": 1,
            "pricing.sku": 1,
            "pricing.stock": 1,
            "pricing._id": 1,
            categories: 1,
          }
        )
          .populate({ path: "brand", select: ["_id", "title"] })
          .sort({ _id: -1 });
        // console.log(productDetails);

        for (let item of productDetails) {
          var checkStock = false;
          let uomTitle = "";

          var data = {
            _id: item._id,
            title: item.name,
          };
          if (item.brand.title) {
            data.brand = item.brand.title;
          }
          if (item.pricing) {
            for (let pricing of item.pricing) {
              if (0 < pricing.price && result.priceUnder > pricing.price) {
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
            }

            if (!checkStock) {
              if (item.pricing.length) {
                if (
                  0 < item.pricing[0].price &&
                  result.priceUnder > item.pricing[0].price
                ) {
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
                    data.discount = discountPercentage;
                  }

                  data.price = item.pricing[0].price;
                  data.spl_price = item.pricing[0].specialPrice;
                  data.uom = uomTitle;
                  data.varientId = item.pricing[0]._id;

                  items.push(data);
                }
              }
            }
          }
        }
        let page = parseInt(req.body.page) - 1;
        let limit = parseInt(req.body.limit);

        let nextPage = false;
        let start = page * limit;
        let end = page * limit + limit;
        let newResult = items.slice(start, end);

        if (items.length > end) {
          nextPage = true;
        } else {
          nextPage = false;
        }
        if (items.length == 0) {
          nextPage = false;
        }
        let totalPage = Math.ceil(items.length / limit);
        let favouriteCount = await InventoryFavourite.find({
          userId: req.user._id,
        }).countDocuments();
        if (subSubCategory.image) {
        }

        const cartItemsCount = await Cart.countDocuments({
          userId: req.user._id,
        });

        res.status(200).json({
          status: true,
          data: {
            totalPage,
            nextPage,
            products: newResult,
            banner: mainCat.image,
            favouriteCount: favouriteCount,
            cartItemsCount,
          },
        });
      } else {
        res.status(200).json({
          message: "Something Went Wrong",
          error: true,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  addLocation: async (req, res, next) => {
    try {
      await user
        .updateOne({ _id: req.user._id }, { locality: req.body.location })
        .then(() => {
          res.status(200).json({
            error: false,
            message: "Location Added",
          });
        });
    } catch (error) {
      next(error);
    }
  },
  getRecentlySearchKeyword: async (req, res, next) => {
    try {
      let items = [];
      let item = ["test", "test1", "test2", "Test 3", "test4"];
      let productDetails = await Inventory.find(
        {},
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
          categories: 1,
        }
      )
        .sort({ _id: -1 })
        .limit(5);
      for (let item of productDetails) {
        let uomTitle = "";
        let uomValueTitle = "";

        var data = {
          _id: item._id,
          title: item.name,
          type: item.type,
        };
        if (item.pricing) {
          let uom = await MasterUOMValue.findOne(
            { _id: mongoose.Types.ObjectId(item.pricing[0].sku) },
            {
              uomValue: 1,
            }
          );
          if (uom) {
            uomTitle = uom.uomValue;
          }

          let masterUomTitle = await MasterUOM.findOne(
            { _id: mongoose.Types.ObjectId(item.pricing[0].uom) },
            {
              title: 1,
            }
          );
          if (masterUomTitle) {
            uomValueTitle = masterUomTitle.title;
          }
          data.image = "";
          if (item.pricing[0].image[0]) {
            data.image = imgPath.concat(item.pricing[0].image[0]);
          }
          data.price = item.pricing[0].price;
          data.spl_price = item.pricing[0].specialPrice;
          data.uom = uomValueTitle;
          data.uomValue = uomTitle;
          data.varientId = item.pricing[0]._id;
          items.push(data);
        }
      }
      res.status(200).json({
        status: true,
        data: {
          recentlySearch: item,
          recentlyPurchased: items,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  addSearchedProduct: async (req, res, next) => {
    try {
      let existing = await mostSearchProduct.findOne({
        productId: req.body.productId,
      });
      if (existing) {
        await mostSearchProduct
          .updateOne(
            {
              productId: req.body.productId,
            },
            { $inc: { count: 1 } }
          )
          .then(() => {
            res.status(200).json({
              error: false,
              message: "Added Successfully",
            });
          });
      } else {
        let product = await Inventory.findOne({ _id: req.body.productId });
        if (product) {
          let obj = {
            productId: req.body.productId,
            count: 1,
            type: product.type,
          };
          let newObj = mostSearchProduct(obj);
          newObj.save().then(() => {
            res.status(200).json({
              error: false,
              message: "Added Successfully",
            });
          });
        } else {
          res.status(200).json({
            error: true,
            message: "Product Not found",
          });
        }
      }
    } catch (error) {
      next(error);
    }
  },
  signinWithGoogle: async (req, res, next) => {
    try {
      if (!req.body.token) {
        return res.status(200).json({
          error: true,
          message: "Token Missing",
        });
      }
      let toScreen = 0;
      const ticket = await googleClient.verifyIdToken({
        idToken: req.body.token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const userDetails = {
        email: payload["email"],
        firstname: payload["given_name"],
        lastname: payload["family_name"],
      };
      console.log(userDetails);
      let existing = await user.findOne({ email: userDetails.email });
      if (existing) {
        if (existing.phone) {
          toScreen = 1;
        } else {
          toScreen = 0;
        }
        const token = createToken(existing._id);
        res.status(200).json({
          error: false,
          message: "Verified",
          data: {
            token: token,
            toScreen,
          },
        });
      } else {
        // -- logic for adding customerId
        // finding all users having customerId
        let allUsers = await user.find({ customerId: { $exists: true } });

        let newCustomerId = "";

        var dateVar = new Date();
        let lastTwoDigitsOfYear = dateVar.getFullYear().toString().substr(-2);
        let twoDigitMonth = ("0" + (dateVar.getMonth() + 1)).slice(-2);

        if (allUsers.length) {
          let lastUserId = allUsers[allUsers.length - 1].customerId;
          console.log("lastUserId", lastUserId);
          // splitted with spaces
          let splittedCustomerId = lastUserId.split(" ");
          console.log("splittedCustomerId", splittedCustomerId);

          let newCount =
            parseInt(splittedCustomerId[splittedCustomerId.length - 1]) + 1;

          newCustomerId = `UIN MDFL ${lastTwoDigitsOfYear} ${twoDigitMonth} ${newCount}`;
          console.log("newCustomerId", newCustomerId);
        } else {
          newCustomerId = `UIN MDFL ${lastTwoDigitsOfYear} ${twoDigitMonth} 12000`;
        }
        let obj = new user({
          name: userDetails.firstname,
          email: userDetails.email,
          customerId: newCustomerId,
        });
        obj.save().then(() => {
          const token = createToken(obj._id);
          res.status(200).json({
            error: false,
            message: "Verified",
            data: {
              token: token,
              toScreen: 0,
            },
          });
        });
      }
    } catch (error) {
      next(error);
    }
  },
  updateNumberForSocialAcoount: async (req, res, next) => {
    try {
      if (!req.body.number) {
        return res.status(200).json({
          error: true,
          message: "Number Missing",
        });
      }
      let existing = await user.findOne({ phone: req.body.number });
      if (existing) {
        return res.status(200).json({
          error: true,
          message: "Number Already Existing",
        });
      }

      let otp = Math.floor(1000 + Math.random() * 9000);
      console.log(otp);
      let otpExisting = await otpChecking.findOne({ phone: req.body.number });
      if (otpExisting) {
        TwoFactor.sendOTP(req.body.number, {
          otp: otp,
          template: "MEDIMALL",
        }).then(
          async (sessionId) => {
            let data = {
              phone: req.body.number,
              otpId: sessionId,
              userId: req.user._id,
            };
            await otpChecking
              .updateOne({ phone: req.body.number }, data)
              .then(() => {
                res.status(200).json({
                  error: false,
                  message: "OTP has sent to your phone number",
                });
              });
          },
          (error) => {
            res.status(200).json({
              error: true,
              message: "otp error-" + error,
            });
          }
        );
      } else {
        TwoFactor.sendOTP(req.body.number, {
          otp: otp,
          template: "MEDIMALL",
        }).then(
          async (sessionId) => {
            let obj = new otpChecking({
              phone: req.body.number,
              userId: req.user._id,
              otpId: sessionId,
            });
            obj.save().then(() => {
              res.status(200).json({
                error: false,
                message: "OTP has sent to your phone number",
              });
            });
          },
          (error) => {
            res.status(200).json({
              error: true,
              message: "otp error-" + error,
            });
          }
        );
      }
    } catch (error) {
      next(error);
    }
  },
  verifyOtpForSocialAccount: async (req, res, next) => {
    try {
      if (!req.body.number) {
        return res.status(200).json({
          error: true,
          message: "Number Missing",
        });
      }
      if (!req.body.otp) {
        return res.status(200).json({
          error: true,
          message: "Otp Missing",
        });
      }
      let existing = await otpChecking.findOne({
        phone: req.body.number,
        userId: req.user._id,
      });
      if (existing) {
        TwoFactor.verifyOTP(existing.otpId, req.body.otp).then(
          async (response) => {
            await user.updateOne(
              { _id: req.user._id },
              {
                phone: req.body.number,
              }
            );
            return res.status(200).json({
              error: false,
              message: "OTP has been succesfully verified",
            });
          },
          (error) => {
            res.status(200).json({
              error: true,
              message: "Invalid Otp",
            });
          }
        );
      } else {
        res.status(200).json({
          error: true,
          message: "Invalid Otp",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  signinWithFacebook: async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(200).json({
          error: true,
          message: "Unathurised",
        });
      }
      let toScreen = 0;
      if (req.user.phone) {
        toScreen = 1;
      } else {
        toScreen = 0;
      }
      const token = createToken(req.user._id);
      console.log(req.user);
      res.status(200).json({
        error: false,
        message: "Verified",
        data: {
          token,
          toScreen,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  myOrders: async (req, res, next) => {
    try {
      let result = await Order.aggregate([
        { $match: { userId: req.user._id } },
        {
          $project: {
            orderId: 1,
            orderStatus: 1,
            noOfItems: 1,
            firstProductName: { $first: "$products.productName" },
            totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
            // deliveryDate: 1,
            deliveredDate: 1,
            createdAt: 1,
            addressName: "$address.name",
            doctorRejectedDate: 1,
            pharmacyRejectedDate: 1,
            expectedDeliveryDate: 1,
            cancelledDate: 1,
          },
        },
        { $sort: { _id: -1 } },
      ]);

      for (let order of result) {
        if (order.orderStatus === "order placed") {
          order.statusDate = moment(order.expectedDeliveryDate)
            .tz(process.env.TIME_ZONE)
            .format("ddd DD MMM");
        }

        if (order.orderStatus === "doctor rejected") {
          order.statusDate = moment(order.doctorRejectedDate)
            .tz(process.env.TIME_ZONE)
            .format("ddd DD MMM");
        }

        if (order.orderStatus === "order confirmed") {
          order.statusDate = moment(order.expectedDeliveryDate)
            .tz(process.env.TIME_ZONE)
            .format("ddd DD MMM");
        }

        if (order.orderStatus === "order under review") {
          order.statusDate = moment(order.expectedDeliveryDate)
            .tz(process.env.TIME_ZONE)
            .format("ddd DD MMM");
        }

        if (order.orderStatus === "pharmacy rejected") {
          order.statusDate = moment(order.pharmacyRejectedDate)
            .tz(process.env.TIME_ZONE)
            .format("ddd DD MMM");
          delete order.pharmacyRejectedDate;
        }

        if (order.orderStatus === "order packed") {
          order.statusDate = moment(order.expectedDeliveryDate)
            .tz(process.env.TIME_ZONE)
            .format("ddd DD MMM");
        }

        if (order.orderStatus === "order shipped") {
          order.statusDate = moment(order.expectedDeliveryDate)
            .tz(process.env.TIME_ZONE)
            .format("ddd DD MMM");
        }

        if (order.orderStatus === "out for delivery") {
          order.statusDate = moment(order.expectedDeliveryDate)
            .tz(process.env.TIME_ZONE)
            .format("ddd DD MMM");
        }

        if (order.orderStatus === "delivered") {
          order.statusDate = moment(order.deliveredDate)
            .tz(process.env.TIME_ZONE)
            .format("ddd DD MMM");
        }

        if (order.orderStatus === "cancelled") {
          order.statusDate = moment(order.cancelledDate)
            .tz(process.env.TIME_ZONE)
            .format("ddd DD MMM");
        }

        if (order.orderStatus === "applied for return") {
          let returnOrderResult = await returnOrders.findOne({
            orderObjectId: order._id,
          });
          if (returnOrderResult) {
            order.statusDate = moment(returnOrderResult.createdAt)
              .tz(process.env.TIME_ZONE)
              .format("ddd DD MMM");
          }
        }

        if (order.orderStatus === "return approved") {
          let returnOrderResult = await returnOrders.findOne({
            orderObjectId: order._id,
          });

          if (returnOrderResult) {
            order.statusDate = moment(returnOrderResult.deliveryBoyAssignedDate)
              .tz(process.env.TIME_ZONE)
              .format("ddd DD MMM");
          }
        }

        if (order.orderStatus === "return picked up") {
          let returnPickedUp = await returnOrders.findOne({
            orderObjectId: order._id,
            collectedDate: { $exists: true },
          });

          if (returnPickedUp) {
            order.statusDate = moment(returnPickedUp.collectedDate)
              .tz(process.env.TIME_ZONE)
              .format("ddd DD MMM");
          }
        }

        if (order.orderStatus === "returned") {
          let returnOrderResult = await returnOrders.findOne({
            orderObjectId: order._id,
          });
          if (returnOrderResult) {
            order.statusDate = moment(returnOrderResult.returnApprovedDate)
              .tz(process.env.TIME_ZONE)
              .format("ddd DD MMM");
          }
        }

        order.createdAt = moment(order.createdAt).format("D MMMM YYYY");
        // order.deliveryDate = moment(order.deliveryDate).format("ddd DD MMM");
        delete order.doctorRejectedDate;
        delete order.expectedDeliveryDate;
        delete order.deliveredDate;
        delete order.cancelledDate;
      }

      return res.status(200).json({
        error: false,
        message: "success",
        data: {
          result,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  myOrdersDetails: async (req, res, next) => {
    try {
      if (!req.body.id) {
        return res.status(200).json({
          error: true,
          message: "Id is missing",
        });
      }
      let result = await Order.findOne(
        { _id: req.body.id },
        {
          __v: 0,
        }
      ).lean();

      // checking for cancel eligibility
      let eligibleForCancel = false;
      let eligibleForReturn = false;
      let totalCountOfProductsThatRequirePrescription = 0;

      if (result) {
        for (let item of result.products) {
          let products = await Inventory.findOne(
            {
              _id: item.product_id,
            },
            {
              policy: 1,
              pricing: 1,
            }
          ).populate({ path: "policy", select: ["cancel", "return"] });

          if (products) {
            // cancel eligibility
            let cancelOrderDate = new Date(
              moment(result.createdAt).add(products.policy.cancel, "days")
            );
            item.cancelEligibleDate =
              moment(cancelOrderDate).format("DD MMM YYYY");

            if (cancelOrderDate < new Date()) {
              item.eligibleForCancel = false;
            } else {
              item.eligibleForCancel = true;

              if (
                eligibleForCancel == false &&
                result.orderStatus != "cancelled" &&
                result.delivered == false &&
                result.eligibleForCancel
              ) {
                eligibleForCancel = true;
              }
            }

            // return eligibility
            let returnOrderDate = new Date(
              moment(result.createdAt).add(products.policy.return, "days")
            );
            item.returnEligibleDate =
              moment(returnOrderDate).format("DD MMM YYYY");

            let returnedOrder = await returnOrders.findOne({
              orderObjectId: result._id,
            });

            if (returnOrderDate < new Date() || returnedOrder) {
              item.eligibleForReturn = false;
            } else {
              item.eligibleForReturn = true;

              if (
                eligibleForReturn == false &&
                result.isReturned == false &&
                result.delivered
              ) {
                eligibleForReturn = true;
              }
            }

            // increasing prescriptionRequiredCount if this product is a needed one
            if (products.IsPrescriptionRequired) {
              totalCountOfProductsThatRequirePrescription++;
            }

            // temp code for getting sku or hsn no
            let x = products.pricing.filter((variant) => {
              if (variant._id + "" == item.variantId + "") {
                return variant;
              }
            });
            if (x.length) {
              item.skuOrHsnNo = x[0].skuOrHsnNo;
            }
          }
        }

        if (result.orderStatus === "placed") {
          result.orderStatus = "order placed";
        }

        result.eligibleForCancel = eligibleForCancel;
        result.eligibleForReturn = eligibleForReturn;
        result.totalCountOfProductsThatRequirePrescription =
          totalCountOfProductsThatRequirePrescription;

        // __ tracking dates
        result.trackingDates = {
          placed: moment(result.createdAt)
            .tz(process.env.TIME_ZONE)
            .format("ddd DD : YYYY h:mm a"),
          confirmed: "",
          underReview: "",
          packed: "",
          shipped: "",
          outForDelivery: "",
          delivered: "",
          cancelled: "",
          appliedForReturn: "",
          returned: "",
          doctorRejected: "",
          pharmacyRejected: "",
        };

        // order confirmed date
        let paymentAwaitedResult = await PaymentAwaited.findOne({
          orderObjectId: result._id,
        });
        if (paymentAwaitedResult) {
          result.trackingDates.confirmed = moment(
            paymentAwaitedResult.createdAt
          )
            .tz(process.env.TIME_ZONE)
            .format("ddd DD : YYYY h:mm a");
        } else {
          let packingpendingResult = await PackingPending.findOne({
            orderObjectId: result._id,
          });
          if (packingpendingResult) {
            result.trackingDates.confirmed = moment(result.createdAt)
              .tz(process.env.TIME_ZONE)
              .format("ddd DD : YYYY h:mm a");
          }
        }

        // order under review date
        let packingpendingResult = await PackingPending.findOne({
          orderObjectId: result._id,
        });
        if (packingpendingResult) {
          result.trackingDates.underReview = moment(
            packingpendingResult.createdAt
          )
            .tz(process.env.TIME_ZONE)
            .format("ddd DD : YYYY h:mm a");
        } else {
          let reviewPendingResult = await ReviewPending.findOne({
            orderObjectId: result._id,
          });
          if (reviewPendingResult) {
            result.trackingDates.underReview = moment(
              reviewPendingResult.createdAt
            )
              .tz(process.env.TIME_ZONE)
              .format("ddd DD : YYYY h:mm a");
          }
        }

        // order packed date
        let pickupPendingResult = await PickupPending.findOne({
          orderObjectId: result._id,
        });
        if (pickupPendingResult) {
          result.trackingDates.packed = moment(pickupPendingResult.createdAt)
            .tz(process.env.TIME_ZONE)
            .format("ddd DD : YYYY h:mm a");
        }

        // order shipped date
        let transitResult = await PickupPending.findOne({
          $and: [
            { orderObjectId: result._id },
            { $or: [{ status: "picked up" }, { status: "delivered" }] },
          ],
        });
        if (transitResult) {
          result.trackingDates.shipped = moment(transitResult.pickedUpDate)
            .tz(process.env.TIME_ZONE)
            .format("ddd DD : YYYY h:mm a");
        }

        // out for delivery date
        if (result.trackingDates.shipped != "") {
          result.trackingDates.outForDelivery = moment(
            result.expectedDeliveryDate
          )
            .tz(process.env.TIME_ZONE)
            .format("ddd DD : YYYY h:mm a");
        }

        // delivered date
        if (result.deliveredDate) {
          result.trackingDates.delivered = moment(result.deliveredDate)
            .tz(process.env.TIME_ZONE)
            .format("ddd DD : YYYY h:mm a");

          result.trackingDates.outForDelivery = moment(result.deliveredDate)
            .tz(process.env.TIME_ZONE)
            .format("ddd DD : YYYY h:mm a");
        }

        // cancelled date
        if (result.orderStatus == "cancelled") {
          result.trackingDates.cancelled = moment(result.cancelledDate)
            .tz(process.env.TIME_ZONE)
            .format("ddd DD : YYYY h:mm a");
        }

        // returned date
        if (result.isReturned) {
          result.trackingDates.returned = moment(result.returnedDate)
            .tz(process.env.TIME_ZONE)
            .format("ddd DD : YYYY h:mm a");
        }

        // doctor rejected date
        if (result.orderStatus == "doctor rejected") {
          result.trackingDates.doctorRejected = moment(
            result.doctorRejectedDate
          )
            .tz(process.env.TIME_ZONE)
            .format("ddd DD : YYYY h:mm a");
        }

        // pharmacy rejected date
        if (result.orderStatus == "pharmacy rejected") {
          result.trackingDates.pharmacyRejected = moment(
            result.pharmacyRejectedDate
          )
            .tz(process.env.TIME_ZONE)
            .format("ddd DD : YYYY h:mm a");
        }

        result.createdAt = moment(result.createdAt)
          .tz(process.env.TIME_ZONE)
          .format("DD : MM : YYYY");

        return res.status(200).json({
          error: false,
          message: "Success",
          data: {
            result,
          },
        });
      } else {
        res.status(200).json({
          error: true,
          message: "Invalid order id",
        });
      }

      res.status(200).json({
        error: false,
        message: "success",
        data: {
          result,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  createOrderInvoice: async (req, res, next) => {
    try {
      if (!req.body.orderId) {
        return res.status(200).json({
          error: true,
          message: "orderId missing",
        });
      }

      let orderDetails = await Order.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.body.orderId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $set: {
            userDetails: { $first: "$userDetails" },
          },
        },
      ]);

      if (!orderDetails.length) {
        return res.status(200).json({
          error: true,
          message: "Invalid orderId",
        });
      }

      orderDetails = orderDetails[0];

      orderDetails.createdAt = moment(orderDetails.createdAt)
        .tz(process.env.TIME_ZONE)
        .format("MMM, DD YYYY h:mm a");

      // fetching skuOrHsnNo of each order products
      for (let item of orderDetails.products) {
        let productDetails = await Inventory.findOne({ _id: item.product_id });

        let x = productDetails.pricing.filter((variant) => {
          if (variant._id + "" == item.variantId + "") {
            return variant;
          }
        });
        if (x.length) {
          item.skuOrHsnNo = x[0].skuOrHsnNo;
        }
      }

      let orderInvoice = await generatePdf(orderDetails);

      console.log("orderInvoice");

      let pdfFile = `${process.env.BASE_URL}order-invoice/pdf/${orderInvoice.PDFFileName}`;

      return res.status(200).json({
        error: false,
        message: "success",
        data: {
          pdfFile,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getWebCategories: async (req, res, next) => {
    try {
      // --------active category in healthcare (master settings)

      category = await MasterCategory.find(
        { categoryType: categoryTypeHealth, isDisabled: false },
        {
          title: 1,
        }
      );
      res.status(200).json({
        error: false,
        message: "Categories are",
        data: {
          category: category,
        },
      });
      // })
    } catch (error) {
      next(error);
    }
  },
  getWebSubCategories: async (req, res, next) => {
    try {
      let category = await MasterCategory.findOne({
        _id: req.body.cat_id,
        isDisabled: false,
      });
      if (category) {
        let subCategories = await MasterSubCategoryHealthcare.find(
          { categoryId: req.body.cat_id, isDisabled: false },
          {
            title: 1,
            categoryId: 1,
          }
        ).lean();

        if (subCategories.length) {
          console.log("subCategories", subCategories);
          for (let item of subCategories) {
            let subSubCategory = await MasterSubSubCategoryHealthcare.find(
              { subCategoryId: item._id, isDisabled: false },
              {
                title: 1,
                subCategoryId: 1,
              }
            ).lean();

            if (subSubCategory.length) {
              item.subSubCategorys = subSubCategory;
            } else {
              item.subSubCategorys = [];
            }
          }
        }
        res.status(200).json({
          error: false,
          message: "Sub categories are",
          data: {
            sub_category: subCategories,
          },
        });
      }

      // Most buyed product listing - Pending
    } catch (error) {
      next(error);
    }
  },

  recentlyPurchasedOrders: async (req, res, next) => {
    try {
      let result = [];
      console.log(req.user._id);
      let data = await Order.find({ userId: req.user._id })
        .sort({ _id: -1 })
        .lean();
      for (let item of data) {
        for (let product of item.products) {
          const newProduct = await doGetProductDetailsByProductAndVariantId(
            product.product_id,
            product.variantId
          );

          let obj = {
            cartId: product.cartId,
            variantId: product.variantId,
            product_id: product.product_id,
            quantity: product.quantity,
            productName: newProduct.productName,
            brandName: newProduct.brandName,
            type: newProduct.type,
            description: newProduct.description,
            IsPrescriptionRequired: newProduct.IsPrescriptionRequired,
            image: newProduct.image,
            price: newProduct.price,
            specialPrice: newProduct.specialPrice,
            uomValue: newProduct.uomValue,
            discountAmount: newProduct.discountAmount,
            discountInPercentage: newProduct.discountInPercentage,
            outOfStock: newProduct.outOfStock,
            isThisProductAddedToWhishList:
              product.isThisProductAddedToWhishList,
            purchasedOn: moment(item.createdAt).format("DD MMM YYYY"),
          };
          const { stockAvailable } =
            (await checkIfStockAvailable({
              variantId: product.variantId,
              productId: product.product_id,
              quantity: 1,
              userId: req.user._id,
            })) || {};
          if (stockAvailable) {
            obj.outOfStock = false;
          } else {
            obj.outOfStock = true;
          }
          result.push(obj);
        }
      }
      let favouriteCount = await InventoryFavourite.find({
        userId: req.user._id,
      }).countDocuments();
      const cartItemsCount = await Cart.countDocuments({
        userId: req.user._id,
      });
      res.status(200).json({
        error: false,
        message: "success",
        data: {
          result,
          favouriteCount,
          cartItemsCount,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getSubscriptions: async (req, res, next) => {
    try {
      let result = await UserSubscription.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(req.user._id),
          },
        },
        {
          $lookup: {
            from: "orders",
            localField: "orderId",
            foreignField: "_id",
            as: "order",
          },
        },
        { $unwind: "$order" },
        {
          $project: {
            products: 1,
            firstDeliveryDate: 1,
            nextDeliveryDate: 1,
            subscriptionId: 1,
            prescription: 1,
            cartDetails: "$order.cartDetails",
            address: "$order.address",
            active: 1,
            interval: 1,
            // prescription: 1
          },
        },
        { $sort: { _id: -1 } },
      ]);
      let banner = await ad1MedFillMedPride.findOne(
        { type: "medFill" },
        {
          image: { $concat: [imgPath, "$image"] },
        }
      );
      if (!banner) {
        banner = {};
      }

      result.forEach((item) => {
        item.firstDeliveryDate = moment(item.firstDeliveryDate)
          .tz(process.env.TIME_ZONE)
          .format("DD MMM YYYY");

        item.nextDeliveryDate = moment(item.nextDeliveryDate)
          .tz(process.env.TIME_ZONE)
          .format("DD MMM YYYY");
      });

      res.status(200).json({
        error: false,
        message: "success",
        data: {
          result,
          banner,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  activateOrDeactivateSubscription: async (req, res, next) => {
    try {
      if (!req.body.id) {
        res.status(200).json({
          error: true,
          message: "Subscription id missing",
        });
      }
      if (!req.body.status) {
        res.status(200).json({
          error: true,
          message: "status id missing",
        });
      }
      console.log(req.body.status);
      await UserSubscription.updateOne(
        {
          _id: mongoose.Types.ObjectId(req.body.id),
        },
        { $set: { active: req.body.status } }
      )
        .then(() => {
          res.status(200).json({
            error: false,
            message: "success",
          });
        })
        .catch((error) => {
          res.status(200).json({
            error: true,
            message: error,
          });
        });
    } catch (error) {
      next(error);
    }
  },
  updateSubscriptionPrescription: async (req, res, next) => {
    try {
      if (!req.body.subscriptionId) {
        return res.status(200).json({
          error: true,
          message: "Subscription id missing",
        });
      }

      if (!req.body.prescription) {
        return res.status(200).json({
          error: true,
          message: "Prescription missing",
        });
      }

      await UserSubscription.updateOne(
        { _id: req.body.subscriptionId },
        { $push: { prescription: req.body.prescription } }
      );

      return res.status(200).json({
        error: false,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  },
  deleteSubscriptionPrescription: async (req, res, next) => {
    try {
      //validate incoming data
      const dataValidation = await validateUpdatePrescriptionsOfSubscription(
        req.body
      );
      if (dataValidation.error) {
        const message = dataValidation.error.details[0].message.replace(
          /"/g,
          ""
        );
        return res.status(200).json({
          error: true,
          message: message,
        });
      }

      let validSubscription = await UserSubscription.findOne({
        _id: req.body.subscriptionId,
      });

      if (!validSubscription) {
        return res.status(200).json({
          error: true,
          message: "Invalid subscription id",
        });
      }

      await UserSubscription.updateOne(
        {
          _id: req.body.subscriptionId,
        },
        { $pullAll: { prescription: req.body.prescriptions } }
      );

      return res.status(200).json({
        error: false,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  },
  cancelOrder: async (req, res, next) => {
    try {
      if (!req.body.id) {
        res.status(200).json({
          error: true,
          message: "Order id missing",
        });
      }
      let cancelNotElgibleProducts = [];

      let data = await Order.findOne({
        _id: req.body.id,
        userId: req.user._id,
      });
      if (data) {
        for (let item of data.products) {
          let products = await Inventory.findOne(
            {
              _id: item.product_id,
            },
            {
              policy: 1,
            }
          ).populate({ path: "policy", select: ["cancel"] });
          if (products) {
            let orderDate = new Date(
              moment(data.createdAt).add(products.policy.cancel, "days")
            );
            console.log(orderDate);
            if (orderDate < new Date()) {
              cancelNotElgibleProducts.push(item);
            }
          }
        }
        if (cancelNotElgibleProducts.length) {
          return res.status(200).json({
            error: true,
            message: "Order Cannot Cancel",
          });
        } else {
          let cancelledDate = new Date();
          let cancelledFormattedDate =
            moment(cancelledDate).format("MMM DD, YYYY");

          // refundable amount
          let refundableAmount =
            data.cartDetails.totalAmountToBePaid -
            data.cartDetails.donationAmount;

          //_###_bank refund method
          if (req.body.refundMethod === "bank") {
            // retund cash to user's bank account
            const payment = await Payments.findOne({
              orderObjectId: req.body.id,
            });

            if (!payment) {
              return res.json({
                error: true,
                message: "Can't find payment info with this order id.",
              });
            }

            const refund = await razorpay.payments.refund(payment.paymentId, {
              amount: refundableAmount * 100,
            });

            //save payment log
            await new Payments({
              userId: data.userId,
              orderObjectId: data._id,
              // returnOrderObjectId: validReturnOrder._id
              paymentId: refund.payment_id,
              refundId: refund.id,
              type: "refund, cancel order",
            }).save();
          }

          //_###_medcoin refund method
          else if (req.body.refundMethod === "medcoin") {
            // increment user's med coin count
            await user.updateOne(
              { _id: data.userId },
              {
                $inc: { medCoin: refundableAmount },
              }
            );

            // reducing admin balance
            await incrementOrDecrementAdminMedCoinBalance(
              "dec",
              refundableAmount
            );

            // finding new admin and user's medcoin balance
            let newUserBalance = await user.findOne(
              { _id: data.userId },
              { medCoin: 1 }
            );
            let newAdminBalance = await MedCoinDetails.findOne();

            //create payment statement
            const statement = new MedCoin({
              type: "cancel order",
              medCoinCount: refundableAmount,
              customerId: data.userId,
              balance: newAdminBalance.availableBalance,
              customerBalance: newUserBalance.medCoin,
            });
            await statement.save();
          }

          await Order.updateOne(
            {
              _id: req.body.id,
              userId: req.user._id,
            },
            {
              $set: {
                orderStatus: "cancelled",
                cancelledDate: cancelledDate,
                cancelledFormattedDate: cancelledFormattedDate,
              },
            }
          );

          //sent sms

          await TwoFactor.sendTemplate(
            req.user.phone,
            "cancelled orders",
            [data.orderId, "5-7 buisness"],
            "MEDMAL"
          ).catch((error) => console.log(error));

          let refundMode = "cod";

          if (req.body.refundMethod === "medcoin") {
            refundMode = "Medcoin";
          } else if (req.body.refundMethod === "bank") {
            refundMode = "bank";
          }

          // sending email to customer
          let emailContents = {
            username: req.user.name,
            cancelledDate: cancelledFormattedDate,
            refundAmount: refundableAmount,
            orderId: data.orderId,
            products: data.products.map((product) => ({
              name: product.productName,
              image: product.image,
              description: product.description,
              quantity: product.quantity,
              amount: product.specialPrice,
              realPrice: product.price,
            })),
            amountPaid: data.cartDetails.totalAmountToBePaid,
            medCoinUsed: data.cartDetails.medCoinRedeemed,
            totalRefundable:
              req.body.refundMethod === "medcoin"
                ? refundableAmount + data.cartDetails.medCoinRedeemed
                : refundableAmount,
            amountSaved: data.cartDetails.totalDiscountAmount,
            paymentType: refundMode,
          };

          let emailTemplate = await generateOrderCancelledEMailTemplate(
            emailContents
          );

          let email = await sendMail(
            process.env.EMAIL_ID,
            req.user.email,
            "Order Cancelled",
            emailTemplate
          );
          console.log("email_:", email);

          return res.status(200).json({
            error: false,
            message: "Order Canceled Successfully",
          });
        }
      } else {
        res.status(200).json({
          error: true,
          message: "Invalid order id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  returnProduct: async (req, res, next) => {
    try {
      //validate incoming data
      // const dataValidation = await validateReturnOrder(req.body);
      // if (dataValidation.error) {
      //   const message = dataValidation.error.details[0].message.replace(
      //     /"/g,
      //     ""
      //   );
      //   return res.status(200).json({
      //     error: true,
      //     message: message,
      //   });
      // }

      // if (req.body.paymentType === 'bank') {
      //   const dataValidation = await validateReturnOrderBankDetails(req.body);
      //   if (dataValidation.error) {
      //     const message = dataValidation.error.details[0].message.replace(
      //       /"/g,
      //       ""
      //     );
      //     return res.status(200).json({
      //       error: true,
      //       message: message,
      //     });
      //   }
      // }

      let cancelNotElgibleProducts = [];
      if (!req.body.id && !req.body.refundableAmount) {
        return res.status(200).json({
          error: true,
          message: "Essential params missing",
        });
      }

      let data = await Order.findOne({
        _id: req.body.id,
        userId: req.user._id,
      }).lean();

      if (!data) {
        return res.status(200).json({
          error: true,
          message: "Invalid order id",
        });
      }

      for (let item of req.body.products) {
        let products = await Inventory.findOne(
          {
            _id: item.product_id,
          },
          {
            policy: 1,
          }
        ).populate({ path: "policy", select: ["return"] });
        if (products) {
          let orderDate = new Date(
            moment(data.createdAt).add(products.policy.return, "days")
          );
          if (orderDate < new Date()) {
            cancelNotElgibleProducts.push(item);
          }
        }
      }

      if (cancelNotElgibleProducts.length) {
        return res.status(200).json({
          error: true,
          message: "Not eligible for return",
        });
      }

      let requestedProducts = req.body.products;
      let orderdProducts = data.products;

      requestedProducts = requestedProducts.map((product) =>
        _.find(orderdProducts, {
          variantId: mongoose.Types.ObjectId(product.varientId),
        })
      );

      for (let item of orderdProducts) {
        let product = _.find(requestedProducts, {
          variantId: mongoose.Types.ObjectId(item.variantId),
        });
        if (product) {
          item.returnStatus = "requested";
        } else {
          item.returnStatus = "";
        }
      }

      await Order.updateOne(
        {
          _id: req.body.id,
          userId: req.user._id,
        },
        {
          products: orderdProducts,
          orderStatus: "applied for return",
          isReturned: true,
        }
      );

      // returnId Calculation
      let newReturnId = "";
      let letterReplacedOrderId = data.orderId.replace("F", "R");
      let lastReturnOrder = await returnOrders.findOne({}).sort({ _id: -1 });

      if (lastReturnOrder) {
        let splittedLastReturnOrder = lastReturnOrder.returnId.split("-");
        let lastReturnOrderIdCount = parseInt(splittedLastReturnOrder[1]);
        newReturnId = `${letterReplacedOrderId}-${lastReturnOrderIdCount + 1}`;
      } else {
        newReturnId = `${letterReplacedOrderId}-1`;
      }

      // return date formatting
      let formattedDateTime = moment(new Date()).format("MMM DD, h:mm a");

      let addressDetails = await UserAddress.findOne({ _id: req.body.address });

      // medcoin and discount calculation
      let reducableTotalAmount =
        data.cartDetails.medCoinRedeemed +
        data.cartDetails.couponAppliedDiscount +
        data.cartDetails.memberDiscount;
      // data.cartDetails.donationAmount;

      let reducableAmountFromEachProduct =
        reducableTotalAmount / data.products.length;

      let deliveryCharge = 0;
      if (
        req.body.products.length == data.products.length &&
        data.cartDetails.isThisCartEligibleForFreeDelivery == false
      ) {
        deliveryCharge = data.cartDetails.deliveryCharge;
      }

      // Discount Amount
      let memberDiscount =
        (data.cartDetails.memberDiscount / data.products.length) *
        requestedProducts.length;
      let couponDiscount =
        (data.cartDetails.couponAppliedDiscount / data.products.length) *
        requestedProducts.length;
      let returnMedcoinRedeemed =
        (data.cartDetails.medCoinRedeemed / data.products.length) *
        requestedProducts.length;
      let toWalletAmount = 0;
      let toBankAmount = 0;

      // saving bank details if refund through is through bank
      let bankDetails;
      if (req.body.paymentMethod === "bank") {
        bankDetails = {
          customerName: req.body.customerName,
          accountNumber: req.body.accountNumber,
          reAccountNumber: req.body.reAccountNumber,
          ifsc: req.body.ifsc,
          bankName: req.body.bankName,
          branch: req.body.branch,
          accountType: req.body.accountType,
        };

        toWalletAmount =
          (data.cartDetails.medCoinRedeemed / data.products.length) *
          requestedProducts.length;
        toBankAmount = req.body.refundableAmount - toWalletAmount;
      } else if (req.body.paymentMethod === "medcoin") {
        toWalletAmount = req.body.refundableAmount;
        toBankAmount = 0;
      }

      toWalletAmount = parseFloat(toWalletAmount);
      memberDiscount = parseFloat(memberDiscount);
      couponDiscount = parseFloat(couponDiscount);
      toBankAmount = parseFloat(toBankAmount);

      toWalletAmount = toWalletAmount.toFixed(2).replace(/[.,]00$/, "");
      memberDiscount = memberDiscount.toFixed(2).replace(/[.,]00$/, "");
      couponDiscount = couponDiscount.toFixed(2).replace(/[.,]00$/, "");
      toBankAmount = toBankAmount.toFixed(2).replace(/[.,]00$/, "");

      toWalletAmount = parseFloat(toWalletAmount);
      memberDiscount = parseFloat(memberDiscount);
      couponDiscount = parseFloat(couponDiscount);
      toBankAmount = parseFloat(toBankAmount);

      // req.body.refundableAmount = req.body.refundableAmount.toFixed(2)

      let newObj = {
        returnId: newReturnId,
        userId: req.user._id,
        orderObjectId: req.body.id,
        orderId: data.orderId,
        paymentType: req.body.paymentMethod,
        noOfItems: data.noOfItems,
        address: addressDetails,
        products: requestedProducts,
        cartDetails: data.cartDetails,
        storeDetails: data.storeDetails,
        status: "requested",
        formattedDateTime: formattedDateTime,
        refundableAmount: req.body.refundableAmount,
        reducableAmountFromEachProduct: reducableAmountFromEachProduct,
        bankDetails: bankDetails,
        toWalletAmount: toWalletAmount,
        toBankAmount: toBankAmount,
        memberDiscount: memberDiscount,
        couponDiscount: couponDiscount,
        returnMedcoinRedeemed: returnMedcoinRedeemed,
        deliveryCharge: deliveryCharge,
      };

      let schemaObj = new returnOrders(newObj);
      let savedReturnOrder = await schemaObj.save();

      //sent sms

      await TwoFactor.sendTemplate(
        req.user.phone,
        "return requested",
        [data.orderId],
        "MEDMAL"
      ).catch((error) => console.log(error));

      // sending email
      let emailContents = {
        username: req.user.name,
        pickupDate: "12-12-2022",
        deliveryAddress: `${newObj?.address?.name}, ${newObj?.address?.house} , ${newObj?.address?.street} ${newObj?.address?.landmark} ${newObj?.address?.state} ${newObj?.address?.pincode}`,
        refundAmount: newObj.refundableAmount,
        returnId: newObj.returnId,
        products: newObj.products.map((product) => ({
          name: product.productName,
          image: product.image,
          description: product.description,
          quantity: product.quantity,
          amount: product.specialPrice,
          realPrice: product.price,
        })),
        amountPaid: data.cartDetails.totalAmountToBePaid,
        medCoinUsed: data.cartDetails.medCoinRedeemed,
        totalRefundable: newObj.refundableAmount,
        returnRequestDate: moment()
          .tz(process.env.TIME_ZONE)
          .format("DD MMM YYYY"),
        paymentType:
          req.body.paymentMethod === "bank"
            ? "Bank Account"
            : req.body.paymentMethod === "medcoin"
            ? "Medcoin"
            : "",
      };

      let emailTemplate = await generateOrderReturnRequestEMailTemplate(
        emailContents
      );

      let email = await sendMail(
        process.env.EMAIL_ID,
        req.user.email,
        "Applied For Return Order",
        emailTemplate
      );
      console.log("email_:", email);

      return res.status(200).json({
        error: false,
        message: "success",
        data: {
          returnId: savedReturnOrder.returnId,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getCancelEligibleProducts: async (req, res, next) => {
    try {
      if (!req.body.id) {
        res.status(200).json({
          error: true,
          message: "Order id missing",
        });
      }

      let eligibleForCancel = true;

      let result = await Order.findOne(
        {
          _id: req.body.id,
          userId: req.user._id,
        },
        {
          products: 1,
          createdAt: 1,
        }
      ).lean();
      if (result) {
        for (let item of result.products) {
          let products = await Inventory.findOne(
            {
              _id: item.product_id,
            },
            {
              policy: 1,
            }
          ).populate({ path: "policy", select: ["cancel"] });
          if (products) {
            let orderDate = new Date(
              moment(result.createdAt).add(products.policy.cancel, "days")
            );
            item.eligibleDate = moment(orderDate).format("DD MMM YYYY");
            if (orderDate < new Date()) {
              item.eligibleForCancel = false;
              eligibleForCancel = false;
              break;
            } else {
              item.eligibleForCancel = true;
            }
          }
        }
        res.status(200).json({
          error: false,
          message: "Success",
          data: {
            result,
            eligibleForCancel,
          },
        });
      } else {
        res.status(200).json({
          error: true,
          message: "Invalid order id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getReturnEligibleProducts: async (req, res, next) => {
    try {
      if (!req.body.id) {
        res.status(200).json({
          error: true,
          message: "Order id missing",
        });
      }

      let result = await Order.findOne(
        {
          _id: req.body.id,
          userId: req.user._id,
        },
        {
          products: 1,
          createdAt: 1,
        }
      ).lean();
      if (result) {
        for (let item of result.products) {
          let products = await Inventory.findOne(
            {
              _id: item.product_id,
            },
            {
              policy: 1,
            }
          ).populate({ path: "policy", select: ["return"] });
          if (products) {
            let orderDate = new Date(
              moment(result.createdAt).add(products.policy.return, "days")
            );
            item.eligibleDate = moment(orderDate).format("DD MMM YYYY");
            if (orderDate < new Date()) {
              item.eligibleForReturn = false;
            } else {
              item.eligibleForReturn = true;
            }
          }
        }
        res.status(200).json({
          error: false,
          message: "Success",
          data: {
            result,
          },
        });
      } else {
        res.status(200).json({
          error: true,
          message: "Invalid order id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  cancelOrderReasons: async (req, res, next) => {
    try {
      //validate incoming data
      const dataValidation = await validateCancelReason(req.body);
      if (dataValidation.error) {
        const message = dataValidation.error.details[0].message.replace(
          /"/g,
          ""
        );
        return res.status(200).json({
          error: true,
          message: message,
        });
      }

      let data = {
        orderId: req.body.id,
        reason: req.body.reason,
        notes: req.body.notes,
      };

      let obj = new cancelOrderReason(data);
      await obj.save();
      res.status(200).json({
        error: false,
        message: "Success",
      });
    } catch (error) {
      next(error);
    }
  },
  returnOrderReasons: async (req, res, next) => {
    try {
      let data = {
        orderId: req.body.id,
        reason: req.body.reason,
        notes: req.body.notes,
      };

      let obj = new returnOrderReason(data);
      await obj.save();
      res.status(200).json({
        error: false,
        message: "Success",
        data: obj,
      });
    } catch (error) {
      next(error);
    }
  },
  uploadSubscriptionPrescription: async (req, res, next) => {
    try {
      if (!req.body.prescription) {
        res.status(200).json({
          error: true,
          message: "prescription missing",
        });
      }
      await UserSubscription.updateOne(
        {
          _id: mongoose.Types.ObjectId(req.body.id),
        },
        { $push: { prescription: req.body.prescription } }
      )
        .then(() => {
          res.status(200).json({
            error: false,
            message: "success",
          });
        })
        .catch((error) => {
          res.status(200).json({
            error: true,
            message: error,
          });
        });
    } catch (error) {
      next(error);
    }
  },

  // delete a user ( for testing purpose - need to remove after development)
  deleteUser: async (req, res, next) => {
    try {
      let mobile = req.params.mobile;

      // validating user
      let userDetails = await user.findOne({ phone: mobile });
      if (!userDetails) {
        return res.status(200).json({
          error: true,
          message: "User not found!",
        });
      }

      // deleting from users collection
      await user.deleteOne({ phone: mobile });

      // deleting from otpcheckings collection
      await otpChecking.deleteMany({ phone: mobile });

      // deleting from forgototpcheckings collection
      await forgotOtpChecking.deleteMany({ phone: mobile });

      return res.status(200).json({
        error: false,
        message: "User deleted successfully!",
      });
    } catch (error) {
      next(error);
    }
  },
};
