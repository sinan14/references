const mongoose = require('mongoose')

const privilegeGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add privilege group name"]
    },
    subPrivileges: [{
        name: {
            type: String,
            required: [true, "please add name to the sub privilege"]
        },
        subOfSub: [{
            name: {
                type: String,
                required: false
            }
        }]
    }]
})

const PrivilegeGroup = mongoose.model("PrivilegeGroup", privilegeGroupSchema)
module.exports = PrivilegeGroup