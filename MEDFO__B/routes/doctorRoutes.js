const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path'); // for getting file extension

const DoctorController = require("../controllers/doctor/doctorController");
const authController = require('../controllers/authController');

/*********** Doctor details storage *********** */
router.use("/email", express.static("public/images/doctor/email"));

let doctorStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/doctor');
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname)
        cb(null, `${file.fieldname}_${Date.now()}${ext}`);
    }
});
let doctorUpload = multer({
    storage: doctorStorage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
})

function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Only .png, .jpg and .jpeg format allowed!"));

    }
}

router.post('/add_doctor_details', doctorUpload.fields([{
    name: "aadhar",
    maxCount: 1,
},
{
    name: "voterId",
    maxCount: 1
},
{
    name: "medicalRegCertificate",
    maxCount: 1,
},
{
    name: "establishmentProof",
    maxCount: 1,
}
]), DoctorController.addDoctorDetails)

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/get_pending_doctors',DoctorController.getPendingDoctorDetails)

router.get('/get_verified_doctors',DoctorController.getVerifiedDoctorDetails)

router.post('/change_doctor_verification_status',DoctorController.changeDoctorVerificationStatus)

router.post('/change_doctor_approve_status',DoctorController.changeDoctorApproveStatus)

router.get('/get_approved_doctors',DoctorController.getApprovedDoctorDetails)

router.get('/get_rejected_doctors',DoctorController.getRejectedDoctorDetails)

router.get('/get_doctor_details_by_id/:id',DoctorController.getDoctorDetailsById)

router.post('/get_doctor_details_by_date',DoctorController.getDoctorDetailsByDate)

router.delete('/delete_doctor_details/:id',DoctorController.deleteDoctorDetails)


router.get('/get_all_doctors',DoctorController.getAllDoctorDetails)

module.exports = router;