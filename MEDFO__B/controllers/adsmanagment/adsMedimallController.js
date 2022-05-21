const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const AdsMedimallSliderTopWishRecent = require("../../models/ads/medimall/sliderTopWishRecent");
const AdsMedimallMainCategory = require("../../models/ads/medimall/mainCategory");
const AdsMedimallTopCategories = require("../../models/ads/medimall/topCategories");
const AdsMedimallTopIconCatHealth = require("../../models/ads/medimall/topIconCatHealth");
const AdsMedimallGrooming = require("../../models/ads/medimall/grooming");

const ProCategory = require("../../models/proCategory");
const Product = require("../../models/Product");

const sizeOf = require("image-size");

const imgPath = process.env.BASE_URL;
var sliderType = "";
var medimallSlidersType = "";
var recentWishlistSliderType = "";
var imageCount = 0;
var imageError;
var dimensions = "";

const imageWishRecentCount = 1;
const topCategoryType = "topcategories";
const mainCategoryType = "maincategory";
const top3IconsPrescription = "top3IconsPrescription";

function checkTopIconCatHealthSliderType(sliderTypes, fileInfo) {
    sliderType = "error";
    imageError = "false";
    if (fileInfo) {
        dimensions = sizeOf(fileInfo.path);
    }
    if (sliderTypes == "top3icons") {
        if (dimensions.width != 558 && dimensions.height != 230) {
            imageError = "Please upload image of size 558 * 230";
        }
        sliderType = "top3icons";
        imageCount = 2;
    }
    if (sliderTypes == "top3iconsprescription") {
        if (dimensions.width != 784 && dimensions.height != 196) {
            imageError = "Please upload image of size 784 * 196";
        }
        sliderType = "top3iconsprescription";
        imageCount = 1;
    }

    if (sliderTypes == "6categories") {
        if (dimensions.width != 302 && dimensions.height != 340) {
            imageError = "Please upload image of size 302 * 340";
        }
        sliderType = "6categories";
        imageCount = 6;
    }
    if (sliderTypes == "healthcare") {
        if (dimensions.width != 786 && dimensions.height != 330) {
            imageError = "Please upload image of size 786 * 330";
        }
        sliderType = "healthcare";
        imageCount = 1;
    }
}

function checkMedimallSliderSliderType(medimallSliderTypes, fileInfo) {
    imageError = "false";
    medimallSlidersType = "error";
    if (fileInfo) {
        dimensions = sizeOf(fileInfo.path);
    }

    if (medimallSliderTypes == "slider1") {
        if (dimensions.width != 1504 && dimensions.height != 674) {
            imageError = "Please upload image of size 1504 * 674";
        }
        medimallSlidersType = "slider1";
    }
    if (medimallSliderTypes == "slider2") {
        if (dimensions.width != 628 && dimensions.height != 232) {
            imageError = "Please upload image of size 628 * 232";
        }
        medimallSlidersType = "slider2";
    }
    if (medimallSliderTypes == "slider3") {
        if (dimensions.width != 1082 && dimensions.height != 1082) {
            imageError = "Please upload image of size 1082 * 1082";
        }
        medimallSlidersType = "slider3";
    }
    if (medimallSliderTypes == "slider4") {
        if (dimensions.width != 290 && dimensions.height != 147) {
            imageError = "Please upload image of size 290 * 147";
        }
        medimallSlidersType = "slider4";
    }
    if (medimallSliderTypes == "slider5") {
        if (dimensions.width != 670 && dimensions.height != 280) {
            imageError = "Please upload image of size 670 * 280";
        }
        medimallSlidersType = "slider5";
    }
    if (medimallSliderTypes == "slider6") {
        if (dimensions.width != 2548 && dimensions.height != 1108) {
            imageError = "Please upload image of size 2548 * 1108";
        }
        medimallSlidersType = "slider6";
    }
    if (medimallSliderTypes == "slider7") {
        if (dimensions.width != 2548 && dimensions.height != 1108) {
            imageError = "Please upload image of size 2548 * 1108";
        }
        medimallSlidersType = "slider7";
    }
    if (medimallSliderTypes == "topdeals") {
        // if (dimensions.width != 176 && dimensions.height != 220) {
        //     imageError = "Please upload image of size 176 * 220";
        // }
        medimallSlidersType = "topdeals";
    }
}

function unlinkImage(fileInfo) {
    fs.unlink(fileInfo.path, (err) => {
        if (err) throw err;
    });
}

function checkMedimallRecentWishlistSliderType(medimallRecentWishlistTypes, fileInfo) {
    imageError = "false";
    recentWishlistSliderType = "error";
    if (fileInfo) {
        dimensions = sizeOf(fileInfo.path);
    }
    if (medimallRecentWishlistTypes == "wishlist") {
        if (dimensions.width != 1508 && dimensions.height != 630) {
            imageError = "Please upload image of size 1508 * 630";
        }
        recentWishlistSliderType = "wishlist";
    }
    if (medimallRecentWishlistTypes == "recentlyviewed") {
        if (dimensions.width != 789 && dimensions.height != 332) {
            imageError = "Please upload image of size 789 * 332";
        }
        recentWishlistSliderType = "recentlyviewed";
    }
}

function checkImageSize(imageTypes, fileInfo) {
    imageError = "false";
    if (fileInfo) {
        dimensions = sizeOf(fileInfo.path);
    }
    if (imageTypes == mainCategoryType) {
        if (dimensions.width != 1196 && dimensions.height != 1044) {
            imageError = "Please upload image of size 1196 * 1044";
        }
    }
    if (imageTypes == topCategoryType) {
        if (dimensions.width != 1228 && dimensions.height != 1228) {
            imageError = "Please upload image of size 1228 * 1228";
        }
    }
}

module.exports = {
    // /* Ads Medimall Slider1
    // ============================================= */
    // addAdsMedimallSlider1: async (req, res, next) => {
    //     try {
    //         let data = req.body;
    //         if (req.file) {
    //             data.image = `ads/${req.file.filename}`;
    //             data.sliderType = slider1;
    //             let schemaObj = new AdsMedimallSliderTopWishRecent(data);
    //             schemaObj
    //                 .save()
    //                 .then((response) => {
    //                     res.status(200).json({
    //                         status: true,
    //                         data: "Medimall slider1 added successfully",
    //                     });
    //                 })
    //                 .catch(async (error) => {
    //                     if (req.file) {
    //                         await unlinkAsync(req.file.path);
    //                     }
    //                     res.status(200).json({
    //                         status: false,
    //                         data: error,
    //                     });
    //                 });
    //         } else {
    //             res.status(200).json({
    //                 status: false,
    //                 data: "Please upload image",
    //             });
    //         }
    //     } catch (error) {
    //         next(error);
    //     }
    // },
    // getAdsMedimallSlider1: async (req, res, next) => {
    //     try {
    //         let result = await AdsMedimallSliderTopWishRecent.find({ sliderType: slider1 });
    //         res.status(200).json({
    //             status: true,
    //             data: result,
    //         });
    //     } catch (error) {
    //         next(error);
    //     }
    // },
    // editAdsMedimallSlider1: async (req, res, next) => {
    //     try {
    //         let data = req.body;
    //         if (data.sliderId) {
    //             let slider = await AdsMedimallSliderTopWishRecent.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });

    //             if (slider) {
    //                 if (req.file) {
    //                     data.image = `ads/${req.file.filename}`;
    //                     // deleting old image
    //                     let splittedImageRoute = slider.image.split("/");
    //                     console.log("splitted::", splittedImageRoute);
    //                     let path = `./public/images/ads/${splittedImageRoute[1]}`;
    //                     if (fs.existsSync(path)) {
    //                         fs.unlink(path, function (err) {
    //                             if (err) throw err;
    //                             console.log("old image deleted!");
    //                         });
    //                     }
    //                 }

    //                 data.updatedAt = new Date();
    //                 AdsMedimallSliderTopWishRecent.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
    //                     .then((response) => {
    //                         if (response.nModified == 1) {
    //                             res.status(200).json({
    //                                 status: true,
    //                                 data: "Updated successfully",
    //                             });
    //                         } else {
    //                             res.status(200).json({
    //                                 status: false,
    //                                 data: "Not updated",
    //                             });
    //                         }
    //                     })
    //                     .catch((error) => {
    //                         res.status(200).json({
    //                             status: false,
    //                             data: error,
    //                         });
    //                     });
    //             } else {
    //                 if (req.file) {
    //                     await unlinkAsync(req.file.path);
    //                 }
    //                 res.status(200).json({
    //                     status: false,
    //                     data: "invalid sliderId",
    //                 });
    //             }
    //         } else {
    //             res.status(200).json({
    //                 status: false,
    //                 data: "Please enter sliderId",
    //             });
    //         }
    //     } catch (error) {
    //         next(error);
    //     }
    // },
    // deleteAdsMedimallSlider1: async (req, res, next) => {
    //     try {
    //         let slider = await AdsMedimallSliderTopWishRecent.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

    //         if (slider) {
    //             AdsMedimallSliderTopWishRecent.deleteOne({ _id: req.params.id })
    //                 .then((response) => {
    //                     let splittedImageRoute = slider.image.split("/");

    //                     fs.unlink(`./public/images/ads/${splittedImageRoute[1]}`, function (err) {
    //                         if (err) throw err;
    //                     });

    //                     res.status(200).json({
    //                         status: true,
    //                         data: "Medimall slider1 removed successfully",
    //                     });
    //                 })
    //                 .catch((error) => {
    //                     res.status(200).json({
    //                         status: false,
    //                         data: error,
    //                     });
    //                 });
    //         } else {
    //             res.status(200).json({
    //                 status: false,
    //                 data: "invalid sliderId",
    //             });
    //         }
    //     } catch (error) {
    //         next(error);
    //     }
    // },

    // /* Ads Medimall Slider2
    // ============================================= */
    // addAdsMedimallSlider2: async (req, res, next) => {
    //     try {
    //         let data = req.body;
    //         if (req.file) {
    //             data.image = `ads/${req.file.filename}`;
    //             data.sliderType = slider2;
    //             let schemaObj = new AdsMedimallSliderTopWishRecent(data);
    //             schemaObj
    //                 .save()
    //                 .then((response) => {
    //                     res.status(200).json({
    //                         status: true,
    //                         data: "Medimall slider2 added successfully",
    //                     });
    //                 })
    //                 .catch(async (error) => {
    //                     if (req.file) {
    //                         await unlinkAsync(req.file.path);
    //                     }

    //                     res.status(200).json({
    //                         status: false,
    //                         data: error,
    //                     });
    //                 });
    //         } else {
    //             res.status(200).json({
    //                 status: false,
    //                 data: "Please upload image",
    //             });
    //         }
    //     } catch (error) {
    //         next(error);
    //     }
    // },
    // getAdsMedimallSlider2: async (req, res, next) => {
    //     try {
    //         let result = await AdsMedimallSliderTopWishRecent.find({ sliderType: slider2 });
    //         res.status(200).json({
    //             status: true,
    //             data: result,
    //         });
    //     } catch (error) {
    //         next(error);
    //     }
    // },
    // editAdsMedimallSlider2: async (req, res, next) => {
    //     try {
    //         let data = req.body;
    //         if (data.sliderId) {
    //             let slider = await AdsMedimallSliderTopWishRecent.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });

    //             if (slider) {
    //                 if (req.file) {
    //                     data.image = `ads/${req.file.filename}`;
    //                     // deleting old image
    //                     let splittedImageRoute = slider.image.split("/");
    //                     console.log("splitted::", splittedImageRoute);

    //                     fs.unlink(`./public/images/ads/${splittedImageRoute[1]}`, function (err) {
    //                         if (err) throw err;
    //                         console.log("old image deleted!");
    //                     });
    //                 }

    //                 data.updatedAt = new Date();
    //                 AdsMedimallSliderTopWishRecent.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
    //                     .then((response) => {
    //                         if (response.nModified == 1) {
    //                             res.status(200).json({
    //                                 status: true,
    //                                 data: "Updated successfully",
    //                             });
    //                         } else {
    //                             res.status(200).json({
    //                                 status: false,
    //                                 data: "Not updated",
    //                             });
    //                         }
    //                     })
    //                     .catch((error) => {
    //                         res.status(200).json({
    //                             status: false,
    //                             data: error,
    //                         });
    //                     });
    //             } else {
    //                 if (req.file) {
    //                     await unlinkAsync(req.file.path);
    //                 }
    //                 res.status(200).json({
    //                     status: false,
    //                     data: "invalid sliderId",
    //                 });
    //             }
    //         } else {
    //             res.status(200).json({
    //                 status: false,
    //                 data: "Please enter sliderId",
    //             });
    //         }
    //     } catch (error) {
    //         next(error);
    //     }
    // },
    // deleteAdsMedimallSlider2: async (req, res, next) => {
    //     try {
    //         let slider = await AdsMedimallSliderTopWishRecent.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

    //         if (slider) {
    //             AdsMedimallSliderTopWishRecent.deleteOne({ _id: req.params.id })
    //                 .then((response) => {
    //                     let splittedImageRoute = slider.image.split("/");
    //                     fs.unlink(`./public/images/ads/${splittedImageRoute[1]}`, function (err) {
    //                         if (err) throw err;
    //                     });

    //                     res.status(200).json({
    //                         status: true,
    //                         data: "Medimall slider2 removed successfully",
    //                     });
    //                 })
    //                 .catch((error) => {
    //                     res.status(200).json({
    //                         status: false,
    //                         data: error,
    //                     });
    //                 });
    //         } else {
    //             res.status(200).json({
    //                 status: false,
    //                 data: "invalid sliderId",
    //             });
    //         }
    //     } catch (error) {
    //         next(error);
    //     }
    // },

    /* Ads Medimall Main Category
    ============================================= */

    getAdsMedimallMainCategory: async (req, res, next) => {
        try {
            let result = await AdsMedimallMainCategory.find(
                { isDisabled: false },
                {
                    offerText: 1,
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
    editAdsMedimallMainCategoryOld: async (req, res, next) => {
        try {
            let data = req.body;

            if (data.categoryId) {
                let mainCategory = await AdsMedimallMainCategory.findOne({ _id: mongoose.Types.ObjectId(data.categoryId) });

                if (mainCategory) {
                    if (req.file) {
                        data.image = `ads/${req.file.filename}`;
                        // deleting old image
                        let splittedImageRoute = mainCategory.image.split("/");
                        console.log("splitted::", splittedImageRoute);
                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }
                    }

                    data.updatedAt = new Date();
                    AdsMedimallMainCategory.updateOne({ _id: mongoose.Types.ObjectId(data.categoryId) }, data)
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
                        data: "invalid Category Id",
                    });
                }
            } else {
                let adsImageCount = await AdsMedimallMainCategory.find({
                    isDisabled: false,
                }).countDocuments();

                if (adsImageCount < 2) {
                    if (req.file) {
                        data.image = `ads/${req.file.filename}`;
                        let schemaObj = new AdsMedimallMainCategory(data);
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
                        data: "Please enter categoryId for updating the details",
                    });
                }
            }
        } catch (error) {
            next(error);
        }
    },
    deleteAdsMedimallMainCategory: async (req, res, next) => {
        try {
            let slider = await AdsMedimallMainCategory.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            if (slider) {
                AdsMedimallMainCategory.deleteOne({ _id: req.params.id })
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
    getAdsMedimallMainCategoryById: async (req, res, next) => {
        try {
            let result = await AdsMedimallMainCategory.findOne(
                {
                    _id: mongoose.Types.ObjectId(req.params.id),
                },
                {
                    offerText: 1,
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
    addAdsMedimallMainCategory: async (req, res, next) => {
        try {
            let data = req.body;
            if (req.file) {
                var fileInfo = req.file;
                imageType = mainCategoryType;
                await checkImageSize(imageType, fileInfo);
                if (imageError != "false") {
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                } else {
                    let adsImageCount = await AdsMedimallMainCategory.find({
                        isDisabled: false,
                    }).countDocuments();
                    if (adsImageCount < 2) {
                        let slider = await AdsMedimallMainCategory.findOne({ offerText: data.offerText });
                        if (!slider) {
                            data.image = `ads/${req.file.filename}`;
                            data.createdBy = req.user.id;
                            let schemaObj = new AdsMedimallMainCategory(data);
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
                        } else {
                            res.status(200).json({
                                status: true,
                                data: "Offer text already exist",
                            });
                        }
                    } else {
                        if (req.file) {
                            await unlinkAsync(req.file.path);
                        }

                        res.status(200).json({
                            status: false,
                            data: "Please enter categoryId for updating the details",
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
    editAdsMedimallMainCategory: async (req, res, next) => {
        try {
            imageError = "false";
            let data = req.body;
            if (data.mainCategoryId) {
                let slider = await AdsMedimallMainCategory.findOne({ _id: mongoose.Types.ObjectId(data.mainCategoryId) });
                if (slider) {
                    data.image = slider.image
                    if (req.file) {
                        var fileInfo = req.file;
                        imageType = mainCategoryType;
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
                        data.updatedBy = req.user.id;
                        AdsMedimallMainCategory.updateOne({ _id: mongoose.Types.ObjectId(data.mainCategoryId) }, data)
                            .then((response) => {
                                if (response.nModified == 1) {
                                    res.status(200).json({
                                        status: true,
                                        data: "Updated ",
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
                        data: "invalid id",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter main category id",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    /* Ads Medimall Top Categories
    ============================================= */
    addAdsMedimallTopCategories: async (req, res, next) => {
        try {
            let data = req.body;
            if (req.file) {
                var fileInfo = req.file;
                imageType = topCategoryType;
                await checkImageSize(imageType, fileInfo);
                if (imageError != "false") {
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                } else {
                    let adsImageCount = await AdsMedimallTopCategories.find({
                        isDisabled: false,
                    }).countDocuments();
                    if (adsImageCount < 6) {
                        data.image = `ads/${req.file.filename}`;
                        data.createdBy = req.user.id;
                        let schemaObj = new AdsMedimallTopCategories(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Top Category added successfully",
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
                            data: "Please enter categoryId for updating the details",
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
    getAdsMedimallTopCategories: async (req, res, next) => {
        try {
            let result = await AdsMedimallTopCategories.find(
                { isDisabled: false },
                {
                    offerPercentage: 1,
                    categoryId: 1,
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
    editAdsMedimallTopCategoriesOld: async (req, res, next) => {
        try {
            let data = req.body;

            if (data.topCategoryId) {
                let topCategory = await AdsMedimallTopCategories.findOne({
                    _id: mongoose.Types.ObjectId(data.topCategoryId),
                });

                if (topCategory) {

                    if (req.file) {
                        data.image = `ads/${req.file.filename}`;
                        // deleting old image
                        let splittedImageRoute = topCategory.image.split("/");
                        console.log("splitted::", splittedImageRoute);
                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }
                    }

                    data.updatedAt = new Date();
                    AdsMedimallTopCategories.updateOne({ _id: mongoose.Types.ObjectId(data.topCategoryId) }, data)
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
                        data: "invalid Category Id",
                    });
                }
            } else {
                let adsImageCount = await AdsMedimallTopCategories.find({
                    isDisabled: false,
                }).countDocuments();
                if (adsImageCount < 6) {
                    if (req.file) {
                        data.image = `ads/${req.file.filename}`;
                        let schemaObj = new AdsMedimallTopCategories(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Top Category added successfully",
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
                            data: "Please upload image",
                        });
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: "Please enter the topCategroyId for edit the slider details",
                    });
                }
            }
        } catch (error) {
            next(error);
        }
    },
    editAdsMedimallTopCategories: async (req, res, next) => {
        try {
            imageError = "false";
            let data = req.body;
            if (data.topCategoryId) {
                let slider = await AdsMedimallTopCategories.findOne({ _id: mongoose.Types.ObjectId(data.topCategoryId) });
                if (slider) {
                    data.image = slider.image;
                    if (req.file) {
                        var fileInfo = req.file;
                        imageType = topCategoryType;
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
                    console.log(data);
                    console.log("ddf" + imageError);
                    if (imageError == "false") {
                        console.log(data);
                        data.updatedAt = new Date();
                        data.updatedBy = req.user.id;
                        AdsMedimallTopCategories.updateOne({ _id: mongoose.Types.ObjectId(data.topCategoryId) }, data)
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
                        data: "invalid topCategoryId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter topCategoryId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteAdsMedimallTopCategories: async (req, res, next) => {
        try {
            let slider = await AdsMedimallTopCategories.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsMedimallTopCategories.deleteOne({ _id: req.params.id })
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
    getAdsMedimallTopCategoriesById: async (req, res, next) => {
        try {
            // let result = await AdsMedimallTopCategories.findOne(
            //     {
            //         _id: mongoose.Types.ObjectId(req.params.id),
            //     },
            //     {
            //         offerPercentage: 1,
            //         categoryId: 1,
            //         image: { $concat: [imgPath, "$image"] },
            //     }
            // );
            // let result = await AdsMedimallTopCategories.find({ _id: req.params.id, isDisabled: false }).populate({
            //     path: "categoryId",
            //     select: ["_id", "title", "image"],
            // });
            // if(result.length){
            //     for(i=0;i<result.length;i++){
            //            result[i].categoryId.image= process.env.BASE_URL.concat(result[i].categoryId.image)
            //            result[i].image= process.env.BASE_URL.concat(result[i].image)
            //     }
            // }
            var result = await AdsMedimallTopCategories.aggregate([
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
                        offerPercentage: 1,
                        categoryId: 1,
                        image: { $concat: [imgPath, "$image"] },
                        categoryName1: { $ifNull: [  { $first: "$subCategory.title"}, { $first: "$subSubCategory.title" }] },
                        categoryName2:  { $first: "$masterCategory.title"}
                    },
                },
                ]);

            if (!result) {
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

    /* Ads Medimall Top 3 Icons, 6 categories, Healthcare (Banner)
    ============================================= */

    getAdsMedimallTopIconCatHealth: async (req, res, next) => {
        try {
            let sliderTypes = req.params.sliderType.replace(/\s+/g, " ").trim();
            checkTopIconCatHealthSliderType(sliderTypes);
            if (sliderType == "error") {
                res.status(200).json({
                    status: false,
                    data: "Incorrect Slider Type",
                });
            } else {
                let result = await AdsMedimallTopIconCatHealth.find(
                    { sliderType: sliderType, isDisabled: false },
                    {
                        image: { $concat: [imgPath, "$image"] },
                        sliderType: 1,
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
    editAdsMedimallTopIconCatHealthOld: async (req, res, next) => {
        try {
            let data = req.body;
            if (data.sliderId) {
                let res = await AdsMedimallTopIconCatHealth.findOne({
                    _id: mongoose.Types.ObjectId(data.sliderId),
                });
                if (res) {
                    sliderTypes = res.sliderType;
                }
            } else {
                sliderTypes = req.params.sliderType.replace(/\s+/g, " ").trim();
            }

            checkTopIconCatHealthSliderType(sliderTypes);

            if (sliderType == "error") {
                res.status(200).json({
                    status: false,
                    data: "Incorrect Slider Type",
                });
            } else {
                if (data.sliderId) {
                    let topIconCatHealth = await AdsMedimallTopIconCatHealth.findOne({
                        _id: mongoose.Types.ObjectId(data.sliderId),
                    });

                    if (topIconCatHealth) {
                        if (req.file) {
                            data.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = topIconCatHealth.image.split("/");
                            console.log("splitted::", splittedImageRoute);
                            let path = `./public/images/ads/${splittedImageRoute[1]}`;
                            if (fs.existsSync(path)) {
                                fs.unlink(path, function (err) {
                                    if (err) throw err;
                                    console.log("old image deleted!");
                                });
                            }
                        }

                        data.updatedAt = new Date();
                        AdsMedimallTopIconCatHealth.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                            data: "invalid Slider Id",
                        });
                    }
                } else {
                    if (req.file) {
                        let adsImageCount = await AdsMedimallTopIconCatHealth.find({
                            sliderType: sliderType,
                        }).countDocuments();
                        if (adsImageCount < imageCount) {
                            data.image = `ads/${req.file.filename}`;
                            data.sliderType = sliderType;
                            let schemaObj = new AdsMedimallTopIconCatHealth(data);
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
                                status: false,
                                data: "Please add sliderId(" + sliderType + ")for updating image details",
                            });
                        }
                    } else {
                        res.status(200).json({
                            status: false,
                            data: "Please upload image",
                        });
                    }
                }
            }
        } catch (error) {
            next(error);
        }
    },
    deleteAdsMedimallTopIconCatHealth: async (req, res, next) => {
        try {
            let slider = await AdsMedimallTopIconCatHealth.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsMedimallTopIconCatHealth.deleteOne({ _id: req.params.id })
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
                    data: "invalid id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    addAdsMedimallTopIconCatHealth: async (req, res, next) => {
        try {
            let data = req.body;
            if (req.file) {
                var fileInfo = req.file;
                let sliderTypes = req.params.sliderType.replace(/\s+/g, " ").trim();
                checkTopIconCatHealthSliderType(sliderTypes, fileInfo);
                if (sliderType == "error") {
                    unlinkImage(fileInfo);
                    res.status(200).json({
                        status: false,
                        data: "Incorrect Slider Type",
                    });
                } else if (imageError != "false") {
                    unlinkImage(fileInfo);
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                } else {
                    let adsImageCount = await AdsMedimallTopIconCatHealth.find({
                        sliderType: sliderType,
                    }).countDocuments();
                    if (adsImageCount < imageCount) {
                        data.image = `ads/${req.file.filename}`;
                        data.sliderType = sliderType;
                        let schemaObj = new AdsMedimallTopIconCatHealth(data);
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
                            status: false,
                            data: "Please add sliderId(" + sliderType + ")for updating image details",
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
    editAdsMedimallTopIconCatHealth: async (req, res, next) => {
        try {
            imageError = "false";
            let data = req.body;
            if (data.sliderId) {
                let slider = await AdsMedimallTopIconCatHealth.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });
                if (slider) {
                    data.image = slider.image;
                    if (req.file) {
                        var fileInfo = req.file;
                        imageType = slider.sliderType;
                        checkTopIconCatHealthSliderType(imageType, fileInfo);
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
                        data.updatedBy = req.user.id;
                        AdsMedimallTopIconCatHealth.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                        unlinkImage(fileInfo);

                        res.status(200).json({
                            status: false,
                            data: imageError + "(" + sliderType + ")",
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
    getAdsMedimallTopIconCatHealthById: async (req, res, next) => {
        try {
            let result = await AdsMedimallTopIconCatHealth.findOne(
                {
                    _id: mongoose.Types.ObjectId(req.params.id),
                },
                {
                    image: { $concat: [imgPath, "$image"] },
                    sliderType: 1,
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

    /* Ads Medimall Slider1, Slider2 Slider3, Slider4, Slider5, Slider6, Slider7, Top Deals  
    ============================================= */
    addAdsMedimallSlider: async (req, res, next) => {
        try {
            let data = req.body;

            if (req.file) {
                var fileInfo = req.file;
                let medimallSliderTypes = req.params.sliderType.replace(/\s+/g, " ").trim();
                console.log(medimallSliderTypes);
                checkMedimallSliderSliderType(medimallSliderTypes, fileInfo);
                if (medimallSlidersType == "error") {
                    unlinkImage(fileInfo);
                    res.status(200).json({
                        status: false,
                        data: "Incorrect Slider Type",
                    });
                } else if (imageError != "false") {
                    unlinkImage(fileInfo);
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                } else {
                    data.image = `ads/${req.file.filename}`;
                    data.sliderType = medimallSlidersType;
                    data.createdBy = req.user.id;
                    let schemaObj = new AdsMedimallSliderTopWishRecent(data);
                    schemaObj
                        .save()
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "Medimall slider added successfully",
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
    getAdsMedimallSlider: async (req, res, next) => {
        try {
            let medimallSliderTypes = req.params.sliderType.replace(/\s+/g, " ").trim();
            checkMedimallSliderSliderType(medimallSliderTypes);
            if (medimallSlidersType == "error") {
                res.status(200).json({
                    status: false,
                    data: "Incorrect Slider Type",
                });
            } else {
                let result = await AdsMedimallSliderTopWishRecent.find(
                    { sliderType: medimallSlidersType, isDisabled: false },
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
            }
        } catch (error) {
            next(error);
        }
    },
    editAdsMedimallSlider: async (req, res, next) => {
        try {
            imageError = "false";
            let data = req.body;
            if (data.sliderId) {
                let slider = await AdsMedimallSliderTopWishRecent.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });
                if (slider) {
                    data.image = slider.image;
                    if (req.file) {
                        var fileInfo = req.file;
                        imageType = slider.sliderType;

                        checkMedimallSliderSliderType(imageType, fileInfo);
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
                        data.updatedBy = req.user.id;
                        AdsMedimallSliderTopWishRecent.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                        unlinkImage(fileInfo);
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
    deleteAdsMedimallSlider: async (req, res, next) => {
        try {
            let slider = await AdsMedimallSliderTopWishRecent.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsMedimallSliderTopWishRecent.deleteOne({ _id: req.params.id })
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
                            data: "Medimall slider1 removed successfully",
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
    getAdsMedimallSliderById: async (req, res, next) => {
        try {
            var result = await AdsMedimallSliderTopWishRecent.aggregate([
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
                        sliderType: 1,                       
                        typeName1: { $ifNull: [  { $first: "$subCategory.title"}, { $first: "$subSubCategory.title" }] },
                        typeName2: { $ifNull: [  { $first: "$product.name"}, { $first: "$masterCategory.title" }] }
                    },
                },
                ]);

            if (!result) {
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

    /* Ads Medimall Wish list , Recently Viewed APIs
    ============================================= */

    getAdsMedimallWishRecent: async (req, res, next) => {
        try {
            let medimallRecentWishlistTypes = req.params.sliderType.replace(/\s+/g, " ").trim();
            checkMedimallRecentWishlistSliderType(medimallRecentWishlistTypes);
            if (recentWishlistSliderType == "error") {
                res.status(200).json({
                    status: false,
                    data: "Incorrect Slider Type",
                });
            } else {
                let result = await AdsMedimallSliderTopWishRecent.find(
                    { sliderType: recentWishlistSliderType, isDisabled: false },
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
            }
        } catch (error) {
            next(error);
        }
    },
    editAdsMedimallWishRecentOld: async (req, res, next) => {
        try {
            let data = req.body;
            let medimallRecentWishlistTypes = req.params.sliderType.replace(/\s+/g, " ").trim();
            checkMedimallRecentWishlistSliderType(medimallRecentWishlistTypes);

            if (recentWishlistSliderType == "error") {
                res.status(200).json({
                    status: false,
                    data: "Incorrect Slider Type",
                });
            } else {
                if (data.sliderId) {
                    let wishRecent = await AdsMedimallSliderTopWishRecent.findOne({
                        _id: mongoose.Types.ObjectId(data.sliderId),
                    });

                    if (wishRecent) {
                        if (req.file) {
                            data.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = wishRecent.image.split("/");
                            let path = `./public/images/ads/${splittedImageRoute[1]}`;
                            if (fs.existsSync(path)) {
                                fs.unlink(path, function (err) {
                                    if (err) throw err;
                                    console.log("old image deleted!");
                                });
                            }
                        }

                        data.updatedAt = new Date();
                        AdsMedimallSliderTopWishRecent.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                            data: "invalid Slider Id",
                        });
                    }
                } else {
                    if (req.file) {
                        data.image = `ads/${req.file.filename}`;
                        data.sliderType = recentWishlistSliderType;
                        let schemaObj = new AdsMedimallSliderTopWishRecent(data);
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
                            status: false,
                            data: "Please upload image",
                        });
                    }
                }
            }
        } catch (error) {
            next(error);
        }
    },
    editAdsMedimallWishRecent: async (req, res, next) => {
        try {
            imageError = "false";
            let data = req.body;
            if (data.sliderId) {
                let slider = await AdsMedimallSliderTopWishRecent.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });
                if (slider) {
                    data.image = slider.image;
                    if (req.file) {
                        var fileInfo = req.file;
                        imageType = slider.sliderType;
                        checkMedimallRecentWishlistSliderType(imageType, fileInfo);
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
                        data.updatedBy = req.user.id;
                        AdsMedimallSliderTopWishRecent.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                        unlinkImage(fileInfo);
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
    deleteAdsMedimallWishRecent: async (req, res, next) => {
        try {
            let slider = await AdsMedimallSliderTopWishRecent.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsMedimallSliderTopWishRecent.deleteOne({ _id: req.params.id })
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
                            data: "Medimall slider removed successfully",
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
    getAdsMedimallWishRecentByIdold: async (req, res, next) => {
        try {
            let result = await AdsMedimallSliderTopWishRecent.findOne(
                {
                    _id: mongoose.Types.ObjectId(req.params.id),
                },
                {
                    type: 1,
                    typeId: 1,
                    image: { $concat: [imgPath, "$image"] },
                    sliderType: 1,
                }
            ).lean();

            if (!result) {
                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
                });
            } else {
                if (result.type == 0) {
                    let product = await Product.findOne(
                        {
                            _id: mongoose.Types.ObjectId(result.typeId),
                        },
                        {
                            title: 1,
                        }
                    );
                    if (product) {
                        result.typeTitle = product.title;
                    }
                }
                if (result.type == 1) {
                    let category = await ProCategory.findOne(
                        {
                            _id: mongoose.Types.ObjectId(result.typeId),
                        },
                        {
                            title: 1,
                        }
                    );
                    if (category) {
                        result.typeTitle = category.title;
                    }
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
    getAdsMedimallWishRecentById: async (req, res, next) => {
        try {
            // let result = await AdsMedimallSliderTopWishRecent.findOne(
            //     {
            //         _id: mongoose.Types.ObjectId(req.params.id),
            //     },
            //     {
            //         type: 1,
            //         typeId: 1,
            //         image: { $concat: [imgPath, "$image"] },
            //         sliderType: 1,
            //     }
            // ).lean();
            var result = await AdsMedimallSliderTopWishRecent.aggregate([
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
                        sliderType: 1,                       
                        typeName1: { $ifNull: [  { $first: "$subCategory.title"}, { $first: "$subSubCategory.title" }] },
                        typeName2: { $ifNull: [  { $first: "$product.name"}, { $first: "$masterCategory.title" }] }
                    },
                },
                ]);

            if (!result) {
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
    addAdsMedimallWishRecent: async (req, res, next) => {
        try {
            let data = req.body;

            if (req.file) {
                var fileInfo = req.file;
                let medimallRecentWishlistTypes = req.params.sliderType.replace(/\s+/g, " ").trim();
                await checkMedimallRecentWishlistSliderType(medimallRecentWishlistTypes, fileInfo);

                if (recentWishlistSliderType == "error") {
                    unlinkImage(fileInfo);
                    res.status(200).json({
                        status: false,
                        data: "Incorrect Slider Type",
                    });
                } else if (imageError != "false") {
                    unlinkImage(fileInfo);
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                } else {
                    let adsImageCount = await AdsMedimallSliderTopWishRecent.find({
                        sliderType: recentWishlistSliderType,
                    }).countDocuments();
                    if (adsImageCount >= imageWishRecentCount) {
                        if (req.file) {
                            await unlinkAsync(req.file.path);
                        }
                        res.status(200).json({
                            status: false,
                            data: "Slider already added.Please add the slider id for edit image",
                        });
                    } else {
                        data.image = `ads/${req.file.filename}`;
                        data.sliderType = recentWishlistSliderType;
                        data.createdBy = req.user.id;
                        let schemaObj = new AdsMedimallSliderTopWishRecent(data);
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
    // addAdsMedimallRecent: async (req, res, next) => {
    //     try {
    //         let data = req.body;

    //         if (req.file) {
    //             var fileInfo = req.file;
    //             let medimallRecentWishlistTypes = req.params.sliderType.replace(/\s+/g, " ").trim();
    //             await checkMedimallRecentWishlistSliderType(medimallRecentWishlistTypes, fileInfo);

    //             if (recentWishlistSliderType == "error") {
    //                 unlinkImage(fileInfo);
    //                 res.status(200).json({
    //                     status: false,
    //                     data: "Incorrect Slider Type",
    //                 });
    //             } else if (imageError != "false") {
    //                 unlinkImage(fileInfo);
    //                 res.status(200).json({
    //                     status: false,
    //                     data: imageError,
    //                 });
    //             } else {
    //                 let adsImageCount = await AdsMedimallSliderTopWishRecent.find({
    //                     sliderType: recentWishlistSliderType,
    //                 }).countDocuments();
    //                 if (adsImageCount >= imageRecentCount) {
    //                     if (req.file) {
    //                         await unlinkAsync(req.file.path);
    //                     }
    //                     res.status(200).json({
    //                         status: false,
    //                         data: "Slider already added.Please add the slider id for edit image",
    //                     });
    //                 } else {
    //                     data.image = `ads/${req.file.filename}`;
    //                     data.sliderType = recentWishlistSliderType;
    //                     data.createdBy = req.user.id;
    //                     let schemaObj = new AdsMedimallSliderTopWishRecent(data);
    //                     schemaObj
    //                         .save()
    //                         .then((response) => {
    //                             res.status(200).json({
    //                                 status: true,
    //                                 data: "Slider added successfully",
    //                             });
    //                         })
    //                         .catch(async (error) => {
    //                             if (req.file) {
    //                                 await unlinkAsync(req.file.path);
    //                             }
    //                             res.status(200).json({
    //                                 status: false,
    //                                 data: error,
    //                             });
    //                         });
    //                 }
    //             }
    //         } else {
    //             res.status(200).json({
    //                 status: false,
    //                 data: "Please upload image",
    //             });
    //         }
    //     } catch (error) {
    //         next(error);
    //     }
    // },

    /* Ads Medimall Grooming & Essentials
    ============================================= */
    addAdsMedimallGrooming: async (req, res, next) => {
        try {
            let data = req.body;
            let schemaObj = new AdsMedimallGrooming(data);
            schemaObj
                .save()
                .then((response) => {
                    res.status(200).json({
                        status: true,
                        data: "Medimall Grooming added successfully",
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
        } catch (error) {
            next(error);
        }
    },
    getAdsMedimallGroomingold: async (req, res, next) => {
        try {
            // let result = await AdsMedimallGrooming.find(
            //     { isDisabled: false },
            //     {
            //         categoryId: 1,
            //         productId: 1,
            //     }
            // );
            let result = await AdsMedimallGrooming.aggregate([
                {
                    $match: { isDisabled: false},
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
                    $unwind: {
                        path: "$product",
                        preserveNullAndEmptyArrays: true,
                    },
                },              
                {
                    $project: {
                        _id: 1,
                        productName: "$product.title",
                        image: { $concat: [imgPath, "$product.image"] },
                        categoryId: 1,
                        productId: 1,
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
    getAdsMedimallGrooming: async (req, res, next) => {
        try {           
            let result = await AdsMedimallGrooming.aggregate([
                {
                    $match: {
                        isDisabled: false
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
                { $addFields: { firstElem: { $first: "$product.pricing.image" } } }  ,  
                {
                    $project: {
                        _id: 1,
                        categoryId: 1,
                        productId: 1,
                        image:{ $first: "$firstElem"},
                        productName:  { $first: "$product.name"}
                    },
                },
                ]);
               
          
            for (let items of result) {  
                    items.image =imgPath + items.image[0]
            }
           
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    editAdsMedimallGrooming: async (req, res, next) => {
        try {
            let data = req.body;
            if (data.groomingId) {
                let slider = await AdsMedimallGrooming.findOne({ _id: mongoose.Types.ObjectId(data.groomingId) });

                if (slider) {
                    data.updatedAt = new Date();
                    AdsMedimallGrooming.updateOne({ _id: mongoose.Types.ObjectId(data.groomingId) }, data)
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
                        data: "invalid groomingId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter groomingId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteAdsMedimallGrooming: async (req, res, next) => {
        try {
            let grooming = await AdsMedimallGrooming.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (grooming) {
                AdsMedimallGrooming.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        res.status(200).json({
                            status: true,
                            data: "Medimall grooming removed successfully",
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
                    data: "invalid grooming id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getAdsMedimallGroomingById1: async (req, res, next) => {
        try {
            // let result = await AdsMedimallGrooming.findOne(
            //     {
            //         _id: mongoose.Types.ObjectId(req.params.id),
            //     },
            //     {
            //         categoryId: 1,
            //         productId: 1,
            //     }
            // );
            // let result = await AdsMedimallGrooming.find({_id:req.params.id,isDisabled: false }).populate({
            //     path: "productId",
            //     select: ["_id", "title", "image"],
            // });

            let result = await AdsMedimallGrooming.aggregate([
                {
                    $match: { _id: mongoose.Types.ObjectId(req.params.id) },
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
                    $unwind: "$product",
                },
                {
                    $lookup: {
                        from: "procategories",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "category",
                    },
                },
                {
                    $unwind: "$category",
                },
                {
                    $project: {
                        _id: 1,
                        productName: "$product.title",
                        categoryName: "$category.title",
                        categoryId: 1,
                        productId: 1,
                    },
                },
            ]);
          

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
    getAdsMedimallGroomingById: async (req, res, next) => {
        try {
            var result = await AdsMedimallGrooming.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.params.id)
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
                        categoryId: 1,
                        productId: 1,
                        categoryName: { $ifNull: [  { $first: "$subCategory.title"}, { $first: "$subSubCategory.title" }] },
                        productName:  { $first: "$product.name"}
                    },
                },
                ]);

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
};
