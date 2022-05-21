const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const mongoose = require('mongoose')

const sizeOf = require("image-size");
const WebHomeSlider = require('../../../models/ads/web/webHomeSlider')
const WebBanner = require('../../../models/ads/web/webBanner')

let imageError = "false";

function checkImageSize(imageType, fileInfo) {
    if (fileInfo) {
        dimensions = sizeOf(fileInfo.path);
    }
    if (imageType == "webHomeSlider") {
        if (dimensions.width != 1349 && dimensions.height != 265) {
            imageError = "Please upload image of size 1349 * 265";
        }
    } else if (imageType == "webBanner") {
        if (dimensions.width != 1349 && dimensions.height != 183) {
            imageError = "Please upload image of size 1349 * 183";
        }
    } else {
        imageError = "false";
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
    addWebHomeSlider: async (req, res, next) => {
        try {
            let params = req.body

            // checking for redirection type
            if(params.redirection_type != 'product' && params.redirection_type != 'category') {
                if(req.file) {
                    fs.unlink(req.file.path, (err) => {
                        if (err) throw err;
                    });
                }
                return res.status(422).json({
                    error: true,
                    message: 'invalid redirection_type'
                })
            }

            // checking for image
            if(!req.file) {
                return res.status(422).json({
                    error: true,
                    message: 'Please upload image'
                })
            } else {
                let fileInfo = req.file;
                imageType = "webHomeSlider";
                checkImageSize(imageType, fileInfo);

                if (imageError != "false") {
                    return res.status(200).json({
                        error: true,
                        message: imageError,
                    });
                    imageError = "false";
                }
            }

            // checking for redirection id
            if(!params.redirection_id) {
                fs.unlink(req.file.path, (err) => {
                    if (err) throw err;
                });
                return res.status(422).json({
                    error: true,
                    message: 'redirection_id missing'
                })
            }

            let data = {
                redirection_type: params.redirection_type,
                redirection_id: params.redirection_id,
                image: `ads/${req.file.filename}`
            }

            let schemaObj = WebHomeSlider(data)

            schemaObj.save().then((response) => {
                return res.status(200).json({
                    error: false,
                    message: 'Slider added successfully'
                })
            })

        } catch (error) {
            if(req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) throw err;
                });
            }
            next(error)
        }
    },
    getAllWebHomeSliders: async (req, res, next) => {
        try {
            let result = await WebHomeSlider.aggregate([
                {
                    $project:{
                        redirection_id: 1,
                        redirection_type: 1,
                        image: { $concat: [process.env.BASE_URL, "$image"] },
                    }
                }
            ])

            return res.status(200).json({
                error: false,
                message: 'Web home sliders are',
                data: {
                    sliders: result
                }
            })

        } catch (error) {
            next(error)
        }
    },
    getWebHomeSlider: async (req, res, next) => {
        try {
            let result = await WebHomeSlider.aggregate([
                {$match:{_id: mongoose.Types.ObjectId(req.params.id)}},
                {
                    $project:{
                        redirection_id: 1,
                        redirection_type: 1,
                        image: { $concat: [process.env.BASE_URL, "$image"] },
                    }
                }
            ])

            if(result.length == 0) {
                return res.status(200).json({
                    error: true,
                    message: 'Invalid id'
                })  
            }

            return res.status(200).json({
                error: false,
                message: 'Web home slider is',
                data: {
                    slider: result[0]
                }
            })

        } catch (error) {
            next(error)
        }
    },
    editWebHomeSlider: async (req, res, next) => {
        try {
            let params = req.body

            // checking for redirection type
            if(params.redirection_type != 'product' && params.redirection_type != 'category') {
                if(req.file) {
                    fs.unlink(req.file.path, (err) => {
                        if (err) throw err;
                    });
                }
                return res.status(422).json({
                    error: true,
                    message: 'invalid redirection_type'
                })
            }

            let imagePath = ''

            // checking for image
            if(req.file) {
                let fileInfo = req.file;
                imageType = "webHomeSlider";
                checkImageSize(imageType, fileInfo);

                if (imageError != "false") {
                    return res.status(200).json({
                        error: true,
                        message: imageError,
                    });
                    imageError = "false";
                } else {
                    imagePath = `ads/${req.file.filename}`
                }
            }

            // checking for redirection id
            if(!params.redirection_id) {
                if(req.file) {
                    fs.unlink(req.file.path, (err) => {
                        if (err) throw err;
                    });
                }
                
                return res.status(422).json({
                    error: true,
                    message: 'redirection_id missing'
                })
            }

            // checking for valid id
            let validId = await WebHomeSlider.findOne({_id: mongoose.Types.ObjectId(req.params.id)})

            if(!validId) {
                if(req.file) {
                    fs.unlink(req.file.path, (err) => {
                        if (err) throw err;
                    });
                }

                return res.status(422).json({
                    error: true,
                    message: 'Invalid id'
                })
            }

            let data = {
                redirection_type: params.redirection_type,
                redirection_id: params.redirection_id,
                image: imagePath
            }

            if(params.image == 'null') {
                delete data.image
            }

            WebHomeSlider.updateOne({_id: mongoose.Types.ObjectId(req.params.id)},data).then((response) => {
                return res.status(200).json({
                    error: false,
                    message: 'Slider updated successfully'
                })
            })

        } catch (error) {
            if(req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) throw err;
                });
            }
            next(error)
        }
    },
    deleteWebHomeSlider: async (req, res, next) => {
        try {
            let result = await WebHomeSlider.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)})

            return res.status(200).json({
                error: false,
                message: 'Slider deleted'
            })

        } catch (error) {
            next(error)
        }
    },
    addWebBanner: async (req, res, next) => {
        try {
            let params = req.body

            // checking for redirection type
            if(params.redirection_type != 'product' && params.redirection_type != 'category') {
                if(req.file) {
                    fs.unlink(req.file.path, (err) => {
                        if (err) throw err;
                    });
                }
                return res.status(422).json({
                    error: true,
                    message: 'invalid redirection_type'
                })
            }

            // checking for image
            if(!req.file) {
                return res.status(422).json({
                    error: true,
                    message: 'Please upload image'
                })
            } else {
                let fileInfo = req.file;
                imageType = "webBanner";
                checkImageSize(imageType, fileInfo);

                if (imageError != "false") {
                    res.status(200).json({
                        error: true,
                        message: imageError,
                    });
                    imageError = "false";
                }
            }

            // checking for redirection id
            if(!params.redirection_id) {
                fs.unlink(req.file.path, (err) => {
                    if (err) throw err;
                });
                return res.status(422).json({
                    error: true,
                    message: 'redirection_id missing'
                })
            }

            let data = {
                redirection_type: params.redirection_type,
                redirection_id: params.redirection_id,
                image: `ads/${req.file.filename}`
            }

            let schemaObj = WebBanner(data)

            schemaObj.save().then((response) => {
                return res.status(200).json({
                    error: false,
                    message: 'Banner added successfully'
                })
            })

        } catch (error) {
            if(req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) throw err;
                });
            }
            next(error)
        }
    },
    getAllWebBanners: async (req, res, next) => {
        try {

            let result = await WebBanner.aggregate([
                {
                    $project:{
                        redirection_id: 1,
                        redirection_type: 1,
                        image: { $concat: [process.env.BASE_URL, "$image"] },
                    }
                }
            ])

            return res.status(200).json({
                error: false,
                message: 'Banners are',
                data: {
                    banners: result
                }
            })

        } catch (error) {
            next(error)
        }
    },
    getWebBanner: async (req, res, next) => {
        try {

            let result = await WebBanner.aggregate([
                {$match:{_id: mongoose.Types.ObjectId(req.params.id)}},{
                    $project:{
                        redirection_id: 1,
                        redirection_type: 1,
                        image: { $concat: [process.env.BASE_URL, "$image"] },
                    }
                }
            ])

            if(!result.length) {
                return res.status(200).json({
                    error: true,
                    message: 'Invalid id'
                })  
            }

            return res.status(200).json({
                error: false,
                message: 'Banner is',
                data: {
                    banners: result[0]
                }
            })

        } catch (error) {
            next(error)
        }
    },
    editWebBanner: async (req, res, next) => {
        try {
            let params = req.body

            // checking for redirection type
            if(params.redirection_type != 'product' && params.redirection_type != 'category') {
                if(req.file) {
                    fs.unlink(req.file.path, (err) => {
                        if (err) throw err;
                    });
                }
                return res.status(422).json({
                    error: true,
                    message: 'invalid redirection_type'
                })
            }

            let imagePath = ''

            // checking for image
            if(req.file) {
                let fileInfo = req.file;
                imageType = "webHomeSlider";
                checkImageSize(imageType, fileInfo);

                if (imageError != "false") {
                    return res.status(200).json({
                        error: true,
                        message: imageError,
                    });
                    imageError = "false";
                } else {
                    imagePath = `ads/${req.file.filename}`
                }
            }

            // checking for redirection id
            if(!params.redirection_id) {
                if(req.file) {
                    fs.unlink(req.file.path, (err) => {
                        if (err) throw err;
                    });
                }
                
                return res.status(422).json({
                    error: true,
                    message: 'redirection_id missing'
                })
            }

            // checking for valid id
            let validId = await WebBanner.findOne({_id: mongoose.Types.ObjectId(req.params.id)})

            if(!validId) {
                if(req.file) {
                    fs.unlink(req.file.path, (err) => {
                        if (err) throw err;
                    });
                }

                return res.status(422).json({
                    error: true,
                    message: 'Invalid id'
                })
            }

            let data = {
                redirection_type: params.redirection_type,
                redirection_id: params.redirection_id,
                image: imagePath
            }

            if(params.image == 'null') {
                delete data.image
            }

            WebBanner.updateOne({_id: mongoose.Types.ObjectId(req.params.id)},data).then((response) => {
                return res.status(200).json({
                    error: false,
                    message: 'Banner updated successfully'
                })
            })

        } catch (error) {
            if(req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) throw err;
                });
            }
            next(error)
        }
    },
    deleteWebBanner: async (req, res, next) => {
        try {

            let result = await WebBanner.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)})

            return res.status(200).json({
                error: false,
                message: 'Banner deleted',
            })

        } catch (error) {
            next(error)
        }
    }
}