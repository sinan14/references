const mongoose = require("mongoose")


const doctorSchema = new mongoose.Schema({
    doctorId: {
        type:String
    },
    name: {
        type:String,
        required: [true, "Please enter name"],
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "Please enter email"]
    },
    mobile: {
        type: String,
        required: [true, "Please enter mobile number"]
    },
    alternativeNumber: {
        type: String
    },
    landNumber: {
        type: String
    },
    residentialAddress: {
        type: String,
        required: [true, "Please enter residential address"]
    },
    registrationNumber: {
        type: String,
        required: [true, "Please enter registration number"]
    },
    registeredCouncil: {
        type: String,
        required: [true, "Please enter registered council"]
    },
    registeredYear: {
        type: String,
        required: [true, "Please enter registered year"]
    },
    qualification: [{
        degree: {
            type: String,
            required: [true, "Please enter your degree"]
        },
        college: {
            type: String,
            required: [true, "Please enter your college"]
        },
        completionYear: {
            type: String,
            required: [true, "Please enter year of completion"]
        },
        experience: {
            type: String,
            required: [true, "Please enter year of experience"]
        },
        _id: false
    }],

    establishmentName: {
        type: String
    },
    establishmentCity: {
        type: String
    },
    establishmentLocality: {
        type: String
    },
    workingFrom: {
        type: String
    },
    experienceYear: {
        type: String
    },
    aadhar: {
        type: String,
        required: [true, "Please enter aadhar or driving licence"]
    },    
    voterId: {
        type: String
    },
    medicalRegCertificate: {
        type: String,
        required: [true, "Please enter medical registration certificate"]
    },
    establishmentProof: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: String,
        default: "pending"
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

doctorSchema.pre("save", function(next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});


const Doctors = mongoose.model("doctors", doctorSchema)
module.exports = Doctors