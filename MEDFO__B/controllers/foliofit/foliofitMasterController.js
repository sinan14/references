const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const sizeOf = require("image-size");
const moment = require("moment");
const FoliofitMasterYogaHome = require("../../models/foliofit/foliofitMasterYogaHome");
const FoliofitMasterYogaWeekly = require("../../models/foliofit/foliofitMasterYogaWeekly");
const FoliofitMasterYogaHealthyRecommended = require("../../models/foliofit/foliofitMasterYogaHealthyRecommended");
const FoliofitMasterFitnessMainHomeFullbodyHealthy = require("../../models/foliofit/foliofitMasterFitnessHomeFullbodyHealthy");
const FoliofitMasterYogaMasterMainCategory = require("../../models/foliofit/foliofitMasterYogaMain");

const NutrichartCategoryBased = require("../../models/foliofit/nutrichartCategoryBased");
const NutrichartVitamin = require("../../models/foliofit/nutrichartVitamin");
const nutrichartCategory = require("../../models/nutrichartCategory");

const healthReminder = require("../../models/healthReminder");
const healthCalculator = require("../../models/HealthCalculator");
const foliofitWeeklyWorkout = require("../../models/foliofit/foliofitMasterWeekly");
const { response } = require("express");
const foliofitHomePage = require("../../models/foliofit/foliofitMasterHome");
const nutrichartFood = require("../../models/nutrichartFood");

const imgPath = process.env.BASE_URL;

// const AdsFoliofitBanner = require("../models/ads/foliofit/banner");
// var fitnessTypeBanner = "fitness";
// const AdsFoliofitAd1Slider = require("../models/ads/foliofit/ad1slider");

var dimensions = "";
var imageError = "false";
var imageType = "";
var yogaTypeHealthy = "healthy";
var yogaTypeRecommended = "recommended";

var fitnessTypeHome = "homeworkouts";
var fitnessTypeMain = "maincategory";
var fitnessTypeFullBody = "fullbodyworkouts";
var fitnessTypeHealthyJourney = "healthyjourney";

function checkImageSize(imageType, fileInfo) {
    if (fileInfo) {
        dimensions = sizeOf(fileInfo.path);
    }
    if (imageType == "weekly") {
        if (dimensions.width != 1501 && dimensions.height != 815) {
            imageError = "Please upload image of size 1501 * 815";
        }
    } else if (imageType == "yogamaincategorybanner") {
        if (dimensions.width != 1501 && dimensions.height != 815) {
            imageError = "Please upload banner of size 1501 * 815";
        }
    } else if (imageType == "yogamaincategoryicon") {
        if (dimensions.width != 302 && dimensions.height != 302) {
            imageError = "Please upload icon of size 302 * 302";
        }
    } else if (imageType == "yogarecommendbanner") {
        if (dimensions.width != 1501 && dimensions.height != 815) {
            imageError = "Please upload banner of size 1501 * 815";
        }
    } else if (imageType == "yogarecommendicon") {
        if (dimensions.width != 852 && dimensions.height != 852) {
            imageError = "Please upload icon of size 852 * 852";
        }
    } else if (imageType == "yogaicon") {
        if (dimensions.width != 852 && dimensions.height != 852) {
            imageError = "Please upload icon of size 852 * 852";
        }
    } else if (imageType == "yogabanner") {
        if (dimensions.width != 1501 && dimensions.height != 815) {
            imageError = "Please upload banner of size 1501 * 815";
        }
    } else if (imageType == "homeworkoutsbanner") {
        if (dimensions.width != 680 && dimensions.height != 376) {
            imageError = "Please upload banner of size 680 * 376";
        }
    } else if (imageType == "homeworkoutsicon") {
        if (dimensions.width != 520 && dimensions.height != 428) {
            imageError = "Please upload icon of size 520 * 428";
        }
    } else if (imageType == "maincategorybanner") {
        if (dimensions.width != 680 && dimensions.height != 376) {
            imageError = "Please upload banner of size 680 * 376";
        }
    } else if (imageType == "maincategoryicon") {
        if (dimensions.width != 202 && dimensions.height != 202) {
            imageError = "Please upload icon of size 202 * 202";
        }
    } else if (imageType == "fullbodybanner") {
        if (dimensions.width != 680 && dimensions.height != 376) {
            imageError = "Please upload banner of size 680 * 376";
        }
    } else if (imageType == "fullbodyicon") {
        if (dimensions.width != 374 && dimensions.height != 374) {
            imageError = "Please upload icon of size 374 * 374";
        }
    } else if (imageType == "healthybanner") {
        if (dimensions.width != 680 && dimensions.height != 376) {
            imageError = "Please upload banner of size 680 * 376";
        }
    } else if (imageType == "healthyicon") {
        if (dimensions.width != 592 && dimensions.height != 632) {
            imageError = "Please upload icon of size 592 * 632";
        }
    } else {
        console.log("hello");
    }
}

function unlinkImage(banner, icon) {
    if (banner) {
        banner.map(async (e) => {
            await unlinkAsync(e.path);
        });
    }
    if (icon) {
        icon.map(async (e) => {
            await unlinkAsync(e.path);
        });
    }
}

module.exports = {
    /* Foliofit Master Yoga Home Page
    ============================================= */

    getAllFoliofitMasterYogaHome: async (req, res, next) => {
        try {
            let result = [];
            result[0] = await FoliofitMasterYogaHome.findOne(
                { isDisabled: false },
                {
                    categoryId: 1,
                }
            ).lean();

            let category;
            let resultMain = await FoliofitMasterYogaMasterMainCategory.findById(result[0].categoryId).lean();
            if (resultMain) category = resultMain;
            let resultOther = await FoliofitMasterYogaHealthyRecommended.findById(result[0].categoryId).lean();
            if (resultOther) category = resultOther;
            let resultWeekly = await FoliofitMasterYogaWeekly.findById(result[0].categoryId).lean();
            if (resultWeekly) {
                category = resultWeekly;
                category.banner = category.image
                category.icon = category.image
            } 

            if (category) {
                result[0].title = category.title;
                result[0].icon = imgPath + category.icon;
                result[0].banner = imgPath + category.banner;
            }

            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getFoliofitMasterYogaHome: async (req, res, next) => {
        try {
            let result = await FoliofitMasterYogaHome.findOne(
                {
                    _id: mongoose.Types.ObjectId(req.params.id),
                },
                {
                    categoryId: 1,
                }
            ).lean();
            let category;
            let resultMain = await FoliofitMasterYogaMasterMainCategory.findById(result.categoryId).lean();
            if (resultMain) category = resultMain;
            let resultOther = await FoliofitMasterYogaHealthyRecommended.findById(result.categoryId).lean();
            if (resultOther) category = resultOther;
            let resultWeekly = await FoliofitMasterYogaWeekly.findById(result.categoryId).lean();
            if (resultWeekly) category = resultWeekly;

            if (category) {
                result.title = category.title;
            }

            if (!result) {
                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
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
    editFoliofitMasterYogaHome: async (req, res, next) => {
        try {
            let data = req.body;
            if (data.homeId) {
                let foliofitHome = await FoliofitMasterYogaHome.findOne({ _id: mongoose.Types.ObjectId(data.homeId) });

                if (foliofitHome) {
                    data.updatedAt = new Date();
                    data.updatedBy = req.user._id;
                    FoliofitMasterYogaHome.updateOne({ _id: mongoose.Types.ObjectId(data.homeId) }, data)
                        .then((response) => {
                            if (response.nModified == 1) {
                                res.status(200).json({
                                    status: true,
                                    data: "Updated",
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
                        data: "invalid homeId",
                    });
                }
            } else {
                let data = req.body;
                let foliofitHomeCount = await FoliofitMasterYogaHome.countDocuments();
                if (foliofitHomeCount != 1) {
                    data.createdBy = req.user._id;
                    let schemaObj = new FoliofitMasterYogaHome(data);
                    schemaObj
                        .save()
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "Foilofit home added successfully",
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
                        data: "Category Id already exist. Please update using Id",
                    });
                }
            }
        } catch (error) {
            next(error);
        }
    },
    deleteFoliofitMasterYogaHome: async (req, res, next) => {
        try {
            let yoga = await FoliofitMasterYogaHome.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (yoga) {
                FoliofitMasterYogaHome.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        res.status(200).json({
                            status: true,
                            data: "Details deleted successfully",
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
                    data: "invalid Id",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    /* Foliofit Master Yoga main Category
    ============================================= */
    addFoliofitMasterYogaMainCategory: async (req, res, next) => {
        try {
            if (req.files.icon && req.files.banner) {
                var fileInfoIcon = {};
                var fileInfoBanner = {};

                fileInfoBanner = req.files.banner[0];
                imageType = "yogamaincategorybanner";
                checkImageSize(imageType, fileInfoBanner);
                fileInfoIcon = req.files.icon[0];
                imageType = "yogamaincategoryicon";
                checkImageSize(imageType, fileInfoIcon);
                let data = {
                    title: req.body.title,
                    subTitle: req.body.subTitle,
                    benefits: req.body.benefits,
                    yogaType: yogaTypeHealthy,
                    videos: req.body.videos,
                    icon: `foliofit/${fileInfoIcon.filename}`,
                    banner: `foliofit/${fileInfoBanner.filename}`,
                    createdBy: req.user._id,
                };

                if (imageError != "false") {
                    unlinkImage(req.files.banner, req.files.icon);
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                    
                } else {
                    let existingTitle = await FoliofitMasterYogaMasterMainCategory.findOne({ title: data.title });
                    if (!existingTitle) {
                        let schemaObj = new FoliofitMasterYogaMasterMainCategory(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Foliofit master yoga main category details added successfully",
                                });
                            })
                            .catch(async (error) => {
                                unlinkImage(req.files.banner, req.files.icon);
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    } else {
                        unlinkImage(req.files.banner, req.files.icon);
                        res.status(200).json({
                            status: false,
                            data: "Title exist",
                        });
                    }
                }
            } else {
                unlinkImage(req.files.banner, req.files.icon);
                res.status(200).json({
                    status: false,
                    data: "Please upload image",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getAllFoliofitMasterYogaMainCategory: async (req, res, next) => {
        try {
            let result = await FoliofitMasterYogaMasterMainCategory.find(
                { isDisabled: false },
                {
                    videos: 1,
                    title: 1,
                    subTitle: 1,
                    benefits: 1,
                    yogaType: 1,
                    icon: { $concat: [imgPath, "$icon"] },
                    banner: { $concat: [imgPath, "$banner"] },
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
    getFoliofitMasterYogaMainCategory: async (req, res, next) => {
        try {
            let result = await FoliofitMasterYogaMasterMainCategory.findOne(
                {
                    _id: mongoose.Types.ObjectId(req.params.id),
                },
                {
                    videos: 1,
                    title: 1,
                    subTitle: 1,
                    benefits: 1,
                    yogaType: 1,
                    icon: { $concat: [imgPath, "$icon"] },
                    banner: { $concat: [imgPath, "$banner"] },
                    createdAt: 1,
                    updatedAt: 1,
                }
            );

            if (!result) {
                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
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
    editFoliofitMasterYogaMainCategory: async (req, res, next) => {
        try {
            let data = req.body;
            var fileInfo = {};
            if (data.yogaId) {
                let yoga = await FoliofitMasterYogaMasterMainCategory.findOne({
                    _id: mongoose.Types.ObjectId(data.yogaId),
                });
                if (yoga) {
                    if (req.files.icon) {
                        var fileInfoIcon = {};
                        fileInfoIcon = req.files.icon[0];
                        imageType = "yogamaincategoryicon";
                        checkImageSize(imageType, fileInfoIcon);
                        if (imageError == "false") {
                            data.icon = `foliofit/${fileInfoIcon.filename}`;
                            // deleting old image
                            let splittedImageRoute = yoga.icon.split("/");
                            console.log("splitted::", splittedImageRoute);
                            if (fs.existsSync(`./public/images/foliofit/${splittedImageRoute[1]}`)) {
                                fs.unlink(`./public/images/foliofit/${splittedImageRoute[1]}`, function (err) {
                                    if (err) throw err;
                                    console.log("old image deleted!");
                                });
                            }
                        }
                    }
                    if (req.files.banner) {
                        var fileInfoBanner = {};
                        fileInfoBanner = req.files.banner[0];
                        imageType = "yogamaincategorybanner";
                        checkImageSize(imageType, fileInfoBanner);
                        if (imageError == "false") {
                            data.banner = `foliofit/${fileInfoBanner.filename}`;
                            // deleting old banner
                            let splittedBannerRoute = yoga.banner.split("/");
                            if (fs.existsSync(`./public/images/foliofit/${splittedBannerRoute[1]}`)) {
                                fs.unlink(`./public/images/foliofit/${splittedBannerRoute[1]}`, function (err) {
                                    if (err) throw err;
                                });
                            }
                        }
                    }
                    if (imageError == "false") {
                        let existingTitle = await FoliofitMasterYogaMasterMainCategory.findOne(
                            { 
                                title: data.title ,
                                _id: { $ne: data.yogaId },
                            });
                        if (!existingTitle) {
                            data.updatedAt = new Date();
                            data.updatedBy = req.user._id;
                            FoliofitMasterYogaMasterMainCategory.updateOne({ _id: mongoose.Types.ObjectId(data.yogaId) }, data)
                                .then((response) => {
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
                                data: "Title already exist",
                            });
                        }
                       
                    } else {
                        unlinkImage(req.files.banner, req.files.icon);
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    }
                } else {
                    unlinkImage(req.files.banner, req.files.icon);
                    res.status(200).json({
                        status: false,
                        data: "invalid yogaId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter yogaId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteFoliofitMasterYogaMainCategory: async (req, res, next) => {
        try {
            let yoga = await FoliofitMasterYogaMasterMainCategory.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (yoga) {
                FoliofitMasterYogaMasterMainCategory.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = yoga.icon.split("/");
                        if (fs.existsSync(`./public/images/foliofit/${splittedImageRoute[1]}`)) {
                            fs.unlink(`./public/images/foliofit/${splittedImageRoute[1]}`, function (err) {
                                if (err) throw err;
                            });
                        }
                        let splittedThumbnailRoute = yoga.banner.split("/");
                        if (fs.existsSync(`./public/images/foliofit/${splittedThumbnailRoute[1]}`)) {
                            fs.unlink(`./public/images/foliofit/${splittedThumbnailRoute[1]}`, function (err) {
                                if (err) throw err;
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: "Foliofit master yoga  details deleted successfully",
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
                    data: "invalid Id",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    /* Foliofit Master Yoga Weekly Workout
    ============================================= */
    addFoliofitMasterYogaWeekly: async (req, res, next) => {
        try {
            let data = req.body;
            if (req.file) {
                var fileInfo = {};
                fileInfo = req.file;
                imageType = "weekly";
                checkImageSize(imageType, fileInfo);
                if (imageError != "false") {
                    fs.unlink(fileInfo.path, (err) => {
                        if (err) throw err;
                    });
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                    imageError = "false";
                } else {
                    let existingTitle = await FoliofitMasterYogaWeekly.findOne({
                        title: data.title,
                    });
                    if (!existingTitle) {
                        let data = {
                            title: req.body.title,
                            subTitle: req.body.subTitle,
                            benefits: req.body.benefits,
                            image: `foliofit/${req.file.filename}`,
                            videos: req.body.videos,
                            createdBy: req.user._id,
                        };

                        let schemaObj = new FoliofitMasterYogaWeekly(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Yoga Weekly Workout added successfully",
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
                            data: "Title Exist",
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
    getAllFoliofitMasterYogaWeekly: async (req, res, next) => {
        try {
            let result = await FoliofitMasterYogaWeekly.find(
                { isDisabled: false },
                {
                    title: 1,
                    subTitle: 1,
                    benefits: 1,
                    videos: 1,
                    image: { $concat: [imgPath, "$image"] },
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
    getFoliofitMasterYogaWeekly: async (req, res, next) => {
        try {
            let result = await FoliofitMasterYogaWeekly.findOne(
                {
                    _id: mongoose.Types.ObjectId(req.params.id),
                },
                {
                    title: 1,
                    subTitle: 1,
                    benefits: 1,
                    videos: 1,
                    image: { $concat: [imgPath, "$image"] },
                }
            );

            if (!result) {
                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
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
    editFoliofitMasterYogaWeekly: async (req, res, next) => {
        try {
            let data = req.body;
            var fileInfo = {};
            if (data.weeklyId) {
                let weeklyWorkout = await FoliofitMasterYogaWeekly.findOne({ _id: mongoose.Types.ObjectId(data.weeklyId) });
                if (weeklyWorkout) {
                    data.image = weeklyWorkout.image;
                    if (req.file) {
                        var fileInfo = {};
                        fileInfo = req.file;
                        imageType = "weekly";
                        checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                            });
                        } else {
                            data.image = `foliofit/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = weeklyWorkout.image.split("/");
                            console.log("splitted::", splittedImageRoute);
                            let path = `./public/images/foliofit/${splittedImageRoute[1]}`;
                            if (fs.existsSync(path)) {
                                fs.unlink(path, function (err) {
                                    if (err) throw err;
                                });
                            }
                        }
                    }
                    if (imageError == "false") {
                        let existingTitle = await FoliofitMasterYogaWeekly.findOne({
                            title: data.title,
                            _id: { $ne: data.weeklyId }
                        });
                        if (!existingTitle) {
                            data.updatedAt = new Date();
                            data.updatedBy = req.user._id;
                            FoliofitMasterYogaWeekly.updateOne({ _id: mongoose.Types.ObjectId(data.weeklyId) }, data)
                                .then((response) => {
                                    res.status(200).json({
                                        status: true,
                                        data: "Updated successfully",
                                    });
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
                                data: "Title already exist.",
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
                        data: "invalid weeklyId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter weeklyId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteFoliofitMasterYogaWeekly: async (req, res, next) => {
        try {
            let slider = await FoliofitMasterYogaWeekly.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                FoliofitMasterYogaWeekly.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = slider.image.split("/");
                        let path = `./public/images/foliofit/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }
                        res.status(200).json({
                            status: true,
                            data: "weekly Workout deleted successfully",
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

    /* Foliofit Master Yoga Start Your Healthy
    ============================================= */
    addFoliofitMasterYogaHealthy: async (req, res, next) => {
        try {
            if (req.files.icon && req.files.banner) {
                var fileInfoIcon = {};
                var fileInfoBanner = {};

                fileInfoBanner = req.files.banner[0];
                imageType = "yogabanner";
                checkImageSize(imageType, fileInfoBanner);
                fileInfoIcon = req.files.icon[0];
                imageType = "yogaicon";
                checkImageSize(imageType, fileInfoIcon);
                let data = {
                    title: req.body.title,
                    subTitle: req.body.subTitle,
                    benefits: req.body.benefits,
                    yogaType: yogaTypeHealthy,
                    videos: req.body.videos,
                    icon: `foliofit/${fileInfoIcon.filename}`,
                    banner: `foliofit/${fileInfoBanner.filename}`,
                    createdBy: req.user._id,
                };

                if (imageError != "false") {
                    unlinkImage(req.files.banner, req.files.icon);
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                } else {
                    let existingTitle = await FoliofitMasterYogaHealthyRecommended.findOne({ title: data.title });
                    if (!existingTitle) {
                        let schemaObj = new FoliofitMasterYogaHealthyRecommended(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Foliofit master yoga healthy details added successfully",
                                });
                            })
                            .catch(async (error) => {
                                unlinkImage(req.files.banner, req.files.icon);
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    } else {
                        unlinkImage(req.files.banner, req.files.icon);
                        res.status(200).json({
                            status: false,
                            data: "Title already exist",
                        });
                    }
                }
            } else {
                unlinkImage(req.files.banner, req.files.icon);
                res.status(200).json({
                    status: false,
                    data: "Please upload image",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getAllFoliofitMasterYogaHealthy: async (req, res, next) => {
        try {
            let result = await FoliofitMasterYogaHealthyRecommended.find(
                { yogaType: yogaTypeHealthy, isDisabled: false },
                {
                    videos: 1,
                    title: 1,
                    subTitle: 1,
                    benefits: 1,
                    yogaType: 1,
                    icon: { $concat: [imgPath, "$icon"] },
                    banner: { $concat: [imgPath, "$banner"] },
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
    getFoliofitMasterYogaHealthy: async (req, res, next) => {
        try {
            let result = await FoliofitMasterYogaHealthyRecommended.findOne(
                {
                    _id: mongoose.Types.ObjectId(req.params.id),
                },
                {
                    videos: 1,
                    title: 1,
                    subTitle: 1,
                    benefits: 1,
                    yogaType: 1,
                    icon: { $concat: [imgPath, "$icon"] },
                    banner: { $concat: [imgPath, "$banner"] },
                }
            );

            if (!result) {
                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
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
    editFoliofitMasterYogaHealthy: async (req, res, next) => {
        try {
            let data = req.body;
            var fileInfo = {};
            if (data.yogaId) {
                let yoga = await FoliofitMasterYogaHealthyRecommended.findOne({
                    _id: mongoose.Types.ObjectId(data.yogaId),
                });
                if (yoga) {
                    data.icon = yoga.icon;
                    data.banner = yoga.banner;
                    if (req.files.icon) {
                        var fileInfoIcon = {};
                        fileInfoIcon = req.files.icon[0];
                        imageType = "yogaicon";
                        checkImageSize(imageType, fileInfoIcon);
                        if (imageError == "false") {
                            data.icon = `foliofit/${fileInfoIcon.filename}`;
                            // deleting old image
                            let splittedImageRoute = yoga.icon.split("/");
                            console.log("splitted::", splittedImageRoute);
                            if (fs.existsSync(`./public/images/foliofit/${splittedImageRoute[1]}`)) {
                                fs.unlink(`./public/images/foliofit/${splittedImageRoute[1]}`, function (err) {
                                    if (err) throw err;
                                    console.log("old image deleted!");
                                });
                            }
                        }
                    }
                    if (req.files.banner) {
                        var fileInfoBanner = {};
                        fileInfoBanner = req.files.banner[0];
                        imageType = "yogabanner";
                        checkImageSize(imageType, fileInfoBanner);
                        if (imageError == "false") {
                            data.banner = `foliofit/${fileInfoBanner.filename}`;
                            // deleting old banner
                            let splittedBannerRoute = yoga.banner.split("/");
                            if (fs.existsSync(`./public/images/foliofit/${splittedBannerRoute[1]}`)) {
                                fs.unlink(`./public/images/foliofit/${splittedBannerRoute[1]}`, function (err) {
                                    if (err) throw err;
                                });
                            }
                        }
                    }
                    if (imageError == "false") {
                        let existingTitle = await FoliofitMasterYogaHealthyRecommended.findOne({
                            title: data.title,
                            _id: { $ne: data.yogaId },
                        });

                        if (!existingTitle) {
                            data.updatedAt = new Date();
                            data.updatedBy = req.user._id;
                            FoliofitMasterYogaHealthyRecommended.updateOne(
                                { _id: mongoose.Types.ObjectId(data.yogaId) },
                                data
                            )
                                .then((response) => {
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
                        unlinkImage(req.files.banner, req.files.icon);
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    }
                } else {
                    unlinkImage(req.files.banner, req.files.icon);
                    res.status(200).json({
                        status: false,
                        data: "invalid yogaId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter yogaId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteFoliofitMasterYogaHealthy: async (req, res, next) => {
        try {
            let yoga = await FoliofitMasterYogaHealthyRecommended.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (yoga) {
                FoliofitMasterYogaHealthyRecommended.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = yoga.icon.split("/");
                        if (fs.existsSync(`./public/images/foliofit/${splittedImageRoute[1]}`)) {
                            fs.unlink(`./public/images/foliofit/${splittedImageRoute[1]}`, function (err) {
                                if (err) throw err;
                            });
                        }
                        let splittedThumbnailRoute = yoga.banner.split("/");
                        if (fs.existsSync(`./public/images/foliofit/${splittedThumbnailRoute[1]}`)) {
                            fs.unlink(`./public/images/foliofit/${splittedThumbnailRoute[1]}`, function (err) {
                                if (err) throw err;
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: "Foliofit master yoga healthy details deleted successfully",
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
                    data: "invalid Id",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    /* Foliofit Master Yoga Recommend
    ============================================= */
    addFoliofitMasterYogaRecommend: async (req, res, next) => {
        try {
            if (req.files.icon && req.files.banner) {
                var fileInfoIcon = {};
                var fileInfoBanner = {};

                fileInfoBanner = req.files.banner[0];
                imageType = "yogarecommendbanner";
                checkImageSize(imageType, fileInfoBanner);
                fileInfoIcon = req.files.icon[0];
                imageType = "yogarecommendicon";
                checkImageSize(imageType, fileInfoIcon);
                let data = {
                    title: req.body.title,
                    subTitle: req.body.subTitle,
                    benefits: req.body.benefits,
                    yogaType: yogaTypeRecommended,
                    videos: req.body.videos,
                    icon: `foliofit/${fileInfoIcon.filename}`,
                    banner: `foliofit/${fileInfoBanner.filename}`,
                    createdBy: req.user._id,
                };

                if (imageError != "false") {
                    unlinkImage(req.files.banner, req.files.icon);
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                   
                } else {
                    let existingTitle = await FoliofitMasterYogaHealthyRecommended.findOne({
                        title: data.title
                    });
                    if (!existingTitle) {
                        let schemaObj = new FoliofitMasterYogaHealthyRecommended(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Foliofit master yoga recommend details added successfully",
                                });
                            })
                            .catch(async (error) => {
                                unlinkImage(req.files.banner, req.files.icon);
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    } else {
                        unlinkImage(req.files.banner, req.files.icon);
                        res.status(200).json({
                            status: false,
                            data: "Title exist",
                        });
                    }
                }
            } else {
                unlinkImage(req.files.banner, req.files.icon);
                res.status(200).json({
                    status: false,
                    data: "Please upload image",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getAllFoliofitMasterYogaRecommend: async (req, res, next) => {
        try {
            let result = await FoliofitMasterYogaHealthyRecommended.find(
                { yogaType: yogaTypeRecommended, isDisabled: false },
                {
                    videos: 1,
                    title: 1,
                    subTitle: 1,
                    benefits: 1,
                    yogaType: 1,
                    icon: { $concat: [imgPath, "$icon"] },
                    banner: { $concat: [imgPath, "$banner"] },
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
    getFoliofitMasterYogaRecommend: async (req, res, next) => {
        try {
            let result = await FoliofitMasterYogaHealthyRecommended.findOne(
                {
                    _id: mongoose.Types.ObjectId(req.params.id),
                },
                {
                    videos: 1,
                    title: 1,
                    subTitle: 1,
                    benefits: 1,
                    yogaType: 1,
                    icon: { $concat: [imgPath, "$icon"] },
                    banner: { $concat: [imgPath, "$banner"] },
                }
            );

            if (!result) {
                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
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
    editFoliofitMasterYogaRecommend: async (req, res, next) => {
        try {
            let data = req.body;
            var fileInfo = {};
            if (data.yogaId) {
                let yoga = await FoliofitMasterYogaHealthyRecommended.findOne({
                    _id: mongoose.Types.ObjectId(data.yogaId),
                });
                if (yoga) {
                    data.icon = yoga.icon;
                    data.banner = yoga.banner;
                    if (req.files.icon) {
                        var fileInfoIcon = {};
                        fileInfoIcon = req.files.icon[0];
                        imageType = "yogarecommendicon";
                        checkImageSize(imageType, fileInfoIcon);
                        if (imageError == "false") {
                            data.icon = `foliofit/${fileInfoIcon.filename}`;
                            // deleting old image
                            let splittedImageRoute = yoga.icon.split("/");
                            if (fs.existsSync(`./public/images/foliofit/${splittedImageRoute[1]}`)) {
                                fs.unlink(`./public/images/foliofit/${splittedImageRoute[1]}`, function (err) {
                                    if (err) throw err;
                                    console.log("old image deleted!");
                                });
                            }
                        }
                    }
                    if (req.files.banner) {
                        var fileInfoBanner = {};
                        fileInfoBanner = req.files.banner[0];
                        imageType = "yogarecommendbanner";
                        checkImageSize(imageType, fileInfoBanner);
                        if (imageError == "false") {
                            data.banner = `foliofit/${fileInfoBanner.filename}`;
                            // deleting old banner
                            let splittedBannerRoute = yoga.banner.split("/");
                            if (fs.existsSync(`./public/images/foliofit/${splittedBannerRoute[1]}`)) {
                                fs.unlink(`./public/images/foliofit/${splittedBannerRoute[1]}`, function (err) {
                                    if (err) throw err;
                                    console.log("old banner deleted!");
                                });
                            }
                        }
                    }
                    if (imageError == "false") {
                        let existingTitle = await FoliofitMasterYogaHealthyRecommended.findOne({
                            title: data.title,
                            _id: { $ne: data.yogaId },
                        });
                        if(!existingTitle){
                            data.updatedAt = new Date();
                            data.updatedBy = req.user._id;
                            FoliofitMasterYogaHealthyRecommended.updateOne({ _id: mongoose.Types.ObjectId(data.yogaId) }, data)
                                .then((response) => {
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
                                data: "Title already exist",
                            });
                        }
                      
                    } else {
                        unlinkImage(req.files.banner, req.files.icon);
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    }
                } else {
                    unlinkImage(req.files.banner, req.files.icon);
                    res.status(200).json({
                        status: false,
                        data: "invalid yogaId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter yogaId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteFoliofitMasterYogaRecommend: async (req, res, next) => {
        try {
            let yoga = await FoliofitMasterYogaHealthyRecommended.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (yoga) {
                FoliofitMasterYogaHealthyRecommended.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = yoga.icon.split("/");
                        if (fs.existsSync(`./public/images/foliofit/${splittedImageRoute[1]}`)) {
                            fs.unlink(`./public/images/foliofit/${splittedImageRoute[1]}`, function (err) {
                                if (err) throw err;
                            });
                        }
                        let splittedThumbnailRoute = yoga.banner.split("/");
                        if (fs.existsSync(`./public/images/foliofit/${splittedThumbnailRoute[1]}`)) {
                            fs.unlink(`./public/images/foliofit/${splittedThumbnailRoute[1]}`, function (err) {
                                if (err) throw err;
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: "Foliofit master yoga recommend details deleted successfully",
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
                    data: "invalid Id",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    /* Foliofit Master Fitness Club Main Category
    ============================================= */
    addFoliofitMasterFitnessMainCategory: async (req, res, next) => {
        try {
            if (req.files.icon && req.files.banner) {
                var fileInfoIcon = {};
                var fileInfoBanner = {};
                fileInfoBanner = req.files.banner[0];
                imageType = "maincategorybanner";
                checkImageSize(imageType, fileInfoBanner);
                fileInfoIcon = req.files.icon[0];
                imageType = "maincategoryicon";
                checkImageSize(imageType, fileInfoIcon);
                let data = {
                    title: req.body.title,
                    subTitle: req.body.subTitle,
                    benefits: req.body.benefits,
                    fitnessType: fitnessTypeMain,
                    videos: req.body.videos,
                    icon: `foliofit/${fileInfoIcon.filename}`,
                    banner: `foliofit/${fileInfoBanner.filename}`,
                    createdBy: req.user._id,
                };

                if (imageError != "false") {
                    unlinkImage(req.files.banner, req.files.icon);
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                    imageError = "false";
                } else {
                    let existingTitle = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne({
                        title: data.title,
                        fitnessType: fitnessTypeMain,
                    });

                    if (!existingTitle) {
                        console.log("haiii");
                        let schemaObj = new FoliofitMasterFitnessMainHomeFullbodyHealthy(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Foliofit master fitness club main category details added successfully",
                                });
                            })
                            .catch(async (error) => {
                                unlinkImage(req.files.banner, req.files.icon);
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    } else {
                        unlinkImage(req.files.banner, req.files.icon);
                        res.status(200).json({
                            status: false,
                            data: "Title exist",
                        });
                    }
                }
            } else {
                unlinkImage(req.files.banner, req.files.icon);
                res.status(200).json({
                    status: false,
                    data: "Please upload image",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getAllFoliofitMasterFitnessMainCategories: async (req, res, next) => {
        try {
            let result = await FoliofitMasterFitnessMainHomeFullbodyHealthy.find(
                { fitnessType: fitnessTypeMain, isDisabled: false },
                {
                    videos: 1,
                    title: 1,
                    subTitle: 1,
                    benefits: 1,
                    fitnessType: 1,
                    icon: { $concat: [imgPath, "$icon"] },
                    banner: { $concat: [imgPath, "$banner"] },
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
    getFoliofitMasterFitnessMainCategory: async (req, res, next) => {
        try {
            let result = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne(
                {
                    _id: mongoose.Types.ObjectId(req.params.id),
                },
                {
                    videos: 1,
                    title: 1,
                    subTitle: 1,
                    benefits: 1,
                    fitnessType: 1,
                    icon: { $concat: [imgPath, "$icon"] },
                    banner: { $concat: [imgPath, "$banner"] },
                }
            );

            if (!result) {
                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
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
    editFoliofitMasterFitnessMainCategory: async (req, res, next) => {
        try {
            let data = req.body;
            var fileInfo = {};
            if (data.id) {
                let fitness = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne({
                    _id: mongoose.Types.ObjectId(data.id),
                });
                if (fitness) {
                    data.icon = fitness.icon;
                    data.banner = fitness.banner;
                    if (req.files.icon) {
                        var fileInfoIcon = {};
                        fileInfoIcon = req.files.icon[0];
                        imageType = "maincategoryicon";
                        checkImageSize(imageType, fileInfoIcon);
                        if (imageError == "false") {
                            data.icon = `foliofit/${fileInfoIcon.filename}`;
                            // deleting old image
                            let splittedImageRoute = fitness.icon.split("/");
                            if (fs.existsSync(`./public/images/foliofit/${splittedImageRoute[1]}`)) {
                                fs.unlink(`./public/images/foliofit/${splittedImageRoute[1]}`, function (err) {
                                    if (err) throw err;
                                });
                            }
                        }
                    }
                    if (req.files.banner) {
                        var fileInfoBanner = {};
                        fileInfoBanner = req.files.banner[0];
                        imageType = "maincategorybanner";
                        checkImageSize(imageType, fileInfoBanner);
                        if (imageError == "false") {
                            data.banner = `foliofit/${fileInfoBanner.filename}`;
                            // deleting old banner
                            let splittedBannerRoute = fitness.banner.split("/");
                            if (fs.existsSync(`./public/images/foliofit/${splittedBannerRoute[1]}`)) {
                                fs.unlink(`./public/images/foliofit/${splittedBannerRoute[1]}`, function (err) {
                                    if (err) throw err;
                                });
                            }
                        }
                    }
                    if (imageError == "false") {
                        data.updatedAt = new Date();
                        data.updatedBy = req.user._id;
                        FoliofitMasterFitnessMainHomeFullbodyHealthy.updateOne(
                            { _id: mongoose.Types.ObjectId(data.id) },
                            data
                        )
                            .then((response) => {
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
                            })
                            .catch((error) => {
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    } else {
                        unlinkImage(req.files.banner, req.files.icon);
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    }
                } else {
                    unlinkImage(req.files.banner, req.files.icon);
                    res.status(200).json({
                        status: false,
                        data: "invalid id",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteFoliofitMasterFitnessMainCategory: async (req, res, next) => {
        try {
            let fitness = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne({
                _id: mongoose.Types.ObjectId(req.params.id),
            });

            if (fitness) {
                FoliofitMasterFitnessMainHomeFullbodyHealthy.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = fitness.icon.split("/");
                        if (fs.existsSync(`./public/images/foliofit/${splittedImageRoute[1]}`)) {
                            fs.unlink(`./public/images/foliofit/${splittedImageRoute[1]}`, function (err) {
                                if (err) throw err;
                            });
                        }
                        let splittedThumbnailRoute = fitness.banner.split("/");
                        if (fs.existsSync(`./public/images/foliofit/${splittedThumbnailRoute[1]}`)) {
                            fs.unlink(`./public/images/foliofit/${splittedThumbnailRoute[1]}`, function (err) {
                                if (err) throw err;
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: "Foliofit master fitness club  details deleted successfully",
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
                    data: "invalid Id",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    /* Foliofit Master Fitness Club Home Workouts
    ============================================= */
    addFoliofitMasterFitnessHomeWorkouts: async (req, res, next) => {
        try {
            imageError = "false"
            if (req.files.icon && req.files.banner) {
                var fileInfoIcon = {};
                var fileInfoBanner = {};
                fileInfoBanner = req.files.banner[0];
                imageType = "homeworkoutsbanner";
                checkImageSize(imageType, fileInfoBanner);
                fileInfoIcon = req.files.icon[0];
                imageType = "homeworkoutsicon";
               // checkImageSize(imageType, fileInfoIcon);
                let data = {
                    title: req.body.title,
                    subTitle: req.body.subTitle,
                    benefits: req.body.benefits,
                    fitnessType: fitnessTypeHome,
                    videos: req.body.videos,
                    icon: `foliofit/${fileInfoIcon.filename}`,
                    banner: `foliofit/${fileInfoBanner.filename}`,
                    createdBy: req.user._id,
                };

                if (imageError != "false") {
                    unlinkImage(req.files.banner, req.files.icon);
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                } else {
                    let existingTitle = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne({
                        title: data.title,
                        fitnessType: fitnessTypeHome,
                    });

                    if (!existingTitle) {
                        let schemaObj = new FoliofitMasterFitnessMainHomeFullbodyHealthy(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Foliofit master fitness club home workouts details added successfully",
                                });
                            })
                            .catch(async (error) => {
                                unlinkImage(req.files.banner, req.files.icon);
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    } else {
                       
                        unlinkImage(req.files.banner, req.files.icon);
                        res.status(200).json({
                            status: false,
                            data: "Title exist",
                        });
                    }
                }
            } else {
                unlinkImage(req.files.banner, req.files.icon);
                res.status(200).json({
                    status: false,
                    data: "Please upload image",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getAllFoliofitMasterFitnessHomeWorkouts: async (req, res, next) => {
        try {
            let result = await FoliofitMasterFitnessMainHomeFullbodyHealthy.find(
                { fitnessType: fitnessTypeHome, isDisabled: false },
                {
                    videos: 1,
                    title: 1,
                    subTitle: 1,
                    benefits: 1,
                    fitnessType: 1,
                    icon: { $concat: [imgPath, "$icon"] },
                    banner: { $concat: [imgPath, "$banner"] },
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
    getFoliofitMasterFitnessHomeWorkouts: async (req, res, next) => {
        try {
            let result = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne(
                {
                    _id: mongoose.Types.ObjectId(req.params.id),
                },
                {
                    videos: 1,
                    title: 1,
                    subTitle: 1,
                    benefits: 1,
                    fitnessType: 1,
                    icon: { $concat: [imgPath, "$icon"] },
                    banner: { $concat: [imgPath, "$banner"] },
                }
            );

            if (!result) {
                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
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
    editFoliofitMasterFitnessHomeWorkouts: async (req, res, next) => {
        try {
            let data = req.body;
            var fileInfo = {};
            if (data.id) {
                let fitness = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne({
                    _id: mongoose.Types.ObjectId(data.id),
                });
                if (fitness) {
                    data.icon = fitness.icon;
                    data.banner = fitness.banner;
                    if (req.files.icon) {
                        var fileInfoIcon = {};
                        fileInfoIcon = req.files.icon[0];
                        imageType = "homeworkoutsicon";
                        //checkImageSize(imageType, fileInfoIcon);
                        if (imageError == "false") {
                            data.icon = `foliofit/${fileInfoIcon.filename}`;
                            // deleting old image
                            let splittedImageRoute = fitness.icon.split("/");
                            if (fs.existsSync(`./public/images/foliofit/${splittedImageRoute[1]}`)) {
                                fs.unlink(`./public/images/foliofit/${splittedImageRoute[1]}`, function (err) {
                                    if (err) throw err;
                                });
                            }
                        }
                    }
                    if (req.files.banner) {
                        var fileInfoBanner = {};
                        fileInfoBanner = req.files.banner[0];
                        imageType = "homeworkoutsbanner";
                        checkImageSize(imageType, fileInfoBanner);
                        if (imageError == "false") {
                            data.banner = `foliofit/${fileInfoBanner.filename}`;
                            // deleting old banner
                            let splittedBannerRoute = fitness.banner.split("/");
                            if (fs.existsSync(`./public/images/foliofit/${splittedBannerRoute[1]}`)) {
                                fs.unlink(`./public/images/foliofit/${splittedBannerRoute[1]}`, function (err) {
                                    if (err) throw err;
                                });
                            }
                        }
                    }
                    if (imageError == "false") {
                        data.updatedAt = new Date();
                        data.updatedBy = req.user._id;
                        FoliofitMasterFitnessMainHomeFullbodyHealthy.updateOne(
                            { _id: mongoose.Types.ObjectId(data.id) },
                            data
                        )
                            .then((response) => {
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
                            })
                            .catch((error) => {
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    } else {
                        unlinkImage(req.files.banner, req.files.icon);
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    }
                } else {
                    unlinkImage(req.files.banner, req.files.icon);
                    res.status(200).json({
                        status: false,
                        data: "invalid id",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteFoliofitMasterFitnessHomeWorkouts: async (req, res, next) => {
        try {
            let fitness = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne({
                _id: mongoose.Types.ObjectId(req.params.id),
            });

            if (fitness) {
                FoliofitMasterFitnessMainHomeFullbodyHealthy.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = fitness.icon.split("/");
                        if (fs.existsSync(`./public/images/foliofit/${splittedImageRoute[1]}`)) {
                            fs.unlink(`./public/images/foliofit/${splittedImageRoute[1]}`, function (err) {
                                if (err) throw err;
                            });
                        }
                        let splittedThumbnailRoute = fitness.banner.split("/");
                        if (fs.existsSync(`./public/images/foliofit/${splittedThumbnailRoute[1]}`)) {
                            fs.unlink(`./public/images/foliofit/${splittedThumbnailRoute[1]}`, function (err) {
                                if (err) throw err;
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: "Foliofit master fitness club  details deleted successfully",
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
                    data: "invalid Id",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    /* Foliofit Master Fitness Club Full Body Workouts
    ============================================= */
    addFoliofitMasterFitnessFullBodyWorkouts: async (req, res, next) => {
        try {
            let foliofitFitnessFullCount = await FoliofitMasterFitnessMainHomeFullbodyHealthy.countDocuments({
                fitnessType: fitnessTypeFullBody,
            });
            if (foliofitFitnessFullCount < 14) {
                if (req.files.icon && req.files.banner) {
                    var fileInfoIcon = {};
                    var fileInfoBanner = {};
                    fileInfoBanner = req.files.banner[0];
                    imageType = "fullbodybanner";
                    checkImageSize(imageType, fileInfoBanner);
                    fileInfoIcon = req.files.icon[0];
                    imageType = "fullbodyicon";
                    checkImageSize(imageType, fileInfoIcon);
                    let data = {
                        title: req.body.title,
                        subTitle: req.body.subTitle,
                        benefits: req.body.benefits,
                        fitnessType: fitnessTypeFullBody,
                        videos: req.body.videos,
                        icon: `foliofit/${fileInfoIcon.filename}`,
                        banner: `foliofit/${fileInfoBanner.filename}`,
                        createdBy: req.user._id,
                    };

                    if (imageError != "false") {
                        unlinkImage(req.files.banner, req.files.icon);
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    } else {
                        let existingTitle = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne({
                            title: data.title,
                            fitnessType: fitnessTypeFullBody,
                        });

                        if (!existingTitle) {
                            let schemaObj = new FoliofitMasterFitnessMainHomeFullbodyHealthy(data);
                            schemaObj
                                .save()
                                .then((response) => {
                                    res.status(200).json({
                                        status: true,
                                        data: "Foliofit master fitness club full body workouts details added successfully",
                                    });
                                })
                                .catch(async (error) => {
                                    unlinkImage(req.files.banner, req.files.icon);
                                    res.status(200).json({
                                        status: false,
                                        data: error,
                                    });
                                });
                        } else {
                            unlinkImage(req.files.banner, req.files.icon);
                            res.status(200).json({
                                status: false,
                                data: "Title exist",
                            });
                        }
                    }
                } else {
                    unlinkImage(req.files.banner, req.files.icon);
                    res.status(200).json({
                        status: false,
                        data: "Please upload image",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Data already exist.",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getAllFoliofitMasterFitnessFullBodyWorkouts: async (req, res, next) => {
        try {
            let result = await FoliofitMasterFitnessMainHomeFullbodyHealthy.find(
                { fitnessType: fitnessTypeFullBody, isDisabled: false },
                {
                    videos: 1,
                    title: 1,
                    subTitle: 1,
                    benefits: 1,
                    fitnessType: 1,
                    icon: { $concat: [imgPath, "$icon"] },
                    banner: { $concat: [imgPath, "$banner"] },
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
    getFoliofitMasterFitnessFullBodyWorkouts: async (req, res, next) => {
        try {
            let result = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne(
                {
                    _id: mongoose.Types.ObjectId(req.params.id),
                },
                {
                    videos: 1,
                    title: 1,
                    subTitle: 1,
                    benefits: 1,
                    fitnessType: 1,
                    icon: { $concat: [imgPath, "$icon"] },
                    banner: { $concat: [imgPath, "$banner"] },
                }
            );

            if (!result) {
                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
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
    editFoliofitMasterFitnessFullBodyWorkouts: async (req, res, next) => {
        try {
            let data = req.body;
            var fileInfo = {};
            if (data.id) {
                let fitness = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne({
                    _id: mongoose.Types.ObjectId(data.id),
                });

                if (fitness) {
                    let existing = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne({
                        _id: { $ne: fitness._id },
                        title: data.title,
                        fitnessType: fitnessTypeFullBody,
                    });
                    if (!existing) {
                        data.icon = fitness.icon;
                        data.banner = fitness.banner;
                        if (req.files.icon) {
                            var fileInfoIcon = {};
                            fileInfoIcon = req.files.icon[0];
                            imageType = "fullbodyicon";
                            checkImageSize(imageType, fileInfoIcon);
                            if (imageError == "false") {
                                data.icon = `foliofit/${fileInfoIcon.filename}`;
                                // deleting old image
                                let splittedImageRoute = fitness.icon.split("/");
                                if (fs.existsSync(`./public/images/foliofit/${splittedImageRoute[1]}`)) {
                                    fs.unlink(`./public/images/foliofit/${splittedImageRoute[1]}`, function (err) {
                                        if (err) throw err;
                                    });
                                }
                            }
                        }
                        if (req.files.banner) {
                            var fileInfoBanner = {};
                            fileInfoBanner = req.files.banner[0];
                            imageType = "fullbodybanner";
                            checkImageSize(imageType, fileInfoBanner);
                            if (imageError == "false") {
                                data.banner = `foliofit/${fileInfoBanner.filename}`;
                                // deleting old banner
                                let splittedBannerRoute = fitness.banner.split("/");
                                if (fs.existsSync(`./public/images/foliofit/${splittedBannerRoute[1]}`)) {
                                    fs.unlink(`./public/images/foliofit/${splittedBannerRoute[1]}`, function (err) {
                                        if (err) throw err;
                                    });
                                }
                            }
                        }
                        if (imageError == "false") {
                            data.updatedAt = new Date();
                            data.updatedBy = req.user._id;
                            FoliofitMasterFitnessMainHomeFullbodyHealthy.updateOne(
                                { _id: mongoose.Types.ObjectId(data.id) },
                                data
                            )
                                .then((response) => {
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
                                })
                                .catch((error) => {
                                    res.status(200).json({
                                        status: false,
                                        data: error,
                                    });
                                });
                        } else {
                            unlinkImage(req.files.banner, req.files.icon);
                            res.status(200).json({
                                status: false,
                                data: imageError,
                            });
                            imageError = "false";
                        }
                    } else {
                        res.status(200).json({
                            status: false,
                            data: "Title Already Existing",
                        });
                    }
                } else {
                    unlinkImage(req.files.banner, req.files.icon);
                    res.status(200).json({
                        status: false,
                        data: "invalid id",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteFoliofitMasterFitnessFullBodyWorkouts: async (req, res, next) => {
        try {
            let fitness = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne({
                _id: mongoose.Types.ObjectId(req.params.id),
            });

            if (fitness) {
                FoliofitMasterFitnessMainHomeFullbodyHealthy.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = fitness.icon.split("/");
                        if (fs.existsSync(`./public/images/foliofit/${splittedImageRoute[1]}`)) {
                            fs.unlink(`./public/images/foliofit/${splittedImageRoute[1]}`, function (err) {
                                if (err) throw err;
                            });
                        }
                        let splittedThumbnailRoute = fitness.banner.split("/");
                        if (fs.existsSync(`./public/images/foliofit/${splittedThumbnailRoute[1]}`)) {
                            fs.unlink(`./public/images/foliofit/${splittedThumbnailRoute[1]}`, function (err) {
                                if (err) throw err;
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: "Foliofit master fitness club  details deleted successfully",
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
                    data: "invalid Id",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    /* Foliofit Master Fitness Club  Commence Your Healthy Journey
    ============================================= */
    addFoliofitMasterFitnessHealthyJourney: async (req, res, next) => {
        try {
            if (req.files.icon && req.files.banner) {
                var fileInfoIcon = {};
                var fileInfoBanner = {};
                fileInfoBanner = req.files.banner[0];
                imageType = "healthybanner";
                checkImageSize(imageType, fileInfoBanner);
                fileInfoIcon = req.files.icon[0];
                imageType = "healthyicon";
                checkImageSize(imageType, fileInfoIcon);
                let data = {
                    title: req.body.title,
                    subTitle: req.body.subTitle,
                    benefits: req.body.benefits,
                    fitnessType: fitnessTypeHealthyJourney,
                    videos: req.body.videos,
                    icon: `foliofit/${fileInfoIcon.filename}`,
                    banner: `foliofit/${fileInfoBanner.filename}`,
                    createdBy: req.user._id,
                };

                if (imageError != "false") {
                    unlinkImage(req.files.banner, req.files.icon);
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                    imageError = "false";
                } else {
                    let existingTitle = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne({
                        title: data.title,
                        fitnessType: fitnessTypeHealthyJourney,
                    });
                    if (!existingTitle) {
                        let schemaObj = new FoliofitMasterFitnessMainHomeFullbodyHealthy(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Foliofit master fitness club full body workouts details added successfully",
                                });
                            })
                            .catch(async (error) => {
                                unlinkImage(req.files.banner, req.files.icon);
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    } else {
                        unlinkImage(req.files.banner, req.files.icon);
                        res.status(200).json({
                            status: false,
                            data: "Title exist",
                        });
                    }
                }
            } else {
                unlinkImage(req.files.banner, req.files.icon);
                res.status(200).json({
                    status: false,
                    data: "Please upload image",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getAllFoliofitMasterFitnessHealthyJourney: async (req, res, next) => {
        try {
            let result = await FoliofitMasterFitnessMainHomeFullbodyHealthy.find(
                { fitnessType: fitnessTypeHealthyJourney, isDisabled: false },
                {
                    videos: 1,
                    title: 1,
                    subTitle: 1,
                    benefits: 1,
                    fitnessType: 1,
                    icon: { $concat: [imgPath, "$icon"] },
                    banner: { $concat: [imgPath, "$banner"] },
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
    getFoliofitMasterFitnessHealthyJourney: async (req, res, next) => {
        try {
            let result = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne(
                {
                    _id: mongoose.Types.ObjectId(req.params.id),
                },
                {
                    videos: 1,
                    title: 1,
                    subTitle: 1,
                    benefits: 1,
                    fitnessType: 1,
                    icon: { $concat: [imgPath, "$icon"] },
                    banner: { $concat: [imgPath, "$banner"] },
                }
            );

            if (!result) {
                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
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
    editFoliofitMasterFitnessHealthyJourney: async (req, res, next) => {
        try {
            let data = req.body;
            var fileInfo = {};
            if (data.id) {
                let fitness = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne({
                    _id: mongoose.Types.ObjectId(data.id),
                });
                if (fitness) {
                    let existingTitle = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne({
                        _id: { $ne: fitness._id },
                        title: data.title,
                        fitnessType: fitnessTypeHealthyJourney,
                    });
                    if (!existingTitle) {
                        data.icon = fitness.icon;
                        data.banner = fitness.banner;
                        if (req.files.icon) {
                            var fileInfoIcon = {};
                            fileInfoIcon = req.files.icon[0];
                            imageType = "healthyicon";
                            checkImageSize(imageType, fileInfoIcon);
                            if (imageError == "false") {
                                data.icon = `foliofit/${fileInfoIcon.filename}`;
                                // deleting old image
                                let splittedImageRoute = fitness.icon.split("/");
                                if (fs.existsSync(`./public/images/foliofit/${splittedImageRoute[1]}`)) {
                                    fs.unlink(`./public/images/foliofit/${splittedImageRoute[1]}`, function (err) {
                                        if (err) throw err;
                                    });
                                }
                            }
                        }
                        if (req.files.banner) {
                            var fileInfoBanner = {};
                            fileInfoBanner = req.files.banner[0];
                            imageType = "healthybanner";
                            checkImageSize(imageType, fileInfoBanner);
                            if (imageError == "false") {
                                data.banner = `foliofit/${fileInfoBanner.filename}`;
                                // deleting old banner
                                let splittedBannerRoute = fitness.banner.split("/");
                                if (fs.existsSync(`./public/images/foliofit/${splittedBannerRoute[1]}`)) {
                                    fs.unlink(`./public/images/foliofit/${splittedBannerRoute[1]}`, function (err) {
                                        if (err) throw err;
                                    });
                                }
                            }
                        }
                        if (imageError == "false") {
                            data.updatedAt = new Date();
                            data.updatedBy = req.user._id;
                            FoliofitMasterFitnessMainHomeFullbodyHealthy.updateOne(
                                { _id: mongoose.Types.ObjectId(data.id) },
                                data
                            )
                                .then((response) => {
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
                                })
                                .catch((error) => {
                                    res.status(200).json({
                                        status: false,
                                        data: error,
                                    });
                                });
                        } else {
                            unlinkImage(req.files.banner, req.files.icon);
                            res.status(200).json({
                                status: false,
                                data: imageError,
                            });
                            imageError = "false";
                        }
                    } else {
                        res.status(200).json({
                            status: false,
                            data: "Title Already Existing",
                        });
                    }
                } else {
                    unlinkImage(req.files.banner, req.files.icon);
                    res.status(200).json({
                        status: false,
                        data: "invalid id",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteFoliofitMasterFitnessHealthyJourney: async (req, res, next) => {
        try {
            let fitness = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne({
                _id: mongoose.Types.ObjectId(req.params.id),
            });

            if (fitness) {
                FoliofitMasterFitnessMainHomeFullbodyHealthy.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = fitness.icon.split("/");
                        if (fs.existsSync(`./public/images/foliofit/${splittedImageRoute[1]}`)) {
                            fs.unlink(`./public/images/foliofit/${splittedImageRoute[1]}`, function (err) {
                                if (err) throw err;
                            });
                        }
                        let splittedThumbnailRoute = fitness.banner.split("/");
                        if (fs.existsSync(`./public/images/foliofit/${splittedThumbnailRoute[1]}`)) {
                            fs.unlink(`./public/images/foliofit/${splittedThumbnailRoute[1]}`, function (err) {
                                if (err) throw err;
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: "Foliofit master fitness club  details deleted successfully",
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
                    data: "invalid Id",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    getHealthReminder: async (req, res, next) => {
        try {
            let finalResult = []
            let count =0
            // var limit = parseInt(req.body.limit);
            // if (limit == 0) limit = 10;
            // var skip = (parseInt(req.body.page) - 1) * parseInt(limit);
            let result = await healthReminder
                .find({ type: 0 })
                .populate({
                    path: "userId",
                    select: ["_id", "name"],
                })
                .lean();
            // .limit(limit)
            //     .skip(skip)
            for (let item of result) {
                item.medicine = []
                let medicines = []
                // item.medicine = [...item.session[0].medicine, ...item.session[1].medicine, ...item.session[2].medicine];
                // delete item.session;
                for(let medi of item.session[0].medicine){
                    if(!medi.length==0){
                        let data = {
                            name:medi
                        }
                        if(!medicines.includes(data.name)){
                            medicines.push(data.name)
                            item.medicine.push(data)
                        }
                    }
                }
                for(let medi of item.session[1].medicine){
                    if(!medi.length==0){
                        let data = {
                            name:medi
                        }
                        if(!medicines.includes(data.name)){
                            medicines.push(data.name)
                            item.medicine.push(data)
                        }
                    }
                }
                for(let medi of item.session[2].medicine){
                    if(!medi.length==0){
                        let data = {
                            name:medi
                        }
                        if(!medicines.includes(data.name)){
                            medicines.push(data.name)
                            item.medicine.push(data)
                        }
                    }
                }
                delete item.session;
                if(!item.medicine.length==0){
                    
                    finalResult.push(item)
                }
            }
            let data = finalResult.reverse()
            for(let items of data){
                count++
                    items.sl = count
            }
            
            res.status(200).json({
                error: false,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    },
    getDateHealthReminder: async (req, res, next) => {
        try {
            let finalResult = []
            let count = 0
            let startDate = new Date(req.body.startDate);
            let endDate = new Date(req.body.endDate);
            // console.log('1234567',startDate,endDate)
            // var limit = parseInt(req.body.limit);
            //     if (limit == 0) limit = 10;
            //     var skip = (parseInt(req.body.page) - 1) * parseInt(limit);
            let result = await healthReminder
                .find({ updatedAt: { $gte: startDate, $lte: endDate },type: 0 })
                .populate({
                    path: "userId",
                    select: ["_id", "name"],
                })
                .lean();
            // .limit(limit)
            //     .skip(skip)
            for (let item of result) {
                item.medicine = []
                let medicines = []
                // item.medicine = [...item.session[0].medicine, ...item.session[1].medicine, ...item.session[2].medicine];
                // delete item.session;
                for(let medi of item.session[0].medicine){
                    if(!medi.length==0){
                        let data = {
                            name:medi
                        }
                        if(!medicines.includes(data.name)){
                            medicines.push(data.name)
                            item.medicine.push(data)
                        }
                    }
                }
                for(let medi of item.session[1].medicine){
                    if(!medi.length==0){
                        let data = {
                            name:medi
                        }
                        if(!medicines.includes(data.name)){
                            medicines.push(data.name)
                            item.medicine.push(data)
                        }
                    }
                }
                for(let medi of item.session[2].medicine){
                    if(!medi.length==0){
                        let data = {
                            name:medi
                        }
                        if(!medicines.includes(data.name)){
                            medicines.push(data.name)
                            item.medicine.push(data)
                        }
                    }
                }
                delete item.session;
                if(!item.medicine.length==0){
                    finalResult.push(item)
                }
            }
            let data = finalResult.reverse()
            for(let items of data){
                count++
                    items.sl = count
            }
            res.status(200).json({
                error: false,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    },
    getHealthCalculator: async (req, res, next) => {
        try {
            let count = 0
            // var limit = parseInt(req.body.limit);
            // if (limit == 0) limit = 10;
            // var skip = (parseInt(req.body.page) - 1) * parseInt(limit);
            let result = await healthCalculator
                .find({})
                .populate({
                    path: "userId",
                    select: ["_id", "name", "phone"],
                })
                .lean();
                let finalResult = result.reverse()
                for(let item of finalResult){
                    count++
                    item.sl = count
                }
            // .limit(limit)
            //     .skip(skip)
            res.status(200).json({
                error: false,
                data: finalResult,
            });
        } catch (error) {
            next(error);
        }
    },
    getDateHealthCalculator: async (req, res, next) => {
        try {
            let count = 0
            let startDate = new Date(req.body.startDate);
            let endDate = new Date(req.body.endDate);
            // console.log('1234567',startDate,endDate)
            // var limit = parseInt(req.body.limit);
            // if (limit == 0) limit = 10;
            // var skip = (parseInt(req.body.page) - 1) * parseInt(limit);
            let result = await healthCalculator
                .find({ updatedAt: { $gte: startDate, $lte: endDate } })
                .populate({
                    path: "userId",
                    select: ["_id", "name", "phone"],
                })
                .lean();
                let finalResult = result.reverse()

                for(let item of finalResult){
                    count++
                    item.sl = count
                }
            // .limit(limit)
            //     .skip(skip)
            res.status(200).json({
                error: false,
                data: finalResult,
            });
        } catch (error) {
            next(error);
        }
    },
    getFoliofitWeeklyWorkout: async (req, res, next) => {
        let data = await foliofitWeeklyWorkout.find(
            {},
            {
                benefits: 1,
                videos: 1,
                title: 1,
                subTitle: 1,
                banner: { $concat: [imgPath, "$banner"] },
            }
        );
        res.status(200).json({
            status: true,
            data,
        });
    },
    addFoliofitWeeklyWorkout: async (req, res, next) => {
        try {
            if (req.file) {
                var fileInfoBanner = {};
                fileInfoBanner = req.file;
                let data = {
                    title: req.body.title,
                    subTitle: req.body.subTitle,
                    benefits: req.body.benefits,
                    videos: req.body.videos,
                    banner: `foliofit/${fileInfoBanner.filename}`,
                };

                let existingTitle = await foliofitWeeklyWorkout.findOne({
                    title: data.title,
                });
                if (!existingTitle) {
                    let schemaObj = new foliofitWeeklyWorkout(data);
                    schemaObj
                        .save()
                        .then((_) => {
                            res.status(200).json({
                                status: true,
                                data: "Foliofit master Weekly Workout  details added successfully",
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
                    fs.unlink(req.file.path, function (err) {
                        if (err) throw err;
                    });
                    res.status(200).json({
                        status: false,
                        data: "Title exist",
                    });
                }
            } else {
                fs.unlink(req.file.path, function (err) {
                    if (err) throw err;
                });
                res.status(200).json({
                    status: false,
                    data: "Please upload image",
                });
            }
        } catch (error) {
            fs.unlink(req.file.path, function (err) {
                if (err) throw err;
            });
            next(error);
        }
    },
    getFoliofitWeeklyWorkoutById: async (req, res, next) => {
        try {
            const data = await foliofitWeeklyWorkout.findOne(
                { _id: req.params.id },
                {
                    benefits: 1,
                    videos: 1,
                    title: 1,
                    subTitle: 1,
                    banner: { $concat: [imgPath, "$banner"] },
                }
            );
            if (data) {
                res.status(200).json({
                    status: true,
                    data,
                });
            } else {
                res.status(404).json({
                    status: false,
                    data: "Invalid Id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    editFoliofitWeeklyWorkout: async (req, res, next) => {
        try {
            const result = await foliofitWeeklyWorkout.findOne({ _id: req.params.id });
            if (result) {
                if (req.file) {
                    fs.unlink(`public/images/${result.banner}`, function (err) {
                        if (err) throw err;
                        console.log("old image deleted!");
                    });
                    var fileInfoBanner = {};
                    fileInfoBanner = req.file;
                    let data = {
                        title: req.body.title,
                        subTitle: req.body.subTitle,
                        benefits: req.body.benefits,
                        videos: req.body.videos,
                        banner: `foliofit/${fileInfoBanner.filename}`,
                    };

                    foliofitWeeklyWorkout.updateOne({ _id: req.params.id }, data).then((response) => {
                        res.status(200).json({
                            status: true,
                            data: "Updated successfully",
                        });
                    });
                } else {
                    let data = {
                        title: req.body.title,
                        subTitle: req.body.subTitle,
                        benefits: req.body.benefits,
                        videos: req.body.videos,
                        banner: result.banner,
                    };

                    foliofitWeeklyWorkout.updateOne({ _id: req.params.id }, data).then((response) => {
                        res.status(200).json({
                            status: true,
                            data: "Updated successfully",
                        });
                    });
                }
            } else {
                console.log("hdfddi");
                fs.unlink(req.file.path, function (err) {
                    if (err) throw err;
                });
                res.status(200).json({
                    status: false,
                    data: "invalid id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    addFoliofitHome: async (req, res, next) => {
        try {
            let data = {
                category: req.body.category,
            };

            let result = await foliofitHomePage.find({});
            if (result.length === 0) {
                const obj = new foliofitHomePage(data);
                obj.save()
                    .then((_) => {
                        res.status(200).json({
                            status: true,
                            data: "Foliofit Home Added",
                        });
                    })
                    .catch(async (error) => {
                        res.status(200).json({
                            status: false,
                            data: error,
                        });
                    });
            } else {
                foliofitHomePage.updateOne({ _id: result[0].id }, data).then((response) => {
                    res.status(200).json({
                        status: true,
                        data: "Updated successfully",
                    });
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteFoliofitWeeklyWorkout: async (req, res, next) => {
        try {
            const result = await foliofitWeeklyWorkout.findOne({ _id: req.params.id });
            if (result) {
                foliofitWeeklyWorkout.deleteOne({ _id: req.params.id }).then((_) => {
                    fs.unlink(`public/images/${result.banner}`, function (err) {
                        if (err) throw err;
                    });
                    res.status(200).json({
                        status: true,
                        data: "Deleted successfully",
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

    /*  foliofit - Master - Fitness - all category Listing
    ============================================= */
    getFoliofitFitnessCategories: async (req, res, next) => {
        try {
            let resultMain = await FoliofitMasterFitnessMainHomeFullbodyHealthy.find({}, { title: 1 });
            let resultOther = await foliofitWeeklyWorkout.find({}, { title: 1 });
            let result = resultMain.concat(resultOther);
            if (result) {
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

    /*foliofit - Master - Yoga - all category Listing
    ============================================= */
    getFoliofitYogaCategories: async (req, res, next) => {
        try {
            let resultMain = await FoliofitMasterYogaMasterMainCategory.find({}, { title: 1 });
            let resultOther = await FoliofitMasterYogaHealthyRecommended.find({}, { title: 1 });
            let resultWeekly = await FoliofitMasterYogaWeekly.find({}, { title: 1 });
            let result = resultMain.concat(resultOther, resultWeekly);
            if (result) {
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

    /*foliofit - Master - Nutrichart - all category Listing (Master - Nutrichart , category based ,vitamins, nutrichart)
    ============================================= */
    getFoliofitNutrichartCategories: async (req, res, next) => {
        try {
            let resultCategoryBased = await NutrichartCategoryBased.find({}, { title: 1 });
            let resultVitamin = await NutrichartVitamin.find({}, { title: 1 });
            let resultCategory = await nutrichartCategory.find({}, { title: 1 });
            //    concat three arrays
            let result = [...resultCategoryBased, ...resultVitamin, ...resultCategory];

            if (result) {
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

    getFoliofitHome: async (req, res, next) => {
        try {
            let data = [];
            let result = await foliofitHomePage.find({});
            for (let item of result) {
                let resultMain = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne(
                    { _id: mongoose.Types.ObjectId(item.category) },
                    { title: 1, banner: { $concat: [imgPath, "$banner"] } }
                );
                if (resultMain) {
                    data.push(resultMain);
                }
                let resultOther = await foliofitWeeklyWorkout.findOne(
                    { _id: mongoose.Types.ObjectId(item.category) },
                    {
                        title: 1,
                        banner: { $concat: [imgPath, "$banner"] },
                    }
                );
                if (resultOther) {
                    data.push(resultOther);
                }
            }
            res.status(200).json({
                status: false,
                data,
            });
        } catch (error) {
            
        }
    },
    getAllNutrichartRecommended: async (req, res, next) => {
        try {
            let result = await nutrichartFood.find( 
                { recommended: true ,recommended_isDeleted:false});
                for(i=0;i<result.length;i++){
                    result[i].image=imgPath+result[i].image
                }
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    deleteNutrichartRecommended: async (req, res, next) => {
        try {
            let validFood = await nutrichartFood.findOne({ _id: mongoose.Types.ObjectId(req.body.id) });

            if (validFood) {
                await nutrichartFood.updateOne(
                    { _id: mongoose.Types.ObjectId(req.body.id) },
                    {$set:{
                        recommended_isDeleted:true,
                        recommended:false
                    }}
                  ).then((response)=>{
                    res.status(200).json({
                        status: true,
                        data: "item deleted from the queue ",
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
                    data: "invalid recommended id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    
};
