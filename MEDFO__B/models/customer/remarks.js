// const mongoose = require("mongoose")

// const customerSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Types.ObjectId,
//         required: [true, "userId missing"]
//     },
//     remarks: {
//         type: String,
//         required: [true, "Remarks missing"]
//     },
//     isDisabled: {
//         type: Boolean,
//         default: false
//     },
//     createdBy: {
//         type: mongoose.Types.ObjectId,
//     },
//     updatedBy: {
//         type: mongoose.Types.ObjectId,
//     },
//     createdAt: { type: Date, required: false },
//     updatedAt: { type: Date, required: false }
// })

// customerSchema.pre("save", function (next) {
//     now = new Date();
//     if (!this.createdAt) {
//         this.createdAt = now;
//     }
//     this.updatedAt = now.getTime();
//     next();
// });

// const Remark = mongoose.model("customerRemarks", customerSchema)
// module.exports = Remark
