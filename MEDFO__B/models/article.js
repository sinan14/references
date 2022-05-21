const mongoose = require("mongoose")
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const articleSchema = new mongoose.Schema({
    metaTitle: {
        type: String  
    },
    metaDescription: {
        type: String
    },
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
    related_articles: {
        type: Array
    },
    related_products: {
        type: Array,
        ref: 'products'
    },
    tagged_categories: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'articleCategory'
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

articleSchema.plugin(aggregatePaginate);

const Articles = mongoose.model("articles",articleSchema)
module.exports = Articles