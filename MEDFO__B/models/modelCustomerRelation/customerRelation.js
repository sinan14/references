const mongoose = require("mongoose")

const customerRelationCrudSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the category name"]        
    },
    mobile: {
        type: Number,
       required: [true, "Please enter the mobile number"]   
    },
    email: {
        type: String,
        required: [true, "Please enter the Email Id"]   
    },
    address: {
        type: String,
        required: [true, "Please enter address"]   
    },
    pincode: {
        type: String,
        required: [true, "Please enter the pincode"]   
    },
    remarks: {
        type: String   
    },
    image: {
        type: String   
    },

    zone:{
        type:String,
        required: [true, "Please enter the zone"] 
    },

    total:{
        type:Number,
    },


    orderValue:{
        type:Number,
    },
    
    isDisabled: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

customerRelationCrudSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const CustomerRelationCrud = mongoose.model("customerRelationdata",customerRelationCrudSchema)
module.exports = CustomerRelationCrud