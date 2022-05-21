const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

const sizeOf = require("image-size");
const adsAd1MedFill = require("../../models/ads/profile/ad1MedFill")
const adsMedPride = require("../../models/ads/profile/medPride")
const adsReferEarn = require("../../models/ads/profile/referEarn")
const adsProfileAddress = require("../../models/ads/profile/address")


var dimensions = "";
var imageType = "";
var imageTypeAd1 = "ad1";
var imageTypeMedFill = "medFill";
var imageTypeMedPride = "medPride";
var imageTypeReferEarn = "referEarn";
var imageTypeAddress = "address";
var imageError = "false";

function checkImageSize(imageType, fileInfo) {
    if (fileInfo) {
        dimensions = sizeOf(fileInfo.path);
    }
    if (imageType == imageTypeAd1) {
        if (dimensions.width != 1604 && dimensions.height != 182) {
            imageError = "Please upload image of size 1604x182";
        }
    } else if (imageType == imageTypeMedFill) {
        if (dimensions.width != 1506 && dimensions.height != 310) {
            imageError = "Please upload image of size 1506x310";
        }
    } else if (imageType == imageTypeMedPride) {
        if (dimensions.width != 714 && dimensions.height != 425) {
            imageError = "Please upload image of size 714x425";
        }
    }  else if (imageType == imageTypeReferEarn) {
        if (dimensions.width != 1144 && dimensions.height != 1144) {
            imageError = "Please upload image of size 1144x1144";
        }
    }else if (imageType == imageTypeAddress) {
        if (dimensions.width != 1501 && dimensions.height != 632) {
            imageError = "Please upload image of size 1501x632";
        }
    } 
    else {
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
    /* Ads  Ad1MedFillMedPride 
    ============================================= */
    editAd1MedFillMedPride: async (req, res, next) => {
        try {
            imageError = 'false'
            console.log('!@#$%',req.body)
            if(req.body.type) {
                let types = ["ad1", "medFill"];
                var type = types.find((e) => e === req.body.type);
                if (type) {
                  var ExtData = await adsAd1MedFill.findOne({_id:mongoose.Types.ObjectId(req.body._id)});
                  if (!ExtData) {
                      let data = req.body;
                  if (req.file) {
                      var fileInfo = req.file;
                      imageType = type;
                      checkImageSize(imageType, fileInfo);
                      if (imageError != "false") {
                          return res.status(200).json({
                              status: false,
                              data: imageError,
                          });
                          imageError = "false";
                      } else {
                          data.image = `ads/${req.file.filename}`;
                          let schemaObj = new adsAd1MedFill(data);
                          schemaObj
                              .save()
                              .then((response) => {
                                  return res.status(200).json({
                                      status: true,
                                      data: " added successfully",
                                  });
                              })
                              .catch(async (error) => {
                                  if (req.file) {
                                      await unlinkAsync(req.file.path);
                                  }
                                  return res.status(200).json({
                                      status: false,
                                      data: error,
                                  });
                              });
                      }
                  } else {
                      return res.status(200).json({
                          status: false,
                          data: "Please upload image",
                      });
                  }
                    
                  } else {
                      if (req.file) {
                          var fileInfo = {};
                          fileInfo = req.file;
                          imageType = type;
                          checkImageSize(imageType, fileInfo);
                          if (imageError != "false") {
                              fs.unlink(fileInfo.path, (err) => {
                                  if (err) throw err;
                              });
                          } else {
                              req.body.image = `ads/${req.file.filename}`;
                              // deleting old image
                              let splittedImageRoute = ExtData.image.split("/");
                              fs.unlink(`./public/images/ads/${splittedImageRoute[1]}`, function (err) {
                                  if (err) throw err;
                                  console.log("old image deleted!");
                              });
                          }
                      }
                      if (imageError == "false") {
                          req.body.updatedAt = new Date();
                          adsAd1MedFill.updateOne({ _id:mongoose.Types.ObjectId(req.body._id) }, req.body)
                              .then((response) => {
                                  console.log('response',response);
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
                  }
                } else {
                  res.status(200).json({
                    error: true,
                    message: "invalid type",
                  });
                }
            } else {
                res.status(200).json({
                    status: false,
                    message: "parmeter missing: 'type'"
                })
            }
              
          } catch (error) {
            next(error);
          }
        
    },
    getAd1MedFillMedPride: async (req, res, next) => {
        try {
            let result = await adsAd1MedFill.find(
                { isDisabled: false },
                {
                    type: 1,
                    image: 1,
                }
            );
            for (i=0;i<result.length;i++){
                result[i].image=process.env.BASE_URL.concat(result[i].image)
            }
            
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
   
    deleteAd1MedFillMedPride: async (req, res, next) => {
        try {
            let Type= await adsAd1MedFill.findOne({ _id:mongoose.Types.ObjectId(req.params.id)});

            if (Type) {
                adsAd1MedFill.deleteOne({ _id:mongoose.Types.ObjectId(req.params.id)})
                    .then((response) => {
                        let splittedImageRoute = Type.image.split("/");
                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: " removed successfully",
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
                    data: "invalid Type",
                });
            }
        } catch (error) {
            next(error);
        }
    },
     /* Ads  MedPride 
    ============================================= */
    editMedPride: async (req, res, next) => {
        try {
            imageError = 'false'
            console.log('!@#$%',req.body)
            if(req.body.type) {
                let types = ["medPride"];
                var type = types.find((e) => e === req.body.type);
                if (type) {
                  var ExtData = await adsMedPride.findOne({_id:mongoose.Types.ObjectId(req.body._id)});
                  if (!ExtData) {
                      let data = req.body;
                  if (req.file) {
                      var fileInfo = req.file;
                      imageType = type;
                      checkImageSize(imageType, fileInfo);
                      if (imageError != "false") {
                          return res.status(200).json({
                              status: false,
                              data: imageError,
                          });
                          imageError = "false";
                      } else {
                          data.image = `ads/${req.file.filename}`;
                          let schemaObj = new adsMedPride(data);
                          schemaObj
                              .save()
                              .then((response) => {
                                  return res.status(200).json({
                                      status: true,
                                      data: " added successfully",
                                  });
                              })
                              .catch(async (error) => {
                                  if (req.file) {
                                      await unlinkAsync(req.file.path);
                                  }
                                  return res.status(200).json({
                                      status: false,
                                      data: error,
                                  });
                              });
                      }
                  } else {
                      return res.status(200).json({
                          status: false,
                          data: "Please upload image",
                      });
                  }
                    
                  } else {
                      if (req.file) {
                          var fileInfo = {};
                          fileInfo = req.file;
                          imageType = type;
                          checkImageSize(imageType, fileInfo);
                          if (imageError != "false") {
                              fs.unlink(fileInfo.path, (err) => {
                                  if (err) throw err;
                              });
                          } else {
                              req.body.image = `ads/${req.file.filename}`;
                              // deleting old image
                              let splittedImageRoute = ExtData.image.split("/");
                              fs.unlink(`./public/images/ads/${splittedImageRoute[1]}`, function (err) {
                                  if (err) throw err;
                                  console.log("old image deleted!");
                              });
                          }
                      }
                      if (imageError == "false") {
                          req.body.updatedAt = new Date();
                          adsMedPride.updateOne({ _id:mongoose.Types.ObjectId(req.body._id) }, req.body)
                              .then((response) => {
                                  console.log('response',response);
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
                  }
                } else {
                  res.status(200).json({
                    error: true,
                    message: "invalid type",
                  });
                }
            } else {
                res.status(200).json({
                    status: false,
                    message: "parmeter missing: 'type'"
                })
            }
              
          } catch (error) {
            next(error);
          }
        
    },
    getMedPride: async (req, res, next) => {
        try {
            let result = await adsMedPride.find(
                { isDisabled: false },
                {
                    type: 1,
                    image: 1,
                }
            );
            for (i=0;i<result.length;i++){
                result[i].image=process.env.BASE_URL.concat(result[i].image)
            }
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getSingleMedPride: async (req, res, next) => {
        try {
            let result = await adsMedPride.findOne(
                { _id:mongoose.Types.ObjectId(req.params.id)},
                {
                    type: 1,
                    image: 1,
                }
            );
            
                result.image=process.env.BASE_URL.concat(result.image)
            
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
   
    deleteMedPride: async (req, res, next) => {
        try {
            let Type= await adsMedPride.findOne({ _id:mongoose.Types.ObjectId(req.params.id)});

            if (Type) {
                adsMedPride.deleteOne({ _id:mongoose.Types.ObjectId(req.params.id)})
                    .then((response) => {
                        let splittedImageRoute = Type.image.split("/");
                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: " removed successfully",
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
                    data: "invalid Type",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    editReferEarn: async (req, res, next) => {
        try {
            imageError = 'false'
            console.log('!@#$%',req.body)
              let types = "referEarn";
              var type = types === req.body.type;
              if (type) {
                var ExtData = await adsReferEarn.findOne({_id:mongoose.Types.ObjectId(req.body._id)});
                if (!ExtData) {
                    let data = req.body;
                if (req.file) {
                    var fileInfo = req.file;
                    console.log('**fileInfo***',fileInfo)
                    imageType = req.body.type;
                    console.log('**imageType***',imageType)
                    checkImageSize(imageType, fileInfo);
                    if (imageError != "false") {
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    } else {
                        data.image = `ads/${req.file.filename}`;
                        let schemaObj = new adsReferEarn(data);
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
                    if (req.file) {
                        var fileInfo = {};
                        fileInfo = req.file;
                        imageType = type;
                        checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                            });
                        } else {
                            req.body.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = ExtData.image.split("/");
                            fs.unlink(`./public/images/ads/${splittedImageRoute[1]}`, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }
                    }
                    if (imageError == "false") {
                        req.body.updatedAt = new Date();
                        adsReferEarn.updateOne({ _id:mongoose.Types.ObjectId(req.body._id) }, req.body)
                            .then((response) => {
                                console.log('response',response);
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
                }
              } else {
                res.status(200).json({
                  error: true,
                  message: "invalid type",
                });
              }
          } catch (error) {
            next(error);
          }
        
    },
    getReferEarn: async (req, res, next) => {
        try {
            let result = await adsReferEarn.find(
                { isDisabled: false },
                {
                    title: 1,
                    image: 1,
                }
            );
            for (i=0;i<result.length;i++){
                result[i].image=process.env.BASE_URL.concat(result[i].image)
            }
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
   
    deleteReferEarn: async (req, res, next) => {
        try {
            let Type= await adsReferEarn.findOne({ _id:mongoose.Types.ObjectId(req.params.id)});

            if (Type) {
                adsReferEarn.deleteOne({ _id:mongoose.Types.ObjectId(req.params.id)})
                    .then((response) => {
                        let splittedImageRoute = Type.image.split("/");
                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: " removed successfully",
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
                    data: "invalid Type",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    /* Ads profile address
    ============================================= */
    getAdsAddress: async (req, res, next) => {
        try {
            let result = await adsProfileAddress.find(
                { sliderType: "address", isDisabled: false },
                {
                    type: 1,
                    typeId: 1,
                    image: 1,
                    sliderType: 1,
                }
            );
            for (i=0;i<result.length;i++){
                result[i].image=process.env.BASE_URL.concat(result[i].image)
            }
            
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    editAdsAddress: async (req, res, next) => {
        try {
            let data = req.body;
                if (data.sliderId) {
                    let slider = await adsProfileAddress.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });

                    if (slider) {
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
                        adsProfileAddress.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                        var fileInfo = req.file;
                        imageType = "address";
                        checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            res.status(200).json({
                                status: false,
                                data: imageError,
                            });
                            imageError = "false";
                        } else {
                            data.image = `ads/${req.file.filename}`;
                            data.sliderType = "address";
                            let schemaObj = new adsProfileAddress(data);
                            schemaObj
                                .save()
                                .then((response) => {
                                    res.status(200).json({
                                        status: true,
                                        data: "Address added successfully",
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
    deleteAdsAddress: async (req, res, next) => {
        try {
            let Type= await adsProfileAddress.findOne({ _id:mongoose.Types.ObjectId(req.params.id)});

            if (Type) {
                adsProfileAddress.deleteOne({ _id:mongoose.Types.ObjectId(req.params.id)})
                    .then((response) => {
                        let splittedImageRoute = Type.image.split("/");
                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: " removed successfully",
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
                    data: "invalid Type",
                });
            }
        } catch (error) {
            next(error);
        }
    }

}