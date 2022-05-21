const mongoose = require("mongoose");
const TermsAndCondition = require("../../models/usermanagement/termsandcondition");
const fs = require("fs");
const { isArray } = require("util");

module.exports = {
  getTermsAndConditionDetailsByType: async (req, res, next) => {
    try {
      let val = parseInt(req.params.type);

      if (val == 0) {
        val = "Quiz";
      } else if (val == 1) {
        val = "Medpride Membership";
      } else if (val == 2) {
        val = "ReferAndEarn";
      }
      console.log(val);
      let result = await TermsAndCondition.findOne(
        { type: val },
        { type: 1, description: 1 }
      );
      if (!result) {
        res.status(422).json({
          status: false,
          data: "No products",
        });
      } else {
        res.status(200).json({
          status: true,
          data: result,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  updateTermsAndCondition: async (req, res, next) => {
    let data = req.body;
    let val = parseInt(req.params.type);

    if (val == 0) {
      val = "Quiz";
    } else if (val == 1) {
      val = "Medpride Membership";
    } else if (val == 2) {
      val = "ReferAndEarn";
    }
    console.log(val);

    data.createdBy = req.user._id;

    trimmedVal = val.trim();

    const result = await TermsAndCondition.updateOne(
      { type: trimmedVal },
      data
    );

    if (result) {
      res.status(200).json({
        status: true,
        data: "Updated successfully",
      });
    } else {
      res.status(200).json({
        status: false,
        data: "Not updated",
      });
    }
  },

  addTermsAndCondition: async (req, res) => {
    // let val = parseInt(req.body.type);
    let data = req.body;
    data.createdBy = req.user._id;
    let val = parseInt(req.params.type);

    if (val == 0) {
      val = "Quiz";
    } else if (val == 1) {
      val = "Medpride Membership";
    } else if (val == 2) {
      val = "ReferAndEarn";
    }
    console.log(val);

    data.type = val;
    let result = await TermsAndCondition.findOne({ type: val });
    if (!result) {
      data.createdBy = req.user._id;
      let schemaObj = new TermsAndCondition(data);
      schemaObj
        .save()
        .then((response) => {
          res.status(200).json({
            status: true,
            data: "Terms added successfully",
          });
        })
        .catch(async (error) => {
          res.status(200).json({
            status: false,
            data: error,
          });
        });
    } else {
      trimmedVal = val.trim();
      await TermsAndCondition.updateOne({ type: trimmedVal }, data).then(
        (response) => {
          if (response.nModified == 1) {
            res.status(200).json({
              status: true,
              data: "Updated successfully",
            });
          } else {
            res.status(200).json({
              status: false,
              data: "Not updated",
            });
          }
        }
      );
    }
  },
};
