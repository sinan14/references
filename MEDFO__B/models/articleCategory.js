const mongoose = require("mongoose")

const articleCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the category name"]        
    },
    parent: {
        type: String,
        required: [true, "Please enter the parent category"],
        ref: ''
    },    
    image: {
        type: String,
        required: [true, "Image path missing"]
    },
    homepage: {
        type: Boolean
    },
    isDisabled: {
        type: Boolean,
        default: false
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

articleCategorySchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const ArticleCategory = mongoose.model("articleCategory",articleCategorySchema)
module.exports = ArticleCategory