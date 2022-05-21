const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

const sizeOf = require("image-size");
const adsMedCoinAd1Ad2HowItWorks = require("../../models/ads/medcoin/medCoinAd1Ad2HowItWorks")


var dimensions = "";
var imageType = "";
var imageTypeAd1 = "ad1";
var imageTypeAd2 = "ad2";
var imageTypeHowItWorks = "howItWorks";
var imageTypeDisclaimer = "disclaimer";
var imageError = "false";

function checkImageSize(imageType, fileInfo) {
    if (fileInfo) {
        dimensions = sizeOf(fileInfo.path);
    }
    if (imageType == imageTypeAd1) {
        if (dimensions.width != 1514 && dimensions.height != 386) {
            imageError = "Please upload image of size 1514x386";
        }
    } else if (imageType == imageTypeAd2) {
        if (dimensions.width != 1523 && dimensions.height != 344) {
            imageError = "Please upload image of size 1523x344";
        }
    } else if (imageType == imageTypeHowItWorks) {
        if (dimensions.width != 1500 && dimensions.height != 390) {
            imageError = "Please upload image of size 1500x390";
        }
    }else if (imageType == imageTypeDisclaimer) {
        if (dimensions.width != 1500 && dimensions.height != 390) {
            imageError = "Please upload image of size 1500x390";
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
    /* Ads MedCoin Ad1 
    ============================================= */
    medCoinAd1Ad2HowItWorks: async (req, res, next) => {
        try {
            console.log('!@#$%',req.body)
            if(req.body.type) {
                let types = ["ad1", "ad2", "howItWorks","disclaimer"];
                var type = types.find((e) => e === req.body.type);
                if (type) {
                  var ExtData = await adsMedCoinAd1Ad2HowItWorks.findOne({type:req.body.type});
                  if (!ExtData) {
                      let data = req.body;
                    if (req.file) {
                        var fileInfo = req.file;
                        imageType = req.body.type;
                        checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                            });

                            return res.status(200).json({
                                status: false,
                                data: imageError,
                            });
                            // imageError = "false";
                        } else {
                            data.image = `ads/${req.file.filename}`;
                            let schemaObj = new adsMedCoinAd1Ad2HowItWorks(data);
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
                      if(req.body.image == 'null') {
                          delete req.body.image
                      }

                      if (req.file) {
                          var fileInfo = {};
                          fileInfo = req.file;
                          imageType = type;
                          checkImageSize(imageType, fileInfo);
                          if (imageError != "false") {
                              fs.unlink(fileInfo.path, (err) => {
                                  if (err) throw err;
                              });

                              return res.status(200).json({
                                status: false,
                                data: imageError,
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
                          adsMedCoinAd1Ad2HowItWorks.updateOne({ type:req.body.type }, req.body)
                              .then((response) => {
                                  console.log('response',response);
                                      return res.status(200).json({
                                          status: true,
                                          data: "Updated"
                                      });
                              })
                              .catch((error) => {
                                  return res.status(200).json({
                                      status: false,
                                      data: error,
                                  });
                              });
                      } else {
                          return res.status(200).json({
                              status: false,
                              data: imageError,
                          });
                          imageError = "false";
                      }
                  }
                } else {
                  return res.status(200).json({
                    error: true,
                    message: "invalid type",
                  });
                }
            } else {
                return res.status(200).json({
                    status: false,
                    message: "parameter missing: 'type'"
                })
            }
          } catch (error) {
            next(error);
          }
        
    },
    getMedCoinAd1Ad2HowItWorks: async (req, res, next) => {
        try {
            // let types = ["ad1", "ad2", "howItWorks","disclaimer"];
                // var type = types.find((e) => e === req.params.type);

                // if(type) {
                    let result = await adsMedCoinAd1Ad2HowItWorks.find(
                        {  isDisabled: false },
                        {
                            type: 1,
                            image: 1,
                        }).lean()
                          for(i=0;i<result.length;i++){
                    result[i].image = process.env.BASE_URL.concat(result[i].image)
                          }
                        res.status(200).json({
                            status: true,
                            message: 'success',
                            data: result,
                        });
                // } else {
                //     res.status(200).json({
                //         status: false,
                //         message: 'invalid type'
                //     })
                // }
        } catch (error) {
            next(error);
        }
    },
   
    deleteMedCoinAd1Ad2HowItWorks: async (req, res, next) => {
        try {
            let Type= await adsMedCoinAd1Ad2HowItWorks.findOne({ type:req.params.type});

            if (Type) {
                adsMedCoinAd1Ad2HowItWorks.deleteOne({ type: req.params.type })
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
                            data: "ad7 removed successfully",
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