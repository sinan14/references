const mongoose = require("mongoose");
const axios = require("axios");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const sizeOf = require("image-size");
const HealthCareVideo = require("../models/healthCareVideo");
const Save = require("../models/save");
const Like = require("../models/like");
let Vimeo = require("vimeo").Vimeo;
const dotenv = require("dotenv");
const Share = require("../models/share");
const Read = require("../models/read");
dotenv.config({
  path: "../config.env",
});
let client = new Vimeo(
  process.env.VIMEO_CLIENT_ID,
  process.env.VIMEO_CLIENT_SECRET,
  process.env.VIMEO_ACCESS_TOKEN
);

var dimensions = "";
var imageError = "false";
var filType = "";

var categoryTypeHealth = "healthcare";
var categoryTypeMedicine = "medicine";
var categoryMedicineCount = 4;

function checkfileType(filType, fileInfo) {
  //   if (fileInfo) {
  //         dimensions = sizeOf(fileInfo.path);
  //         console.log('dimensions',dimensions);
  //   }

  if (filType == "video") {
    /*Flash	.flv	video/x-flv
MPEG-4	.mp4	video/mp4
iPhone Index	.m3u8	application/x-mpegURL
iPhone Segment	.ts	video/MP2T
3GP Mobile	.3gp	video/3gpp
QuickTime	.mov	video/quicktime
A/V Interleave	.avi	video/x-msvideo
Windows Media	.wmv	video/x-ms-wmv
*/

    if (
      fileInfo.mimetype === "video/mp4" ||
      fileInfo.mimetype === "video/avi" ||
      fileInfo.mimetype === "video/x-flv" ||
      fileInfo.mimetype === "video/x-ms-wmv" ||
      fileInfo.mimetype === "video/3gpp"
    ) {
    }
  } else if (filType == "thumbnail") {
    //image/png
    if (
      fileInfo.mimetype != "image/png" ||
      fileInfo.mimetype != "image/jpeg" ||
      fileInfo.mimetype != "image/svg+xml" ||
      fileInfo.mimetype != "image/gif"
    ) {
      // imageError+="Please upload .png"
      dimensions = sizeOf(fileInfo.path);
      console.log("dimensions", dimensions);
      // if (dimensions.width != 1076 && dimensions.height != 444) {
      //     imageError += "please upload images with size(1076x444)";
      // }
    }
  } else {
    imageError += "file type is not supported check with another file type";
  }
}

function unlinkImage(video, thumbnail) {
  try {
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
  } catch (error) {
    next(error);
  }
}

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return "few seconds ago";
}

module.exports = {
  /* Master health
      ============================================= */
  addHealthCareVideo: async (req, res, next) => {
    try {
      console.log();
      // console.log("req.body", req.body);
      // console.log("req.files", req.files);
      if (req.files.video && req.files.thumbnail) {
        var fileInfoVideo = {};
        var fileInfoThumbnail = {};
        fileInfoVideo = req.files.video[0];
        filType = "video";
        checkfileType(filType, fileInfoVideo);
        fileInfoThumbnail = req.files.thumbnail[0];
        filType = "thumbnail";
        checkfileType(filType, fileInfoThumbnail);

        if (imageError != "false") {
          unlinkImage(req.files.video, req.files.thumbnail);

          res.status(422).json({
            status: false,
            data: imageError,
          });
          imageError = "false";
        } else {
          let file_name = `./public/images/healthcare/${fileInfoVideo.filename}`;

          await client.upload(
            file_name,
            {
              name: req.body.name,
              description: "The description goes here.",
              // privacy: {
              //   view: "unlisted",
              // },
            },
            function (uri) {
              let splittedUri = uri.split("/");
              let data = {
                name: req.body.name,
                video: splittedUri[2],
                thumbnail: `healthcare/${fileInfoThumbnail.filename}`,

                duration: req.body.duration,
                subCategories: req.body.subCategories,
                homepageMain: req.body.homepageMain,
                homepageSub: req.body.homepageSub,
                createdBy: req.body.createdBy,
                updatedBy: req.body.updatedBy,
              };
              if (req.body.homepageMain === "true") {
                console.log("in homepage if video");
                HealthCareVideo.updateMany(
                  { homepageMain: true },
                  { $set: { homepageMain: false } }
                ).catch((err) => console.log(err));
              }
              let schemaObj = new HealthCareVideo(data);
              schemaObj
                .save()
                .then((response) => {
                  unlinkImage(req.files.video);
                  res.status(200).json({
                    status: true,
                    data: "healthcare video added successfully",
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
              var percentage = ((bytes_uploaded / bytes_total) * 100).toFixed(
                2
              );
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
          //     name: req.body.name,
          //     video: vimeoUri,
          //     thumbnail: `healthcare/${fileInfoThumbnail.filename}`,

          //     duration: req.body.duration,
          //     subCategories: req.body.subCategories,
          //     homepageMain: req.body.homepageMain,
          //     homepageSub: req.body.homepageSub,
          //     createdBy: req.body.createdBy,
          //     updatedBy: req.body.updatedBy,
          // };
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
  get_healthcare_videos: async (req, res, next) => {
    try {
      let pageSize = req.body.limit;
      let pageNo = req.body.page;
      let result = [];

      var aggregateQuery = HealthCareVideo.aggregate();

      aggregateQuery.match({ subCategories: { $in: [req.body.subcat_id] } });

      aggregateQuery.project({
        title: "$name",
        thumbnail: 1,
        video: 1,
        createdAt: 1,
        duration: 1,
      });

      const customLabels = {
        totalDocs: "TotalRecords",
        docs: "Customers",
        limit: "PageSize",
        page: "CurrentPage",
      };

      const aggregatePaginateOptions = {
        page: pageNo,
        limit: pageSize,
        customLabels: customLabels,
      };

      let response = await HealthCareVideo.aggregatePaginate(
        aggregateQuery,
        aggregatePaginateOptions
      );

      console.log("respon:", response);

      result = response.Customers;

      // let result = await HealthCareVideo.aggregate([
      //   {$match: {subCategories:{$in:[req.body.subcat_id]}}},
      //   {
      //     $project: {
      //       title: "$name",
      //       thumbnail: 1,
      //       video: 1,
      //       posted_on: "$createdAt",
      //     },
      //   },
      // ]);

      // finding like count and save
      for (j = 0; j < result.length; j++) {
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(result[j]._id),
        });
        // result[j] = result[j].toJSON();
        result[j].like_count = count;

        let isSaved = await Save.findOne({
          type: "healthcareVideo",
          contentId: mongoose.Types.ObjectId(result[j]._id),
          userId: req.user._id,
        });

        if (isSaved) {
          result[j].is_saved = 1;
        } else {
          result[j].is_saved = 0;
        }

        // is liked
        let isLiked = await Like.findOne({
          type: "healthcareVideo",
          contentId: mongoose.Types.ObjectId(result[j]._id),
          userId: req.user._id,
        });

        if (isLiked) {
          result[j].is_liked = 1;
        } else {
          result[j].is_liked = 0;
        }

        result[j].thumbnail = process.env.BASE_URL.concat(result[j].thumbnail);

        result[j].type = "healthcareVideo";

        result[j].createdAt = timeSince(result[j].createdAt);
      }

      res.status(200).json({
        error: false,
        message: "success",
        data: {
          healthcare_video: result.reverse(),
          hasPrevPage: response.hasPrevPage,
          hasNextPage: response.hasNextPage,
          total_videos: response.TotalRecords,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getHealthCareVideo: async (req, res, next) => {
    try {
      let result = await HealthCareVideo.find().lean();
      let data = [];
      // finding like count and save

      for (j = 0; j < result.length; j++) {
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(result[j]._id),
        });
        result[j].like_count = count;
        let shareCount = await Share.findOne({
          contentId: mongoose.Types.ObjectId(result[j]._id),
        });
        if (shareCount) {
          result[j].share_count = shareCount.share_count;
        } else {
          result[j].share_count = 0;
        }
        result[j].thumbnail = process.env.BASE_URL.concat(result[j].thumbnail);

        result[j].type = "healthcareVideo";

        result[j].createdAt = timeSince(result[j].createdAt);
      }
      let read = await Read.aggregate([
        { $match: { type: "healthcarevideo" } },
        {
          $sort: { read_count: 1 },
        },
        { $limit: 100 },
      ]);
      let shared = await Share.aggregate([
        { $match: { type: "healthcareVideo" } },
        {
          $sort: { share_count: 1 },
        },
        { $limit: 100 },
      ]);
      console.log(shared);
      for (let items of result) {
        items.mostViewed = false;
        items.mostShared = false;
      }
      for (let item of result) {
        // Most viewed
        for (const data of read) {
          if (JSON.stringify(item._id) == JSON.stringify(data.contentId)) {
            item.mostViewed = true;
          }
        }
        //Most Shared
        for (const datas of shared) {
          // console.log(typeof item._id);
          // console.log(typeof datas.contentId);
          if (JSON.stringify(item._id) == JSON.stringify(datas.contentId)) {
            item.mostShared = true;
          }
        }
        data.push(item);
      }
      res.status(200).json({
        status: true,
        data: data.reverse(),
      });
    } catch (error) {
      next(error);
    }
  },

  getPaginatedHealthCareVideo: async (req, res, next) => {
    try {
      var limit = parseInt(req.body.limit);
      if (limit == 0) limit = 10;
      var skip = (parseInt(req.body.page) - 1) * parseInt(limit);
      let result = await HealthCareVideo.find({})
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

  searchHealthcareVideo: async (req, res, next) => {
    try {
      let keyword = req.body.keyword;

      if (keyword) {
        let result = await HealthCareVideo.find({
          $or: [{ $text: { $search: `"\"${keyword}\""` } }],
        }).lean();

        for (j = 0; j < result.length; j++) {
          let count = await Like.countDocummoents({
            contentId: ngoose.Types.ObjectId(result[j]._id),
          });
          result[j].like_count = count;
          let shareCount = await Share.findOne({
            contentId: mongoose.Types.ObjectId(result[j]._id),
          });
          if (shareCount) {
            result[j].share_count = shareCount.share_count;
          } else {
            result[j].share_count = 0;
          }
          result[j].thumbnail = process.env.BASE_URL.concat(
            result[j].thumbnail
          );

          result[j].type = "healthcareVideo";

          result[j].createdAt = timeSince(result[j].createdAt);
        }
        res.status(200).json({
          status: true,
          data: result.reverse(),
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

  editHealthCareVideo: async (req, res, next) => {
    try {
      let data = req.body;
      var fileInfo = {};
      if (req.params.id) {
        let health = await HealthCareVideo.findOne({
          _id: mongoose.Types.ObjectId(req.params.id),
        });
        if (health) {
          if (req.files.thumbnail) {
            var fileInfoThumbnail = {};
            fileInfoThumbnail = req.files.thumbnail[0];
            filType = "thumbnail";
            checkfileType(filType, fileInfoThumbnail);
            if (imageError == "false") {
              data.thumbnail = `healthcare/${fileInfoThumbnail.filename}`;
              // deleting old banner
              let splittedThumbnailRoute = health.thumbnail.split("/");
              console.log("splitted::", splittedThumbnailRoute);
              if (
                fs.existsSync(
                  `./public/images/healthcare/${splittedThumbnailRoute[1]}`
                )
              ) {
                fs.unlink(
                  `./public/images/healthcare/${splittedThumbnailRoute[1]}`,
                  function (err) {
                    if (err) throw err;
                    console.log("old Thumbnail deleted!");
                  }
                );
              }
            }
          } else {
            data.thumbnail = health.thumbnail;
          }
          if (req.files.video) {
            var fileInfoVideo = {};
            fileInfoVideo = req.files.video[0];
            filType = "video";
            checkfileType(filType, fileInfoVideo);
          }
          if (imageError == "false") {
            if (req.files.video) {
              let file_name = `./public/images/healthcare/${fileInfoVideo.filename}`;
              await client.upload(
                file_name,
                {
                  name: "Untitled",
                  description: "The description goes here.",
                },
                function (uri) {
                  if (req.body.homepageMain === "true") {
                    HealthCareVideo.updateMany(
                      { homepageMain: true },
                      { $set: { homepageMain: false } }
                    ).catch((err) => console.log(err));
                  }
                  let splittedUri = uri.split("/");
                  data.video = splittedUri[2];
                  data.updatedAt = new Date();
                  HealthCareVideo.updateOne(
                    { _id: mongoose.Types.ObjectId(req.params.id) },
                    data
                  )
                    .then((response) => {
                      if (response.nModified == 1) {
                        res.status(200).json({
                          status: true,
                          data: "Updated successfully",
                        });
                      } else {
                        res.status(422).json({
                          status: false,
                          data: "Not updated",
                        });
                      }
                    })
                    .catch((error) => {
                      res.status(422).json({
                        status: false,
                        data: error,
                      });
                    });
                },
                function (bytes_uploaded, bytes_total) {
                  var percentage = (
                    (bytes_uploaded / bytes_total) *
                    100
                  ).toFixed(2);
                  console.log(percentage + "%");
                },
                function (error) {
                  unlinkImage(req.files.video, req.files.thumbnail);
                  res.status(429).json({
                    status: false,
                    error: error,
                  });
                }
              );
            } else {
              if (req.body.homepageMain === "true") {
                HealthCareVideo.updateMany(
                  { homepageMain: true },
                  { $set: { homepageMain: false } }
                ).catch((err) => console.log(err));
              }
              data.video = health.video;
              data.updatedAt = new Date();
              HealthCareVideo.updateOne(
                { _id: mongoose.Types.ObjectId(req.params.id) },
                data
              )
                .then((response) => {
                  if (response.nModified == 1) {
                    res.status(200).json({
                      status: true,
                      data: "Updated successfully",
                    });
                  } else {
                    res.status(422).json({
                      status: false,
                      data: "Not updated",
                    });
                  }
                })
                .catch((error) => {
                  res.status(422).json({
                    status: false,
                    data: error,
                  });
                });
            }
          } else {
            unlinkImage(req.files.video, req.files.thumbnail);

            res.status(422).json({
              status: false,
              data: imageError,
            });
            imageError = "false";
          }
        } else {
          unlinkImage(req.files.video, req.files.thumbnail);
          res.status(422).json({
            status: false,
            data: "invalid healthId",
          });
        }
      } else {
        unlinkImage(req.files.video, req.files.thumbnail);
        res.status(422).json({
          status: false,
          data: "Please enter healthId",
        });
      }
    } catch (error) {
      unlinkImage(req.files.video, req.files.thumbnail);
      next(error);
    }
  },
  deleteHealthCareVideo: async (req, res, next) => {
    try {
      let health = await HealthCareVideo.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });

      if (health) {
        HealthCareVideo.deleteOne({ _id: req.params.id })
          .then(async (_) => {
            // let splittedVideoRoute = health.video.split("/");

            // fs.unlink(
            //     `./public/images/healthcare/${splittedVideoRoute[1]}`,
            //     function(err) {
            //         if (err) throw err;
            //     }
            // );
            let splittedThumbnailRoute = health.thumbnail.split("/");

            fs.unlink(
              `./public/images/healthcare/${splittedThumbnailRoute[1]}`,
              function (err) {
                if (err) throw err;
              }
            );
            let config = {
              headers: {
                Authorization: "Bearer " + process.env.VIMEO_ACCESS_TOKEN,
              },
            };
            axios.delete(
              `https://api.vimeo.com/videos/${health.video}`,
              config
            );
            let isSaved = Save.find({
              type: "healthcareVideo",
              contentId: mongoose.Types.ObjectId(req.params.id),
            });
            if (isSaved) {
              await Save.deleteMany({
                type: "healthcareVideo",
                contentId: mongoose.Types.ObjectId(req.params.id),
              });
            }
            res.status(200).json({
              status: true,
              data: "health care video removed successfully",
            });
          })
          .catch((error) => {
            res.status(422).json({
              status: false,
              data: error,
            });
          });
      } else {
        res.status(422).json({
          status: false,
          data: "invalid Id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getHealthCareVideoByType: async (req, res, next) => {
    try {
      console.log("params", req.params);
      let Type = req.params.Type.replace(/\s+/g, " ").trim();
      console.log("Type", Type);
      if (Type == "all" || Type == "homemain" || Type == "homesub") {
        var result = "";
        if (Type == "all") {
          result = await HealthCareVideo.find();
        } else if (Type == "homemain") {
          result = await HealthCareVideo.find({ homeMain: true });
        } else if (Type == "homesub") {
          result = await HealthCareVideo.find({ homeSub: true });
        }
        console.log("result", result);
        res.status(200).json({
          status: true,
          data: result,
        });
      } else {
        res.status(200).json({
          status: false,
          data: "Please Check the Type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  userSearchHealthcareVideo: async (req, res, next) => {
    try {
      let keyword = req.body.keyword;
      let pageSize = req.body.limit;
      let pageNo = req.body.page;
      let result = [];

      var aggregateQuery = HealthCareVideo.aggregate();

      aggregateQuery.match({
        $or: [{ $text: { $search: `"\"${keyword}\""` } }],
      });

      aggregateQuery.project({
        title: "$name",
        thumbnail: 1,
        video: 1,
        createdAt: 1,
        duration: 1,
      });

      const customLabels = {
        totalDocs: "TotalRecords",
        docs: "Customers",
        limit: "PageSize",
        page: "CurrentPage",
      };

      const aggregatePaginateOptions = {
        page: pageNo,
        limit: pageSize,
        customLabels: customLabels,
      };

      let response = await HealthCareVideo.aggregatePaginate(
        aggregateQuery,
        aggregatePaginateOptions
      );

      console.log("respon:", response);

      result = response.Customers;

      // let result = await HealthCareVideo.aggregate([
      //   {$match: {subCategories:{$in:[req.body.subcat_id]}}},
      //   {
      //     $project: {
      //       title: "$name",
      //       thumbnail: 1,
      //       video: 1,
      //       posted_on: "$createdAt",
      //     },
      //   },
      // ]);

      // finding like count and save
      for (j = 0; j < result.length; j++) {
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(result[j]._id),
        });
        // result[j] = result[j].toJSON();
        result[j].like_count = count;

        let isSaved = await Save.findOne({
          type: "healthcareVideo",
          contentId: mongoose.Types.ObjectId(result[j]._id),
          userId: req.user._id,
        });

        if (isSaved) {
          result[j].is_saved = 1;
        } else {
          result[j].is_saved = 0;
        }

        // is liked
        let isLiked = await Like.findOne({
          type: "healthcareVideo",
          contentId: mongoose.Types.ObjectId(result[j]._id),
          userId: req.user._id,
        });

        if (isLiked) {
          result[j].is_liked = 1;
        } else {
          result[j].is_liked = 0;
        }

        result[j].thumbnail = process.env.BASE_URL.concat(result[j].thumbnail);

        result[j].type = "healthcareVideo";

        result[j].createdAt = timeSince(result[j].createdAt);
      }

      res.status(200).json({
        error: false,
        message: "success",
        data: {
          healthcare_video: result,
          hasPrevPage: response.hasPrevPage,
          hasNextPage: response.hasNextPage,
          total_videos: response.TotalRecords,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  get_healthcare_videos_by_id: async (req, res, next) => {
    try {
      // let pageSize = req.body.limit;
      // let pageNo = req.body.page;
      let result = [];

      let response = await HealthCareVideo.aggregate([
        { $match: { subCategories: { $in: [req.params.id] } } },
      ]);

      // aggregateQuery.match({ subCategories: { $in: [req.params.id] } });

      // aggregateQuery.project({
      //     title: "$name",
      //     thumbnail: 1,
      //     video: 1,
      //     createdAt: 1,
      //     duration: 1
      // });

      // const customLabels = {
      //     totalDocs: "TotalRecords",
      //     docs: "Customers",
      //     limit: "PageSize",
      //     page: "CurrentPage",
      // };

      // const aggregatePaginateOptions = {
      //     page: pageNo,
      //     limit: pageSize,
      //     customLabels: customLabels,
      // };

      // let response = await HealthCareVideo.aggregatePaginate(
      //     aggregateQuery,
      //     aggregatePaginateOptions
      // );

      console.log("respon:", response);

      result = response;

      // let result = await HealthCareVideo.aggregate([
      //   {$match: {subCategories:{$in:[req.body.subcat_id]}}},
      //   {
      //     $project: {
      //       title: "$name",
      //       thumbnail: 1,
      //       video: 1,
      //       posted_on: "$createdAt",
      //     },
      //   },
      // ]);

      // finding like count and save
      for (j = 0; j < result.length; j++) {
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(result[j]._id),
        });
        // result[j] = result[j].toJSON();
        result[j].like_count = count;
        let shareCount = await Share.findOne({
          contentId: mongoose.Types.ObjectId(result[j]._id),
        });
        if (shareCount) {
          result[j].share_count = shareCount.share_count;
        } else {
          result[j].share_count = 0;
        }

        // let isSaved = await Save.findOne({
        //     type: "healthcareVideo",
        //     contentId: mongoose.Types.ObjectId(result[j]._id),
        //     userId: req.user._id,
        // });

        // if (isSaved) {
        //     result[j].is_saved = 1;
        // } else {
        //     result[j].is_saved = 0;
        // }

        // is liked
        // let isLiked = await Like.findOne({
        //     type: "healthcareVideo",
        //     contentId: mongoose.Types.ObjectId(result[j]._id),
        //     userId: req.user._id,
        // });

        // if (isLiked) {
        //     result[j].is_liked = 1;
        // } else {
        //     result[j].is_liked = 0;
        // }

        // result[j].thumbnail = process.env.BASE_URL.concat(result[j].thumbnail);
        result[j].thumbnail = process.env.BASE_URL.concat(result[j].thumbnail);

        result[j].type = "healthcareVideo";

        result[j].createdAt = timeSince(result[j].createdAt);
      }
      let read = await Read.aggregate([
        { $match: { type: "healthcarevideo" } },
        {
          $sort: { read_count: 1 },
        },
        { $limit: 100 },
      ]);
      let shared = await Share.aggregate([
        { $match: { type: "healthcarevideo" } },
        {
          $sort: { share_count: 1 },
        },
        { $limit: 100 },
      ]);
      for (let items of result) {
        items.mostViewed = false;
        items.mostShared = false;
      }
      for (let item of result) {
        // Most viewed
        for (const data of read) {
          if (item._id == data.contentId) {
            item.mostViewed = true;
          }
        }
        //Most Shared
        for (const datas of shared) {
          if (item._id == datas.contentId) {
            item.mostShared = true;
          }
        }
      }
      res.status(200).json({
        error: false,
        message: "success",
        data: {
          healthcare_video: result,
          // hasPrevPage: response.hasPrevPage,
          // hasNextPage: response.hasNextPage,
          // total_videos: response.TotalRecords
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
