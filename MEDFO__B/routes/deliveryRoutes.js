const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path'); // for getting file extension

const DeliveryController = require("../controllers/delivery/deliveryController");
const authController = require('../controllers/authController');

/*********** Delivery storage *********** */

let deliveryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/delivery');
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname)
        cb(null, `${file.fieldname}_${Date.now()}${ext}`);
    }
});
let deliveryUpload = multer({
    storage: deliveryStorage,
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


router.post('/add_delivery_boys', deliveryUpload.fields([{
    name: "licence",
    maxCount: 1,
},
{
    name: "aadhar",
    maxCount: 1
},
{
    name: "rcBook",
    maxCount: 1,
}
]), DeliveryController.addDeliveryBoys)
router.post('/delivery_boys_signin',DeliveryController.deliveryBoysSignin)

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/get_active_delivery_boys',DeliveryController.getActiveDeliveryBoys)
router.get('/get_pending_delivery_boys',DeliveryController.getPendingDeliveryBoys)
router.post('/change_delivery_boy_approve_status',DeliveryController.changeDeliveryBoyApproveStatus)
router.get('/get_approved_delivery_boys',DeliveryController.getApprovedDeliveryBoys)
router.get('/get_delivery_boy_details_by_id/:id',DeliveryController.getDeliveryBoyDetailsById)
router.get('/change_delivery_boy_active_status/:id',DeliveryController.changeDeliveryBoyActiveStatus)

// get active store for delivery boys edit
router.get('/get_active_store',DeliveryController.getActiveStore)
router.post('/get_active_pincode_by_store', deliveryUpload.single('image'),DeliveryController.getActivePincodeByStore)

router.post('/edit_delivery_boys', deliveryUpload.fields([{
    name: "licence",
    maxCount: 1,
},
{
    name: "aadhar",
    maxCount: 1
},
{
    name: "rcBook",
    maxCount: 1,
}
]), DeliveryController.editDeliveryBoys)

//pending to admin
router.get('/get_pending_paid_to_admin_delivery_boys',DeliveryController.getPendingToAdminDeliveryBoys)
router.post('/change_pending_paid_to_admin_delivery_boy_status',DeliveryController.changePendingToAdminDeliveryStatus)
router.post('/get_date_pending_paid_to_admin_delivery_boys',DeliveryController.getDatePendingToAdminDeliveryBoys)
router.post('/get_date_pending_paid_to_admin_delivery_boy',DeliveryController.getDatePendingToAdminDeliveryBoy)
router.get('/get_delivery_boy_pending_paid_to_admin/:id',DeliveryController.getDelveryBoyPendingToAdminDeliveryBoys)

//paid to admin
router.post('/get_paid_to_admin_delivery_boys',DeliveryController.getPaidToAdminDeliveryBoys)
router.post('/get_date_paid_to_admin_delivery_boys',DeliveryController.getDatePaidToAdminDeliveryBoys)
router.post('/get_date_paid_to_admin_delivery_boy',DeliveryController.getDatePaidToAdminDeliveryBoy)
router.post('/get_search_paid_to_admin_delivery_boy',DeliveryController.getSearchPaidToAdminDeliveryBoy)
router.post('/get_delivery_boy_paid_to_admin/:id',DeliveryController.getDelveryBoyPaidToAdminDeliveryBoys)

//payable to delivery boy
router.get('/get_pending_paid_to_delivery_boys',DeliveryController.getPendingToDeliveryBoys)
router.post('/get_date_pending_paid_to_delivery_boys',DeliveryController.getDatePendingToDeliveryBoys)
router.post('/get_date_pending_paid_to_delivery_boy',DeliveryController.getDatePendingToDeliveryBoy)
router.get('/get_delivery_boy_pending_paid/:id',DeliveryController.getDelveryBoyPendingToDeliveryBoys)
router.post('/change_delivery_boy_pending_paid_status',DeliveryController.changePendingPaidStatus)


//paid to delivery boy
router.post('/get_paid_to_delivery_boys',DeliveryController.getPaidToDeliveryBoys)
router.post('/get_searched_paid_to_delivery_boys',DeliveryController.getSearchedPaidToDeliveryBoys)
router.post('/get_date_paid_to_delivery_boys',DeliveryController.getDatePaidToDeliveryBoys)
router.post('/get_date_paid_to_delivery_boy',DeliveryController.getDatePaidToDeliveryBoy)
router.post('/get_delivery_boy_paid/:id',DeliveryController.getDelveryBoyPaidToDeliveryBoys)

//delivery boy  query
router.post('/get_dated_delivery_queries',DeliveryController.getDatedQueries)
router.post('/get_dated_delivery_boy_queries',DeliveryController.getDatedQueriesDeliveryBoy)
router.delete('/delete_delivery_queries/:id',DeliveryController.deleteQueriesDeliveryBoy)
router.post('/reply_delivery_boy_queries',DeliveryController.replyToQueriesDeliveryBoy)



module.exports = router;