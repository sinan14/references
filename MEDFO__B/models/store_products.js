const mongoose = require('mongoose')

const storeProductsSchema = mongoose.Schema({
    storeId: {
        type: mongoose.Types.ObjectId,
        required: [true, "storeId missing"],
        ref: 'store'
    },
    productId: {
        type: mongoose.Types.ObjectId,
        required: [true, "productId missing"],
        ref: 'products'
    },
    varientId: {
        type: mongoose.Types.ObjectId,
        required: [true, "varientId missing"]
    },
    stock: {
        type: Number,
        required: [true, "stock missing"]
    },
    price: {
        type: Number,
        required: [true, "price missing"]
    },
    specialPrice: {
        type: Number,
        required: [true, "specialPrice missing"]
    },
    skuOrHsnNo: {
        type: String,
        required: [true, "skuOrHsnNo missing"]
    },
    expiryDate: {
        type: String
    },
    type: {
        type: String,
        required: [true, "type missing"]
    }
})

const storeProducts = mongoose.model('storeProduct', storeProductsSchema)
module.exports = storeProducts