const express = require("express");
const router = express.Router();
const multer = require("multer");

const healthcareController = require("../controllers/healthCareController");
const authController = require("./../controllers/authController");
const path = require('path');
const fs = require("fs");

const sizeOf = require("image-size");



let storageMaster = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public/images/healthcare");
    },
    filename: function(req, file, cb) {
        var path = require('path');

        var ext = path.extname(file.originalname);

        cb(null, `${file.fieldname}_${Date.now()}${ext}`);
    },
});
let uploadMultipleMaster = multer({ storage: storageMaster });

router.use("/", express.static("public/images/healthcare"));

// router.use(authController.protect);

router.post(
    "/addHealthCareVideo",
    uploadMultipleMaster.fields([{
            name: "video",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    healthcareController.addHealthCareVideo
);
router.get("/getHealthCareVideo", healthcareController.getHealthCareVideo);
router.put(
    "/editHealthCareVideo/:id",
    uploadMultipleMaster.fields([{
            name: "video",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    healthcareController.editHealthCareVideo
);
router.delete("/delete_HealthCareVideo/:id", healthcareController.deleteHealthCareVideo);
//router.get("/get_HealthCareVideo_ByType/:Type", healthcareController.getHealthCareVideoByType);
router.get("/get_HealthCareVideo_ByType/:Type", healthcareController.getHealthCareVideoByType);
router.get("/get_Paginated_HealthCareVideo", healthcareController.getPaginatedHealthCareVideo);

module.exports = router;