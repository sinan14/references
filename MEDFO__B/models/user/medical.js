const mongoose = require("mongoose");

const userMedicalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true,"userId missing"]
    },
    currentMed: {
        type: String
    },
    currentMedDetails: {
        type: String
    },
    allergies: {
        type: String
    },
    allergyDetails: {
        type: String
    },
    pastMed: {
        type: String
    },
    pastMedDetails: {
        type: String
    },
    chronicDisease: {
        type: String
    },
    chronicDiseaseDetails: {
        type: String
    },
    injuries: {
        type: String
    },
    injuryDetails: {
        type: String
    },
    surgeries: {
        type: String
    },
    surgeryDetails: {
        type: String
    }, 
   
    isDisabled: {
        type: Boolean,
        default:false
    },  
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }

});
userMedicalSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const UserMedical = mongoose.model("userMedical", userMedicalSchema);
module.exports = UserMedical;

