const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

const sizeOf = require("image-size");
const AdsFoliofitSlider1 = require("../../models/ads/foliofit/slider1");
const AdsFoliofitSlider2 = require("../../models/ads/foliofit/slider2");
const AdsFoliofitSlider3 = require("../../models/ads/foliofit/slider3");
const AdsFoliofitBanner = require("../../models/ads/foliofit/banner");
const AdsFoliofitAd1Slider = require("../../models/ads/foliofit/ad1slider");

const AdsFoliofitMainCategory = require("../../models/ads/foliofit/mainCategory");

const foliofitWeeklyWorkout = require("../../models/foliofit/foliofitMasterWeekly");
const FoliofitMasterFitnessMainHomeFullbodyHealthy = require("../../models/foliofit/foliofitMasterFitnessHomeFullbodyHealthy");


const FoliofitMasterYogaMainCategory = require("../../models/foliofit/foliofitMasterYogaMain");
const FoliofitMasterYogaHealthyRecommended = require("../../models/foliofit/foliofitMasterYogaHealthyRecommended");
const FoliofitMasterYogaWeekly = require("../../models/foliofit/foliofitMasterYogaWeekly");

// const ProCategory = require("../../models/proCategory");
// const Product = require("../../models/Product");

const fitness = "fitness";
const yoga = "yoga";
const nutrichart = "nutrichart";
var imageType 
var imageTypeSlider1 = "slider1";
var imageError 

const imgPath = process.env.BASE_URL;

function checkImageSize(imageTypes, fileInfo) {
    imageError = "false";
    
       let dimensions = sizeOf(fileInfo.path);
    
    if (imageTypes == imageTypeSlider1) {
        if (dimensions.width != 1376 || dimensions.height != 675) {
            imageError = "Please upload image of size 1376 * 675";
        }
    } 
     if (imageTypes == "slider2") {
        if (dimensions.width != 1047 || dimensions.height != 359) {
            imageError = "Please upload image of size 1047 * 359";
        }
    } 
     if (imageTypes == "slider3") {
        if (dimensions.width != 333 || dimensions.height != 321) {
            imageError = "Please upload image of size 333 * 321";
        }
    } 
     if (imageTypes == "ad1") {
        if (dimensions.width != 1500 || dimensions.height != 525) {
            imageError = "Please upload image of size 1500 * 525";
        }
    } 
     if (imageTypes == "fitnessclubbanner") {
        if (dimensions.width != 1330 || dimensions.height != 388) {
            imageError = "Please upload image of size 1330 * 388";
        }
    } 
     if (imageTypes == "fitnessclubslider") {
        if (dimensions.width != 1047 || dimensions.height != 359) {
            imageError = "Please upload image of size 1047 * 359";
        }
    } 
     if (imageTypes == "yogabanner") {
        if (dimensions.width != 1330 || dimensions.height != 388) {
            imageError = "Please upload image of size 1330 * 388";
        }
    } 
     if (imageTypes == "yogaslider") {
        if (dimensions.width != 1047 || dimensions.height != 359) {
            imageError = "Please upload image of size 1047 * 359";
        }
    } 
     if (imageTypes == "nutrichart") {
        if (dimensions.width != 1330 || dimensions.height != 388) {
            imageError = "Please upload image of size 1330 * 388";
        }
    } 
    if (imageTypes == "maincategory") {
        if (dimensions.width != 203 || dimensions.height != 203) {
            imageError = "Please upload image of size 203 * 203";
        }
    }  
    if (imageError != "false") {
        imageSizeError(fileInfo);
    }
}

function imageSizeError(fileInfo) {
    fs.unlink(fileInfo.path, (err) => {
        if (err) throw err;
    });
}

module.exports = {


    /* Ads Foiliofit Slider1 
    ============================================= */
    addAdsFoliofitSlider1: async (req, res, next) => {
        try {
            let data = req.body;
            console.log('data',data)
            // let existingSlider = await AdsFoliofitSlider1.findOne({
            //     categoryId: data.categoryId,
            //     subCategoryId: data.subCategoryId,
            // });
            // if (!existingSlider) {
                if (req.file) {
                    var fileInfo = req.file;
                    imageType = imageTypeSlider1;
                    await checkImageSize(imageType, fileInfo);
                    if (imageError != "false") {
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                    } else {
                        data.image = `ads/${req.file.filename}`;
                        data.createdBy = req.user.id
                        let schemaObj = new AdsFoliofitSlider1(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Slider1 added successfully",
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
            // } else {
            //     if (req.file) {
            //         await unlinkAsync(req.file.path);
            //     }
            //     res.status(200).json({
            //         status: false,
            //         data: "Slider already existing  under this category & subcategory",
            //     });
            // }
        } catch (error) {
            next(error);
        }
    },
    getAdsFoliofitSlider1: async (req, res, next) => {
        try {
            let result = await AdsFoliofitSlider1.find(
                { isDisabled: false },
                {
                    type: 1,
                    redirectTo: 1,
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
    editAdsFoliofitSlider1: async (req, res, next) => {
        try {
            let data = req.body;
            if (data.sliderId) {
                let slider = await AdsFoliofitSlider1.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });
                if (slider) {
                    if (req.file) {
                        var fileInfo = req.file;
                        imageType = imageTypeSlider1;
                        checkImageSize(imageType, fileInfo);
                        if (imageError == "false") {
                            data.image = `ads/${req.file.filename}`;                           
                            // deleting old image
                            let splittedImageRoute = slider.image.split("/");
                            let path = `./public/images/ads/${splittedImageRoute[1]}`;
                            if (fs.existsSync(path)) {
                                fs.unlink(path, function (err) {
                                    if (err) throw err;
                                    console.log("old image deleted!");
                                });
                            }
                        }
                    }
                    if (imageError == "false") {
                        data.updatedAt = new Date();
                        data.updatedBy = req.user.id
                        AdsFoliofitSlider1.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                        if (req.file) {
                            await unlinkAsync(req.file.path);
                        }
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
    deleteAdsFoliofitSlider1: async (req, res, next) => {
        try {
            let slider = await AdsFoliofitSlider1.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsFoliofitSlider1.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = slider.image.split("/");
                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: "Slider removed successfully",
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
    getAdsFoliofitSlider1ById: async (req, res, next) => {
        try {
            let result = await AdsFoliofitSlider1.findOne(
                {
                    _id: mongoose.Types.ObjectId(req.params.id)
                },
                {
                    type: 1,
                    redirectTo: 1,
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


    /* Ads Foiliofit Slider2
    ============================================= */
    addAdsFoliofitSlider2: async (req, res, next) => {
        try {
            let data = req.body;
            // let existingSlider = await AdsFoliofitSlider2.findOne({
            //     categoryId: data.categoryId,
            //     subCategoryId: data.subCategoryId,
            // });
            // if (!existingSlider) {

            if (req.file) {
                var fileInfo = req.file;
                imageType = "slider2";
                checkImageSize(imageType, fileInfo);
                if (imageError != "false") {
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                    imageError = "false";
                } else {
                    data.image = `ads/${req.file.filename}`;
                    data.createdBy = req.user.id
                    let schemaObj = new AdsFoliofitSlider2(data);
                    schemaObj
                        .save()
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "Slider2 added successfully",
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
            // } else {
            //     if (req.file) {
            //         await unlinkAsync(req.file.path);
            //     }
            //     res.status(200).json({
            //         status: false,
            //         data: "Slider already existing  under this category & subcategory",
            //     });
            // }
        } catch (error) {
            next(error);
        }
    },
    getAdsFoliofitSlider2: async (req, res, next) => {
        try {
            let result = await AdsFoliofitSlider2.find(
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
    editAdsFoliofitSlider2: async (req, res, next) => {
        try {
            let data = req.body;
            if (data.sliderId) {
                let slider = await AdsFoliofitSlider2.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });

                if (slider) {
                    data.image = slider.image
                    if (req.file) {
                        var fileInfo = req.file;
                        imageType = "slider2";
                        checkImageSize(imageType, fileInfo);
                        if (imageError == "false") {
                            data.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = slider.image.split("/");
                            let path = `./public/images/ads/${splittedImageRoute[1]}`;
                            if (fs.existsSync(path)) {
                                fs.unlink(path, function (err) {
                                    if (err) throw err;
                                });
                            }
                        }
                    }
                    if (imageError == "false") {
                        data.updatedAt = new Date();
                        data.updatedBy = req.user.id
                        AdsFoliofitSlider2.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
    deleteAdsFoliofitSlider2: async (req, res, next) => {
        try {
            let slider = await AdsFoliofitSlider2.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsFoliofitSlider2.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = slider.image.split("/");
                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }
                        res.status(200).json({
                            status: true,
                            data: "Slider removed successfully",
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
    getAdsFoliofitSlider2ById: async (req, res, next) => {
        try {
            var result = await AdsFoliofitSlider2.aggregate([
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

            if (!result.length) {
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

    /* Ads Foiliofit Slider3
    ============================================= */
    addAdsFoliofitSlider3: async (req, res, next) => {
        try {
            let data = req.body;

            // let existingSlider = await AdsFoliofitSlider3.findOne({
            //     categoryId: data.categoryId,
            // });
            // if (!existingSlider) {
            if (req.file) {
                var fileInfo = req.file;
                imageType = "slider3";
                checkImageSize(imageType, fileInfo);
                if (imageError != "false") {
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                    imageError = "false";
                } else {
                    data.image = `ads/${req.file.filename}`;
                    let schemaObj = new AdsFoliofitSlider3(data);
                    schemaObj
                        .save()
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "Slider3 added successfully",
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
            // } else {
            //     if (req.file) {
            //         await unlinkAsync(req.file.path);
            //     }
            //     res.status(200).json({
            //         status: false,
            //         data: "Slider already existing  under this category",
            //     });
            // }
        } catch (error) {
            next(error);
        }
    },
    getAdsFoliofitSlider3: async (req, res, next) => {
        try {
            let result = await AdsFoliofitSlider3.find(
                { isDisabled: false },
                {
                    productId: 1,
                    image: { $concat: [imgPath, "$image"] },
                }
            )
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    editAdsFoliofitSlider3: async (req, res, next) => {
        try {
            let data = req.body;
            if (data.sliderId) {
                let slider = await AdsFoliofitSlider3.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });
                if (slider) {
                    data.image = slider.image
                    if (req.file) {
                        var fileInfo = req.file;
                        imageType = "slider3";
                        checkImageSize(imageType, fileInfo);
                        if (imageError == "false") {
                            data.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = slider.image.split("/");
                            let path = `./public/images/ads/${splittedImageRoute[1]}`;
                            if (fs.existsSync(path)) {
                                fs.unlink(path, function (err) {
                                    if (err) throw err;
                                });
                            }
                        }
                    }
                    if (imageError == "false") {
                        data.updatedAt = new Date();
                        AdsFoliofitSlider3.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
    deleteAdsFoliofitSlider3: async (req, res, next) => {
        try {
            let slider = await AdsFoliofitSlider3.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsFoliofitSlider3.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = slider.image.split("/");
                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                            });
                        }
                        res.status(200).json({
                            status: true,
                            data: "Slider removed successfully",
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
    getAdsFoliofitSlider3ById: async (req, res, next) => {
        try {       
            
            var result = await AdsFoliofitSlider3.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.params.id)
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
                    $project: {
                        _id: 1,
                        productId: 1,
                        image: { $concat: [imgPath, "$image"] },
                        productName:   { $first: "$product.name"}
                    },
                },
                ]);

            if (!result.length) {
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

    /* Ads Foiliofit Fitness Club Banner
    ============================================= */

    getAdsFoliofitFitnessClubBanner: async (req, res, next) => {
       
        try {
            let result = await AdsFoliofitBanner.find(
                { bannerType: fitness, isDisabled: false },
                {
                    categoryId: 1,
                    image: { $concat: [imgPath, "$image"] },
                    bannerType: 1,
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
    editAdsFoliofitFitnessClubBanner: async (req, res, next) => {
        try {
            imageError = "false"
            let data = req.body;
            let existingBanner = await AdsFoliofitBanner.findOne({
                bannerType: fitness,
            });
            if (existingBanner) {
                if (data.bannerId) {
                    let banner = await AdsFoliofitBanner.findOne({ _id: mongoose.Types.ObjectId(data.bannerId) });

                    if (banner) {
                        data.image = banner.image
                        if (req.file) {
                            var fileInfo = req.file;
                            imageType = "fitnessclubbanner";
                            //checkImageSize(imageType, fileInfo);
                            if (imageError == "false") {
                                data.image = `ads/${req.file.filename}`;
                                // deleting old image
                                let splittedImageRoute = banner.image.split("/");
                                let path = `./public/images/ads/${splittedImageRoute[1]}`;
                                if (fs.existsSync(path)) {
                                    fs.unlink(path, function (err) {
                                        if (err) throw err;
                                    });
                                }
                            }
                        }
                        if (imageError == "false") {
                            data.updatedAt = new Date();
                            AdsFoliofitBanner.updateOne({ _id: mongoose.Types.ObjectId(data.bannerId) }, data)
                                .then((response) => {
                                    if (response.nModified == 1) {
                                        res.status(200).json({
                                            status: true,
                                            data: "Updated successfully",
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
                            data: "invalid Banner Id",
                        });
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: "Please enter Banner Id",
                    });
                }
            } else {
                if (req.file) {
                    var fileInfo = req.file;
                    imageType = "fitnessclubbanner";
                   // checkImageSize(imageType, fileInfo);
                    if (imageError != "false") {
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                       
                    } else {
                        data.image = `ads/${req.file.filename}`;
                        data.bannerType = fitness;
                        let schemaObj = new AdsFoliofitBanner(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Banner added successfully",
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
            }
        } catch (error) {
            next(error);
        }
    },
    getAdsFoliofitFitnessClubBannerById: async (req, res, next) => {
        try {         
            let  result = await AdsFoliofitBanner.findOne(
                {
                    bannerType: fitness,_id: mongoose.Types.ObjectId(req.params.id)
                },
                {
                    categoryId: 1,
                    image: { $concat: [imgPath, "$image"] },                   
                }
            ).lean();
            if (!result) {
                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
                });
            } else {
                let category 
                let resultMain = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne({_id:result.categoryId})
                if(resultMain) category = resultMain
                let resultOther= await foliofitWeeklyWorkout.findOne({_id:result.categoryId})
                if(resultOther) category = resultOther
                if(category){
                    result.categoryName = category.title
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
    deleteAdsFoliofitFitnessClubBanner: async (req, res, next) => {
        try {
            let slider = await AdsFoliofitBanner.findOne({ _id: mongoose.Types.ObjectId(req.params.id),bannerType: fitness});

            if (slider) {
                AdsFoliofitBanner.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = slider.image.split("/");
                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                            });
                        }
                        res.status(200).json({
                            status: true,
                            data: "Slider removed successfully",
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

    /* Ads Foiliofit Yoga Banner
    ============================================= */

    getAdsFoliofitYogaBanner: async (req, res, next) => {
        try {
            let result = await AdsFoliofitBanner.find(
                { bannerType: yoga, isDisabled: false },
                {
                    categoryId: 1,
                    image: { $concat: [imgPath, "$image"] },
                    bannerType: 1,
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
    getAdsFoliofitYogaBannerById: async (req, res, next) => {
        try {
            let result = await AdsFoliofitBanner.findOne(
                {
                    bannerType: yoga,_id: mongoose.Types.ObjectId(req.params.id)
                },
                {
                    categoryId: 1,
                    image: { $concat: [imgPath, "$image"] },
                }
            ).lean();

            if (!result) {
                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
                });
            } else {
                let category 
                let resultMain = await FoliofitMasterYogaMainCategory.findOne({_id:result.categoryId})
                if(resultMain) category = resultMain
                let resultOther= await FoliofitMasterYogaHealthyRecommended.findOne({_id:result.categoryId})
                if(resultOther) category = resultOther
                let resultWeekly= await FoliofitMasterYogaWeekly.findOne({_id:result.categoryId})
                if(resultWeekly) category = resultWeekly
                if(category){
                    result.categoryName = category.title
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
    editAdsFoliofitYogaBanner: async (req, res, next) => {
        try {
            let data = req.body;

            if (data.bannerId) {
                let banner = await AdsFoliofitBanner.findOne({ _id: mongoose.Types.ObjectId(data.bannerId) });

                if (banner) {
                    if (req.file) {
                        var fileInfo = req.file;
                        imageType = "yogabanner";
                        checkImageSize(imageType, fileInfo);
                        if (imageError == "false") {
                            data.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = banner.image.split("/");
                            let path = `./public/images/ads/${splittedImageRoute[1]}`;
                            if (fs.existsSync(path)) {
                                fs.unlink(path, function (err) {
                                    if (err) throw err;
                                    console.log("old image deleted!");
                                });
                            }
                        }
                    }
                    if (imageError == "false") {
                        data.updatedAt = new Date();
                        data.updatedBy = req.user.id
                        AdsFoliofitBanner.updateOne({ _id: mongoose.Types.ObjectId(data.bannerId) }, data)
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
                        data: "invalid Banner Id",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter Banner Id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    addAdsFoliofitYogaBanner: async (req, res, next) => {
        try {
            let data = req.body;
            let existingBanner = await AdsFoliofitBanner.findOne({
                bannerType: yoga,
            });
            if (existingBanner) {
                res.status(200).json({
                    status: true,
                    data: "Banner already exist",
                });
            } else {
                if (req.file) {
                    var fileInfo = req.file;
                    imageType = "yogabanner";
                    checkImageSize(imageType, fileInfo);
                    if (imageError != "false") {
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    } else {
                        data.image = `ads/${req.file.filename}`;
                        data.bannerType = yoga;
                        data.createdBy = req.user.id
                        let schemaObj = new AdsFoliofitBanner(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Banner added successfully",
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
            }
        } catch (error) {
            next(error);
        }
    },
    deleteAdsFoliofitYogaBanner: async (req, res, next) => {
        try {
            let slider = await AdsFoliofitBanner.findOne({ _id: mongoose.Types.ObjectId(req.params.id),bannerType: yoga });

            if (slider) {
                AdsFoliofitBanner.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = slider.image.split("/");
                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                            });
                        }
                        res.status(200).json({
                            status: true,
                            data: "Slider removed successfully",
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


    /* Ads Foiliofit Fitnessclub Slider
    ============================================= */
    addAdsFoliofitFitnessClubSlider: async (req, res, next) => {
        try {
            let data = req.body;
            // let existingSlider = await AdsFoliofitAd1Slider.findOne({
            //     categoryId: data.categoryId,
            //     subCategoryId: data.subCategoryId,
            //     sliderType: fitness,
            // });
            // if (!existingSlider) {
            if (req.file) {
                var fileInfo = req.file;
                imageType = "fitnessclubslider";
                checkImageSize(imageType, fileInfo);
                if (imageError != "false") {
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                    imageError = "false";
                } else {
                    data.image = `ads/${req.file.filename}`;
                    data.sliderType = fitness;
                    let schemaObj = new AdsFoliofitAd1Slider(data);
                    schemaObj
                        .save()
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "Fitness Club slider added successfully",
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
            // } else {
            //     if (req.file) {
            //         await unlinkAsync(req.file.path);
            //     }
            //     res.status(200).json({
            //         status: false,
            //         data: "Slider already existing  under this category & subcategory",
            //     });
            // }
        } catch (error) {
            next(error);
        }
    },
    getAdsFoliofitFitnessClubSlider: async (req, res, next) => {
        try {
            let result = await AdsFoliofitAd1Slider.find(
                { sliderType: fitness, isDisabled: false },
                {
                    type: 1,
                    typeId: 1,
                    image: { $concat: [imgPath, "$image"] },
                    sliderType: 1,
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
    editAdsFoliofitFitnessClubSlider: async (req, res, next) => {
        try {
            let data = req.body;
            if (data.sliderId) {
                let slider = await AdsFoliofitAd1Slider.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });
                if (slider) {
                    data.image = slider.image
                    if (req.file) {
                        data.image = `ads/${req.file.filename}`;
                        // deleting old image
                        let splittedImageRoute = slider.image.split("/");
                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }
                    }

                    data.updatedAt = new Date();
                    AdsFoliofitAd1Slider.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
    deleteAdsFoliofitFitnessClubSlider: async (req, res, next) => {
        try {
            let slider = await AdsFoliofitAd1Slider.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            if (slider) {
                AdsFoliofitAd1Slider.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = slider.image.split("/");
                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: "Fitness Club slider removed successfully",
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
    getAdsFoliofitFitnessClubSliderById: async (req, res, next) => {
        try {       
            var result = await AdsFoliofitAd1Slider.aggregate([
                {
                    $match: {
                        sliderType: fitness, _id: mongoose.Types.ObjectId(req.params.id)
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
                        typeName: { $ifNull: [  { $first: "$subCategory.title"}, { $first: "$product.name" }] }
                    },
                },
                ]);
            if (!result.length) {
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

    /* Ads Foiliofit Yoga Slider
    ============================================= */
    addAdsFoliofitYogaSlider: async (req, res, next) => {
        try {
            let data = req.body;
            // let existingSlider = await AdsFoliofitAd1Slider.findOne({
            //     categoryId: data.categoryId,
            //     subCategoryId: data.subCategoryId,
            //     sliderType: yoga,
            // });
            // if (!existingSlider) {
            if (req.file) {
                var fileInfo = req.file;
                imageType = "yogaslider";
                checkImageSize(imageType, fileInfo);
                if (imageError != "false") {
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                    imageError = "false";
                } else {
                    data.image = `ads/${req.file.filename}`;
                    data.sliderType = yoga;
                    data.createdBy =req.user.id
                    let schemaObj = new AdsFoliofitAd1Slider(data);
                    schemaObj
                        .save()
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "Yoga slider added successfully",
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
            // } else {
            //     if (req.file) {
            //         await unlinkAsync(req.file.path);
            //     }
            //     res.status(200).json({
            //         status: false,
            //         data: "Slider already existing  under this category & subcategory",
            //     });
            // }
        } catch (error) {
            next(error);
        }
    },
    getAdsFoliofitYogaSlider: async (req, res, next) => {
        try {
            let result = await AdsFoliofitAd1Slider.find(
                { sliderType: yoga, isDisabled: false },
                {
                    type: 1,
                    typeId: 1,
                    image: { $concat: [imgPath, "$image"] },
                    sliderType: 1,
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
    getAdsFoliofitYogaSliderById: async (req, res, next) => {
        try {
            // let result = await AdsFoliofitAd1Slider.findOne(
            //     {
            //         sliderType: yoga,_id: mongoose.Types.ObjectId(req.params.id)
            //     },
            //     {
            //         type: 1,
            //         typeId:1,
            //         image: { $concat: [imgPath, "$image"] },
            //     }
            // ).lean();
            var result = await AdsFoliofitAd1Slider.aggregate([
                {
                    $match: {
                        sliderType: yoga, _id: mongoose.Types.ObjectId(req.params.id)
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
                        typeName: { $ifNull: [  { $first: "$subCategory.title"}, { $first: "$product.name" }] }
                    },
                },
                ]);

            if (!result.length) {
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
    editAdsFoliofitYogaSlider: async (req, res, next) => {
        try {
            let data = req.body;
            if (data.sliderId) {
                let slider = await AdsFoliofitAd1Slider.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });

                if (slider) {
                    data.image = slider.image
                    if (req.file) {
                        var fileInfo = req.file;
                        imageType = "yogaslider";
                        checkImageSize(imageType, fileInfo);
                        if (imageError == "false") {
                            data.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = slider.image.split("/");
                            console.log("splitted::", splittedImageRoute);
                            let path = `./public/images/ads/${splittedImageRoute[1]}`;
                            if (fs.existsSync(path)) {
                                fs.unlink(path, function (err) {
                                    if (err) throw err;
                                    console.log("old image deleted!");
                                });
                            }
                        }
                    }
                    if (imageError == "false") {
                        data.updatedAt = new Date();
                        data.updatedBy =req.user.id
                        AdsFoliofitAd1Slider.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                    }else{
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
    deleteAdsFoliofitYogaSlider: async (req, res, next) => {
        try {
            let slider = await AdsFoliofitAd1Slider.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsFoliofitAd1Slider.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = slider.image.split("/");

                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: "Yoga slider removed successfully",
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

    /* Ads Foiliofit Ad1
    ============================================= */
    getAdsFoliofitAd1: async (req, res, next) => {
        try {
            let result = await AdsFoliofitAd1Slider.find(
                { sliderType: "ad1", isDisabled: false },
                {
                    type: 1,
                    typeId: 1,
                    image: { $concat: [imgPath, "$image"] },
                    sliderType: 1,
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
    editAdsFoliofitAd1: async (req, res, next) => {
        try {
            let data = req.body;

            let existingAd1 = await AdsFoliofitAd1Slider.findOne({
                sliderType: "ad1",
            });
            if (existingAd1) {
                if (data.sliderId) {
                    let slider = await AdsFoliofitAd1Slider.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });

                    if (slider) {
                        data.image = slider.image
                        if (req.file) {
                            data.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = slider.image.split("/");
                            let path = `./public/images/ads/${splittedImageRoute[1]}`;
                            if (fs.existsSync(path)) {
                                fs.unlink(path, function (err) {
                                    if (err) throw err;
                                });
                            }
                        }
                        data.updatedAt = new Date();
                        AdsFoliofitAd1Slider.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                        await unlinkAsync(req.file.path);
                    }
                    res.status(200).json({
                        status: false,
                        data: "Ad1 already exist",
                    });
                }
            } else {
                if (req.file) {
                    var fileInfo = req.file;
                    imageType = "ad1";
                    checkImageSize(imageType, fileInfo);
                    if (imageError != "false") {
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    } else {
                        data.image = `ads/${req.file.filename}`;
                        data.sliderType = "ad1";
                        let schemaObj = new AdsFoliofitAd1Slider(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Ad 1 added successfully",
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
            }
        } catch (error) {
            next(error);
        }
    },
    getAdsFoliofitAd1ById: async (req, res, next) => {
        try {
            var result = await AdsFoliofitAd1Slider.aggregate([
                {
                    $match: {
                        sliderType: "ad1", _id: mongoose.Types.ObjectId(req.params.id)
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

            if (!result.length) {
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
    deleteAdsFoliofitAd1: async (req, res, next) => {
        try {
            let slider = await AdsFoliofitAd1Slider.findOne({ sliderType: "ad1",_id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsFoliofitAd1Slider.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = slider.image.split("/");

                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }

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
                    data: "invalid id",
                });
            }
        } catch (error) {
            next(error);
        }
    },


    /* Ads Foiliofit Nutrichart Banner
    ============================================= */
    getAdsFoliofitNutrichartBanner: async (req, res, next) => {
        try {
            let result = await AdsFoliofitBanner.find(
                { bannerType: nutrichart, isDisabled: false },
                {
                    categoryId: 1,
                    image: { $concat: [imgPath, "$image"] },
                    bannerType: 1,
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
    getAdsFoliofitNutrichartBannerById: async (req, res, next) => {
        try {
            let result = await AdsFoliofitBanner.findOne(
                {
                    bannerType: nutrichart,_id: mongoose.Types.ObjectId(req.params.id)
                },
                {
                    categoryId: 1,
                    image: { $concat: [imgPath, "$image"] },
                    bannerType: 1,
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
    editAdsFoliofitNutrichartBanner: async (req, res, next) => {
        try {
            let data = req.body;

            if (data.bannerId) {
                let banner = await AdsFoliofitBanner.findOne({ _id: mongoose.Types.ObjectId(data.bannerId) });

                if (banner) {
                    data.image = banner.image
                    if (req.file) {
                        var fileInfo = req.file;
                        imageType = "nutrichart";
                        checkImageSize(imageType, fileInfo);
                        if (imageError == "false") {
                            data.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = banner.image.split("/");
                            let path = `./public/images/ads/${splittedImageRoute[1]}`;
                            if (fs.existsSync(path)) {
                                fs.unlink(path, function (err) {
                                    if (err) throw err;
                                    console.log("old image deleted!");
                                });
                            }
                        }
                    }
                    if (imageError == "false") {
                        data.updatedAt = new Date();
                        AdsFoliofitBanner.updateOne({ _id: mongoose.Types.ObjectId(data.bannerId) }, data)
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
                        data: "invalid Banner Id",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter Banner Id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    addAdsFoliofitNutrichartBanner: async (req, res, next) => {
        try {
            let data = req.body;
            let existingBanner = await AdsFoliofitBanner.findOne({
                bannerType: nutrichart,
            });
            if (existingBanner) {
                res.status(200).json({
                    status: true,
                    data: "Banner already exist",
                });
            } else {
                if (req.file) {
                    var fileInfo = req.file;
                    imageType = "nutrichart";
                    checkImageSize(imageType, fileInfo);
                    if (imageError != "false") {
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    } else {
                        data.image = `ads/${req.file.filename}`;
                        data.bannerType = nutrichart;
                        let schemaObj = new AdsFoliofitBanner(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Banner added successfully",
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
            }
        } catch (error) {
            next(error);
        }
    },
    deleteAdsFoliofitNutrichartBanner: async (req, res, next) => {
        try {
            let slider = await AdsFoliofitBanner.findOne({ bannerType: nutrichart,_id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsFoliofitBanner.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = slider.image.split("/");

                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: " Banner removed successfully",
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



     /* Ads Foiliofit Main Category 
    ============================================= */
    addAdsFoliofitMainCategory: async (req, res, next) => {
        try {
            let data = req.body;
            console.log('data',data)          
            if (req.file) {
                var fileInfo = req.file;
                imageType = "maincategory";
                await checkImageSize(imageType, fileInfo);
                if (imageError != "false") {
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                } else {
                    data.image = `ads/${req.file.filename}`;
                    data.createdBy = req.user.id
                    let schemaObj = new AdsFoliofitMainCategory(data);
                    schemaObj
                        .save()
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "Main Category added successfully",
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
    getAdsFoliofitMainCategory: async (req, res, next) => {
        try {
            let result = await AdsFoliofitMainCategory.find(
                { isDisabled: false },
                {
                   
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
    editAdsFoliofitMainCategory: async (req, res, next) => {
        try {
            console.log(req.body)
            let data = req.body;
            if (data.sliderId) {
                let slider = await AdsFoliofitMainCategory.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });
                if (slider) {
                    data.image = slider.image
                    if (req.file) {
                        var fileInfo = req.file;
                        imageType = "maincategory";
                        checkImageSize(imageType, fileInfo);
                        if (imageError == "false") {
                            data.image = `ads/${req.file.filename}`;                           
                            // deleting old image
                            let splittedImageRoute = slider.image.split("/");
                            let path = `./public/images/ads/${splittedImageRoute[1]}`;
                            if (fs.existsSync(path)) {
                                fs.unlink(path, function (err) {
                                    if (err) throw err;                                  
                                });
                            }
                        }
                    }
                    if (imageError == "false") {
                        data.updatedAt = new Date();
                        data.updatedBy = req.user.id
                        AdsFoliofitMainCategory.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                        if (req.file) {
                            await unlinkAsync(req.file.path);
                        }
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
    deleteAdsFoliofitMainCategory: async (req, res, next) => {
        try {
            let slider = await AdsFoliofitMainCategory.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsFoliofitMainCategory.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = slider.image.split("/");
                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: "Slider removed successfully",
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
    getAdsFoliofitMainCategoryById: async (req, res, next) => {
        try {
            let result = await AdsFoliofitMainCategory.findOne(
                {
                    _id: mongoose.Types.ObjectId(req.params.id)
                },
                {                   
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




    
    /* Dummy data apis for category
    ============================================= */
    getCategory: async (req, res, next) => {
        try {
            let categories = [
                {
                    _id: "611b97223abea62d2c6008a0",
                    name: "category 1",
                  
                },
                {
                    _id: "611b97233abea62d2c6008a3",
                    name: "category 2"
                    
                },
                {
                    _id: "61384ab18a5c3e115d841ba4",
                    name: "category 3"
                    
                },
                {
                    _id: "6130b1c8da000fd64c07835f",
                    name: "category 4"
                   
                },
              ];
              res.status(200).json({
                status: true,
                data: categories,
            });
        } catch (error) {
            next(error);
        }
    },

     
    /* Dummy data apis for products
    ============================================= */
    getProduct: async (req, res, next) => {
        try {
            let products = [
                {
                    _id: "61249389c300e191847401db",
                    name: "product 1",
                  
                },
                {
                    _id: "6124961b08f6169f7c842ebd",
                    name: "product 2"
                    
                },
                {
                    _id: "61249c51891634487c7ad793",
                    name: "product 3"
                    
                },
                {
                    _id: "6124ca08be6e918448d8902a",
                    name: "product 4"
                   
                },
              ];
              res.status(200).json({
                status: true,
                data: products,
            });
        } catch (error) {
            next(error);
        }
    },

};
