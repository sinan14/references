const express = require("express");
const router = express.Router();
const multer = require("multer");
const customerController = require("../controllers/customerController");
const authController = require("../controllers/authController");
const { checkPopupBannerFile } = require("./middlewares/checkFile");
const pushNotificationController = require("../controllers/pushNotification/pushNotificationController");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/popup");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_${Date.now()}.jpg`);
  },
});
const upload = multer({
  storage: storage,
}).single("image");
router.get("/get_user_card_details/:id", customerController.getUserCardDetails);

router.use(authController.protect);

/* Customer Database  APIs
============================================= */
router.post("/addCustomer", upload, customerController.addCustomer);
router.post("/getCustomers", customerController.getCustomers);
router.post("/getCustomerOrders", customerController.getCustomerOrders);
router.post(
  "/getCustomerSubscription",
  customerController.getCustomerSubscription
);
router.post("/searchCustomerOrders", customerController.searchCustomerOrders);
router.post("/search-customer", customerController.searchCustomers);

router.post("/getCustomerDetails", customerController.getCustomerDetails);
router.post("/add-customer-notes", customerController.addCustomerNotes);

router.post(
  "/updateCustomerRemarks/:id",
  upload,
  customerController.updateCustomerRemarks
);
router.get("/getCustomersRemarks/:id", customerController.getRemarks);

/*Promotional Email  APIs
============================================= */
// router.post(
//   '/addPromotionalEmail',
//   upload,
//   customerController.addPromotionalEmail
// );
// router.get('/getPromotionalEmail', customerController.getPromotionalEmail);

/*Promotional SMS  APIs
============================================= */
//router.post("/addPromotionalSMS", upload, customerController.addPromotionalSMS);

/*Add Popup Banner
============================================= */
router.post(
  "/add-popup-banner",
  upload,
  checkPopupBannerFile,
  customerController.addPopupBanner
);

/*Push Notification
============================================= */
router.post(
  "/add_push_notification",
  upload,
  pushNotificationController.addPushNotification
);
router.get(
  "/get_scheduled_push_notification_byId/:id",
  pushNotificationController.getScheduledByID
);
router.post(
  "/edit_push_notification/:id",
  upload,
  pushNotificationController.editPushNotification
);
router.post(
  "/get_scheduled_push_notification",
  pushNotificationController.getScheduled
);

router.get(
  "/list_past_scheduled_push_notification",
  pushNotificationController.getPastScheduledNotification
);
router.get(
  "/list_scheduled_push_notification",
  pushNotificationController.listScheduledNotification
);

router.post("/get_user_details", customerController.getUserDetails);
router.post("/add_user_complaint", customerController.addUserComplaint);
router.get(
  "/get_user_complaints/:id",
  customerController.getCustomerComplaints
);
router.get(
  "/get_user_single_complaints/:id",
  customerController.getCustomerSingleComplaints
);
router.get(
  "/get_single_complaints/:id",
  customerController.getSingleComplaints
);
router.get(
  "/get_department_complaints/:id",
  customerController.getDepartmentComplaints
);
router.post(
  "/get_complaints_byType",
  customerController.getComplaintsByType
);
router.post(
  "/update_complaint_status/:id",
  customerController.updateUserComplaint
);

/*List Products For Order Products
============================================= */
router.post("/list_products", customerController.listProducts);
router.post("/search_products", customerController.searchProducts);

//Search Products for order management
router.post(
  "/search_dropdown_products",
  customerController.searchDropdownProducts
);

/*Get customer premium membership details
============================================= */
router.get(
  "/get_customer_premium_membeship_details/:customerId",
  customerController.getCustomerPremiumMembeshipDetails
);


/*Get customer prescrition details
============================================= */
router.post(
  "/get_all_customer_prescrition",upload,
  customerController.getAllCustomerPrescrition
);

router.post(
  "/search_all_customer_prescrition",upload,
  customerController.searchAllCustomerPrescrition
);

router.delete(
  "/delete_customer_prescrition_by_id/:id",
  customerController.deleteCustomerPrescritionById
);

router.get(
  "/get_customer_order_details/:id",
  customerController.getOrderDetails
);

module.exports = router;
