const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
let APIKEY = process.env.OTPAPIKEY;
const TwoFactor = new (require('2factor'))(APIKEY);
const PickupPending = require("../../models/orders/pickupPending");
const moment = require("moment-timezone");
const DeliveryBoyCredit = require("../../models/delivery/deliveryBoyCredit");
const DeliveryBoyQueries = require("../../models/delivery/deliveryBoyQuerys");


const imgPath = process.env.BASE_URL;
const DeliveryBoys = require("../../models/delivery/deliveryBoys");
const Store = require('../../models/store');

const createToken = (id) => {
    return jwt.sign(
        {
            id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );
};

module.exports = {

    addDeliveryBoys: async (req, res, next) => {
        try {
            let existingEmail = await DeliveryBoys.findOne({
                email: req.body.email
            });
            if (!existingEmail) {
                let existingMobile = await DeliveryBoys.findOne({                    
                    mobile: req.body.mobile,
                });
                if (!existingMobile) {
                    let details = req.body;
                    if (req.files.licence) {
                        details.licence = `delivery/${req.files.licence[0].filename}`;
                    }
                    if (req.files.aadhar) {
                        details.aadhar = `delivery/${req.files.aadhar[0].filename}`;
                    }
                    if (req.files.rcBook) {
                        details.rcBook = `delivery/${req.files.rcBook[0].filename}`;
                    }

                   let existingDeliveryBoy = await DeliveryBoys.findOne({}).sort({_id:-1})
                    if(!existingDeliveryBoy){
                        details.deliveryBoyId = "MDFL-DEL-20201"
                    }else{
                        let lastInsertedDeliveryBoyId = existingDeliveryBoy.deliveryBoyId
                        // get everything after last dash
                        const deliveryId =parseInt(lastInsertedDeliveryBoyId.split('-').pop())
                        details.deliveryBoyId ="MDFL-DEL-" + (deliveryId + 1)
                    }
                    let schemaObj = new DeliveryBoys(details);
                    schemaObj
                        .save()
                        .then((response) => {
                            const token = createToken(response._id);
                            res.status(200).json({
                                error: false,
                                data: {
                                    userDetails: response,
                                    token: token,
                                },                                
                                message: "Registration Completed Successfully, You can login once after admin has approved your account.",
                            });
                        })
                        .catch(async (error) => {
                            if (req.files.licence) {
                                await unlinkAsync(req.files.licence[0].path);
                            }
                            if (req.files.aadhar) {
                                await unlinkAsync(req.files.aadhar[0].path);
                            }
                            if (req.files.rcBook) {
                                await unlinkAsync(req.files.rcBook[0].path);
                            }
                          
                            res.status(200).json({                               
                                error: true,
                                message: error.message,
                                data:{}
                            });
                        });
                } else {
                    

                    if (req.files.licence) {
                        await unlinkAsync(req.files.licence[0].path);
                    }
                    if (req.files.aadhar) {
                        await unlinkAsync(req.files.aadhar[0].path);
                    }
                    if (req.files.rcBook) {
                        await unlinkAsync(req.files.rcBook[0].path);
                    }
                    res.status(200).json({
                        error: true,
                        message: "Mobile number already exist",
                        data:{}
                    });
                }
            } else {
                if (req.files.licence) {
                    await unlinkAsync(req.files.licence[0].path);
                }
                if (req.files.aadhar) {
                    await unlinkAsync(req.files.aadhar[0].path);
                }
                if (req.files.rcBook) {
                    await unlinkAsync(req.files.rcBook[0].path);
                }
                res.status(200).json({
                    error: true,
                    message: "Email id already exist",
                    data:{}
                });
            }
        } catch (error) {
            if (req.files.aadhar) {
                await unlinkAsync(req.files.aadhar[0].path);
            }

            if (req.files.licence) {
                await unlinkAsync(req.files.licence[0].path);
            }

            if (req.files.rcBook) {
                await unlinkAsync(req.files.rcBook[0].path);
            }
            next(error);
        }
    },

    deliveryBoysSignin: async (req, res, next) => {
        try {
            if (req.body.password && req.body.email) {
                let userDetail = await DeliveryBoys.findOne({ email: req.body.email });
                if (userDetail) {
                    let approved = userDetail.isApproved
                    let isActive = userDetail.isActive
                    if(approved == "approved" && isActive == true){
                        let verified = await bcrypt.compare(req.body.password, userDetail.password);
                        if (verified) {
                            const token = createToken(userDetail._id);
                            phone = "";
                            res.status(200).json({
                                error: false,
                                message: "Logged in successfully",
                                data: {
                                    token: token,
                                },
                            });
                        } else {
                            res.status(200).json({
                                error: true,
                                message: "Invalid password",
                                data: {
                                    token: "",
                                },
                            });
                        }

                    }else{
                        res.status(200).json({
                            error: true,
                            message: "Please wait for Admin's approval",
                            data: {
                                token: "",
                            },
                        });
                    }
                
                } else {
                    res.status(200).json({
                        error: true,
                        message: "Sorry, You are not a registered delivery boy, Please sign up first",
                        data: {
                            token: "",
                        },
                    });
                }
            } else {
                res.status(200).json({
                    error: true,
                    message: "Credentials missing",
                    data: {
                        token: "",
                    },
                });
            }
        } catch (error) {
            next(error);
        }
    },


    getActiveDeliveryBoys: async (req, res, next) => {
        try {
            let result = await DeliveryBoys.find(
                { isActive: true },
                {
                    fullName: 1,
                    mobile: 1,
                    email: 1,
                    drivingLicenseNumber: 1,
                    aadharCardNumber:1,
                    address: 1,
                    city: 1,
                    deliveryBoyId:1,
                    licence: { $concat: [imgPath, "$licence"] },
                    aadhar: { $concat: [imgPath, "$aadhar"] },
                    rcBook: { $concat: [imgPath, "$rcBook"] },
                    isApproved:1,
                    isActive:1
                }
            ).sort({$natural:-1});
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },


    // get pending delivery boys
    getPendingDeliveryBoys: async (req, res, next) => {
        try {
            let result = await DeliveryBoys.find(
                { isApproved: "pending" ,isActive:true },
                {
                    fullName: 1,
                    mobile: 1 ,
                    createdDate: { $dateToString: { format: "%d/%m/%Y", date: "$createdAt" } }               
                }
            )
            result = result.reverse()
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    // Get approved delivery boys
    getApprovedDeliveryBoys: async (req, res, next) => {
        try {
            let result = await DeliveryBoys.find(
                { isApproved: "approved" },
                {
                    fullName: 1,
                    mobile: 1,
                    deliveryBoyId:1,
                    isActive:1,
                    credit: { $cond: [{ $ifNull: ['$credit', false] }, "$credit", ""] }
                }
            ).sort({updatedAt: -1})
           // result = result.reverse()
           for (let item of result){
            const newCredit = await DeliveryBoyCredit.findOne({
              deliveryBoyId: item._id,
            }).sort({ _id: -1 });
    
            if (newCredit) {
              item.credit = newCredit.balance;
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


   
     // status changed for Delivery boy  approval or rejection
     changeDeliveryBoyApproveStatus: async (req, res, next) => {
        try {
            let data = {};
            const status = ["approved", "rejected"];
            if (status.includes(req.body.status)) {
                let result = await DeliveryBoys.findOne({ _id: mongoose.Types.ObjectId(req.body.id) });
                if (result) {
                    if(req.body.status=="approved"){
                        data.updatedAt = new Date();
                       // data.isApproved = req.body.status;

                      
                       data.isApproved = "approved"
                        DeliveryBoys.updateOne({ _id: mongoose.Types.ObjectId(req.body.id) }, data)
                            .then((response) => {
                                if (response.nModified == 1) {
                                    return res.status(200).json({
                                        status: true,
                                        data: "Delivery boy approved successfully",
                                    }); 

                                     // sending sms
                                    // TwoFactor.sendTransactional(result.mobile, "hkjhkjhkjhk", "TFCTOR").then(
                                    //     async (t) => {
                                    //       console.log('hhhh',t)
                                    //       return res.status(200).json({
                                    //         status: true,
                                    //         data: "Delivery boy approved successfully",
                                    //     }); 

                                    //     },
                                    //     (error) => {
                                            
                                    //       return res.status(200).json({
                                    //         error: true,
                                    //         message: '' + error,
                                    //         data: { mode: 2 },
                                    //       });
                                    //     }
                                    //   );
                                    // if(req.body.status=="approved"){
                                        // return res.status(200).json({
                                        //     status: true,
                                        //     data: "Delivery boy approved successfully",
                                        // }); 

    
                                    // }
                                    // else{
                                    //     res.status(200).json({
                                    //         status: true,
                                    //         data: "Delivery boy rejected successfully",
                                    //     });
                                    // }
                                    
                                  
                                } else {
                                    res.status(200).json({
                                        status: false,
                                        data: "Something went wrong. Please try after some time",
                                    });
                                }
                            })
                            .catch((error) => {
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });

                    }
                    if(req.body.status=="rejected"){
                        DeliveryBoys.deleteOne({ _id: req.body.id})
                        .then((response) => {
                            let splittedLicenceRoute = result.licence.split("/");
                            if (fs.existsSync(`./public/images/delivery/${splittedLicenceRoute[1]}`)) {
                                fs.unlink(`./public/images/delivery/${splittedLicenceRoute[1]}`, function (err) {
                                    if (err) throw err;
                                });
                            }

                            let splittedAadharRoute = result.aadhar.split("/");
                            if (fs.existsSync(`./public/images/delivery/${splittedAadharRoute[1]}`)) {
                                fs.unlink(`./public/images/delivery/${splittedAadharRoute[1]}`, function (err) {
                                    if (err) throw err;
                                });
                            }
                            let
                             splittedRcBookRoute = result.rcBook.split("/");
                            if (fs.existsSync(`./public/images/delivery/${splittedRcBookRoute[1]}`)) {
                                fs.unlink(`./public/images/delivery/${splittedRcBookRoute[1]}`, function (err) {
                                    if (err) throw err;
                                });
                            }

                            res.status(200).json({
                                status: true,
                                data: "Delivery boy rejected successfully",
                            });
                        })
                        .catch((error) => {
                            res.status(200).json({
                                status: false,
                                data: error,
                            });
                        });
                    }

                  
                } else {
                    res.status(200).json({
                        status: false,
                        data: "Invalid id",
                    });
                }
            }else{
                res.status(200).json({
                    status: false,
                    data: "Invalid status",
                });
            }
        
        } catch (error) {
            next(error);
        }
    },

     // get delivery boy details by id
    getDeliveryBoyDetailsById: async (req, res, next) => {
        try {            
            let result = await DeliveryBoys.find(
                { _id: mongoose.Types.ObjectId(req.params.id) },
                {                    
                    fullName: 1,
                    mobile:1,  
                    email:1,
                    drivingLicenseNumber:1,  
                    aadharCardNumber:1,  
                    address:1,
                    city:1,
                    licence:{ $concat: [imgPath, "$licence"] },
                    aadhar: { $concat: [imgPath, "$aadhar"] },
                    rcBook:{ $concat: [imgPath, "$rcBook"] },
                    deliveryBoyId:1,
                    isApproved:1,
                    isVerified:1,
                    isActive:1,
                    store:1,
                    pincode:1,
                    commission: { $cond: [{ $ifNull: ['$commission', false] }, "$commission", ""] },
                    credit: { $cond: [{ $ifNull: ['$credit', false] }, "$credit", ""] },
                    createdDate: { $dateToString: { format: "%d/%m/%Y", date: "$createdAt" } }
                 
                }
            ).lean()
           
            let deliveryDetails =[]  
            let storesArray =[] 
            let pincodesArray =[] 
            for (let item of result){
              const newCredit = await DeliveryBoyCredit.findOne({
                deliveryBoyId: item._id,
              }).sort({ _id: -1 });
      
              if (newCredit) {
                item.credit = newCredit.balance;
              }
            
                deliveryDetails.push(item)
                for (let storeDetail of item.store){ 
                    let stores = await Store.findOne(
                        { _id: mongoose.Types.ObjectId(storeDetail) },
                        {                    
                            name: 1,    
                            serviceablePincodes:1                        
                        }
                    );        
                    if(stores){                        
                        let items ={
                            name:stores.name,
                                _id:stores._id
                        }
                        storesArray.push(items)

                        // getting pincode  from delevery boy details
                        for (let pincodeDetail of item.pincode){ 

                             // getting pincode  from stores
                            for(let servPincode of stores.serviceablePincodes){
                                let serId = String(servPincode._id)
                                let deliveryPinId = String(pincodeDetail._id)

                                // checking pincode in store and pincode in delivey boy details
                                if(serId==deliveryPinId){
                                    let pincodes ={
                                        code:servPincode.code,
                                        _id:servPincode._id
                                    }
                                    pincodesArray.push(pincodes)
                                }
                            }
                        }
                    }
                }
                item.pincode = pincodesArray 
                item.store = storesArray 
            }
            if (result.length) {
                res.status(200).json({
                    status: true,
                    data:deliveryDetails
                });
            } else {
                res.status(200).json({
                    status: false,
                    data: "Invalid id",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    // edit delivery boy details by id
    editDeliveryBoys: async (req, res, next) => {
        try {           
            let data = req.body;
            if (data.id) {
                let deliveryBoy = await DeliveryBoys.findOne({ _id: mongoose.Types.ObjectId(data.id) }).lean()
                if (deliveryBoy) {
                        if(deliveryBoy.isApproved=="approved"){
                            data.updatedAt = new Date();
                            data.updatedBy = req.user._id;
                            if(data.password){
                                data.password = await bcrypt.hash(data.password, 12);
                            }else{
                                data.password= deliveryBoy.password
                            }
                            
                  //code for delivery boy credit 
                  const newCredit = await DeliveryBoyCredit.findOne({
                    deliveryBoyId: deliveryBoy._id,
                  }).sort({ _id: -1 });
          
                  if (newCredit) {
                    deliveryBoy.credit = newCredit.balance;
                  }
                  if(deliveryBoy.credit < data.credit){
                    await new DeliveryBoyCredit({
                      deliveryBoyId:deliveryBoy._id,
                      credit: data.credit,
                      debit:0 ,
                      balance: parseFloat(deliveryBoy.credit + data.credit).toFixed(2),
                      type:'admin',
                      orderId:"---"
                    }).save();
                  }else if(deliveryBoy.credit > data.credit){
                    await new DeliveryBoyCredit({
                      deliveryBoyId:deliveryBoy._id,
                      credit: 0,
                      debit:parseFloat(deliveryBoy.credit - data.credit).toFixed(2),
                      balance: data.credit,
                      type:'admin',
                      orderId:"---"
                    }).save();

                  }
                             

                            DeliveryBoys.updateOne({ _id: mongoose.Types.ObjectId(data.id) }, data)
                                .then((response) => {
                                if (response.nModified == 1) {
                                    res.status(200).json({
                                        status: true,
                                        data: "Delivery boy updated successfully",
                                    });
                                } else {
                                    res.status(200).json({
                                        status: false,
                                        data: "Something went wrong.Please try after some time",
                                    });
                                }
                            })
                            .catch((error) => {
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });

                        }else{
                            res.status(200).json({
                                status: false,
                                data: "Deivery boy not approved",
                            });
                        }
                        
                    
                } else {
                    unlinkImage(req.files.banner, req.files.image);
                    res.status(200).json({
                        status: false,
                        data: "Invalid id",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter id",
                });
            }
        } catch (error) {
            next(error);
        }
    },


     // status changed for Delivery boy  active or inactive
     changeDeliveryBoyActiveStatus: async (req, res, next) => {
        try {

            let data = {};
            let isActive =""
            let result = await DeliveryBoys.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
           
            if (result) {
                data.updatedAt = new Date();
                isActive = result.isActive;
               
                if(isActive == true){
                    data.isActive = false
                }else{
                    data.isActive = true
                }
                DeliveryBoys.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, data)
                    .then((response) => {
                        if (response.nModified == 1) {
                            if(data.isActive==true){
                                res.status(200).json({
                                    status: true,
                                    data: "Delivery boys enabled successfully",
                                }); 

                            }else{
                                res.status(200).json({
                                    status: true,
                                    data: "Delivery boys disabled successfully",
                                });
                            }
                            
                        } else {
                            res.status(200).json({
                                status: false,
                                data: "Something went wrong. Please try after some time",
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
                    data: "Invalid id",
                });
            }
         
        
        } catch (error) {
            next(error);
        }
    },

    //list active Store
    getActiveStore: async (req, res, next) => {
        try {
            let result = await Store.find({ isDisabled:false }, {
                name: 1
            }).lean()
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    getActivePincodeByStore: async (req, res, next) => {
        try {
           
            let data = req.body.storeId
            let result = await Store.find(
                { 
                    "_id": { "$in": data },
                    isDisabled: false
                }, 
                {
                    name: 1,
                    _id: 0,
                    serviceablePincodes:1
                }
                ).lean()
                
            let pincodes =[]
           
            for (let item of result) {
                for (let pincode of item.serviceablePincodes) {
                    if(pincode.active){ 
                        // delete pincode.active                   
                        pincodes.push(pincode)
                   }
                }                
             }
            if(result){                
                res.status(200).json({
                    status: true,
                    data: pincodes
                })
            }else{
                res.status(200).json({
                    status: false,
                    data: "Invalid id",
                });
            }          
        } catch (error) {
            next(error)
        }
    },
     // get pending paid to admin delivery boys
     getPendingToAdminDeliveryBoys: async (req, res, next) => {
        try {
            const pendingToAdmin = await PickupPending.aggregate([
                {
                  $match: {
                    status: "delivered",
                    paymentType:"cod",
                    paidToAdmin:"pending to paid",
                 
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                  },
                },
                {
                  $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $unwind: {
                    path: "$cartDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    userName: "$user.name",
                    orderId: 1,
                    paidToAdmin:1,
                    totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
        
                  },
                },
                { $sort: { _id: -1 } }
              ]);
             let count = 0;
              for (let item of pendingToAdmin) {
                count++;
                item.sl = count;
              }
              return res.json({
                error: false,
                message: pendingToAdmin.length
                  ? "pendingToAdmin orders found."
                  : "Empty pendingToAdmin orders.",
                data: {
                    pendingToAdmin,
                },
              });
        } catch (error) {
            next(error);
        }
    },
    changePendingToAdminDeliveryStatus: async (req, res, next) => {
        try {
            let data = req.body;
            let validOrder = await PickupPending.findOne({
                orderId: data.orderId,
            });
            if (validOrder) {
                PickupPending.updateOne(
                { orderId: data.orderId },
                {
                  $set: {
                    paidToAdmin: data.status,
                    paidToAdminDate: moment(new Date ())
                    .tz(process.env.TIME_ZONE)
                  },
                }
              )
                .then(async (response) => {
                  res.status(200).json({
                    error: false,
                    message: "paid to admin status updated successfully",
                  });
                })
                .catch(async (error) => {
                  res.status(200).json({
                    error: true,
                    message: error,
                  });
                });
            } else {
              res.status(200).json({
                status: false,
                message: "something went wrong please login and continue",
              });
            }
        } catch (error) {
            next(error);
        }
    },
    getDatePendingToAdminDeliveryBoys: async (req, res, next) => {
        try {
            let StartingDate = moment(req.body.StartingDate).tz(process.env.TIME_ZONE).set({ h: 00, m: 00, s: 00 }).utc()
            let EndingDate = moment(req.body.EndingDate)
            .tz(process.env.TIME_ZONE)
            .set({ h: 23, m: 59, s: 59 })
            const DatedPendingToAdmin = await PickupPending.aggregate([
                {
                  $match: {
                    $and: [
                        { deliveredDate: { $gte: new Date(StartingDate) } },
                        { deliveredDate: { $lte: new Date(EndingDate) } },
                        { status: "delivered" },
                        { paymentType: "cod" },
                        {paidToAdmin:"pending to paid"}
                      ],
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                  },
                },
                {
                  $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $unwind: {
                    path: "$cartDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    userName: "$user.name",
                    orderId: 1,
                    paidToAdmin:1,
                    totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
        
                  },
                },
                { $sort: { _id: -1 } }
              ]);
             let count = 0;
              for (let item of DatedPendingToAdmin) {
                count++;
                item.sl = count;
              }
              return res.json({
                error: false,
                message: DatedPendingToAdmin.length
                  ? "DatedPendingToAdmin orders found."
                  : "Empty DatedPendingToAdmin orders.",
                data: {
                    DatedPendingToAdmin,
                },
              });
        } catch (error) {
            next(error);
        }
    },
    getDatePendingToAdminDeliveryBoy: async (req, res, next) => {
      try {
          let StartingDate = moment(req.body.StartingDate).tz(process.env.TIME_ZONE).set({ h: 00, m: 00, s: 00 }).utc()
          let EndingDate = moment(req.body.EndingDate)
          .tz(process.env.TIME_ZONE)
          .set({ h: 23, m: 59, s: 59 })
          const DatedPendingToAdmin = await PickupPending.aggregate([
              {
                $match: {
                  $and: [
                      { deliveredDate: { $gte: new Date(StartingDate) } },
                      { deliveredDate: { $lte: new Date(EndingDate) } },
                      { status: "delivered" },
                      { paymentType: "cod" },
                      {paidToAdmin:"pending to paid"},
                      { deliveryBoyId: mongoose.Types.ObjectId(req.body.deliveryBoyId) },
                    ],

                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "userId",
                  foreignField: "_id",
                  as: "user",
                },
              },
              {
                $unwind: {
                  path: "$user",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $unwind: {
                  path: "$cartDetails",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $project: {
                  userName: "$user.name",
                  orderId: 1,
                  paidToAdmin:1,
                  totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
      
                },
              },
              { $sort: { _id: -1 } }
            ]);
           let count = 0;
            for (let item of DatedPendingToAdmin) {
              count++;
              item.sl = count;
            }
            return res.json({
              error: false,
              message: DatedPendingToAdmin.length
                ? "DatedPendingToAdmin orders found."
                : "Empty DatedPendingToAdmin orders.",
              data: {
                  DatedPendingToAdmin,
              },
            });
      } catch (error) {
          next(error);
      }
  },
    getDelveryBoyPendingToAdminDeliveryBoys: async (req, res, next) => {
        try {
            const deliveyBoyPendingToAdmin = await PickupPending.aggregate([
                {
                  $match: {
                    status: "delivered",
                    paymentType:"cod",
                    paidToAdmin:"pending to paid",
                    deliveryBoyId: mongoose.Types.ObjectId(req.params.id)
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                  },
                },
                {
                  $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $unwind: {
                    path: "$cartDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    userName: "$user.name",
                    orderId: 1,
                    paidToAdmin:1,
                    totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
        
                  },
                },
                { $sort: { _id: -1 } }
              ]);
             let count = 0;
              for (let item of deliveyBoyPendingToAdmin) {
                count++;
                item.sl = count;
              }
              return res.json({
                error: false,
                message: deliveyBoyPendingToAdmin.length
                  ? "pendingToAdmin orders found."
                  : "Empty pendingToAdmin orders.",
                data: {
                    deliveyBoyPendingToAdmin,
                },
              });
        } catch (error) {
            next(error);
        }
    },
     // get  paid to admin delivery boys
     getPaidToAdminDeliveryBoys: async (req, res, next) => {
        try {
            let pageSize = 0;
            let pageNo = 0;
        if (req.body.limit) {
          pageSize = Number(req.body.limit);
        } else {
          pageSize = 10;
        }
        if (req.body.pageNo) {
            pageNo = Number(req.body.pageNo);
          } else {
            pageNo = 1;
          }

        var aggregateQuery = PickupPending.aggregate();

        aggregateQuery.match({status: "delivered",paymentType:"cod",paidToAdmin:"paid" });

        aggregateQuery.lookup({
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        });
        aggregateQuery.unwind({
          path: "$user",
          preserveNullAndEmptyArrays: true,
        });
        aggregateQuery.unwind({
          path: "$cartDetails",
          preserveNullAndEmptyArrays: true,
        });
        aggregateQuery.project({
            userName: "$user.name",
            orderId: 1,
            paidToAdmin:1,
            totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
        });
        aggregateQuery.sort({
          _id: -1,
        });
        const customLabels = {
          totalDocs: "TotalRecords",
          docs: "users",
          limit: "PageSize",
          page: "CurrentPage",
        };
        const aggregatePaginateOptions = {
          page: pageNo,
          limit: pageSize,
          customLabels: customLabels,
        };
        let response = await PickupPending.aggregatePaginate(
          aggregateQuery,
          aggregatePaginateOptions
        );
          
            let paidToAdmin = response.users;
             let count = 0;
              for (let item of paidToAdmin) {
                count++;
                item.sl = count;
              }
              return res.json({
                error: false,
                message: paidToAdmin.length
                  ? "paidToAdmin orders found."
                  : "Empty paidToAdmin orders.",
                data: {
                    paidToAdmin,
                    hasPrevPage: response.hasPrevPage,
                    hasNextPage: response.hasNextPage,
                    total_items: response.TotalRecords,
                  current_page: response.CurrentPage,
                },
              });
        } catch (error) {
            next(error);
        }
    },
   
   
     getDatePaidToAdminDeliveryBoys: async (req, res, next) => {
        try {
            let StartingDate = moment(req.body.StartingDate).tz(process.env.TIME_ZONE).set({ h: 00, m: 00, s: 00 }).utc()
            let EndingDate = moment(req.body.EndingDate)
            .tz(process.env.TIME_ZONE)
            .set({ h: 23, m: 59, s: 59 })
            let pageSize = 0;
            let pageNo = 0;
        if (req.body.limit) {
          pageSize = Number(req.body.limit);
        } else {
          pageSize = 10;
        }
        if (req.body.pageNo) {
            pageNo = Number(req.body.pageNo);
          } else {
            pageNo = 1;
          }
          let { searchBy } = req?.body;

          let searchQuery;
          searchQuery = [
            { userName: { $regex: `${searchBy}`, $options: "i" } },
            { totalAmountToBePaid: { $regex: `${searchBy}`, $options: "i" } },
            { orderId: { $regex: `${searchBy}`, $options: "i" } },
            { paidToAdmin: { $regex: `${searchBy}`, $options: "i" } },
    
    
          ];    
        var aggregateQuery = PickupPending.aggregate();

        aggregateQuery.match({
            $and: [
                { paidToAdminDate: { $gte: new Date(StartingDate) } },
                { paidToAdminDate: { $lte: new Date(EndingDate) } },
                { status: "delivered" },
                { paymentType: "cod" },
                { paidToAdmin: "paid" },

              ],
           });

        aggregateQuery.lookup({
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        });
        aggregateQuery.unwind({
          path: "$user",
          preserveNullAndEmptyArrays: true,
        });
        aggregateQuery.unwind({
          path: "$cartDetails",
          preserveNullAndEmptyArrays: true,
        });
        aggregateQuery.project({
            userName: "$user.name",
            orderId: 1,
            paidToAdmin:1,
            totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
        });
        aggregateQuery.match({ ...(searchBy && { $or: searchQuery }), });
        aggregateQuery.sort({
          _id: -1,
        });
        const customLabels = {
          totalDocs: "TotalRecords",
          docs: "users",
          limit: "PageSize",
          page: "CurrentPage",
        };
        const aggregatePaginateOptions = {
          page: pageNo,
          limit: pageSize,
          customLabels: customLabels,
        };
        let response = await PickupPending.aggregatePaginate(
          aggregateQuery,
          aggregatePaginateOptions
        );
          
            let DatedPaidToAdmin = response.users;
             let count = 0;
              for (let item of DatedPaidToAdmin) {
                count++;
                item.sl = count;
              }
              return res.json({
                error: false,
                message: DatedPaidToAdmin.length
                  ? "DatedPaidToAdmin orders found."
                  : "Empty DatedPaidToAdmin orders.",
                data: {
                    DatedPaidToAdmin,
                    hasPrevPage: response.hasPrevPage,
                    hasNextPage: response.hasNextPage,
                    total_items: response.TotalRecords,
                  current_page: response.CurrentPage,
                },
              });
        } catch (error) {
            next(error);
        }
    },
    getSearchPaidToAdminDeliveryBoy: async (req, res, next) => {
      try {
        
          let pageSize = 0;
          let pageNo = 0;
      if (req.body.limit) {
        pageSize = Number(req.body.limit);
      } else {
        pageSize = 10;
      }
      if (req.body.pageNo) {
          pageNo = Number(req.body.pageNo);
        } else {
          pageNo = 1;
        }
        let { searchBy } = req?.body;

        let searchQuery;
        searchQuery = [
          { userName: { $regex: `${searchBy}`, $options: "i" } },
          { totalAmountToBePaid: { $regex: `${searchBy}`, $options: "i" } },
          { orderId: { $regex: `${searchBy}`, $options: "i" } },
          { paidToAdmin: { $regex: `${searchBy}`, $options: "i" } },
  
  
        ];    
      var aggregateQuery = PickupPending.aggregate();

      aggregateQuery.match({status: "delivered",paymentType:"cod",paidToAdmin:"paid" });

      aggregateQuery.lookup({
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      });
      aggregateQuery.unwind({
        path: "$user",
        preserveNullAndEmptyArrays: true,
      });
      aggregateQuery.unwind({
        path: "$cartDetails",
        preserveNullAndEmptyArrays: true,
      });
      aggregateQuery.project({
          userName: "$user.name",
          orderId: 1,
          paidToAdmin:1,
          totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
      });
      aggregateQuery.match({ ...(searchBy && { $or: searchQuery }), });
      aggregateQuery.sort({
        _id: -1,
      });
      const customLabels = {
        totalDocs: "TotalRecords",
        docs: "users",
        limit: "PageSize",
        page: "CurrentPage",
      };
      const aggregatePaginateOptions = {
        page: pageNo,
        limit: pageSize,
        customLabels: customLabels,
      };
      let response = await PickupPending.aggregatePaginate(
        aggregateQuery,
        aggregatePaginateOptions
      );
        
          let paidToAdmin = response.users;
           let count = 0;
            for (let item of paidToAdmin) {
              count++;
              item.sl = count;
            }
            return res.json({
              error: false,
              message: paidToAdmin.length
                ? "paidToAdmin orders found."
                : "Empty paidToAdmin orders.",
              data: {
                  paidToAdmin,
                  hasPrevPage: response.hasPrevPage,
                  hasNextPage: response.hasNextPage,
                  total_items: response.TotalRecords,
                current_page: response.CurrentPage,
              },
            });
      } catch (error) {
          next(error);
      }
  },
    getDatePaidToAdminDeliveryBoy: async (req, res, next) => {
      try {
          let StartingDate = moment(req.body.StartingDate).tz(process.env.TIME_ZONE).set({ h: 00, m: 00, s: 00 }).utc()
          let EndingDate = moment(req.body.EndingDate)
          .tz(process.env.TIME_ZONE)
          .set({ h: 23, m: 59, s: 59 })
          let pageSize = 0;
          let pageNo = 0;
      if (req.body.limit) {
        pageSize = Number(req.body.limit);
      } else {
        pageSize = 10;
      }
      if (req.body.pageNo) {
          pageNo = Number(req.body.pageNo);
        } else {
          pageNo = 1;
        }
        let { searchBy } = req?.body;

        let searchQuery;
        searchQuery = [
          { userName: { $regex: `${searchBy}`, $options: "i" } },
          { totalAmountToBePaid: { $regex: `${searchBy}`, $options: "i" } },
          { orderId: { $regex: `${searchBy}`, $options: "i" } },
          { paidToAdmin: { $regex: `${searchBy}`, $options: "i" } },
  
  
        ];  
      var aggregateQuery = PickupPending.aggregate();

      aggregateQuery.match({
          $and: [
              { paidToAdminDate: { $gte: new Date(StartingDate) } },
              { paidToAdminDate: { $lte: new Date(EndingDate) } },
              { status: "delivered" },
              { paymentType: "cod" },
              { paidToAdmin: "paid" },
              { deliveryBoyId: mongoose.Types.ObjectId(req.body.deliveryBoyId) },

            ],
         });

      aggregateQuery.lookup({
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      });
      aggregateQuery.unwind({
        path: "$user",
        preserveNullAndEmptyArrays: true,
      });
      aggregateQuery.unwind({
        path: "$cartDetails",
        preserveNullAndEmptyArrays: true,
      });
      aggregateQuery.project({
          userName: "$user.name",
          orderId: 1,
          paidToAdmin:1,
          totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
      });
      aggregateQuery.match({ 
        ...(searchBy && { $or: searchQuery }),
       });
      aggregateQuery.sort({
        _id: -1,
      });
      const customLabels = {
        totalDocs: "TotalRecords",
        docs: "users",
        limit: "PageSize",
        page: "CurrentPage",
      };
      const aggregatePaginateOptions = {
        page: pageNo,
        limit: pageSize,
        customLabels: customLabels,
      };
      let response = await PickupPending.aggregatePaginate(
        aggregateQuery,
        aggregatePaginateOptions
      );
        
          let DatedPaidToAdmin = response.users;
           let count = 0;
            for (let item of DatedPaidToAdmin) {
              count++;
              item.sl = count;
            }
            return res.json({
              error: false,
              message: DatedPaidToAdmin.length
                ? "DatedPaidToAdmin orders found."
                : "Empty DatedPaidToAdmin orders.",
              data: {
                  DatedPaidToAdmin,
                  hasPrevPage: response.hasPrevPage,
                  hasNextPage: response.hasNextPage,
                  total_items: response.TotalRecords,
                current_page: response.CurrentPage,
              },
            });
      } catch (error) {
          next(error);
      }
  },
    getDelveryBoyPaidToAdminDeliveryBoys: async (req, res, next) => {
        try {
            if (req.body.limit) {
                pageSize = Number(req.body.limit);
              } else {
                pageSize = 10;
              }
              if (req.body.pageNo) {
                  pageNo = Number(req.body.pageNo);
                } else {
                  pageNo = 1;
                }
      
              var aggregateQuery = PickupPending.aggregate();
      
              aggregateQuery.match({
                  $and: [
                      {  deliveryBoyId: mongoose.Types.ObjectId(req.params.id) },
                      { status: "delivered" },
                      { paymentType: "cod" },
                      { paidToAdmin: "paid" },
      
                    ],
                 });
      
              aggregateQuery.lookup({
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
              });
              aggregateQuery.unwind({
                path: "$user",
                preserveNullAndEmptyArrays: true,
              });
              aggregateQuery.unwind({
                path: "$cartDetails",
                preserveNullAndEmptyArrays: true,
              });
              aggregateQuery.project({
                  userName: "$user.name",
                  orderId: 1,
                  paidToAdmin:1,
                  totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
              });
              aggregateQuery.sort({
                _id: -1,
              });
              const customLabels = {
                totalDocs: "TotalRecords",
                docs: "users",
                limit: "PageSize",
                page: "CurrentPage",
              };
              const aggregatePaginateOptions = {
                page: pageNo,
                limit: pageSize,
                customLabels: customLabels,
              };
              let response = await PickupPending.aggregatePaginate(
                aggregateQuery,
                aggregatePaginateOptions
              );
                
                  let deliveyBoyPaidToAdmin = response.users;
             let count = 0;
              for (let item of deliveyBoyPaidToAdmin) {
                count++;
                item.sl = count;
              }
              return res.json({
                error: false,
                message: deliveyBoyPaidToAdmin.length
                  ? "pendingToAdmin orders found."
                  : "Empty pendingToAdmin orders.",
                data: {
                    deliveyBoyPaidToAdmin,
                    hasPrevPage: response.hasPrevPage,
                    hasNextPage: response.hasNextPage,
                    total_items: response.TotalRecords,
                  current_page: response.CurrentPage,
                },
              });
        } catch (error) {
            next(error);
        }
    },
     // get pending paid to  delivery boys
     getPendingToDeliveryBoys: async (req, res, next) => {
        try {
            const pendingToDeliveryBoy = await PickupPending.aggregate([
                {
                  $match: {
                    status: "delivered",paymentType:"cod",paidToAdmin: "paid",paidTodeliveryBoy:"pending to paid"
                  },
                },
                {
                  $lookup: {
                    from: "deliveryboys",
                    localField: "deliveryBoyId",
                    foreignField: "_id",
                    as: "deliveryboy",
                  },
                },
                {
                  $unwind: {
                    path: "$deliveryboy",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $unwind: {
                    path: "$cartDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    orderId: 1,
                    paidToAdmin:1,
                    commission:"$deliveryboy.commission",
                    totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
        
                  },
                },
                { $sort: { _id: -1 } }
              ]);
              let totalCommission = 0;
             let count = 0;
              for (let item of pendingToDeliveryBoy) {
                count++;
                item.sl = count;
                totalCommission = parseInt(totalCommission + item.commission)
              }
              return res.json({
                error: false,
                message: pendingToDeliveryBoy.length
                  ? "pendingToDeliveryBoy orders found."
                  : "Empty pendingToDeliveryBoy orders.",
                data: {
                    pendingToDeliveryBoy,
                    totalCommission
                },
              });
        } catch (error) {
            next(error);
        }
    },
  
    getDatePendingToDeliveryBoys: async (req, res, next) => {
        try {
            let StartingDate = moment(req.body.StartingDate).tz(process.env.TIME_ZONE).set({ h: 00, m: 00, s: 00 }).utc()
            let EndingDate = moment(req.body.EndingDate)
            .tz(process.env.TIME_ZONE)
            .set({ h: 23, m: 59, s: 59 })
            const DatedPendingDeliveryBoy = await PickupPending.aggregate([
                {
                  $match: {
                    $and: [
                        { deliveredDate: { $gte: new Date(StartingDate) } },
                        { deliveredDate: { $lte: new Date(EndingDate) } },
                        { status: "delivered" },
                        { paymentType: "cod" },
                        { paidToAdmin: "paid" },
                       { paidTodeliveryBoy:"pending to paid"}

                      ],
                  },
                },
                {
                  $lookup: {
                    from: "deliveryboys",
                    localField: "deliveryBoyId",
                    foreignField: "_id",
                    as: "deliveryboy",
                  },
                },
                {
                  $unwind: {
                    path: "$deliveryboy",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $unwind: {
                    path: "$cartDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    orderId: 1,
                    paidToAdmin:1,
                    commission:"$deliveryboy.commission",
                    totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
        
                  },
                },
                { $sort: { _id: -1 } }
              ]);
             let count = 0;
             let totalCommission = 0;
              for (let item of DatedPendingDeliveryBoy) {
                count++;
                item.sl = count;
                totalCommission = parseInt(totalCommission + item.commission)
              }
              return res.json({
                error: false,
                message: DatedPendingDeliveryBoy.length
                  ? "DatedPendingToAdmin orders found."
                  : "Empty DatedPendingToAdmin orders.",
                data: {
                    DatedPendingDeliveryBoy,
                    totalCommission
                },
              });
        } catch (error) {
            next(error);
        }
    },
    getDatePendingToDeliveryBoy: async (req, res, next) => {
      try {
          let StartingDate = moment(req.body.StartingDate).tz(process.env.TIME_ZONE).set({ h: 00, m: 00, s: 00 }).utc()
          let EndingDate = moment(req.body.EndingDate)
          .tz(process.env.TIME_ZONE)
          .set({ h: 23, m: 59, s: 59 })
          const DatedPendingDeliveryBoy = await PickupPending.aggregate([
              {
                $match: {
                  $and: [
                      { deliveredDate: { $gte: new Date(StartingDate) } },
                      { deliveredDate: { $lte: new Date(EndingDate) } },
                      { status: "delivered" },
                      { paymentType: "cod" },
                      { paidToAdmin: "paid" },
                      {paidTodeliveryBoy:"pending to paid"},
                      { deliveryBoyId: mongoose.Types.ObjectId(req.body.deliveryBoyId) },
                    ],
                },
              },
              {
                $lookup: {
                  from: "deliveryboys",
                  localField: "deliveryBoyId",
                  foreignField: "_id",
                  as: "deliveryboy",
                },
              },
              {
                $unwind: {
                  path: "$deliveryboy",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $unwind: {
                  path: "$cartDetails",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $project: {
                  orderId: 1,
                  paidToAdmin:1,
                  commission:"$deliveryboy.commission",
                  totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
      
                },
              },
              { $sort: { _id: -1 } }
            ]);
           let count = 0;
           let totalCommission = 0;
            for (let item of DatedPendingDeliveryBoy) {
              count++;
              item.sl = count;
              totalCommission = parseInt(totalCommission + item.commission)
            }
            return res.json({
              error: false,
              message: DatedPendingDeliveryBoy.length
                ? "DatedPendingToAdmin orders found."
                : "Empty DatedPendingToAdmin orders.",
              data: {
                  DatedPendingDeliveryBoy,
                  totalCommission
              },
            });
      } catch (error) {
          next(error);
      }
  },
    getDelveryBoyPendingToDeliveryBoys: async (req, res, next) => {
        try {
            const PendingDeliveryBoy = await PickupPending.aggregate([
                {
                  $match: {
                    status: "delivered",
                    paymentType:"cod",
                    paidToAdmin: "paid",
                    paidTodeliveryBoy:"pending to paid",
                    deliveryBoyId: mongoose.Types.ObjectId(req.params.id)
                  },
                },
                {
                  $lookup: {
                    from: "deliveryboys",
                    localField: "deliveryBoyId",
                    foreignField: "_id",
                    as: "deliveryboy",
                  },
                },
                {
                  $unwind: {
                    path: "$deliveryboy",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $unwind: {
                    path: "$cartDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    orderId: 1,
                    paidToAdmin:1,
                    commission:"$deliveryboy.commission",
                    totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
        
                  },
                },
                { $sort: { _id: -1 } }
              ]);
             let count = 0;
             let totalCommission = 0;
              for (let item of PendingDeliveryBoy) {
                count++;
                item.sl = count;
                totalCommission = parseInt(totalCommission + item.commission)
              }
              return res.json({
                error: false,
                message: PendingDeliveryBoy.length
                  ? "PendingDeliveryBoy orders found."
                  : "Empty PendingDeliveryBoy orders.",
                data: {
                    PendingDeliveryBoy,
                    totalCommission
                },
              });
        } catch (error) {
            next(error);
        }
    },

     // get paid to  delivery boys
     getPaidToDeliveryBoys: async (req, res, next) => {
      try {
        let pageSize = 0;
        let pageNo = 0;
    if (req.body.limit) {
      pageSize = Number(req.body.limit);
    } else {
      pageSize = 10;
    }
    if (req.body.pageNo) {
        pageNo = Number(req.body.pageNo);
      } else {
        pageNo = 1;
      }

    var aggregateQuery = PickupPending.aggregate();

    aggregateQuery.match({
     status: "delivered",
    paymentType:"cod",
    paidToAdmin: "paid",
    paidTodeliveryBoy: "paid", });

    aggregateQuery.lookup({
      from: "deliveryboys",
      localField: "deliveryBoyId",
      foreignField: "_id",
      as: "deliveryboy",
    });
    aggregateQuery.unwind({
      path: "$deliveryboy",
      preserveNullAndEmptyArrays: true,
    });
    aggregateQuery.unwind({
      path: "$cartDetails",
      preserveNullAndEmptyArrays: true,
    });
    aggregateQuery.project({
      orderId: 1,
      paidToAdmin:1,
      commission:"$deliveryboy.commission",
      totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
    });
    aggregateQuery.sort({
      _id: -1,
    });
    const customLabels = {
      totalDocs: "TotalRecords",
      docs: "users",
      limit: "PageSize",
      page: "CurrentPage",
    };
    const aggregatePaginateOptions = {
      page: pageNo,
      limit: pageSize,
      customLabels: customLabels,
    };
    let response = await PickupPending.aggregatePaginate(
      aggregateQuery,
      aggregatePaginateOptions
    );
      
        let paidToDeliveryBoy = response.users;
         let count = 0;
          for (let item of paidToDeliveryBoy) {
            count++;
            item.sl = count;
          }
          return res.json({
            error: false,
            message: paidToDeliveryBoy.length
              ? "paidToDeliveryBoy orders found."
              : "Empty paidToDeliveryBoy orders.",
            data: {
              paidToDeliveryBoy,
                hasPrevPage: response.hasPrevPage,
                hasNextPage: response.hasNextPage,
                total_items: response.TotalRecords,
              current_page: response.CurrentPage,
            },
          });
         
      } catch (error) {
          next(error);
      }
  },
  getSearchedPaidToDeliveryBoys: async (req, res, next) => {
    try {
      let pageSize = 0;
      let pageNo = 0;
  if (req.body.limit) {
    pageSize = Number(req.body.limit);
  } else {
    pageSize = 10;
  }
  if (req.body.pageNo) {
      pageNo = Number(req.body.pageNo);
    } else {
      pageNo = 1;
    }
    let { searchBy } = req?.body;

    let searchQuery;
    searchQuery = [
      { commission: { $regex: `${searchBy}`, $options: "i" } },
      { totalAmountToBePaid: { $regex: `${searchBy}`, $options: "i" } },
      { orderId: { $regex: `${searchBy}`, $options: "i" } },
      { paidToAdmin: { $regex: `${searchBy}`, $options: "i" } },


    ];    
  var aggregateQuery = PickupPending.aggregate();

  aggregateQuery.match({
   status: "delivered",
  paymentType:"cod",
  paidToAdmin: "paid",
  paidTodeliveryBoy: "paid", });

  aggregateQuery.lookup({
    from: "deliveryboys",
    localField: "deliveryBoyId",
    foreignField: "_id",
    as: "deliveryboy",
  });
  aggregateQuery.unwind({
    path: "$deliveryboy",
    preserveNullAndEmptyArrays: true,
  });
  aggregateQuery.unwind({
    path: "$cartDetails",
    preserveNullAndEmptyArrays: true,
  });
  aggregateQuery.project({
    orderId: 1,
    paidToAdmin:1,
    commission:"$deliveryboy.commission",
    totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
  });
  aggregateQuery.match({ ...(searchBy && { $or: searchQuery }), });
  aggregateQuery.sort({
    _id: -1,
  });
  const customLabels = {
    totalDocs: "TotalRecords",
    docs: "users",
    limit: "PageSize",
    page: "CurrentPage",
  };
  const aggregatePaginateOptions = {
    page: pageNo,
    limit: pageSize,
    customLabels: customLabels,
  };
  let response = await PickupPending.aggregatePaginate(
    aggregateQuery,
    aggregatePaginateOptions
  );
    
      let paidToDeliveryBoy = response.users;
       let count = 0;
        for (let item of paidToDeliveryBoy) {
          count++;
          item.sl = count;
        }
        return res.json({
          error: false,
          message: paidToDeliveryBoy.length
            ? "paidToDeliveryBoy orders found."
            : "Empty paidToDeliveryBoy orders.",
          data: {
            paidToDeliveryBoy,
              hasPrevPage: response.hasPrevPage,
              hasNextPage: response.hasNextPage,
              total_items: response.TotalRecords,
            current_page: response.CurrentPage,
          },
        });
       
    } catch (error) {
        next(error);
    }
},


 
   getDatePaidToDeliveryBoys: async (req, res, next) => {
      try {
          let StartingDate = moment(req.body.StartingDate).tz(process.env.TIME_ZONE).set({ h: 00, m: 00, s: 00 }).utc()
          let EndingDate = moment(req.body.EndingDate)
          .tz(process.env.TIME_ZONE)
          .set({ h: 23, m: 59, s: 59 })
          let pageSize = 0;
          let pageNo = 0;
      if (req.body.limit) {
        pageSize = Number(req.body.limit);
      } else {
        pageSize = 10;
      }
      if (req.body.pageNo) {
          pageNo = Number(req.body.pageNo);
        } else {
          pageNo = 1;
        }
        let { searchBy } = req?.body;
        let searchQuery;
        searchQuery = [
          { commission: { $regex: `${searchBy}`, $options: "i" } },
          { totalAmountToBePaid: { $regex: `${searchBy}`, $options: "i" } },
          { orderId: { $regex: `${searchBy}`, $options: "i" } },
          { paidToAdmin: { $regex: `${searchBy}`, $options: "i" } },
  
  
        ];  
  
      var aggregateQuery = PickupPending.aggregate();
  
      aggregateQuery.match({
        $and: [
          { deliveredDate: { $gte: new Date(StartingDate) } },
          { deliveredDate: { $lte: new Date(EndingDate) } },
          { status: "delivered" },
          { paymentType: "cod" },
          { paidToAdmin: "paid" },
          { paidTodeliveryBoy: "paid" },

        ],
    });
  
      aggregateQuery.lookup({
        from: "deliveryboys",
        localField: "deliveryBoyId",
        foreignField: "_id",
        as: "deliveryboy",
      });
      aggregateQuery.unwind({
        path: "$deliveryboy",
        preserveNullAndEmptyArrays: true,
      });
      aggregateQuery.unwind({
        path: "$cartDetails",
        preserveNullAndEmptyArrays: true,
      });
      aggregateQuery.project({
        orderId: 1,
        paidToAdmin:1,
        commission:"$deliveryboy.commission",
        totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
      });
      aggregateQuery.match({ ...(searchBy && { $or: searchQuery }), });
      aggregateQuery.sort({
        _id: -1,
      });
      const customLabels = {
        totalDocs: "TotalRecords",
        docs: "users",
        limit: "PageSize",
        page: "CurrentPage",
      };
      const aggregatePaginateOptions = {
        page: pageNo,
        limit: pageSize,
        customLabels: customLabels,
      };
      let response = await PickupPending.aggregatePaginate(
        aggregateQuery,
        aggregatePaginateOptions
      );
        
          let DatedPaidToDeliveryBoy = response.users;
           let count = 0;
            for (let item of DatedPaidToDeliveryBoy) {
              count++;
              item.sl = count;
            }
            return res.json({
              error: false,
              message: DatedPaidToDeliveryBoy.length
                ? "paidToDeliveryBoy orders found."
                : "Empty paidToDeliveryBoy orders.",
              data: {
                DatedPaidToDeliveryBoy,
                  hasPrevPage: response.hasPrevPage,
                  hasNextPage: response.hasNextPage,
                  total_items: response.TotalRecords,
                current_page: response.CurrentPage,
              },
            });
          
      } catch (error) {
          next(error);
      }
  },
  getDatePaidToDeliveryBoy: async (req, res, next) => {
    try {
        let StartingDate = moment(req.body.StartingDate).tz(process.env.TIME_ZONE).set({ h: 00, m: 00, s: 00 }).utc()
        let EndingDate = moment(req.body.EndingDate)
        .tz(process.env.TIME_ZONE)
        .set({ h: 23, m: 59, s: 59 })
        let pageSize = 0;
        let pageNo = 0;
    if (req.body.limit) {
      pageSize = Number(req.body.limit);
    } else {
      pageSize = 10;
    }
    if (req.body.pageNo) {
        pageNo = Number(req.body.pageNo);
      } else {
        pageNo = 1;
      }
      let { searchBy } = req?.body;
      let searchQuery;
      searchQuery = [
        { commission: { $regex: `${searchBy}`, $options: "i" } },
        { totalAmountToBePaid: { $regex: `${searchBy}`, $options: "i" } },
        { orderId: { $regex: `${searchBy}`, $options: "i" } },
        { paidToAdmin: { $regex: `${searchBy}`, $options: "i" } },
        

      ];  

    var aggregateQuery = PickupPending.aggregate();

    aggregateQuery.match({
      $and: [
        { deliveredDate: { $gte: new Date(StartingDate) } },
        { deliveredDate: { $lte: new Date(EndingDate) } },
        { status: "delivered" },
        { paymentType: "cod" },
        { paidToAdmin: "paid" },
        { paidTodeliveryBoy: "paid" },
        {deliveryBoyId: mongoose.Types.ObjectId(req.body.deliveryBoyId)}
      ],
  });

    aggregateQuery.lookup({
      from: "deliveryboys",
      localField: "deliveryBoyId",
      foreignField: "_id",
      as: "deliveryboy",
    });
    aggregateQuery.unwind({
      path: "$deliveryboy",
      preserveNullAndEmptyArrays: true,
    });
    aggregateQuery.unwind({
      path: "$cartDetails",
      preserveNullAndEmptyArrays: true,
    });
    aggregateQuery.project({
      orderId: 1,
      paidToAdmin:1,
      commission:"$deliveryboy.commission",
      totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
    });
    aggregateQuery.match({ ...(searchBy && { $or: searchQuery }), });
    aggregateQuery.sort({
      _id: -1,
    });
    const customLabels = {
      totalDocs: "TotalRecords",
      docs: "users",
      limit: "PageSize",
      page: "CurrentPage",
    };
    const aggregatePaginateOptions = {
      page: pageNo,
      limit: pageSize,
      customLabels: customLabels,
    };
    let response = await PickupPending.aggregatePaginate(
      aggregateQuery,
      aggregatePaginateOptions
    );
      
        let DatedPaidToDeliveryBoy = response.users;
         let count = 0;
          for (let item of DatedPaidToDeliveryBoy) {
            count++;
            item.sl = count;
          }
          return res.json({
            error: false,
            message: DatedPaidToDeliveryBoy.length
              ? "paidToDeliveryBoy orders found."
              : "Empty paidToDeliveryBoy orders.",
            data: {
              DatedPaidToDeliveryBoy,
                hasPrevPage: response.hasPrevPage,
                hasNextPage: response.hasNextPage,
                total_items: response.TotalRecords,
              current_page: response.CurrentPage,
            },
          });
        
    } catch (error) {
        next(error);
    }
},
  getDelveryBoyPaidToDeliveryBoys: async (req, res, next) => {
      try {
        let pageSize = 0;
        let pageNo = 0;
    if (req.body.limit) {
      pageSize = Number(req.body.limit);
    } else {
      pageSize = 10;
    }
    if (req.body.pageNo) {
        pageNo = Number(req.body.pageNo);
      } else {
        pageNo = 1;
      }

    var aggregateQuery = PickupPending.aggregate();

    aggregateQuery.match({
      status: "delivered",
      paymentType:"cod",
      paidToAdmin: "paid",
      paidTodeliveryBoy: "paid",
      deliveryBoyId: mongoose.Types.ObjectId(req.params.id) });

    aggregateQuery.lookup({
      from: "deliveryboys",
      localField: "deliveryBoyId",
      foreignField: "_id",
      as: "deliveryboy",
    });
    aggregateQuery.unwind({
      path: "$deliveryboy",
      preserveNullAndEmptyArrays: true,
    });
    aggregateQuery.unwind({
      path: "$cartDetails",
      preserveNullAndEmptyArrays: true,
    });
    aggregateQuery.project({
      orderId: 1,
      paidToAdmin:1,
      commission:"$deliveryboy.commission",
      totalAmountToBePaid: "$cartDetails.totalAmountToBePaid",
    });
    aggregateQuery.sort({
      _id: -1,
    });
    const customLabels = {
      totalDocs: "TotalRecords",
      docs: "users",
      limit: "PageSize",
      page: "CurrentPage",
    };
    const aggregatePaginateOptions = {
      page: pageNo,
      limit: pageSize,
      customLabels: customLabels,
    };
    let response = await PickupPending.aggregatePaginate(
      aggregateQuery,
      aggregatePaginateOptions
    );
      
        let paidToDeliveryBoy = response.users;
         let count = 0;
          for (let item of paidToDeliveryBoy) {
            count++;
            item.sl = count;
          }
          return res.json({
            error: false,
            message: paidToDeliveryBoy.length
              ? "paidToDeliveryBoy orders found."
              : "Empty paidToDeliveryBoy orders.",
            data: {
              paidToDeliveryBoy,
                hasPrevPage: response.hasPrevPage,
                hasNextPage: response.hasNextPage,
                total_items: response.TotalRecords,
              current_page: response.CurrentPage,
            },
          });
         
         
      } catch (error) {
          next(error);
      }
  },
  changePendingPaidStatus: async (req, res, next) => {
    try {
      let data = req.body;
      let DeliveryBoy = await DeliveryBoys.findOne({
        _id: data.deliveryBoyId,
      });
      if (DeliveryBoy) {
          PickupPending.updateMany(
            { deliveryBoyId: data.deliveryBoyId, 
            status: "delivered",
            paymentType:"cod",
            paidToAdmin: "paid", },
            {
              $set: {
                paidTodeliveryBoy: data.status,
                paidTodeliveryBoyDate: moment(new Date ())
                .tz(process.env.TIME_ZONE)
              },
            }
          )
            .then(async (response) => {
              res.status(200).json({
                error: false,
                message: "paid to delivery boy status updated successfully",
              });
            })
            .catch(async (error) => {
              res.status(200).json({
                error: true,
                message: error,
              });
            });
      } else {
        res.status(200).json({
          status: false,
          message: "something went wrong please login and continue",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getDatedQueries: async (req, res, next) => {
    try {
        let StartingDate = moment(req.body.StartingDate).tz(process.env.TIME_ZONE).set({ h: 00, m: 00, s: 00 }).utc()
        let EndingDate = moment(req.body.EndingDate)
        .tz(process.env.TIME_ZONE)
        .set({ h: 23, m: 59, s: 59 })
        const DatedQueries = await DeliveryBoyQueries.aggregate([
            {
              $match: {
                $and: [
                    { createdAt: { $gte: new Date(StartingDate) } },
                    { createdAt: { $lte: new Date(EndingDate) } },
                  ],
              },
            },
            {
              $lookup: {
                from: "deliveryboys",
                localField: "DeliveryBoyID",
                foreignField: "_id",
                as: "deliveryboy",
              },
            },
            {
              $unwind: {
                path: "$deliveryboy",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                deliveryBoyName: "$deliveryboy.fullName",
                IssueRelated: 1,
                Issue:1,
                createdAt:1,
                isReplied:1
    
              },
            },
            { $sort: { _id: -1 } }
          ]);
         let count = 0;
          for (let item of DatedQueries) {
            count++;
            item.sl = count;
            item.createdAt = moment(
              item.createdAt
            ).format("MMMM Do YYYY")
          }
          return res.json({
            error: false,
            message: DatedQueries.length
              ? "DatedQueries found."
              : "Empty DatedQueries.",
            data: {
              DatedQueries,
            },
          });
    } catch (error) {
        next(error);
    }
},
getDatedQueriesDeliveryBoy: async (req, res, next) => {
  try {
      let StartingDate = moment(req.body.StartingDate).tz(process.env.TIME_ZONE).set({ h: 00, m: 00, s: 00 }).utc()
      let EndingDate = moment(req.body.EndingDate)
      .tz(process.env.TIME_ZONE)
      .set({ h: 23, m: 59, s: 59 })
      const DatedQueriesDeliveryBoy = await DeliveryBoyQueries.aggregate([
          {
            $match: {
              $and: [
                  { createdAt: { $gte: new Date(StartingDate) } },
                  { createdAt: { $lte: new Date(EndingDate) } },
                  { DeliveryBoyID: mongoose.Types.ObjectId(req.body.DeliveryBoyID) },
                ],
            },
          },
          {
            $lookup: {
              from: "deliveryboys",
              localField: "DeliveryBoyId",
              foreignField: "_id",
              as: "deliveryboy",
            },
          },
          {
            $unwind: {
              path: "$deliveryboy",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
                deliveryBoyName: "$deliveryboy.fullName",
                IssueRelated: 1,
                Issue:1,
                createdAt:1,
                isReplied:1
            },
          },
          { $sort: { _id: -1 } }
        ]);
       let count = 0;
        for (let item of DatedQueriesDeliveryBoy) {
          count++;
          item.sl = count;
          item.createdAt = moment(
            item.createdAt
          ).format("MMMM Do YYYY")
        }
        return res.json({
          error: false,
          message: DatedQueriesDeliveryBoy.length
            ? "DatedQueriesDeliveryBoy found."
            : "DatedQueriesDeliveryBoy orders.",
          data: {
            DatedQueriesDeliveryBoy,
          },
        });
  } catch (error) {
      next(error);
  }
},
deleteQueriesDeliveryBoy: async (req, res, next) => {
  try {
    let result = await DeliveryBoyQueries.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    if (result) {
     
      DeliveryBoyQueries.deleteOne({   _id: mongoose.Types.ObjectId(req.params.id) })
        .then((_) => {
          res.status(200).json({
            status: true,
            data: "Data removed successfully",
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
        data: "invalid id",
      });
    }
  } catch (error) {
    next(error);
  }
},
replyToQueriesDeliveryBoy: async (req, res, next) => {
  try {
    let data = req.body;
    if (data.queryId) {
      let DeliveryBoyQuery = await DeliveryBoyQueries.findOne({
        _id: mongoose.Types.ObjectId(data.queryId),
      });

      if (DeliveryBoyQuery) {
        data.isReplied = true
        DeliveryBoyQueries.updateOne(
          { _id: mongoose.Types.ObjectId(data.queryId) },
          data
        ).then((response) => {

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
        });
      } else {
        res.status(200).json({
          status: false,
          data: "invalid queryId",
        });
      }
    } else {
      res.status(200).json({
        status: false,
        data: "please enter queryId",
      });
    }
  } catch (error) {
    next(error);
  }
},
};
