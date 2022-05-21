const bcrypt = require('bcryptjs')
const mongoose = require("mongoose");
// const StoresPin = require("../models/store");

var Store = require('../models/store');
const storeProducts = require('../models/store_products');
const Inventory = require("../models/inventory");

// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);

module.exports = {
    createMasterStore: async (req, res, next) => {
        try {
            let exist = await Store.findOne({ masterStore: true })

            if (!exist) {
                let data = {
                    name: 'Master',
                    masterStore: true,
                    level: 0
                }
                let schemaObj = Store(data)

                schemaObj.save().then((response) => {
                    res.status(200).json({
                        status: true,
                        message: 'Master store created successfully'
                    })
                }).catch((error) => {
                    res.status(422).json({
                        status: true,
                        message: error + ''
                    })
                })

            } else {
                res.status(422).json({
                    status: false,
                    message: 'Main store already added'
                })
            }

        } catch (error) {
            next(error)
        }
    },
    //list  Store
    listStore: async (req, res, next) => {
        try {
            let result = await Store.find({ masterStore: { $ne: true } }, {
                parent: 1,
                name: 1,
                email: 1,
                phone: 1,
                password: 1,
                isDisabled: 1
            }).lean()

            result = result.reverse()

            for (let item of result) {
                let parent = await Store.findOne({ _id: mongoose.Types.ObjectId(item.parent) })
                if (parent) {
                    item.parent = parent.name
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
    //search Store 

    findStore: async (req, res, next) => {
        try {
            let result = await Store.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {
                __v: 0,
                createdAt: 0,
                updatedAt: 0
            });

            res.status(200).json({
                status: true,
                data: result,
            });

        } catch (error) {
            next(error);
        }
    },
    //enter Store details
    addStore: async (req, res, next) => {

        try {
            let data = req.body;
            let pincodes = []
            let duplicatePincodes = []
            for (let pin of data.serviceablePincodes) {
                if (!pincodes.includes(pin.code)) {
                    duplicatePincodes.push({ code: pin.code })
                }
                pincodes.push(pin.code)
            }
            data.serviceablePincodes = duplicatePincodes
            let existingPincode = await Store.find({ 'serviceablePincodes.code': pincodes })
            if (existingPincode.length) {
                res.status(200).json({
                    status: false,
                    data: "Pincode Already Existing",
                });
            } else {
                if (req.body.parent) {
                    let parentDetails = await Store.findOne({ _id: mongoose.Types.ObjectId(req.body.parent) })
                    if (parentDetails) {
                        if (parentDetails.level == 3) {
                            return res.status(200).json({
                                status: false,
                                data: "Cannot choose this store as parent",
                            });
                        } else {
                            data.level = parentDetails.level + 1
                        }
                    } else {
                        return res.status(200).json({
                            status: false,
                            data: "Invalid Id",
                        });
                    }
                }

                let existingName = await Store.findOne({ name: req.body.name });

                if (!existingName) {
                    let existingEmail = await Store.findOne({ email: req.body.email });
                    if (!existingEmail) {
                        data.password = await bcrypt.hash(data.password, 12);
                        let schemaObj = new Store(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Store details added successfully",
                                });
                            })
                    } else {
                        res.status(200).json({
                            status: false,
                            data: "Email already exist",
                        });
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: "Store name already Existing",
                    });

                }

            }
        } catch (error) {
            next(error);
        }

    },
    //modify Store 
    editStore: async (req, res, next) => {
        try {
            let valid = await Store.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            let data = req.body;
            // console.log(valid.parent);
            let pincodes = []
            for (let pin of data.serviceablePincodes) {
                pincodes.push(pin.code)
            }
            let existingPincode = await Store.find({ _id: { $ne: req.params.id }, 'serviceablePincodes.code': pincodes })
            if (existingPincode.length) {

                res.status(200).json({
                    status: false,
                    data: 'Pincode Already Existing'
                })
            } else {
                if (valid.parent != data.parent) {
                    if (req.body.parent) {
                        let parentDetails = await Store.findOne({ _id: mongoose.Types.ObjectId(req.body.parent) })
                        if (parentDetails) {
                            if (parentDetails.level == 3) {
                                return res.status(200).json({
                                    status: false,
                                    data: "Cannot choose this store as parent",
                                });
                            } else {
                                data.level = parentDetails.level + 1
                            }
                        } else {
                            return res.status(200).json({
                                status: false,
                                data: "Invalid Id",
                            });
                        }
                    }
                }

                if (valid) {
                    let existingName = await Store.findOne({ _id: { $ne: req.params.id }, name: req.body.name });

                    if (!existingName) {
                        let existingEmail = await Store.findOne({ _id: { $ne: req.params.id }, email: req.body.email });
                        if (!existingEmail) {
                            if (valid.password == data.password) {
                            } else {
                                data.password = await bcrypt.hash(data.password, 12);
                            }

                            for (let itm of data.serviceablePincodes) {
                                for (let dta of valid.serviceablePincodes) {
                                    if (itm.code == dta.code) {
                                        itm.active = dta.active
                                        itm.cashOnDelivery = dta.cashOnDelivery
                                    }
                                }
                            }

                            // pincode array case
                            data.serviceablePincodes.forEach((item, index) => {
                                let obj = valid.serviceablePincodes.find(i => i.code+"" == item.code);
                                if (obj) {
                                    item._id = obj._id
                                }
                            })

                            Store.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) },
                                data
                            ).then((response) => {
                                if (response.nModified == 1) {
                                    let date = new Date()
                                    Store.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {
                                        updatedAt: date
                                    }).then((response) => {
                                        res.status(200).json({
                                            status: true,
                                            data: 'Updated'
                                        })
                                    })
                                } else {
                                    res.status(200).json({
                                        status: false,
                                        data: 'no changes'
                                    })
                                }
                            })

                        } else {
                            res.status(200).json({
                                status: false,
                                data: "Email already Existing",
                            });
                        }

                    } else {
                        res.status(200).json({
                            status: false,
                            data: "Store name already Existing",
                        });
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: 'invalid Store ID'
                    })
                }
            }


        } catch (error) {
            next(error)
        }
    },
    //Store Activate Deactivate
    deactivateStore: async (req, res, next) => {
        try {
            let valid = await Store.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            let data = req.body;
            if (valid) {
                let status
                if (valid.isDisabled) {
                    status = false
                } else {
                    status = true
                }

                if (status) {
                    Store.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, {
                        $set: {
                            isDisabled: status
                        }
                    }, { new: true }).then(async (response) => {
                        console.log('level 1 =====', response)
                        if (response) {
                            Store.updateMany({ parent: response._id }, {
                                $set: { isDisabled: status }
                            }, { new: true }).then(async (_) => {
                                let stores = await Store.find({ parent: response._id, masterStore: { $ne: true } })
                                console.log('level 2 =====', stores)
                                if (stores.length) {
                                    for (let item of stores) {
                                        await Store.findOneAndUpdate({ parent: item._id }, {
                                            $set: {
                                                isDisabled: status
                                            }
                                        }, { new: true }).then((r) => {
                                            console.log('level 3====', r)
                                        })
                                    }
                                    res.status(200).json({
                                        status: true,
                                        data: 'Updated'
                                    })
                                } else {
                                    res.status(200).json({
                                        status: true,
                                        data: 'Updated'
                                    })
                                }
                            })
                        } else {
                            res.status(200).json({
                                status: true,
                                data: 'Updated'
                            })
                        }
                    })


                    // Store.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {
                    //     $set: {
                    //         isDisabled: status
                    //     }
                    // }).then(async (_) => {
                    //     let store = await Store.findOne({parent: valid._id});
                    //     if (store) {
                    //         Store.updateOne({ _id: mongoose.Types.ObjectId(store._id) }, {
                    //             $set: {
                    //                 isDisabled: status
                    //             }
                    //         }).then(async (_) => {
                    //             let store1 = await Store.findOne({parent: store._id});
                    //             log
                    //             if (store1) {
                    //                 Store.updateOne({ _id: mongoose.Types.ObjectId(store1._id) }, {
                    //                     $set: {
                    //                         isDisabled: status
                    //                     }
                    //                 }).then(async (_) => {
                    //                     res.status(200).json({
                    //                         status: true,
                    //                         data: 'Updated'
                    //                     })
                    //                 })
                    //             } else {
                    //                 res.status(200).json({
                    //                     status: true,
                    //                     data: 'Updated'
                    //                 })
                    //             }
                    //         })
                    //     } else {
                    //         res.status(200).json({
                    //             status: true,
                    //             data: 'Updated'
                    //         })
                    //     }

                    // })
                } else {
                    let store = await Store.findOne({ _id: mongoose.Types.ObjectId(valid.parent), masterStore: { $ne: true } });
                    if (store) {
                        if (store.isDisabled) {
                            res.status(200).json({
                                status: false,
                                data: 'Parent store is Disabled'
                            })
                        } else {
                            Store.updateOne({ _id: mongoose.Types.ObjectId(valid._id) }, {
                                $set: {
                                    isDisabled: status
                                }
                            }).then(async (_) => {
                                res.status(200).json({
                                    status: true,
                                    data: 'Updated'
                                })
                            })
                        }
                    } else {
                        Store.updateOne({ _id: mongoose.Types.ObjectId(valid._id) }, {
                            $set: {
                                isDisabled: status
                            }
                        }).then(async (_) => {
                            res.status(200).json({
                                status: true,
                                data: 'Updated'
                            })
                        })
                    }
                }

            } else {
                res.status(200).json({
                    status: false,
                    data: 'invalid Store ID'
                })
            }


        } catch (error) {
            next(error)
        }
    },
    //delete store
    deleteStore: async (req, res, next) => {
        try {
            Store.deleteOne({ _id: req.params.id }).then(() => {
                res.status(200).json({
                    status: true,
                    data: 'Store Deleted'
                })
            })

        } catch (error) {
            next(error)
        }
    },
    getPincodes: async (req, res, next) => {
        try {
            let count = 0
            let result = await Store.findOne({ _id: req.params.id }, {
                serviceablePincodes: 1
            }).lean()
            for (let item of result.serviceablePincodes) {
                count++
                item.sl = count
            }
            res.status(200).json({
                status: true,
                data: result
            })

        } catch (error) {
            next(error)
        }
    },
    editStorePin: async (req, res, next) => {
        try {
            let existingStatus = false
            let valid = await Store.findOne({ 'serviceablePincodes._id': req.params.id });
            if (valid) {
                let existing = await Store.findOne({ _id: { $ne: valid._id }, 'serviceablePincodes.code': req.body.code });
                if (!existing) {
                    for (let item of valid.serviceablePincodes) {
                        if (item.code == req.body.code && item.cashOnDelivery == req.body.status) {
                            console.log('hi')
                            existingStatus = true
                        }
                    }
                    if (existingStatus) {
                        res.status(200).json({
                            status: false,
                            data: 'Pincode Already Existing'
                        })
                    } else {
                        Store.updateOne({ 'serviceablePincodes._id': req.params.id }, { $set: { "serviceablePincodes.$.code": req.body.code, "serviceablePincodes.$.cashOnDelivery": req.body.status } }).then((response) => {
                            let date = new Date()
                            Store.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {
                                updatedAt: date
                            }).then((_) => {
                                res.status(200).json({
                                    status: true,
                                    data: 'Updated'
                                })
                            })
                        })
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: 'Pincode Already Existing'
                    })
                }

            } else {
                res.status(422).json({
                    status: false,
                    data: 'Invalid Id'
                })
            }
        } catch (error) {
            next(error)
        }
    },
    deletePin: async (req, res, next) => {
        try {
            Store.updateOne({ 'serviceablePincodes._id': req.params.id }, { $pull: { "serviceablePincodes": { "_id": req.params.id } } }).then((response) => {
                if (response.nModified == 1) {
                    let date = new Date()
                    Store.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {
                        updatedAt: date
                    }).then((_) => {
                        res.status(200).json({
                            status: true,
                            data: 'Deleted'
                        })
                    })
                } else {
                    res.status(422).json({
                        status: false,
                        data: 'no changes'
                    })
                }
            })
        } catch (error) {
            next(error)
        }
    },
    addStorePin: async (req, res, next) => {
        try {
            let valid = await Store.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            if (valid) {
                let existing = await Store.findOne({ 'serviceablePincodes.code': req.body.code });
                if (!existing) {
                    const obj = {
                        active: true,
                        code: req.body.code,
                        cashOnDelivery: req.body.status

                    }
                    Store.updateOne({ _id: req.params.id }, { $push: { "serviceablePincodes": obj } }).then((_) => {
                        let date = new Date()
                        Store.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {
                            updatedAt: date
                        }).then((_) => {
                            res.status(200).json({
                                status: true,
                                data: 'Added'
                            })
                        })
                    })

                } else {
                    res.status(200).json({
                        status: false,
                        data: 'Pincode Already Existing'
                    })
                }
            } else {
                res.status(422).json({
                    status: false,
                    data: 'Invalid Id'
                })
            }
        } catch (error) {
            next(error)
        }
    },
    activateOrDeactivatePin: async (req, res, next) => {
        try {
            let valid = await Store.findOne({ 'serviceablePincodes._id': req.params.id })
            if (valid) {
                Store.updateOne({ 'serviceablePincodes._id': req.params.id }, { $set: { "serviceablePincodes.$.active": req.body.status } }).then((response) => {
                    if (response.nModified == 1) {
                        let date = new Date()
                        Store.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {
                            updatedAt: date
                        }).then((_) => {
                            res.status(200).json({
                                status: true,
                                data: 'Updated'
                            })
                        })
                    } else {
                        res.status(422).json({
                            status: false,
                            data: 'no changes'
                        })
                    }
                })
            } else {
                res.status(422).json({
                    status: false,
                    data: 'Invalid Id'
                })
            }
        } catch (error) {
            next(error)
        }
    },
    storeStockUpdation: async (req, res, next) => {

        try {
            let validStore = await Store.findOne({ _id: req.user._id })

            if (validStore) {
                if (req.body.id) {
                    let validProduct = await Inventory.findOne({ "pricing._id": req.body.id })
                    console.log('validProducttttt:', validProduct)

                    if (!validProduct) {
                        return res.status(422).json({
                            status: false,
                            data: 'Invalid Id'
                        })
                    }

                    let exists = await storeProducts.findOne({
                        storeId: mongoose.Types.ObjectId(req.user._id),
                        varientId: mongoose.Types.ObjectId(req.body.id)
                    })

                    if (!exists) {
                        let data = {
                            storeId: req.user._id,
                            productId: validProduct._id,
                            varientId: req.body.id,
                            stock: req.body.stock,
                            price: req.body.price,
                            specialPrice: req.body.specialPrice,
                            skuOrHsnNo: req.body.skuOrHsnNo,
                            type: req.body.type
                        }

                        if (req.body.type == 'medicine') {
                            if (!req.body.expiryDate) {
                                return res.status(422).json({
                                    status: false,
                                    message: 'Expiry date missing'
                                })
                            }
                            data.expiryDate = req.body.expiryDate
                        }

                        let schemaObj = storeProducts(data)
                        schemaObj.save().then((response) => {
                            return res.status(200).json({
                                status: true,
                                message: 'Stock updated'
                            })
                        })
                    } else {
                        let data = {
                            storeId: req.user._id,
                            productId: validProduct._id,
                            varientId: req.body.id,
                            stock: req.body.stock,
                            price: req.body.price,
                            specialPrice: req.body.specialPrice,
                            skuOrHsnNo: req.body.skuOrHsnNo,
                            type: req.body.type
                        }

                        if (req.body.type == 'medicine') {
                            if (!req.body.expiryDate) {
                                return res.status(422).json({
                                    status: false,
                                    message: 'Expiry date missing'
                                })
                            }
                            data.expiryDate = req.body.expiryDate
                        }

                        storeProducts.updateOne({ storeId: mongoose.Types.ObjectId(req.user._id), varientId: mongoose.Types.ObjectId(req.body.id) }, data).then((response) => {
                            return res.status(200).json({
                                status: true,
                                message: 'Stock updated'
                            })
                        })
                    }

                } else {
                    res.status(422).json({
                        status: false,
                        data: 'Id missing'
                    })
                }
            } else {
                res.status(422).json({
                    status: false,
                    message: 'You are not permitted to this action'
                })
            }

        } catch (error) {
            next(error)
        }
    },
    dropdownlistStores: async (req, res, next) => {
        try {
            let allStores = await Store.find({ level: { $ne: 3 } }, {
                name: 1
            })

            res.status(200).json({
                status: false,
                message: 'success',
                data: allStores
            })

        } catch (error) {
            next(error)
        }
    },
    // Master Pincode
    getMasterPincodes: async (req, res, next) => {
        try {
            let count = 0
            let result = await Store.findOne({ masterStore: true }, {
                serviceablePincodes: 1
            }).lean()
            for (let item of result.serviceablePincodes) {
                count++
                item.sl = count
            }
            res.status(200).json({
                status: true,
                data: result
            })

        } catch (error) {
            next(error)
        }
    },
    addMasterStorePin: async (req, res, next) => {
        try {
            let valid = await Store.findOne({ masterStore: true });
            if (valid) {
                let existing = await Store.findOne({ 'serviceablePincodes.code': req.body.code });
                if (!existing) {
                    const obj = {
                        active: true,
                        code: req.body.code,
                        cashOnDelivery: req.body.status

                    }
                    Store.updateOne({ masterStore: true }, { $push: { "serviceablePincodes": obj } }).then((_) => {
                        let date = new Date()
                        Store.updateOne({ masterStore: true }, {
                            updatedAt: date
                        }).then((_) => {
                            res.status(200).json({
                                status: true,
                                data: 'Pincode Added'
                            })
                        })
                    })

                } else {
                    res.status(200).json({
                        status: false,
                        data: 'Pincode Already Existing'
                    })
                }
            } else {
                res.status(422).json({
                    status: false,
                    data: 'Please Add Admin'
                })
            }
        } catch (error) {
            next(error)
        }
    },
    activateOrDeactivateCodPin: async (req, res, next) => {
        try {
            let valid = await Store.findOne({ 'serviceablePincodes._id': req.params.id })
            if (valid) {
                Store.updateOne({ 'serviceablePincodes._id': req.params.id }, { $set: { "serviceablePincodes.$.cashOnDelivery": req.body.status } }).then((response) => {
                    if (response.nModified == 1) {
                        let date = new Date()
                        Store.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {
                            updatedAt: date
                        }).then((_) => {
                            res.status(200).json({
                                status: true,
                                data: 'Updated'
                            })
                        })
                    } else {
                        res.status(422).json({
                            status: false,
                            data: 'no changes'
                        })
                    }
                })
            } else {
                res.status(422).json({
                    status: false,
                    data: 'Invalid Id'
                })
            }
        } catch (error) {
            next(error)
        }
    },

};