const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const AdsMedfeedSlider1 = require("../../models/ads/medfeed/slider1");
const AdsMedfeedMainQuizExpert = require("../../models/ads/medfeed/mainQuizExpert");
const sizeOf = require("image-size");

var mainExpertSliderType 
var quizSliderType = "quiz";
var imageError 
const imgPath = process.env.BASE_URL
var imageType
let dimensionss

function checkMeedfeedMainExpertSliderType(medfeedMainExpertTypes,fileInfo) {
    let dimensions = sizeOf(fileInfo.path);

    if (medfeedMainExpertTypes == "maincategory") {
        if (dimensions.width != 186 && dimensions.height != 162) {
            imageError = "Please upload image of size 186 * 162";
        }     
        mainExpertSliderType = "maincategory";
    } 
     if (medfeedMainExpertTypes == "expertadvise") {
        if (dimensions.width != 1498 && dimensions.height != 476) {
            imageError = "Please upload image of size 1498 * 476";
        }
        mainExpertSliderType = "expertadvise";
    }
}
function checkSliderType(medfeedMainExpertTypes) {
    if (medfeedMainExpertTypes == "maincategory") { 
        mainExpertSliderType = "maincategory";
    } 
     if (medfeedMainExpertTypes == "expertadvise") {
        mainExpertSliderType = "expertadvise";
    }
}
function checkImageSize(imageTypes, fileInfo) {
   
    let dimensions = sizeOf(fileInfo.path);
    console.log(dimensions);
    
    if (imageTypes == "slider1") {
        if (dimensions.width != 3000 && dimensions.height != 1317) {
            imageError = "Please upload image of size 3000 * 1317";
        }
    } 
     if (imageTypes== "quiz") {
        if (dimensions.width != 697 && dimensions.height != 280) {
            imageError = "Please upload image of size 697 * 280";
        }
        // else if (dimensions.width != 697 && dimensions.height != 280) {
        //     imageError = "Please upload image of size 697 * 280";
        // }
    } 
    if (imageTypes== "quizone") {
        if (dimensions.width != 1498 && dimensions.height != 392) {
            imageError = "Please upload image of size 1498 * 392";
        }
    } 
    
   
}

module.exports = {

    /* Ads Medifeed Slider1
    ============================================= */
    addAdsMedfeedSlider1: async (req, res, next) => {
        try {
            imageError = 'false'
            let data = req.body;

            if (req.file) {
                const redirectTypes = ["MedArticle", "MedQuiz", "ExpertAdvise", "HealthTips", "Live Updates", "Home"];
                if (redirectTypes.includes(data.redirect_type)) {
                    var fileInfo = {};
                    fileInfo = req.file;
                    imageType = "slider1";
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
                        let schemaObj = new AdsMedfeedSlider1(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Medfeed slider1 added successfully",
                                });
                            })
                            .catch(async (error) => {
                                // console.log('hi');
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
        } catch (error) {
            next(error);
        }
    },
    getAdsMedfeedSlider1: async (req, res, next) => {
        try {
            let result = await AdsMedfeedSlider1.find(
                { isDisabled: false },
                {
                    redirect_type: 1,
                    image:{ $concat: [ imgPath,"$image" ] }
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
    getAdsMedfeedSlider1ById: async (req, res, next) => { 
        try {           
            let result = await AdsMedfeedSlider1.find(
                {  _id: mongoose.Types.ObjectId(req.params.id)},
                {
                    redirect_type:1,
                    categoryId: 1,
                    image:{ $concat: [ imgPath,"$image" ] }
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
    editAdsMedfeedSlider1: async (req, res, next) => {
        try {
            imageError = 'false'
            let data = req.body;
            if (data.sliderId) {
                let slider = await AdsMedfeedSlider1.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });                
                if (slider) {
                    data.image = slider.image
                    console.log(data.image)
                    if (req.file) {
                        var fileInfo = {};
                        fileInfo = req.file;
                        imageType = "slider1";
                        await  checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {                           
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                            });
                        } else {
                            data.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = slider.image.split("/");
                            let path = `./public/images/ads/${splittedImageRoute[1]}`;                          
                            if (fs.existsSync(path)) {
                                fs.unlink(`./public/images/ads/${splittedImageRoute[1]}`, function (err) {
                                    if (err) throw err;
                                });
                            }
                        }
                    }
                    if (imageError == "false") {
                        data.updatedAt = new Date();
                        AdsMedfeedSlider1.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
    deleteAdsMedfeedSlider1: async (req, res, next) => {
        try {
            let slider = await AdsMedfeedSlider1.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsMedfeedSlider1.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = slider.image.split("/");
                        fs.unlink(`./public/images/ads/${splittedImageRoute[1]}`, function (err) {
                            if (err) throw err;
                        });

                        res.status(200).json({
                            status: true,
                            data: "Medfeed slider1 deleted successfully",
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

    /* Ads Medfeed Main Category , Expert Advise
    ============================================= */

    getAdsMedfeedMainExpert: async (req, res, next) => {
        try {
            imageError = 'false'
            mainExpertSliderType = 'error'
            let medfeedMainExpertType = req.params.sliderType.replace(/\s+/g, " ").trim();        
           await checkSliderType(medfeedMainExpertType);
            if (mainExpertSliderType == "error") {
                res.status(200).json({
                    status: false,
                    data: "Incorrect Slider Type",
                });
            } else {
                
                    let result = await AdsMedfeedMainQuizExpert.find(
                        { sliderType: mainExpertSliderType, isDisabled: false },
                        {
                            image:{ $concat: [ imgPath,"$image" ] },
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
    editAdsMedfeedMainExpert: async (req, res, next) => {
        try {
            imageError ='false'
            mainExpertSliderType = 'error'
            let data = req.body;
            let medfeedMainExpertTypes = req.params.sliderType.replace(/\s+/g, " ").trim();
            if (req.file) {
                fileInfo = req.file;
                await  checkMeedfeedMainExpertSliderType(medfeedMainExpertTypes, fileInfo);
                if (mainExpertSliderType == "error") {
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
                    if (data.sliderId) {
                        let mainExpert = await AdsMedfeedMainQuizExpert.findOne({
                            _id: mongoose.Types.ObjectId(data.sliderId),
                        });
                        if (mainExpert) {
                            data.image = mainExpert.image
                            if (req.file) {
                                data.image = `ads/${req.file.filename}`;
                                // deleting old image
                                let splittedImageRoute = mainExpert.image.split("/");
                                fs.unlink(`./public/images/ads/${splittedImageRoute[1]}`, function (err) {
                                    if (err) throw err;
                                });
                            }
                            data.updatedAt = new Date();
                            AdsMedfeedMainQuizExpert.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                        data.image = `ads/${req.file.filename}`;
                        data.sliderType = mainExpertSliderType;
                        let schemaObj = new AdsMedfeedMainQuizExpert(data);
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
    getAdsMedfeedMainExpertById: async (req, res, next) => {
        try {
            let result = await AdsMedfeedMainQuizExpert.findOne(
                {
                    _id: mongoose.Types.ObjectId(req.params.id)
                },
                {
                    image:{ $concat: [ imgPath,"$image" ] }
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
    deleteAdsMedfeedMainExpert: async (req, res, next) => {
        try {
            let slider = await AdsMedfeedMainQuizExpert.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsMedfeedMainQuizExpert.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        res.status(200).json({
                            status: true,
                            data: "Deleted successfully",
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

    /* Ads Medfeed Quiz
    ============================================= */
    addAdsMedfeedQuiz: async (req, res, next) => {
        try {
            imageError = 'false'
            console.log('wwww')
            let data = req.body;
            if (req.file) {
                var fileInfo = {};
                fileInfo = req.file;
                imageType = "quiz";
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
                    data.sliderType = quizSliderType;
                    let schemaObj = new AdsMedfeedMainQuizExpert(data);
                    schemaObj
                        .save()
                        .then((response) => {
                            console.log('haiii')
                            res.status(200).json({
                                status: true,
                                data: "Medfeed quiz added successfully",
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
    getAdsMedfeedQuiz: async (req, res, next) => {
        try {
            let result = await AdsMedfeedMainQuizExpert.find(
                { sliderType: quizSliderType, isDisabled: false },
                {
                    image:{ $concat: [ imgPath,"$image" ] },
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
    getAdsMedfeedQuizById: async (req, res, next) => {
        try {
            let result = await AdsMedfeedMainQuizExpert.findOne(
                {
                    _id: mongoose.Types.ObjectId(req.params.id),sliderType: quizSliderType
                },
                {
                    image:{ $concat: [ imgPath,"$image" ] }
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
    editAdsMedfeedQuiz: async (req, res, next) => {
        try {
            let data = req.body;
            if (data.sliderId) {
                let slider = await AdsMedfeedMainQuizExpert.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });

                if (slider) {
                    data.image = slider.image
                    if (req.file) {
                        data.image = `ads/${req.file.filename}`;
                        // deleting old image
                        let splittedImageRoute = slider.image.split("/");
                        console.log("splitted::", splittedImageRoute);

                        fs.unlink(`./public/images/ads/${splittedImageRoute[1]}`, function (err) {
                            if (err) throw err;
                            console.log("old image deleted!");
                        });
                    }

                    data.updatedAt = new Date();
                    AdsMedfeedMainQuizExpert.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
    deleteAdsMedfeedQuiz: async (req, res, next) => {
        try {
            let slider = await AdsMedfeedMainQuizExpert.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (slider) {
                AdsMedfeedMainQuizExpert.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = slider.image.split("/");
                        fs.unlink(`./public/images/ads/${splittedImageRoute[1]}`, function (err) {
                            if (err) throw err;
                        });

                        res.status(200).json({
                            status: true,
                            data: "Medfeed quiz deleted successfully",
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
    addAdsMedfeedQuizOne:async(req,res,next)=>{
        try {
            imageError = 'false'
            console.log('wwww')
            let data = req.body;
            if (req.file) {
                var fileInfo = {};
                fileInfo = req.file;
                imageType = "quizone";
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
                    data.sliderType = 'quizone';
                    let schemaObj = new AdsMedfeedMainQuizExpert(data);
                    schemaObj
                        .save()
                        .then((response) => {
                            console.log('haiii')
                            res.status(200).json({
                                status: true,
                                data: "Medfeed quiz added successfully",
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
    getAdsMedfeedQuizOne: async (req, res, next) => {
        try {
            let result = await AdsMedfeedMainQuizExpert.findOne(
                { sliderType: 'quizone', isDisabled: false },
                {
                    image:{ $concat: [ imgPath,"$image" ] },
                    sliderType: 1,
                });
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    editAdsMedfeedQuizOne: async (req, res, next) => {
        try {
            imageError = "false"
            let data = req.body;
            if (data.sliderId) {
                let slider = await AdsMedfeedMainQuizExpert.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });
                if (slider) {
                    data.image = slider.image
                    if (req.file) {
                        var fileInfo = {};
                        fileInfo = req.file;
                        imageType = "quizone";
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
                        }else{
                            data.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = slider.image.split("/");
                            console.log("splitted::", splittedImageRoute);
    
                            fs.unlink(`./public/images/ads/${splittedImageRoute[1]}`, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                            data.updatedAt = new Date();
                            AdsMedfeedMainQuizExpert.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                        }
                    }else{
                        res.status(200).json({
                            status: false,
                            data: "Please Upload Image",
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
};
