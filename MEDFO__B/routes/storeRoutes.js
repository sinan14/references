const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const StoreData = require("../models/store_schema");
exports.addNewStore = (req, res) => {
  const {
    name,
    level,
    catogory,
    email,
    phone,
    address,
    parent,
    pinCode,
    state,
    counrty,
    gst,
    registerNo,
    managerName,
    managerPhone,
    isDisabled,
    serviceablePincodes,
    password,
    posPassword,
  } = req.body;
  const createdBy = req.user._id;
  const updatedBy = req.user._id;
  const newStore = new StoreData({
    level,
    name,
    parent,
    catogory,
    phone,
    email,
    pinCode,
    address,
    state,
    counrty,
    gst,
    registerNo,
    managerName,
    managerPhone,
    isDisabled,
    createdBy,
    updatedBy,
    password,
    posPassword,
  });

  newStore
    .save()
    .then((res) => {
      res.status(200).json({
        status: "success",
        message: "store added",
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: "fail",
        message: "something went wrong",
      });
    });
};

router.route("/", addNewStore);


router.post("/a", (req, res) => {
  console.log(req.body);

  // const store = {
  //   name: req.body.Name,
  //   level: req.body.level,
  //   catogory: req.body.catogory,
  //   email: req.body.email,
  //   phone: req.body.phone,
  //   address: req.body.address,
  //   parent: req.body.parent,
  //   pinCode: req.body.pinCode,
  //   state: req.body.state,
  //   counrty: req.body.counrty,
  //   gst: req.body.gst,
  //   registerNo: req.body.registerNo,
  //   managerName: req.body.managerName,
  //   managerPhone: req.body.managerPhone,
  //   isDisabled: req.body.isDisabled,
  //   createdBy: req.user._id,
  //   updatedBy: req.user._id,
  // // password: req.body.password,
  ////   posPassword: "",
  //   serviceablePincodes: "",
  // };
  // newStore.save((err, result) => {
  //   if (err) {
  //     res.send({ status: false });
  //   }
  //   res.send({ status: true });
  // });
});

module.exports = router;
