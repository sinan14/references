const sizeOf = require("image-size");
const fs = require("fs");
const { promisify } = require("util");
const Stores = require("../../models/store");
const Inventory = require("../../models/inventory");

const unlinkAsync = promisify(fs.unlink);

exports.checkFoliofitFitnessCLubFile = (req, res, next) => {
  function unlinkImage(video, thumbnail, gif) {
    if (video) {
      video.map(async (e) => {
        if (fs.existsSync(`./public/images/foliofit/${e.filename}`)) {
          await unlinkAsync(e.path);
        }
      });
    }
    if (thumbnail) {
      thumbnail.map(async (e) => {
        if (fs.existsSync(`./public/images/foliofit/${e.filename}`)) {
          await unlinkAsync(e.path);
        }
      });
    }
    if (gif) {
      gif.map(async (e) => {
        if (fs.existsSync(`./public/images/foliofit/${e.filename}`)) {
          await unlinkAsync(e.path);
        }
      });
    }
  }

  if (req.files.video) {
    if (
      req.files.video[0].mimetype === "video/mp4" ||
      req.files.video[0].mimetype === "video/avi" ||
      req.files.video[0].mimetype === "video/x-flv" ||
      req.files.video[0].mimetype === "video/x-ms-wmv" ||
      req.files.video[0].mimetype === "video/3gpp"
    ) {
    } else {
      unlinkImage(req.files.video, req.files.thumbnail, req.files.gif);
      return res.status(422).json({
        status: false,
        data: "Video file type is not supported check with another file type. ",
      });
    }
  }
  if (req.files.thumbnail) {
    if (
      req.files.thumbnail[0].mimetype == "image/png" ||
      req.files.thumbnail[0].mimetype == "image/jpeg" ||
      req.files.thumbnail[0].mimetype == "image/svg+xml" ||
      req.files.thumbnail[0].mimetype == "image/jpg" ||
      req.files.thumbnail[0].mimetype == "image/gif"
    ) {
      let dimensions = sizeOf(req.files.thumbnail[0].path);
      if (dimensions.width != 1501 && dimensions.height != 815) {
        unlinkImage(req.files.video, req.files.thumbnail, req.files.gif);
        return res.status(422).json({
          status: false,
          data: "please upload thumbnail with size(1501 * 815)",
        });
      }
    } else {
      unlinkImage(req.files.video, req.files.thumbnail, req.files.gif);
      return res.status(422).json({
        status: false,
        data: "Image file type is not supported check with another file type. ",
      });
    }
  }
  next();
};
exports.checkStoreExistingPincode = async (req, res, next) => {
  let valid = await Stores.findOne({
    "serviceablePincodes._id": req.params.id,
  });
  if (valid) {
    let status = false;
    for (let item of valid.serviceablePincodes) {
      if (
        item._id == req.params.id &&
        item.code == req.body.code &&
        item.cashOnDelivery == req.body.status
      ) {
        status = true;
      }
    }
    if (status) {
      return res.status(200).json({
        status: true,
        data: "Updated",
      });
    } else {
      next();
    }
  } else {
    res.status(422).json({
      status: false,
      data: "Invalid Id",
    });
  }
};
exports.checkInventoryExistingData = async (req, res, next) => {
  let data = [];
  let status = false;
  let newPricing = JSON.parse(req.body.pricing);
  for (let item of newPricing) {
    if (data.includes(item.skuOrHsnNo)) {
      status = true;
    } else {
      data.push(item.skuOrHsnNo);
    }
  }
  if (status) {
    return res.status(200).json({
      status: false,
      data: "SKU/HSN is Duplicate existing",
    });
  }
  let valid = await Inventory.findOne({ "pricing.skuOrHsnNo": data });
  if (valid) {
    return res.status(200).json({
      status: false,
      data: "SKU/HSN is already existing",
    });
  } else {
    next();
  }
};
exports.checkEditInventoryExistingData = async (req, res, next) => {
  let data = [];
  let status = false;
  let newPricing = JSON.parse(req.body.pricing);
  for (let item of newPricing) {
    if (data.includes(item.skuOrHsnNo)) {
      status = true;
    } else {
      data.push(item.skuOrHsnNo);
    }
  }
  if (status) {
    return res.status(200).json({
      status: false,
      data: "SKU/HSN is Duplicate existing",
    });
  }
  let valid = await Inventory.findOne({
    _id: { $ne: req.params.id },
    "pricing.skuOrHsnNo": data,
  });
  if (valid) {
    return res.status(200).json({
      status: false,
      data: "SKU/HSN is already existing",
    });
  } else {
    next();
  }
};
exports.checkEditVarientExistingData = async (req, res, next) => {
  let valid = await Inventory.findOne({
    "pricing._id": { $ne: req.params.id },
    "pricing.skuOrHsnNo": req.body.skuOrHsnNo,
  });
  if (valid) {
    return res.status(200).json({
      status: false,
      data: "SKU/HSN is already existing",
    });
  } else {
    next();
  }
};
exports.checkPopupBannerFile = (req, res, next) => {
  // console.log(req.file)
  async function unlinkImage(image) {
    if (image) {
      if (fs.existsSync(`./public/images/popup/${image.filename}`)) {
        await unlinkAsync(image.path);
      }
    }
  }

  if (req.file) {
    if (
      req.file.mimetype == "image/png" ||
      req.file.mimetype == "image/jpeg" ||
      req.file.mimetype == "image/svg+xml" ||
      req.file.mimetype == "image/jpg" ||
      req.file.mimetype == "image/gif"
    ) {
      let dimensions = sizeOf(req.file.path);
      if (dimensions.width != 940 && dimensions.height != 822) {
        unlinkImage(req.file);
        return res.status(200).json({
          status: false,
          data: "please upload thumbnail with size(940 * 822)",
        });
      }
    } else {
      unlinkImage(req.file);
      return res.status(200).json({
        status: false,
        data: "Image file type is not supported check with another file type. ",
      });
    }
    req.body.image = `popup/${req.file.filename}`;
  }
  next();
};
