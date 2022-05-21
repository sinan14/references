
const base = require("./baseController");
const ArticleCategory = require("../models/medfeed/articleCategory");
const LiveUpdate = require("../models/medfeed/articleLiveUpdate");
const Articles = require("../models/medfeed/article")
const Like = require("../models/like");
const Save = require("../models/save");

const mongoose = require("mongoose");
const { Mongoose } = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");


const unlinkAsync = promisify(fs.unlink);



module.exports = {
 /**********************************************************************************************************************************
 ARTICLE CATEGORY MANAGEMENT
 **********************************************************************************************************************************/

 // =====================ARTICLE CATEGORY CREATION
  addArticleCategory: async (req, res, next) => {
    try {
      let data = req.body;
      
      data.image = `medfeed/articlecategory/${req.file.filename}`;
      let existingCategory = await ArticleCategory.findOne({ name: data.name });//checking category exist or not
      if (!existingCategory) {
        if(req.file) {
          data.image = `medfeed/articlecategory/${req.file.filename}`;

          let schemaObj = new ArticleCategory(data);
          schemaObj.save().then((response) => {
            res.status(200).json({
              status: true,
              data: "Category Added Successfully",
            });
          }).catch(async(error) => {
            await unlinkAsync(req.file.path);
            res.status(200).json({
              status:false,
              data:error
            })
          });
        } else {
          res.status(200).json({
            status:false,
            data:'Please Upload Image'
          })
        } 
      } else {
        if(req.file){
          await unlinkAsync(req.file.path);
        }
        await unlinkAsync(req.file.path);
        res.status(200).json({
          status: false,
          data: "Existing Category",
        });
      }
    } catch (error) {
      next(error);
    }
  },
 // =====================LISTING ALL ARTICLE CATEGORIES
  getAllArticleCategories: async (req, res, next) => {
    try {
      let result = await ArticleCategory.find();
      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
 // =====================LISTING HOME PAGE  ARTICLE CATEGORIES 
  getHomePageArticleCategories: async (req, res, next) => {
    try {
      let result = await ArticleCategory.find({ homepage: true });
      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
 // =====================LISTING PARENT ARTICLE CATEGORIES 

  viewMainArticleCategories: async (req, res, next) => {
    try {
      let result = await ArticleCategory.find({ parent: "main" },{
        _id:1,
        name:1,
        image:1
      });

      result.map((e,i) => {
        e.image = process.env.BASE_URL.concat(e.image)
      })

      res.status(200).json({
        message: "success",
        error: false,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },
 // =====================SEARCHING FOR A SPECIFIC ARTICLE CATEGORY
  viewArticleCategory: async (req, res, next) => {
    try {
      let category = await ArticleCategory.findOne({_id:mongoose.Types.ObjectId(req.params.id)})
      if(category){
        res.status(200).json({
          status:true,
          data:category
        })
      } else {
        res.status(200).json({
          status:false,
          data:'invalid category id'
        })
      }
    } catch (error) {
      next(error)
    }
  },
 // =====================UPDATING  A SPECIFIC ARTICLE CATEGORY  DETAILS - PARAMETER CATEGORY ID
  editArticleCategory: async(req, res, next) => {
    try {
      let data = req.body;

      if (data.categoryId) {
        let category = await ArticleCategory.findOne({_id:mongoose.Types.ObjectId(data.categoryId)})
      
        if(category) {
          if(req.file){
            data.image = `articlecategory/${req.file.filename}`;
            // deleting old image
            let splittedImageRoute = category.image.split('/')
            console.log('splitted::',splittedImageRoute[1])
  
            fs.unlink(`./public/images/medfeed/${splittedImageRoute[1]}`, function (err) {
              if (err) throw err;
             
            });
          }
          ArticleCategory.updateOne(
            { _id: mongoose.Types.ObjectId(data.categoryId) },
            data
          ).then((response) => {
            console.log('res::',response)
            if(response.nModified == 1) {
              res.status(200).json({
                status: true,
                data: "Updated"
              });
            } else {
              res.status(200).json({
                status: false,
                data: 'Not updated'
              })
            }
          });
        } else {
          res.status(200).json({
            status: false,
            data: 'invalid categoryId'
          })
        }
      } else {
        res.status(200).json({
          status: false,
          data: 'please enter categoryId'
        })
      }
    } catch (error) {
      next(error);
    }
  },
 // =====================REMOVING AN ARTICLE  CATEGORY 
  deleteArticleCategory: async (req, res, next) => {
    try {
      let category = await ArticleCategory.findOne({_id:mongoose.Types.ObjectId(req.params.id)})

      if (category) {

        let parentCategory = await ArticleCategory.findOne({parent:req.params.id})

        if(!parentCategory) {

          let articles = await Articles.find()
          

          if(articles.length) {
            let articleExistUnderThisCategory = await Articles.findOne({categories:{ $elemMatch: req.params.id }})
            

            if(!articleExistUnderThisCategory) {
              let splittedImageRoute = category.image.split('/')
              fs.unlink(`./public/images/medfeed/${splittedImageRoute[1]}`, function (err) {
                if (err) throw err;
              });
              ArticleCategory.deleteOne({
                _id: mongoose.Types.ObjectId(req.params.id),
              }).then((response) => {
                res.status(200).json({
                  status: true,
                  data: "Category removed",
                });
              });
            } else {
              res.status(200).json({
                status: false,
                data: 'Cannot delete this category: there are some articles under this category'
              })
            } 
          }

          let splittedImageRoute = category.image.split('/')
          fs.unlink(`./public/images/medfeed/${splittedImageRoute[1]}`, function (err) {
            if (err) throw err;
          });
          ArticleCategory.deleteOne({
            _id: mongoose.Types.ObjectId(req.params.id),
          }).then((response) => {
            res.status(200).json({
              status: true,
              data: "Category removed",
            });
          });
        } else {
          res.status(200).json({
            status: false,
            data: 'Sorry, cannot be delete a parent category'
          })
        }
      } else {
        res.status(200).json({
          status: false,
          data: 'invalid category id'
        })
      }
    } catch (error) {
      next(error);
    }
  },
 // ===================== ARTICLE LIVE UPDATIONS 
  addLiveUpdate: async (req, res, next) => {
    try {
      let exists = await LiveUpdate.find();
      console.log('exist',exists)

      if (exists.length) {
        let data = req.body;
        let category = await ArticleCategory.findOne({
          _id: mongoose.Types.ObjectId(data.category),
        });

        if (category) {
          if (req.file) {
            data.image = `articleLive/${req.file.filename}`;
            // deleting old image
            let splittedImageRoute = exists[0].image.split('/')
           
    
            fs.unlink(`./public/images/medfeed/${splittedImageRoute[1]}`, function (err) {
              if (err) throw err;
                
            });
          }    

          LiveUpdate.updateOne(
            { _id: mongoose.Types.ObjectId(exists[0]._id) },
            data
          ).then((response) => {
            console.log(response)
            if (response.nModified == 1) {
              let now = new Date();
              LiveUpdate.updateOne(
                { _id: mongoose.Types.ObjectId(exists[0]._id) },{
                  $set:{
                    updatedAt:now
                  }
                }                
              ).then((response) => {
                res.status(200).json({
                  status: true,
                  data: "Updated successfully",
                });
              })          
            } else {
              res.status(200).json({
                status: true,
                data: "No changes",
              });
            }
            
          });
        } else {
          if (req.file) {
            await unlinkAsync(req.file.path);
          }

          res.status(200).json({
            status: false,
            data: "Invalid category Id",
          });
        }
      } else {
        let category = await ArticleCategory.findOne({
          _id: mongoose.Types.ObjectId(data.category),
        });

        if (category) {
          let data = req.body
          data.image = `medfeed/articleLive/${req.file.filename}`;
  
          let schemaObj = new LiveUpdate(data);
          schemaObj.save().then((response) => {
            res.status(200).json({
              status: true,
              data: "Live update added",
            });
          }).catch(async(error) => {
            await unlinkAsync(req.file.path);
            res.status(200).json({
              status:false,
              data:error
            })
          });
        } else {
          res.status(200).json({
            status: false,
            data: 'invalid category id'
          })
        }
      }
    } catch (error) {
      next(error);
    }
  },
  /*************************************************************************************************************************** 
                                                        ARTICLE MANAGEMENT
  *************************************************************************************************************************** */
 // =====================LISTING PARENT ARTICLE CATEGORIES ,TRENDING ARTICLES AND NEWEST ARTICLE
  viewMainArticleCategoriesAndArticles: async (req, res, next) => {
    try {
      let categories = await ArticleCategory.find({ parent: "main" },{
        _id:1,
        name:1,
        image:1
      });

      categories.map((e,i) => {
        e.image = process.env.BASE_URL.concat(e.image)
      })

 // ******************************************** Trending Articles ***********
      let trendingArticles = await Articles.aggregate([
        {$match:{trending:true}},
        {$project:{title:"$heading",
          readTime:1,
          image:1,
          createdAt:1,
          type: "article"
        }
        }
      ])

 // finding like count and save
      for (j = 0; j < trendingArticles.length; j++) {
        //Finding Total like count
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(trendingArticles[j]._id),
        });
        trendingArticles[j].like_count = count;
 // Checking user saved this article or not
        let isSaved = await Save.findOne({
          type: "article",
          contentId: mongoose.Types.ObjectId(trendingArticles[j]._id),
          userId: req.user._id,
        });

        if (isSaved) {
          trendingArticles[j].is_saved = 1;
        } else {
          trendingArticles[j].is_saved = 0;
        }

 // Checking user liked this article or not
        let isLiked = await Like.findOne({
          type: "article",
          contentId: mongoose.Types.ObjectId(trendingArticles[j]._id),
          userId: req.user._id,
        });

        if (isLiked) {
          trendingArticles[j].is_liked = 1;
        } else {
          trendingArticles[j].is_liked = 0;
        }


        trendingArticles[j].image = process.env.BASE_URL.concat(trendingArticles[j].image)
      }
 //************************************END OF TRENDING ARTICLES************************************************************ */
 // ************************** Newest Articles ***********
      let newestArticles = await Articles.aggregate([
        {$match:{newest:true}},
        {$project:{title:"$heading",
          readTime:1,
          image:1,
          createdAt:1,
          type: "article"
        }
        }
      ])

 //Finding Total like count
      for (j = 0; j < newestArticles.length; j++) {
        
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(newestArticles[j]._id),
        });
        
        newestArticles[j].like_count = count;
 // Checking user saved this article or not
        let isSaved = await Save.findOne({
          type: "article",
          contentId: mongoose.Types.ObjectId(newestArticles[j]._id),
          userId: req.user._id,
        });

        if (isSaved) {
          newestArticles[j].is_saved = 1;
        } else {
          newestArticles[j].is_saved = 0;
        }

 // Checking user liked this article or not
        let isLiked = await Like.findOne({
          type: "article",
          contentId: mongoose.Types.ObjectId(newestArticles[j]._id),
          userId: req.user._id,
        });

        if (isLiked) {
          newestArticles[j].is_liked = 1;
        } else {
          newestArticles[j].is_liked = 0;
        }

        newestArticles[j].image = process.env.BASE_URL.concat(newestArticles[j].image)
      }
 // combining all data
      let response = {}
      response.category = categories
      response.trendingArticles = trendingArticles
      response.newestArticles = newestArticles

      res.status(200).json({
        message: "success",
        error: false,
        data: response
      });
    } catch (error) {
      next(error);
    }
  },
 // ===================== ARTICLES DETAILS ADDING
  addArticle: async (req, res, next) => {
    try {
      let data = req.body;
      let existing = await Articles.findOne({ heading: data.heading });
      if (!existing) {
        if (req.file) {
          data.image = `articles/${req.file.filename}`;

          let schemaObj = new Articles(data);
          schemaObj
            .save()
            .then((response) => {
              res.status(200).json({
                status: true,
                data: "Article added successfully",
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
          data: "There is an article with this heading",
        });
      }
    } catch (error) {
      next(error);
    }
  },
 // =====================LIST ALL ARTICLES DETAILS
  viewAllArticles: async (req, res, next) => {
    try {
      let allArticles = await Articles.find(
        {},
        {
          _id: 1,
          heading: 1,
          authorName: 1,
          image: 1,
          likes: 1,
          description: 1,
        }
      );

      res.status(200).json({
        status: true,
        data: allArticles,
      });
    } catch (error) {
      next(error);
    }
  },
 // ===================== VIEW DETAILS OF A SPECIFIC ARTICLE BY PASSING ARTICLE ID
  viewArticle: async (req, res, next) => {
    try {
      let article = await Articles.findOne(
        {
          _id: mongoose.Types.ObjectId(req.body.article_id),
        },
        {
          categories: 0,
          trending: 0,
          newest: 0,
          homepageMain: 0,
          homepageSub: 0,
          reviewedBy: 0,
          designation: 0,
          authorName: 0,
          updatedAt: 0,
          __v: 0,
        }
      )
        .populate({
          path: "related_articles",
          select: ["_id", "heading", "image"],
        })
        .populate({
          path: "related_products",
          select: ["_id", "title", "price", "special_price", "image"],
        })
        .populate({ path: "tagged_categories", select: ["_id", "name"] });
      if (article) {
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(req.body.article_id),
        });
        console.log("like count:", count);
        article = article.toJSON();
        article.like_count = count;

        let isSaved = await Save.findOne({
          type: "article",
          contentId: mongoose.Types.ObjectId(req.body.article_id),
          userId: req.user._id,
        });

        if (isSaved) {
          article.is_saved = 1;
        } else {
          article.is_saved = 0;
        }


        // is added wishlist (liked)
        let isLiked = await Like.findOne({
          type: "article",
          contentId: mongoose.Types.ObjectId(req.body.article_id),
          userId: req.user._id,
        });

        if (isLiked) {
          article.is_liked = 1;
        } else {
          article.is_liked = 0;
        }

        article.image = process.env.BASE_URL.concat(article.image);
        
        article.title = article.heading
        delete article.heading

        article.post_time = article.createdAt
        delete article.createdAt

        article.read_time = article.readTime
        delete article.readTime

        article.related_articles.map((e, i) => {
          e.image = process.env.BASE_URL.concat(e.image);
        });

        article.type = 'article'

        res.status(200).json({
          message: "success",
          error: false,
          data: { article_detail: article },
        });
      } else {
        res.status(200).json({
          status: false,
          data: "invalid article id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
 // ===================== VIEW DETAILS OF SUBCATEGORIZED   ARTICLES
  viewArticlesBySubcategory: async (req, res, next) => {
    try {
      let allArticles = await Articles.find(
        { categories: { $in: req.body.categories } },
        {
          _id: 1,
          heading: 1,
          authorName: 1,
          image: 1,
          description: 1,
          createdAt: 1,
          readTime: 1,
        }
      );

      for (i = 0; i < allArticles.length; i++) {
        allArticles[i] = allArticles[i].toJSON();
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(allArticles[i]._id),
        });
        allArticles[i].likes = count;
      }

      res.status(200).json({
        status: true,
        data: allArticles,
      });
    } catch (error) {
      next(error);
    }
  },
 // ===================== LIST CATEGORIZED   ARTICLES
  viewArticlesByCategory: async (req, res, next) => {
    try {
      let category = await ArticleCategory.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (category) {
        let categories = await ArticleCategory.find({
          parent: { $in: [req.params.id] },
        });
        let ids = [];
        categories.map((elem) => {
          ids.push(elem._id + "");
        });
        console.log(typeof ids);

        let articles = await Articles.find(
          { categories: { $in: ids } },
          {
            _id: 1,
            heading: 1,
            authorName: 1,
            image: 1,
            likes: 1,
            description: 1,
          }
        );

        res.status(200).json({
          status: true,
          data: articles,
        });
      } else {
        res.status(200).json({
          status: false,
          data: "invalid category id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  // ===================== LIST THE TRENDING   ARTICLES
  viewTrendingArticles: async (req, res, next) => {
    try {
      let result = await Articles.find(
        { trending: true },
        {
          _id: 1,
          heading: 1,
          authorName: 1,
          image: 1,
          likes: 1,
          description: 1,
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
 // ===================== LIST ALL NEWEST  ARTICLES
  viewNewestArticles: async (req, res, next) => {
    try {
      let result = await Articles.find(
        { newest: true },
        {
          _id: 1,
          heading: 1,
          authorName: 1,
          image: 1,
          likes: 1,
          description: 1,
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
 // =====================   MAIN ARTICLES WHICH SHOWS IN HOME MAIN PAGE
  viewHomepageMainArticles: async (req, res, next) => {
    try {
      let result = await Articles.find(
        { homepageMain: true },
        {
          _id: 1,
          heading: 1,
          authorName: 1,
          image: 1,
          likes: 1,
          description: 1,
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
 // ===================== SUB  ARTICLES IN HOME PAGE
  viewhomepageSubArticles: async (req, res, next) => {
    try {
      let result = await Articles.find(
        { homepageSub: true },
        {
          _id: 1,
          heading: 1,
          authorName: 1,
          image: 1,
          likes: 1,
          description: 1,
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
 // ===================== SEARCH RESULT OF ARTICLES
  searchArticle: async (req, res, next) => {
    try {
      let keyword = req.body.keyword;
      if (keyword) {
        let searchResult = await Articles.find(
          {
            $or: [
              {
                heading: { $regex: `^${keyword}`, $options: "i" },
              },
            ],
          },
          {
            _id: 1,
            heading: 1,
            image: 1,
            readTime: 1,
            createdAt: 1,
          }
        );

        // finding like count and save
        for (j = 0; j < searchResult.length; j++) {
          let count = await Like.countDocuments({
            contentId: mongoose.Types.ObjectId(searchResult[j]._id),
          });
          searchResult[j] = searchResult[j].toJSON();
          searchResult[j].like_count = count;

          let isSaved = await Save.findOne({
            type: "article",
            contentId: mongoose.Types.ObjectId(searchResult[j]._id),
            userId: req.user._id,
          });

          if (isSaved) {
            searchResult[j].is_saved = 1;
          } else {
            searchResult[j].is_saved = 0;
          }

          // is liked
          let isLiked = await Like.findOne({
            type: "article",
            contentId: mongoose.Types.ObjectId(searchResult[j]._id),
            userId: req.user._id,
          });

          if (isLiked) {
            searchResult[j].is_liked = 1;
          } else {
            searchResult[j].is_liked = 0;
          }

          // Field names changing
          searchResult[j].title = searchResult[j].heading
          delete searchResult[j].heading

          searchResult[j].post_time = searchResult[j].createdAt
          delete searchResult[j].createdAt

          searchResult[j].read_time = searchResult[j].readTime
          delete searchResult[j].readTime

          searchResult[j].image = process.env.BASE_URL.concat(
            searchResult[j].image
          );
        }

        res.status(200).json({
          error: false,
          message: "successs",
          data: { article_list: searchResult },
        });
      } else {
        res.status(200).json({
          error: true,
          data: "Please enter search keyword",
        });
      }
    } catch (error) {
      next(error);
    }
  },
 // ===================== UDATE  ARTICLES DETAILS
  editArticle: async (req, res, next) => {
    try {
      console.log('edit incoming:=========:',req.body)
      if (req.body.articleId) {
        let article = await Articles.findOne({
          _id: mongoose.Types.ObjectId(req.body.articleId),
        });

        if (article) {
          let data = req.body;
          if (req.file) {
            data.image = `medfeed/${req.file.filename}`;
            // deleting old image
            let splittedImageRoute = article.image.split("/");

            fs.unlink(
              `./public/images/${splittedImageRoute[1]}`,
              function (err) {
                if (err) throw err;
              }
            );
          }
          Articles.updateOne(
            { _id: mongoose.Types.ObjectId(data.articleId) },
            data
          )
            .then((response) => {
              res.status(200).json({
                status: true,
                data: "updated successfully",
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
            data: "invalid article id",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          data: "articleId missing",
        });
      }
    } catch (error) {
      next(error);
    }
  },
 // ===================== REMOVE ARTICLE DETAILS
  deleteArticle: async (req, res, next) => {
    try {
      let valid = await Articles.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (valid) {
        Articles.deleteOne({
          _id: mongoose.Types.ObjectId(req.params.id),
        }).then((response) => {
          let splittedImageRoute = valid.image.split("/");
          fs.unlink(`./public/images/${splittedImageRoute[1]}`, function (err) {
            if (err) throw err;
          });
          res.status(200).json({
            status: true,
            data: "Category removed successfully",
          });
        });
      } else {
        res.status(200).json({
          status: false,
          data: "invalid category id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
 // =====================  ARTICLE SUBCATEGORY DETAILS
  viewArticleSubCategories: async (req, res, next) => {
    try {
      let valid = await ArticleCategory.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
        parent: "main",
      });
      if (valid) {
        let result = await ArticleCategory.find({ parent: req.params.id });
        res.status(200).json({
          status: true,
          data: result,
        });
      } else {
        res.status(200).json({
          status: false,
          data: "invalid category",
        });
      }
    } catch (error) {
      next(error);
    }dd
  },
  // =====================  ARTICLE DETAILS WITH SUBCATEGORY 
  viewSubCategoriesWithArticles: async (req, res, next) => {
    try {
      if (req.body.category_id) {
        let mainCategory = await ArticleCategory.findOne({
          _id: mongoose.Types.ObjectId(req.body.category_id),
        });

        if (mainCategory) {
          // let categories = await ArticleCategory.find({
          //   parent: mainCategory._id,
          // });

          // {$project: {sub_cat_id:"$_id", sub_cat_name:"$name", _id:0}}

          let test = mainCategory._id+''

          let categories = await ArticleCategory.aggregate([ 
            { $match : { parent : test } },
            {$project: {sub_cat_name:"$name"}}
           ]);

          let ids = [];

          categories.map((e, i) => {
            ids.push(e._id + "");
          });

          // let structure = [{
          //   category_id:,
          //   category_name:,
          //   article_list:[{

          //   }]
          // }]

          let structure = [];

          for (i = 0; i < ids.length; i++) {
            let articles = await Articles.aggregate([
              {$match:{ categories: ids[i] }},
              {$project:
                {
                  _id: 1,
                  title: "$heading",
                  read_time: "$readTime",
                  createdAt: 1,
                  image: 1,
                  type: "article"
                }
              }
            ]);

            if (articles.length) {
              let category = await ArticleCategory.aggregate([
                {$match:{_id:mongoose.Types.ObjectId(ids[i])}},
                {$project:{sub_cat_id:"$_id",sub_cat_name:"$name",_id:0}}                
              ]);

              // finding like count and save
              for (j = 0; j < articles.length; j++) {
                let count = await Like.countDocuments({
                  contentId: mongoose.Types.ObjectId(articles[j]._id),
                });
                // articles[j] = articles[j].toJSON();
                articles[j].like_count = count;

                let isSaved = await Save.findOne({
                  type: "article",
                  contentId: mongoose.Types.ObjectId(articles[j]._id),
                  userId: req.user._id,
                });

                if (isSaved) {
                  articles[j].is_saved = 1;
                } else {
                  articles[j].is_saved = 0;
                }

                // is liked
                let isLiked = await Like.findOne({
                  type: "article",
                  contentId: mongoose.Types.ObjectId(articles[j]._id),
                  userId: req.user._id,
                });

                if (isLiked) {
                  articles[j].is_liked = 1;
                } else {
                  articles[j].is_liked = 0;
                }

                articles[j].image = process.env.BASE_URL.concat(
                  articles[j].image
                );
              }

              let temp = category[0]
              temp.article_list = articles;
              console.log("articles::", articles);

              structure.push(temp);
            }
          }

          // Articles.find({
          //   categories: {
          //     $in: ids
          //   }},{
          //     _id:1,
          //     heading:1,
          //     readTime:1,
          //     createdAt:1
          //   }).then((response) => {
          //     console.log('response:::',response)
          //   })

          // let result = await ArticleCategory.find({ homepage:true },{_id:1});
          // let array = []
          // result.map(e => {
          //   array.push(e._id)
          // })

          // console.log('aray',array)

          let data = {
            article: structure
          };

          // let articles = await Articles.find({ categories:{ $elemMatch: {$in:array}}})
          // console.log('aa',articles)
          res.status(200).json({
            error: false,
            message: "success",
            data: data,
          });
        } else {
          res.status(200).json({
            error: true,
            message: "invalid category_id",
            data: [],
          });
        }
      } else {
        res.status(200).json({
          error: true,
          message: "category_id missing",
          data: [],
        });
      }
    } catch (error) {
      next(error);
    }
  },

 
};
