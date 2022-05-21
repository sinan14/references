const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const sizeOf = require("image-size");
const FoliofitTestimonial = require("../../models/foliofit/foliofitTestimonial");


const foliofitType = "foliofit"
const yogaType = "yoga"
const webType = "web"
var imageError ;
const imgPath = process.env.BASE_URL

function checkImageSize(imageType, fileInfo) {
    imageError = "false"
    if (fileInfo) {
        dimensions = sizeOf(fileInfo.path);
    }
    if (imageType == foliofitType) {
        if (dimensions.width != 1047 || dimensions.height != 300) {
            imageError = "Please upload image of size 1047 * 300";
        }
    }  if (imageType == yogaType) {
        if (dimensions.width != 1047 || dimensions.height != 300) {
            imageError = "Please upload image of size 1047 * 300";
        }
    }  
     if (imageType == webType) {
        if (dimensions.width != 265 || dimensions.height != 285) {
            imageError = "Please upload image of size 265 * 285";
        }
    } 
}

function deleteImageFromFile(splittedImageRoute) {
    if (splittedImageRoute) {
        if (fs.existsSync(`./public/images/foliofit/${splittedImageRoute[1]}`)) {
            fs.unlink(`./public/images/foliofit/${splittedImageRoute[1]}`, function (err) {
                if (err) throw err;
                console.log("old image deleted!");
            });
        }
    }
 }

module.exports = {

  /* Foliofit Tesimonial - Foliofit 
    ============================================= */
    addFoliofitTestimonial: async (req, res, next) => {
        try {
            let data = req.body;
            if (req.file) {
                var fileInfo = {};
                fileInfo = req.file;
                imageType = foliofitType;
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
                    data.createdBy = req.user.id
                    data.image = `foliofit/${req.file.filename}`;
                    data.testimonialType = foliofitType
                    let schemaObj = new FoliofitTestimonial(data);
                    schemaObj
                        .save()
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "Foliofit Testimonial added successfully",
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
    getAllFoliofitTestimonials: async (req, res, next) => {
        try {
           
            let result = await FoliofitTestimonial.find(
                {testimonialType:foliofitType, isDisabled: false },
                {
                     image:{ $concat: [ imgPath,"$image" ] },
                    testimonialType: 1
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
    getFoliofitTestimonial: async (req, res, next) => {
        try {
          
            let result = await FoliofitTestimonial.aggregate([
                { $match: { testimonialType:foliofitType, isDisabled: false ,_id: mongoose.Types.ObjectId(req.params.id)} },
                { $project: { image:{ $concat: [ imgPath,"$image" ] } }  },
            ]);


            if (result.length === 0){ 
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
    editFoliofitTestimonial: async (req, res, next) => {
        try {
            let data = req.body;
            var fileInfo = {};
            if (data.id) {
                let testimonial = await FoliofitTestimonial.findOne({ _id: mongoose.Types.ObjectId(data.id) });
                if (testimonial) {
                    if (req.file) {
                        var fileInfo = {};
                        fileInfo = req.file;
                        imageType = foliofitType
                        checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                            });
                        } else {
                            data.image = `foliofit/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = testimonial.image.split("/");
                            deleteImageFromFile(splittedImageRoute);   
                         
                        }
                    }
                    if (imageError == "false") {
                        data.updatedAt = new Date();
                        data.updatedBy = req.user.id
                        FoliofitTestimonial.updateOne({ _id: mongoose.Types.ObjectId(data.id) }, data)
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
    deleteFoliofitTestimonial: async (req, res, next) => {
        try {
            let Testimonial = await FoliofitTestimonial.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (Testimonial) {
                FoliofitTestimonial.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = Testimonial.image.split("/");
                        deleteImageFromFile(splittedImageRoute); 
                        res.status(200).json({
                            status: true,
                            data: "Testimonial deleted successfully",
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


     /* Foliofit Tesimonial - Yoga 
    ============================================= */
    addYogaTestimonial: async (req, res, next) => {
        try {
            let data = req.body;
            if (req.file) {
                var fileInfo = {};
                fileInfo = req.file;
                imageType = yogaType;
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
                    data.createdBy = req.user.id
                    data.image = `foliofit/${req.file.filename}`;
                    data.testimonialType = yogaType
                    let schemaObj = new FoliofitTestimonial(data);
                    schemaObj
                        .save()
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "Yoga Testimonial added successfully",
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
    getAllYogaTestimonials: async (req, res, next) => {
        try {
            let result = await FoliofitTestimonial.find(
                { testimonialType:yogaType,isDisabled: false },
                {
                    image:{ $concat: [ imgPath,"$image" ] },
                    testimonialType: 1
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
    getYogaTestimonial: async (req, res, next) => {
        try {
            
            let result = await FoliofitTestimonial.aggregate([
                { $match: { testimonialType:yogaType, isDisabled: false ,_id: mongoose.Types.ObjectId(req.params.id)} },
                { $project: { image:{ $concat: [ imgPath,"$image" ] } }  },
            ]);
            if (result.length === 0){  
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
    editYogaTestimonial: async (req, res, next) => {
        try {
            let data = req.body;
            var fileInfo = {};
            if (data.id) {
                let testimonial = await FoliofitTestimonial.findOne({ _id: mongoose.Types.ObjectId(data.id) });
                if (testimonial) {
                    if (req.file) {
                        var fileInfo = {};
                        fileInfo = req.file;
                        imageType = yogaType
                        checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                            });
                        } else {
                            data.image = `foliofit/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = testimonial.image.split("/");
                            deleteImageFromFile(splittedImageRoute);   
                         
                        }
                    }
                    if (imageError == "false") {
                        data.updatedAt = new Date();
                        data.updatedBy = req.user.id
                        FoliofitTestimonial.updateOne({ _id: mongoose.Types.ObjectId(data.id) }, data)
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
    deleteYogaTestimonial: async (req, res, next) => {
        try {
            let Testimonial = await FoliofitTestimonial.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (Testimonial) {
                FoliofitTestimonial.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = Testimonial.image.split("/");
                        deleteImageFromFile(splittedImageRoute); 
                        res.status(200).json({
                            status: true,
                            data: "Testimonial deleted successfully",
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



      /* Foliofit Tesimonial - Web  
    ============================================= */
    addWebTestimonial: async (req, res, next) => {
        try {
            let data = req.body;
            if (req.file) {
                var fileInfo = {};
                fileInfo = req.file;
                imageType = webType;
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
                    data.createdBy = req.user.id
                    data.image = `foliofit/${req.file.filename}`;
                    data.testimonialType = webType
                    let schemaObj = new FoliofitTestimonial(data);
                    schemaObj
                        .save()
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "Web Testimonial added successfully",
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
    getAllWebTestimonials: async (req, res, next) => {
        try {
            let result = await FoliofitTestimonial.find(
                { testimonialType:webType,isDisabled: false },
                {
                    image:{ $concat: [ imgPath,"$image" ] },
                    testimonialType: 1
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
    getWebTestimonial: async (req, res, next) => {
        try {
           
            let result = await FoliofitTestimonial.aggregate([
                { $match: { testimonialType:webType, isDisabled: false ,_id: mongoose.Types.ObjectId(req.params.id)} },
                { $project: { image:{ $concat: [ imgPath,"$image" ] } }  },
            ]);
            if (result.length === 0){    
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
    editWebTestimonial: async (req, res, next) => {
        try {
            let data = req.body;
            var fileInfo = {};
            if (data.id) {
                let testimonial = await FoliofitTestimonial.findOne({ _id: mongoose.Types.ObjectId(data.id) });
                if (testimonial) {
                    if (req.file) {
                        var fileInfo = {};
                        fileInfo = req.file;
                        imageType = webType
                        checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                            });
                        } else {
                            data.image = `foliofit/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = testimonial.image.split("/");
                            deleteImageFromFile(splittedImageRoute);   
                         
                        }
                    }
                    if (imageError == "false") {
                        data.updatedAt = new Date();
                        data.updatedBy = req.user.id
                        FoliofitTestimonial.updateOne({ _id: mongoose.Types.ObjectId(data.id) }, data)
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
    deleteWebTestimonial: async (req, res, next) => {
        try {
            let Testimonial = await FoliofitTestimonial.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (Testimonial) {
                FoliofitTestimonial.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = Testimonial.image.split("/");
                        deleteImageFromFile(splittedImageRoute); 
                        res.status(200).json({
                            status: true,
                            data: "Testimonial deleted successfully",
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


}