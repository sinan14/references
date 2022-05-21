const mongoose = require("mongoose")

const articleSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: [true, "Please add heading"]
    },
    readTime: {
        type: String,
        required: [true, "Please enter read time"]      
    },
    categories: {
        type: Array,
        required: [true, "Please add atleast one category"]        
    },
    image: {
        type: String,
        required: [true, "Please add image"]        
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    related_articles: [
        mongoose.Types.ObjectId
    ],
    related_products: [
        {
            type: mongoose.Types.ObjectId,
        }
    ],
    tagged_categories: [
        {
            type: mongoose.Types.ObjectId,
            ref: "articleCategory"
        }
    ],
    reviewedBy: {
        type: String
    },
    authorName: {
        type: String,
        required: [true, "Please enter author name"]
    },
    designation: {
        type: String
    },
    trending: {
        type: Boolean,
        default: false
    },
    newest: {
        type: Boolean,
        default: false
    },
    homepageMain: {
        type: Boolean
    },
    homepageSub: {
        type: Boolean
    },
    description: {
        type: String,
        required: [true, "Please add description"]        
    },
    createdBy: {
        type: mongoose.Types.ObjectId
    },
    updatedBy: {
        type: mongoose.Types.ObjectId
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

articleSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const Articles = mongoose.model("articles",articleSchema)
module.exports = Articles