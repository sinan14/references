const mongoose = require("mongoose");
const HealthTipCategory = require("../models/healthTipCategory");
const HealthTip = require("../models/healthTip");
const Like = require("../models/like");
const Save = require("../models/save");
const Read = require("../models/read");
const Shared = require ("../models/share")
const fs = require("fs");
const { promisify } = require("util");
const Share = require("../models/share");
const unlinkAsync = promisify(fs.unlink);

const base_url = process.env.BASE_URL


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
  viewHealthTipCategories: async (req, res, next) => {
    try {
      let count = await HealthTipCategory.find().countDocuments();
      console.log('count',count)
      let result = await HealthTipCategory.find();
      
      res.status(200).json({
        status: true,
        data: result,count
      });
    } catch (error) {
      next(error);
    }
  },
  addHealthTip: async (req, res, next) => {
    try {
      let data = req.body;
      let existing = await HealthTip.findOne({ heading: data.heading });
      if (!existing) {
        if (req.file) {
          data.image = `medfeed/${req.file.filename}`;

          let schemaObj = new HealthTip(data);
          schemaObj
            .save()
            .then((response) => {
              res.status(200).json({
                status: true,
                data: "Health tip added successfully",
              });
            })
            .catch(async (error) => {
              await unlinkAsync(req.file.path);
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
        await unlinkAsync(req.file.path);
        res.status(200).json({
          status: false,
          data: "There is an health tip with this heading",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  viewAllHealthTips: async (req, res, next) => {
    try {
      let count = await HealthTip.find().countDocuments()
      let resultData = []
      let result = await HealthTip.find(
        {},
        {
          _id: 1,
          heading: 1,
          readTime: 1,
          image: 1,
          likes: 1,
          shares: 1,
          description: 1,
        }
      ).lean()
      result = result.reverse()
      for(const item of result){
        item.image = process.env.BASE_URL.concat(item.image)
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(item._id),
        });
        item.like_count = count
        let shareCount = await Share.findOne({
          contentId: mongoose.Types.ObjectId(item._id),
        });
       if(shareCount){
          item.share_count = shareCount.share_count;
       }else{
          item.share_count = 0;
       }
        resultData.push(item)
      }
      res.status(200).json({
        status: true,
        data: resultData,count
      });
    } catch (error) {
      next(error);
    }
  },
  viewHealthTip: async (req, res, next) => {
    try {
      let healthTip = await HealthTip.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      }).lean()
      if (healthTip) {
        healthTip.image = process.env.BASE_URL.concat(healthTip.image)
        res.status(200).json({
          status: true,
          data: healthTip,
        });
      } else {
        res.status(200).json({
          status: false,
          data: "invalid health tip id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  viewHealthTipsByCategory: async (req, res, next) => {
    try {
      if (req.body.categories) {
        let count = await HealthTip.find(
          { categories: { $in: req.body.categories } }).countDocuments()
        let result = await HealthTip.find(
          { categories: { $in: req.body.categories } },
          {
            _id: 1,
            heading: 1,
            readTime: 1,
            image: 1,
            likes: 1,
            shares: 1,
            description: 1,
          }
        ).lean()
        let resultData = []
      result = result.reverse()

        for(const item of result){
          item.image = process.env.BASE_URL.concat(item.image)
          let count = await Like.countDocuments({
            contentId: mongoose.Types.ObjectId(item._id),
          });
          item.like_count = count
          let shareCount = await Share.findOne({
            contentId: mongoose.Types.ObjectId(item._id),
          });
         if(shareCount){
            item.share_count = shareCount.share_count;
         }else{
            item.share_count = 0;
         }
          resultData.push(item)
        }
        res.status(200).json({
          status: true,
          data: resultData,count
        });
      } else {
        res.status(200).json({
          status: false,
          data: "category id missing",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  viewTrendingHealthTips: async (req, res, next) => {
    try {
      // console.log("ivideyalle");
      if(req.params.id){
        let count = await HealthTip.find( { trending: true }).countDocuments()
      let result = await HealthTip.find(
        { trending: true,categories: { $in: [req.params.id] }},
        {
          _id: 1,
          heading: 1,
          readTime: 1,
          image: 1,
          likes: 1,
          shares: 1,
          description: 1,
        }
      ).lean()
      let resultData = []
      for(const item of result){
        item.image = process.env.BASE_URL.concat(item.image)
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(item._id),
        });
        item.like_count = count
        let shareCount = await Share.findOne({
          contentId: mongoose.Types.ObjectId(item._id),
        });
       if(shareCount){
          item.share_count = shareCount.share_count;
       }else{
          item.share_count = 0;
       }
        resultData.push(item)
      }
      res.status(200).json({
        status: true,
        data: resultData,count,
      })
      }else{
        let count = await HealthTip.find( { trending: true }).countDocuments()
      let result = await HealthTip.find(
        { trending: true },
        {
          _id: 1,
          heading: 1,
          readTime: 1,
          image: 1,
          likes: 1,
          shares: 1,
          description: 1,
        }
      ).lean()
      let resultData = []
      for(const item of result){
        item.image = process.env.BASE_URL.concat(item.image)
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(item._id),
        });
        item.like_count = count
        let shareCount = await Share.findOne({
          contentId: mongoose.Types.ObjectId(item._id),
        });
       if(shareCount){
          item.share_count = shareCount.share_count;
       }else{
          item.share_count = 0;
       }
        resultData.push(item)
      }
      res.status(200).json({
        status: true,
        data: resultData,count,
      });
      }
    } catch (error) {
      next(error);
    }
  },
  viewNewestHealthTips: async (req, res, next) => {
    try {
      if(req.params.id){
        let count = await HealthTip.find(
          { newest: true }).countDocuments()
        let result = await HealthTip.find(
          { newest: true,categories: { $in: [req.params.id] } },
          {
            _id: 1,
            heading: 1,
            readTime: 1,
            image: 1,
            likes: 1,
            shares: 1,
            description: 1,
          }
        ).lean()
        let resultData = []
        for(const item of result){
          item.image = process.env.BASE_URL.concat(item.image)
          let count = await Like.countDocuments({
            contentId: mongoose.Types.ObjectId(item._id),
          });
          item.like_count = count
          let shareCount = await Share.findOne({
            contentId: mongoose.Types.ObjectId(item._id),
          });
         if(shareCount){
            item.share_count = shareCount.share_count;
         }else{
            item.share_count = 0;
         }
          resultData.push(item)
        }
        res.status(200).json({
          status: true,
          data: resultData,count
        });
      }else{
        let count = await HealthTip.find(
          { newest: true }).countDocuments()
        let result = await HealthTip.find(
          { newest: true },
          {
            _id: 1,
            heading: 1,
            readTime: 1,
            image: 1,
            likes: 1,
            shares: 1,
            description: 1,
          }
        ).lean()
        let resultData = []
        for(const item of result){
          item.image = process.env.BASE_URL.concat(item.image)
          let count = await Like.countDocuments({
            contentId: mongoose.Types.ObjectId(item._id),
          });
          item.like_count = count
          let shareCount = await Share.findOne({
            contentId: mongoose.Types.ObjectId(item._id),
          });
         if(shareCount){
            item.share_count = shareCount.share_count;
         }else{
            item.share_count = 0;
         }
          resultData.push(item)
        }
        res.status(200).json({
          status: true,
          data: resultData,count
        });
      }
     
    } catch (error) {
      next(error);
    }
  },
  viewMostSharedHealthTips: async (req, res, next) => {
    try {
      // console.log("ivideyalle####");
      if(req.params.id){
        // let count = await Read.find( { type: "healthTip" }).countDocuments()
        let result = [] 
        let read = await Shared.aggregate([
          { $match:{type: "healthTip" }},
          {
            $sort:{'share_count':1}
          },
          { $limit : 30 }
        ])
        for(const item of read ){
          let data = await HealthTip.findOne({ categories: { $in: [req.params.id] },_id:item.contentId}).lean()
          if(data){
            result.push(data)
          }
        }
  //     let endResult=[]
  //     for(z=0;z<result.length;z++){
  //       endResult = await HealthTip.aggregate([{ $match:{_id:mongoose.Types.ObjectId(result[z].contentId) }},{
  //        $project:{
  //          _id: 1,
  //          heading: 1,
  //          readTime: 1,
  //          image: 1,
  //          likes: 1,
  //          shares: 1,
  //          description: 1,
  //        }
  //      }
  //    ]);
  //    console.log('share_count count',result[z].share_count)
  //    endResult[0].share_count=result[z].share_count
  //  }
   let resultData = []
   for(const item of result){
    item.image = process.env.BASE_URL.concat(item.image)
    let count = await Like.countDocuments({
      contentId: mongoose.Types.ObjectId(item._id),
    });
    item.like_count = count
    let shareCount = await Share.findOne({
      contentId: mongoose.Types.ObjectId(item._id),
    });
   if(shareCount){
      item.share_count = shareCount.share_count;
   }else{
      item.share_count = 0;
   }
    resultData.push(item)
  }
  let count = resultData.length

  
        res.status(200).json({
          status: true,
          data: resultData,count
        });
      }else{
        // let count = await Read.find( { type: "healthTip" }).countDocuments()
        let result = [] 
        let read = await Shared.aggregate([
          { $match:{type: "healthTip" }},
          {
            $sort:{'share_count':1}
          },
          { $limit : 30 }
        ])
        for(const item of read ){
          let data = await HealthTip.findOne({ _id:item.contentId}).lean()
          if(data){
            result.push(data)
          }
        }
  //     let endResult=[]
  //     for(z=0;z<result.length;z++){
  //       endResult = await HealthTip.aggregate([{ $match:{_id:mongoose.Types.ObjectId(result[z].contentId) }},{
  //        $project:{
  //          _id: 1,
  //          heading: 1,
  //          readTime: 1,
  //          image: 1,
  //          likes: 1,
  //          shares: 1,
  //          description: 1,
  //        }
  //      }
  //    ]);
  //    console.log('share_count count',result[z].share_count)
  //    endResult[0].share_count=result[z].share_count
  //  }
   let resultData = []
   for(const item of result){
    item.image = process.env.BASE_URL.concat(item.image)
    let count = await Like.countDocuments({
      contentId: mongoose.Types.ObjectId(item._id),
    });
    item.like_count = count
    let shareCount = await Share.findOne({
      contentId: mongoose.Types.ObjectId(item._id),
    });
   if(shareCount){
      item.share_count = shareCount.share_count;
   }else{
      item.share_count = 0;
   }
    resultData.push(item)
  }
  let count = resultData.length
  
        res.status(200).json({
          status: true,
          data: resultData,count
        });
      }
     
    } catch (error) {
      next(error);
    }
  },
  viewMostViewedHealthTips: async (req, res, next) => {
    try {
      if(req.params.id){     
        let result = [] 
        let read = await Read.aggregate([
          { $match:{type: "healthTip" }},
          {
            $sort:{'read_count':1}
          },
          { $limit : 30 }
        ])
        for(const item of read ){
          let data = await HealthTip.findOne({ categories: { $in: [req.params.id] },_id:item.contentId}).lean()
          if(data){
            result.push(data)
          }
        }
      // console.log('aefhaoh',result)
      // let endResult=[]
      // for(z=0;z<result.length;z++){
        
      //    endResult = await HealthTip.aggregate([{ $match:{_id:mongoose.Types.ObjectId(result[z].contentId) }},{
      //     $project:{
      //       _id: 1,
      //       heading: 1,
      //       readTime: 1,
      //       image: 1,
      //       likes: 1,
      //       shares: 1,
      //       description: 1,
      //     }
      //   }
      // ]);
      // console.log('read count',result[z].read_count)
      //   endResult[0].read_count=result[z].read_count
      // }
      // console.log('sdfa',endResult)
  
      let resultData = []
      for(const item of result){
        item.image = base_url.concat(item.image)
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(item._id),
        });
        item.like_count = count
        let shareCount = await Share.findOne({
          contentId: mongoose.Types.ObjectId(item._id),
        });
       if(shareCount){
          item.share_count = shareCount.share_count;
       }else{
          item.share_count = 0;
       }
        resultData.push(item)
      }
      let count = resultData.length
  
    res.status(200).json({
      status: true,
      data: resultData,count
    });
      }else{
        // let count = await Read.find( { type: "healthTip" }).countDocuments()
        let result = [] 
        let read = await Read.aggregate([
          { $match:{type: "healthTip" }},
          {
            $sort:{'read_count':1}
          },
          { $limit : 30 }
        ])
        for(const item of read ){
          let data = await HealthTip.findOne({_id:item.contentId}).lean()
          if(data){
            result.push(data)
          }
        }
      // console.log('aefhaoh',result)
      // let endResult=[]
      // for(z=0;z<result.length;z++){
        
      //    endResult = await HealthTip.aggregate([{ $match:{_id:mongoose.Types.ObjectId(result[z].contentId) }},{
      //     $project:{
      //       _id: 1,
      //       heading: 1,
      //       readTime: 1,
      //       image: 1,
      //       likes: 1,
      //       shares: 1,
      //       description: 1,
      //     }
      //   }
      // ]);
      // console.log('read count',result[z].read_count)
      //   endResult[0].read_count=result[z].read_count
      // }
      // console.log('sdfa',endResult)
  
      let resultData = []
      for(const item of result){
        item.image = base_url.concat(item.image)
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(item._id),
        });
        item.like_count = count
        let shareCount = await Share.findOne({
          contentId: mongoose.Types.ObjectId(item._id),
        });
       if(shareCount){
          item.share_count = shareCount.share_count;
       }else{
          item.share_count = 0;
       }
        resultData.push(item)
      }
      let count = resultData.length
  
    res.status(200).json({
      status: true,
      data: resultData,count
    });
      }
     
    } catch (error) {
      next(error);
    }
  },
  searchHealthTips: async (req, res, next) => {
    try {
      let keyword = req.body.keyword;
      if (keyword) {
        let searchResult = await HealthTip.aggregate([
          {
            $match: {
              $or: [{$text:{$search:`"\"${keyword}\""`}}],
            },
          },
          {
            $project: {
              _id: 1,
              title: "$heading",
              image: 1,
              description: 1,
              posted_on: "$createdAt",
              read_time: "$readTime",
              type: 'healthTip'
            },
          },
        ]);

        // finding like count and save
        for (j = 0; j < searchResult.length; j++) {
          let count = await Like.countDocuments({
            contentId: mongoose.Types.ObjectId(searchResult[j]._id),
          });
          searchResult[j].like_count = count;

          // is liked
          let isLiked = await Like.findOne({
            type: "healthTip",
            contentId: mongoose.Types.ObjectId(searchResult[j]._id),
            userId: req.user._id,
          });

          if (isLiked) {
            searchResult[j].is_liked = 1;
          } else {
            searchResult[j].is_liked = 0;
          }

          searchResult[j].image = process.env.BASE_URL.concat(
            searchResult[j].image
          );

          searchResult[j].posted_on = timeSince(searchResult[j].posted_on)
        }

        res.status(200).json({
          error: false,
          message: "success",
          data: searchResult,
        });
      } else {
        res.status(200).json({
          error: true,
          message: "Please enter search keyword",
          data: "",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  searchHealthTipsByAdmin: async (req, res, next) => {
    try {
      let keyword = req.body.keyword;
      if (keyword) {
        let searchResult = await HealthTip.aggregate([
          {
            $match: {
              $or: [{$text:{$search:`"\"${keyword}\""`}}],
            },
          },
          {
            $project: {
              _id: 1,
              heading:1,
              image: 1,
              description: 1,
              posted_on: "$createdAt",
              read_time: "$readTime",
              type: 'healthTip'
            },
          },
        ]);

        // finding like count and save
        for (j = 0; j < searchResult.length; j++) {
          let count = await Like.countDocuments({
            contentId: mongoose.Types.ObjectId(searchResult[j]._id),
          });
          searchResult[j].like_count = count;

          searchResult[j].image = process.env.BASE_URL.concat(
            searchResult[j].image
          );

          searchResult[j].posted_on = timeSince(searchResult[j].posted_on)
        }

        res.status(200).json({
          error: false,
          message: "success",
          data: searchResult,
        });
      } else {
        res.status(200).json({
          error: true,
          message: "Please enter search keyword",
          data: "",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  editHealthTip: async (req, res, next) => {
    try {
      if (req.params.id) {
        let healthTip = await HealthTip.findOne({
          _id: mongoose.Types.ObjectId(req.params.id),
        });
        if (healthTip) {
          let data = req.body;
          if (req.file) {
            data.image = `medfeed/${req.file.filename}`;
            // deleting old image
            let splittedImageRoute = healthTip.image.split("/");

            fs.unlink(
              `./public/images/${splittedImageRoute[1]}`,
              function (err) {
                if (err) throw err;
              }
            );
          }else{
            data.image = healthTip.image
          }
          HealthTip.updateOne(
            { _id: mongoose.Types.ObjectId(req.params.id) },
            data
          )
            .then((response) => {
              if (response.nModified == 1) {
                res.status(200).json({
                  status: true,
                  data: "updated successfully",
                });
              } else {
                res.status(200).json({
                  status: true,
                  data: "no changes",
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
            data: "invalid health tip id",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          data: "health tip id missing",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteHealthTip: async (req, res, next) => {
    try {
      let valid = await HealthTip.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      console.log("valid", valid);
      if (valid) {
        HealthTip.deleteOne({
          _id: mongoose.Types.ObjectId(req.params.id),
        })
          .then((response) => {
            res.status(200).json({
              status: true,
              data: "Health tip removed successfully",
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
          data: "invalid health tip id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  get_health_tips: async (req, res, next) => {
    try {
      // let type = req.body.type;
      // let result = [];

      // if (type == "newest" || type == "trending" || type == "category") {

      //   let pageNo = req.body.page;
      //   let pageSize = 10;


      //   // for newest
      //   if (type == "newest") {
      //     // result = await HealthTip.aggregate([
      //     //   { $match: { newest: true } },
      //     //   {
      //     //     $project: {
      //     //       title: "$heading",
      //     //       description: 1,
      //     //       image: 1,
      //     //       posted_on: "$createdAt",
      //     //     },
      //     //   },
      //     // ]);

      //     var aggregateQuery = HealthTip.aggregate();

      //     aggregateQuery.match({ newest: true });

      //     aggregateQuery.project({
      //       title: "$heading",
      //       description: 1,
      //       image: 1,
      //       posted_on: "$createdAt"
      //     });

      //     const customLabels = {
      //       totalDocs: "TotalRecords",
      //       docs: "Customers",
      //       limit: "PageSize",
      //       page: "CurrentPage",
      //     };

      //     const aggregatePaginateOptions = {
      //       page: pageNo,
      //       limit: pageSize,
      //       customLabels: customLabels,
      //     };

      //     response = await HealthTip.aggregatePaginate(aggregateQuery, aggregatePaginateOptions)
          
      //     result = response.Customers
      //   }

      //   // // for trending
      //   if (type == "trending") {
      //     // result = await HealthTip.aggregate([
      //     //   { $match: { trending: true } },
      //     //   {
      //     //     $project: {
      //     //       title: "$heading",
      //     //       description: 1,
      //     //       image: 1,
      //     //       posted_on: "$createdAt",
      //     //     },
      //     //   },
      //     // ]);


      //     var aggregateQuery = HealthTip.aggregate();

      //     aggregateQuery.match({ trending: true });

      //     aggregateQuery.project({
      //       title: "$heading",
      //       description: 1,
      //       image: 1,
      //       posted_on: "$createdAt"
      //     });

      //     const customLabels = {
      //       totalDocs: "TotalRecords",
      //       docs: "Customers",
      //       limit: "PageSize",
      //       page: "CurrentPage",
      //     };

      //     const aggregatePaginateOptions = {
      //       page: pageNo,
      //       limit: pageSize,
      //       customLabels: customLabels,
      //     };

      //     response = await HealthTip.aggregatePaginate(aggregateQuery, aggregatePaginateOptions)
          
      //     result = response.Customers
      //   }

      //   // // for category
      //   if (type == "category") {
      //     // result = await HealthTip.aggregate([
      //     //   { $match: { categories: { $in: [req.body.category_id] } } },
      //     //   {
      //     //     $project: {
      //     //       title: "$heading",
      //     //       description: 1,
      //     //       image: 1,
      //     //       posted_on: "$createdAt",
      //     //     },
      //     //   },
      //     // ]);


      //     var aggregateQuery = HealthTip.aggregate();

      //     aggregateQuery.match({ categories: { $in: [req.body.category_id] } });

      //     aggregateQuery.project({
      //       title: "$heading",
      //       description: 1,
      //       image: 1,
      //       posted_on: "$createdAt"
      //     });

      //     const customLabels = {
      //       totalDocs: "TotalRecords",
      //       docs: "Customers",
      //       limit: "PageSize",
      //       page: "CurrentPage",
      //     };

      //     const aggregatePaginateOptions = {
      //       page: pageNo,
      //       limit: pageSize,
      //       customLabels: customLabels,
      //     };

      //     response = await HealthTip.aggregatePaginate(aggregateQuery, aggregatePaginateOptions)
          
      //     result = response.Customers
      //   }

      //   // finding like count and save
      //   for (j = 0; j < result.length; j++) {
      //     let count = await Like.countDocuments({
      //       contentId: mongoose.Types.ObjectId(result[j]._id),
      //     });
      //     // trendingArticles[j] = trendingArticles[j].toJSON();
      //     result[j].like_count = count;

      //     // is added wishlist (liked)
      //     let isLiked = await Like.findOne({
      //       type: "healthTip",
      //       contentId: mongoose.Types.ObjectId(result[j]._id),
      //       userId: req.user._id,
      //     });

      //     if (isLiked) {
      //       result[j].is_liked = 1;
      //     } else {
      //       result[j].is_liked = 0;
      //     }

      //     result[j].type = "healthTip";

      //     result[j].image = process.env.BASE_URL.concat(result[j].image);
      //   }

      //   res.status(200).json({
      //     error: false,
      //     message: "success",
      //     data: {
      //       health_tips: result,
      //     },
      //   });
      // } else {
      //   res.status(200).json({
      //     error: false,
      //     message: "type missing or invalid",
      //   });
      // }

        // let pageNo = req.body.page;
        // let pageSize = 10;


          let newest = await HealthTip.aggregate([
            { $match: { newest: true } },
            {
              $project: {
                title: "$heading",
                description: 1,
                image: 1,
                posted_on: "$createdAt",
                read_time: "$readTime"
              },
            },
          ]);

        // finding like count and save
        for (j = 0; j < newest.length; j++) {
          let count = await Like.countDocuments({
            contentId: mongoose.Types.ObjectId(newest[j]._id),
          });
          // trendingArticles[j] = trendingArticles[j].toJSON();
          newest[j].like_count = count;

          // is added wishlist (liked)
          let isLiked = await Like.findOne({
            type: "healthTip",
            contentId: mongoose.Types.ObjectId(newest[j]._id),
            userId: req.user._id,
          });

          if (isLiked) {
            newest[j].is_liked = 1;
          } else {
            newest[j].is_liked = 0;
          }

          newest[j].type = "healthTip";

          newest[j].image = process.env.BASE_URL.concat(newest[j].image);

          newest[j].posted_on = timeSince(newest[j].posted_on)
          
        }

         // for newest
          // var aggregateQuery = HealthTip.aggregate();

          // aggregateQuery.match({ newest: true });

          // aggregateQuery.project({
          //   title: "$heading",
          //   description: 1,
          //   image: 1,
          //   posted_on: "$createdAt"
          // });

          // const customLabels = {
          //   totalDocs: "TotalRecords",
          //   docs: "Customers",
          //   limit: "PageSize",
          //   page: "CurrentPage",
          // };

          // const aggregatePaginateOptions = {
          //   page: pageNo,
          //   limit: pageSize,
          //   customLabels: customLabels,
          // };

          // response = await HealthTip.aggregatePaginate(aggregateQuery, aggregatePaginateOptions)
          
          // result = response.Customers

        // // for trending
          let trending = await HealthTip.aggregate([
            { $match: { trending: true } },
            {
              $project: {
                title: "$heading",
                description: 1,
                image: 1,
                posted_on: "$createdAt",
                read_time: "$readTime"
              },
            },
          ]);

          // finding like count and save
        for (j = 0; j < trending.length; j++) {
          let count = await Like.countDocuments({
            contentId: mongoose.Types.ObjectId(trending[j]._id),
          });
          // trendingArticles[j] = trendingArticles[j].toJSON();
          trending[j].like_count = count;

          // is added wishlist (liked)
          let isLiked = await Like.findOne({
            type: "healthTip",
            contentId: mongoose.Types.ObjectId(trending[j]._id),
            userId: req.user._id,
          });

          if (isLiked) {
            trending[j].is_liked = 1;
          } else {
            trending[j].is_liked = 0;
          }

          trending[j].type = "healthTip";

          trending[j].image = process.env.BASE_URL.concat(trending[j].image);

          trending[j].posted_on = timeSince(trending[j].posted_on)

        }


          // var aggregateQuery = HealthTip.aggregate();

          // aggregateQuery.match({ trending: true });

          // aggregateQuery.project({
          //   title: "$heading",
          //   description: 1,
          //   image: 1,
          //   posted_on: "$createdAt"
          // });

          // const customLabels = {
          //   totalDocs: "TotalRecords",
          //   docs: "Customers",
          //   limit: "PageSize",
          //   page: "CurrentPage",
          // };

          // const aggregatePaginateOptions = {
          //   page: pageNo,
          //   limit: pageSize,
          //   customLabels: customLabels,
          // };

          // response = await HealthTip.aggregatePaginate(aggregateQuery, aggregatePaginateOptions)
          
          // result = response.Customers

        // for category
          let categoryTips = []
          let allCategories = await HealthTipCategory.find()

          for(i=0; i<allCategories.length; i++) {
            console.log('single::',allCategories[i])
            let categorywise = await HealthTip.aggregate([
              { $match: { categories: { $in: [allCategories[i]._id+''] } } },
              {
                $project: {
                  title: "$heading",
                  description: 1,
                  image: 1,
                  posted_on: "$createdAt",
                  read_time: "$readTime"
                },
              },
            ]);

              // finding like count and save
        for (j = 0; j < categorywise.length; j++) {
          let count = await Like.countDocuments({
            contentId: mongoose.Types.ObjectId(categorywise[j]._id),
          });
          // trendingArticles[j] = trendingArticles[j].toJSON();
          categorywise[j].like_count = count;

          // is added wishlist (liked)
          let isLiked = await Like.findOne({
            type: "healthTip",
            contentId: mongoose.Types.ObjectId(categorywise[j]._id),
            userId: req.user._id,
          });

          if (isLiked) {
            categorywise[j].is_liked = 1;
          } else {
            categorywise[j].is_liked = 0;
          }

          categorywise[j].type = "healthTip";

          categorywise[j].image = process.env.BASE_URL.concat(categorywise[j].image);

          categorywise[j].posted_on = timeSince(categorywise[j].posted_on)
          
        }

            let temp = {
              id: allCategories[i]._id,
              name: allCategories[i].name,
              health_tips: categorywise
            }

            categoryTips.push(temp)

          }

          // var aggregateQuery = HealthTip.aggregate();

          // aggregateQuery.match({ categories: { $in: [req.body.category_id] } });

          // aggregateQuery.project({
          //   title: "$heading",
          //   description: 1,
          //   image: 1,
          //   posted_on: "$createdAt"
          // });

          // const customLabels = {
          //   totalDocs: "TotalRecords",
          //   docs: "Customers",
          //   limit: "PageSize",
          //   page: "CurrentPage",
          // };

          // const aggregatePaginateOptions = {
          //   page: pageNo,
          //   limit: pageSize,
          //   customLabels: customLabels,
          // };

          // response = await HealthTip.aggregatePaginate(aggregateQuery, aggregatePaginateOptions)
          
          // result = response.Customers


        res.status(200).json({
          error: false,
          message: "success",
          data: [{
            item_name: 'newest',
            tips: newest.reverse(),
          },
          {
            item_name: 'category',
            tips: categoryTips.reverse()
          },
          {
            item_name: 'trending',
            tips: trending.reverse()
          }                   
          ]
        });
    } catch (error) {
      next(error);
    }
  },
  getHealthTipTabCount:async(req,res,next)=>{
    try {
      let all = await HealthTip.find().countDocuments()
      let trending = await HealthTip.find( { trending: true }).countDocuments()
      let newest = await HealthTip.find(
        { newest: true }).countDocuments()
      let mostShared = [] 
      let shared = await Shared.aggregate([
        { $match:{type: "healthTip" }},
        {
          $sort:{'share_count':1}
        },
        { $limit : 30 }
      ])
      for(const item of shared ){
        let data = await HealthTip.findOne({_id:item.contentId});
        if(data){
          mostShared.push(data)
        }
      }
      let mostViewed = []
      let read = await Read.aggregate([
        { $match:{type: "healthTip" }},
        {
          $sort:{'read_count':1}
        },
        { $limit : 30 }
      ])
      for(const item of read ){
        let data = await HealthTip.findOne({ categories: { $in: [req.params.id] },_id:item.contentId});
        if(data){
          mostViewed.push(data)
        }
      }
      res.status(200).json({
        error: false,
        message: "success",
        data: {
          allHealthTip:all,
          mostViewed:mostViewed.length,
          mostShared:mostShared.length,
          newest: newest,
          trending: trending,
        },
      });
    } catch (error) {
      next(error)
    }
  }
};
