const { response } = require("express");
const mongoose = require("mongoose");
const Stores = require("../models/store");
const storeProducts = require("../models/store_products");
const Inventory = require("../models/inventory");
const masterDeliveryChargeTime = require("../models/mastersettings/deliveryChargeTime");


const checkDeatils = (store, variantId) => {
    return new Promise(async (resolve, reject) => {

        if (store.level == 0) {
            resolve({ isThisDataNeedToBeUpdated: false })
        } else {
            let result = await storeProducts.findOne({
                storeId: store._id,
                varientId: variantId,
                stock: { $gte: 1 }
            })
            if (result) {
                resolve({ isThisDataNeedToBeUpdated: true, result })
            } else {
                reject()
            }
        }

    })
}

module.exports = {
    checkPincode: async (req, res, next) => {
        try {
            let deliveryDetails
            let codStatus
            let pincodeAvialbe = false
            let variantId = req.body.variantId
            let pincode = req.body.pincode
            let product = await Inventory.findOne({ "store.pricing._id": req.params.id }).populate({ path: "policy", select: ["return"] })

            let store = await Stores.findOne({ 'serviceablePincodes.code': pincode ,isDisabled:false})
            if (store) {
                for (let item of store.serviceablePincodes) {
                    if (item.code == pincode) {
                        codStatus = item.cashOnDelivery
                        pincodeAvialbe = item.active
                    }
                }
            }
            if (store && pincodeAvialbe) {
                await checkDeatils(store, variantId).then(async ({ isThisDataNeedToBeUpdated, result: response }) => {

                    if (!isThisDataNeedToBeUpdated) {
                        if (store.level == 0) {
                            deliveryDetails = await masterDeliveryChargeTime.findOne({ level: "Same Level" })
                        } else {
                            deliveryDetails = await masterDeliveryChargeTime.findOne({ level: "Any store to main store" })
                        }
                        res.status(200).json({
                            error: false,
                            message: "Delivery Available",
                            data: {
                                pincode: pincode,
                                returnPolicy: '',
                                price: '',
                                special_price: '',
                                isThisDataNeedToBeUpdated,
                                deliveryTime: deliveryDetails.DeliveryTime,
                                cashOnDelivery: codStatus
                            },
                        });
                    } else {
                        deliveryDetails = await masterDeliveryChargeTime.findOne({ level: "Same Level" })
                        res.status(200).json({
                            error: false,
                            message: "Delivery Available",
                            data: {
                                pincode: pincode,
                                returnPolicy: product.policy.return.toString(),
                                price: response.price.toString(),
                                special_price: response.specialPrice.toString(),
                                isThisDataNeedToBeUpdated,
                                deliveryTime: deliveryDetails.DeliveryTime,
                                cashOnDelivery: codStatus
                            },
                        });
                    }
                }).catch(async (_) => {
                    let store1 = await Stores.findOne({ _id: store.parent })
                    await checkDeatils(store1, variantId).then(async ({ isThisDataNeedToBeUpdated, result: response1 }) => {
                        if (!isThisDataNeedToBeUpdated) {
                            deliveryDetails = await masterDeliveryChargeTime.findOne({ level: "Any store to main store" })
                            res.status(200).json({
                                error: false,
                                message: "Delivery Available",
                                data: {
                                    pincode: pincode,
                                    returnPolicy: '',
                                    price: '',
                                    special_price: '',
                                    isThisDataNeedToBeUpdated,
                                    deliveryTime: deliveryDetails.DeliveryTime,
                                    cashOnDelivery: codStatus
                                }
                            });
                        } else {
                            if (store.level == 3 && store1.level == 2) {

                                deliveryDetails = await masterDeliveryChargeTime.findOne({ level: "Sub sub store to sub store" })
                            } else if (store.level == 3 && store1.level == 1) {

                                deliveryDetails = await masterDeliveryChargeTime.findOne({ level: "Sub sub store to store" })
                            } else if (store.level == 2 && store1.level == 1) {

                                deliveryDetails = await masterDeliveryChargeTime.findOne({ level: "Sub store to store" })
                            }

                            return res.status(200).json({
                                error: false,
                                message: "Delivery Available",
                                data: {
                                    pincode: pincode,
                                    varientId: response1._id,
                                    price: response1.price.toString(),
                                    returnPolicy: product.policy.return.toString(),
                                    special_price: response1.specialPrice.toString(),
                                    deliveryTime: deliveryDetails.DeliveryTime,
                                    cashOnDelivery: codStatus

                                },
                            });

                        }
                    }).catch(async (_) => {
                        let store2 = await Stores.findOne({ _id: store1.parent })
                        await checkDeatils(store2, variantId).then(async ({ isThisDataNeedToBeUpdated, result: response2 }) => {
                            if (!isThisDataNeedToBeUpdated) {
                                deliveryDetails = await masterDeliveryChargeTime.findOne({ level: "Any store to main store" })

                                res.status(200).json({
                                    error: false,
                                    message: "Delivery Available",
                                    data: {
                                        pincode: pincode,
                                        returnPolicy: '',
                                        price: '',
                                        special_price: '',
                                        isThisDataNeedToBeUpdated,
                                        deliveryTime: deliveryDetails.DeliveryTime,
                                        cashOnDelivery: codStatus
                                    }
                                });
                            } else {
                                if (store.level == 3 && store2.level == 2) {
                                    deliveryDetails = await masterDeliveryChargeTime.findOne({ level: "Sub sub store to sub store" })
                                } else if (store.level == 3 && store2.level == 1) {
                                    deliveryDetails = await masterDeliveryChargeTime.findOne({ level: "Sub sub store to store" })
                                } else if (store.level == 2 && store2.level == 1) {
                                    deliveryDetails = await masterDeliveryChargeTime.findOne({ level: "Sub store to store" })
                                }
                                res.status(200).json({
                                    error: false,
                                    message: "Delivery Available",
                                    data: {
                                        pincode: pincode,
                                        varientId: response2._id,
                                        price: response2.price.toString(),
                                        returnPolicy: product.policy.return.toString(),
                                        special_price: response2.specialPrice.toString(),
                                        deliveryTime: deliveryDetails.DeliveryTime,
                                        cashOnDelivery: codStatus

                                    },
                                });
                            }
                        }).catch(async (_) => {
                            let store3 = await Stores.findOne({ _id: store2.parent })
                            await checkDeatils(store3, variantId).then(async ({ isThisDataNeedToBeUpdated, result: response3 }) => {
                                deliveryDetails = await masterDeliveryChargeTime.findOne({ level: "Any store to main store" })

                                if (!isThisDataNeedToBeUpdated) {
                                    res.status(200).json({
                                        error: false,
                                        message: "Delivery Available",
                                        data: {
                                            pincode: pincode,
                                            returnPolicy: '',
                                            price: '',
                                            special_price: '',
                                            isThisDataNeedToBeUpdated,
                                            deliveryTime: deliveryDetails.DeliveryTime,
                                            cashOnDelivery: codStatus
                                        }
                                    });
                                } else {
                                    if (store.level == 3 && store3.level == 2) {
                                        deliveryDetails = await masterDeliveryChargeTime.findOne({ level: "Sub sub store to sub store" })
                                    } else if (store.level == 3 && store3.level == 1) {
                                        deliveryDetails = await masterDeliveryChargeTime.findOne({ level: "Sub sub store to store" })
                                    } else if (store.level == 2 && store3.level == 1) {
                                        deliveryDetails = await masterDeliveryChargeTime.findOne({ level: "Sub store to store" })
                                    }
                                    res.status(200).json({
                                        error: false,
                                        message: "Delivery Available",
                                        data: {
                                            pincode: pincode,
                                            varientId: response3._id,
                                            price: response3.price.toString(),
                                            returnPolicy: product.policy.return.toString(),
                                            special_price: response3.specialPrice.toString(),
                                            deliveryTime: deliveryDetails.DeliveryTime,
                                            cashOnDelivery: codStatus

                                        },
                                    });
                                }
                            }).catch(async (_) => {
                                deliveryDetails = await masterDeliveryChargeTime.findOne({ level: "Any store to main store" })
                                res.status(200).json({
                                    error: true,
                                    message: "Delivery not Available",
                                    data: {
                                        pincode: pincode,
                                        returnPolicy: '',
                                        price: '',
                                        special_price: '',
                                        isThisDataNeedToBeUpdated: false,
                                        deliveryTime: deliveryDetails.DeliveryTime,
                                        cashOnDelivery: codStatus
                                    }
                                });
                            })

                        })
                    })
                })
                console.log(deliveryDetails);
            } else {
                res.status(200).json({
                    error: false,
                    message: "Delivery Not Available",
                    data: {
                        isThisDataNeedToBeUpdated: false,
                        pincode: pincode,
                        returnPolicy: '',
                        price: '',
                        special_price: '',
                        deliveryTime: 'Not available',
                        cashOnDelivery: false
                    },
                });
            }
        } catch (error) {

        }
    }
}