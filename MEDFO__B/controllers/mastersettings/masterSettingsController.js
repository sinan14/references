const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const sizeOf = require("image-size");
const MasterUOM = require("../../models/mastersettings/uom");
const MasterUOMValue = require("../../models/mastersettings/uomValue");
const MasterBrand = require("../../models/mastersettings/brand");
const MasterTax = require("../../models/mastersettings/tax");
const MasterCategory = require("../../models/mastersettings/category");
const MasterSubCategoryMedicine = require("../../models/mastersettings/subCategoryMedicine");
const MasterSubCategoryHealthcare = require("../../models/mastersettings/subCategoryHealthcare");
const MasterSubSubCategoryHealthcare = require("../../models/mastersettings/subSubCategory");
const MasterPolicy = require("../../models/mastersettings/masterPolicy");
const MasterPreference = require("../../models/mastersettings/masterPreference");
const MasterDeliveryChargeTime = require("../../models/mastersettings/deliveryChargeTime");

const Inventory = require("../../models/inventory");

var dimensions = "";
var imageError;
var imageType = "";

var categoryTypeHealth = "healthcare";
var categoryTypeMedicine = "medicine";
var categoryMedicineCount = 4;

var brandimageType = "brandimage";
var brandBannerimageType = "brandbanner";

const imgPath = process.env.BASE_URL;

function checkImageSize(imageType, fileInfo) {
    if (fileInfo) {
        dimensions = sizeOf(fileInfo.path);
    }

    if (imageType == brandimageType) {
        if (dimensions.width != 352 || dimensions.height != 250) {
            imageError = "Please upload image of size 352 * 250";
        }
    }
    if (imageType == brandBannerimageType) {
        if (dimensions.width != 1508 || dimensions.height != 630) {
            imageError = "Please upload banner of size 1508 * 630";
        }
    }
    if (imageType == "healthcare") {
        if (dimensions.width != 200 || dimensions.height != 200) {
            imageError = "Please upload image of size 200 * 200";
        }
    }
    if (imageType == "medicine") {
        if (dimensions.width != 480 || dimensions.height != 392) {
            imageError = "Please upload image of size 480 * 392";
        }
    }
    if (imageType == "subcategoryhealthimage") {
        if (dimensions.width != 200 || dimensions.height != 200) {
            imageError = "Please upload image of size 200 * 200";
        }
    }
    if (imageType == "subcategoryhealthbanner") {
        if (dimensions.width != 1554 || dimensions.height != 544) {
            imageError = "Please upload banner of size 1554 * 544";
        }
    }
    if (imageType == "subsubcategory") {
        if (dimensions.width != 200 || dimensions.height != 200) {
            imageError = "Please upload image of size 200 * 200";
        }
    }
}

function unlinkImage(banner, image) {
    try {
        if (banner) {
            banner.map(async (e) => {
                await unlinkAsync(e.path);
            });
        }
        if (image) {
            image.map(async (e) => {
                await unlinkAsync(e.path);
            });
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    /* Master settings UOM 
    ============================================= */
    addMasterUom: async (req, res, next) => {
        try {
            let data = req.body;
            let existingUOM = await MasterUOM.findOne({ title: data.title });
            if (!existingUOM) {
                data.createdBy = req.user._id;
                let schemaObj = new MasterUOM(data);
                schemaObj
                    .save()
                    .then((response) => {
                        res.status(200).json({
                            status: true,
                            data: "UOM added successfully",
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
                    data: "UOM already exist",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getMasterUom: async (req, res, next) => {
        try {
            let result = await MasterUOM.find(
                {},
                {
                    title: 1,
                    isDisabled: 1,
                }
            ).sort({$natural:-1});

            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getActiveMasterUom: async (req, res, next) => {
        try {
            let result = await MasterUOM.find(
                { isDisabled: false },
                {
                    title: 1,
                }
            ).sort({$natural:-1});
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getMasterUomById: async (req, res, next) => {
        try {
            let result = await MasterUOM.find(
                { _id: mongoose.Types.ObjectId(req.params.id) },
                {
                    title: 1,
                    isDisabled: 1,
                }
            );
            if (result.length != 0) {
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
    editMasterUom: async (req, res, next) => {
        try {
            let data = req.body;
            if (data.uomId) {
                let uom = await MasterUOM.findOne({ _id: mongoose.Types.ObjectId(data.uomId) });
                if (uom) {
                    let existingUOM = await MasterUOM.findOne({
                        title: data.title,
                        _id: { $ne: uom._id },
                    });

                    if (!existingUOM) {
                        data.updatedAt = new Date();
                        data.updatedBy = req.user._id;
                        MasterUOM.updateOne({ _id: mongoose.Types.ObjectId(data.uomId) }, data)
                            .then((response) => {
                                if (response.nModified == 1) {
                                    res.status(200).json({
                                        status: true,
                                        data: "UOM Updated Successfully",
                                    });
                                } else {
                                    res.status(200).json({
                                        status: false,
                                        data: "Not updated",
                                    });
                                }
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
                            data: "Title already exist",
                        });
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: "invalid uomId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter uomId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteMasterUom: async (req, res, next) => {
        try {
            let uom = await MasterUOM.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            if (uom) {
                let existUomvalue = await MasterUOMValue.findOne({ uomId: uom._id });
                if (!existUomvalue) {
                    let existInventory = await Inventory.find({ "pricing.uom": uom._id });
                    if (existInventory.length != 0) {
                        res.status(200).json({
                            status: false,
                            data: "You can't delete this uom because it has a product under it.",
                        });
                    } else {
                        MasterUOM.deleteOne({ _id: req.params.id })
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "UOM successfully deleted.",
                                });
                            })
                            .catch((error) => {
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: "You can't delete this uom because it has a uom value under it.",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Invalid id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    changeStatusMasterUom: async (req, res, next) => {
        try {
            let data = {};
            let result = await MasterUOM.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            if (result) {
                data.updatedAt = new Date();
                data.isDisabled = req.body.status;
                MasterUOM.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, data)
                    .then((response) => {
                        if (response.nModified == 1) {
                            res.status(200).json({
                                status: true,
                                data: "Status changed successfully",
                            });
                        } else {
                            res.status(200).json({
                                status: false,
                                data: "Please try after some time",
                            });
                        }
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

    /* Master settings UOM  Value
    ============================================= */
    addMasterUomValue: async (req, res, next) => {
        try {
            let data = req.body;
            let existingUOM = await MasterUOMValue.findOne({
                uomId: data.uomId,
                uomValue: data.uomValue,
            });
            if (!existingUOM) {
                let existingUomId = await MasterUOM.findOne({
                    _id: mongoose.Types.ObjectId(data.uomId),
                    isDisabled: false,
                });

                if (existingUomId) {
                    data.createdBy = req.user._id;
                    let schemaObj = new MasterUOMValue(data);
                    schemaObj
                        .save()
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "UOM value added successfully",
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
                        status: true,
                        data: "Incorrect Uom Id",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Existing uom value under this uom ",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getMasterUomValue: async (req, res, next) => {
        try {
            let result = await MasterUOMValue.find(
                {},
                {
                    uomValue: 1,
                    uomId: 1,
                    isDisabled: 1,
                }
            )
                .populate({ path: "uomId", select: ["title"] ,options: { sort: { createdAt: 1 }}})
                .lean();
                result = result.reverse();
            result.forEach((element) => {
                element.uom = element.uomId.title;
                let uomId = element.uomId._id;
                if (element["uomId"]) delete element["uomId"];
                element.uomId = uomId;
            });

            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getActiveMasterUomValue: async (req, res, next) => {
        try {
            let result = await MasterUOMValue.find(
                { isDisabled: false },
                {
                    uomValue: 1,
                    uomId: 1,
                }
            )
                .populate({ path: "uomId", select: ["title"] })
                .lean();

            result.forEach((element) => {
                element.uom = element.uomId.title;
                if (element["uomId"]) delete element["uomId"];
            });

            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getActiveMasterUomValueByUomId: async (req, res, next) => {
        try {
            let result = await MasterUOMValue.find(
                { isDisabled: false , uomId :mongoose.Types.ObjectId(req.params.uomId)  },
                {
                    uomValue: 1,
                    uomId: 1,
                }
            )
                .populate({ path: "uomId", select: ["title"] })
                .lean();

            result.forEach((element) => {
                element.uom = element.uomId.title;
                if (element["uomId"]) delete element["uomId"];
            });

            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getMasterUomValueById: async (req, res, next) => {
        try {
            let result = await MasterUOMValue.find(
                { _id: mongoose.Types.ObjectId(req.params.id) },
                {
                    uomValue: 1,
                    uomId: 1,
                    isDisabled: 1,
                }
            )
                .populate({ path: "uomId", select: ["title"] })
                .lean();

            result.forEach((element) => {
                element.uom = element.uomId.title;
                let uomsId = element.uomId._id;
                if (element["uomId"]) delete element["uomId"];
                element.uomId = uomsId;
            });
            if (result.length != 0) {
                res.status(200).json({
                    status: true,
                    data: result,
                });
            } else {
                res.status(200).json({
                    status: false,
                    data: "Invalid id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    editMasterUomValue: async (req, res, next) => {
        try {
            let data = req.body;
            if (data.uomValueId) {
                let existingUOMValue = await MasterUOMValue.findOne({ _id: mongoose.Types.ObjectId(data.uomValueId) });
                if (existingUOMValue) {
                    let existingUOM = await MasterUOMValue.findOne({
                        uomId: data.uomId,
                        uomValue: data.uomValue,
                        _id: { $ne: data.uomValueId },
                    });
                    if (!existingUOM) {
                        let existingUomId = await MasterUOM.findOne({
                            _id: mongoose.Types.ObjectId(data.uomId),
                            isDisabled: false,
                        });

                        if (existingUomId) {
                            data.updatedAt = new Date();
                            data.updatedBy = req.user._id;
                            MasterUOMValue.updateOne({ _id: mongoose.Types.ObjectId(data.uomValueId) }, data)
                                .then((response) => {
                                    if (response.nModified == 1) {
                                        res.status(200).json({
                                            status: true,
                                            data: "Uom value updated successfully",
                                        });
                                    } else {
                                        res.status(200).json({
                                            status: false,
                                            data: "Uom value not updated",
                                        });
                                    }
                                })
                                .catch((error) => {
                                    res.status(200).json({
                                        status: false,
                                        data: error,
                                    });
                                });
                        } else {
                            res.status(200).json({
                                status: true,
                                data: "Incorrect Uom Id",
                            });
                        }
                    } else {
                        res.status(200).json({
                            status: false,
                            data: "Existing uom value under this uom ",
                        });
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: "invalid uomValueId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter uomValueId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteMasterUomValue: async (req, res, next) => {
        try {
            let uomValue = await MasterUOMValue.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            if (uomValue) {
                let existInventory = await Inventory.find({ "pricing.sku": uomValue._id }).countDocuments();
                if (existInventory > 0) {
                    res.status(200).json({
                        status: false,
                        data: "You can't delete this uom value because it has a product under it.",
                    });
                } else {
                    MasterUOMValue.deleteOne({ _id: req.params.id })
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "UOM Value successfully deleted",
                            });
                        })
                        .catch((error) => {
                            res.status(200).json({
                                status: false,
                                data: error,
                            });
                        });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Invalid id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    changeStatusMasterUomValue: async (req, res, next) => {
        try {
            let data = {};
            let result = await MasterUOMValue.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            if (result) {
                data.updatedAt = new Date();
                data.isDisabled = req.body.status;
                MasterUOMValue.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, data)
                    .then((response) => {
                        if (response.nModified == 1) {
                            res.status(200).json({
                                status: true,
                                data: "Status Changed successfully.",
                            });
                        } else {
                            res.status(200).json({
                                status: false,
                                data: "Status not changed",
                            });
                        }
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

    /* Master Brand
    ============================================= */
    addMasterBrand: async (req, res, next) => {
        try {
            imageError = "false";
            if (req.files.image && req.files.banner) {
                var fileInfoImage = {};
                var fileInfoBanner = {};
                fileInfoImage = req.files.image[0];
                imageType = brandimageType;
                checkImageSize(imageType, fileInfoImage);
                fileInfoBanner = req.files.banner[0];
                imageType = brandBannerimageType;
                checkImageSize(imageType, fileInfoBanner);
                let data = {
                    title: req.body.title,
                    image: `master/${fileInfoImage.filename}`,
                    banner: `master/${fileInfoBanner.filename}`,
                    isShop: req.body.isShop,
                    isTrending: req.body.isTrending,
                    isFeatured: req.body.isFeatured,
                    isPromoted: req.body.isPromoted,
                    // createdBy: req.user._id,
                };

                if (imageError != "false") {
                    unlinkImage(req.files.banner, req.files.image);
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                } else {
                    let existingBrand = await MasterBrand.findOne({
                        isDisabled: false,
                        title: data.title,
                    });
                    if (!existingBrand) {
                        let schemaObj = new MasterBrand(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Brand added successfully",
                                });
                            })
                            .catch(async (error) => {
                                unlinkImage(req.files.banner, req.files.image);
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    } else {
                        unlinkImage(req.files.banner, req.files.image);
                        res.status(200).json({
                            status: false,
                            data: "Brand name exist",
                        });
                    }
                }
            } else {
                unlinkImage(req.files.banner, req.files.image);
                res.status(200).json({
                    status: false,
                    data: "Please upload image",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getMasterBrand: async (req, res, next) => {
        try {
            let result = await MasterBrand.find(
                { isDisabled: false },
                {
                    title: 1,
                    baner: { $concat: [imgPath, "$banner"] },
                    image: { $concat: [imgPath, "$image"] },
                    isShop: 1,
                    isTrending: 1,
                    isFeatured: 1,
                    isPromoted: 1,
                }
            );

            result = result.reverse()

            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getMasterBrandById: async (req, res, next) => {
        try {
            let result = await MasterBrand.find(
                { isDisabled: false, _id: mongoose.Types.ObjectId(req.params.id) },
                {
                    title: 1,
                    baner: { $concat: [imgPath, "$banner"] },
                    image: { $concat: [imgPath, "$image"] },
                    isShop: 1,
                    isTrending: 1,
                    isFeatured: 1,
                    isPromoted: 1,
                }
            );
            if (result.length != 0) {
                res.status(200).json({
                    status: true,
                    data: result,
                });
            } else {
                res.status(200).json({
                    status: false,
                    data: "Invalid id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    editMasterBrand: async (req, res, next) => {
        try {
            imageError = "false";
            let data = req.body;
            var fileInfo = {};
            if (data.brandId) {
                let brand = await MasterBrand.findOne({ _id: mongoose.Types.ObjectId(data.brandId) });
                if (brand) {
                    data.image = brand.image;
                    data.banner = brand.banner;
                    if (req.files.image) {
                        var fileInfoImage = {};
                        fileInfoImage = req.files.image[0];
                        imageType = brandimageType;
                        checkImageSize(imageType, fileInfoImage);
                        if (imageError == "false") {
                            data.image = `master/${fileInfoImage.filename}`;
                            // deleting old image
                            let splittedImageRoute = brand.image.split("/");
                            if (fs.existsSync(`./public/images/master/${splittedImageRoute[1]}`)) {
                                fs.unlink(`./public/images/master/${splittedImageRoute[1]}`, function (err) {
                                    if (err) throw err;
                                });
                            }
                        }
                    }
                    if (req.files.banner) {
                        var fileInfoBanner = {};
                        fileInfoBanner = req.files.banner[0];
                        imageType = brandBannerimageType;
                        checkImageSize(imageType, fileInfoBanner);
                        if (imageError == "false") {
                            data.banner = `master/${fileInfoBanner.filename}`;
                            // deleting old banner
                            let splittedBannerRoute = brand.banner.split("/");
                            if (fs.existsSync(`./public/images/master/${splittedBannerRoute[1]}`)) {
                                fs.unlink(`./public/images/master/${splittedBannerRoute[1]}`, function (err) {
                                    if (err) throw err;
                                });
                            }
                        }
                    }
                    if (imageError == "false") {
                        let existingBrand = await MasterBrand.findOne({
                            isDisabled: false,
                            title: data.title,
                            _id: { $ne: data.brandId },
                        });
                        if (!existingBrand) {
                            data.updatedAt = new Date();
                            data.updatedBy = req.user._id;
                            MasterBrand.updateOne({ _id: mongoose.Types.ObjectId(data.brandId) }, data)
                                .then((response) => {
                                    if (response.nModified == 1) {
                                        res.status(200).json({
                                            status: true,
                                            data: "Brand updated successfully",
                                        });
                                    } else {
                                        res.status(200).json({
                                            status: false,
                                            data: "Something went wrong",
                                        });
                                    }
                                })
                                .catch((error) => {
                                    res.status(200).json({
                                        status: false,
                                        data: error,
                                    });
                                });
                        } else {
                            unlinkImage(req.files.banner, req.files.image);
                            res.status(200).json({
                                status: false,
                                data: "Brand name already exist",
                            });
                        }
                    } else {
                        unlinkImage(req.files.banner, req.files.image);
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                    }
                } else {
                    unlinkImage(req.files.banner, req.files.image);
                    res.status(200).json({
                        status: false,
                        data: "Invalid brandId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter brandId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteMasterBrand: async (req, res, next) => {
        try {
            let brand = await MasterBrand.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (brand) {
                let existInventory = await Inventory.find({ "brand": brand._id }).countDocuments();
                if (existInventory > 0) {
                    res.status(200).json({
                        status: false,
                        data: "You can't delete this brand because it has a product under it.",
                    });
                } else {
                    MasterBrand.deleteOne({ _id: req.params.id })
                        .then((response) => {
                            let splittedImageRoute = brand.image.split("/");

                            fs.unlink(`./public/images/master/${splittedImageRoute[1]}`, function (err) {
                                if (err) throw err;
                            });
                            let splittedThumbnailRoute = brand.banner.split("/");

                            fs.unlink(`./public/images/master/${splittedThumbnailRoute[1]}`, function (err) {
                                if (err) throw err;
                            });

                            res.status(200).json({
                                status: true,
                                data: "Brand deleted successfully",
                            });
                        })
                        .catch((error) => {
                            res.status(200).json({
                                status: false,
                                data: error,
                            });
                        });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "invalid Id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getMasterBrandByType: async (req, res, next) => {
        try {
            let brandType = req.params.brandType.replace(/\s+/g, " ").trim();
            if (brandType == "shop" || brandType == "trending" || brandType == "promoted" || brandType == "featured") {
                var result = "";
                if (brandType == "shop") {
                    result = await MasterBrand.find(
                        { isShop: true, isDisabled: false },
                        {
                            title: 1,
                            baner: { $concat: [imgPath, "$banner"] },
                            image: { $concat: [imgPath, "$image"] },
                            isShop: 1,
                            isTrending: 1,
                            isFeatured: 1,
                            isPromoted: 1,
                        }
                    );
                } else if (brandType == "promoted") {
                    result = await MasterBrand.find(
                        { isPromoted: true, isDisabled: false },
                        {
                            title: 1,
                            baner: { $concat: [imgPath, "$banner"] },
                            image: { $concat: [imgPath, "$image"] },
                            isShop: 1,
                            isTrending: 1,
                            isFeatured: 1,
                            isPromoted: 1,
                        }
                    );
                } else if (brandType == "trending") {
                    result = await MasterBrand.find(
                        { isTrending: true, isDisabled: false },
                        {
                            title: 1,
                            baner: { $concat: [imgPath, "$banner"] },
                            image: { $concat: [imgPath, "$image"] },
                            isShop: 1,
                            isTrending: 1,
                            isFeatured: 1,
                            isPromoted: 1,
                        }
                    );
                } else {
                    result = await MasterBrand.find(
                        { isFeatured: true, isDisabled: false },
                        {
                            title: 1,
                            baner: { $concat: [imgPath, "$banner"] },
                            image: { $concat: [imgPath, "$image"] },
                            isShop: 1,
                            isTrending: 1,
                            isFeatured: 1,
                            isPromoted: 1,
                        }
                    );
                }
                res.status(200).json({
                    status: true,
                    data: result,
                });
            } else {
                res.status(200).json({
                    status: false,
                    data: "Incorrect Brand Type",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    removeMasterBrand: async (req, res, next) => {
        try {
            let data = {};
            let result = await MasterBrand.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            if (result) {
                data.updatedAt = new Date();
                data.isDisabled = true;
                MasterBrand.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, data)
                    .then((response) => {
                        if (response.nModified == 1) {
                            res.status(200).json({
                                status: true,
                                data: "Data removed successfully",
                            });
                        } else {
                            res.status(200).json({
                                status: false,
                                data: "Data not removed ",
                            });
                        }
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

    /* Master settings Tax 
    ============================================= */
    addMasterTax: async (req, res, next) => {
        try {
            let data = req.body;
            let existingTax = await MasterTax.findOne({ title: data.title });
            if (!existingTax) {
                data.createdBy = req.user._id;
                let schemaObj = new MasterTax(data);
                schemaObj
                    .save()
                    .then((response) => {
                        res.status(200).json({
                            status: true,
                            data: "Tax added successfully",
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
                    data: "Existing Tax name",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getMasterTax: async (req, res, next) => {
        try {
            let result = await MasterTax.find(
                {},
                {
                    title: 1,
                    percentage: 1,
                    isDisabled: 1,
                }
            ).sort({$natural:-1});
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getActiveMasterTax: async (req, res, next) => {
        try {
            let result = await MasterTax.find(
                { isDisabled: false },
                {
                    title: 1,
                    percentage: 1,
                }
            ).sort({$natural:-1});
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getMasterTaxById: async (req, res, next) => {
        try {
            let result = await MasterTax.find(
                { _id: mongoose.Types.ObjectId(req.params.id) },
                {
                    title: 1,
                    percentage: 1,
                }
            );
            if (result.length != 0) {
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
    editMasterTax: async (req, res, next) => {
        try {
            let data = req.body;
            if (data.taxId) {
                let Tax = await MasterTax.findOne({ _id: mongoose.Types.ObjectId(data.taxId) });

                if (Tax) {
                    data.updatedAt = new Date();
                    data.updatedBy = req.user._id;
                    let existingTax = await MasterTax.findOne({
                        title: data.title,
                        _id: { $ne: data.taxId },
                    });
                    if (!existingTax) {
                        MasterTax.updateOne({ _id: mongoose.Types.ObjectId(data.taxId) }, data)
                            .then((response) => {
                                if (response.nModified == 1) {
                                    res.status(200).json({
                                        status: true,
                                        data: "Updated Successfully",
                                    });
                                } else {
                                    res.status(200).json({
                                        status: false,
                                        data: "Something went wrong",
                                    });
                                }
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
                            data: "Title already exist",
                        });
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: "Invalid taxId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter taxId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteMasterTax: async (req, res, next) => {
        try {
            let tax = await MasterTax.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (tax) {
                let existInventory = await Inventory.find({ "tax": tax._id }).countDocuments();
                if (existInventory > 0) {
                    res.status(200).json({
                        status: false,
                        data: "You can't delete this tax because it has a product under it.",
                    });
                } else { 
                    MasterTax.deleteOne({ _id: req.params.id })
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "Tax successfully deleted",
                            });
                        })
                        .catch((error) => {
                            res.status(200).json({
                                status: false,
                                data: error,
                            });
                        });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Invalid id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    changeStatusMasterTax: async (req, res, next) => {
        try {
            let data = {};
            let result = await MasterTax.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            if (result) {
                data.updatedAt = new Date();
                data.isDisabled = req.body.status;
                MasterTax.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, data)
                    .then((response) => {
                        if (response.nModified == 1) {
                            res.status(200).json({
                                status: true,
                                data: "Status changed successfully",
                            });
                        } else {
                            res.status(200).json({
                                status: false,
                                data: "Status not changed",
                            });
                        }
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

    /* Master Settings Category Healthcare
    ============================================= */
    addCategoryHealthcare: async (req, res, next) => {
        try {
            imageError = "false";
            var data = req.body;
            if (req.file) {
                var fileInfo = {};
                fileInfo = req.file;
                imageType = categoryTypeHealth;
                checkImageSize(imageType, fileInfo);
                if (imageError != "false") {
                    fs.unlink(fileInfo.path, (err) => {
                        if (err) throw err;
                    });
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                } else {
                    data.categoryType = categoryTypeHealth;
                    data.image = `master/${req.file.filename}`;
                    let existingTitle = await MasterCategory.findOne({
                        title: data.title,
                        categoryType: categoryTypeHealth,
                    });
                    if (!existingTitle) {
                        data.createdBy = req.user._id;
                        let schemaObj = new MasterCategory(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Category added successfully",
                                });
                            })
                            .catch(async (error) => {
                                if (req.file) {
                                    await unlinkAsync(req.file.path);
                                }
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    } else {
                        if (req.file) {
                            await unlinkAsync(req.file.path);
                        }
                        res.status(200).json({
                            status: false,
                            data: "Category name already exist",
                        });
                    }
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please upload image",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getCategoryHealthcare: async (req, res, next) => {
        try {
            let result = await MasterCategory.find(
                { categoryType: categoryTypeHealth },
                {
                    title: 1,
                    categoryType: 1,
                    image: { $concat: [imgPath, "$image"] },
                    isDisabled: 1,
                }
            );
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getActiveCategoryHealthcare: async (req, res, next) => {
        try {
            let result = await MasterCategory.find(
                { categoryType: categoryTypeHealth, isDisabled: false },
                {
                    title: 1,
                    categoryType: 1,
                    image: { $concat: [imgPath, "$image"] },
                }
            );
            if (result.length != 0) {
                res.status(200).json({
                    status: true,
                    data: result,
                });
            } else {
                res.status(200).json({
                    status: false,
                    data: "No data found",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getCategoryHealthcareById: async (req, res, next) => {
        try {
            let result = await MasterCategory.find(
                { _id: mongoose.Types.ObjectId(req.params.id), categoryType: categoryTypeHealth },
                {
                    title: 1,
                    categoryType: 1,
                    image: { $concat: [imgPath, "$image"] },
                    isDisabled: 1,
                }
            );
            if (result) {
                res.status(200).json({
                    status: true,
                    data: result,
                });
            } else {
                res.status(200).json({
                    status: true,
                    data: "Invalid id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    editCategoryHealthcare: async (req, res, next) => {
        try {
            imageError = "false";
            let data = req.body;
            if (data.categoryId) {
                let category = await MasterCategory.findOne({ _id: mongoose.Types.ObjectId(data.categoryId) });
                if (category) {
                    data.image = category.image;
                    if (req.file) {
                        var fileInfo = {};
                        fileInfo = req.file;
                        imageType = categoryTypeHealth;
                        checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                            });
                        } else {
                            data.image = `master/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = category.image.split("/");
                            let path = `./public/images/master/${splittedImageRoute[1]}`;
                            if (fs.existsSync(path)) {
                                fs.unlink(path, function (err) {
                                    if (err) throw err;
                                });
                            }
                        }
                    }
                    if (imageError == "false") {
                        let existingTitle = await MasterCategory.findOne({
                            title: data.title,
                            categoryType: categoryTypeHealth,
                            _id: { $ne: data.categoryId },
                        });
                        if (!existingTitle) {
                            data.updatedAt = new Date();
                            data.updatedBy = req.user._id;
                            MasterCategory.updateOne({ _id: mongoose.Types.ObjectId(data.categoryId) }, data)
                                .then((response) => {
                                    if (response.nModified == 1) {
                                        res.status(200).json({
                                            status: true,
                                            data: "Category updated successfully",
                                        });
                                    } else {
                                        res.status(200).json({
                                            status: false,
                                            data: "Category not updated",
                                        });
                                    }
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
                                data: "Category name already exist",
                            });
                        }
                    } else {
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                    }
                } else {
                    if (req.file) {
                        await unlinkAsync(req.file.path);
                    }
                    res.status(200).json({
                        status: false,
                        data: "Invalid categoryId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter categoryId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteCategoryHealthcare: async (req, res, next) => {
        try {
            let category = await MasterCategory.findOne({ _id: mongoose.Types.ObjectId(req.params.id),categoryType: categoryTypeHealth });

            if (category) {
                let existSubCategory = await MasterSubCategoryHealthcare.findOne({ categoryId: category._id});
                if (!existSubCategory) {                  
                    let existInventory = await Inventory.find({ categories: category.id });
                    if (existInventory.length != 0) {
                        res.status(200).json({
                            status: false,
                            data: "You can't delete this category because it has a product under it.",
                        });
                    } else {   
                       
                        MasterCategory.deleteOne({ _id: req.params.id })
                        .then((response) => {
                            let splittedImageRoute = category.image.split("/");
                            fs.unlink(`./public/images/master/${splittedImageRoute[1]}`, function (err) {
                                if (err) throw err;
                            });
                            res.status(200).json({
                                status: true,
                                data: "Category in healthcare deleted successfully",
                            });
                        })
                        .catch((error) => {
                            res.status(200).json({
                                status: false,
                                data: error,
                            });
                        });         
                    }
                }
                else{
                    res.status(200).json({
                        status: false,
                        data: "You can't delete this category because it has a sub category under it.",
                    });
                }
            
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
    changeStatusCategoryHealthcare: async (req, res, next) => {
        try {
            let data = req.body;
            if (req.params.id) {
                let category = await MasterCategory.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
                if (category) {
                //    if(data.status == "true"){
                //         let existSubCategory = await MasterSubCategoryHealthcare.findOne({ categoryId: category._id});
                //         if (existSubCategory) {  
                //             return res.status(200).json({
                //                 status: false,
                //                 data: "You can't change this category status because it has a sub category under it.",
                //             });  
                //         } 
                //     }
                    data.updatedAt = new Date();
                    data.isDisabled = data.status;
                    MasterCategory.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, data)
                        .then((response) => {
                            if (response.nModified == 1) {
                                res.status(200).json({
                                    status: true,
                                    data: "Status changed successfully",
                                });
                            } else {
                                res.status(200).json({
                                    status: false,
                                    data: "Status not updated",
                                });
                            }
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
                        data: "Invalid categoryId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter categoryId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    removeCategoryHealthcare: async (req, res, next) => {
        try {
            let data = {};
            let result = await MasterCategory.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            if (result) {
                data.updatedAt = new Date();
                data.isDisabled = true;
                MasterCategory.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, data)
                    .then((response) => {
                        if (response.nModified == 1) {
                            res.status(200).json({
                                status: true,
                                data: "Data removed successfully",
                            });
                        } else {
                            res.status(200).json({
                                status: false,
                                data: "Data not removed ",
                            });
                        }
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

    /* Master Settings Category Medicine
    ============================================= */

    getCategoryMedicine: async (req, res, next) => {
        try {
            let result = await MasterCategory.find(
                { categoryType: categoryTypeMedicine },
                {
                    title: 1,
                    categoryType: 1,
                    image: { $concat: [imgPath, "$image"] },
                    isDisabled: 1,
                }
            );
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    
    getActiveCategoryMedicine: async (req, res, next) => {
        try {
            let result = await MasterCategory.find(
                { categoryType: categoryTypeMedicine, isDisabled: false },
                {
                    title: 1,
                    categoryType: 1,
                    image: { $concat: [imgPath, "$image"] },
                    isDisabled: 1,
                }
            );
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getCategoryMedicineById: async (req, res, next) => {
        try {
            let result = await MasterCategory.find(
                { _id: mongoose.Types.ObjectId(req.params.id), categoryType: categoryTypeMedicine },
                {
                    title: 1,
                    categoryType: 1,
                    image: { $concat: [imgPath, "$image"] },
                    isDisabled: 1,
                }
            );
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    editCategoryMedicine: async (req, res, next) => {
        try {
            
            if(req.body.title){
                var regex = /^[^a-zA-Z]+$/;
                var matched = regex.test(req.body.title);
                if (matched)
                return res.status(200).json({
                    status: false,  
                    data: "Invalid category title.",
                    });
            }
          

            imageError = "false";
            let data = req.body;
            let file = req.file;
            if (data.categoryId) {
                let category = await MasterCategory.findOne({ _id: mongoose.Types.ObjectId(data.categoryId) });
                if (category) {
                    data.image = category.image;
                    if (req.file) {
                        var fileInfo = {};
                        fileInfo = req.file;
                        imageType = categoryTypeMedicine;
                        checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                            });
                        } else {
                            data.image = `master/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = category.image.split("/");
                            let path = `./public/images/master/${splittedImageRoute[1]}`;
                            if (fs.existsSync(path)) {
                                fs.unlink(path, function (err) {
                                    if (err) throw err;
                                });
                            }
                        }
                    }
                    if (imageError == "false") {
                        data.updatedAt = new Date();
                        data.updatedBy = req.user._id;
                        let existingTitle = await MasterCategory.findOne({
                            title: data.title,
                            categoryType: categoryTypeMedicine,
                            _id: { $ne: data.categoryId },
                        });
                        if (!existingTitle) {
                            MasterCategory.updateOne({ _id: mongoose.Types.ObjectId(data.categoryId) }, data)
                                .then((response) => {
                                    if (response.nModified == 1) {
                                        res.status(200).json({
                                            status: true,
                                            data: "Category updated successfully",
                                        });
                                    } else {
                                        res.status(200).json({
                                            status: false,
                                            data: "Category not updated.something went wrong.",
                                        });
                                    }
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
                                data: "Category name already exist.",
                            });
                        }
                    } else {
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                    }
                } else {
                    if (req.file) {
                        await unlinkAsync(req.file.path);
                    }
                    res.status(200).json({
                        status: false,
                        data: "invalid categoryId",
                    });
                }
            } else {
                let categoryCount = await MasterCategory.find({
                    categoryType: categoryTypeMedicine,
                    isDisabled: false,
                }).countDocuments();
                if (categoryCount < categoryMedicineCount) {
                    if (req.file) {
                        var fileInfo = {};
                        fileInfo = req.file;
                        imageType = categoryTypeMedicine;
                        checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                            });
                            res.status(200).json({
                                status: false,
                                data: imageError,
                            });
                        } else {
                            data.categoryType = categoryTypeMedicine;
                            data.image = `master/${req.file.filename}`;
                            data.createdBy = req.user._id;
                            let existingTitle = await MasterCategory.findOne({
                                title: data.title,
                                categoryType: categoryTypeMedicine,
                            });
                            if (!existingTitle) {
                                let schemaObj = new MasterCategory(data);
                                schemaObj
                                    .save()
                                    .then((response) => {
                                        res.status(200).json({
                                            status: true,
                                            data: "Category added successfully",
                                        });
                                    })
                                    .catch(async (error) => {
                                        if (req.file) {
                                            await unlinkAsync(req.file.path);
                                        }
                                        res.status(200).json({
                                            status: false,
                                            data: error,
                                        });
                                    });
                            } else {
                                if (req.file) {
                                    await unlinkAsync(req.file.path);
                                }
                                res.status(200).json({
                                    status: false,
                                    data: "Category name already exist",
                                });
                            }
                        }
                    } else {
                        res.status(200).json({
                            status: false,
                            data: "Please upload image",
                        });
                    }
                } else {
                    if (req.file) {
                        await unlinkAsync(req.file.path);
                    }
                    res.status(200).json({
                        status: false,
                        data: "Category already exist.Please enter the category id for edit category in medicine",
                    });
                }
            }
        } catch (error) {
            next(error);
        }
    },
    changeStatusCategoryMedicine: async (req, res, next) => {
        try {
            let data = req.body;
            if (req.params.id) {
                let category = await MasterCategory.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
                if (category) {
                    data.updatedAt = new Date();
                    data.isDisabled = data.status;
                    MasterCategory.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, data)
                        .then((response) => {
                            if (response.nModified == 1) {
                                res.status(200).json({
                                    status: true,
                                    data: "Status changed successfully",
                                });
                            } else {
                                res.status(200).json({
                                    status: false,
                                    data: "Status not changed.",
                                });
                            }
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
                        data: "Invalid categoryId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter categoryId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteCategoryMedicine: async (req, res, next) => {
        try {
            let category = await MasterCategory.findOne({ _id: mongoose.Types.ObjectId(req.params.id),categoryType: categoryTypeMedicine });

            if (category) {
                let existSubCategory = await MasterSubCategoryMedicine.findOne({ categoryId: category._id });
                if (!existSubCategory) {                  
                    let existInventory = await Inventory.find({ categories: category.id });
                    if (existInventory.length != 0) {
                        res.status(200).json({
                            status: false,
                            data: "You can't delete this category because it has a product under it.",
                        });
                    } else {                       
                        MasterCategory.deleteOne({ _id: req.params.id })
                        .then((response) => {
                            let splittedImageRoute = category.image.split("/");
                            let path = `./public/images/master/${splittedImageRoute[1]}`;
                            if (fs.existsSync(path)) {
                                fs.unlink(path, function (err) {
                                    if (err) throw err;
                                });
                            }    
                            res.status(200).json({
                                status: true,
                                data: "Categroy deleted successfully",
                            });
                        })
                        .catch((error) => {
                            res.status(200).json({
                                status: false,
                                data: error,
                            });
                        });
                    }
                }else{
                    res.status(200).json({
                        status: false,
                        data: "You can't delete this category because it has a sub category under it.",
                    });
                }
           
            } else {
                res.status(200).json({
                    status: false,
                    data: "Invalid id",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    /* Master settings Sub Category Medicine 
    ============================================= */
    addSubCategoryMedicine: async (req, res, next) => {
        try {
            let data = req.body;
            let existingCategory = await MasterSubCategoryMedicine.findOne({ title: data.title ,categoryId:data.categoryId});
            if (!existingCategory) {
                let existingMainCategory = await MasterCategory.findOne({ _id: data.categoryId });
                if (existingMainCategory) {
                    data.createdBy = req.user._id;
                    let schemaObj = new MasterSubCategoryMedicine(data);
                    schemaObj
                        .save()
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "Sub category added successfully",
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
                        status: true,
                        data: "Invalid Category Id",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Existing sub category name",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getSubCategoryMedicine: async (req, res, next) => {
        try {
            // let result = await MasterSubCategoryMedicine.find(
            //     {},
            //     {
            //         title: 1,
            //         categoryId: 1,
            //         isDisabled: 1,
            //     }
            // );
            let result = await MasterSubCategoryMedicine.find(
                {},
                {
                    title: 1,
                    categoryId: 1,
                    isDisabled: 1,
                }
            )
                .populate({ path: "categoryId", select: ["title"] })
                .lean();

            result.forEach((element) => {
                element.category = element.categoryId.title;
                let categoryId = element.categoryId._id;
                if (element["categoryId"]) delete element["categoryId"];
                element.categoryId = categoryId;
            });
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getSubCategoryMedicineByCategoryId: async (req, res, next) => {
        try {
            // let result = await MasterSubCategoryMedicine.find(
            //     {},
            //     {
            //         title: 1,
            //         categoryId: 1,
            //         isDisabled: 1,
            //     }
            // );
            let result = await MasterSubCategoryMedicine.find(
                {categoryId: mongoose.Types.ObjectId(req.params.categoryId)},
                {
                    title: 1,
                    categoryId: 1,
                    isDisabled: 1,
                }
            )
                .populate({ path: "categoryId", select: ["title"] })
                .lean();

            result.forEach((element) => {
                element.category = element.categoryId.title;
                let categoryId = element.categoryId._id;
                if (element["categoryId"]) delete element["categoryId"];
                element.categoryId = categoryId;
            });
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getActiveSubCategoryMedicine: async (req, res, next) => {
        try {
            let result = await MasterSubCategoryMedicine.find(
                { isDisabled: false },
                {
                    title: 1,
                    categoryId: 1,
                }
            )
                .populate({ path: "categoryId", select: ["title"] })
                .lean();

            result.forEach((element) => {
                element.category = element.categoryId.title;
                let categoryId = element.categoryId._id;
                if (element["categoryId"]) delete element["categoryId"];
                element.categoryId = categoryId;
            });
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getSubCategoryMedicineById: async (req, res, next) => {
        try {
            let result = await MasterSubCategoryMedicine.find(
                { _id: mongoose.Types.ObjectId(req.params.id) },
                {
                    title: 1,
                    // categoryId: 1,
                    isDisabled: 1,
                }
            );
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    editSubCategoryMedicine: async (req, res, next) => {
        try {
            let data = req.body;
            if (data.subCategoryId) {
                let category = await MasterSubCategoryMedicine.findOne({
                    _id: mongoose.Types.ObjectId(data.subCategoryId),
                });

                if (category) {
                    let existingCategory = await MasterSubCategoryMedicine.findOne({
                        title: data.title,
                        _id: { $ne: data.subCategoryId },
                    });
                    if (!existingCategory) {
                        let existingMainCategory = await MasterCategory.findOne({ _id: data.categoryId });
                        if (existingMainCategory) {
                            data.updatedAt = new Date();
                            data.updatedBy = req.user._id;
                            MasterSubCategoryMedicine.updateOne({ _id: mongoose.Types.ObjectId(data.subCategoryId) }, data)
                                .then((response) => {
                                        res.status(200).json({
                                            status: true,
                                            data: "Sub category updated successfully",
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
                                data: "Invalid category Id",
                            });
                        }
                    } else {
                        res.status(200).json({
                            status: false,
                            data: "Sub category already exist",
                        });
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: "invalid subCategoryId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter subCategoryId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteSubCategoryMedicine: async (req, res, next) => {
        try {
            let category = await MasterSubCategoryMedicine.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (category) {
                let existInventory = await Inventory.find({ categories: category.id });
                if (existInventory.length != 0) {
                    res.status(200).json({
                        status: false,
                        data: "You can't delete this category because it has a product under it.",
                    });
                } else {                 
                    MasterSubCategoryMedicine.deleteOne({ _id: req.params.id })
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "sub category deleted successfully",
                            });
                        })
                        .catch((error) => {
                            res.status(200).json({
                                status: false,
                                data: error,
                            });
                        });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Invalid id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    changeStatusSubCategoryMedicine: async (req, res, next) => {
        try {
            let data = req.body;
            if (req.params.id) {
                let category = await MasterSubCategoryMedicine.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
                if (category) {
                    data.updatedAt = new Date();
                    data.isDisabled = data.status;

                    MasterSubCategoryMedicine.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, data)
                        .then((response) => {
                            if (response.nModified == 1) {
                                res.status(200).json({
                                    status: true,
                                    data: "Status changed successfully",
                                });
                            } else {
                                res.status(200).json({
                                    status: false,
                                    data: "Status not updated",
                                });
                            }
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
                        data: "Invalid categoryId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter categoryId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    removeMasterSubCategoryMedicine: async (req, res, next) => {
        try {
            let data = {};
            let result = await MasterSubCategoryMedicine.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            if (result) {
                data.updatedAt = new Date();
                data.isDisabled = true;
                MasterSubCategoryMedicine.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, data)
                    .then((response) => {
                        if (response.nModified == 1) {
                            res.status(200).json({
                                status: true,
                                data: "Data removed successfully",
                            });
                        } else {
                            res.status(200).json({
                                status: false,
                                data: "Data not removed ",
                            });
                        }
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

    /*Master Settings Sub category Healthcare
    ============================================= */
    addSubCategoryHealthcare: async (req, res, next) => {
        try {
            imageError = "false";
            if (req.files.image && req.files.banner) {
                var fileInfoImage = {};
                var fileInfoBanner = {};
                fileInfoImage = req.files.image[0];
                imageType = "subcategoryhealthimage";
                checkImageSize(imageType, fileInfoImage);
                fileInfoBanner = req.files.banner[0];
                imageType = "subcategoryhealthbanner";
                checkImageSize(imageType, fileInfoBanner);
                let data = {
                    title: req.body.title,
                    categoryId: req.body.categoryId,
                    image: `master/${fileInfoImage.filename}`,
                    banner: `master/${fileInfoBanner.filename}`,
                    createdBy: req.user._id,
                };

                if (imageError != "false") {
                    unlinkImage(req.files.banner, req.files.image);
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                } else {
                    let existingMainCategory = await MasterCategory.findOne({
                        _id: data.categoryId,
                        categoryType: categoryTypeHealth,
                    });
                    if (existingMainCategory) {
                        let existingCategory = await MasterSubCategoryHealthcare.findOne({
                            title: data.title,
                            categoryId:data.categoryId
                        });
                        if (!existingCategory) {
                            let schemaObj = new MasterSubCategoryHealthcare(data);
                            schemaObj
                                .save()
                                .then((response) => {
                                    res.status(200).json({
                                        status: true,
                                        data: "Sub category added successfully",
                                    });
                                })
                                .catch(async (error) => {
                                    unlinkImage(req.files.banner, req.files.image);
                                    res.status(200).json({
                                        status: false,
                                        data: error,
                                    });
                                });
                        } else {
                            unlinkImage(req.files.banner, req.files.image);
                            res.status(200).json({
                                status: false,
                                data: "Sub category name already exist",
                            });
                        }
                    } else {
                        res.status(200).json({
                            status: false,
                            data: "Invalid categoryId",
                        });
                    }
                }
            } else {
                unlinkImage(req.files.banner, req.files.image);
                res.status(200).json({
                    status: false,
                    data: "Please upload image",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getSubCategoryHealthcare: async (req, res, next) => {
        try {
            // let result = await MasterSubCategoryHealthcare.find(
            //     {},
            //     {
            //         title: 1,
            //         categoryId: 1,
            //         image: { $concat: [imgPath, "$image"] },
            //         banner: { $concat: [imgPath, "$banner"] },
            //         isDisabled: 1,
            //     }
            // );
            let result = await MasterSubCategoryHealthcare.find(
                {},
                {
                    title: 1,
                    categoryId: 1,
                    image: { $concat: [imgPath, "$image"] },
                    banner: { $concat: [imgPath, "$banner"] },
                    isDisabled: 1,
                }
            )
                .populate({ path: "categoryId", select: ["title"] })
                .lean();

            result.forEach((element) => {
                element.category = element.categoryId.title;
                let categoryId = element.categoryId._id;
                if (element["categoryId"]) delete element["categoryId"];
                element.categoryId = categoryId;
            });
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getActiveSubCategoryHealthcare: async (req, res, next) => {
        try {
            let result = await MasterSubCategoryHealthcare.find(
                { isDisabled: false },
                {
                    title: 1,
                    categoryId: 1,
                    image: { $concat: [imgPath, "$image"] },
                    banner: { $concat: [imgPath, "$banner"] },
                    isDisabled: 1,
                }
            );
            // let result = await MasterSubCategoryHealthcare.find(
            //     {isDisabled: false},
            //     {
            //         title: 1,
            //         categoryId: 1,
            //         image: { $concat: [imgPath, "$image"] },
            //         banner: { $concat: [imgPath, "$banner"] },
            //         isDisabled: 1
            //     }
            // )
            //     .populate({ path: "categoryId", select: ["title"] })
            //     .lean();

            // result.forEach((element) => {
            //     element.category = element.categoryId.title;
            //     let categoryId = element.categoryId._id;
            //     if (element["categoryId"]) delete element["categoryId"];
            //     element.categoryId = categoryId;
            // });
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getSubCategoryHealthcareById: async (req, res, next) => {
        try {
            let result = await MasterSubCategoryHealthcare.find(
                { _id: mongoose.Types.ObjectId(req.params.id) },
                {
                    title: 1,
                    categoryId: 1,
                    image: { $concat: [imgPath, "$image"] },
                    banner: { $concat: [imgPath, "$banner"] },
                    isDisabled: 1,
                }
            );
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getSubCategoryHealthcareByCategoryId: async (req, res, next) => {
        try {
            let result = await MasterSubCategoryHealthcare.find(
                { categoryId: mongoose.Types.ObjectId(req.params.categoryId) },
                {
                    title: 1,
                    categoryId: 1,
                    image: { $concat: [imgPath, "$image"] },
                    banner: { $concat: [imgPath, "$banner"] },
                    isDisabled: 1,
                }
            );
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    editSubCategoryHealthcare: async (req, res, next) => {
        try {
            imageError = "false";
            let data = req.body;
            var fileInfo = {};
            if (data.subCategoryId) {
                let category = await MasterSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(data.subCategoryId),
                });
                if (category) {
                    let existingMainCategory = await MasterCategory.findOne({
                        _id: data.categoryId,
                        categoryType: categoryTypeHealth,
                    });
                    if (existingMainCategory) {
                        let existingCategory = await MasterSubCategoryHealthcare.findOne({
                            title: data.title,
                            _id: { $ne: data.subCategoryId },
                        });

                        if (!existingCategory) {
                            data.image = category.image;
                            data.banner = category.banner;
                            if (req.files.image) {
                                var fileInfoImage = {};
                                fileInfoImage = req.files.image[0];
                                imageType = "subcategoryhealthimage";
                                checkImageSize(imageType, fileInfoImage);
                                if (imageError == "false") {
                                    data.image = `master/${fileInfoImage.filename}`;
                                    // deleting old image
                                    let splittedImageRoute = category.image.split("/");
                                    console.log("splitted::", splittedImageRoute);
                                    if (fs.existsSync(`./public/images/master/${splittedImageRoute[1]}`)) {
                                        fs.unlink(`./public/images/master/${splittedImageRoute[1]}`, function (err) {
                                            if (err) throw err;
                                        });
                                    }
                                }
                            }
                            if (req.files.banner) {
                                var fileInfoBanner = {};
                                fileInfoBanner = req.files.banner[0];
                                imageType = "subcategoryhealthbanner";
                                checkImageSize(imageType, fileInfoBanner);
                                if (imageError == "false") {
                                    data.banner = `master/${fileInfoBanner.filename}`;
                                    // deleting old banner
                                    let splittedBannerRoute = category.banner.split("/");
                                    console.log("splitted::", splittedBannerRoute);
                                    if (fs.existsSync(`./public/images/master/${splittedBannerRoute[1]}`)) {
                                        fs.unlink(`./public/images/master/${splittedBannerRoute[1]}`, function (err) {
                                            if (err) throw err;
                                            console.log("old banner deleted!");
                                        });
                                    }
                                }
                            }

                            if (imageError == "false") {
                                data.updatedAt = new Date();
                                data.updatedBy = req.user._id;
                                MasterSubCategoryHealthcare.updateOne(
                                    { _id: mongoose.Types.ObjectId(data.subCategoryId) },
                                    data
                                )
                                    .then((response) => {
                                        if (response.nModified == 1) {
                                            res.status(200).json({
                                                status: true,
                                                data: "Sub category updated successfully",
                                            });
                                        } else {
                                            res.status(200).json({
                                                status: false,
                                                data: "Sub category not updated",
                                            });
                                        }
                                    })
                                    .catch((error) => {
                                        res.status(200).json({
                                            status: false,
                                            data: error,
                                        });
                                    });
                            } else {
                                unlinkImage(req.files.banner, req.files.image);

                                res.status(200).json({
                                    status: false,
                                    data: imageError,
                                });
                            }
                        } else {
                            res.status(200).json({
                                status: false,
                                data: "sub category name already exist",
                            });
                        }
                    } else {
                        res.status(200).json({
                            status: false,
                            data: "Invalid category id",
                        });
                    }
                } else {
                    unlinkImage(req.files.banner, req.files.image);
                    res.status(200).json({
                        status: false,
                        data: "invalid subCategoryId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter subCategoryId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteSubCategoryHealthcare: async (req, res, next) => {
        try {
            let category = await MasterSubCategoryHealthcare.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (category) {
                let existSubSubCategory = await MasterSubSubCategoryHealthcare.findOne({ subCategoryId: category._id });
                if (!existSubSubCategory) {
                    let existInventory = await Inventory.find({ categories: category.id });
                    if (existInventory.length != 0) {
                        res.status(200).json({
                            status: false,
                            data: "You can't delete this category because it has a product under it.",
                        });
                    } else {    
                                    
                        MasterSubCategoryHealthcare.deleteOne({ _id: req.params.id })
                        .then((response) => {
                            let splittedImageRoute = category.image.split("/");
                            let path = `./public/images/master/${splittedImageRoute[1]}`;
                            if (fs.existsSync(path)) {
                                fs.unlink(path, function (err) {
                                    if (err) throw err;
                                });
                            }
                            let splittedBannerRoute = category.banner.split("/");
                            let bannerPath = `./public/images/master/${splittedBannerRoute[1]}`;
                            if (fs.existsSync(bannerPath)) {
                                fs.unlink(bannerPath, function (err) {
                                    if (err) throw err;
                                });
                            }
    
                            res.status(200).json({
                                status: true,
                                data: "Sub Category deleted successfully",
                            });
                        })
                        .catch((error) => {
                            res.status(200).json({
                                status: false,
                                data: error,
                            });
                        });
                    }
               


                }else{
                    res.status(200).json({
                        status: false,
                        data: "You can't delete this sub category because it has a sub sub category under it.",
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
    changeStatusSubCategoryHealthcare: async (req, res, next) => {
        try {
            let data = req.body;
            if (req.params.id) {
                let category = await MasterSubCategoryHealthcare.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
                if (category) {
                    data.updatedAt = new Date();
                    data.isDisabled = data.status;

                    MasterSubCategoryHealthcare.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, data)
                        .then((response) => {
                            if (response.nModified == 1) {
                                res.status(200).json({
                                    status: true,
                                    data: "Status changed successfully",
                                });
                            } else {
                                res.status(200).json({
                                    status: false,
                                    data: "Status not updated",
                                });
                            }
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
                        data: "Invalid id",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter categoryId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    removeSubCategoryHealthcare: async (req, res, next) => {
        try {
            let data = {};
            let result = await MasterSubCategoryHealthcare.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            if (result) {
                data.updatedAt = new Date();
                data.isDisabled = true;
                MasterSubCategoryHealthcare.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, data)
                    .then((response) => {
                        if (response.nModified == 1) {
                            res.status(200).json({
                                status: true,
                                data: "Data removed successfully",
                            });
                        } else {
                            res.status(200).json({
                                status: false,
                                data: "Data not removed ",
                            });
                        }
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

    /* Master Settings  Healthcare Sub Sub Categories
    ============================================= */
    addSubSubCategoryHealthcare: async (req, res, next) => {
        try {
            imageError = "false";
            var data = req.body;
            if (req.file) {
                var fileInfo = {};
                fileInfo = req.file;
                imageType = "subsubcategory";
                checkImageSize(imageType, fileInfo);
                if (imageError != "false") {
                    fs.unlink(fileInfo.path, (err) => {
                        if (err) throw err;
                    });
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                } else {
                    data.image = `master/${req.file.filename}`;
                    let existingTitle = await MasterSubSubCategoryHealthcare.findOne({
                        title: data.title,
                        subCategoryId:data.subCategoryId
                    });
                    if (!existingTitle) {
                        let existingMainSubCategory = await MasterSubCategoryHealthcare.findOne({
                            _id: data.subCategoryId,
                        });
                        if (existingMainSubCategory) {
                            let schemaObj = new MasterSubSubCategoryHealthcare(data);
                            schemaObj
                                .save()
                                .then((response) => {
                                    res.status(200).json({
                                        status: true,
                                        data: "Sub sub category added successfully",
                                    });
                                })
                                .catch(async (error) => {
                                    if (req.file) {
                                        await unlinkAsync(req.file.path);
                                    }
                                    res.status(200).json({
                                        status: false,
                                        data: error,
                                    });
                                });
                        } else {
                            res.status(200).json({
                                status: false,
                                data: "Invalid sub category id",
                            });
                        }
                    } else {
                        if (req.file) {
                            await unlinkAsync(req.file.path);
                        }
                        res.status(200).json({
                            status: false,
                            data: "Category name exist",
                        });
                    }
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please upload image",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getSubSubCategoryHealthcare: async (req, res, next) => {
        try {
            // let result = await MasterSubSubCategoryHealthcare.find(
            //     {},
            //     {
            //         title: 1,
            //         subCategoryId: 1,
            //         image: { $concat: [imgPath, "$image"] },
            //         isDisabled: 1,
            //     }
            // );
            let result = await MasterSubSubCategoryHealthcare.find(
                {},
                {
                    title: 1,
                    subCategoryId: 1,
                    image: { $concat: [imgPath, "$image"] },
                    isDisabled: 1,
                }
            )
                .populate({ path: "subCategoryId", select: ["title"] })
                .lean();

            result.forEach((element) => {
                element.subCategory = element.subCategoryId.title;
                let subCategoryId = element.subCategoryId._id;
                if (element["subCategoryId"]) delete element["subCategoryId"];
                element.subCategoryId = subCategoryId;
            });
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getSubSubCategoryHealthcareById: async (req, res, next) => {
        try {
            // let result = await MasterSubSubCategoryHealthcare.find(
            //     {},
            //     {
            //         title: 1,
            //         subCategoryId: 1,
            //         image: { $concat: [imgPath, "$image"] },
            //         isDisabled: 1,
            //     }
            // );
            let result = await MasterSubSubCategoryHealthcare.find(
                { _id: mongoose.Types.ObjectId(req.params.id) },
                {
                    title: 1,
                    subCategoryId: 1,
                    image: { $concat: [imgPath, "$image"] },
                    isDisabled: 1,
                }
            )
                .populate({ path: "subCategoryId", select: ["title"] })
                .lean();

            result.forEach((element) => {
                element.subCategory = element.subCategoryId.title;
                let subCategoryId = element.subCategoryId._id;
                if (element["subCategoryId"]) delete element["subCategoryId"];
                element.subCategoryId = subCategoryId;
            });
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getSubSubCategoryHealthcareByCategoryId: async (req, res, next) => {
        try {
            // let result = await MasterSubSubCategoryHealthcare.find(
            //     {},
            //     {
            //         title: 1,
            //         subCategoryId: 1,
            //         image: { $concat: [imgPath, "$image"] },
            //         isDisabled: 1,
            //     }
            // );
            let result = await MasterSubSubCategoryHealthcare.find(
                { subCategoryId: mongoose.Types.ObjectId(req.params.subCategoryId) },
                {
                    title: 1,
                    subCategoryId: 1,
                    image: { $concat: [imgPath, "$image"] },
                    isDisabled: 1,
                }
            )
                .populate({ path: "subCategoryId", select: ["title"] })
                .lean();

            result.forEach((element) => {
                element.subCategory = element.subCategoryId.title;
                let subCategoryId = element.subCategoryId._id;
                if (element["subCategoryId"]) delete element["subCategoryId"];
                element.subCategoryId = subCategoryId;
            });
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getActiveSubSubCategoryHealthcare: async (req, res, next) => {
        try {
            // let result = await MasterSubSubCategoryHealthcare.find(
            //     {},
            //     {
            //         title: 1,
            //         subCategoryId: 1,
            //         image: { $concat: [imgPath, "$image"] },
            //         isDisabled: 1,
            //     }
            // );
            let result = await MasterSubSubCategoryHealthcare.find(
                { isDisabled: false },
                {
                    title: 1,
                    subCategoryId: 1,
                    image: { $concat: [imgPath, "$image"] },
                }
            )
                .populate({ path: "subCategoryId", select: ["title"] })
                .lean();

            result.forEach((element) => {
                element.subCategory = element.subCategoryId.title;
                let subCategoryId = element.subCategoryId._id;
                if (element["subCategoryId"]) delete element["subCategoryId"];
                element.subCategoryId = subCategoryId;
            });
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    editSubSubCategoryHealthcare: async (req, res, next) => {
        try {
            imageError = "false";
            let data = req.body;
            if (data.subSubCategoryId) {
                let category = await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(data.subSubCategoryId),
                });
                if (category) {
                    let existingMainSubCategory = await MasterSubCategoryHealthcare.findOne({
                        _id: data.subCategoryId,
                    });
                    if (existingMainSubCategory) {
                        let existingCategory = await MasterSubSubCategoryHealthcare.findOne({
                            title: data.title,
                            _id: { $ne: data.subSubCategoryId },
                        });

                        if (!existingCategory) {
                            if (req.file) {
                                var fileInfo = {};
                                fileInfo = req.file;
                                imageType = "subsubcategory";
                                checkImageSize(imageType, fileInfo);
                                if (imageError != "false") {
                                    fs.unlink(fileInfo.path, (err) => {
                                        if (err) throw err;
                                    });
                                } else {
                                    data.image = `master/${req.file.filename}`;
                                    // deleting old image
                                    let splittedImageRoute = category.image.split("/");

                                    fs.unlink(`./public/images/master/${splittedImageRoute[1]}`, function (err) {
                                        if (err) throw err;
                                    });
                                }
                            }
                            if (imageError == "false") {
                                data.updatedAt = new Date();
                                data.updatedBy = req.user._id;
                                MasterSubSubCategoryHealthcare.updateOne(
                                    { _id: mongoose.Types.ObjectId(data.subSubCategoryId) },
                                    data
                                )
                                    .then((response) => {
                                        if (response.nModified == 1) {
                                            res.status(200).json({
                                                status: true,
                                                data: "Sub sub category updated successfully",
                                            });
                                        } else {
                                            res.status(200).json({
                                                status: false,
                                                data: "Sub sub category not updated",
                                            });
                                        }
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
                                    data: imageError,
                                });
                            }
                        } else {
                            res.status(200).json({
                                status: false,
                                data: "Sub sub category name already exist",
                            });
                        }
                    } else {
                        res.status(200).json({
                            status: false,
                            data: "Invalid sub category id",
                        });
                    }
                } else {
                    if (req.file) {
                        await unlinkAsync(req.file.path);
                    }
                    res.status(200).json({
                        status: false,
                        data: "Invalid sub sub category id",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter sub sub categoryId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteSubSubCategoryHealthcare: async (req, res, next) => {
        try {
            let category = await MasterSubSubCategoryHealthcare.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (category) {
                let existInventory = await Inventory.find({ categories: category.id });
                if (existInventory.length != 0) {
                    res.status(200).json({
                        status: false,
                        data: "You can't delete this category because it has a product under it.",
                    });
                } else {                       
                    MasterSubSubCategoryHealthcare.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = category.image.split("/");
                        fs.unlink(`./public/images/master/${splittedImageRoute[1]}`, function (err) {
                            if (err) throw err;
                        });

                        res.status(200).json({
                            status: true,
                            data: "Sub sub Categroy deleted successfully",
                        });
                    })
                    .catch((error) => {
                        res.status(200).json({
                            status: false,
                            data: error,
                        });
                    });
                }
           
            } else {
                res.status(200).json({
                    status: false,
                    data: "Invalid id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    changeStatusSubSubCategoryHealthcare: async (req, res, next) => {
        try {
            let data = req.body;
            if (req.params.id) {
                let category = await MasterSubSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(req.params.id),
                });
                if (category) {
                    data.updatedAt = new Date();
                    data.isDisabled = data.status;

                    MasterSubSubCategoryHealthcare.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, data)
                        .then((response) => {
                            if (response.nModified == 1) {
                                res.status(200).json({
                                    status: true,
                                    data: "Status changed successfully",
                                });
                            } else {
                                res.status(200).json({
                                    status: false,
                                    data: "Not updated",
                                });
                            }
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
                        data: "invalid categoryId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter categoryId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    removeSubSubCategoryHealthcare: async (req, res, next) => {
        try {
            let data = {};
            let result = await MasterSubSubCategoryHealthcare.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            if (result) {
                data.updatedAt = new Date();
                data.isDisabled = true;
                MasterSubSubCategoryHealthcare.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, data)
                    .then((response) => {
                        if (response.nModified == 1) {
                            res.status(200).json({
                                status: true,
                                data: "Data removed successfully",
                            });
                        } else {
                            res.status(200).json({
                                status: false,
                                data: "Data not removed ",
                            });
                        }
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

    /* Master settings Policy 
    ============================================= */
    addMasterPolicy: async (req, res, next) => {
        try {
            let data = req.body;
            let existingPloicy = await MasterPolicy.findOne({ title: data.title });
            if (!existingPloicy) {
                let schemaObj = new MasterPolicy(data);
                schemaObj
                    .save()
                    .then((response) => {
                        res.status(200).json({
                            status: true,
                            data: "Policy added successfully",
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
                    data: "Policy already exist",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getMasterPolicy: async (req, res, next) => {
        try {
            let result = await MasterPolicy.find({}, { title: 1, return: 1, cancel: 1, isDisabled: 1 });
           result = result.reverse();
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getMasterPolicyById: async (req, res, next) => {
        try {
            let result = await MasterPolicy.find(
                { _id: mongoose.Types.ObjectId(req.params.id) },
                { title: 1, return: 1, cancel: 1, isDisabled: 1 }
            );
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getActiveMasterPolicy: async (req, res, next) => {
        try {
            let result = await MasterPolicy.find({ isDisabled: false }, { title: 1, return: 1, cancel: 1 });
            result = result.reverse();
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    editMasterPolicy: async (req, res, next) => {
        try {
            let data = req.body;
            if (data.policyId) {
                let policy = await MasterPolicy.findOne({ _id: mongoose.Types.ObjectId(data.policyId) });
                if (policy) {
                    let existingTitle = await MasterPolicy.findOne({ title: data.title, _id: { $ne: data.policyId } });
                    if (!existingTitle) {
                        data.updatedAt = new Date();
                        MasterPolicy.updateOne({ _id: mongoose.Types.ObjectId(data.policyId) }, data)
                            .then((response) => {
                                if (response.nModified == 1) {
                                    res.status(200).json({
                                        status: true,
                                        data: "Policy updated successfully",
                                    });
                                } else {
                                    res.status(200).json({
                                        status: false,
                                        data: "Policy not updated.",
                                    });
                                }
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
                            data: "Policy already exist",
                        });
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: "invalid policyId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter policyId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteMasterPolicy: async (req, res, next) => {
        try {
            let policy = await MasterPolicy.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            if (policy) {
                let existInventory = await Inventory.find({ "policy": policy._id }).countDocuments();
                if (existInventory > 0) {
                    res.status(200).json({
                        status: false,
                        data: "You can't delete this policy because it has a product under it.",
                    });
                } else {                   
                    MasterPolicy.deleteOne({ _id: req.params.id })
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "Policy successfully deleted",
                            });
                        })
                        .catch((error) => {
                            res.status(200).json({
                                status: false,
                                data: error,
                            });
                        });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Invalid policyId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    changeStatusMasterPolicy: async (req, res, next) => {
        try {
            let data = req.body;
            let policy = await MasterPolicy.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            if (policy) {
                data.updatedAt = new Date();
                data.isDisabled = req.body.status;
                MasterPolicy.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, data)
                    .then((response) => {
                        if (response.nModified == 1) {
                            res.status(200).json({
                                status: true,
                                data: "Status changed successfully",
                            });
                        } else {
                            res.status(200).json({
                                status: false,
                                data: "Something went wrong.",
                            });
                        }
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
                    data: "Invalid id",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    /* Master settings Preference 
    ============================================= */
    addMasterPreference: async (req, res, next) => {
        try {
           
            let data = req.body;
            let existingPolicy = await MasterPreference.findOne({ title: data.title, isDisabled: false });
            if (!existingPolicy) {

                const paymentTypes = ["razorpay", "cashfree"];
                if (paymentTypes.includes(data.paymentType)) {
                   
                    let schemaObj = new MasterPreference(data);
                    schemaObj
                        .save()
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "Preference added successfully",
                            });
                        })
                        .catch(async (error) => {
                            res.status(200).json({
                                status: false,
                                data: error,
                            });
                        });
                }else{
                    res.status(200).json({
                        status: false,
                        data: "Invalid payment type",
                    });
                }
           
            } else {
                res.status(200).json({
                    status: false,
                    data: "Existing Preference",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getMasterPreference: async (req, res, next) => {
        try {
            let result = await MasterPreference.find(
                { isDisabled: false },
                {
                    prescription: 1,
                    deliveryTimeFrom: 1,
                    deliveryTimeTo: 1,
                    minPurchaseAmount: 1,
                    minFreeDeliveryAmount: 1,
                    maxMedcoinUse:1,
                    paymentType:1
                }
            );
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    editMasterPreference: async (req, res, next) => {
        try {
            let data = req.body;
            if (data.preferenceId) {
                let preference = await MasterPreference.findOne({ _id: mongoose.Types.ObjectId(data.preferenceId) });
                if (preference) {
                    data.updatedAt = new Date();
                    data.updatedBy = req.user._id;
                    const paymentTypes = ["razorpay", "cashfree"];
                    if (paymentTypes.includes(data.paymentType)) {
                        MasterPreference.updateOne({ _id: mongoose.Types.ObjectId(data.preferenceId) }, data)
                        .then((response) => {
                            if (response.nModified == 1) {
                                res.status(200).json({
                                    status: true,
                                    data: "Preference updated successfully",
                                });
                            } else {
                                res.status(200).json({
                                    status: false,
                                    data: "Something went wrong.Please try after some time",
                                });
                            }
                        })
                        .catch((error) => {
                            res.status(200).json({
                                status: false,
                                data: error,
                            });
                        });
                    }else{
                        res.status(200).json({
                            status: false,
                            data: "Invalid payment type",
                        });
                    }
            
                } else {
                    res.status(200).json({
                        status: false,
                        data: "Invalid preferenceId",
                    });
                }
            } else {
                let count = await MasterPreference.find().countDocuments();
                if (count < 1) {
                    const paymentTypes = ["razorpay", "cashfree"];
                    if (paymentTypes.includes(data.paymentType)) {
                        let data = req.body;
                        data.createdBy = req.user._id;
                        let schemaObj = new MasterPreference(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Preference added successfully",
                                });
                            })
                            .catch(async (error) => {
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    }else{
                        res.status(200).json({
                            status: false,
                            data: "Invalid payment type",
                        });

                    }    
                   
                } else {
                    res.status(200).json({
                        status: false,
                        data: "Preference already exist.Please enter preferenceId for updating details",
                    });
                }
            }
        } catch (error) {
            next(error);
        }
    },
    deleteMasterPreference: async (req, res, next) => {
        try {
            let preference = await MasterPreference.findOne({});
            if (preference) {
                MasterPreference.deleteOne({})
                    .then((response) => {
                        res.status(200).json({
                            status: true,
                            data: "Preference successfully deleted.",
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
                    data: "invalid policyId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    addDeliveryChargeTime: async (req, res, next) => {
        try {
            let data = req.body;
            let existingDeliveryChargeTime = await MasterDeliveryChargeTime.findOne({ level: data.level });
            if (!existingDeliveryChargeTime) {
                data.createdBy = req.user._id;
                let schemaObj = new MasterDeliveryChargeTime(data);
                schemaObj
                    .save()
                    .then((response) => {
                        res.status(200).json({
                            status: true,
                            data: "DeliveryCharge and Time added successfully",
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
                    data: "DeliveryCharge and Time already exist",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getDeliveryChargeTime: async (req, res, next) => {
        try {
            let result = await MasterDeliveryChargeTime.find(
                { isDisabled: false },
                {
                    level: 1,
                    DeliveryTime: 1,
                    charge: 1,
                }
            );

            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    editDeliveryChargeTime: async (req, res, next) => {
        try {
            let data = req.body;
            if (data.DeliveryChargeTimeId) {
                let DeliveryChargeTime = await MasterDeliveryChargeTime.findOne({
                    _id: mongoose.Types.ObjectId(data.DeliveryChargeTimeId),
                });
                if (DeliveryChargeTime) {
                    let existingDeliveryChargeTime = await MasterDeliveryChargeTime.findOne({
                        level: data.level,
                        _id: { $ne: DeliveryChargeTime._id },
                    });

                    if (!existingDeliveryChargeTime) {
                        data.updatedAt = new Date();
                        data.updatedBy = req.user._id;
                        MasterDeliveryChargeTime.updateOne(
                            { _id: mongoose.Types.ObjectId(data.DeliveryChargeTimeId) },
                            data
                        )
                            .then((response) => {
                                if (response.nModified == 1) {
                                    res.status(200).json({
                                        status: true,
                                        data: "DeliveryChargeTime Updated Successfully",
                                    });
                                } else {
                                    res.status(200).json({
                                        status: false,
                                        data: "Not updated",
                                    });
                                }
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
                            data: "DeliveryChargeTime already exist",
                        });
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: "invalid DeliveryChargeTimeId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter DeliveryChargeTimeId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
};
