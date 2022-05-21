const mongoose = require("mongoose");
const specialPremiumCrud = require("../../models/premium/specialPriceCrudPremium");

const fs = require("fs");
const { isArray } = require("util");
module.exports = {

  SpecialAddDetailsToPremium: async (req, res, next) => {
    try {
  let data = req.body;
  data.createdBy = req.user._id;
        const obj = new specialPremiumCrud(data);
        obj
          .save()
          .then((_) => {
            res.status(200).json({
              status: true,
              data: "Added data to premium",
            });
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


SpecialEditDetailsToPremiumById: async (req, res, next) => {
    try {    
      let id = req.params.id;
      console.log(id);
      let result = await specialPremiumCrud.findOne(
        { _id: mongoose.Types.ObjectId(req.params.id)},
        { name: 1, month: 1, price: 1, specialPrice: 1, referAndEarn:1 }
      );
      if (!result) {
        res.status(422).json({
          status: false,
          data: "No special price to display",
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
  
  SpecialUpdateDetailsToPremiumById: async (req, res, next) => {
    try {
      let data = {
        id: req.params.id,
      };
      let result = await specialPremiumCrud.find({});
      if (result.length === 0) {
        const obj = new specialPremiumCrud(data);
        obj
          .save()
          .then((_) => {
            res.status(200).json({
              status: true,
              data: "Special Price Added Successfully",
            });
          })
          .catch(async (error) => {
            res.status(200).json({
              status: false,
              data: error,
            });
          });
      }

      else {
        console.log("result")
        console.log(req.body)
      const updated =  await specialPremiumCrud.findByIdAndUpdate(req.params.id,{...req.body});
            if (updated) {
              res.status(200).json({
                status: true,
                data: "Updated sepcial price successfully",
              });
            } else {
              res.status(200).json({
                status: false,
                data: "Not updated special price",
              });
            }
          }        
      }
     catch (error) {
      next(error);
    }
  },

  ShowDetailsFromSpecialPremium: async (req, res, next) => 
  {
    try {
  
      let result = await specialPremiumCrud.find();
      if (!result.length) {
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


};
