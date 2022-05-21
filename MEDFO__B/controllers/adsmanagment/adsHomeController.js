const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const sizeOf = require("image-size");

const AdsHomeTopCatMainCatAd1Ad6Ad8 = require("../../models/ads/home/topAd1MainAd6Ad8");
const AdsHomeSlider1234ad25 = require("../../models/ads/home/slider1234ad25");
const AdsHomeAd3 = require("../../models/ads/home/ad3");
const AdsHomeAd4 = require("../../models/ads/home/ad4");
const AdsHomeAd7 = require("../../models/ads/home/ad7");
const AdsHomeSlider5 = require("../../models/ads/home/slider5");
const AdsHomeTrendingCategory = require("../../models/ads/home/trendingCategory");
const AdsHomePlanYourDiet = require("../../models/ads/home/planYourDiet");
const AdsHomeSpotlight = require("../../models/ads/home/spotlight");
const AdsHomeCart = require("../../models/ads/home/cart");
const AdsHomeYogaFitnessExpert = require("../../models/ads/home/yogaFitnessExpert");

const HealthExpertAdvice = require("../../models/healthExpertAdvice");
const FoliofitMasterYogaMainCategory = require("../../models/foliofit/foliofitMasterYogaMain");
const FoliofitMasterYogaHealthyRecommended = require("../../models/foliofit/foliofitMasterYogaHealthyRecommended");
const FoliofitMasterYogaWeekly = require("../../models/foliofit/foliofitMasterYogaWeekly");
const FoliofitMasterFitnessMainHomeFullbodyHealthy = require("../../models/foliofit/foliofitMasterFitnessHomeFullbodyHealthy");
const foliofitWeeklyWorkout = require("../../models/foliofit/foliofitMasterWeekly");
const DietPlan = require("../../models/dietPlan");

const FoliofitYoga = require("../../models/foliofit/foliofitYoga");
const FolifitFitnessClub = require("../../models/foliofit/foliofitFitnessClub");

const MasterSubCategoryHealthcare = require("../../models/mastersettings/subCategoryHealthcare");
const MasterSubSubCategoryHealthcare = require("../../models/mastersettings/subSubCategory");
const MasterCategory = require("../../models/mastersettings/category");
var categoryTypeHealth = "healthcare";
const Inventory = require("../../models/inventory");

var dimensions = "";
var imageCountHomeSliderAd = 0;

var slider1234Ad25SliderType;
var topCatMainCatAd1Ad6Ad8SliderType;
var adsType;
var imageError;
const imgPath = process.env.BASE_URL;
var imageType;
//let dimensions;
var imageCount;

function checkHomeTopCatMainCatAd1Ad6Ad8SliderType(topCatMainCatAd1Ad6Ad8SliderTypes, fileInfo) {
    if (fileInfo) {
        dimensions = sizeOf(fileInfo.path);
    }
    if (topCatMainCatAd1Ad6Ad8SliderTypes == "topcategories") {
        if (dimensions.width != 104 || dimensions.height != 104) {
            imageError = "Please upload image of size 104 * 104";
        }
        topCatMainCatAd1Ad6Ad8SliderType = "topcategories";
        imageCount = 5;
    }
    if (topCatMainCatAd1Ad6Ad8SliderTypes == "maincategory") {
        if (dimensions.width != 650 || dimensions.height != 430) {
            imageError = "Please upload image of size 650 * 430";
        }
        topCatMainCatAd1Ad6Ad8SliderType = "maincategory";
        imageCount = 2;
    }
    if (topCatMainCatAd1Ad6Ad8SliderTypes == "ad1") {
        if (dimensions.width != 866 || dimensions.height != 105) {
            imageError = "Please upload image of size 866 * 105";
        }
        topCatMainCatAd1Ad6Ad8SliderType = "ad1";
        imageCount = 1;
    }
    if (topCatMainCatAd1Ad6Ad8SliderTypes == "ad6") {
        if (dimensions.width != 1504 || dimensions.height != 668) {
            imageError = "Please upload image of size 1504 * 668";
        }
        topCatMainCatAd1Ad6Ad8SliderType = "ad6";
        imageCount = 1;
    }
    if (topCatMainCatAd1Ad6Ad8SliderTypes == "ad8") {
        if (dimensions.width != 709 || dimensions.height != 255) {
            imageError = "Please upload image of size 709 * 255";
        }
        topCatMainCatAd1Ad6Ad8SliderType = "ad8";
        imageCount = 1;
    }
    // else {
    //     topCatMainCatAd1Ad6Ad8SliderType = "error";
    //     imageCount = 0;
    // }
}

function checkHomeSlider1234Ad25SliderType(slider1234Ad25SliderTypes, fileInfo) {
    if (fileInfo) {
        dimensions = sizeOf(fileInfo.path);
    }
    //let dimensions = sizeOf(fileInfo.path);

    if (slider1234Ad25SliderTypes == "slider1") {      
        if (dimensions.width != 673 || dimensions.height != 337) {
            imageError = "Please upload image of size 673 * 337";
        }
        slider1234Ad25SliderType = "slider1";
    }
    if (slider1234Ad25SliderTypes == "slider2") {
        if (dimensions.width != 299 || dimensions.height != 299) {
            imageError = "Please upload image of size 299 * 299";
        }
        slider1234Ad25SliderType = "slider2";
    }
    if (slider1234Ad25SliderTypes == "ad2") {
        if (dimensions.width != 738 || dimensions.height != 493) {
            imageError = "Please upload image of size 738 * 493";
        }
        slider1234Ad25SliderType = "ad2";
        imageCountHomeSliderAd = 1;
    }
    if (slider1234Ad25SliderTypes == "ad5") {
        if (dimensions.width != 1500 || dimensions.height != 525) {
            imageError = "Please upload image of size 1500 * 525";
        }
        slider1234Ad25SliderType = "ad5";
        imageCountHomeSliderAd = 2;
    }
    if (slider1234Ad25SliderTypes == "slider3") {
        if (dimensions.width != 660 || dimensions.height != 298) {
            imageError = "Please upload image of size 660 * 298";
        }
        slider1234Ad25SliderType = "slider3";
    }
    if (slider1234Ad25SliderTypes == "slider4") {
        if (dimensions.width != 1062 || dimensions.height != 518) {
            imageError = "Please upload image of size 1062 * 518";
        }
        slider1234Ad25SliderType = "slider4";
    }
    // else {
    //     slider1234Ad25SliderType = "error";
    // }
}

function checkHomeAdsType(adsTypes) {
    if (adsTypes == "mainyoga") {
        adsType = "mainyoga";
    }
    if (adsTypes == "subyoga") {
        adsType = "subyoga";
    }
    if (adsTypes == "mainfitness") {
        adsType = "mainfitness";
    }
    if (adsTypes == "subfitness") {
        adsType = "subfitness";
    }
    if (adsTypes == "expertadvise") {
        adsType = "expertadvise";
    }
    // else {
    //     adsType = "error";
    // }
}

function checkImageSize(imageType, fileInfo) {
    if (fileInfo) {
        dimensions = sizeOf(fileInfo.path);
    }
    if (imageType == "ad3") {
        if (dimensions.width != 1502 || dimensions.height != 542) {
            imageError = "Please upload image of size 1502 * 542";
        }
    }
    if (imageType == "ad4") {
        if (dimensions.width != 1500 || dimensions.height != 675) {
            imageError = "Please upload image of size 1500 * 675";
        }
    }
    if (imageType == "ad7") {
        if (dimensions.width != 1597 || dimensions.height != 507) {
            imageError = "Please upload image of size 1597 * 507";
        }
    }
    if (imageType == "slider5") {
        if (dimensions.width != 1390 || dimensions.height != 588) {
            imageError = "Please upload image of size 1390 * 588";
        }
    }
    if (imageType == "trendingCategory") {
        if (dimensions.width != 205 || dimensions.height != 205) {
            imageError = "Please upload image of size 205 * 205";
        }
    }
    if (imageType == "spotlightImage") {
        if (dimensions.width != 3000 || dimensions.height != 5592) {
            imageError = "Please upload image of size 3000 * 5592";
        }
    }
    if (imageType == "spotlightThumbnail") {
        console.log(dimensions.width);
        if (dimensions.width != 104 || dimensions.height != 104) {
            imageError = "Please upload thumbnail of size 104 * 104";
        }
    }
}

function deleteImageFromFile(splittedImageRoute) {
    if (splittedImageRoute) {
        if (fs.existsSync(`./public/images/ads/${splittedImageRoute[1]}`)) {
            fs.unlink(`./public/images/ads/${splittedImageRoute[1]}`, function (err) {
                if (err) throw err;
                console.log("old image deleted!");
            });
        }
    }
}

module.exports = {

    /* Ads Home Top Categories,Main Category, Ad1, Ad6, Ad8
    ============================================= */

    getAdsHomeTopCatMainCatAd1Ad6Ad8: async (req, res, next) => {
        try {
            topCatMainCatAd1Ad6Ad8SliderType = "error";
            let topCatMainCatAd1Ad6Ad8SliderTypes = req.params.sliderType.replace(/\s+/g, " ").trim();
            await checkHomeTopCatMainCatAd1Ad6Ad8SliderType(topCatMainCatAd1Ad6Ad8SliderTypes);
            if (topCatMainCatAd1Ad6Ad8SliderType == "error") {
                res.status(200).json({
                    status: false,
                    data: "Incorrect Slider Type",
                });
            } else {
                let result = await AdsHomeTopCatMainCatAd1Ad6Ad8.find(
                    { sliderType: topCatMainCatAd1Ad6Ad8SliderType, isDisabled: false },
                    {
                        sliderType: 1,
                        image: { $concat: [imgPath, "$image"] },
                    }
                );
                res.status(200).json({
                    status: true,
                    data: result,
                });
            }
        } catch (error) {
            next(error);
        }
    },
    //Get Details By id
    getAdsHomeTopCatMainCatAd1Ad6Ad8Details: async (req, res, next) => {
        try {
            let result = await AdsHomeTopCatMainCatAd1Ad6Ad8.find(
                { _id: req.params.id },
                {
                    sliderType: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    createdBy: 1,
                    updatedBy: 1,
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

    editAdsHomeTopCatMainCatAd1Ad6Ad8: async (req, res, next) => {
        try {
            imageError = "false";
            topCatMainCatAd1Ad6Ad8SliderType = "error";
            let data = req.body;
            var fileInfo = {};
            if (req.file) {
                if (data.sliderId) {
                    let mainExpert = await AdsHomeTopCatMainCatAd1Ad6Ad8.findOne({
                        _id: mongoose.Types.ObjectId(data.sliderId),
                    });
                    if (mainExpert) {
                        topCatMainCatAd1Ad6Ad8SliderTypes = mainExpert.sliderType;
                        fileInfo = req.file;
                        await checkHomeTopCatMainCatAd1Ad6Ad8SliderType(topCatMainCatAd1Ad6Ad8SliderTypes, fileInfo);
                        if (topCatMainCatAd1Ad6Ad8SliderType == "error") {
                            res.status(200).json({
                                status: false,
                                data: "Incorrect Slider Type",
                            });
                        } else if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                            });
                            res.status(200).json({
                                status: false,
                                data: imageError,
                            });
                            imageError = "false";
                        } else {
                            data.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = mainExpert.image.split("/");
                            deleteImageFromFile(splittedImageRoute);
                            data.updatedAt = new Date();
                            data.updatedBy = req.user.id;
                            AdsHomeTopCatMainCatAd1Ad6Ad8.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                                .catch(async (error) => {
                                    if (req.file) {
                                        await unlinkAsync(req.file.path);
                                    }
                                    res.status(200).json({
                                        status: false,
                                        data: error,
                                    });
                                });
                        }
                    } else {
                        if (req.file) {
                            await unlinkAsync(req.file.path);
                        }
                        res.status(200).json({
                            status: false,
                            data: "invalid Slider Id",
                        });
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: "Invalid sliderId",
                    });
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

    addAdsHomeTopCatMainCatAd1Ad6Ad8: async (req, res, next) => {
        try {
            imageCount = 0;
            imageError = "false";
            topCatMainCatAd1Ad6Ad8SliderType = "error";
            let data = req.body;
            var fileInfo = {};
            if (req.file) {
                if (req.params.sliderType) {
                    topCatMainCatAd1Ad6Ad8SliderTypes = req.params.sliderType.replace(/\s+/g, " ").trim();
                    fileInfo = req.file;
                    await checkHomeTopCatMainCatAd1Ad6Ad8SliderType(topCatMainCatAd1Ad6Ad8SliderTypes, fileInfo);
                    if (topCatMainCatAd1Ad6Ad8SliderType == "error") {
                        res.status(200).json({
                            status: false,
                            data: "Incorrect Slider Type",
                        });
                    } else if (imageError != "false") {
                        fs.unlink(fileInfo.path, (err) => {
                            if (err) throw err;
                        });
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    } else {
                        data.image = `ads/${req.file.filename}`;
                        data.sliderType = topCatMainCatAd1Ad6Ad8SliderType;

                        //  code for checking image count
                        if (imageCount != 0) {
                            let adsImageCount = await AdsHomeTopCatMainCatAd1Ad6Ad8.find({
                                sliderType: topCatMainCatAd1Ad6Ad8SliderType,
                            }).countDocuments();
                            if (adsImageCount >= imageCount) {
                                if (req.file) {
                                    await unlinkAsync(req.file.path);
                                }
                                res.status(200).json({
                                    status: false,
                                    data: "Slider already added.Please add the slider id for edit image",
                                });
                            } else {
                                data.createdBy = req.user.id;
                                let schemaObj = new AdsHomeTopCatMainCatAd1Ad6Ad8(data);
                                schemaObj
                                    .save()
                                    .then((response) => {
                                        res.status(200).json({
                                            status: true,
                                            data: "Slider added successfully",
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
                            }
                        }
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: "Please add sliderType",
                    });
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

    deleteAdsHomeTopCatMainCatAd1Ad6Ad8: async (req, res, next) => {
        try {
            let slider = await AdsHomeTopCatMainCatAd1Ad6Ad8.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsHomeTopCatMainCatAd1Ad6Ad8.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = slider.image.split("/");
                        deleteImageFromFile(splittedImageRoute);
                        res.status(200).json({
                            status: true,
                            data: " slider deleted successfully",
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

    /* Ads Home Slider1, Slider2 Slider3, Slider4, Ad2, Ad5 
    ============================================= */
    addAdsHomeSlider1234Ad25: async (req, res, next) => {
        try {
            imageError = "false";
            slider1234Ad25SliderType = "error";
            let slider1234Ad25SliderTypes = req.params.sliderType.replace(/\s+/g, " ").trim();
            var fileInfo = {};
            if (req.file) {
                fileInfo = req.file;
                await checkHomeSlider1234Ad25SliderType(slider1234Ad25SliderTypes, fileInfo);
                if (slider1234Ad25SliderType == "error") {
                    res.status(200).json({
                        status: false,
                        data: "Incorrect Slider Type",
                    });
                } else if (imageError != "false") {
                    fs.unlink(fileInfo.path, (err) => {
                        if (err) throw err;
                    });
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                    imageError = "false";
                } else {
                    let data = req.body;
                    if (req.file) {
                        data.image = `ads/${req.file.filename}`;
                        data.sliderType = slider1234Ad25SliderType;
                        data.createdBy = req.user.id;
                        const redirectTypes = ["Medimall", "Foliofit", "Medfeed", "External"];
                        if (redirectTypes.includes(data.redirect_type)) {
                            let schemaObj = new AdsHomeSlider1234ad25(data);
                            schemaObj
                                .save()
                                .then((response) => {
                                    res.status(200).json({
                                        status: true,
                                        data: "Home slider added successfully",
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
                                status: true,
                                data: "Incorrect redirect type",
                            });
                        }
                    } else {
                        res.status(200).json({
                            status: false,
                            data: "Please upload image",
                        });
                    }
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please Upload Image",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getAdsHomeSlider1234Ad25: async (req, res, next) => {
        try {
            imageError = "false";
            slider1234Ad25SliderType = "error";
            let medimallSliderTypes = req.params.sliderType.replace(/\s+/g, " ").trim();
            await checkHomeSlider1234Ad25SliderType(medimallSliderTypes);
            if (slider1234Ad25SliderType == "error") {
                res.status(200).json({
                    status: false,
                    data: "Incorrect Slider Type",
                });
            } else {
                let result = await AdsHomeSlider1234ad25.find(
                    { sliderType: slider1234Ad25SliderType, isDisabled: false },
                    {
                        redirect_type: 1,
                        type: 1,
                        typeId: 1,
                        sliderType: 1,
                        image: { $concat: [imgPath, "$image"] },
                    }
                );
                res.status(200).json({
                    status: true,
                    data: result,
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getAdsHomeSlider1234Ad25Details: async (req, res, next) => {
        try {           
            var result = await AdsHomeSlider1234ad25.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.params.id)
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
                    $project: {
                        _id: 1,
                        redirect_type: 1,
                        type: 1,
                        typeId: 1,
                        sliderType: 1,
                        image: { $concat: [imgPath, "$image"] },
                        typeName1: { $ifNull: [  { $first: "$subCategory.title"}, { $first: "$subSubCategory.title" }] },
                        typeName2: { $ifNull: [  { $first: "$product.name"}, { $first: "$masterCategory.title" }] }
                    },
                },
                ]);

            if (result.length == 0) {
                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
                });
            } else {
                if(result[0].typeName1){
                    result[0].typeTitle = result[0].typeName1
                    delete result[0].typeName1
                }else if(result[0].typeName2){
                    result[0].typeTitle = result[0].typeName2
                    delete result[0].typeName2
                }else{
                    result[0].typeTitle =""
                }
                res.status(200).json({
                    status: true,
                    data: result,
                });
            }
        } catch (error) {
            next(error);
        }
    },
    editAdsHomeSlider1234Ad25: async (req, res, next) => {
        try {
            imageError = "false";
            slider1234Ad25SliderType = "error";
            let data = req.body;
            // let slider1234Ad25SliderTypes = req.params.sliderType.replace(/\s+/g, " ").trim();
            var fileInfo = {};
            if (data.sliderId) {
                let slider = await AdsHomeSlider1234ad25.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });
                if (slider) {
                    let slider1234Ad25SliderTypes = slider.sliderType;
                    if (req.file) {
                        fileInfo = req.file;
                        await checkHomeSlider1234Ad25SliderType(slider1234Ad25SliderTypes, fileInfo);
                        if (slider1234Ad25SliderType == "error") {
                            res.status(200).json({
                                status: false,
                                data: "Incorrect Slider Type",
                            });
                        } else if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                            });
                        } else {
                            data.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = slider.image.split("/");
                            deleteImageFromFile(splittedImageRoute);
                        }
                    }
                    if (imageError == "false") {
                        const redirectTypes = ["Medimall", "Foliofit", "Medfeed", "External"];
                        if (redirectTypes.includes(data.redirect_type)) {
                            data.updatedAt = new Date();
                            data.updatedBy = req.user.id;
                            AdsHomeSlider1234ad25.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                                data: "Incorrect redirect type",
                            });
                        }
                    } else {
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    }
                } else {
                    if (req.file) {
                        await unlinkAsync(req.file.path);
                    }
                    res.status(200).json({
                        status: false,
                        data: "invalid sliderId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter sliderId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteAdsHomeSlider1234Ad25: async (req, res, next) => {
        try {
            let slider = await AdsHomeSlider1234ad25.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsHomeSlider1234ad25.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = slider.image.split("/");
                        deleteImageFromFile(splittedImageRoute);

                        res.status(200).json({
                            status: true,
                            data: " slider removed successfully",
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
                    data: "invalid sliderId",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    /* Ads Home Ad3
    ============================================= */
    getAdsHomeAd3: async (req, res, next) => {
        try {
            let result = await AdsHomeAd3.find(
                { isDisabled: false },
                {
                    redirect_type: 1,
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
    getAdsHomeAd3Details: async (req, res, next) => {
        try {
            let result = await AdsHomeAd3.find(
                { _id: mongoose.Types.ObjectId(req.params.id) },
                {
                    redirect_type: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    createdBy: 1,
                    updatedBy: 1,
                    image: { $concat: [imgPath, "$image"] },
                }
            );
            if (result.length == 0) {
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
    editAdsHomeAd3: async (req, res, next) => {
        try {
            imageError = "false";
            let data = req.body;
            if (data.sliderId) {
                let homeAd3 = await AdsHomeAd3.findOne({
                    _id: mongoose.Types.ObjectId(data.sliderId),
                });

                if (homeAd3) {
                    if (req.file) {
                        var fileInfo = {};
                        fileInfo = req.file;
                        imageType = "ad3";
                        await checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                            });
                        } else {
                            data.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = homeAd3.image.split("/");
                            deleteImageFromFile(splittedImageRoute);
                        }
                    }
                    if (imageError == "false") {
                        const redirectTypes = [
                            "MedfeedHome",
                            "Med Articles",
                            "Medquiz",
                            "Expert Advice",
                            "Health Tips",
                            "Live Updates",
                            "HealthCare Videos"
                        ];
                        if (redirectTypes.includes(data.redirect_type)) {
                            data.updatedAt = new Date();
                            data.updatedBy = req.user.id;
                            AdsHomeAd3.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                                status: true,
                                data: "Incorrect redirect type",
                            });
                        }
                    } else {
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    }
                } else {
                    if (req.file) {
                        await unlinkAsync(req.file.path);
                    }
                    res.status(200).json({
                        status: false,
                        data: "invalid Slider Id",
                    });
                }
            } else {
                if (req.file) {
                    let adsImageCount = await AdsHomeAd3.find().countDocuments();
                    if (adsImageCount < 1) {
                        data.image = `ads/${req.file.filename}`;
                        var fileInfo = {};
                        fileInfo = req.file;
                        imageType = "ad3";
                        await checkImageSize(imageType, fileInfo);

                        if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                            });
                            res.status(200).json({
                                status: false,
                                data: imageError,
                            });
                         
                        } else {
                            const redirectTypes = [
                                "MedfeedHome",
                                "Med Articles",
                                "Medquiz",
                                "Expert Advice",
                                "Health Tips",
                                "Live Updates",
                                "HealthCare Videos"
                            ];
                            if (redirectTypes.includes(data.redirect_type)) {
                                data.createdBy = req.user.id;
                                let schemaObj = new AdsHomeAd3(data);
                                schemaObj
                                    .save()
                                    .then((response) => {
                                        res.status(200).json({
                                            status: true,
                                            data: "Slider added successfully",
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
                                    status: true,
                                    data: "Incorrect redirect type",
                                });
                            }
                        }
                    } else {
                        res.status(200).json({
                            status: true,
                            data: "Ad3 already added",
                        });
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: "Please upload image",
                    });
                }
            }
        } catch (error) {
            next(error);
        }
    },

    deleteAdsHomeAd3: async (req, res, next) => {
        try {
            let slider = await AdsHomeAd3.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsHomeAd3.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = slider.image.split("/");
                        deleteImageFromFile(splittedImageRoute);

                        res.status(200).json({
                            status: true,
                            data: " slider deleted successfully",
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

    /* Ads Home Ad4
    ============================================= */
    getAdsHomeAd4: async (req, res, next) => {
        try {
            let result = await AdsHomeAd4.find(
                { isDisabled: false },
                {
                    link: 1,
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
    getAdsHomeAd4Details: async (req, res, next) => {
        try {
            let result = await AdsHomeAd4.find(
                { _id: mongoose.Types.ObjectId(req.params.id) },
                {
                    link: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    createdBy: 1,
                    updatedBy: 1,
                    image: { $concat: [imgPath, "$image"] },
                }
            );
            if (result.length == 0) {
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
    editAdsHomeAd4: async (req, res, next) => {
        try {
            imageError = "false";
            let data = req.body;
            console.log("wer", data);
            if (data.sliderId) {
                let homeAd4 = await AdsHomeAd4.findOne({
                    _id: mongoose.Types.ObjectId(data.sliderId),
                });

                if (homeAd4) {
                    if (req.file) {
                        var fileInfo = {};
                        fileInfo = req.file;
                        let imageType = "ad4";
                        await checkImageSize(imageType, fileInfo);

                        if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                                console.log("image removed");
                            });
                        } else {
                            data.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = homeAd4.image.split("/");
                            deleteImageFromFile(splittedImageRoute);
                        }
                    }
                    if (imageError == "false") {
                        data.updatedAt = new Date();
                        data.updatedBy = req.user.id;
                        AdsHomeAd4.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                            data: imageError,
                        });
                        imageError = "false";
                    }
                } else {
                    if (req.file) {
                        await unlinkAsync(req.file.path);
                    }
                    res.status(200).json({
                        status: false,
                        data: "invalid Slider Id",
                    });
                }
            } else {
                let adsImageCount = await AdsHomeAd4.find().countDocuments();
                if (adsImageCount < 1) {
                    if (req.file) {
                        data.image = `ads/${req.file.filename}`;
                        var fileInfo = {};
                        fileInfo = req.file;
                        let imageType = "ad4";
                        await checkImageSize(imageType, fileInfo);

                        if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                                console.log("image removed");
                            });
                            res.status(200).json({
                                status: false,
                                data: imageError,
                            });
                            imageError = "false";
                        } else {
                            data.createdBy = req.user.id;
                            let schemaObj = new AdsHomeAd4(data);
                            schemaObj
                                .save()
                                .then((response) => {
                                    res.status(200).json({
                                        status: true,
                                        data: "Slider added successfully",
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
                        status: true,
                        data: "Slider already exist",
                    });
                }
            }
        } catch (error) {
            next(error);
        }
    },

    deleteAdsHomeAd4: async (req, res, next) => {
        try {
            let slider = await AdsHomeAd4.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsHomeAd4.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = slider.image.split("/");
                        deleteImageFromFile(splittedImageRoute);

                        res.status(200).json({
                            status: true,
                            data: " slider deleted successfully",
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

    /* Ads Home Ad7
    ============================================= */
    getAdsHomeAd7: async (req, res, next) => {
        try {
            let result = await AdsHomeAd7.find(
                { isDisabled: false },
                {
                    couponCode: 1,
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
    getAdsHomeAd7Details: async (req, res, next) => {
        try {
            let result = await AdsHomeAd7.find(
                { _id: mongoose.Types.ObjectId(req.params.id) },
                {
                    couponCode: 1,
                    image: { $concat: [imgPath, "$image"] },
                    createdAt: 1,
                    updatedAt: 1,
                    createdBy: 1,
                    updatedBy: 1,
                }
            );
            if (result.length == 0) {
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
    editAdsHomeAd7: async (req, res, next) => {
        try {
            imageError = "false";
            let data = req.body;
            if (data.sliderId) {
                let homeAd7 = await AdsHomeAd7.findOne({
                    _id: mongoose.Types.ObjectId(data.sliderId),
                });

                if (homeAd7) {
                    if (req.file) {
                        var fileInfo = {};
                        fileInfo = req.file;
                        let imageType = "ad7";
                        await checkImageSize(imageType, fileInfo);

                        if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                            });
                        } else {
                            data.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = homeAd7.image.split("/");
                            deleteImageFromFile(splittedImageRoute);
                        }
                    }
                    if (imageError == "false") {
                        data.updatedAt = new Date();
                        data.updatedBy = req.user.id;
                        AdsHomeAd7.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                            .catch(async (error) => {
                                if (req.file) {
                                    await unlinkAsync(req.file.path);
                                    error = imageError;
                                }
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
                        imageError = "false";
                    }
                } else {
                    if (req.file) {
                        await unlinkAsync(req.file.path);
                    }
                    res.status(200).json({
                        status: false,
                        data: "invalid Slider Id",
                    });
                }
            } else {
                let adsImageCount = await AdsHomeAd7.find().countDocuments();
                if (adsImageCount < 1) {
                    if (req.file) {
                        data.image = `ads/${req.file.filename}`;
                        var fileInfo = {};
                        fileInfo = req.file;
                        let imageType = "ad7";
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
                            data.createdBy = req.user.id;
                            let schemaObj = new AdsHomeAd7(data);
                            schemaObj
                                .save()
                                .then((response) => {
                                    res.status(200).json({
                                        status: true,
                                        data: "Slider added successfully",
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
                        }
                    } else {
                        if (req.file) {
                            await unlinkAsync(req.file.path);
                        }
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
                        data: "Please enter slider id for updating the details",
                    });
                }
            }
        } catch (error) {
            next(error);
        }
    },
    deleteAdsHomeAd7: async (req, res, next) => {
        try {
            let slider = await AdsHomeAd7.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsHomeAd7.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = slider.image.split("/");
                        deleteImageFromFile(splittedImageRoute);

                        res.status(200).json({
                            status: true,
                            data: " slider deleted successfully",
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

    /* Ads Home Slider5
    ============================================= */
    addAdsHomeSlider5: async (req, res, next) => {
        try {
            imageError = "false";
            let data = req.body;
            if (req.file) {
                var fileInfo = {};
                fileInfo = req.file;
                imageType = "slider5";
                await checkImageSize(imageType, fileInfo);
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
                    data.image = `ads/${req.file.filename}`;
                    data.createdBy = req.user.id;
                    let schemaObj = new AdsHomeSlider5(data);
                    schemaObj
                        .save()
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "Home slider added successfully",
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
    getAdsHomeSlider5: async (req, res, next) => {
        try {
            let result = await AdsHomeSlider5.find(
                { isDisabled: false },
                {
                    type: 1,
                    typeId: 1,
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
    editAdsHomeSlider5: async (req, res, next) => {
        try {
            imageError = "false";
            let data = req.body;
            var fileInfo = {};
            if (data.sliderId) {
                let slider = await AdsHomeSlider5.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });
                if (slider) {
                    if (req.file) {
                        var fileInfo = {};
                        fileInfo = req.file;
                        imageType = "slider5";
                        await checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                            });
                        } else {
                            data.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = slider.image.split("/");
                            deleteImageFromFile(splittedImageRoute);
                        }
                    }
                    if (imageError == "false") {
                        data.updatedAt = new Date();
                        data.updatedBy = req.user.id;
                        AdsHomeSlider5.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                            data: imageError,
                        });
                        imageError = "false";
                    }
                } else {
                    if (req.file) {
                        await unlinkAsync(req.file.path);
                    }
                    res.status(200).json({
                        status: false,
                        data: "invalid sliderId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter sliderId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteAdsHomeSlider5: async (req, res, next) => {
        try {
            let slider = await AdsHomeSlider5.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsHomeSlider5.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = slider.image.split("/");
                        deleteImageFromFile(splittedImageRoute);
                        res.status(200).json({
                            status: true,
                            data: "Home slider5 removed successfully",
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
    getAdsHomeSlider5Details: async (req, res, next) => {
        try {
            var result = await AdsHomeSlider5.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.params.id)
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
                    $project: {
                        _id: 1,
                        type: 1,
                        typeId: 1,
                        image: { $concat: [imgPath, "$image"] },
                        typeName1: { $ifNull: [  { $first: "$subCategory.title"}, { $first: "$subSubCategory.title" }] },
                        typeName2: { $ifNull: [  { $first: "$product.name"}, { $first: "$masterCategory.title" }] }
                    },
                },
                ]);

            if (result.length == 0) {
                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
                });
            } else {
                if(result[0].typeName1){
                    result[0].typeTitle = result[0].typeName1
                    delete result[0].typeName1
                }else if(result[0].typeName2){
                    result[0].typeTitle = result[0].typeName2
                    delete result[0].typeName2
                }else{
                    result[0].typeTitle =""
                }
                res.status(200).json({
                    status: true,
                    data: result,
                });
            }
        } catch (error) {
            next(error);
        }
    },

    /* Ads Home Trending Category
    ============================================= */
    addAdsHomeTrendingCategory: async (req, res, next) => {
        try {
            imageError = "false";
            let data = req.body;
            if (req.file) {
                var fileInfo = {};
                fileInfo = req.file;
                imageType = "trendingCategory";
                await checkImageSize(imageType, fileInfo);
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
                    let trendingImageCount = await AdsHomeTrendingCategory.find({ isDisabled: false }).countDocuments();
                    if (trendingImageCount < 3) {
                        data.image = `ads/${req.file.filename}`;
                        data.createdBy = req.user.id;
                        let schemaObj = new AdsHomeTrendingCategory(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Home Trending Category added successfully",
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
                            status: true,
                            data: "Trending category exist",
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
    getAdsHomeTrendingCategory: async (req, res, next) => {
        try {
            let result = await AdsHomeTrendingCategory.find(
                { isDisabled: false },
                {
                    categoryId: 1,
                    image: { $concat: [imgPath, "$image"] },
                    offerBoxText: 1,
                    offerBoxColor: 1,
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
    editAdsHomeTrendingCategory: async (req, res, next) => {
        try {
            imageError = "false";
            let data = req.body;
            var fileInfo = {};
            if (data.sliderId) {
                let slider = await AdsHomeTrendingCategory.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });
                if (slider) {
                    if (req.file) {
                        var fileInfo = {};
                        fileInfo = req.file;
                        imageType = "trendingCategory";
                        await checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                console.log("image removed");
                                if (err) throw err;
                            });
                        } else {
                            data.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = slider.image.split("/");
                            deleteImageFromFile(splittedImageRoute);
                        }
                    }
                    if (imageError == "false") {
                        data.updatedAt = new Date();
                        data.updatedBy = req.user.id;
                        AdsHomeTrendingCategory.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                            data: imageError,
                        });
                        imageError = "false";
                    }
                } else {
                    if (req.file) {
                        await unlinkAsync(req.file.path);
                    }
                    res.status(200).json({
                        status: false,
                        data: "invalid sliderId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter sliderId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteAdsHomeTrendingCategory: async (req, res, next) => {
        try {
            let slider = await AdsHomeTrendingCategory.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsHomeTrendingCategory.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = slider.image.split("/");
                        deleteImageFromFile(splittedImageRoute);

                        res.status(200).json({
                            status: true,
                            data: "Home trending category removed successfully",
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
                    data: "invalid sliderId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getHomeTrendingCategoryDetails: async (req, res, next) => {
        try {         
            // let result = await AdsHomeTrendingCategory.find(
            //     { _id: mongoose.Types.ObjectId(req.params.id) },
            //     {
            //         categoryId: 1,
            //         image: { $concat: [imgPath, "$image"] },
            //         offerBoxText: 1,
            //         offerBoxColor: 1,
            //         createdAt: 1,
            //         updatedAt: 1,
            //         createdBy: 1,
            //         updatedBy: 1,
            //     }
            // );
            var result = await AdsHomeTrendingCategory.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.params.id)
                    },
                }, 
                {
                    $lookup: {
                        from: "mastercategories",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "masterCategory",
                    },
                },                        
                {
                    $lookup: {
                        from: "mastersubsubcategories",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "subCategory",
                    },
                },                
                {
                    $lookup: {
                        from: "mastersubcategoryhealthcares",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "subSubCategory",
                    },
                },       
                {
                    $project: {
                        _id: 1,
                        categoryId: 1,
                        image: { $concat: [imgPath, "$image"] },
                        offerBoxText: 1,
                        offerBoxColor: 1,
                        categoryName1: { $ifNull: [  { $first: "$subCategory.title"}, { $first: "$subSubCategory.title" }] },
                        categoryName2:  { $first: "$masterCategory.title"}
                    },
                },
                ]);

            if (result.length == 0) {

                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
                });
            } else {
                if(result[0].categoryName1){
                    result[0].categoryName = result[0].categoryName1
                    delete result[0].categoryName1
                }else{
                    result[0].categoryName = result[0].categoryName2
                    delete result[0].categoryName2
                }
                res.status(200).json({
                    status: true,
                    data: result,
                });
            }
        } catch (error) {
            next(error);
        }
    },
    /* Ads Home Plan Your diet
    ============================================= */
    addAdsHomePlanYourDiet: async (req, res, next) => {
        try {
            let data = req.body;
            data.createdBy = req.user.id;
            let schemaObj = new AdsHomePlanYourDiet(data);
            schemaObj
                .save()
                .then((response) => {
                    res.status(200).json({
                        status: true,
                        data: "Plan Your Diet Category added successfully",
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
    getAdsHomePlanYourDiet: async (req, res, next) => {
        try {
            let result = await AdsHomePlanYourDiet.find(
                { isDisabled: false },
                {
                    categoryId: 1,
                }
            ).lean();
            for (let item of result) {
                let diet = await DietPlan.findOne({ _id: mongoose.Types.ObjectId(item.categoryId) });
                if (diet) {
                    item.name = diet.name;
                    item.image = process.env.BASE_URL.concat(diet.image);
                }
            }
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    editAdsHomePlanYourDiet: async (req, res, next) => {
        try {
            let data = req.body;
            if (data.dietId) {
                let slider = await AdsHomePlanYourDiet.findOne({ _id: mongoose.Types.ObjectId(data.dietId) });

                if (slider) {
                    data.updatedAt = new Date();
                    AdsHomePlanYourDiet.updateOne({ _id: mongoose.Types.ObjectId(data.dietId) }, data)
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
                        data: "invalid dietId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter dietId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteAdsHomePlanYourDiet: async (req, res, next) => {
        try {
            let diet = await AdsHomePlanYourDiet.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (diet) {
                AdsHomePlanYourDiet.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        res.status(200).json({
                            status: true,
                            data: "Diet Category removed successfully",
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
                    data: "invalid diet id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getAdsHomePlanYourDietDetails: async (req, res, next) => {
        try {
            let result = await AdsHomePlanYourDiet.find(
                { _id: mongoose.Types.ObjectId(req.params.id) },
                {
                    categoryId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    createdBy: 1,
                    updatedBy: 1,
                }
            ).lean();
            if (result.length == 0) {
                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
                });
            } else {               
                    let diet = await DietPlan.findOne({ _id: mongoose.Types.ObjectId(result[0].categoryId) });
                    if (diet) {
                        result[0].name = diet.name;
                    }    
                  
                    res.status(200).json({
                        status: true,
                        data: result,
                    });
            }
        } catch (error) {
            next(error);
        }
    },

    /* Ads Home In The Spotlight
    ============================================= */
    addAdsHomeSpotlight: async (req, res, next) => {
        try {
            // let data = req.body;
            imageError = "false";
            if (req.files.image && req.files.thumbnail) {
                var fileInfoImage = {};
                var fileInfoThumbnail = {};
                fileInfoImage = req.files.image[0];
                imageType = "spotlightImage";
                await checkImageSize(imageType, fileInfoImage);
                fileInfoThumbnail = req.files.thumbnail[0];
                imageType = "spotlightThumbnail";
                await checkImageSize(imageType, fileInfoThumbnail);

                let data = {
                    colorCode: req.body.colorCode,
                    offerText: req.body.offerText,
                    type: req.body.type,
                    typeId: req.body.typeId,
                    image: `ads/${fileInfoImage.filename}`,
                    thumbnail: `ads/${fileInfoThumbnail.filename}`,
                    isMedimall: req.body.isMedimall,
                };
                if (imageError != "false") {
                    if (req.files.thumbnail) {
                        req.files.thumbnail.map(async (e) => {
                            await unlinkAsync(e.path);
                        });
                    }
                    if (req.files.image) {
                        req.files.image.map(async (e) => {
                            await unlinkAsync(e.path);
                        });
                    }
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                    imageError = "false";
                } else {
                    data.createdBy = req.user.id;
                    let schemaObj = new AdsHomeSpotlight(data);
                    schemaObj
                        .save()
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "Home spotlight added successfully",
                            });
                        })
                        .catch(async (error) => {
                            if (req.files.thumbnail) {
                                req.files.thumbnail.map(async (e) => {
                                    await unlinkAsync(e.path);
                                });
                            }
                            if (req.files.image) {
                                req.files.image.map(async (e) => {
                                    await unlinkAsync(e.path);
                                });
                            }
                            res.status(200).json({
                                status: false,
                                data: error,
                            });
                        });
                }
            } else {
                if (req.files.thumbnail) {
                    req.files.thumbnail.map(async (e) => {
                        await unlinkAsync(e.path);
                    });
                }
                if (req.files.image) {
                    req.files.image.map(async (e) => {
                        await unlinkAsync(e.path);
                    });
                }
                res.status(200).json({
                    status: false,
                    data: "Please upload image",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getAdsHomeSpotlight: async (req, res, next) => {
        try {
            let result = await AdsHomeSpotlight.find(
                { isDisabled: false },
                {
                    type: 1,
                    typeId: 1,
                    image: { $concat: [imgPath, "$image"] },
                    thumbnail: { $concat: [imgPath, "$thumbnail"] },
                    colorCode: 1,
                    offerText: 1,
                    isMedimall: 1,
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
    editAdsHomeSpotlight: async (req, res, next) => {
        try {
            imageError = "false";
            let data = req.body;
            var fileInfo = {};
            if (data.spotlightId) {
                let spotlight = await AdsHomeSpotlight.findOne({ _id: mongoose.Types.ObjectId(data.spotlightId) });
                if (spotlight) {
                    if (req.files.image) {
                        var fileInfoImage = {};
                        fileInfoImage = req.files.image[0];
                        imageType = "spotlightImage";
                        await checkImageSize(imageType, fileInfoImage);
                        if (imageError == "false") {
                            data.image = `ads/${fileInfoImage.filename}`;
                            // deleting old image
                            let splittedImageRoute = spotlight.image.split("/");
                            deleteImageFromFile(splittedImageRoute);
                        }
                    }
                    if (req.files.thumbnail) {
                        var fileInfoThumbnail = {};
                        fileInfoThumbnail = req.files.thumbnail[0];
                        imageType = "spotlightThumbnail";
                        await checkImageSize(imageType, fileInfoThumbnail);
                        if (imageError == "false") {
                            data.thumbnail = `ads/${fileInfoThumbnail.filename}`;
                            // deleting old thumbnail
                            let splittedThumbnailRoute = spotlight.thumbnail.split("/");
                            deleteImageFromFile(splittedThumbnailRoute);
                        }
                    }
                    if (imageError == "false") {
                        data.updatedAt = new Date();
                        AdsHomeSpotlight.updateOne({ _id: mongoose.Types.ObjectId(data.spotlightId) }, data)
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
                        if (req.files.thumbnail) {
                            req.files.thumbnail.map(async (e) => {
                                await unlinkAsync(e.path);
                            });
                        }
                        if (req.files.image) {
                            req.files.image.map(async (e) => {
                                await unlinkAsync(e.path);
                            });
                        }
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    }
                } else {
                    if (req.files.thumbnail) {
                        req.files.thumbnail.map(async (e) => {
                            await unlinkAsync(e.path);
                        });
                    }
                    if (req.files.image) {
                        req.files.image.map(async (e) => {
                            await unlinkAsync(e.path);
                        });
                    }
                    res.status(200).json({
                        status: false,
                        data: "invalid spotlightId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter spotlightId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteAdsHomeSpotlight: async (req, res, next) => {
        try {
            let spotlight = await AdsHomeSpotlight.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (spotlight) {
                AdsHomeSpotlight.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = spotlight.image.split("/");
                        deleteImageFromFile(splittedImageRoute);
                        let splittedThumbnailRoute = spotlight.thumbnail.split("/");
                        deleteImageFromFile(splittedThumbnailRoute);

                        res.status(200).json({
                            status: true,
                            data: "Home spotlight deleted successfully",
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
    getAdsHomeSpotlightDetails: async (req, res, next) => {
        try {
            // let result = await AdsHomeSpotlight.find(
            //     { _id: mongoose.Types.ObjectId(req.params.id) },
            //     {
            //         type: 1,
            //         typeId: 1,
            //         image: { $concat: [imgPath, "$image"] },
            //         thumbnail: { $concat: [imgPath, "$thumbnail"] },
            //         colorCode: 1,
            //         offerText: 1,
            //         isMedimall: 1,
            //         createdAt: 1,
            //         updatedAt: 1,
            //         createdBy: 1,
            //         updatedBy: 1,
            //     }
            // );
            var result = await AdsHomeSpotlight.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.params.id)
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
                    $project: {
                        _id: 1,
                        type: 1,
                        typeId: 1,
                        image: { $concat: [imgPath, "$image"] },
                        thumbnail: { $concat: [imgPath, "$thumbnail"] },
                        colorCode: 1,
                        offerText: 1,
                        isMedimall: 1,
                        typeName1: { $ifNull: [  { $first: "$subCategory.title"}, { $first: "$subSubCategory.title" }] },
                        typeName2: { $ifNull: [  { $first: "$product.name"}, { $first: "$masterCategory.title" }] }
                    },
                },
                ]);

            if (result.length == 0) {
                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
                });
            } else {
                if(result[0].typeName1){
                    result[0].typeTitle = result[0].typeName1
                    delete result[0].typeName1
                }else if(result[0].typeName2){
                    result[0].typeTitle = result[0].typeName2
                    delete result[0].typeName2
                }else{
                    result[0].typeName =""
                }
                res.status(200).json({
                    status: true,
                    data: result,
                });
            }
        } catch (error) {
            next(error);
        }
    },
    /* Ads Home Cart Your Esentials
    ============================================= */
    addAdsHomeCart: async (req, res, next) => {
        try {
            let data = req.body;
            let existingCart = await AdsHomeCart.findOne({
                categoryId: mongoose.Types.ObjectId(req.body.categoryId),
                //subCategoryId: mongoose.Types.ObjectId(req.body.subCategoryId),
            });
            if (!existingCart) {
            data.createdBy = req.user.id;
            let schemaObj = new AdsHomeCart(data);
            schemaObj
                .save()
                .then((response) => {
                    res.status(200).json({
                        status: true,
                        data: "Cart your med essentials added successfully",
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
                    data: "Category already exist",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getAdsHomeCart: async (req, res, next) => {
        try { 
            // let result = await AdsHomeCart.find(
            //     {isDisabled:false},
            //     {
            //         categoryId: 1,
            //         subCategoryId: 1
            //     }
            //     ).populate({
            //     path: "subCategoryId",
            //     select: ["_id", "name","pricing.image"],
            //     }).lean()
            //     if(result.length){
            //          for(i=0;i<result.length;i++){
            //                 result[i].name = result[i].subCategoryId.name
            //                 if(result[i].subCategoryId.pricing[0].image[0]){
            //                     result[i].image= process.env.BASE_URL.concat(result[i].subCategoryId.pricing[0].image[0])
            //                 }                            
            //                 delete result[i].subCategoryId                            
            //             }
            //     }
            var result = await AdsHomeCart.aggregate([
                {
                    $match: {
                        isDisabled: false
                    },
                }, 
                {
                    $lookup: {
                        from: "mastersubcategoryhealthcares",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "subCategory",
                    },
                },
                {
                    $unwind: {
                        path: "$subCategory",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: "$subCategory.title",
                        image: { $concat: [imgPath, "$subCategory.image"] },
                        categoryId: 1
                    },
                },
                ]);
              
                res.status(200).json({
                    status: false,
                    data: result,
                });         
          
            // var result = await AdsHomeCart.aggregate([
            //     {
            //         $match: {
            //             isDisabled: false,
            //         },
            //     },
            //     {
            //         $lookup: {
            //             from: "products",
            //             localField: "subCategoryId",
            //             foreignField: "_id",
            //             as: "product",
            //         },
            //     },
            //     {
            //         $unwind: {
            //             path: "$product",
            //             preserveNullAndEmptyArrays: true,
            //         },
            //     },
            //     {
            //         $project: {
            //             _id: 1,
            //             productName: "$product.title",
            //             image: { $concat: [imgPath, "$product.image"] },
            //             categoryId: 1,
            //             subCategoryId: 1,
            //         },
            //     },
            // ]);
          
        } catch (error) {
            next(error);
        }
    },
    editAdsHomeCart: async (req, res, next) => {
        try {
            let data = req.body;
            if (data.cartId) {
                let cart = await AdsHomeCart.findOne({ _id: mongoose.Types.ObjectId(data.cartId) });
                if (cart) {
                    data.updatedAt = new Date();
                    let existingCart = await AdsHomeCart.findOne({
                        categoryId: mongoose.Types.ObjectId(req.body.categoryId),
                        subCategoryId: mongoose.Types.ObjectId(req.body.subCategoryId),
                        _id: { $ne: cart._id } 
                    });
                    if (!existingCart) {
                    AdsHomeCart.updateOne({ _id: mongoose.Types.ObjectId(data.cartId) }, data)
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
                            data: "Existing sub category under this category",
                        });
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: "invalid cartId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter cartId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteAdsHomeCart: async (req, res, next) => {
        try {
            let cart = await AdsHomeCart.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (cart) {
                AdsHomeCart.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        res.status(200).json({
                            status: true,
                            data: "Cart your medessentials deleted successfully",
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
                    data: "invalid cart id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getAdsHomeCartDetails: async (req, res, next) => {
        try {
            // let result = await AdsHomeCart.find(
            //     { _id: mongoose.Types.ObjectId(req.params.id) },
            //     {
            //         categoryId: 1,
            //         subCategoryId: 1,
            //         createdAt: 1,
            //         updatedAt: 1,
            //         createdBy: 1,
            //         updatedBy: 1,
            //     }
            // );
               var result = await AdsHomeCart.aggregate([
                {
                    $match: {
                        isDisabled: false,_id: mongoose.Types.ObjectId(req.params.id)
                    },
                },               
                {
                    $lookup: {
                        from: "mastersubsubcategories",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "subCategory",
                    },
                },
                {
                    $unwind: {
                        path: "$subCategory",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "mastersubcategoryhealthcares",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "subSubCategory",
                    },
                },
                {
                    $unwind: {
                        path: "$subSubCategory",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        categoryId: 1,
                        category: { $ifNull: ["$subCategory.title", "$subSubCategory.title"] },
                    },
                },
                ]);
            if (result.length == 0) {
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

    /* Ads Home Main Yoga, Main Fitness
    ============================================= */

    getAdsHomeMainYogaFitness: async (req, res, next) => {
        try {
            adsType = "error";
            let adsTypes = req.params.adsType.replace(/\s+/g, " ").trim();
            await checkHomeAdsType(adsTypes);
            if (adsType == "error") {
                res.status(200).json({
                    status: false,
                    data: "Incorrect Ads Type",
                });
            } else {
                let result = await AdsHomeYogaFitnessExpert.find(
                    { adsType: adsType, isDisabled: false },
                    {
                        categoryId: 1,
                        subCategoryId: 1,
                        adsType: 1,
                    }
                ).lean();

                if (result) {
                    var videoDetails;
                    if (result[0].adsType == "mainyoga") {
                        videoDetails = await FoliofitYoga.findOne(
                            { _id: result[0].subCategoryId },
                            {
                                title: 1,
                                video: 1,
                                thumbnail: { $concat: [imgPath, "$thumbnail"] },
                                workoutTime: 1,
                            }
                        );
                    }
                    if (result[0].adsType == "mainfitness") {
                        videoDetails = await FolifitFitnessClub.findOne(
                            { _id: result[0].subCategoryId },
                            {
                                title: 1,
                                video: 1,
                                thumbnail: { $concat: [imgPath, "$thumbnail"] },
                                workoutTime: 1,
                            }
                        );
                    }
                    if (videoDetails) {
                        result[0].title = videoDetails.title;
                        result[0].video = videoDetails.video;
                        result[0].thumbnail = videoDetails.thumbnail;
                        result[0].workoutTime = videoDetails.workoutTime;
                    }
                    res.status(200).json({
                        status: true,
                        data: result,
                    });
                } else {
                    res.status(200).json({
                        status: true,
                        data: "Data Not found",
                    });
                }
            }
        } catch (error) {
            next(error);
        }
    },
    editAdsHomeMainYogaFitness: async (req, res, next) => {
        try {
            adsType = "error";
            let data = req.body;
            let adsTypes = req.params.adsType.replace(/\s+/g, " ").trim();
            await checkHomeAdsType(adsTypes);

            if (adsType != "error") {
                if (data.adsId) {
                    let ads = await AdsHomeYogaFitnessExpert.findOne({ _id: mongoose.Types.ObjectId(data.adsId) });

                    if (ads) {
                        data.updatedAt = new Date();
                        AdsHomeYogaFitnessExpert.updateOne({ _id: mongoose.Types.ObjectId(data.adsId) }, data)
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
                            data: "invalid adsId",
                        });
                    }
                } else {
                    let ads = await AdsHomeYogaFitnessExpert.findOne({ adsType: adsType });
                    if (ads) {
                        res.status(200).json({
                            status: false,
                            data: "please enter adsId",
                        });
                    } else {
                        let data = req.body;
                        data.adsType = adsType;
                        let schemaObj = new AdsHomeYogaFitnessExpert(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Ads added successfully",
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
                    }
                }
            } else {
                res.status(200).json({
                    status: true,
                    data: "Invalid ads Type",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getAdsHomeMainYogaFitnessDetails: async (req, res, next) => {
        try {
            let result = await AdsHomeYogaFitnessExpert.find(
                { _id: mongoose.Types.ObjectId(req.params.id) },
                {
                    categoryId: 1,
                    subCategoryId: 1,
                    adsType: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    createdBy: 1,
                    updatedBy: 1,
                }
            ).lean();
            if (result.length == 0) {
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
    deleteAdsHomeMainYogaFitness: async (req, res, next) => {
        try {
            let cart = await AdsHomeYogaFitnessExpert.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (cart) {
                AdsHomeYogaFitnessExpert.deleteOne({ _id: req.params.id })
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
                    data: "invalid  id",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    /* Ads Home Main Yoga  Details By Id
    ============================================= */
    getAdsHomeYogaDetails: async (req, res, next) => {
        try {
            var result = await AdsHomeYogaFitnessExpert.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.params.id),
                    },
                },
                {
                    $lookup: {
                        from: "folifityogas",
                        localField: "subCategoryId",
                        foreignField: "_id",
                        as: "videos",
                    },
                },
                {
                    $unwind: {
                        path: "$videos",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        videoTitle: "$videos.title",
                        categoryId: 1,
                        subCategoryId: 1,
                        adsType: 1,
                    },
                },
            ]);
            if (result.length == 0) {
                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
                });
            } else {
                let category;
                let resultMain = await FoliofitMasterYogaMainCategory.findById(result[0].categoryId).lean();
                if (resultMain) category = resultMain;
                let resultOther = await FoliofitMasterYogaHealthyRecommended.findById(result[0].categoryId).lean();
                if (resultOther) category = resultOther;
                let resultWeekly = await FoliofitMasterYogaWeekly.findById(result[0].categoryId).lean();
                if (resultWeekly) category = resultWeekly;
                if (category) {
                    result[0].category = category.title;
                }
                res.status(200).json({
                    status: true,
                    data: result,
                });
            }
        } catch (error) {
            next(error);
        }
    },

    /* Ads Home Main Fitness / Sub fitness  Details By Id
    ============================================= */
    getAdsHomeFitnessDetails: async (req, res, next) => {
        try {
            var result = await AdsHomeYogaFitnessExpert.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.params.id),
                    },
                },
                {
                    $lookup: {
                        from: "folifitfitnessclubs",
                        localField: "subCategoryId",
                        foreignField: "_id",
                        as: "videos",
                    },
                },
                {
                    $unwind: {
                        path: "$videos",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "foliofitmasterfitnessmainhomefullbodyhealthies",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "category1",
                    },
                },
                {
                    $unwind: {
                        path: "$category1",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "foliofitweeklyworkouts",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "category2",
                    },
                },
                {
                    $unwind: {
                        path: "$category2",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        videoTitle: "$videos.title",
                        categoryId: 1,
                        subCategoryId: 1,
                        adsType: 1,
                        category: { $ifNull: ["$category1.title", "$category2.title"] },
                    },
                },
            ]);
            if (result.length == 0) {
                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
                });
            } else {               
                res.status(200).json({
                    status: false,
                    data: result,
                });
            }
        } catch (error) {
            next(error);
        }
    },


    /* Ads Home Sub yoga, Sub Fitness , Expert Advise
    ============================================= */
    addAdsHomeSubYogaFitnessExpert: async (req, res, next) => {
        try {
            adsType = "error";
            let data = req.body;
            let adsTypes = req.params.adsType.replace(/\s+/g, " ").trim();
            await checkHomeAdsType(adsTypes);
            if (adsType != "error") {
                let existingAds = await AdsHomeYogaFitnessExpert.findOne({
                    categoryId: mongoose.Types.ObjectId(req.body.categoryId),
                    subCategoryId: mongoose.Types.ObjectId(req.body.subCategoryId),
                    adsType: adsType,
                });
               

                if (!existingAds) {

                data.adsType = adsType;
                data.createdBy = req.user.id;
                let schemaObj = new AdsHomeYogaFitnessExpert(data);
                schemaObj
                    .save()
                    .then((response) => {
                        res.status(200).json({
                            status: true,
                            data: "Ads added successfully",
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
                        data: "Existing sub category under this category",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Invalid Ads type",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getAdsHomeSubYogaFitnessExpertOld: async (req, res, next) => {
        try {
            adsType = "error";
            let adsTypes = req.params.adsType.replace(/\s+/g, " ").trim();
            await checkHomeAdsType(adsTypes);
            if (adsType == "error") {
                res.status(200).json({
                    status: false,
                    data: "Incorrect Ads Type",
                });
            } else {
                let result = await AdsHomeYogaFitnessExpert.find(
                    { adsType: adsType, isDisabled: false },
                    {
                        categoryId: 1,
                        subCategoryId: 1,
                        adsType: 1,
                    }
                );
                res.status(200).json({
                    status: true,
                    data: result,
                });
            }
        } catch (error) {
            next(error);
        }
    }, 

    // Get All Listing in sub yoga and sub fitness with video details
    getAdsHomeSubYogaFitnessExpert: async (req, res, next) => {
        try {
            var result = []
            adsType = "error";
            let adsTypes = req.params.adsType.replace(/\s+/g, " ").trim();
            await checkHomeAdsType(adsTypes);
            if (adsType == "error") {
                res.status(200).json({
                    status: false,
                    data: "Incorrect Ads Type",
                });
            } else {
                var result =[]
                if(adsType == "subyoga"){
                     result = await AdsHomeYogaFitnessExpert.aggregate([
                        {
                            $match: {
                                adsType: adsType, isDisabled: false
                            },
                        },
                        {
                            $lookup: {
                                from: "folifityogas",
                                localField: "subCategoryId",
                                foreignField: "_id",
                                as: "videos",
                            },
                        },
                        {
                            $unwind: {
                                path: "$videos",
                                preserveNullAndEmptyArrays: true,
                            },
                        },                   
                        {
                            $project: {
                                _id: 1,
                                videoTitle: "$videos.title",
                                thumbnail1:  { $concat: [imgPath, "$videos.thumbnail"] },                                
                                workoutTime: "$videos.workoutTime",
                                categoryId: 1,
                                subCategoryId: 1,
                                adsType: 1,
                            },
                        },
                    ]);

                }

                if(adsType == "subfitness"){
                     result = await AdsHomeYogaFitnessExpert.aggregate([
                        {
                            $match: {
                                adsType: adsType, isDisabled: false
                            },
                        },
                        {
                            $lookup: {
                                from: "folifitfitnessclubs",
                                localField: "subCategoryId",
                                foreignField: "_id",
                                as: "videos",
                            },
                        },
                        {
                            $unwind: {
                                path: "$videos",
                                preserveNullAndEmptyArrays: true,
                            },
                        },                   
                        {
                            $project: {
                                _id: 1,
                                videoTitle: "$videos.title",
                                thumbnail:  { $concat: [imgPath, "$videos.thumbnail"] },
                                workoutTime: "$videos.workoutTime",
                                categoryId: 1,
                                subCategoryId: 1,
                                adsType: 1,
                            },
                        },
                    ]);
                }
                if (result) {   
                    res.status(200).json({
                        status: true,
                        data: result,
                    });
                } else {
                    res.status(200).json({
                        status: true,
                        data: "Data Not found",
                    });
                }
            }
        } catch (error) {
            next(error);
        }
    }, 
    editAdsHomeSubYogaFitnessExpert: async (req, res, next) => {
        try {
            let data = req.body;
            if (data.adsId) {
                let ads = await AdsHomeYogaFitnessExpert.findOne({ _id: mongoose.Types.ObjectId(data.adsId) });

                if (ads) {
                    data.updatedAt = new Date();
                    let existingAds = await AdsHomeYogaFitnessExpert.findOne({
                        categoryId: mongoose.Types.ObjectId(req.body.categoryId),
                        subCategoryId: mongoose.Types.ObjectId(req.body.subCategoryId),
                        adsType :ads.adsType,
                        _id: { $ne: ads._id } 
                    });
                    if (!existingAds) {
                        AdsHomeYogaFitnessExpert.updateOne({ _id: mongoose.Types.ObjectId(data.adsId) }, data)
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
                            data: "Existing sub category under this category",
                        });
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: "invalid adsId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter adsId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteAdsHomeSubYogaFitnessExpert: async (req, res, next) => {
        try {
            let cart = await AdsHomeYogaFitnessExpert.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (cart) {
                AdsHomeYogaFitnessExpert.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        res.status(200).json({
                            status: true,
                            data: "Ads removed successfully",
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
                    data: "invalid ads id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getAdsHomeSubYogaFitnessExpertDetails: async (req, res, next) => {
        try {
            let result = await AdsHomeYogaFitnessExpert.find(
                { _id: mongoose.Types.ObjectId(req.params.id) },
                {
                    categoryId: 1,
                    subCategoryId: 1,
                    adsType: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    createdBy: 1,
                    updatedBy: 1,
                }
            );
            if (result.length == 0) {
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

    
 /* Ads Home Expert Advice  Details By Id
    ============================================= */
    getAdsHomeExpertAdviceDetails: async (req, res, next) => {
        try {
            var result = await AdsHomeYogaFitnessExpert.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.params.id),
                    },
                },
                {
                    $lookup: {
                        from: "healthexpertcategories",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "category",
                    },
                },
                {
                    $unwind: {
                        path: "$category",
                        preserveNullAndEmptyArrays: true,
                    },
                },    
                {
                    $lookup: {
                        from: "healthexperts",
                        localField: "subCategoryId",
                        foreignField: "_id",
                        as: "question",
                    },
                },
                {
                    $unwind: {
                        path: "$question",
                        preserveNullAndEmptyArrays: true,
                    },
                },              
               
                {
                    $project: {
                        _id: 1,
                        category: "$category.name",
                        question: "$question.question",
                        categoryId: 1,
                        subCategoryId: 1,
                        adsType: 1,
                    },
                },
            ]);
            if (result.length == 0) {
                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
                });
            } else {               
                res.status(200).json({
                    status: false,
                    data: result,
                });
            }
        } catch (error) {
            next(error);
        }
    },

    

    /*  Expert Advise Replied Question Based on health expert category Id
    ============================================= */
    getAdsHomeExpertAdviseRepliedQuestions: async (req, res, next) => {
        try {
            var result = await HealthExpertAdvice.aggregate([
                {
                    $match: {
                        category_id: mongoose.Types.ObjectId(req.params.categoryId),
                        isReplied: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        question: 1,
                        category_id: 1,
                        reply: 1,
                        repliedBy: 1,
                        isReplied: 1,
                    },
                },
            ]);

            if (result) {
                res.status(200).json({
                    status: true,
                    data: result,
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

    /*  Expert Advise Replied Question Based on health expert category Id
    ============================================= */
    getAdsHomeExpertAdviseRepliedQuestionsDetails: async (req, res, next) => {
        try {
            var result = await AdsHomeYogaFitnessExpert.aggregate([
                {
                    $match: {
                        adsType: "expertadvise",
                        isDisabled: false,
                    },
                },
                {
                    $lookup: {
                        from: "healthexperts",
                        localField: "subCategoryId",
                        foreignField: "_id",
                        as: "questions",
                    },
                },
                {
                    $unwind: "$questions",
                },
                {
                    $project: {
                        _id: 1,
                        question: "$questions.question",
                        userName: "$questions.userName",
                        userImage: { $concat: [imgPath, "$questions.userImage"] },
                        isReplied: "$questions.isReplied",
                        postedOn: { $dateToString: { format: "%d-%m-%G", date: "$questions.createdAt" } },
                    },
                },
            ]);

            if (result) {
                res.status(200).json({
                    status: true,
                    data: result,
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

    /*  Ads Home Main Yoga , Sub Yoga - category Listing
    ============================================= */
    getAdsHomeYogaCategories: async (req, res, next) => {
        try {
            let resultMain = await FoliofitMasterYogaMainCategory.find({}, { title: 1 });
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

    /*  Ads Home Main Yoga , Sub Yoga - video Listing Based on ctegory id - not completed
    ============================================= */
    // getAdsHomeYogaVideosByCategoryId: async(req, res, next) => {
    //     try {
    //         let categoryId = req.params.categoryId;
    //         let result = []
    //         resultMain = await FoliofitMasterYogaMainCategory.findOne({ _id: mongoose.Types.ObjectId(categoryId) },
    //         {videos:1});
    //         resultOther = await FoliofitMasterYogaHealthyRecommended.findOne({ _id: mongoose.Types.ObjectId(categoryId) },{videos:1});

    //         if(resultMain){
    //             result = resultMain
    //         }else{
    //            result = resultOther
    //         }
    //         if(result){
    //             res.status(200).json({
    //                 status: true,
    //                 data: result,
    //             });
    //         }
    //         else{
    //             res.status(200).json({
    //                 status: false,
    //                 data: "Please Check the category Id",
    //             });
    //         }

    //     } catch (error) {
    //         next(error);
    //     }
    // },

    /*  Ads Home Main Fitness , Sub Fitness  - category Listing
    ============================================= */
    getAdsHomeFitnessCategories: async (req, res, next) => {
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




     // Get All Listing in sub category in healthcare
     getSubCatgoryHealthcare: async (req, res, next) => {
        try {
          
            let categories = await MasterSubCategoryHealthcare.find(
                { isDisabled: false },
                {
                    title:1,
                    image: { $concat: [imgPath, "$image"] },
                }
                ).lean();
          
            res.status(200).json({
                status: true,
                message: "success",
                data: categories,
            });
        } catch (error) {
            next(error);
        }
    },

    // Get All Listing in sub category and sub sub category in healthcare
    getSubAndSubSubCatgoryHealthcare: async (req, res, next) => {
        try {    
            let subCategories = await MasterSubCategoryHealthcare.find(
                {  isDisabled: false },
                {
                    title: 1,
                }
            ).lean();
           // console.log("sub cat health:", subCategories);

            for (let item of subCategories) {
                let isSubSubCategory = true
                let subCategories = await MasterSubSubCategoryHealthcare.find(
                { subCategoryId: mongoose.Types.ObjectId(item._id),isDisabled: false },
                {
                    title: 1,
                }
                ).lean();
                
                if(subCategories.length==0){
                    isSubSubCategory = false
                }

                item.isSubSubCategory = isSubSubCategory
               
                item.subCategories = subCategories;
            }

           // console.log("main cat health last:", subCategories);

            return res.status(200).json({
                status: true,
                message: "success",
                data: {
                categories: subCategories,
                },
            });
        
        
        
        } catch (error) {
            next(error);
        }
    },

    
     // Get All Listing in main , sub category and sub sub category in healthcare
     getMainSubAndSubSubCatgoryHealthcare: async (req, res, next) => {
        try {    
            let mainCategories = await MasterCategory.find(
                { categoryType: categoryTypeHealth, isDisabled: false },
                {
                    title: 1,
                }
            ).lean();
           // console.log("main cat health:", mainCategories);
    
            for (let item of mainCategories) {
                let isSubCategory = true
                let subCategories = await MasterSubCategoryHealthcare.find(
                {  isDisabled: false,categoryId: mongoose.Types.ObjectId(item._id) },
                {
                    title: 1,
                }
                ).lean();
                if(subCategories.length==0) isSubCategory = false    
                for (let i of subCategories) {                      
                    let subSubCategoryHealthcare =
                    await MasterSubSubCategoryHealthcare.find(
                    { isDisabled: false, subCategoryId: mongoose.Types.ObjectId(i._id) },
                    {
                        title: 1,
                    }
                    );
                    if(subCategories.length==0) {
                        isSubSubCategory = false
                    }else{
                        isSubSubCategory = true

                    }
                    if (subSubCategoryHealthcare.length) {
                        i.subSubCategories = subSubCategoryHealthcare;
                    }
                    i.isSubSubCategory = isSubSubCategory
                }
               
                item.isSubCategory = isSubCategory
                item.subCategories = subCategories;
            }    
            //console.log("main cat health last:", mainCategories);
    
            return res.status(200).json({
                status: true,
                message: "success",
                data: {
                categories: mainCategories,
                },
            });
        
           
        
          } catch (error) {
            next(error);
          }
     },


    // Get All active product listing
    getAllActiveProducts: async (req, res, next) => {
        try {
            let products = await Inventory.find(
                { isDisabled: false, type: categoryTypeHealth},
                {
                    title: "$name"
                }
                ).lean();

            
            res.status(200).json({
                status: true,
                message: "success",
                data: products,
            });
        } catch (error) {
            next(error);
        }
    },

    // Get All product Listing by category id in healthcare
    getAllActiveProductsByCategoryId: async (req, res, next) => {
        try {
            console.log(req.params.categoryId)
            let products = await Inventory.find(
                { isDisabled: false, type: categoryTypeHealth , 
                  //categories: req.params.categoryId
                    categories: { $in: req.params.categoryId }
                },
                {
                    title: "$name"                   
                }
                ).lean();

            
            res.status(200).json({
                status: true,
                message: "success",
                data: products,
            });
        } catch (error) {
            next(error);
        }
    },



     // Get All Listing in sub category in healthcare
     getInventoryCategories: async (req, res, next) => {
        try {
            let type ="healthcare"
            let mainCategories = await MasterCategory.find(
                { categoryType: type },
                {
                  title: 1,
                }
              ).lean();
             
    
              let allHealthCareCategories = [];
    
              for (let item of mainCategories) {
                let subCategories = await MasterSubCategoryHealthcare.find(
                  { categoryId: mongoose.Types.ObjectId(item._id) },
                  {
                    title: 1,
                  }
                ).lean();
    
                for (let i of subCategories) {
                  let subSubCategoryHealthcare =
                    await MasterSubSubCategoryHealthcare.find(
                      { subCategoryId: mongoose.Types.ObjectId(i._id) },
                      {
                        title: 1,
                      }
                    );
    
                  if (subSubCategoryHealthcare.length) {
                    i.subCategories = subSubCategoryHealthcare;
                    allHealthCareCategories = allHealthCareCategories.concat(
                      subSubCategoryHealthcare
                    );
                  } else {
                    allHealthCareCategories.push(i);
                  }
                }
    
                item.subCategories = subCategories;
              }
    
          
            res.status(200).json({
                status: true,
                message: "success",
                data: allHealthCareCategories,
            });
        } catch (error) {
            next(error);
        }
    },





};
