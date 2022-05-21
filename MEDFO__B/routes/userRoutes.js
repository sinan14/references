const express = require("express");
const router = express.Router();
const multer = require("multer");
const https = require("https");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_${Date.now()}.jpg`);
  },
});

let upload = multer({ storage: storage });

const storageUser = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/user");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_${Date.now()}.jpg`);
  },
});

const passport = require("passport");
const passportConfig = require("../helpers/passport/passport");

//setup configuration for facebook login

// const uploadUser = multer({
//   storage: storageUser
// });
const uploadUser = multer({ storage: storageUser });

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const articleController = require("../controllers/articleController");
const likeSaveController = require("../controllers/likeSaveController");
const quizController = require("../controllers/quizController");
const shareSaveController = require("../controllers/shareController");
const healthExpertController = require("../controllers/healthExpertController");
const healthcareController = require("../controllers/healthCareController");
const healthTipsController = require("../controllers/healthTipController");
const healthCareController = require("../controllers/healthCareController");

const dietController = require("../controllers/dietController");
const ratingController = require("../controllers/ratingController");
const mainHomeController = require("../controllers/mainhomeController");
const medimalHomeController = require("../controllers/medimalhomeController");
const CartController = require("../controllers/cart/cartController");

const userDetailsController = require("../controllers/userDetailsController");
const userProductController = require("../controllers/userProductController");

const webController = require("../controllers/web/webController");
const pincodeController = require("../controllers/pincodeController");

const medprideController = require("../controllers/medprideMembership/medprideController");
const couponController = require("../controllers/coupon/couponController");

const referralController = require("../controllers/referralController");
const {
  getOrderInvoiceByOrderId,
} = require("../controllers/orders/orderManagaementController");
const {
  getMedCoinDetailsByUser,
} = require("../controllers/medcoin/medCoinController");

const {
  placeOrder,
  verifyRazorPayPayment,
} = require("../controllers/purchase/purchaseController");
const {
  purchaseMembership,
  verifySubscriptionPaymentRazorPay,
  getUserMembershipBenefits,
} = require("../controllers/membership/membershipController");

const returnOrderController = require('../controllers/returnOrderController')
const appleSiginController = require('../controllers/appleSigninController')

router.post("/verify_number", userController.phoneVerification);
router.post("/verify_OTP", userController.verifyOTP);
router.post("/signin", userController.signin);
router.post("/signin_otp", userController.signinWithOtp);
router.post("/forgot_password_otp", userController.forgotSendOtp);
router.post("/reset_password", userController.resetPassword);
router.use("/medfeed", express.static("public/images"));

router.post("/verify_number", userController.phoneVerification);
router.post("/verify_OTP", userController.verifyOTP);
router.post("/signin", userController.signin);
router.post("/signin_otp", userController.signinWithOtp);
router.post("/forgot_password_otp", userController.forgotSendOtp);
router.post("/reset_password", userController.resetPassword);
router.use("/medfeed", express.static("public/images"));

//Social Login
router.post("/signin-with-google", userController.signinWithGoogle);
passportConfig();

router.post(
  "/signin-with-facebook",
  passport.authenticate("facebook", { session: false }),
  userController.signinWithFacebook
);

router.post("/sigin-with-apple", appleSiginController.signinWithApple);

//************************** Web home page **************************\\

router.post(
  "/get_web_product_by_brand_id",
  webController.getWebProductByBrandId
);

//************************** Inventory Listing By Category For Web **************************\\
router.get("/get_web_categories", userController.getWebCategoriess);
router.post("/get_web_subcategories", userController.getWebSubCategoriess);
router.post("/get_web_products", userController.getWebProductListBySubcatgory);
router.post(
  "/sort_products",
  uploadUser.single("image"),
  userController.sortProductDetails
);

//************************** Search **************************\\

router.post("/search_inventory", userController.searchInventory);
router.post("/search_inventory_suggestion", userController.getSearchSuggestion);
router.post("/add_most_searched_product", userController.addSearchedProduct);

//cart info for guest user

router.get("/get_cart_info", CartController.getCartInfo);

// $$$$ temporary api for delete a user ( need to remove after after development)
router.get("/delete_user/:mobile", userController.deleteUser);

// Protect all routes after this middleware
router.use(authController.userProtect);

//Social Login
router.post(
  "/social-account-update-number",
  userController.updateNumberForSocialAcoount
);

router.post(
  "/social-account-verify-otp",
  userController.verifyOtpForSocialAccount
);

//************************** web home **************************\\
router.get("/get_web_home_page", webController.getWebHomePage);
router.post("/get_web_product_details", webController.getWebProductDetails);

router.post("/update_profile", userController.update_profile);

//medfeed
router.get("/get_medfeed_home", userController.medfeedHome);
router.get(
  "/get_article_categories",
  adminController.viewMainArticleCategoriesAndArticles
);
router.post(
  "/get_article_listing",
  articleController.viewSubCategoriesWithArticles
);
// router.get('/get_article_listing/:id', articleController.viewArticleSubCategories)
router.post(
  "/viewArticlesBySubCategory",
  articleController.viewArticlesBySubcategory
);
router.post("/get_article_detail", articleController.viewArticle);
router.post("/like_unlike", likeSaveController.changeLike);
router.post("/save_remove", likeSaveController.changeSave);
router.post("/searchArticle", articleController.searchArticle);
router.get("/get_medfeed_bookmark", likeSaveController.getMedfeedSavedList);
router.get("/get_medfeed_saved", likeSaveController.getMedfeedSavedList);
router.get(
  "/get_healthTip_categories",
  adminController.getAllHealthTipCategories
);
router.post("/read", likeSaveController.read);

// Healthcare videos
router.get(
  "/get_healthvideo_categories",
  userController.getHealthCareVideoCategories
);
router.post(
  "/get_healthcare_videos",
  healthcareController.get_healthcare_videos
);
router.get(
  "/viewHealthcareMainCategories",
  adminController.viewHealthCareVideoMainCategories
);
router.get(
  "/viewHealthCareVideoSubCategories",
  adminController.viewHealthCareVideoSubCategories
);
router.post(
  "/searchHealthCareVideo",
  healthCareController.userSearchHealthcareVideo
);

//Quiz APIs
router.get("/getMedcoinCount", userController.getMedcoinCount);
router.post("/get_quiz_detail", quizController.getQuizDetail);
router.post("/submit_quiz", quizController.submitQuiz);
router.get("/get_quiz_winners", quizController.getQuizWinnerBanners);
// router.post('/viewQuiz', quizController.findQuiz)

//HEALTH TIPS
router.post("/get_health_tips", healthTipsController.get_health_tips);
router.post("/search_health_tips", healthTipsController.searchHealthTips);

//DietRegime APIs
router.get("/diet_listing");
router.get("/diet_days_listing");
router.get("/day_detail");
//share
router.post("/share", shareSaveController.changeShare);
router.get("/get_share_count/:id", shareSaveController.getShareCount);
/*=================================================================================
 HEALTH EXPERT ADVICE
=====================================================================================*/
router.get("/get_expert_advice", userController.getExpertAdviceWithBanner);
router.get(
  "/get_expert_category",
  adminController.getAllHealthExpertCategories
);
router.get(
  "/get_my_questions",
  healthExpertController.getMyHealthExpertQuestions
);
// router.post('/healthexpertcategory', healthExpertController.addHealthExpertCategory)
router.post("/add_expert_question", healthExpertController.sendQuestion);

// MedFeed Search
router.post("/search_medfeed", userController.searchMedfeed);

//************************** FOLIOFIT **************************\\
router.get("/get_foliofit_home", userController.getFoliofitHome);
router.get("/fitness_club");
router.get("/yoga");
router.get("/get_dietregime_category", userController.getDietRegimeCat);
router.post("/get_diet_days", userController.getDietDays);
router.get("/get_diet_days_details/:id", userController.getDietDaysDetails);
router.get("/get_nutrichart", userController.getNutriChart);
router.post("/add_health_reminder", userController.addHealthReminder);
router.post("/get_health_reminder", userController.getHealthReminder);
router.post("/add_bmi", userController.addHealthCalculator);
router.get("/get_bmi_details", userController.getBmiDetails);

//FITNESS CLUB
router.get("/get_fitness_club", userController.getFitnessClub);
router.post("/get_fitnessClub_details", userController.getFitnessClubSession);
router.post(
  "/get_fitnessClub_details_byId",
  userController.getFitnessClubSessionById
);
router.post(
  "/get_fitnessClub_session_details",
  userController.getFitnessClubSessionDetails
);
router.get("/get_foliofit_bookmark", userController.getFitnessClubBookmark);
router.post(
  "/get_foliofit_bookmark_byType",
  userController.getFoliofitClubBookmarkByType
);
router.post("/get_vimeo_gif", userController.getVimeoGif);

// router.get('/get_nutrichart_category', userController.getNutrichartCategory)
router.post("/viewAllNutrichartFoods", userController.viewAllNutrichartFoods);
router.post(
  "/viewAllNutrichartFoodsByCalorie",
  userController.viewAllNutrichartFoodsByCalorie
);
router.post("/get_nutrichart_details", userController.getNutrichartDetails);

router.get("/get_yoga_home", userController.getYogaHome);
router.post("/get_yoga_sessions", userController.getYogaSessions);
router.post("/get_yoga_details_byId", userController.getYogaSessionById);

// Diet Regime
// router.get('/get_diet_plans', dietController.getDietPlansUser)
router.post("/get_diet_day", dietController.getDietDays);
router.post("/get_diet_day_detail", dietController.getDietDayDetail);

// ____ foliofit rating _____ \\
router.post("/add_rating", ratingController.addRating);
router.post("/get_rating", ratingController.getRating);
//main home
router.post("/get_med_mainhome", mainHomeController.GetMainHome);
//medimal home
router.get("/get_medimal_mainhome", medimalHomeController.GetMedimalMainHome);

//************************** Medimall -master settings **************************\\

router.post("/get_categories", userController.getCategories);

router.post("/get_subcategories", userController.getSubCategories);

router.post("/get_products", userController.getProducts);
router.post("/get_product_details", userController.getProductDetails);
router.post("/add_product_share", shareSaveController.addProductShare);
router.post(
  "/get_product_share_count",
  shareSaveController.getProductShareCount
);

router.post("/get_sub_sub_category", userProductController.getSubSubCategory);
router.post("/get_all_products", userProductController.getAllProducts);

// get recently viewed product for users
router.get("/get_recently_viewed_products", userController.getHistoryProducts);

// cart APP
router.post("/add_prod_cart", CartController.AddProductToCart);
router.post(
  "/add_multiple_products_to_cart",
  CartController.addMultipleProductsToCart
);
router.get("/get_medicart", CartController.GetMedCart);
router.patch("/update_cart_item", CartController.updateCartItem);
router.post("/update_cart_item", CartController.updateCartItem);
router.delete("/remove_cart_item/:cartId", CartController.removeCartItem);
router.post("/remove_cart_item", CartController.removeCartItemNew);
router.post("/apply_coupon_to_cart", CartController.applyACouponToTheCart);
router.delete(
  "/remove_coupon_from_the_cart",
  CartController.removeCouponFromTheCart
);
router.post(
  "/remove_coupon_from_the_cart",
  CartController.removeCouponFromTheCart
);
router.patch(
  "/edit_applied_med_coin_count",
  CartController.editAppliedMedCoinCount
);
router.post(
  "/edit_applied_med_coin_count",
  CartController.editAppliedMedCoinCount
);

//cart WEB
router.get("/web/get_cart_count", CartController.getCartCount);
router.post("/web/add_prod_cart", CartController.AddProductToCart);
router.get("/web/get_med_cart", CartController.GetMedCartWeb);

router.post("/edit_donation_amount", CartController.editAppliedDonation);

router.get("/pincode_check/:pincode", userController.pincodeCheck);
router.post("/pincode_check", pincodeController.checkPincode);
router.post("/update_favorites", userController.updateFavorites);
router.post("/get_favourite", userController.getFavourite);

//************************** Medimall User Details **************************\\

router.post("/add_user_address", userDetailsController.addUserAddress);
router.get("/get_user_address", userDetailsController.getUserAddress);
router.post("/edit_user_address", userDetailsController.editUserAddress);
router.put(
  "/change_user_address_status/:id",
  userDetailsController.changeStatusUserAddress
);
router.get(
  "/get_user_address_by_id/:id",
  userDetailsController.getUserAddressById
);
router.delete(
  "/delete_user_address/:id",
  userDetailsController.deleteUserAddress
);

router.post(
  "/add_user_personal_details",
  uploadUser.single("image"),
  userDetailsController.addUserPersonalDetails
);
router.post(
  "/add_user_medical_details",
  userDetailsController.addUserMedicalDetails
);
router.get(
  "/get_user_personal_details",
  userDetailsController.getUserPersonalDetails
);

router.post("/change_user_password", userDetailsController.userChangePassword);

router.post(
  "/update_user_image",
  uploadUser.single("image"),
  userDetailsController.updateUserImage
);

router.get(
  "/get_user_medical_details",
  userDetailsController.getUserMedicalDetails
);
router.post("/add_user_address", userDetailsController.addUserAddress);
router.get("/get_user_address", userDetailsController.getUserAddress);

router.post(
  "/add_user_profile_feedback",
  uploadUser.single("image"),
  userDetailsController.addUserProfileFeedback
);
router.get(
  "/get_user_profile_feedback",
  userDetailsController.getUserProfileFeedback
);
router.delete(
  "/delete_user_profile_feedback/:id",
  userDetailsController.deleteUserProfileFeedback
);

router.post(
  "/add_user_family",
  uploadUser.single("image"),
  userDetailsController.addUserFamily
);
router.get("/get_user_family", userDetailsController.getUserFamily);
router.post("/get_user_family_by_id", userDetailsController.getUserFamilyById);
router.put(
  "/edit_user_family",
  uploadUser.single("image"),
  userDetailsController.editUserFamily
);
router.delete(
  "/delete_user_family/:id",
  userDetailsController.deleteUserFamily
);

router.post(
  "/add_user_health_vault",
  uploadUser.single("prescription"),
  userDetailsController.addUserHealthVault
);

router.get(
  "/get_user_health_vault_by_user_id",
  userDetailsController.getUserHealthVaultByUserId
);

router.get(
  "/get_user_health_vault_by_id/:id",
  userDetailsController.getUserHealthVaultById
);
router.post(
  "/edit_user_health_vault",
  uploadUser.single("prescription"),
  userDetailsController.editUserHealthVault
);

router.delete(
  "/delete_user_health_vault/:id",
  userDetailsController.deleteUserHealthVault
);
router.get(
  "/get_user_name_by_user_id",
  userDetailsController.getUserNamesByUserId
);

// Category listing in cart your med essential
router.post(
  "/get_category_in_cart_your_medessential",
  userProductController.getCategoryInCartYourMedessential
);

// Product listing by brand Id
router.post(
  "/get_product_by_brand_id",
  userProductController.getProductByBrandId
);

//suggest a product
router.post("/suggest_product", userController.suggestProduct);
router.get("/user_suggest_product", userController.getSuggestProducts);
router.get("/list_notification", userController.ListNotification);

//Search Inventory
router.get(
  "/get_recently_search_keyword",
  userController.getRecentlySearchKeyword
);

// Budget store
router.post(
  "/list_products_by_budgetStore",
  userController.getBudgetStoreProducts
);

// medpride membership banners
router.get("/get_medpride", medprideController.getMedpride);

//coupons
router.get("/get_coupons", couponController.getCouponByUser);
router.get("/get_web_coupon_by_user", couponController.getWebCouponByUser);
router.post("/scratch_coupon", couponController.scratchCoupon);

router.post("/add_location", userController.addLocation);

// referral
router.get("/get_referral_details", referralController.getReferralDetails);
router.post("/apply_referral_code", referralController.applyReferralCode);
//user swipe card
router.get("/get_swipe_card_details", referralController.getSwipeCardDetails);

//med coins
router.get("/get_med_coin_details/:page", getMedCoinDetailsByUser);

//ADD PRESCRIPTION
router.post(
  "/upload_prescription_image",
  uploadUser.fields([
    {
      name: "prescription",
    },
  ]),
  userDetailsController.addUserPrescriptionsImage
);
router.post("/add_prescriptions", userDetailsController.addUserPrescriptions);
router.post(
  "/update_prescriptions/:id",
  userDetailsController.updateUserPrescriptions
);

router.get(
  "/get_user_prescriptions",
  userDetailsController.getUserPrescription
);

// user prescription admin
router.post(
  "/add_user_prescription_admin",
  uploadUser.fields([
    {
      name: "prescription",
    },
  ]),
  userDetailsController.addUserPrescriptionAdmin
);
router.get(
  "/get_user_prescription_admin",
  userDetailsController.getUserPrescriptionAdmin
);
router.delete(
  "/delete_user_prescription_admin",
  userDetailsController.deleteUserPrescriptionAdmin
);

//purchase
router.post("/place_order", placeOrder);
router.post("/verify_razor_pay_payment", verifyRazorPayPayment);

//membership
router.post("/purchase_membership", purchaseMembership);
router.post(
  "/verify_subscription_payment_RazorPay",
  verifySubscriptionPaymentRazorPay
);

router.get("/get_user_membership_benefits", getUserMembershipBenefits);

// Medicine - order medicine online
router.get(
  "/get_order_medicine_online",
  userProductController.getOrderMedicineOnline
);
// Medicine - get active categories in medicine
router.get(
  "/get_active_medicine_categories",
  userProductController.getActiveMedicineCategories
);

//Web Medicine - order medicine online
router.get(
  "/get_web_order_medicine_online",
  webController.getWebOrderMedicineOnline
);

//premium coupons
router.get("/get_premium_coupons", webController.getMedpride);
router.post("/apply_premium_coupons", webController.applyPremiumCoupon);
router.post(
  "/remove__premium_coupons",
  webController.removePremiumCoupon
);
//My Orders
router.get("/my_orders", userController.myOrders);
router.post("/my_orders_details", userController.myOrdersDetails);
router.get("/recently_purchased", userController.recentlyPurchasedOrders);

router.get("/web-my-orders", userController.myOrders);
router.post("/web-my-orders-details", userController.myOrdersDetails);

//web categories
router.get("/get_categories_for_web", userController.getWebCategories);

router.post("/get_subcategories_for_web", userController.getWebSubCategories);

router.get("/get_order_review", CartController.GetOrderReview);

router.post("/get_order_invoice_by_order_id", getOrderInvoiceByOrderId);

router.get("/get_subscription_list", userController.getSubscriptions);
router.post(
  "/activate_or_inactivate_subscription",
  userController.activateOrDeactivateSubscription
);
router.post(
  "/upload_subscription_prescription",
  userController.uploadSubscriptionPrescription
);
router.post("/update_subscription_prescription", userController.updateSubscriptionPrescription);
router.post("/delete_subscription_prescription", userController.deleteSubscriptionPrescription);

//Cancel Product
router.post("/cancel_order", userController.cancelOrder);
router.post("/cancel_order_reason", userController.cancelOrderReasons);
router.post("/return_order_reason", userController.returnOrderReasons);

router.post("/return_product", userController.returnProduct);
router.post(
  "/get_cancel_eligible_product",
  userController.getCancelEligibleProducts
);
router.post(
  "/get_return_eligible_product",
  userController.getReturnEligibleProducts
);
router.post("/get_refundable_amount", returnOrderController.getRefundableAmount)

router.post("/get_return_order_details", returnOrderController.getReturnOrderDetails);

//product rating
router.get("/get_delivered_product", mainHomeController.getDeliveredProducts)
router.post("/submit_product_rating", mainHomeController.submitRating)

//notification
router.get("/get_user_notifications", mainHomeController.getUserNotifications);
router.post('/change_notification_read_status', mainHomeController.changeNotificationReadStatus)
router.delete('/delete_one_notification', mainHomeController.deleteNotification)
router.delete('/delete_all_notification', mainHomeController.deleteAllNotifications)

// order-invoice
router.post("/create_order_invoice", userController.createOrderInvoice);

module.exports = router;
