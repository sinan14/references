const mongoose = require('mongoose')

const employeeTypesSchema = mongoose.Schema({
    type: {
        type: String,
        required: [true, "Type name missing"]
    }
})

const EmployeeTypes = mongoose.model("EmployeeTypes",employeeTypesSchema)

module.exports = EmployeeTypes