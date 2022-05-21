const foliofitRating = require('../models/foliofitRating')
const DietDay = require("../models/dietDay");
const mongoose = require('mongoose')

let validTypes = [
    {type:'dietday', collection: DietDay}
]

let validMainTypes = ['dietRegime','yoga','fitness']

function collectionFinder (inputType) {
    const found = validTypes.find( ({ type }) => type == inputType );

    if(found) {
        return found.collection
    } else {
        return false
    }
}

module.exports = {
    addRating: async (req, res, next) => {
        try {
            if(req.body.type && req.body.rating) {

                if(validMainTypes.includes(req.body.type)) {

                    let existing = await foliofitRating.findOne({
                        userId: mongoose.Types.ObjectId(req.user._id),
                        type: req.body.type
                    })

                    if(!existing) {
                            let data = {
                                type: req.body.type,
                                rating: req.body.rating,
                                userId: req.user._id
                            }
        
                            let schemaObj = foliofitRating(data)
        
                            schemaObj.save().then((response) => {
                                res.status(200).json({
                                    error: false,
                                    message: 'Your rating added successfully'
                                })
                            }).catch((error) => {
                                res.status(200).json({
                                    error: true,
                                    message: error+''
                                })
                            })
                        
                    } else {
        
                        foliofitRating.updateOne({
                            userId: mongoose.Types.ObjectId(req.user._id),
                            type: req.body.type
                        },{
                            $set: {
                                rating: req.body.rating
                            }
                        }).then((response) => {
                            res.status(200).json({
                                error: false,
                                message: 'Your rating updated successfully'
                            })
                        }).catch((error) => {
                            res.status(200).json({
                                error: true,
                                message: error+''
                            })
                        })
                    }
                    
                } else {
                    res.status(200).json({
                        error: true,
                        message: 'Invalid type'
                    })
                }
                 
            } else {
                res.status(200).json({
                    error: true,
                    message: 'Required params missing'
                })
            }
        } catch (error) {
            next(error)
        }
    },
    getRating: async(req, res, next) => {
        try {
            if(req.body.type) {

                if(validMainTypes.includes(req.body.type)) {
                    
                        let rating = await foliofitRating.findOne({
                            userId: mongoose.Types.ObjectId(req.user._id),
                            type: req.body.type
                        })

                        res.status(200).json({
                            error: false,
                            message: 'success',
                            data: {
                                rating: rating.rating
                            }
                        })

                } else {
                    res.status(200).json({
                        error: true,
                        message: 'Invalid type',
                        data: {}
                    })
                }
            } else {
                res.status(200).json({
                    error: true,
                    message: 'Type missing',
                    data: {}
                })
            }
        } catch (error) {
            next(error)
        }
    }
}