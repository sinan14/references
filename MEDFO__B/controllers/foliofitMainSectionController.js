const mongoose = require("mongoose");
const foliofitMainSections = require('../models/foliofitMainSection')
const sizeOf = require("image-size");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
var dimensions = "";
var imageType = "";
let imageError = 'false';
var imageTypeSlider1 =""

function checkImageSize(imageType, fileInfo) {
    if (fileInfo) {
        dimensions = sizeOf(fileInfo.path);
    }
    if (imageType == imageTypeSlider1) {
        if(dimensions.width != 203 && dimensions.height != 203) {
            imageError = "image size should be (203 x 203)"
        } else {
            imageError = 'false'
        }
        if (imageError != "false") {
            imageSizeError(fileInfo);
        }
    } 
   
}
function imageSizeError(fileInfo) {
    fs.unlink(fileInfo.path, (err) => {
        if (err) throw err;
    });
}

module.exports = {
    
    addFoliofitMainSection: async(req, res, next) => {
        try {
            let existing = await foliofitMainSections.findOne({name:req.body.name})

            if(!existing) {
                let data = req.body;
                if (req.file) {
                    var fileInfo = req.file;
                    imageType = imageTypeSlider1;
                    checkImageSize(imageType, fileInfo);
                    if (imageError != "false") {
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    } else {
                        data.image = `foliofit/${req.file.filename}`;
                        let schemaObj = new foliofitMainSections(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: " added successfully",
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
                res.status(200).json({
                    status: false,
                    message: 'existing section'
                })
            }
        } catch (error) {
            next(error)
        }
    },
    getFoliofitMainSections: async (req, res, next) => {
        try {
            let mainSections = await foliofitMainSections.find()     
            
            res.status(200).json({
                status: false,
                message: 'success',
                data: {
                    mainSections: mainSections
                }
            })
        } catch (error) {
            next(error)
        }
    }
}