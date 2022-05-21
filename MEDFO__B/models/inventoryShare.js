const mongoose = require('mongoose')

const inventoryShareSchema = mongoose.Schema({
   
        productId: {
            type: mongoose.Types.ObjectId,
            required: [true,"Product id is missing"]
        },
        userId: {
            type: [mongoose.Types.ObjectId],
        
        },
        shareCount: {
            type: Number       
        },
        isDisabled: {
            type: Boolean,
            default:false
        }
    },
    {
        timestamps: true,
    }
)

const InventoryShares = mongoose.model("inventoryShares",inventoryShareSchema)
module.exports = InventoryShares