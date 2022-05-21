const fs = require("fs");
const mongoose = require("mongoose");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
let Vimeo = require("vimeo").Vimeo;
let client = new Vimeo(
  process.env.VIMEO_CLIENT_ID,
  process.env.VIMEO_CLIENT_SECRET,
  process.env.VIMEO_ACCESS_TOKEN
);
const FolifitFitnessClub = require("../../models/foliofit/foliofitFitnessClub");
const foliofitWeeklyWorkout = require("../../models/foliofit/foliofitMasterWeekly");
const Read = require("../../models/read");
const Save = require("../../models/save");
const Share = require("../../models/share");

const FoliofitMasterFitnessMainHomeFullbodyHealthy = require("../../models/foliofit/foliofitMasterFitnessHomeFullbodyHealthy");

const addVimeo = (file_name) => {
  return new Promise((resolve, reject) => {
    client.upload(
      file_name,
      {
        name: "Hi",
        description: "The description goes here.",
      },
      function (uri) {
        let splittedUri = uri.split("/");
        // data.video = splittedUri[2]
        fs.unlink(file_name, function (err) {
          if (err) throw err;
          console.log("old Thumbnail deleted!");
        });
        return resolve({
          uri: splittedUri[2],
        });
      },
      function (bytes_uploaded, bytes_total) {
        var percentage = ((bytes_uploaded / bytes_total) * 100).toFixed(2);
        console.log(percentage + "%");
      },
      function (error) {
        console.log(error);
        return reject(error);
      }
    );
  });
};

const imgPath = process.env.BASE_URL;
function unlinkImage(video, thumbnail, gif) {
  if (video) {
    video.map(async (e) => {
      if (fs.existsSync(`./public/images/foliofit/${e.filename}`)) {
        await unlinkAsync(e.path);
      }
    });
  }
  if (thumbnail) {
    thumbnail.map(async (e) => {
      if (fs.existsSync(`./public/images/foliofit/${e.filename}`)) {
        await unlinkAsync(e.path);
      }
    });
  }
  if (gif) {
    gif.map(async (e) => {
      if (fs.existsSync(`./public/images/foliofit/${e.filename}`)) {
        await unlinkAsync(e.path);
      }
    });
  }
}

module.exports = {
  addVideo: async (req, res, next) => {
    try {
      // imageError = "";
      if (req.files.thumbnail && req.files.video && req.files.gif) {
        let data = {
          title: req.body.title,
          descriptionEnglish: req.body.descriptionEnglish,
          descriptionMalayalam: req.body.descriptionMalayalam,
          thumbnail: `foliofit/${req.files.thumbnail[0].filename}`,
          video: "",
          gif: "",
          workoutTime: req.body.workoutTime,
        };
        if (req.files.gif) {
          if (
            req.files.gif[0].mimetype === "video/mp4" ||
            req.files.gif[0].mimetype === "video/avi" ||
            req.files.gif[0].mimetype === "video/x-flv" ||
            req.files.gif[0].mimetype === "video/x-ms-wmv" ||
            req.files.gif[0].mimetype === "video/3gpp"
          ) {
            data.gif = {
              type: 0,
              gifVideo: `foliofit/${req.files.gif[0].filename}`,
              gifImage: "",
            };
          } else {
            console.log("image");
            data.gif = {
              type: 1,
              gifVideo: "",
              gifImage: `foliofit/${req.files.gif[0].filename}`,
            };
          }
        }
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
            let obj = FolifitFitnessClub(data);
            obj
              .save()
              .then((_) => {
                res.status(200).json({
                  status: true,
                  data: "Fitness Club Add Successfully",
                });
              })
              .catch((error) => {
                unlinkImage(
                  req.files.video,
                  req.files.thumbnail,
                  req.files.gif
                );
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
            unlinkImage(req.files.video, req.files.thumbnail, req.files.gif);
            res.status(200).json({
              status: false,
              data: error,
            });
          }
        );
      } else {
        unlinkImage(req.files.video, req.files.thumbnail, req.files.gif);
        res.status(200).json({
          status: false,
          data: "Please Upload all Files",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  editVideo: async (req, res, next) => {
    try {
      let existingVideo = await FolifitFitnessClub.findOne({
        _id: req.params.id,
      });
      if (existingVideo) {
        let data = {
          title: req.body.title,
          descriptionEnglish: req.body.descriptionEnglish,
          descriptionMalayalam: req.body.descriptionMalayalam,
          thumbnail: existingVideo.thumbnail,
          video: existingVideo.video,
          gif: existingVideo.gif,
          workoutTime: req.body.workoutTime,
        };
        if (req.files.thumbnail) {
          fs.unlink(`./public/images/${data.thumbnail}`, function (err) {
            if (err) throw err;
            console.log("old Thumbnail deleted!");
          });
          data.thumbnail = `foliofit/${req.files.thumbnail[0].filename}`;
        }
        if (req.files.gif) {
          if (
            req.files.gif[0].mimetype === "video/mp4" ||
            req.files.gif[0].mimetype === "video/avi" ||
            req.files.gif[0].mimetype === "video/x-flv" ||
            req.files.gif[0].mimetype === "video/x-ms-wmv" ||
            req.files.gif[0].mimetype === "video/3gpp"
          ) {
            data.gif = {
              type: 0,
              gifVideo: `foliofit/${req.files.gif[0].filename}`,
              gifImage: "",
            };
          } else {
            data.gif = {
              type: 1,
              gifVideo: "",
              gifImage: `foliofit/${req.files.gif[0].filename}`,
            };
          }
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
              FolifitFitnessClub.updateOne({ _id: req.params.id }, data).then(
                (response) => {
                  if (response.nModified == 1) {
                    res.status(200).json({
                      status: true,
                      data: "Fitness Club Updated Successfully",
                    });
                  } else {
                    res.status(200).json({
                      status: true,
                      data: "No Changes",
                    });
                  }
                }
              );
            },
            function (bytes_uploaded, bytes_total) {
              var percentage = ((bytes_uploaded / bytes_total) * 100).toFixed(
                2
              );
              console.log(percentage + "%");
            },
            function (error) {
              unlinkImage(req.files.video, req.files.thumbnail, req.files.gif);
              res.status(200).json({
                status: false,
                data: error,
              });
            }
          );
        } else {
          FolifitFitnessClub.updateOne({ _id: req.params.id }, data).then(
            (response) => {
              if (response.nModified == 1) {
                res.status(200).json({
                  status: true,
                  data: "Fitness Club Updated Successfully",
                });
              } else {
                res.status(200).json({
                  status: true,
                  data: "No Changes",
                });
              }
            }
          );
        }
      } else {
        unlinkImage(req.files.video, req.files.thumbnail, req.files.gif);
        res.status(200).json({
          status: false,
          data: "Invalid Id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  listFitnessClubVideo: async (req, res, next) => {
    try {
      let result = await FolifitFitnessClub.find(
        {},
        {
          title: 1,
          video: 1,
          thumbnail: { $concat: [imgPath, "$thumbnail"] },
          gif: 1,
        }
      ).lean();
      for (let item of result) {
        if (item.gif.type == 1) {
          item.gif.gifImage = process.env.BASE_URL.concat(item.gif.gifImage);
        } else {
          item.gif.gifVideo = process.env.BASE_URL.concat(item.gif.gifVideo);
        }
      }
      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  listPopularFitnessClubVideo: async (req, res, next) => {
    try {
      let data = await Read.aggregate([
        { $match: { type: "fitnessClub" } },
        {
          $project: {
            _id: 1,
            type: 1,
            contentId: 1,
            read_count: 1,
          },
        },
        {
          $sort: { read_count: 1 },
        },
        { $limit: 100 },
      ]);

      let result = [];

      for (single of data) {
        let video = await FolifitFitnessClub.findOne(
          { _id: mongoose.Types.ObjectId(single.contentId) },
          {
            title: 1,
            video: 1,
            thumbnail: { $concat: [imgPath, "$thumbnail"] },
            gif: 1,
          }
        ).lean();
        if (video) {
          let count = await Save.countDocuments({
            contentId: mongoose.Types.ObjectId(video._id),
          });
          video.likes = count;
          //Share
          let shared = await Share.findOne({
            contentId: mongoose.Types.ObjectId(video._id),
          }).lean();
          if (shared) {
            video.shares = shared.share_count;
          } else {
            video.shares = 0;
          }
          //View
          let views = await Read.findOne({
            contentId: mongoose.Types.ObjectId(video._id),
          }).lean();
          if (views) {
            video.views = views.read_count;
          } else {
            video.views = 0;
          }

          let resultMain =
            await FoliofitMasterFitnessMainHomeFullbodyHealthy.find(
              { videos: video._id + "" },
              { title: 1 }
            ).lean();
          let resultOther = await foliofitWeeklyWorkout
            .find({ videos: video._id + "" }, { title: 1 })
            .lean();
          video.catagory = [...resultMain, ...resultOther];
          result.push(video);
        }
      }
      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  getFitnessClubById: async (req, res, next) => {
    try {
      let result = await FolifitFitnessClub.findOne({
        _id: req.params.id,
      }).lean();
      result.thumbnail = process.env.BASE_URL.concat(result.thumbnail);
      if (result.gif.type == 1) {
        result.gif.gifImage = process.env.BASE_URL.concat(result.gif.gifImage);
      } else {
        result.gif.gifVideo = process.env.BASE_URL.concat(result.gif.gifVideo);
      }
      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  getFitnessSubCatByMain: async (req, res, next) => {
    try {
      if (req.params.type == "weeklyworkout") {
        let result = await foliofitWeeklyWorkout.find({}, { title: 1 }).lean();
        res.status(200).json({
          status: true,
          data: result,
        });
      } else {
        let result = await FoliofitMasterFitnessMainHomeFullbodyHealthy.find(
          { fitnessType: req.params.type },
          { title: 1 }
        ).lean();
        res.status(200).json({
          status: true,
          data: result,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getFitnessVideoByMain: async (req, res, next) => {
    try {
      if (req.params.type == "weeklyworkout") {
        let result = await foliofitWeeklyWorkout.find({}).lean();
        let videos = [];
        for (let item of result) {
          for (let ids of item.videos) {
            let video = await FolifitFitnessClub.findOne(
              { _id: mongoose.Types.ObjectId(ids) },
              {
                title: 1,
                video: 1,
                thumbnail: { $concat: [imgPath, "$thumbnail"] },
                gif: 1,
              }
            ).lean();
            if (video) {
              if (video.gif.type == 1) {
                video.gif.gifImage = process.env.BASE_URL.concat(
                  video.gif.gifImage
                );
              } else {
                video.gif.gifVideo = process.env.BASE_URL.concat(
                  video.gif.gifVideo
                );
              }
              videos.push(video);
            }
          }
        }
        res.status(200).json({
          status: true,
          data: videos,
        });
      } else {
        let result = await FoliofitMasterFitnessMainHomeFullbodyHealthy.find({
          fitnessType: req.params.type,
        }).lean();
        let videos = [];
        for (let item of result) {
          for (let ids of item.videos) {
            let video = await FolifitFitnessClub.findOne(
              { _id: mongoose.Types.ObjectId(ids) },
              {
                title: 1,
                video: 1,
                thumbnail: { $concat: [imgPath, "$thumbnail"] },
                gif: 1,
              }
            ).lean();
            if (video) {
              if (video.gif.type == 1) {
                video.gif.gifImage = process.env.BASE_URL.concat(
                  video.gif.gifImage
                );
              } else {
                video.gif.gifVideo = process.env.BASE_URL.concat(
                  video.gif.gifVideo
                );
              }
              videos.push(video);
            }
          }
        }
        res.status(200).json({
          status: true,
          data: videos,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteVideo: async (req, res, next) => {
    try {
      let isSaved = Save.find({
        type: "fitnessClub",
        contentId: mongoose.Types.ObjectId(req.params.id),
      });
      if (isSaved) {
        await Save.deleteMany({
          type: "fitnessClub",
          contentId: mongoose.Types.ObjectId(req.params.id),
        });
      }
      await FolifitFitnessClub.deleteOne({ _id: req.params.id }).then(
        (response) => {
          res.status(200).json({
            status: true,
            data: "Deleted FolioFit Fitness Club ",
          });
        }
      );
    } catch (error) {}
  },
  searchFitnessClubList: async (req, res, next) => {
    try {
      let keyword = req.body.keyword;
      if (keyword) {
        let result = await FolifitFitnessClub.find(
          {
            title: { $regex: `${keyword}`, $options: "i" },
            // $text:{$search:`"\"${keyword}\""`},
            // $or: [
            //     {
            //         title: { $regex:`^${keyword}`, $options: "i" },
            //     },
            // ],
          },
          {
            title: 1,
            video: 1,
            thumbnail: { $concat: [imgPath, "$thumbnail"] },
            gif: 1,
          }
        ).lean();
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
    } catch (error) {}
  },
  searchPopularFitnessClubList: async (req, res, next) => {
    try {
      let keyword = req.body.keyword;
      if (keyword) {
        let result = await FolifitFitnessClub.find(
          {
            $or: [
              {
                title: { $regex: `^${keyword}`, $options: "i" },
              },
            ],
          },
          {
            title: 1,
            video: 1,
            thumbnail: { $concat: [imgPath, "$thumbnail"] },
            gif: 1,
          }
        ).lean();
        for (let video of result) {
          let count = await Save.countDocuments({
            contentId: mongoose.Types.ObjectId(video._id),
          });
          video.likes = count;
          //Share
          let shared = await Share.findOne({
            contentId: mongoose.Types.ObjectId(video._id),
          }).lean();
          if (shared) {
            video.shares = shared.share_count;
          } else {
            video.shares = 0;
          }
          //View
          let views = await Read.findOne({
            contentId: mongoose.Types.ObjectId(video._id),
          }).lean();
          if (views) {
            video.views = views.read_count;
          } else {
            video.views = 0;
          }

          let resultMain =
            await FoliofitMasterFitnessMainHomeFullbodyHealthy.find(
              { videos: video._id + "" },
              { title: 1 }
            ).lean();
          let resultOther = await foliofitWeeklyWorkout
            .find({ videos: video._id + "" }, { title: 1 })
            .lean();
          video.catagory = [...resultMain, ...resultOther];
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
    } catch (error) {}
  },
  getFitnessClubByCatId: async (req, res, next) => {
    try {
      let data = [];
      let result;
      let resultMain =
        await FoliofitMasterFitnessMainHomeFullbodyHealthy.findById(
          req.params.id
        ).lean();
      if (resultMain) result = resultMain;
      let resultOther = await foliofitWeeklyWorkout
        .findById(req.params.id)
        .lean();
      if (resultOther) result = resultOther;
      for (let id of result.videos) {
        let video = await FolifitFitnessClub.findOne(
          { _id: id },
          {
            title: 1,
            video: 1,
            thumbnail: { $concat: [imgPath, "$thumbnail"] },
            gif: 1,
          }
        );
        console.log(video);
        if (video) {
          data.push(video);
        }
      }
      res.status(200).json({
        status: true,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
};
