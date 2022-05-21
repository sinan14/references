const mongoose = require("mongoose");
const moment = require("moment-timezone");
const fs = require("fs");
const _ = require("lodash");

const coupons = require("../../models/coupon/coupon");
const referalPolicy = require("../../models/coupon/referalPolicy");
const referalPolicyStatement = require("../../models/coupon/referalPolicyStatment");

const ScratchedCoupon = require("../../models/coupon/scratchedCoupon");
const validateScratchCoupon = require("../../validations/coupon/couponValidations");
const user = require("../../models/user");
const UserAppliedCoupons = require("../../models/cart/userAppliedCoupons");

const imgPath = process.env.BASE_URL;

module.exports = {
  addPromoCode: async (req, res, next) => {
    try {
      let data = req.body;
      if (data.type == "Medimall") {
        let existingName = await coupons.findOne({ name: data.name });
        if (!existingName) {
          let existingCode = await coupons.findOne({ code: data.code });
          if (!existingCode) {
            let obj = {
              type: data.type,
              customerType: data.customerType,
              promotionType: data.promotionType,
              name: data.name,
              code: data.code,
              category: data.category,
              from: moment(data.from).tz(process.env.TIME_ZONE).utc(),
              to: moment(data.to)
                .tz(process.env.TIME_ZONE)
                .set({ h: 23, m: 59, s: 59 })
                .utc(),
              percentage: data.percentage,
              purchaseAmount: data.purchaseAmount,
              maximumAmount: data.maximumAmount,
              maximumUser: data.maximumUser,
              numberPerUser: data.numberPerUser,
              termsAndCondition: data.termsAndCondition,
            };
            if (req.file) {
              obj.image = `coupon/${req.file.filename}`;
              let schemaObj = new coupons(obj);
              schemaObj
                .save()
                .then((_) => {
                  res.status(200).json({
                    status: true,
                    data: "Add Coupon Succesfully",
                  });
                })
                .catch(async (error) => {
                  fs.unlink(req.file.path, function (err) {
                    if (err) throw err;
                  });
                  res.status(200).json({
                    status: false,
                    data: error,
                  });
                });
            } else {
              res.status(200).json({
                status: false,
                data: "Please Upload Image",
              });
            }
          } else {
            fs.unlink(req.file.path, function (err) {
              if (err) throw err;
            });
            res.status(200).json({
              status: false,
              data: "Promotion Code Already Existing",
            });
          }
        } else {
          fs.unlink(req.file.path, function (err) {
            if (err) throw err;
          });
          res.status(200).json({
            status: false,
            data: "Promotion name Already Existing",
          });
        }
      }
      if (data.type == "Premium Subscription") {
        let existingName = await coupons.findOne({ name: data.name });
        if (!existingName) {
          let existingCode = await coupons.findOne({ code: data.code });
          if (!existingCode) {
            let obj = {
              type: data.type,
              // customerType: data.customerType,
              // promotionType: data.promotionType,
              name: data.name,
              code: data.code,
              // category: data.category,
              from: moment(data.from).tz(process.env.TIME_ZONE).utc(),
              to: moment(data.to)
                .tz(process.env.TIME_ZONE)
                .set({ h: 23, m: 59, s: 59 })
                .utc(),
              percentage: data.percentage,
              purchaseAmount: data.purchaseAmount,
              maximumAmount: data.maximumAmount,
              maximumUser: data.maximumUser,
              numberPerUser: data.numberPerUser,
              termsAndCondition: data.termsAndCondition,
            };
            if (req.file) {
              obj.image = `coupon/${req.file.filename}`;
              let schemaObj = new coupons(obj);
              schemaObj
                .save()
                .then((_) => {
                  res.status(200).json({
                    status: true,
                    data: "Add Coupon Succesfully",
                  });
                })
                .catch(async (error) => {
                  fs.unlink(req.file.path, function (err) {
                    if (err) throw err;
                  });
                  res.status(200).json({
                    status: false,
                    data: error,
                  });
                });
            } else {
              res.status(200).json({
                status: false,
                data: "Please Upload Image",
              });
            }
          } else {
            fs.unlink(req.file.path, function (err) {
              if (err) throw err;
            });
            res.status(200).json({
              status: false,
              data: "Promotion Code Already Existing",
            });
          }
        } else {
          fs.unlink(req.file.path, function (err) {
            if (err) throw err;
          });
          res.status(200).json({
            status: false,
            data: "Promotion name Already Existing",
          });
        }
      }
      if (data.type == "Subscription") {
        let existingName = await coupons.findOne({ name: data.name });
        if (!existingName) {
          let existingCode = await coupons.findOne({ code: data.code });
          if (!existingCode) {
            let obj = {
              type: data.type,
              customerType: data.customerType,
              promotionType: "--",
              name: data.name,
              code: data.code,
              category: data.category,
              from: moment(data.from).tz(process.env.TIME_ZONE).utc(),
              to: moment(data.to)
                .tz(process.env.TIME_ZONE)
                .set({ h: 23, m: 59, s: 59 })
                .utc(),
              percentage: data.percentage,
              purchaseAmount: data.purchaseAmount,
              maximumAmount: data.maximumAmount,
              maximumUser: data.maximumUser,
              numberPerUser: data.numberPerUser,
              termsAndCondition: data.termsAndCondition,
            };
            if (req.file) {
              obj.image = `coupon/${req.file.filename}`;
              let schemaObj = new coupons(obj);
              schemaObj
                .save()
                .then((_) => {
                  res.status(200).json({
                    status: true,
                    data: "Add Coupon Succesfully",
                  });
                })
                .catch(async (error) => {
                  fs.unlink(req.file.path, function (err) {
                    if (err) throw err;
                  });
                  res.status(200).json({
                    status: true,
                    data: error,
                  });
                });
            } else {
              res.status(200).json({
                status: false,
                data: "Please Upload Image",
              });
            }
          } else {
            fs.unlink(req.file.path, function (err) {
              if (err) throw err;
            });
            res.status(200).json({
              status: false,
              data: "Promotion Code Already Existing",
            });
          }
        } else {
          fs.unlink(req.file.path, function (err) {
            if (err) throw err;
          });
          res.status(200).json({
            status: false,
            data: "Promotion name Already Existing",
          });
        }
      }
    } catch (error) {
      next(error);
    }
  },
  editPromoCode: async (req, res, next) => {
    try {
      let data = req.body;
      let existing = await coupons.findOne({ _id: req.params.id });
      if (existing) {
        if (data.type == "Medimall") {
          let existingName = await coupons.findOne({
            name: data.name,
            _id: { $ne: existing._id },
          });
          if (!existingName) {
            let existingCode = await coupons.findOne({
              code: data.code,
              _id: { $ne: existing._id },
            });
            if (!existingCode) {
              let obj = {
                type: data.type,
                customerType: data.customerType,
                promotionType: data.promotionType,
                name: data.name,
                code: data.code,
                category: data.category,
                from: moment(data.from).tz(process.env.TIME_ZONE).utc(),
                to: moment(data.to)
                  .tz(process.env.TIME_ZONE)
                  .set({ h: 23, m: 59, s: 59 })
                  .utc(),
                percentage: data.percentage,
                purchaseAmount: data.purchaseAmount,
                maximumAmount: data.maximumAmount,
                maximumUser: data.maximumUser,
                numberPerUser: data.numberPerUser,
                termsAndCondition: data.termsAndCondition,
                image: existing.image,
              };
              if (req.file) {
                fs.unlink(`public/images/${existing.image}`, function (err) {
                  if (err) throw err;
                });
                obj.image = `coupon/${req.file.filename}`;
              }
              coupons
                .updateOne({ _id: req.params.id }, obj)
                .then((response) => {
                  res.status(200).json({
                    status: true,
                    data: "Edit Coupon Succesfully",
                  });
                })
                .catch((error) => {
                  res.status(200).json({
                    status: true,
                    data: error,
                  });
                });
            } else {
              if (req.file) {
                fs.unlink(req.file.path, function (err) {
                  if (err) throw err;
                });
              }
              res.status(200).json({
                status: false,
                data: "Promotion Code Already Existing",
              });
            }
          } else {
            if (req.file) {
              fs.unlink(req.file.path, function (err) {
                if (err) throw err;
              });
            }
            res.status(200).json({
              status: false,
              data: "Promotion name Already Existing",
            });
          }
        } else if (data.type == "Premium Subscription") {
          let existingName = await coupons.findOne({
            name: data.name,
            _id: { $ne: existing._id },
          });
          if (!existingName) {
            let existingCode = await coupons.findOne({
              code: data.code,
              _id: { $ne: existing._id },
            });
            if (!existingCode) {
              let obj = {
                type: data.type,
                customerType: "--",
                promotionType: "--",
                name: data.name,
                code: data.code,
                // category: data.category,
                from: moment(data.from).tz(process.env.TIME_ZONE).utc(),
                to: moment(data.to)
                  .tz(process.env.TIME_ZONE)
                  .set({ h: 23, m: 59, s: 59 })
                  .utc(),
                percentage: data.percentage,
                purchaseAmount: data.purchaseAmount,
                maximumAmount: data.maximumAmount,
                maximumUser: data.maximumUser,
                numberPerUser: data.numberPerUser,
                termsAndCondition: data.termsAndCondition,
                image: existing.image,
              };
              if (req.file) {
                fs.unlink(`public/images/${existing.image}`, function (err) {
                  if (err) throw err;
                });
                obj.image = `coupon/${req.file.filename}`;
              }
              coupons
                .updateOne({ _id: req.params.id }, obj)
                .then((response) => {
                  res.status(200).json({
                    status: true,
                    data: "Edit Coupon Succesfully",
                  });
                })
                .catch((error) => {
                  res.status(200).json({
                    status: true,
                    data: error,
                  });
                });
            } else {
              if (req.file) {
                fs.unlink(req.file.path, function (err) {
                  if (err) throw err;
                });
              }
              res.status(200).json({
                status: false,
                data: "Promotion Code Already Existing",
              });
            }
          } else {
            if (req.file) {
              fs.unlink(req.file.path, function (err) {
                if (err) throw err;
              });
            }
            res.status(200).json({
              status: false,
              data: "Promotion name Already Existing",
            });
          }
        } else if (data.type == "Subscription") {
          let existingName = await coupons.findOne({
            name: data.name,
            _id: { $ne: existing._id },
          });
          if (!existingName) {
            let existingCode = await coupons.findOne({
              code: data.code,
              _id: { $ne: existing._id },
            });
            if (!existingCode) {
              let obj = {
                type: data.type,
                customerType: data.customerType,
                promotionType: "--",
                name: data.name,
                code: data.code,
                category: data.category,
                from: moment(data.from).tz(process.env.TIME_ZONE).utc(),
                to: moment(data.to)
                  .tz(process.env.TIME_ZONE)
                  .set({ h: 23, m: 59, s: 59 })
                  .utc(),
                percentage: data.percentage,
                purchaseAmount: data.purchaseAmount,
                maximumAmount: data.maximumAmount,
                maximumUser: data.maximumUser,
                numberPerUser: data.numberPerUser,
                termsAndCondition: data.termsAndCondition,
                image: existing.image,
              };
              if (req.file) {
                fs.unlink(`public/images/${existing.image}`, function (err) {
                  if (err) throw err;
                });
                obj.image = `coupon/${req.file.filename}`;
              }
              coupons
                .updateOne({ _id: req.params.id }, obj)
                .then((response) => {
                  res.status(200).json({
                    status: true,
                    data: "Edit Coupon Succesfully",
                  });
                })
                .catch((error) => {
                  res.status(200).json({
                    status: true,
                    data: error,
                  });
                });
            } else {
              if (req.file) {
                fs.unlink(req.file.path, function (err) {
                  if (err) throw err;
                });
              }
              res.status(200).json({
                status: false,
                data: "Promotion Code Already Existing",
              });
            }
          } else {
            if (req.file) {
              fs.unlink(req.file.path, function (err) {
                if (err) throw err;
              });
            }
            res.status(200).json({
              status: false,
              data: "Promotion name Already Existing",
            });
          }
        } else {
          res.status(200).json({
            status: false,
            data: "Invalid Type",
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
  getExpiredCoupon: async (req, res, next) => {
    try {
      console.log(new Date());
      let result = await coupons.find(
        { to: { $lte: new Date() } },
        {
          type: 1,
          customerType: 1,
          promotionType: 1,
          name: 1,
          code: 1,
          percentage: 1,
          maximumAmount: 1,
          // image: { $concat: [imgPath, "$image"] }
        }
      );
      res.status(200).json({
        status: true,
        data: result.reverse(),
      });
    } catch (error) {
      next(error);
    }
  },
  getCouponById: async (req, res, next) => {
    try {
      let result = await coupons.findOne({ _id: req.params.id }).lean();
      if (result) {
        result.image = `${imgPath}${result.image}`;
      }
      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  getCoupons: async (req, res, next) => {
    try {
      if (req.params.type == "all") {
        let result = await coupons.find(
          { isDisabled: false },
          {
            type: 1,
            customerType: 1,
            promotionType: 1,
            name: 1,
            code: 1,
            percentage: 1,
            maximumAmount: 1,
          }
        );
        res.status(200).json({
          status: true,
          data: result.reverse(),
        });
      } else {
        let result = await coupons.find(
          { type: req.params.type },
          {
            type: 1,
            customerType: 1,
            promotionType: 1,
            name: 1,
            code: 1,
            percentage: 1,
            maximumAmount: 1,
          }
        );
        res.status(200).json({
          status: true,
          data: result.reverse(),
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deactivateCoupon: async (req, res, next) => {
    try {
      let data = req.body;
      coupons
        .updateOne(
          { _id: req.params.id },
          {
            $set: {
              isDisabled: data.status,
            },
          }
        )
        .then((_) => {
          res.status(200).json({
            status: true,
            data: "Status Updated Succesfully",
          });
        })
        .catch((err) => {
          res.status(200).json({
            status: false,
            data: err,
          });
        });
    } catch (error) {
      next(error);
    }
  },
  getActiveOrDeactivateCode: async (req, res, next) => {
    try {
      if (req.params.type == "activated") {
        let result = await coupons.find(
          { isDisabled: false },
          {
            type: 1,
            customerType: 1,
            promotionType: 1,
            name: 1,
            code: 1,
            percentage: 1,
            maximumAmount: 1,
          }
        );
        res.status(200).json({
          status: true,
          data: result.reverse(),
        });
      } else {
        let result = await coupons.find(
          { isDisabled: true },
          {
            type: 1,
            customerType: 1,
            promotionType: 1,
            name: 1,
            code: 1,
            percentage: 1,
            maximumAmount: 1,
          }
        );
        res.status(200).json({
          status: true,
          data: result.reverse(),
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteCoupon: async (req, res, next) => {
    try {
      coupons
        .deleteOne({ _id: req.params.id })
        .then((_) => {
          res.status(200).json({
            status: true,
            data: "Promo Code deleted",
          });
        })
        .catch((err) => {
          res.status(421).json({
            status: false,
            data: err,
          });
        });
    } catch (error) {
      next(error);
    }
  },
  addReferalPolicy: async (req, res, next) => {
    try {
      let data = {
        to: req.body.to,
        from: req.body.from,
        newUser: req.body.newUser,
        referalUser: req.body.referalUser,
        benefit: req.body.benefit,
      };

      data.from = moment(data.from)
        .tz(process.env.TIME_ZONE)
        .set({ h: 00, m: 00, s: 00 })
        .utc();

      data.to = moment(data.to)
        .tz(process.env.TIME_ZONE)
        .set({ h: 23, m: 59, s: 59 })
        .utc();

      let obj = referalPolicy(data);
      obj.save().then((_) => {
        res.status(200).json({
          status: true,
          data: "Referral policy added successfully",
        });
      });
    } catch (error) {
      next(error);
    }
  },
  listReferalPolicy: async (req, res, next) => {
    try {
      let count = 0;
      let pageSize = 0;
      if (req.body.limit) {
        pageSize = req.body.limit;
      } else {
        pageSize = 10;
      }
      let pageNo = req.body.page;
      var aggregateQuery = referalPolicy.aggregate([
        {
          $match: {},
        },
        {
          $project: {
            to: 1,
            from: 1,
            newUser: 1,
            referalUser: 1,
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
      let response = await referalPolicy.aggregatePaginate(
        aggregateQuery,
        aggregatePaginateOptions
      );
      let finalResult = response.users;

      for (let item of finalResult) {
        let statement = await referalPolicyStatement.countDocuments({
          policyId: item._id,
        });
        item.usedCount = statement;
        item.medcoin = (item.newUser + item.referalUser) * statement;
        count++;
        item.sl = count;
      }

      finalResult.forEach((result) => {
        result.from = moment(result.from)
          .tz(process.env.TIME_ZONE)
          .format("DD-MM-YYYY");
        result.to = moment(result.to)
          .tz(process.env.TIME_ZONE)
          .format("DD-MM-YYYY");
      });

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
  listReferalPolicyStatement: async (req, res, next) => {
    try {
      let datas = await referalPolicy.findOne(
        { _id: req.body.id },
        {
          referalUser: 1,
          newUser: 1,
          benefit: 1,
        }
      );
      let count = 0;
      let pageSize = 0;
      if (req.body.limit) {
        pageSize = req.body.limit;
      } else {
        pageSize = 10;
      }
      let pageNo = req.body.page;
      var aggregateQuery = referalPolicyStatement.aggregate([
        {
          $match: { policyId: mongoose.Types.ObjectId(req.body.id) },
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
      let response = await referalPolicyStatement.aggregatePaginate(
        aggregateQuery,
        aggregatePaginateOptions
      );
      let finalResult = response.users;
      console.log(finalResult);
      for (let item of finalResult) {
        let newUsers = await user.findOne({
          _id: item.newUser,
        });
        if (newUsers) {
          item.new_user = newUsers.name;
        }
        let refUsers = await user.findOne({
          _id: item.referredId,
        });
        if (refUsers) {
          item.ref_user = refUsers.name;
        }
        count++;
        item.sl = count;
        item.date = moment(item.createdAt)
          .tz(process.env.TIME_ZONE)
          .format("DD-MM-YYYY");
        delete item.policyId;
        delete item.newUser;
        delete item.referredId;
        delete item.__v;
        delete item.updatedAt;
        delete item.createdAt;
      }

      if (datas.benefit === "immediate") {
        datas.benefit = "Immediate";
      } else if (datas.benefit === "first") {
        datas.benefit = "First order";
      }

      res.status(200).json({
        error: false,
        data: finalResult,
        data: {
          datas,
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

  //user coupon controls

  getCouponByUser: async (req, res, next) => {
    try {
      //TODO:
      //check if user is premium member or not and if premium also provide premium coupons.

      const { _id: userId } = req.user;

      const scratchableAndUpComingCoupons = await coupons.aggregate([
        {
          $match: {
            to: { $gte: new Date() },
            isDisabled: false,
            $or: [
              { $and: [{ type: "Medimall", customerType: "normal" }] },
              { type: "Premium Subscription" },
              { $and: [{ type: "Subscription", customerType: "normal" }] },
            ],
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
            termsAndCondition: 1,
          },
        },
      ]);

      //get scratched coupons
      const scratchableCouponsIds = scratchableAndUpComingCoupons.map(
        (coupon) => coupon._id
      );
      let scratchedCouponIds = await ScratchedCoupon.find(
        {
          userId,
          couponId: { $in: scratchableCouponsIds },
        },
        { couponId: 1, _id: 0 }
      ).sort({ updatedAt: -1 });
      scratchedCouponIds = scratchedCouponIds.map((scratchedCoupon) =>
        scratchedCoupon.couponId.toString()
      );

      //filter scratchable and upcoming coupons
      const scratchableCoupons = [];
      const upComingCoupons = [];
      let scratchedCoupons = [];
      scratchableAndUpComingCoupons.map((coupon) => {
        if (scratchedCouponIds.includes(coupon._id.toString())) {
          scratchedCoupons.push(coupon);
        } else {
          if (new Date().getTime() >= new Date(coupon.from).getTime()) {
            scratchableCoupons.push(coupon);
          } else {
            upComingCoupons.push({
              _id: "Not available",
              name: "Not available",
              code: "Not available",
              from: coupon.from,
              to: "Not available",
              image: "Not available",
            });
          }
        }
      });

      //format time

      scratchableCoupons.map((coupon) => {
        coupon.from = moment(coupon.from)
          .tz(process.env.TIME_ZONE)
          .format("DD MMMM YYYY");

        coupon.to = moment(coupon.to)
          .tz(process.env.TIME_ZONE)
          .format("DD MMMM YYYY");

        coupon.type = "scratchable";

        if (!coupon.termsAndCondition) {
          coupon.termsAndCondition = "";
        }
      });

      upComingCoupons.map((coupon) => {
        coupon.from = moment(coupon.from)
          .tz(process.env.TIME_ZONE)
          .format("DD MMM YYYY");

        coupon.type = "upcoming";

        if (!coupon.termsAndCondition) {
          coupon.termsAndCondition = "";
        }
      });

      scratchedCoupons = _.sortBy(scratchedCoupons, function (item) {
        return scratchedCouponIds.indexOf(item._id.toString());
      });

      scratchedCoupons.map((coupon) => {
        coupon.from = moment(coupon.from)
          .tz(process.env.TIME_ZONE)
          .format("DD MMM YYYY");

        coupon.to = moment(coupon.to)
          .tz(process.env.TIME_ZONE)
          .format("DD MMM YYYY");

        coupon.type = "scratched";

        if (!coupon.termsAndCondition) {
          coupon.termsAndCondition = "";
        }
      });

      let allCoupons = _.flatten([
        scratchableCoupons,
        upComingCoupons,
        scratchedCoupons,
      ]);

      return res.json({
        error: false,
        message: "Coupons found.",
        data: { allCoupons },
      });
    } catch (error) {
      next(error);
    }
  },

  scratchCoupon: async (req, res, next) => {
    try {
      const { _id: userId } = req.user;

      const customerType = "normal";

      //validate incoming data
      const dataValidation = await validateScratchCoupon(req.body);
      if (dataValidation.error) {
        const message = dataValidation.error.details[0].message.replace(
          /"/g,
          ""
        );
        return res.status(400).json({
          error: true,
          message: message,
        });
      }

      const { couponId } = req.body;

      //check if this id is valid and not expired or not yet active

      const coupon = await coupons.findOne({
        _id: couponId,
        isDisabled: false,
        from: { $lte: new Date() },
        to: { $gte: new Date() },
      });

      if (!coupon) {
        return res
          .status(400)
          .json({ error: true, message: "Invalid coupon." });
      }

      //check if coupon already scratched or not

      const couponScratchedExist = await ScratchedCoupon.findOne(
        { userId, couponId },
        { _id: 1 }
      );

      if (couponScratchedExist) {
        return res
          .status(409)
          .json({ error: true, message: "Coupon already scratched." });
      }

      //save scratched coupon

      await new ScratchedCoupon({ userId, couponId }).save();

      return res
        .status(200)
        .json({ error: false, message: "Coupon successfully scratched." });
    } catch (error) {
      next(error);
    }
  },
  searchReferalPolicyStatement: async (req, res, next) => {
    try {
      let count = 0;
      let keyword = req.body.keyword;
      let result = await user.find({
        name: { $regex: `${keyword}`, $options: "i" },
      });
      let users = result?.length ? true : false;
      let userQuery = [];
      let newQuery = [];
      console.log(result);
      if (users) {
        result.map((item) =>
          userQuery.push({ referredId: mongoose.Types.ObjectId(item._id) })
        );
        result.map((item) =>
          newQuery.push({ newUser: mongoose.Types.ObjectId(item._id) })
        );
        let resultOne = await referalPolicyStatement.find({
          policyId: mongoose.Types.ObjectId(req.body.id),
          ...(users && { $or: userQuery }),
        });
        let resultTwo = await referalPolicyStatement.find({
          policyId: mongoose.Types.ObjectId(req.body.id),
          ...(users && { $or: newQuery }),
        });
        let id = [];
        let data = [];
        let finalResult = [...resultOne, ...resultTwo];
        for (let item of finalResult) {
          if (!id.includes(item._id + "")) {
            id.push(item._id + "");
            let obj = {
              _id: item._id,
            };
            let newUsers = await user.findOne({
              _id: item.newUser,
            });
            if (newUsers) {
              obj.new_user = newUsers.name;
            } else {
              obj.new_user = "";
            }
            let refUsers = await user.findOne({
              _id: item.referredId,
            });
            if (refUsers) {
              obj.ref_user = refUsers.name;
            } else {
              obj.ref_user = "";
            }
            count++;
            obj.sl = count;
            data.push(obj);
          }
        }
        let page = parseInt(req.body.page) - 1;
        let limit = parseInt(req.body.limit);
        let nextPage = false;
        let prevPage = true;

        let start = page * limit;
        let end = page * limit + limit;
        let newResult = data.slice(start, end);

        if (data.length > end) {
          nextPage = true;
        } else {
          nextPage = false;
        }
        if (page + 1 == 1) {
          prevPage = false;
        }
        let totalPage = Math.ceil(data.length / limit);

        res.status(200).json({
          error: false,
          data: {
            finalResult: newResult,
            hasPrevPage: prevPage,
            hasNextPage: nextPage,
            total_page: totalPage,
            current_page: page,
          },
        });
      } else {
        res.status(200).json({
          error: false,
          data: {
            finalResult: [],
            hasPrevPage: false,
            hasNextPage: false,
            total_page: 1,
            current_page: pageNo,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  },

  getWebCouponByUser: async (req, res, next) => {
    try {
      //TODO:
      //check if user is premium member or not and if premium also provide premium coupons.

      const { _id: userId } = req.user;

      const scratchableAndUpComingCoupons = await coupons.aggregate([
        {
          $match: {
            to: { $gte: new Date() },
            isDisabled: false,
            $or: [
              { $and: [{ type: "Medimall", customerType: "normal" }] },
              { type: "Premium Subscription" },
              { $and: [{ type: "Subscription", customerType: "normal" }] },
            ],
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
            termsAndCondition: 1,
            category: 1,
            type: 1,
          },
        },
      ]);

      //if not category then change category to type

      scratchableAndUpComingCoupons.forEach((coupon) => {
        if (!coupon.category || coupon.category == "null") {
          coupon.category = coupon.type;
        }
      });

      //get scratched coupons
      const scratchableCouponsIds = scratchableAndUpComingCoupons.map(
        (coupon) => coupon._id
      );
      let scratchedCouponIds = await ScratchedCoupon.find(
        {
          userId,
          couponId: { $in: scratchableCouponsIds },
        },
        { couponId: 1, _id: 0 }
      ).sort({ updatedAt: -1 });
      scratchedCouponIds = scratchedCouponIds.map((scratchedCoupon) =>
        scratchedCoupon.couponId.toString()
      );

      //filter scratchable and upcoming coupons
      const scratchableCoupons = [];
      const upComingCoupons = [];
      let scratchedCoupons = [];
      scratchableAndUpComingCoupons.map((coupon) => {
        if (scratchedCouponIds.includes(coupon._id.toString())) {
          scratchedCoupons.push(coupon);
        } else {
          if (new Date().getTime() >= new Date(coupon.from).getTime()) {
            scratchableCoupons.push(coupon);
          } else {
            upComingCoupons.push({
              _id: "Not available",
              name: "Not available",
              code: "Not available",
              from: coupon.from,
              to: "Not available",
              image: "Not available",
            });
          }
        }
      });

      //format time

      scratchableCoupons.map((coupon) => {
        coupon.from = moment(coupon.from)
          .tz(process.env.TIME_ZONE)
          .format("DD MMMM YYYY");

        coupon.to = moment(coupon.to)
          .tz(process.env.TIME_ZONE)
          .format("DD MMMM YYYY");

        coupon.type = "scratchable";

        if (!coupon.termsAndCondition) {
          coupon.termsAndCondition = "";
        }
      });

      upComingCoupons.map((coupon) => {
        coupon.from = moment(coupon.from)
          .tz(process.env.TIME_ZONE)
          .format("DD MMM YYYY");

        coupon.type = "upcoming";

        if (!coupon.termsAndCondition) {
          coupon.termsAndCondition = "";
        }
      });

      scratchedCoupons = _.sortBy(scratchedCoupons, function (item) {
        return scratchedCouponIds.indexOf(item._id.toString());
      });

      scratchedCoupons.map((coupon) => {
        coupon.from = moment(coupon.from)
          .tz(process.env.TIME_ZONE)
          .format("DD MMM YYYY");

        coupon.to = moment(coupon.to)
          .tz(process.env.TIME_ZONE)
          .format("DD MMM YYYY");

        coupon.type = "scratched";

        if (!coupon.termsAndCondition) {
          coupon.termsAndCondition = "";
        }
      });

      let allCoupons = _.flatten([
        scratchableCoupons,
        upComingCoupons,
        scratchedCoupons,
      ]);

      return res.json({
        error: false,
        message: "Coupons found.",
        data: { allCoupons },
      });
    } catch (error) {
      next(error);
    }
  },
  getPromoCodeStatement: async (req, res, next) => {
    try {
      if (!req.body.id) {
        res.status(200).json({
          status: false,
          data: "Id Missing",
        });
      }

      if (!req.body.page) {
        res.status(200).json({
          status: false,
          data: "page Missing",
        });
      }

      if (!req.body.limit) {
        res.status(200).json({
          status: false,
          data: "limit Missing",
        });
      }
      let count = 0;
      let totalAmount = 0;
      let pageSize = 0;
      if (req.body.limit) {
        pageSize = req.body.limit;
      } else {
        pageSize = 10;
      }
      let totalResult = await UserAppliedCoupons.find({
        couponId: mongoose.Types.ObjectId(req.body.id),
      });
      console.log(totalResult);
      totalResult.map((amount) => {
        if (amount.discountAmount) {
          totalAmount += amount.discountAmount;
        }
      });

      let pageNo = req.body.page;
      var aggregateQuery = UserAppliedCoupons.aggregate([
        {
          $match: {
            couponId: mongoose.Types.ObjectId(req.body.id),
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
        { $unwind: "$user" },
        {
          $project: {
            userId: "$user.customerId",
            name: "$user.name",
            discountAmount: 1,
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
      let response = await UserAppliedCoupons.aggregatePaginate(
        aggregateQuery,
        aggregatePaginateOptions
      );
      let finalResult = response.users;
      res.status(200).json({
        error: false,
        data: {
          result: finalResult,
          totalAmount,
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
  searchPromoCodeStatement: async (req, res, next) => {
    try {
      if (!req.body.id) {
        res.status(200).json({
          status: false,
          data: "Id Missing",
        });
      }

      if (!req.body.keyword) {
        res.status(200).json({
          status: false,
          data: "keyword Missing",
        });
      }

      if (!req.body.page) {
        res.status(200).json({
          status: false,
          data: "page Missing",
        });
      }

      if (!req.body.limit) {
        res.status(200).json({
          status: false,
          data: "limit Missing",
        });
      }

      let count = 0;
      let keyword = req.body.keyword;
      let userQuery = [];
      let totalAmount = 0;
      let pageSize = 0;
      let pageNo = req.body.page;
      if (req.body.limit) {
        pageSize = req.body.limit;
      } else {
        pageSize = 10;
      }

      let totalResult = await UserAppliedCoupons.find({
        couponId: mongoose.Types.ObjectId(req.body.id),
      });
      totalResult.map((amount) => {
        if (amount.discountAmount) {
          totalAmount += amount.discountAmount;
        }
      });
      let userResult = await user.find({
        $or: [
          { name: { $regex: `${keyword}`, $options: "i" } },
          { customerId: { $regex: `${keyword}`, $options: "i" } },
        ],
      });
      let users = userResult?.length ? true : false;
      if (users) {
        userResult.map((item) =>
          userQuery.push({ userId: mongoose.Types.ObjectId(item._id) })
        );
        console.log(userQuery);
        var aggregateQuery = UserAppliedCoupons.aggregate([
          {
            $match: {
              couponId: mongoose.Types.ObjectId(req.body.id),
              $or: userQuery,
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
          { $unwind: "$user" },
          {
            $project: {
              userId: "$user.customerId",
              name: "$user.name",
              discountAmount: 1,
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
        let response = await UserAppliedCoupons.aggregatePaginate(
          aggregateQuery,
          aggregatePaginateOptions
        );
        let finalResult = response.users;
        res.status(200).json({
          error: false,
          data: {
            result: finalResult,
            totalAmount,
            hasPrevPage: response.hasPrevPage,
            hasNextPage: response.hasNextPage,
            total_items: response.TotalRecords,
            total_page: response.totalPages,
            current_page: response.CurrentPage,
          },
        });
      } else {
        res.status(200).json({
          error: false,
          data: {
            result: [],
            totalAmount,
            hasPrevPage: false,
            hasNextPage: false,
            total_items: 0,
            total_page: 0,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
