const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const randomize = require("randomatic");
const moment = require("moment-timezone");
const QRCode = require("qrcode");
const _ = require("lodash");

const Remarks = require("../models/customer/remarks");
const User = require("../models/user");
const Product = require("../models/inventory");

const PromotionalEmails = require("../models/customer/promotionalEmail");
const PromotionalSmsCollection = require("../models/customer/promotionalSms");
const CustomerComplaint = require("../models/modelCustomerRelation/customerComplaint");

const PromotionalEmail = PromotionalEmails.PromotionalEmail;
const PromotionalEmailUsers = PromotionalEmails.PromotionalEmailUsers;

const PromotionalSms = PromotionalSmsCollection.PromotionalSms;
const PromotionalSmsUsers = PromotionalSmsCollection.PromotionalSmsUsers;

const EmailHelper = require("../helpers/emailHelper");
const SmsHelper = require("../helpers/smsHelper");
const popupBanner = require("../models/customer/popupBanner");
const UserCard = require("../models/userCard");
const MasterUomValue = require("../models/mastersettings/uomValue");
const MasterBrand = require("../models/mastersettings/brand");
const MasterSubCategoryMedicine = require("../models/mastersettings/subCategoryMedicine");
const MasterSubCategoryHealthcare = require("../models/mastersettings/subCategoryHealthcare");
const MasterSubSubCategory = require("../models/mastersettings/subSubCategory");
const UserMedical = require("../models/user/medical");
const UserFamily = require("../models/user/family");
const UserProfileFeedback = require("../models/user/profileFeedback");
const PremiumUser = require("../models/user/premiumUser");
const UserMembershipBenefits = require("../models/user/membershipBenefits");
const Order = require("../models/orders/order");
const UserSubscription = require("../models/orders/userSubscription");
const UserPrescriptionAdmin = require("../models/user/userPrescriptionAdmin");
const Employee = require("../models/employee");
const PaymentAwaited = require("../models/orders/paymentAwaited");
const PackingPending = require("../models/orders/packingPending");
const ReviewPending = require("../models/orders/reviewPending");
const PickupPending = require("../models/orders/pickupPending");
const Cart = require("../models/cart");
const ReturnOrder = require("../models/returnOrders");

const { checkIfStockAvailable } = require("./cart/cartController");

var isEmailSend = false;
module.exports = {
  /* Customer Relationship - Create  User
    ============================================= */
  addCustomer: async (req, res, next) => {
    try {
      let params = req.body;

      if (!params.name) {
        return res.status(200).json({
          status: false,
          data: "Name missing",
        });
      }

      if (!params.phone) {
        return res.status(200).json({
          status: false,
          data: "Phone missing",
        });
      }

      // if (!params.email) {
      //   return res.status(200).json({
      //     status: false,
      //     data: 'Email missing',
      //   });
      // }

      // if (!params.address) {
      //   return res.status(200).json({
      //     status: false,
      //     data: 'Address missing',
      //   });
      // }

      // if (!params.pincode) {
      //   return res.status(200).json({
      //     status: false,
      //     data: 'Pincode missing',
      //   });
      // }
      if (params.email) {
        let emailExist = await User.findOne({ email: params.email });
        if (emailExist) {
          return res.status(200).json({
            status: false,
            data: "Email Already Exist",
          });
        }
      }
      if (params.phone) {
        let numberExist = await User.findOne({ phone: params.phone });

        if (numberExist) {
          return res.status(200).json({
            status: false,
            data: "Number Already Exist",
          });
        }
      }

      let randomCode = randomize("A0", 4);
      let referralCode = `MDML${randomCode}`;

      // -- logic for adding customerId
      // finding all users having customerId
      let allUsers = await User.find({ customerId: { $exists: true } });

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

      let data = {
        customerId: newCustomerId,
        name: params.name,
        phone: params.phone,
        email: params.email,
        address: params.address,
        pincode: params.pincode,
        referralCode: referralCode,
      };

      let schemaObj = new User(data);
      schemaObj
        .save()
        .then(async (response) => {
          let expDate = response.createdAt;
          let additionOfYears = 2;
          expDate.setFullYear(expDate.getFullYear() + additionOfYears);
          let QrCodeImage = "";
          await QRCode.toDataURL(response.customerId)
            .then((qrImage) => {
              QrCodeImage = qrImage;
            })
            .catch((err) => {
              console.error(err);
            });
          let dataObj = UserCard({
            userId: response._id,
            customerId: response.customerId,
            expDate: expDate,
            QrCodeImage: QrCodeImage,
          });
          dataObj.save();
          res.status(200).json({
            status: true,
            data: "Customer added successfully",
          });
        })
        .catch(async (error) => {
          console.log;
          res.status(200).json({
            status: false,
            data: error,
          });
        });
    } catch (error) {
      next(error);
    }
  },
  getCustomers: async (req, res, next) => {
    try {
      let count = 0;
      let pageSize = 0;
      if (req.body.limit) {
        pageSize = req.body.limit;
      } else {
        pageSize = 10;
      }
      let pageNo = req.body.page;
      var aggregateQuery = User.aggregate([
        {
          $match: {},
        },
        {
          $project: {
            name: 1,
            phone: 1,
            image: 1,
            notes: 1,
            customerId: 1,
            createdAt: 1,
          },
        },
        { $sort: { _id: -1 } },
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
      let response = await User.aggregatePaginate(
        aggregateQuery,
        aggregatePaginateOptions
      );
      let finalResult = response.users;

      for (let item of finalResult) {
        count++;
        item.sl = count;
        if (item.image) {
          item.image = process.env.BASE_URL.concat(item.image);
        } else {
          item.image = process.env.BASE_URL.concat("medfeed/head.jpeg");
        }
        let premium = await PremiumUser.findOne({
          userId: item._id,
          active: true,
        });
        if (premium) {
          item.premium = true;
        } else {
          item.premium = false;
        }

        item.createdAt = moment(item.createdAt)
          .tz(process.env.TIME_ZONE)
          .format("DD-MM-YYYY");
      }

      // order value calculation
      let userOrders = await Order.aggregate([
        {
          $match: {
            userId: { $in: finalResult.map((item) => item._id) },
          },
        },
      ]);

      res.status(200).json({
        error: false,
        data: finalResult,
        data: {
          finalResult: finalResult,
          hasPrevPage: response.hasPrevPage,
          hasNextPage: response.hasNextPage,
          total_items: response.TotalRecords,
          total_page: response.totalPages,
          current_page: response.CurrentPage,
        },
      });

      // let result = await User.find({},{
      //     name:1,
      //     phone:1,
      //     createdAt:1
      // })
      // res.status(200).json({
      //     status: true,
      //     data: result,
      // });
    } catch (error) {
      next(error);
    }
  },
  updateCustomerRemarks: async (req, res, next) => {
    try {
      let data = req.body;
      let result = await Remarks.findOne({ userId: req.params.id });
      if (result) {
        data.updatedAt = new Date();
        Remarks.updateOne({ userId: req.params.id }, data)
          .then((_) => {
            res.status(200).json({
              status: true,
              data: "Remarks Updated successfully",
            });
          })
          .catch((error) => {
            res.status(200).json({
              status: false,
              data: error,
            });
          });
      } else {
        let obj = {
          remarks: data.remarks,
          userId: req.params.id,
        };
        let newObj = Remarks(obj);
        newObj.save().then(() => {
          res.status(200).json({
            status: true,
            data: "Remarks Updated successfully",
          });
        });
      }
    } catch (error) {
      next(error);
    }
  },
  removeCustomer: async (req, res, next) => {
    try {
      let result = await Remarks.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (result) {
        data.updatedAt = new Date();
        data.isDisabled = true;
        Remarks.deleteOne({ userId: req.params.id })
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
  getRemarks: async (req, res, next) => {
    try {
      let result = await Remarks.findOne(
        { userId: req.params.id },
        {
          remarks: 1,
        }
      );
      res.status(200).json({
        status: true,
        data: {
          result: result,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /* Promotional Emails for customers
    ============================================= */
  addPromotionalEmail: async (req, res, next) => {
    try {
      let data = req.body;
      let schemaObj = new PromotionalEmail(data);
      schemaObj
        .save()
        .then(async (result) => {
          let customerArray = await getCustomerEmail(data.segmentId);
          let resultData = {};
          resultData.proEmailId = result._id;
          await customerArray.forEach((customer) => {
            resultData.customerId = customer.customerId;
            let schemaObj = new PromotionalEmailUsers(resultData);
            schemaObj
              .save()
              .then(async (result) => {
                let toMail = customer.email;
                let subject = data.subject;
                let content = data.description;
                EmailHelper.sendEmail(toMail, subject, content).then(
                  (response) => {
                    if (response) {
                      isEmailSend = true;
                    } else {
                      isEmailSend = false;
                    }
                  }
                );
              })
              .catch(async (error) => {
                res.status(200).json({
                  status: false,
                  data: error,
                });
              });
          });
          if (isEmailSend) {
            res.status(200).json({
              status: true,
              data: "Promotional email send successfully",
            });
          } else {
            res.status(200).json({
              status: false,
              data: "Promotional email not send .Please try again later",
            });
          }
        })
        .catch(async (error) => {
          res.status(200).json({
            status: false,
            data: error,
          });
        });
    } catch (error) {
      next(error);
    }
  },
  getPromotionalEmail: async (req, res, next) => {
    try {
      //  let result = await PromotionalEmail.find({ isDisabled: false });
      let result = await PromotionalEmail.aggregate([
        {
          $match: { isDisabled: false },
        },
        {
          $lookup: {
            from: PromotionalEmailUsers,
            localField: "_id",
            foreignField: "proEmailId",
            as: "customers",
          },
        },
        {
          $unwind: "$customers",
        },
      ]);

      console.log(result);
      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  addPopupBanner: async (req, res, next) => {
    try {
      let obj = {
        type: req.body.type,
        from: moment(req.body.date).tz(process.env.TIME_ZONE).utc(),
        image: req.body.image,
      };
      let newObj = popupBanner(obj);
      newObj
        .save()
        .then(() => {
          res.status(200).json({
            status: true,
            data: "Popup Banner added Successfully",
          });
        })
        .catch((error) => {
          res.status(200).json({
            status: false,
            data: error,
          });
        });
    } catch (error) {
      next(error);
    }
  },

  /* Promotional Emails for customers
    ============================================= */
  // addPromotionalSMS: async (req, res, next) => {
  //     try {
  //         let data = req.body;
  //         let schemaObj = new PromotionalSms(data);
  //         schemaObj
  //             .save()
  //             .then(async (result) => {
  //                 let customerArray = await getCustomerPhone(data.segmentId);
  //                 let resultData = {};
  //                 resultData.proSmsId = result._id;
  //                 await customerArray.forEach((customer) => {
  //                     resultData.customerId = customer.customerId;
  //                     let schemaObj = new PromotionalSmsUsers(resultData);
  //                     schemaObj
  //                         .save()
  //                         .then(async (result) => {
  //                             let toMobile = customer.mobile;
  //                             let content = data.description;
  //                             // SmsHelper.sendSMS(toMobile,content).then((response) => {
  //                             //     if (response) {
  //                             //         result = true;
  //                             //     } else {
  //                             //         result = false;
  //                             //     }
  //                             // });
  //                             // res.status(200).json({
  //                             //     status: true,
  //                             //     data: "Promotional sms send successfully",
  //                             // });

  //                         })
  //                         .catch(async (error) => {
  //                             res.status(200).json({
  //                                 status: false,
  //                                 data: error,
  //                             });
  //                         });
  //                 });
  //             })
  //             .catch(async (error) => {
  //                 res.status(200).json({
  //                     status: false,
  //                     data: error,
  //                 });
  //             });
  //     } catch (error) {
  //         next(error);
  //     }
  // },
  getUserDetails: async (req, res, next) => {
    try {
      if (req.body.customerId) {
        let userDetails = await User.find(
          { customerId: req.body.customerId },
          { password: 0 }
        ).lean();
        for (let item of userDetails) {
          const premiumUser = await PremiumUser.findOne({
            userId: item._id,
          }).lean();
          if (premiumUser) {
            item.premiumUser = true;
          } else {
            item.premiumUser = false;
          }

          for (let ite of item.notes) {
            ite.date = moment(ite.date)
              .tz(process.env.TIME_ZONE)
              .format("DD-MM-YYYY");
          }
        }
        res.status(200).json({
          status: true,
          data: userDetails,
        });
      } else {
        res.status(422).json({
          status: true,
          data: "please add customerId",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getUserCardDetails: async (req, res, next) => {
    try {
      if (req.params.id) {
        let userDetails = await User.find(
          { _id: req.params.id },
          { password: 0 }
        );
        res.status(200).json({
          status: true,
          // data: userDetails,
          data: {
            _id: req.params.id,
          },
        });
      } else {
        res.status(422).json({
          status: true,
          data: "oops Something went wrong!!!!!",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  addUserComplaint: async (req, res, next) => {
    try {
      let Data = req.body;
      let allComplaints = await CustomerComplaint.find({
        ComplaintId: { $exists: true },
      });

      let newComplaintId = "";

      if (allComplaints.length) {
        let lastComplaintId =
          allComplaints[allComplaints.length - 1].ComplaintId;

        // splitted with spaces
        let splittedComplaintId = lastComplaintId.split("-");
        let newCount =
          parseInt(splittedComplaintId[splittedComplaintId.length - 1]) + 1;
        let str = newCount.toString().padStart(4, "0");
        newComplaintId = `MDFL-TKT-${str}`;
      } else {
        newComplaintId = `MDFL-TKT-0001`;
      }
      Data.ComplaintId = newComplaintId;

      let schemaObj = new CustomerComplaint(Data);
      schemaObj
        .save()
        .then(() => {
          res.status(200).json({
            status: true,
            data: "Customer complaint added Successfully",
          });
        })
        .catch((error) => {
          res.status(200).json({
            status: false,
            data: error,
          });
        });
    } catch (error) {
      next(error);
    }
  },
  getCustomerComplaints: async (req, res, next) => {
    try {
      let CustomerId = req.params.id;
      let customerComplaints = await CustomerComplaint.aggregate([
        {
          $match: {
            CustomerId: CustomerId,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "CustomerId",
            foreignField: "customerId",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            CustomerId: 1,
            ComplaintId: 1,
            Department: 1,
            ReasonForComplaint: 1,
            Department: 1,
            Details: 1,
            solvedDate: 1,
            HandledBy: 1,
            preference: 1,
            notes: 1,
            date: "$createdAt",
            name: "$user.name",
            email: "$user.email",
            phone: "$user.phone",
          },
        },
      ]);
      for (i = 0; i < customerComplaints.length; i++) {
        customerComplaints[i].date = moment(
          new Date(customerComplaints[i].date)
        ).format("YYYY-MM-DD");
        customerComplaints[i].solvedDate = moment(
          new Date(customerComplaints[i].solvedDate)
        ).format("YYYY-MM-DD");
      }

      res.status(200).json({
        status: true,
        data: customerComplaints,
      });
    } catch (error) {
      next(error);
    }
  },
  getCustomerSingleComplaints: async (req, res, next) => {
    try {
      let ComplaintId = req.params.id;
      let customerComplaints = await CustomerComplaint.aggregate([
        {
          $match: {
            ComplaintId: ComplaintId,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "CustomerId",
            foreignField: "customerId",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            CustomerId: 1,
            ComplaintId: 1,
            Department: 1,
            ReasonForComplaint: 1,
            Department: 1,
            Details: 1,
            solvedDate: 1,
            HandledBy: 1,
            preference: 1,
            Notes: 1,
            date: "$createdAt",
            name: "$user.name",
            email: "$user.email",
            phone: "$user.phone",
          },
        },
      ]);
      for (i = 0; i < customerComplaints.length; i++) {
        customerComplaints[i].date = moment(
          new Date(customerComplaints[i].date)
        ).format("YYYY-MM-DD");
        customerComplaints[i].solvedDate = moment(
          new Date(customerComplaints[i].solvedDate)
        ).format("YYYY-MM-DD");
      }

      res.status(200).json({
        status: true,
        data: customerComplaints,
      });
    } catch (error) {
      next(error);
    }
  },
  getSingleComplaints: async (req, res, next) => {
    try {
      let customerComplaints = await CustomerComplaint.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.params.id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "CustomerId",
            foreignField: "customerId",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            CustomerId: 1,
            ComplaintId: 1,
            Department: 1,
            departmentId: 1,
            ReasonForComplaint: 1,
            Department: 1,
            Details: 1,
            solvedDate: 1,
            HandledBy: 1,
            preference: 1,
            Notes: 1,
            date: "$createdAt",
            name: "$user.name",
            email: "$user.email",
            phone: "$user.phone",
          },
        },
      ]);
      for (i = 0; i < customerComplaints.length; i++) {
        customerComplaints[i].date = moment(
          new Date(customerComplaints[i].date)
        ).format("YYYY-MM-DD");
        customerComplaints[i].solvedDate = moment(
          new Date(customerComplaints[i].solvedDate)
        ).format("YYYY-MM-DD");
      }

      res.status(200).json({
        status: true,
        data: customerComplaints,
      });
    } catch (error) {
      next(error);
    }
  },
  getDepartmentComplaints: async (req, res, next) => {
    try {
      // let CustomerId= req.params.id
      let customerComplaints = await CustomerComplaint.aggregate([
        {
          $match: {
            departmentId: mongoose.Types.ObjectId(req.params.id),
            complaintStatus: false,
          },
        },

        {
          $project: {
            CustomerId: 1,
            ComplaintId: 1,
            Department: 1,
            ReasonForComplaint: 1,
            Department: 1,
            Details: 1,
            solvedDate: 1,
            HandledBy: 1,
            preference: 1,
            Notes: 1,
            date: "$createdAt",
          },
        },
      ]);
      for (i = 0; i < customerComplaints.length; i++) {
        customerComplaints[i].date = moment(
          new Date(customerComplaints[i].date)
        ).format("YYYY-MM-DD");
        customerComplaints[i].solvedDate = moment(
          new Date(customerComplaints[i].solvedDate)
        ).format("YYYY-MM-DD");
      }

      res.status(200).json({
        status: true,
        data: customerComplaints,
      });
    } catch (error) {
      next(error);
    }
  },
  getComplaintsByType: async (req, res, next) => {
    try {
      let departmentId = "";
      let validEmployee = await Employee.findOne({
        _id: req.user._id,
        isAdmin: { $exists: false },
      }).lean();

      if (validEmployee) {
        departmentId = validEmployee.department;
      }

      if (req.body.Type == "solved" || req.body.Type == "unsolved") {
        if (departmentId) {
          let result = "";

          if (req.body.Type == "solved") {
            result = await CustomerComplaint.aggregate([
              {
                $match: {
                  complaintStatus: true,
                  departmentId: mongoose.Types.ObjectId(departmentId),
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "CustomerId",
                  foreignField: "customerId",
                  as: "user",
                },
              },
              {
                $unwind: "$user",
              },
              {
                $project: {
                  CustomerId: 1,
                  ComplaintId: 1,
                  Department: 1,
                  ReasonForComplaint: 1,
                  Department: 1,
                  Details: 1,
                  solvedDate: 1,
                  HandledBy: 1,
                  preference: 1,
                  Notes: 1,
                  date: "$createdAt",
                  name: "$user.name",
                  email: "$user.email",
                  phone: "$user.phone",
                },
              },
              {
                $sort: {
                  solvedDate: -1,
                },
              },
            ]);
            for (i = 0; i < result.length; i++) {
              result[i].date = moment(new Date(result[i].date)).format(
                "YYYY-MM-DD"
              );
              result[i].solvedDate = moment(
                new Date(result[i].solvedDate)
              ).format("YYYY-MM-DD");
            }
            res.status(200).json({
              status: true,
              data: result,
            });
          } else if (req.body.Type == "unsolved") {
            result = await CustomerComplaint.aggregate([
              {
                $match: {
                  complaintStatus: false,
                  departmentId: mongoose.Types.ObjectId(departmentId),
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "CustomerId",
                  foreignField: "customerId",
                  as: "user",
                },
              },
              {
                $unwind: "$user",
              },
              {
                $project: {
                  CustomerId: 1,
                  ComplaintId: 1,
                  Department: 1,
                  ReasonForComplaint: 1,
                  Department: 1,
                  Details: 1,
                  solvedDate: 1,
                  HandledBy: 1,
                  preference: 1,
                  Notes: 1,
                  date: "$createdAt",
                  name: "$user.name",
                  email: "$user.email",
                  phone: "$user.phone",
                },
              },
            ]);
            for (i = 0; i < result.length; i++) {
              result[i].date = moment(new Date(result[i].date)).format(
                "YYYY-MM-DD"
              );
              result[i].solvedDate = moment(
                new Date(result[i].solvedDate)
              ).format("YYYY-MM-DD");
            }
            res.status(200).json({
              status: true,
              data: result,
            });
          }
        } else {
          let result = "";
          if (req.body.Type == "solved") {
            result = await CustomerComplaint.aggregate([
              {
                $match: {
                  complaintStatus: true,
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "CustomerId",
                  foreignField: "customerId",
                  as: "user",
                },
              },
              {
                $unwind: "$user",
              },
              {
                $project: {
                  CustomerId: 1,
                  ComplaintId: 1,
                  Department: 1,
                  ReasonForComplaint: 1,
                  Department: 1,
                  Details: 1,
                  solvedDate: 1,
                  HandledBy: 1,
                  preference: 1,
                  Notes: 1,
                  date: "$createdAt",
                  name: "$user.name",
                  email: "$user.email",
                  phone: "$user.phone",
                },
              },
              {
                $sort: {
                  solvedDate: -1,
                },
              },
            ]);
            for (i = 0; i < result.length; i++) {
              result[i].date = moment(new Date(result[i].date)).format(
                "YYYY-MM-DD"
              );
              result[i].solvedDate = moment(
                new Date(result[i].solvedDate)
              ).format("YYYY-MM-DD");
            }
            res.status(200).json({
              status: true,
              data: result,
            });
          } else if (req.body.Type == "unsolved") {
            result = await CustomerComplaint.aggregate([
              {
                $match: {
                  complaintStatus: false,
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "CustomerId",
                  foreignField: "customerId",
                  as: "user",
                },
              },
              {
                $unwind: "$user",
              },
              {
                $project: {
                  CustomerId: 1,
                  ComplaintId: 1,
                  Department: 1,
                  ReasonForComplaint: 1,
                  Department: 1,
                  Details: 1,
                  solvedDate: 1,
                  HandledBy: 1,
                  preference: 1,
                  Notes: 1,
                  date: "$createdAt",
                  name: "$user.name",
                  email: "$user.email",
                  phone: "$user.phone",
                },
              },
            ]);
            for (i = 0; i < result.length; i++) {
              result[i].date = moment(new Date(result[i].date)).format(
                "YYYY-MM-DD"
              );
              result[i].solvedDate = moment(
                new Date(result[i].solvedDate)
              ).format("YYYY-MM-DD");
            }
            res.status(200).json({
              status: true,
              data: result,
            });
          }
        }
      } else {
        res.status(200).json({
          status: false,
          data: "Please Check the Type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  updateUserComplaint: async (req, res, next) => {
    try {
      let valid = await CustomerComplaint.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      let data = req.body;

      if (valid) {
        await CustomerComplaint.updateOne(
          { _id: mongoose.Types.ObjectId(req.params.id) },
          {
            $set: {
              complaintStatus: data.complaintStatus,
              solvedDate: data.solvedDate,
              HandledBy: data.HandledBy,
              Notes: data.Notes,
            },
          }
        )
          .then((response) => {
            res.status(200).json({
              status: true,
              data: "Solution added successfully",
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
          status: false,
          data: "Invalid complaint ID",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  listProducts: async (req, res, next) => {
    try {
      let count = 0;
      let pageSize = 0;
      if (req.body.limit) {
        pageSize = req.body.limit;
      } else {
        pageSize = 10;
      }
      let pageNo = req.body.page;
      var aggregateQuery = Product.aggregate([
        {
          $match: {},
        },
        {
          $project: {
            name: 1,
            pricing: 1,
          },
        },
        { $sort: { _id: -1 } },
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
      let response = await Product.aggregatePaginate(
        aggregateQuery,
        aggregatePaginateOptions
      );
      let finalResult = response.users;
      for (let item of finalResult) {
        for (let pricing of item.pricing) {
          let sku = await MasterUomValue.findOne({ _id: pricing.sku });
          if (sku) {
            pricing.sku = sku.uomValue;
          } else {
            pricing.sku = "";
          }
          pricing.image = process.env.BASE_URL.concat(pricing.image[0]);
          delete pricing.video;
          delete pricing.stock;
          delete pricing.uom;
          delete pricing.skuOrHsnNo;
          delete pricing.volume;
          delete pricing.expiryDate;
        }
      }
      res.status(200).json({
        error: false,
        data: finalResult,
        data: {
          finalResult: finalResult,
          hasPrevPage: response.hasPrevPage,
          hasNextPage: response.hasNextPage,
          total_items: response.TotalRecords,
          total_page: response.totalPages,
          current_page: response.CurrentPage,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  searchProducts: async (req, res, next) => {
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
      }).lean();
      let subhealthCareCategory = await MasterSubCategoryHealthcare.find({
        title: { $regex: `${keyword}`, $options: "i" },
      }).lean();
      let subSubCategory = await MasterSubSubCategory.find({
        title: { $regex: `${keyword}`, $options: "i" },
      }).lean();
      let productByName = await Product.find(
        { name: { $regex: `${keyword}`, $options: "i" } },
        {
          productId: 1,
          name: 1,
          pricing: 1,
        }
      )
        .populate({ path: "brand", select: ["title"] })
        .lean();

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
        let products = await Product.find(
          { categories: { $in: categories } },
          {
            productId: 1,
            name: 1,
            pricing: 1,
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
        let products = await Product.find(
          { ...(sortBybrand && { $or: sortByBrandQuery }), isDisabled: false },
          {
            product_id: "$_id",
            name: 1,
            pricing: 1,
          }
        )
          .populate({ path: "brand", select: ["title"] })
          .lean();
        for (let product of products) {
          result.push(product);
        }
        // }
      }
      for (let item of productByName) {
        result.push(item);
      }
      for (let item of result) {
        if (!productIds.includes(item.productId)) {
          let obj = {
            _id: item._id,
            name: item.name,
            pricing: [],
          };
          for (let pricing of item.pricing) {
            if (pricing.stock > 0) {
              let sku = await MasterUomValue.findOne({ _id: pricing.sku });
              let data = {
                price: pricing.price,
                specialPrice: pricing.specialPrice,
              };
              if (sku) {
                data.sku = sku.uomValue;
              } else {
                data.sku = "";
              }
              data.image = process.env.BASE_URL.concat(pricing.image[0]);
              data.variantId = pricing._id;
              obj.pricing.push(data);
            }
          }
          if (obj.pricing.length) {
            finalResult.push(obj);
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

      //check if product already exist in the cart

      if (req?.body?.userId) {
        for (const result of newResult) {
          let cartItems = await Cart.findOne({
            product_id: result._id,
          });

          result.pricing.forEach((variant) => {
            let variantInCart = _.find(cartItems, {
              variantId: variant.variantId,
            });

            if (variantInCart) {
              variant.cartId = variantInCart._id;
              variant.quantity = variantInCart.quantity;
            } else {
              variant.cartId = null;
              variant.quantity = null;
            }
          });
        }
      }

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
  getCustomerDetails: async (req, res, next) => {
    try {
      let result = await User.findOne(
        { _id: req.body.id },
        {
          password: 0,
        }
      ).lean();
      if (result) {
        let premium = await PremiumUser.findOne({
          userId: result._id,
          active: true,
        });
        if (premium) {
          result.premium = true;
        } else {
          result.premium = false;
        }
        let medical = await UserMedical.findOne({ userId: req.body.id });
        if (!medical) {
          medical = {};
        }
        let reason = await UserProfileFeedback.findOne({ userId: req.body.id });
        if (!reason) {
          reason = {};
        }
        let family = await UserFamily.find(
          { userId: req.body.id },
          {
            image: { $concat: [process.env.BASE_URL, "$image"] },
            userId: 1,
            name: 1,
            surname: 1,
            age: 1,
            gender: 1,
            bloodGroup: 1,
            height: 1,
            weight: 1,
            relation: 1,
          }
        );
        res.status(200).json({
          status: true,
          data: {
            user: result,
            medical,
            reason,
            family,
          },
        });
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
  addCustomerNotes: async (req, res, next) => {
    try {
      let data = {
        notes: req.body.notes,
        date: new Date(),
      };
      await User.updateOne(
        { _id: mongoose.Types.ObjectId(req.body.id) },
        {
          $push: {
            notes: data,
          },
        }
      ).then((response) => {
        console.log(response);
        res.status(200).json({
          status: true,
          data: "Notes Added Successfully",
        });
      });
    } catch (error) {
      next(error);
    }
  },
  searchCustomers: async (req, res, next) => {
    try {
      let keyword = req.body.keyword;
      let count = 0;
      let pageSize = 0;
      if (req.body.limit) {
        pageSize = req.body.limit;
      } else {
        pageSize = 10;
      }
      let pageNo = req.body.page;
      var aggregateQuery = User.aggregate([
        {
          $match: {
            $or: [
              { name: { $regex: `${keyword}`, $options: "i" } },
              { customerId: { $regex: `${keyword}`, $options: "i" } },
              { phone: { $regex: `${keyword}`, $options: "i" } },
            ],
          },
        },
        {
          $project: {
            name: 1,
            phone: 1,
            image: 1,
            notes: 1,
            customerId: 1,
            createdAt: 1,
          },
        },
        { $sort: { _id: -1 } },
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
      let response = await User.aggregatePaginate(
        aggregateQuery,
        aggregatePaginateOptions
      );
      let finalResult = response.users;

      for (let item of finalResult) {
        count++;
        item.sl = count;
        if (item.image) {
          item.image = process.env.BASE_URL.concat(item.image);
        } else {
          item.image = process.env.BASE_URL.concat("medfeed/head.jpeg");
        }
        let premium = await PremiumUser.findOne({
          userId: item._id,
          active: true,
        });
        if (premium) {
          item.premium = true;
        } else {
          item.premium = false;
        }
      }
      res.status(200).json({
        error: false,
        data: finalResult,
        data: {
          finalResult: finalResult,
          hasPrevPage: response.hasPrevPage,
          hasNextPage: response.hasNextPage,
          total_items: response.TotalRecords,
          total_page: response.totalPages,
          current_page: response.CurrentPage,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // get customer premium membership benefits
  getCustomerPremiumMembeshipDetails: async (req, res, next) => {
    try {
      var result = await PremiumUser.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(req.params.customerId),
            expired: false,
          },
        },
        {
          $lookup: {
            from: "usermembershipbenefits",
            localField: "userId",
            foreignField: "userId",
            as: "benefits",
          },
        },
        {
          $project: {
            _id: 1,
            startDate: 1,
            endDate: 1,
            planId: 1,
            planName: 1,
            paymentGateway: 1,
            freeDelivery: { $first: "$benefits.freeDelivery" },
            allottedFreeDelivery: { $first: "$benefits.allottedFreeDelivery" },
            cashBack: { $first: "$benefits.cashBack" },
            miniMumOffer: { $first: "$benefits.miniMumOffer" },
            cashBackAmount: { $first: "$benefits.cashBackAmount" },
            discount: { $first: "$benefits.discount" },
            deliveryCharges: { $first: "$benefits.deliveryCharges" },
          },
        },
      ]);
      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  getCustomerOrders: async (req, res, next) => {
    try {
      let userId = req.body.id;
      let pageSize = 0;
      if (req.body.limit) {
        pageSize = req.body.limit;
      } else {
        pageSize = 10;
      }
      let pageNo = req.body.page;
      var aggregateQuery = Order.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(userId),
          },
        },
        {
          $project: {
            __v: 0,
          },
        },
        { $sort: { _id: -1 } },
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
      let response = await Order.aggregatePaginate(
        aggregateQuery,
        aggregatePaginateOptions
      );
      let finalResult = response.users;

      for (let result of finalResult) {
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

        if (result.isReturned) {
          let returnOrder = await ReturnOrder.findOne({ orderObjectId: result._id })

          if (returnOrder) {
            result.returnStatus = returnOrder.status

            result.trackingDates.submitted = moment(returnOrder.createdAt)
                .tz(process.env.TIME_ZONE)
                .format("ddd, DD MMM YYYY"),
            result.trackingDates.approved = "",
            result.trackingDates.pickup = "",
            result.trackingDates.refundInitiated = ""

            if (returnOrder.deliveryBoyAssignedDate) {
              result.trackingDates.approved = moment(returnOrder.deliveryBoyAssignedDate)
                .tz(process.env.TIME_ZONE)
                .format("ddd, DD MMM YYYY");

              delete returnOrder.deliveryBoyAssignedDate;
            }

            // pickup date
            if (returnOrder.collectedDate) {
              result.trackingDates.pickup = moment(returnOrder.collectedDate)
                .tz(process.env.TIME_ZONE)
                .format("ddd, DD MMM YYYY");

              delete returnOrder.collectedDate;
            }

            // refund initiated date
            if (
              returnOrder.status === "completed" ||
              returnOrder.status === "declined"
            ) {
              result.trackingDates.refundInitiated = moment(
                returnOrder.returnApprovedDeclinedDate
              )
                .tz(process.env.TIME_ZONE)
                .format("ddd, DD MMM YYYY");

              delete returnOrder.returnApprovedDeclinedDate;
            }
          }
        }

      }

      res.status(200).json({
        error: false,
        data: {
          result: finalResult,
          hasPrevPage: response.hasPrevPage,
          hasNextPage: response.hasNextPage,
          total_items: response.TotalRecords,
          total_page: response.totalPages,
          current_page: response.CurrentPage,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  searchCustomerOrders: async (req, res, next) => {
    try {
      if (!req.body.keyword || !req.body.page) {
        return res.status(200).json({
          error: true,
          message: "Essential params missing",
        });
      }

      let keyword = req.body.keyword;
      let userId = req.body.id;
      let pageSize = 0;

      if (req.body.limit) {
        pageSize = req.body.limit;
      } else {
        pageSize = 10;
      }

      let pageNo = req.body.page;

      let searchQuery = [
        { orderId: { $regex: `${keyword}`, $options: "i" } },
        { paymentType: { $regex: `${keyword}`, $options: "i" } },
      ];

      let aggregateQuery = Order.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(userId),
            ...(keyword && { $or: searchQuery }),
          },
        },
        {
          $project: {
            __v: 0,
          },
        },
        { $sort: { _id: -1 } },
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
      let response = await Order.aggregatePaginate(
        aggregateQuery,
        aggregatePaginateOptions
      );
      let finalResult = response.users;

      res.status(200).json({
        error: false,
        data: {
          result: finalResult,
          hasPrevPage: response.hasPrevPage,
          hasNextPage: response.hasNextPage,
          total_items: response.TotalRecords,
          total_page: response.totalPages,
          current_page: response.CurrentPage,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  searchDropdownProducts: async (req, res, next) => {
    try {
      let result = [];
      let productIds = [];
      let finalResult = [];
      let categories = [];
      let keyword = req.body.keyword;
      let allProducts = req?.body?.allProducts;
      let brand = await MasterBrand.find({
        title: { $regex: `${keyword}`, $options: "i" },
      });
      let subCategory = await MasterSubCategoryMedicine.find({
        title: { $regex: `${keyword}`, $options: "i" },
      }).lean();
      let subhealthCareCategory = await MasterSubCategoryHealthcare.find({
        title: { $regex: `${keyword}`, $options: "i" },
      }).lean();
      let subSubCategory = await MasterSubSubCategory.find({
        title: { $regex: `${keyword}`, $options: "i" },
      }).lean();
      let productByName = await Product.find(
        { name: { $regex: `${keyword}`, $options: "i" }, type: "medicine" },
        {
          productId: 1,
          name: 1,
          pricing: 1,
        }
      )
        .populate({ path: "brand", select: ["title"] })
        .lean();

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
        let products = await Product.find(
          {
            categories: { $in: categories },
            ...(!allProducts && { type: "medicine" }),
            isDisabled: false,
          },
          {
            productId: 1,
            name: 1,
            pricing: 1,
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
        let products = await Product.find(
          { ...(sortBybrand && { $or: sortByBrandQuery }), type: "medicine" },
          {
            productId: 1,
            name: 1,
            pricing: 1,
          }
        )
          .populate({ path: "brand", select: ["title"] })
          .lean();
        for (let product of products) {
          result.push(product);
        }
        // }
      }
      for (let item of productByName) {
        result.push(item);
      }
      for (let item of result) {
        if (!productIds.includes(item.productId)) {
          let obj = {
            product_id: item._id,
            productName: item.name,
            pricing: [],
          };
          for (let pricing of item.pricing) {
            if (pricing.stock > 0) {
              let sku = await MasterUomValue.findOne({ _id: pricing.sku });
              let data = {
                price: pricing.price,
                specialPrice: pricing.specialPrice,
                variantId: pricing._id,
                skuOrHsnNo: pricing.skuOrHsnNo,
              };
              if (sku) {
                data.uomValue = sku.uomValue;
              } else {
                data.uomValue = "";
              }
              data.image = process.env.BASE_URL.concat(pricing.image[0]);
              obj.pricing.push(data);
            }
          }
          if (obj.pricing.length) {
            finalResult.push(obj);
          }
        }
      }
      let page = parseInt(req.body.page) - 1;
      let limit = parseInt(req.body.limit);

      let nextPage = false;
      let start = page * limit;
      let end = page * limit + limit;
      let newResult = finalResult.slice(start, end);

      newResult.forEach((result) => {
        result.variants = result.pricing;
        delete result.pricing;
      });

      //get all out of stock product

      const outOfStockProducts = [];

      for (const product of newResult) {
        //check if stock is available

        const { stockAvailable } =
          (await checkIfStockAvailable({
            variantId: product.variants[0].variantId,
            productId: product.product_id,
            quantity: 1,
            //there is no user id here so providing a wrong object id so it will check stock in only master store
            userId: product.product_id,
          })) || {};

        if (!stockAvailable) {
          outOfStockProducts.push(product.product_id);
        }
      }

      //filter out of stock product it will be added to the cart later after all calculation

      newResult = newResult.filter(
        (product) => !outOfStockProducts.includes(product.product_id)
      );

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
  getCustomerSubscription: async (req, res, next) => {
    try {
      let result = await UserSubscription.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(req.body.id),
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
            products: "$order.products",
            firstDeliveryDate: 1,
            nextDeliveryDate: 1,
            subscriptionId: 1,
            cartDetails: "$order.cartDetails",
            address: "$order.address",
            active: 1,
            interval: 1,
          },
        },
        { $sort: { _id: -1 } },
      ]);
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

  // get user prescription details in admin
  getAllCustomerPrescrition: async (req, res, next) => {
    try {
      const imgPath = process.env.BASE_URL;
      let count = 0;
      let pageSize = 0;
      if (req.body.limit) {
        pageSize = req.body.limit;
      } else {
        pageSize = 10;
      }

      let pageNo = req.body.page;
      var aggregateQuery = UserPrescriptionAdmin.aggregate([
        {
          $match: {},
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        // {
        //   $unwind: {
        //     path: "$prescription",
        //     preserveNullAndEmptyArrays: true,
        //   },
        // },
        {
          $project: {
            prescription: 1,
            isConsult: 1,
            userId: 1,
            createdAt: 1,
            customerId: { $first: "$user.customerId" },
            phone: { $first: "$user.phone" },
            name: { $first: "$user.name" },
          },
        },
        { $sort: { _id: -1 } },
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
      let response = await UserPrescriptionAdmin.aggregatePaginate(
        aggregateQuery,
        aggregatePaginateOptions
      );
      let finalResult = response.users;

      // for(let item of finalResult){
      //   let tempArr = []
      //   for(let i of item.prescription ){
      //     tempArr.push(process.env.BASE_URL+i)
      //   }
      //   item.prescription = tempArr
      // }
      res.status(200).json({
        error: false,
        data: finalResult,
        data: {
          finalResult: finalResult,
          hasPrevPage: response.hasPrevPage,
          hasNextPage: response.hasNextPage,
          total_items: response.TotalRecords,
          total_page: response.totalPages,
          current_page: response.CurrentPage,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // search user prescription details in admin
  searchAllCustomerPrescrition: async (req, res, next) => {
    try {
      let keyword = req.body.keyword;
      let count = 0;
      let pageSize = 0;
      if (req.body.limit) {
        pageSize = req.body.limit;
      } else {
        pageSize = 10;
      }
      let pageNo = req.body.page;
      var aggregateQuery = UserPrescriptionAdmin.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
          },
        },
        {
          $match: {
            $or: [
              { "user.name": { $regex: `${keyword}`, $options: "i" } },
              { "user.customerId": { $regex: `${keyword}`, $options: "i" } },
              { "user.phone": { $regex: `${keyword}`, $options: "i" } },
            ],
          },
        },
        {
          $project: {
            prescription: 1,
            isConsult: 1,
            userId: 1,
            createdAt: 1,
            customerId: "$user.customerId",
            phone: "$user.phone",
            name: "$user.name",
          },
        },
        { $sort: { _id: -1 } },
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
      let response = await UserPrescriptionAdmin.aggregatePaginate(
        aggregateQuery,
        aggregatePaginateOptions
      );
      let finalResult = response.users;

      // for(let item of finalResult){
      //   let tempArr = []
      //   for(let i of item.prescription ){
      //     tempArr.push(process.env.BASE_URL+i)
      //   }
      //   item.prescription = tempArr
      // }

      res.status(200).json({
        error: false,
        data: finalResult,
        data: {
          finalResult: finalResult,
          hasPrevPage: response.hasPrevPage,
          hasNextPage: response.hasNextPage,
          total_items: response.TotalRecords,
          total_page: response.totalPages,
          current_page: response.CurrentPage,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // delete  user prescription details in admin by id
  deleteCustomerPrescritionById: async (req, res, next) => {
    try {
      let result = await UserPrescriptionAdmin.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (result) {
        UserPrescriptionAdmin.deleteOne({ _id: req.params.id })
          .then((_) => {
            // for (let item of result.prescription) {
            //   console.log(item);
            //   let splittedImageRoute = item.split("/");
            //   console.log(splittedImageRoute);
            //   if (splittedImageRoute) {
            //     if (
            //       fs.existsSync(
            //         `./public/images/user/${
            //           splittedImageRoute[splittedImageRoute.length - 1]
            //         }`
            //       )
            //     ) {
            //       fs.unlink(
            //         `./public/images/user/${
            //           splittedImageRoute[splittedImageRoute.length - 1]
            //         }`,
            //         function (err) {
            //           if (err) throw err;
            //           console.log("old image deleted!");
            //         }
            //       );
            //     }
            //   }
            // }

            return res.status(200).json({
              status: true,
              data: "Prescription deleted successfully",
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

  // order details
  getOrderDetails: async (req, res, next) => {
    try {
      let id = req.params.id;
      console.log(id);

      let result = await Order.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      }).lean();

      if (!result) {
        return res.status(422).json({
          error: true,
          message: "Invalid Order Id",
        });
      }

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
        result.trackingDates.confirmed = moment(paymentAwaitedResult.createdAt)
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
        result.trackingDates.doctorRejected = moment(result.doctorRejectedDate)
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

      let response = {
        _id: result._id,
        orderId: result.orderId,
        orderDate: moment(result.createdAt)
          .tz(process.env.TIME_ZONE)
          .format("ddd DD MMM"),
        products: result.products,
        paymentType: result.paymentType,
        deliveryAddress: result.address,
        cartDetails: result.cartDetails,
        orderStatus: result.status,
        trackingDates: result.trackingDates,
      };

      return res.status(200).json({
        status: true,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
};

async function getCustomerEmail(segmentId) {
  let customerDetails = await Customer.find({ isDisabled: false });
  let customerArray = [];
  customerDetails.forEach((customer) => {
    customerArray.push({ customerId: customer._id, email: customer.email });
  });

  return customerArray;
}

async function getCustomerPhone(segmentId) {
  let customerDetails = await Customer.find({ isDisabled: false });
  let customerArray = [];
  customerDetails.forEach((customer) => {
    customerArray.push({ customerId: customer._id, mobile: customer.mobile });
  });

  return customerArray;
}
