const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please fill department name"]
    },
    privilegeGroups: {
        type: Array,
        ref: "PrivilegeGroup",
        required: [true, "Please add privilege group"]
    }
})

const Department = mongoose.model("Department", departmentSchema);
module.exports = Department;