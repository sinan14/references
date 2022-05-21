const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path'); // for getting file extension
const deliveryAuthController = require('../controllers/delivery/deliveryAuthController');
const DeliveryUserController = require("../controllers/delivery/deliveryUserController");

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



router.use(deliveryAuthController.protect);
router.post('/upload_profile_img', deliveryUpload.single('image'),DeliveryUserController.uploadProfileImage)
router.get('/get_delivery_boy_profile',DeliveryUserController.getDeliveryBoyProfile)
router.get('/get_delivery_boy_profile_details',DeliveryUserController.getDeliveryBoyProfileDetails)
router.post('/change_status',DeliveryUserController.changeStatus)
//new orders
router.get("/new_orders",DeliveryUserController.getPickupPendingOrders);
router.post("/new_single_order",DeliveryUserController.getPickupPendingSingleOrders);
router.post('/change_order_status',DeliveryUserController.changeOrderStatus)
//pending orders
router.get("/pending_delivery_orders",DeliveryUserController.getPendingDeliveryOrders);
router.post("/single_pending_delivery_order",DeliveryUserController.getPendingDeliverySingleOrders);
router.post('/change_pending_delivery_order_status',DeliveryUserController.changePendingOrderStatus)
//delivered orders
router.get("/delivered_orders",DeliveryUserController.getDeliveredOrders);
router.post('/date_delivered_orders',DeliveryUserController.getDateDeliveredOrders)
router.post("/single_delivered_order",DeliveryUserController.getDeliveredSingleOrders);
router.post("/search_delivered_orders",DeliveryUserController.getSearchedDeliveredOrders);
//return orders
router.get("/return_orders",DeliveryUserController.getReturnOrders);
router.post("/return_single_order",DeliveryUserController.getReturnSingleOrders);
router.post('/change_return_order_status',DeliveryUserController.changeReturnOrderStatus)
router.post('/submit_return_order_status', deliveryUpload.fields([{
    name: "product_img",
    maxCount: 1,
},
{
    name: "signature",
    maxCount: 1
}
]),DeliveryUserController.submitReturnOrderStatus)
router.post("/search_return_orders",DeliveryUserController.getSearchedReturnOrder);
router.post("/return_orders_by_type",DeliveryUserController.getReturnOrdersByType);

//transactions
router.post("/get_deliveryboy_transactions",DeliveryUserController.getDeliveryBoyTransactions);
router.post('/get_dated_deliveryboy_transactions',DeliveryUserController.getDatedDeliveryBoyTransactions)
router.post("/search_deliveryboy_transactions",DeliveryUserController.getSearchedDeliveryBoyTransactions);

//credit
router.post("/get_deliveryboy_credits",DeliveryUserController.getDeliveryCredits);
router.post('/get_dated_deliveryboy_credit',DeliveryUserController.getDatedDeliveryBoyCredits)
router.post("/search_deliveryboy_credit",DeliveryUserController.getSearchedDeliveryBoyCredits);

//emergency contact
router.get("/get_emergency_contact",DeliveryUserController.getEmergencyContact);
router.post("/edit_emergency_contact",DeliveryUserController.editEmergencyContact);
router.post("/add_emergency_contact",DeliveryUserController.addEmergencyContact);

//Bank details
router.get("/get_bank_details",DeliveryUserController.getBankDetails);
router.post("/edit_bank_details",DeliveryUserController.editBankDetails);
router.post("/add_bank_details",DeliveryUserController.addBankDetails);
//help and support
router.post("/add_query",DeliveryUserController.addQuery);

//notification
router.get("/get_deliveryBoy_notifications",DeliveryUserController.getDeliveryBoyNotifications);
router.post('/change_notification_read_status',DeliveryUserController.changeNotificationReadStatus)


//messages
router.get("/get_deliveryBoy_messages",DeliveryUserController.getDeliveryBoyMessages);
router.post('/change_read_status',DeliveryUserController.changeReadStatus)











module.exports = router;