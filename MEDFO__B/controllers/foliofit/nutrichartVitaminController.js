const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const NutrichartVitamin = require("../../models/foliofit/nutrichartVitamin");

const imgPath = process.env.BASE_URL

module.exports = {
    
    addNutrichartVitamin: async (req, res, next) => {
        try {
            let data = req.body;
            data.image = `foliofit/${req.file.filename}`;
            let existingVitamin = await NutrichartVitamin.findOne({ title: data.title });
            if (!existingVitamin) {
                if (req.file) {
                    data.image = `foliofit/${req.file.filename}`;
                    data.createdBy = req.user._id
                    let schemaObj = new NutrichartVitamin(data);
                    schemaObj
                        .save()
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "Vitamin added successfully",
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
                    data: "Existing Vitamin",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    getAllNutrichartVitamins: async (req, res, next) => {
        try {
            let result = await NutrichartVitamin.find(
                { isDisabled: false },
                {
                    title: 1,
                    image:{ $concat: [ imgPath,"$image" ] },
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

    editNutrichartVitamin: async (req, res, next) => {
        try {
            let data = req.body;

            if (data.vitaminId) {
                let vitamin = await NutrichartVitamin.findOne({ _id: mongoose.Types.ObjectId(data.vitaminId) });

                if (vitamin) {
                    data.image = vitamin.image
                    if (req.file) {
                        data.image = `foliofit/${req.file.filename}`;
                        // deleting old image
                        let splittedImageRoute = vitamin.image.split("/");
                        console.log("splitted::", splittedImageRoute);
                        let path = `./public/images/foliofit/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }
                    }
                    data.updatedAt = new Date();
                    data.updatedBy = req.user._id
                    NutrichartVitamin.updateOne({ _id: mongoose.Types.ObjectId(data.vitaminId) }, data)
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
                        data: "invalid vitaminId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "please enter vitaminId",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    deleteNutrichartVitamin: async (req, res, next) => {
        try {
            let vitamin = await NutrichartVitamin.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (vitamin) {
                NutrichartVitamin.deleteOne({ _id: req.params.id })
                    .then((response) => {
                        let splittedImageRoute = vitamin.image.split("/");                       
                        let path = `./public/images/foliofit/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }
                        res.status(200).json({
                            status: true,
                            data: "Vitamin removed",
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
                    data: "invalid VitaminId",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    getNutrichartVitaminsById: async (req, res, next) => {
        try {
            let result = await NutrichartVitamin.findOne(
                {
                    _id: mongoose.Types.ObjectId(req.params.id),
                },
                { 
                    title: 1,
                    image:{ $concat: [ imgPath,"$image" ] },
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
};
