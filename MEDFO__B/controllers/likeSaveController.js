const mongoose = require("mongoose");
const Like = require("../models/like");
const Save = require("../models/save");
const Articles = require("../models/article");
const ArticleCategory = require("../models/articleCategory");
const HealthcareVideos = require("../models/healthCareVideo");
const HealthTip = require("../models/healthTip");
const HealthExpertAdvice = require("../models/healthExpertAdvice");
const healthExpertQnReplay = require("../models/healthExpertQnReplay");
const Read = require("../models/read");
const HealthcareVideoCategory = require("../models/healthcareVideoCategory");

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
    changeLike: async(req, res, next) => {
        try {
            if (req.body.type && req.body.id) {
                let types = ["article", "advice", "healthTip", "healthcareVideo", "adviceReply"];
                let type = types.find((e) => e === req.body.type);
                if (type) {
                    let validArticle = await Articles.findById(req.body.id);
                    let validExpertAdvice = await HealthExpertAdvice.findById(
                        req.body.id
                    );
                    let validHealthTip = await HealthTip.findById(req.body.id);
                    let validHealthcareVideo = await HealthcareVideos.findById(
                        req.body.id
                    );
                    let validExpertAdviceReply = await healthExpertQnReplay.findById(
                        req.body.id
                    );

                    if (
                        validArticle ||
                        validExpertAdvice ||
                        validHealthTip ||
                        validHealthcareVideo ||
                        validExpertAdviceReply
                    ) {
                        let liked = await Like.findOne({
                            contentId: req.body.id,
                            userId: req.user._id,
                        });
                        if (!liked) {
                            let data = {
                                type: req.body.type,
                                contentId: req.body.id,
                                userId: req.user._id,
                            };
                            let schemaObj = Like(data);
                            schemaObj.save().then((response) => {
                                res.status(200).json({
                                    error: false,
                                    message: "liked",
                                });
                            });
                        } else {
                            Like.deleteOne({ _id: mongoose.Types.ObjectId(liked._id) }).then(
                                (response) => {
                                    res.status(200).json({
                                        error: false,
                                        message: "disliked",
                                    });
                                }
                            );
                        }
                    } else {
                        res.status(200).json({
                            error: true,
                            message: "invalid id",
                        });
                    }
                } else {
                    res.status(200).json({
                        error: true,
                        message: "invalid type",
                    });
                }
            } else {
                res.status(200).json({
                    error: true,
                    message: "type or id missing",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    changeSave: async(req, res, next) => {
        try {
            if (req.body.type && req.body.id) {
                let types = ["article", "advice", "healthTip", "healthcareVideo","fitnessClub","yoga"];
                let type = types.find((e) => e === req.body.type);
                if (type) {
                    let validArticle = await Articles.findById(req.body.id);
                    let validExpertAdvice = await HealthExpertAdvice.findById(
                        req.body.id
                    );
                    let validHealthTip = await HealthTip.findById(req.body.id);
                    let validHealthcareVideo = await HealthcareVideos.findById(
                        req.body.id
                    );

                    // if (
                    //     validArticle ||
                    //     validExpertAdvice ||
                    //     validHealthTip ||
                    //     validHealthcareVideo
                    // ) {
                        let saved = await Save.findOne({
                            contentId: req.body.id,
                            userId: req.user._id,
                        });
                        if (!saved) {
                            let data = {
                                type: req.body.type,
                                contentId: req.body.id,
                                userId: req.user._id,
                            };
                            let schemaObj = Save(data);
                            schemaObj.save().then((response) => {
                                res.status(200).json({
                                    error: false,
                                    message: "saved",
                                });
                            });
                        } else {
                            Save.deleteOne({ _id: mongoose.Types.ObjectId(saved._id) }).then(
                                (response) => {
                                    res.status(200).json({
                                        error: false,
                                        message: "removed",
                                    });
                                }
                            );
                        }
                    // } else {
                    //     res.status(200).json({
                    //         error: true,
                    //         message: "invalid id",
                    //     });
                    // }
                } else {
                    res.status(200).json({
                        error: true,
                        message: "invalid type",
                    });
                }
            } else {
                res.status(200).json({
                    error: true,
                    message: "type or id missing",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getMedfeedSavedList: async(req, res, next) => {
        try {
            let saved_list = await Save.find({ userId: mongoose.Types.ObjectId(req.user._id) })
            console.log('saved_list',saved_list)
        if(saved_list){
            let response = []

            for (i = 0; i < saved_list.length; i++) {

                if (saved_list[i].type == 'article') {
                    let article = await Articles.findOne({ _id: mongoose.Types.ObjectId(saved_list[i].contentId) }, {
                        _id: 1,
                        createdAt: 1,
                        readTime: 1,
                        image: 1,
                        heading: 1,
                        categories: 1
                    })
                    var category;
                    var sub_category
                    sub_category = await ArticleCategory.findOne({ _id: mongoose.Types.ObjectId(article.categories[0]) })
                    if(sub_category){
                        category = await ArticleCategory.findOne({ _id: mongoose.Types.ObjectId(sub_category.parent) })
                    }
                    

                    article = article.toJSON()

                    let isSaved = await Save.findOne({
                        type: "article",
                        contentId: mongoose.Types.ObjectId(saved_list[i].contentId),
                        userId: req.user._id,
                    });

                    if (isSaved) {
                        article.is_saved = 1;
                    } else {
                        article.is_saved = 0;
                    }

                    // Field names changing
                    article.title = article.heading
                    delete article.heading

                    article.post_time = article.createdAt
                    delete article.createdAt

                    article.read_time = article.readTime
                    delete article.readTime

                    article.image = process.env.BASE_URL.concat(
                        article.image
                    );

                    article.type = 'article'
                    if(category){
                        article.category = category.name
                    }
                    if(sub_category){
                        article.sub_categ = sub_category.name
                    }

                    article.video = ''                 

                    delete article.categories

                    article.post_time = timeSince(article.post_time);

                    response.push(article)

                } else if (saved_list[i].type == 'healthcareVideo') {
                    let video = await HealthcareVideos.findOne({ _id: mongoose.Types.ObjectId(saved_list[i].contentId) },{
                        createdAt: 1,
                        duration: 1,
                        thumbnail: 1,
                        name: 1,
                        subCategories: 1,
                        video: 1
                    }).lean()

                    if(video) {
                        console.log('video::',video)
                        let sub_category = await HealthcareVideoCategory.findOne({ _id: mongoose.Types.ObjectId(video.subCategories[0]) })
                        let category = await HealthcareVideoCategory.findOne({ _id: mongoose.Types.ObjectId(sub_category.parent) })
                    

                    let isSaved = await Save.findOne({
                        type: "healthcareVideo",
                        contentId: mongoose.Types.ObjectId(saved_list[i].contentId),
                        userId: req.user._id,
                    });

                    if (isSaved) {
                        video.is_saved = 1;
                    } else {
                        video.is_saved = 0;
                    }

                    // Field names changing
                    video.title = video.name
                    delete video.name

                    video.post_time = video.createdAt
                    delete video.createdAt

                    video.read_time = video.duration
                    delete video.duration

                    video.image = process.env.BASE_URL.concat(
                        video.thumbnail
                    );
                    delete video.thumbnail

                    video.type = 'healthcareVideo'

                    video.category = category.name
                    video.sub_categ = sub_category.name

                    delete video.subCategories

                    video.post_time = timeSince(video.post_time);

                    response.push(video)

                    }

                } else if (saved_list[i].type == 'advice') {

                } else if (saved_list[i].type == 'healthTip') {

                }
            }

            res.status(200).json({
                error: false,
                message: "success",
                data: {
                    saved_list: response,
                },
            });
        }
            
           
        
        } catch (error) {
            next(error);
        }
    },
    read: async(req, res, next) => {
        try {
            if (req.body.type && req.body.id) {
                let types = ["article", "advice", "healthTip", "healthcarevideo", "adviceReply","fitnessClub","yoga"];
                let type = types.find((e) => e === req.body.type);
                if (type) {
                    // let validArticle = await Articles.findById(req.body.id);
                    // let validExpertAdvice = await HealthExpertAdvice.findById(
                    //     req.body.id
                    // );
                    // let validHealthTip = await HealthTip.findById(req.body.id);
                    // let validHealthcareVideo = await HealthcareVideos.findById(
                    //     req.body.id
                    // );
                    // let validExpertAdviceReply = await healthExpertQnReplay.findById(
                    //     req.body.id
                    // );

                    // if (
                    //     validArticle ||
                    //     validExpertAdvice ||
                    //     validHealthTip ||
                    //     validHealthcareVideo ||
                    //     validExpertAdviceReply
                    // ) {
                        let isContentInRead = await Read.findOne({
                            contentId: req.body.id
                        });
                        if (!isContentInRead) {
                            let data = {
                                type: req.body.type,
                                contentId: req.body.id,
                                userId: [req.user._id],
                                read_count: 1
                            };
                            let schemaObj = Read(data);
                            schemaObj.save().then((response) => {
                                res.status(200).json({
                                    error: false,
                                    message: "Readed",
                                });
                            });
                        } else {
                            if(!isContentInRead.userId.includes(req.user._id)) {
                                Read.updateOne({contentId:mongoose.Types.ObjectId(req.body.id)},
                                {$push:{userId:req.user.id},$inc: {read_count:1}},
                                ).then((response) => {
                                    res.status(200).json({
                                        error: true,
                                        message: 'Readed'
                                    })
                                })
                            } else {
                                res.status(200).json({
                                    error: false,
                                    message: "Already Readed",
                                });
                            }                            
                        }
                    // } else {
                    //     res.status(200).json({
                    //         error: true,
                    //         message: "invalid id",
                    //     });
                    // }
                } else {
                    res.status(200).json({
                        error: true,
                        message: "invalid type",
                    });
                }
            } else {
                res.status(200).json({
                    error: true,
                    message: "type or id missing",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    bookmarkListing:async(req,res,next)=>{
        try {
            let saved_list = await Save.find({ userId: mongoose.Types.ObjectId(req.user._id) })
            if(saved_list){
                let response = []
                for (const item of saved_list) {
                    let category
                    if (item.type == 'article') {
                        let article = await Articles.findOne({ _id: mongoose.Types.ObjectId(item.contentId) }, {
                            _id: 1,
                            createdAt: 1,
                            readTime: 1,
                            image: 1,
                            heading: 1,
                            categories: 1
                        })
                        let sub_category = await ArticleCategory.findOne({ _id: mongoose.Types.ObjectId(item.categories[0]) })
                        if(sub_category){
                             category = await ArticleCategory.findOne({ _id: mongoose.Types.ObjectId(sub_category.parent) })
                        }
                        article = article.toJSON()
                        let isSaved = await Save.findOne({
                            type: "article",
                            contentId: mongoose.Types.ObjectId(item.contentId),
                            userId: req.user._id,
                        });
    
                        if (isSaved) {
                            article.is_saved = 1;
                        } else {
                            article.is_saved = 0;
                        }
                        // Field names changing
                        article.title = article.heading
                        delete article.heading
    
                        article.post_time = article.createdAt
                        delete article.createdAt
    
                        article.read_time = article.readTime
                        delete article.readTime
    
                        article.image = process.env.BASE_URL.concat(
                            article.image
                        );
    
                        article.type = 'article'
                        if(category){
                            article.category = category.name
                        }
                        if(sub_category){
                            article.sub_categ = sub_category.name
                        }
                        delete article.categories
    
                        article.post_time = timeSince(article.post_time);
    
                        response.push(article)
    
                    }
                     if (saved_list[i].type == 'healthcareVideo') {
                        // let video = await HealthcareVideos.findOne({ _id: mongoose.Types.ObjectId(saved_list[i].contentId) },{
                        //     createdAt: 1,
                        //     duration: 1,
                        //     thumbnail: 1,
                        //     name: 1,
                        //     subCategories: 1
                        // }).lean()
    
                        // if(video) {
                        //     console.log('video::',video)
                        //     let sub_category = await HealthcareVideoCategory.findOne({ _id: mongoose.Types.ObjectId(video.subCategories[0]) })
                        //     let category = await HealthcareVideoCategory.findOne({ _id: mongoose.Types.ObjectId(sub_category.parent) })
                        
    
                        // let isSaved = await Save.findOne({
                        //     type: "healthcareVideo",
                        //     contentId: mongoose.Types.ObjectId(saved_list[i].contentId),
                        //     userId: req.user._id,
                        // });
    
                        // if (isSaved) {
                        //     video.is_saved = 1;
                        // } else {
                        //     video.is_saved = 0;
                        // }
    
                        // // Field names changing
                        // video.title = video.name
                        // delete video.name
    
                        // video.post_time = video.createdAt
                        // delete video.createdAt
    
                        // video.read_time = video.duration
                        // delete video.duration
    
                        // video.image = process.env.BASE_URL.concat(
                        //     video.thumbnail
                        // );
                        // delete video.thumbnail
    
                        // video.type = 'healthcareVideo'
    
                        // video.category = category.name
                        // video.sub_categ = sub_category.name
    
                        // delete video.subCategories
    
                        // video.post_time = timeSince(video.post_time);
    
                        // response.push(video)
    
                        // }
    
                    } 
                     if (item.type == 'advice') {
    
                    } 
                     if (item.type == 'healthTip') {
    
                    }
                }

                res.status(200).json({
                    error: false,
                    message: "success",
                    data: {
                        saved_list: response,
                    },
                });
            }
        } catch (error) {
            
        }
    }
};