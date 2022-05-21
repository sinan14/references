const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const sizeOf = require("image-size");
const FoliofitYoga = require("../../models/foliofit/foliofitYoga");
const FoliofitMasterYogaMainCategory = require("../../models/foliofit/foliofitMasterYogaMain");
const FoliofitMasterYogaHealthyRecommended = require("../../models/foliofit/foliofitMasterYogaHealthyRecommended");
const FoliofitMasterYogaWeekly = require("../../models/foliofit/foliofitMasterYogaWeekly");
const Read = require("../../models/read")
const Save = require("../../models/save") 
const Share = require("../../models/share")

const baseUrl = process.env.BASE_URL;

var imageError = "";
var fileType = "";
var dimensions = "";

let Vimeo = require("vimeo").Vimeo;
const dotenv = require("dotenv");
dotenv.config({
    path: "../config.env",
});
let client = new Vimeo(process.env.VIMEO_CLIENT_ID, process.env.VIMEO_CLIENT_SECRET, process.env.VIMEO_ACCESS_TOKEN);

function checkfileType(fileType, fileInfo) {
    //imageError = ""
    if (fileType == "video") {
        if (
            fileInfo.mimetype === "video/mp4" ||
            fileInfo.mimetype === "video/avi" ||
            fileInfo.mimetype === "video/x-flv" ||
            fileInfo.mimetype === "video/x-ms-wmv" ||
            fileInfo.mimetype === "video/3gpp"
        ) {
        } else {
            imageError += "Video file type is not supported check with another file type. ";
        }
    } else if (fileType == "thumbnail") {
        if (
            fileInfo.mimetype == "image/png" ||
            fileInfo.mimetype == "image/jpeg" ||
            fileInfo.mimetype == "image/svg+xml" ||
            fileInfo.mimetype == "image/jpg" ||
            fileInfo.mimetype == "image/gif"
        ) {
            dimensions = sizeOf(fileInfo.path);
            if (dimensions.width != 1501 && dimensions.height != 815) {
                imageError += "please upload images with size(1501 * 815)";
            }
        } else {
            imageError += "Image file type is not supported check with another file type. ";
        }
    } else {
        imageError = "";
    }
}

function unlinkImage(video, thumbnail) {
    if (video) {
        video.map(async (e) => {
            await unlinkAsync(e.path);
        });
    }
    if (thumbnail) {
        thumbnail.map(async (e) => {
            await unlinkAsync(e.path);
        });
    }
}

module.exports = {

    /* Foliofit Yoga Videos 
    ============================================= */
    addFoliofitYogaVideoOld: async (req, res, next) => {
        try {
            imageError = "";
            if (req.files.video && req.files.thumbnail) {
                var fileInfoVideo = {};
                var fileInfoThumbnail = {};
                fileInfoVideo = req.files.video[0];
                fileType = "video";
                checkfileType(fileType, fileInfoVideo);
                fileInfoThumbnail = req.files.thumbnail[0];
                fileType = "thumbnail";
                checkfileType(fileType, fileInfoThumbnail);

                if (imageError != "") {
                    unlinkImage(req.files.video, req.files.thumbnail);
                    res.status(422).json({
                        status: false,
                        data: imageError,
                    });
                } else {
                    let result = await FoliofitYoga.findOne({ title: req.body.title });
                    if (result) {
                        unlinkImage(req.files.video, req.files.thumbnail);
                        res.status(200).json({
                            status: false,
                            data: "Title Exist",
                        });
                    } else {
                        let file_name = `./public/images/foliofit/${fileInfoVideo.filename}`;
                        await client.upload(
                            file_name,
                            {
                                name: req.body.title,
                                description: "The description goes here.",
                            },
                            function (uri) {
                                let splittedUri = uri.split("/");
                                let data = {
                                    title: req.body.title,
                                    video: splittedUri[2],
                                    thumbnail: `foliofit/${fileInfoThumbnail.filename}`,
                                    workoutTime: req.body.workoutTime,
                                    createdBy: req.user.id,
                                };
                                let schemaObj = new FoliofitYoga(data);
                                schemaObj
                                    .save()
                                    .then((response) => {
                                        unlinkImage(req.files.video);
                                        res.status(200).json({
                                            status: true,
                                            data: "Foliofit video added successfully",
                                        });
                                    })
                                    .catch(async (error) => {
                                        unlinkImage(req.files.video, req.files.thumbnail);
                                        res.status(422).json({
                                            status: false,
                                            data: "1" + error,
                                        });
                                    });
                            },
                            function (bytes_uploaded, bytes_total) {
                                var percentage = ((bytes_uploaded / bytes_total) * 100).toFixed(2);
                                console.log(percentage + "%");
                            },
                            function (error) {
                                unlinkImage(req.files.video, req.files.thumbnail);
                                res.status(429).json({
                                    status: false,
                                    error: error,
                                });
                                // console.log('Failed because: ' + error)
                                // throw error
                            }
                        );

                        // let data = {
                        //     title: req.body.title,
                        //     video: `foliofit/${fileInfoVideo.filename}`,
                        //     thumbnail: `foliofit/${fileInfoThumbnail.filename}`,
                        //     workoutTime: req.body.workoutTime,
                        //     createdBy : req.user.id
                        // };
                        // let schemaObj = new FoliofitYoga(data);
                        // schemaObj
                        //     .save()
                        //     .then((response) => {
                        //         imageError = "";
                        //         res.status(200).json({
                        //             status: true,
                        //             data: "Yoga video added successfully",
                        //         });
                        //     })
                        //     .catch(async (error) => {
                        //         if (req.file) {
                        //             unlinkImage(req.files.video, req.files.thumbnail);
                        //            // await unlinkAsync(req.file.path);
                        //         }
                        //         imageError = "";
                        //         res.status(200).json({
                        //             status: false,
                        //             data: error,
                        //         });
                        //     });
                    }
                }
            } else {
                unlinkImage(req.files.video, req.files.thumbnail);
                res.status(422).json({
                    status: false,
                    data: "Please upload files",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    addFoliofitYogaVideo: async (req, res, next) => {
        try {
            if (req.files.thumbnail && req.files.video) {
                let result = await FoliofitYoga.findOne({ title: req.body.title });
                if (result) {
                    unlinkImage(req.files.video, req.files.thumbnail);
                    res.status(200).json({
                        status: false,
                        data: "Title already exist",
                    });
                } else {
                   
                    let data = {
                        title: req.body.title,
                        video: "",
                        thumbnail: `foliofit/${req.files.thumbnail[0].filename}`,
                        workoutTime: req.body.workoutTime,
                        createdBy: req.user.id,
                    };
                    let file_name = `./public/images/foliofit/${req.files.video[0].filename}`;
                    await client.upload(
                        file_name,
                        {
                            name: "Hi",
                            description: "The description goes here.",
                        },
                        function (uri) {
                            unlinkImage(req.files.video);
                            let splittedUri = uri.split("/");
                            data.video = splittedUri[2];
                            let obj = FoliofitYoga(data);
                            obj.save()
                                .then((_) => {
                                    res.status(200).json({
                                        status: true,
                                        data: "Yoga video Added Successfully",
                                    });
                                })
                                .catch((error) => {
                                    unlinkImage(req.files.video, req.files.thumbnail);
                                    res.status(200).json({
                                        status: false,
                                        data: error,
                                    });
                                });
                        },
                        function (bytes_uploaded, bytes_total) {
                            var percentage = ((bytes_uploaded / bytes_total) * 100).toFixed(2);
                            console.log(percentage + "%");
                        },
                        function (error) {
                            unlinkImage(req.files.video, req.files.thumbnail);
                            res.status(200).json({
                                status: false,
                                data: error,
                            });
                        }
                    );
                }
               
            } else {
                unlinkImage(req.files.video, req.files.thumbnail);
                res.status(200).json({
                    status: false,
                    data: "Please Upload all Files",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    
    editFoliofitYogaVideo: async (req, res, next) => {
        try {
            let existingVideo = await FoliofitYoga.findOne({ _id: req.params.id });
            if (existingVideo) {
                let result = await FoliofitYoga.findOne({ title: req.body.title , _id: { $ne: req.params.id  }});
                if (result) {
                    unlinkImage(req.files.video, req.files.thumbnail);
                    res.status(200).json({
                        status: false,
                        data: "Title already exist",
                    });
                } else {
                
                    let data = {
                        title: req.body.title,
                        workoutTime: req.body.workoutTime,
                        thumbnail: existingVideo.thumbnail,
                        video: existingVideo.video,
                        updatedBy: req.user.id,
                    };
                    if (req.files.thumbnail) {
                        fs.unlink(`./public/images/${data.thumbnail}`, function (err) {
                            if (err) throw err;
                            console.log("old Thumbnail deleted!");
                        });
                        data.thumbnail = `foliofit/${req.files.thumbnail[0].filename}`;
                    }

                    if (req.files.video) {
                        let file_name = `./public/images/foliofit/${req.files.video[0].filename}`;
                        await client.upload(
                            file_name,
                            {
                                name: "Hi",
                                description: "The description goes here.",
                            },
                            function (uri) {
                                unlinkImage(req.files.video);
                                let splittedUri = uri.split("/");
                                data.video = splittedUri[2];
                                FoliofitYoga.updateOne({ _id: req.params.id }, data).then((response) => {
                                    if (response.nModified == 1) {
                                        res.status(200).json({
                                            status: true,
                                            data: "Yoga Updated Successfully",
                                        });
                                    } else {
                                        res.status(200).json({
                                            status: true,
                                            data: "No Changes",
                                        });
                                    }
                                });
                            },
                            function (bytes_uploaded, bytes_total) {
                                var percentage = ((bytes_uploaded / bytes_total) * 100).toFixed(2);
                                console.log(percentage + "%");
                            },
                            function (error) {
                                unlinkImage(req.files.video, req.files.thumbnail);
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            }
                        );
                    } else {
                        FoliofitYoga.updateOne({ _id: req.params.id }, data).then((response) => {
                            if (response.nModified == 1) {
                                res.status(200).json({
                                    status: true,
                                    data: "Yoga Updated Successfully",
                                });
                            } else {
                                res.status(200).json({
                                    status: true,
                                    data: "No Changes",
                                });
                            }
                        });
                    }
                }
            } else {
                unlinkImage(req.files.video, req.files.thumbnail);
                res.status(200).json({
                    status: false,
                    data: "Invalid Id",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    getAllPaginatedFoliofitYogaVideo: async (req, res, next) => {
        try {
            var limit = parseInt(req.body.limit);
            if (limit == 0) limit = 10;
            var skip = (parseInt(req.body.page) - 1) * parseInt(limit);
            let result = await FoliofitYoga.find(
                {},
                {
                    title: 1,
                    workoutTime: 1,
                    video: 1,
                    thumbnail: { $concat: [baseUrl, "$thumbnail"] },
                }
            )
                .sort("-id")
                .limit(limit)
                .skip(skip)
                .exec(function (err, wins) {
                    res.status(200).json({
                        status: true,
                        data: wins,
                    });
                });
        } catch (error) {
            next(error);
        }
    },

    searchFoliofitYogaVideo: async (req, res, next) => {
        try {
            let keyword = req.body.keyword;
            if (keyword) {
                let result = await FoliofitYoga.find({
                    title: { $regex:`${keyword}`, $options: "i" }
                },
                {
                    title:1,
                    video:1,
                    thumbnail:{ $concat: [ baseUrl,"$thumbnail" ] },
                }).lean();
                res.status(200).json({
                    status: true,
                    data: result,
                });
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter search keyword",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    getFoliofitYogaVideoCategories: async (req, res, next) => {
        try {
            let resultMain = await FoliofitMasterYogaMainCategory.find({}, { title: 1 });
            let resultOther = await FoliofitMasterYogaHealthyRecommended.find({}, { title: 1 });
            let resultWeekly = await FoliofitMasterYogaWeekly.find({}, { title: 1 });
            let categories = resultMain.concat(resultOther, resultWeekly);
            if (categories) {
                res.status(200).json({
                    status: true,
                    data: categories,
                });
            } else {
                res.status(200).json({
                    status: false,
                    data: "Categories not found",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    getFoliofitYogaVideoById: async (req, res, next) => {
        try {
            let result = await FoliofitYoga.find(
                { _id: mongoose.Types.ObjectId(req.params.id) },
                {
                    title: 1,
                    thumbnail: { $concat: [baseUrl, "$thumbnail"] },
                    video: 1,
                    workoutTime: 1,
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
    
    getAllFoliofitPopularYogaVideos: async (req, res, next) => {
        try {
            let result = await FoliofitYoga.find(
                {},
                {
                    title: 1,
                    thumbnail: { $concat: [baseUrl, "$thumbnail"] },
                    video: 1,
                    workoutTime: 1,
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

    /* Foliofit Yoga Videos Listing Based on Category Id in foliofit Master Yoga  All Categories
    ============================================= */

    getFoliofitYogaVideoByCategory: async(req, res, next) => {
        try {           
            let categoryId = req.params.categoryId;
            let result = []
            resultMain = await FoliofitMasterYogaMainCategory.findOne({ _id: mongoose.Types.ObjectId(categoryId) },
            {videos:1});
            resultOther = await FoliofitMasterYogaHealthyRecommended.findOne({ _id: mongoose.Types.ObjectId(categoryId) },{videos:1});          
            

            resultWeekly = await FoliofitMasterYogaWeekly.findOne({ _id: mongoose.Types.ObjectId(categoryId) },{videos:1});  
            if(resultMain){
                result = resultMain
            }else if(resultOther){
               result = resultOther
            }else{
                result = resultWeekly
            }
            if(result){
                let videos = await FoliofitYoga.find({"_id" : {"$in" : result.videos}},
                {
                    title:1,
                    thumbnail:{ $concat: [ baseUrl,"$thumbnail" ] },
                    video:1,
                    workoutTime:1,
                }); 
                if(videos.length!=0){
                    res.status(200).json({
                        status: true,
                        data: videos,
                    });
                }else{
                    res.status(200).json({
                        status: false,
                        data: "No videos found",
                    });
                }   

            }
            else{
                res.status(200).json({
                    status: false,
                    data: "Please Check the category Id",
                });
            }
       
        } catch (error) {
            next(error);
        }
    },
    deleteVideo:async(req,res,next)=>{
        try {
            let isSaved =  Save.find({
                type: "yoga",
                contentId: mongoose.Types.ObjectId(req.params.id),

            });
            if(isSaved){
                await Save.deleteMany({
                  type: "yoga",
                  contentId: mongoose.Types.ObjectId(req.params.id),
                })
              }
            await FoliofitYoga.deleteOne({_id:req.params.id}).then((response)=>{
                res.status(200).json({
                    status: true,
                    data:'Deleted FolioFit Yoga video ',
                });  
            })
        } catch (error) {
            
        }
    },
    listPopularYogaVideo:async(req,res,next)=>{
        try {
            let data = await Read.aggregate([{ $match:{type: "yoga" }},{
                $project:{
                  _id: 1,
                  type: 1,
                  contentId: 1,
                  read_count:1
                }},{
                  $sort:{'read_count':1}
                },
                { $limit : 100 }
            ]);
        
            let result = []
        
            for(single of data) {
              let video = await FoliofitYoga.findOne({_id:mongoose.Types.ObjectId(single.contentId)},{
                title:1,
                video:1,
                thumbnail:{ $concat: [ baseUrl,"$thumbnail" ] },
                workoutTime:1
              }).lean()
              if(video){
                let count = await Save.countDocuments({
                  contentId: mongoose.Types.ObjectId(video._id),
                });
                video.likes = count;
                //Share
                let shared = await Share.findOne({
                  contentId: mongoose.Types.ObjectId(video._id)
                }).lean()
                if(shared) {
                    video.shares = shared.share_count;
                } else {
                    video.shares = 0;
                }
                //View
                let views = await Read.findOne({
                    contentId: mongoose.Types.ObjectId(video._id)
                  }).lean()
                  if(views) {
                      video.views = views.read_count;
                  } else {
                      video.views = 0;
                  }

                // let resultMain = await FoliofitMasterFitnessMainHomeFullbodyHealthy.find({videos:video._id+''},{title:1}).lean()
                // let resultOther= await foliofitWeeklyWorkout.find( {videos:video._id+''},{title:1}).lean()
                let resultMain = await FoliofitMasterYogaMainCategory.find({videos:video._id+''},{title:1} ,
      {videos:1}).lean()
      let resultOther = await FoliofitMasterYogaHealthyRecommended.find({videos:video._id+''},{title:1}).lean()        
      

      let resultWeekly = await FoliofitMasterYogaWeekly.find({videos:video._id+''},{title:1}).lean()
                video.catagory = [...resultMain,...resultOther,...resultWeekly]
                result.push(video)
              }
            }

            result = result.reverse();
            res.status(200).json({
                status: true,
                data:result,
            });
        } catch (error) {
            next(error)
        }
    },
    searchPopularYogaList:async(req,res,next)=>{
        try {
            let keyword = req.body.keyword;
            if (keyword) {
                let result = await FoliofitYoga.find({
                    title: { $regex:`${keyword}`, $options: "i" }
                },{
                    title:1,
                    video:1,
                    thumbnail:{ $concat: [ baseUrl,"$thumbnail" ] },
                    workoutTime:1
                }).lean();
                for(let video of result){
                    let count = await Save.countDocuments({
                        contentId: mongoose.Types.ObjectId(video._id),
                      });
                      video.likes = count;
                      //Share
                      let shared = await Share.findOne({
                        contentId: mongoose.Types.ObjectId(video._id)
                      }).lean()
                      if(shared) {
                          video.shares = shared.share_count;
                      } else {
                          video.shares = 0;
                      }
                      //View
                      let views = await Read.findOne({
                          contentId: mongoose.Types.ObjectId(video._id)
                        }).lean()
                        if(views) {
                            video.views = views.read_count;
                        } else {
                            video.views = 0;
                        }
      
                        let resultMain = await FoliofitMasterYogaMainCategory.find({videos:video._id+''},{title:1} ,
                        {videos:1}).lean()
                        let resultOther = await FoliofitMasterYogaHealthyRecommended.find({videos:video._id+''},{title:1}).lean()        
                        
                  
                        let resultWeekly = await FoliofitMasterYogaWeekly.find({videos:video._id+''},{title:1}).lean()
                                  video.catagory = [...resultMain,...resultOther,...resultWeekly]
        
                }
                res.status(200).json({
                    status: true,
                    data: result,
                });
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter search keyword",
                });
            }
        } catch (error) {
            
        }
    },
    getYogaSubCatByMain:async(req,res,next)=>{
        try {
            if(req.params.type=='main'){
                let result= await FoliofitMasterYogaMainCategory.find( {},{title:1}).lean()
                res.status(200).json({
                    status: true,
                    data:result,
                });
            }else if(req.params.type=='weekly'){
                let result = await FoliofitMasterYogaWeekly.find({},{title:1}).lean()
                res.status(200).json({
                    status: true,
                    data:result,
                });
            }else{
                let result = await FoliofitMasterYogaHealthyRecommended.find({yogaType:req.params.type},{title:1}).lean()
                res.status(200).json({
                    status: true,
                    data:result,
                });
            }

        } catch (error) {
            next(error)
        }
    },
    getYogaVideoByMain:async(req,res,next)=>{
        try {
            if(req.params.type=='main'){
                let result= await FoliofitMasterYogaMainCategory.find( {}).lean()
                let videos = []
                for(let item of result){
                    for(let ids of item.videos){
                        let video = await FoliofitYoga.findOne({_id:mongoose.Types.ObjectId(ids)},{
                            title:1,
                            video:1,
                            thumbnail:{ $concat: [ baseUrl,"$thumbnail" ] },
                            workoutTime:1
                        }).lean()
                        if(video){
                            videos.push(video)
                        }
                    }

                }
                res.status(200).json({
                    status: true,
                    data:videos,
                });
            }else if(req.params.type=='weekly'){
                let result = await FoliofitMasterYogaWeekly.find({}).lean()
                let videos = []
                for(let item of result){
                    for(let ids of item.videos){
                        let video = await FoliofitYoga.findOne({_id:mongoose.Types.ObjectId(ids)},{
                            title:1,
                            video:1,
                            thumbnail:{ $concat: [ baseUrl,"$thumbnail" ] },
                            workoutTime:1
                        }).lean()
                        if(video){
                            videos.push(video)
                        }
                    }

                }
                res.status(200).json({
                    status: true,
                    data:videos,
                });
            }else{
                let result = await FoliofitMasterYogaHealthyRecommended.find({yogaType:req.params.type}).lean()
                let videos = []
                for(let item of result){
                    for(let ids of item.videos){
                        let video = await FoliofitYoga.findOne({_id:mongoose.Types.ObjectId(ids)},{
                            title:1,
                            video:1,
                            thumbnail:{ $concat: [ baseUrl,"$thumbnail" ] },
                            workoutTime:1
                        }).lean()
                        if(video){
                            videos.push(video)
                        }
                    }

                }
                res.status(200).json({
                    status: true,
                    data:videos,
                });
            }

        } catch (error) {
            next(error)
        }
    },
};
