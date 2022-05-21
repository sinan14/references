const mongoose = require("mongoose")

const foliofitTestimonialSchema = new mongoose.Schema({   
    image: {
        type: String,
        required: [true, "Image path missing"]
    },  
    testimonialType: {
        type: String,
        required: [true, "Testimonial Type required"]
    },    
    isDisabled: {
        type: Boolean,
        default: false
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

foliofitTestimonialSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const FoiofitTestimonial = mongoose.model("foliofitTestimonial",foliofitTestimonialSchema)
module.exports = FoiofitTestimonial