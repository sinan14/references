const Articles = require("../models/article");
const mongoose = require("mongoose");
const ArticleCategory = require("../models/articleCategory");
const Save = require("../models/save");
const Share = require("../models/share");
const ProductSchema = require("../models/inventory");
const moment = require("moment");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const MasterBrand = require("../models/mastersettings/brand");

const Like = require("../models/like");
const Read = require("../models/read");
const MasterUOMValue = require("../models/mastersettings/uomValue");

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
  addArticle: async (req, res, next) => {
    try {
      console.log("incoming article::==", req.body);
      let data = req.body;
      let existing = await Articles.findOne({ heading: data.heading });
      if (!existing) {
        // Checking whether all entered categories are valid sub categories or not
        let invalidSubCat = false;

        console.log("categories:", data.categories);

        for(i=0; i < data.categories.length; i++) {
          let validSubCat = await ArticleCategory.findOne({_id:mongoose.Types.ObjectId(data.categories[i]), parent: {$ne: 'main'}})
          console.log('sub cat',validSubCat)
          if(!validSubCat) {
            console.log('howss')
            invalidSubCat = true
            break;
          }
        }

        // console.log('invalid cat bool',invalidSubCat)

        if(data.categories.includes('undefined')) {
          return res.status(200).json({
            status: false,
            data: "Invalid category",
          });
        }

        if (!invalidSubCat) {
          if (req.file) {
            data.image = `medfeed/${req.file.filename}`;

            // if(data.homepageMain){
            //   console.log('in homepage if')
            //   Articles.updateMany({homepageMain:true},{$set:{homepageMain: false}}).catch(err=>console.log(err))
            // }
            if (req.body.homepageMain === "true") {
              console.log("in homepage if video");
              Articles.updateMany(
                { homepageMain: true },
                { $set: { homepageMain: false } }
              ).catch((err) => console.log(err));
            }
            let schemaObj = new Articles(data);
            schemaObj
              .save()
              .then((response) => {
                return res.status(200).json({
                  status: true,
                  data: "Article added successfully",
                });
              })
              .catch(async (error) => {
                await unlinkAsync(req.file.path);
                return res.status(200).json({
                  status: false,
                  data: error,
                });
              });
          } else {
            return res.status(200).json({
              status: false,
              data: "Please upload image",
            });
          }
        } else {
          if (req.file) {
            await unlinkAsync(req.file.path);
          }
          return res.status(200).json({
            status: false,
            data: "Invalid category",
          });
        }
      } else {
        if (req.file) {
          await unlinkAsync(req.file.path);
        }
        res.status(200).json({
          status: false,
          data: "There is an article with this heading",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  viewAllArticles: async (req, res, next) => {
    try {
      let allArticles = await Articles.find(
        {},
        {
          _id: 1,
          heading: 1,
          image: 1,
          description: 1,
          authorName: 1,
        }
      );

      for (i = 0; i < allArticles.length; i++) {
        allArticles[i] = allArticles[i].toJSON();
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(allArticles[i]._id),
        });
        allArticles[i].likes = count;

        let shared = await Share.findOne({
          contentId: mongoose.Types.ObjectId(allArticles[i]._id),
        });

        if (shared) {
          allArticles[i].shares = shared.share_count;
        } else {
          allArticles[i].shares = 0;
        }

        allArticles[i].image = process.env.BASE_URL.concat(
          allArticles[i].image
        );
      }

      res.status(200).json({
        status: true,
        data: allArticles,
      });
    } catch (error) {
      next(error);
    }
  },
  viewMostViewedArticles: async (req, res, next) => {
    try {
      let result = await Read.aggregate([
        { $match: { type: "article" } },
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

      let articles = [];

      for (single of result) {
        let article = await Articles.findOne({
          _id: mongoose.Types.ObjectId(single.contentId),
        }).lean();
        if (article) {
          let count = await Like.countDocuments({
            contentId: mongoose.Types.ObjectId(article._id),
          });
          article.likes = count;

          let shared = await Share.findOne({
            contentId: mongoose.Types.ObjectId(article._id),
          });

          if (shared) {
            article.shares = shared.share_count;
          } else {
            article.shares = 0;
          }

          article.image = process.env.BASE_URL.concat(article.image);

          articles.push(article);
        }
      }

      res.status(200).json({
        status: true,
        data: {
          most_viewed_articles: articles,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  viewMostSharedArticles: async (req, res, next) => {
    try {
      let result = await Share.aggregate([
        { $match: { type: "article" } },
        {
          $project: {
            _id: 1,
            type: 1,
            contentId: 1,
            share_count: 1,
          },
        },
        {
          $sort: { shareCount: 1 },
        },
        { $limit: 100 },
      ]);
      console.log("Share", result);

      let articles = [];

      for (single of result) {
        let article = await Articles.findOne({
          _id: mongoose.Types.ObjectId(single.contentId),
        }).lean();
        if (article) {
          let count = await Like.countDocuments({
            contentId: mongoose.Types.ObjectId(article._id),
          });
          article.likes = count;

          let shared = await Share.findOne({
            contentId: mongoose.Types.ObjectId(article._id),
          });

          if (shared) {
            article.shares = shared.share_count;
          } else {
            article.shares = 0;
          }

          article.image = process.env.BASE_URL.concat(article.image);

          articles.push(article);
        }
      }
      console.log(articles);
      res.status(200).json({
        status: true,
        data: {
          most_shared_articles: articles.reverse(),
        },
      });
    } catch (error) {
      next(error);
    }
  },
  listArticles: async (req, res, next) => {
    try {
      let allArticles = await Articles.find({}, { heading: 1 });

      res.status(200).json({
        status: false,
        data: allArticles,
      });
    } catch (error) {
      next(error);
    }
  },
  viewArticleById: async (req, res, next) => {
    try {
      let article = await Articles.findOne(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        }
      ).lean();

      if (article) {
        console.log("arit:", article);

        console.log('all__categories___',article.categories)

        let newCat = []

        for(let i of article.categories) {

          let subCategory = await ArticleCategory.findOne({
            _id: mongoose.Types.ObjectId(i),
          });

          newCat.push({
            _id: subCategory._id,
            name: subCategory.name,
          })

        }

        article.categories = newCat

        console.log('all__categories___after__',article.categories)

        // for (i = 0; i < article.categories.length; i++) {
        //   let subCategory = await ArticleCategory.findOne({
        //     _id: mongoose.Types.ObjectId(article.categories[i]),
        //   });

        //   article.categories[i] = {
        //     _id: subCategory._id,
        //     name: subCategory.name,
        //   };
        // }

        let relArt = []
        for(let i of article.related_articles) {

          let singlearticle = await Articles.findOne({
            _id: mongoose.Types.ObjectId(i),
          });

          relArt.push({
            _id: singlearticle._id,
            heading: singlearticle.heading,
          })

        }
        article.related_articles = relArt

        // for (i = 0; i < article.related_articles.length; i++) {
        //   let singlearticle = await Articles.findOne({
        //     _id: mongoose.Types.ObjectId(article.related_articles[i]),
        //   });

        //   article.related_articles[i] = {
        //     _id: singlearticle._id,
        //     heading: singlearticle.heading,
        //   };
        // }

        let relProds = []
        for(let i of article.related_products) {

          let product = await ProductSchema.findOne({
            _id: mongoose.Types.ObjectId(i),
          });

          relProds.push({
            _id: product._id,
            name: product.name,
          })

        }
        article.related_products = relProds

        // for (i = 0; i < article.related_products.length; i++) {
        //   let product = await ProductSchema.findOne({
        //     _id: mongoose.Types.ObjectId(article.related_products[i]),
        //   });

        //   article.related_products[i] = {
        //     _id: product._id,
        //     name: product.name,
        //   };
        // }

        let tagCats = []
        for(let i of article.tagged_categories) {

          let mainCategory = await ArticleCategory.findOne({
            _id: mongoose.Types.ObjectId(i),
          });

          tagCats.push({
            _id: mainCategory._id,
            name: mainCategory.name,
          })

        }
        article.tagged_categories = tagCats

        // for (i = 0; i < article.tagged_categories.length; i++) {
        //   let mainCategory = await ArticleCategory.findOne({
        //     _id: mongoose.Types.ObjectId(article.tagged_categories[i]),
        //   });

        //   article.tagged_categories[i] = {
        //     _id: mainCategory._id,
        //     name: mainCategory.name,
        //   };
        // }

        // for(category of article.categories) {
        //   console.log('for offff:',category)
        //   let subCategory = await ArticleCategory.findOne({_id:mongoose.Types.ObjectId(category)})
        //   category = {
        //     _id: subCategory._id,
        //     name: subCategory.name
        //   }
        // }

        article.image = process.env.BASE_URL.concat(article.image);

        console.log('resopnse__data',article)

        res.status(200).json({
          status: true,
          message: "success",
          data: {
            article: article,
          },
        });
      } else {
        res.status(200).json({
          status: false,
          message: "article not found",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  viewArticle: async (req, res, next) => {
    try {
      let article = await Articles.findOne(
        {
          _id: mongoose.Types.ObjectId(req.body.article_id),
        },
        {
          trending: 0,
          newest: 0,
          homepageMain: 0,
          homepageSub: 0,
          __v: 0,
        }
      )
        .populate({
          path: "related_articles",
          select: ["_id", "heading", "image", "description", "authorName", "createdAt" ],
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

        article.title = article.heading;
        delete article.heading;

        article.read_time = article.readTime;
        delete article.readTime;

        article.related_articles.map((e, i) => {
          e.image = process.env.BASE_URL.concat(e.image);
        });

        article.type = "article";

        article.createdAt = moment(article.createdAt).format("DD MMM YYYY");

        // related products
        let related_products = [];
        for (const item of article.related_products) {
          let inventoryItem = await ProductSchema.findOne({ _id: item }).lean();
          let count = 0;
          if (inventoryItem) {
            for (const price of inventoryItem.pricing) {
              if (count === 0) {
                if (!price.stock == 0) {
                  price.varientId = price._id;
                  price._id = inventoryItem._id;
                  price.title = inventoryItem.name;
                  price.offer = `${Math.round((price.specialPrice/price.price)*100)}%`
                  if (price.image) {
                    price.image = process.env.BASE_URL+price.image[0]
                  }
                  price.metaTitles = inventoryItem.metaTitles
                  let brandDetails = await MasterBrand.findOne({_id:inventoryItem.brand})
                  if (brandDetails) {
                    price.brand = brandDetails.title
                  }

                  if (inventoryItem.statusLimit < price.stock) {
                    price.stockstatus = "Available";
                  } else if (price.stock == 0) {
                    price.stockStatus = "Out of stock";
                  } else {
                    price.stockstatus = "Limited";
                  }

                  let uomValue = await MasterUOMValue.findOne(
                    { _id: mongoose.Types.ObjectId(price.sku) },
                    {
                      uomValue: 1,
                    }
                  );

                  if (uomValue) {
                    price.uomValue = uomValue.uomValue;
                  } else {
                    price.uomValue = '';
                  }

                  related_products.push(price);
                  count++;
                }
              }
            }
          }
        }

        article.related_products = related_products

        // related articles dummy data
        // article.related_products = [
        //   {
        //     title: 'Baby Care',
        //     image: 'http://143.110.240.107:8000/inventory/image_1632999998132.jpg',
        //     price: 50,
        //     specialPrice: 40,
        //     offer: '5%'
        //   },
        //   {
        //     title: 'Facemask',
        //     image: 'http://143.110.240.107:8000/inventory/image_1632999998132.jpg',
        //     price: 60,
        //     specialPrice: 55,
        //     offer: '5%'
        //   },
        //   {
        //     title: 'Test Product',
        //     image: 'http://143.110.240.107:8000/inventory/image_1632999998132.jpg',
        //     price: 100,
        //     specialPrice: 90,
        //     offer: '10%'
        //   },
        //   {
        //     title: 'Test Product 2',
        //     image: 'http://143.110.240.107:8000/inventory/image_1632999998132.jpg',
        //     price: 100,
        //     specialPrice: 90,
        //     offer: '10%'
        //   },
        //   {
        //     title: 'Test Product 3',
        //     image: 'http://143.110.240.107:8000/inventory/image_1632999998132.jpg',
        //     price: 100,
        //     specialPrice: 90,
        //     offer: '10%'
        //   },
        //   {
        //     title: 'Test Product 4',
        //     image: 'http://143.110.240.107:8000/inventory/image_1632999998132.jpg',
        //     price: 100,
        //     specialPrice: 90,
        //     offer: '10%'
        //   }
        // ]

        // iterating over related articles
        for(i=0; i<article.related_articles.length; i++) {
          article.related_articles[i].createdAt = moment(article.related_articles[i].createdAt).format("DD MMM YYYY");  
          
          article.related_articles[i].like_count = await Like.countDocuments({
            contentId: mongoose.Types.ObjectId(article.related_articles[i]._id),
          });

          article.related_articles[i].views_count = await Read.countDocuments({
            contentId: mongoose.Types.ObjectId(article.related_articles[i]._id),
          });

          let isLiked = await Like.findOne({
            type: "article",
            contentId: mongoose.Types.ObjectId(article.related_articles[i]._id),
            userId: req.user._id,
          });
  
          if (isLiked) {
            article.related_articles[i].is_liked = 1;
          } else {
            article.related_articles[i].is_liked = 0;
          }

        }

        let read = await Read.findOne({
          contentId: article._id,
          userId: { $in: req.user._id },
        });
        if (read) {
          article.isRead = true;
        } else {
          article.isRead = false;
        }

        let categoryDetails = await ArticleCategory.findOne({_id: mongoose.Types.ObjectId(article.categories[0])})
        article.sub_category = categoryDetails.name
        delete article.categories

        article.updatedAt = moment(article.updatedAt).format('DD MM YYYY  [|]  h:mm a');

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
  viewArticlesBySubcategory: async (req, res, next) => {
    try {
      let allArticles = await Articles.find(
        { categories: { $in: req.body.categories } },
        {
          _id: 1,
          heading: 1,
          image: 1,
          description: 1,
          authorName: 1,
        }
      );

      for (i = 0; i < allArticles.length; i++) {
        allArticles[i] = allArticles[i].toJSON();
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(allArticles[i]._id),
        });
        allArticles[i].likes = count;

        let shareCount = await Share.countDocuments({
          contentId: mongoose.Types.ObjectId(allArticles[i]._id),
        });
        allArticles[i].shares = shareCount;

        allArticles[i].image = process.env.BASE_URL.concat(
          allArticles[i].image
        );
      }

      res.status(200).json({
        status: true,
        data: allArticles,
      });
    } catch (error) {
      next(error);
    }
  },
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
            description: 1,
          }
        );

        for (i = 0; i < articles.length; i++) {
          articles[i] = articles[i].toJSON();
          let count = await Like.countDocuments({
            contentId: mongoose.Types.ObjectId(articles[i]._id),
          });
          articles[i].likes = count;

          let shared = await Share.findOne({
            contentId: mongoose.Types.ObjectId(articles[i]._id),
          });

          if (shared) {
            articles[i].shares = shared.share_count;
          } else {
            articles[i].shares = 0;
          }

          articles[i].image = process.env.BASE_URL.concat(articles[i].image);
        }

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
      ).lean();

      for (i = 0; i < result.length; i++) {
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(result[i]._id),
        });
        result[i].likes = count;

        let shared = await Share.findOne({
          contentId: mongoose.Types.ObjectId(result[i]._id),
        });

        if (shared) {
          result[i].shares = shared.share_count;
        } else {
          result[i].shares = 0;
        }

        result[i].image = process.env.BASE_URL.concat(result[i].image);
      }

      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
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
      ).lean();

      for (i = 0; i < result.length; i++) {
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(result[i]._id),
        });
        result[i].likes = count;

        let shared = await Share.findOne({
          contentId: mongoose.Types.ObjectId(result[i]._id),
        });

        if (shared) {
          result[i].shares = shared.share_count;
        } else {
          result[i].shares = 0;
        }

        result[i].image = process.env.BASE_URL.concat(result[i].image);
      }

      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
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
      ).lean();

      for (i = 0; i < result.length; i++) {
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(result[i]._id),
        });
        result[i].likes = count;

        let shared = await Share.findOne({
          contentId: mongoose.Types.ObjectId(result[i]._id),
        });

        if (shared) {
          result[i].shares = shared.share_count;
        } else {
          result[i].shares = 0;
        }

        result[i].image = process.env.BASE_URL.concat(result[i].image);
      }

      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
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
      ).lean();

      for (i = 0; i < result.length; i++) {
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(result[i]._id),
        });
        result[i].likes = count;

        let shared = await Share.findOne({
          contentId: mongoose.Types.ObjectId(result[i]._id),
        });

        if (shared) {
          result[i].shares = shared.share_count;
        } else {
          result[i].shares = 0;
        }

        result[i].image = process.env.BASE_URL.concat(result[i].image);
      }

      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  searchArticleAdmin: async (req, res, next) => {
    try {
      let keyword = req.body.keyword;
      if (keyword) {
        let searchResult = await Articles.find(
          {
            $or: [
              // {
              //   heading: { $regex: `^${keyword}`, $options: "i" },
              // },
              { $text: { $search: `"\"${keyword}\""` } },
            ],
          },
          {
            heading: 1,
            description: 1,
            image: 1,
            authorName: 1,
          }
        );

        // finding like count and save
        for (j = 0; j < searchResult.length; j++) {
          let count = await Like.countDocuments({
            contentId: mongoose.Types.ObjectId(searchResult[j]._id),
          });
          searchResult[j] = searchResult[j].toJSON();
          searchResult[j].likes = count;

          let shared = await Share.findOne({
            contentId: mongoose.Types.ObjectId(searchResult[j]._id),
          });

          if (shared) {
            searchResult[j].shares = shared.share_count;
          } else {
            searchResult[j].shares = 0;
          }

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
  searchArticle: async (req, res, next) => {
    try {
      let keyword = req.body.keyword;
      if (keyword) {
        let searchResult = await Articles.find(
          {
            $or: [{heading: { $regex:`${keyword}`, $options: "i" }},
            {description: { $regex:`${keyword}`, $options: "i" }},
            {authorName: { $regex:`${keyword}`, $options: "i" }}],
          },
          {
            _id: 1,
            heading: 1,
            image: 1,
            readTime: 1,
            authorName: 1,
            categories: 1,
            description: 1,
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
          searchResult[j].title = searchResult[j].heading;
          delete searchResult[j].heading;

          searchResult[j].read_time = searchResult[j].readTime;
          delete searchResult[j].readTime;

          searchResult[j].image = process.env.BASE_URL.concat(
            searchResult[j].image
          );

          searchResult[j].type = "article";

          searchResult[j].createdAt = timeSince(searchResult[j].createdAt);

          // Finding first category name
          let categoryDetails = await ArticleCategory.findOne({
            _id: mongoose.Types.ObjectId(searchResult[j].categories[0]),
          });
          if (categoryDetails) {
            searchResult[j].sub_category = categoryDetails.name;
          } else {
            searchResult[j].sub_category = "";
          }

          delete searchResult[j].categories
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
  editArticle: async (req, res, next) => {
    try {
      console.log("edit in::::::", req.body);

      if (req.body.articleId) {
        let article = await Articles.findOne({
          _id: mongoose.Types.ObjectId(req.body.articleId),
        });

        if (article) {
          let data = req.body;
          if (data.image == "null") {
            delete data.image;
          }

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

          if (req.body.homepageMain === "true") {
            console.log("in homepage if video");
            Articles.updateMany(
              { homepageMain: true },
              { $set: { homepageMain: false } }
            ).catch((err) => console.log(err));
          }

          if(data.related_articles == "") {
            data.related_articles = []
          }

          if(data.tagged_categories == "") {
            data.tagged_categories = []
          }

          if(data.related_products == "") {
            data.related_products = []
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
  deleteArticle: async (req, res, next) => {
    try {
      let valid = await Articles.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      console.log("valid:", valid);
      if (valid) {
        Articles.deleteOne({
          _id: mongoose.Types.ObjectId(req.params.id),
        }).then((response) => {
          let splittedImageRoute = valid.image.split("/");
          fs.unlink(`./public/images/${splittedImageRoute[1]}`, function (err) {
            if (err) throw err;
          });

          Save.deleteMany({ contentId: req.params.id }).then((resp) => {
            Read.deleteMany({contentId: req.params.id}).then((ress) => {
              return res.status(200).json({
                status: true,
                data: "Article removed successfully",
              });
            })
          });

        });
        let isSaved = await Save.find({
          type: "article",
          contentId: mongoose.Types.ObjectId(req.params.id),
        });
        if (isSaved) {
          Save.deleteMany({
            type: "article",
            contentId: mongoose.Types.ObjectId(req.params.id),
          });
        }
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
  listAllSubCategories: async (req, res, next) => {
    try {
      let subCategories = await ArticleCategory.find(
        { parent: { $ne: "main" } },
        { name: 1 }
      ).lean();


      for (let i of subCategories) {
        let articles = await Articles.find({
          categories: i._id + "",
        });
        i.count = articles.length;
      }


      // @@@@ new method

      // let subCategories = await ArticleCategory.aggregate([
      //   {$match: { parent: { $ne: "main" } }},
      //   {$project: { _id: 1, name: 1 } },
      //   {
      //     $lookup:
      //       {
      //         from: 'articles',
      //         localField: "_id",
      //         foreignField: "categories",
      //         as: "articleList"
      //       }
      //   },
      // ])

      // console.log('________all_sub categories__:',subCategories)

      // subCategories.forEach((e,i) => {
      //   e.count = e.articleList.length
      //   delete e.articleList
      // })

      return res.status(200).json({
        status: true,
        message: "success",
        data: subCategories,
      });
    } catch (error) {
      next(error);
    }
  },
  listSubCategories: async (req, res, next) => {
    try {
      let valid = await ArticleCategory.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
        parent: "main",
      });

      if (valid) {
        let subCategories = await ArticleCategory.find(
          { parent: req.params.id },
          { name: 1 }
        ).lean();

        for (let subCategory of subCategories) {
          let articles = await Articles.find({
            categories: subCategory._id + "",
          });
          subCategory.count = articles.length;
        }


        // @@@ new method
        // let subCategories = await ArticleCategory.aggregate([
        //   {$match: { parent: req.params.id }},
        //   {
        //     $lookup:
        //       {
        //         from: 'articles',
        //         localField: "_id",
        //         foreignField: "categories",
        //         as: "articleList"
        //       }
        //   },
        //   {$project: { name: 1, articleList: 1 } }
        // ])

        // console.log('______sub categories__:',subCategories)

        // subCategories.forEach((e,i) => {
        //   e.count = e.articleList.length
        //   delete e.articleList
        // })

        return res.status(200).json({
          status: true,
          message: "success",
          data: subCategories,
        });
      } else {
        res.status(200).json({
          status: false,
          message: "invalid main category",
        });
      }
    } catch (error) {
      next(error);
    }
  },
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
    }
  },
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

          let test = mainCategory._id + "";

          let categories = await ArticleCategory.aggregate([
            { $match: { parent: test } },
            { $project: { sub_cat_name: "$name" } },
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
          let response = [];

          for (i = 0; i < ids.length; i++) {
            if (!req.body.limit || !req.body.page) {
              return res.status(200).json({
                error: true,
                message: "missing: page no. or limit",
              });
            }
            let pageSize = req.body.limit;
            let pageNo = req.body.page;

            var aggregateQuery = Articles.aggregate();

            aggregateQuery.match({ categories: ids[i] });

            aggregateQuery.project({
              _id: 1,
              title: "$heading",
              read_time: "$readTime",
              createdAt: 1,
              image: 1,
              type: "article",
              authorName: 1,
              description: 1,
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

            response = await Articles.aggregatePaginate(
              aggregateQuery,
              aggregatePaginateOptions
            );

            let articles = response.Customers;

            // let articles = await Articles.aggregate([
            //   {$match:{ categories: ids[i] }},
            //   {$project:
            //     {
            //       _id: 1,
            //       title: "$heading",
            //       read_time: "$readTime",
            //       createdAt: 1,
            //       image: 1,
            //       type: "article"
            //     }
            //   }
            // ]);

            if (articles.length) {
              let category = await ArticleCategory.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(ids[i]) } },
                {
                  $project: {
                    sub_cat_id: "$_id",
                    sub_cat_name: "$name",
                    image: { $concat: [process.env.BASE_URL, "$image"] },
                    _id: 0,
                  },
                },
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

                let since = timeSince(articles[j].createdAt);

                articles[j].createdAt = since;
              }

              let temp = category[0];
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
            article: structure.reverse(),
            hasPrevPage: response.hasPrevPage,
            hasNextPage: response.hasNextPage,
            total_articles: response.TotalRecords,
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
