const mongoose = require("mongoose");
const Share = require("../models/share");
const Articles = require("../models/article");
// const ArticleCategory = require("../models/articleCategory");
const HealthcareVideos = require("../models/healthCareVideo");
const HealthTip = require("../models/healthTip");
const HealthExpertAdvice = require("../models/healthExpertAdvice");

const InventoryShare = require("../models/inventoryShare");
const Inventory = require("../models/inventory");

module.exports = {
    changeShare:async (req,res,next) =>{
        try{
            const body = req.body
            body.userId=req.user._id
            // console.log('userid',body)
            if (body.type && body.id) {
                let types = ["article", "advice", "healthTip", "healthcareVideo","fitnessClub","yoga"];
                let type = types.find((e) => e === body.type);
                if (type) {
                  // let validArticle = await Articles.findById(body.id);
                  // let validExpertAdvice = await HealthExpertAdvice.findById(
                  //   body.id
                  // );
                  // let validHealthTip = await HealthTip.findById(body.id);
                  // let validHealthcareVideo = await HealthcareVideos.findById(
                  //   body.id
                  // );
        
                  // if (
                  //   validArticle ||
                  //   validExpertAdvice ||
                  //   validHealthTip ||
                  //   validHealthcareVideo
                  // ){
                    let extData = await Share.findOne({
                      contentId: body.id,
                    });
                    if (!extData) {
                      let data = {
                        type: body.type,
                        contentId: body.id,
                        userId: body.userId,
                        share_count:1
                      };
                      let schemaObj = Share(data);
                      schemaObj.save().then((response) => {
                        res.status(200).json({
                          error: false,
                          message: "shared successfully",
                        });
                      });
                    } else {
                     
                     Share.findOneAndUpdate({ contentId: mongoose.Types.ObjectId(body.id) },
                       {
                        $push: { userId: body.userId },
                        $inc: {'share_count': 1}
                       }
                      ).then(
                        (response) => {
                          console.log('response',response)
                          res.status(200).json({
                            error: false,
                            message: "share count update successfully",
                            // data:response
                          });
                        }
                      );
                    }
                  // }else {
                  //   res.status(200).json({
                  //     error: true,
                  //     message: "invalid id",
                  //   });
                  // }
                }else {
                    res.status(200).json({
                      error: true,
                      message: "invalid type",
                    });
                  }
                }else {
                    res.status(200).json({
                      error: true,
                      message: "type or id missing",
                    });
                  }

        }catch (error){
            next(error);
        }
    },
    getShareCount:async (req,res,next)=>{
      try{
        const article_id= req.params.id
      let result= await  Share.findOne({contentId:mongoose.Types.ObjectId(article_id)})
          console.log('response',result)
          res.status(200).json({
            error: false,
            status:true,
            data:result
          })

      }catch (error){
        next(error)
      }
    },




    // Share in product(Inventory)
    addProductShare:async (req,res,next) =>{
      try{
          const body = req.body
          body.userId=req.user._id
          console.log(req.user._id)
          
          let isProduct = await Inventory.findOne({
            _id: body.productId,
          });
          // checking product id exist or not
          if(isProduct){
            let extData = await InventoryShare.findOne({
              productId: body.productId,
            });
            if (!extData) {
              let data = {
                productId: body.productId,
                userId: body.userId,
                shareCount:1
              };
              let schemaObj = InventoryShare(data);
              schemaObj.save().then((response) => {
                res.status(200).json({
                  error: false,
                  message: "Product shared successfully",
                });
              });
            } else {
              
              InventoryShare.findOneAndUpdate({ productId: mongoose.Types.ObjectId(body.productId) },
                {
                $push: { userId: body.userId },
                $inc: {'shareCount': 1}
                }
              ).then(
                (response) => {
                  console.log('response',response)
                  
                  res.status(200).json({
                    error: false,
                    message: "share count updated successfully",
                    // data:response
                  });
                }
              );
            }

          }else{
            res.status(200).json({
              error: true,
              message: "Invalid product id"
            });
          }
        
                  
      }catch (error){
          next(error);
      }
    },


    getProductShareCount:async (req,res,next)=>{
      try{
        const productId= req.body.productId
         let result= await  InventoryShare.findOne(
           {productId:mongoose.Types.ObjectId(productId)},
           {shareCount:1}
           )
         
          if(result){          
            res.status(200).json({
              error: false,
              data:result
            })
          }else{
            res.status(200).json({
              error: true,
              data:"No data found"
            })
          }

      }catch (error){
        next(error)
      }
    },

};



