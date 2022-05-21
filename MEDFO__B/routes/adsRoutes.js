const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path'); // for getting file extension

const adsFoliofitController = require("../controllers/adsmanagment/adsFoliofitController");
const adsMedimallController = require("../controllers/adsmanagment/adsMedimallController");
const adsMedfeedController = require("../controllers/adsmanagment/adsMedfeedController");
const adsHomeController = require("../controllers/adsmanagment/adsHomeController");
const adsMedCoinController = require("../controllers/adsmanagment/adsMedCoinController");
const adsProfileController = require("../controllers/adsmanagment/adsProfileController")
const adsCartController = require("../controllers/adsmanagment/adsCartController")
const adsSeasonalOffersController = require("../controllers/adsmanagment/adsSeasonalOffersController")
const adsWebHomeController = require('../controllers/adsmanagment/web/adsWebHomeController');

const authController = require('../controllers/authController');

router.use("/", express.static("public/images/ads"));

// Protect all routes after this middleware
router.use(authController.protect);

//const masterController = require("../controllers/masterSettingsController");

const fs = require("fs");
const sizeOf = require("image-size");

// router.use("/", express.static("public/images/ads"));
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images/ads");
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}_${Date.now()}`+path.extname(file.originalname)) 
        //cb(null, `${file.fieldname}_${Date.now()}.jpg`);
    },
});

const upload = multer({
    storage: storage,  
    fileFilter: function(req,file, cb){
        checkFileType(file, cb);
    }
}).single("image");
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);  
    if(mimetype && extname){
      return cb(null,true);
    } else {
          cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
   
    }
  }


const uploadImage = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(200).json({
                status: false,
                data: err.message,
            });
        } else {
            if (req.file) {
                let fileinfo = req.file;
                var dimensions = sizeOf(fileinfo.path);
                if (dimensions.width == 350 && dimensions.height == 750) {
                    next();
                } else {
                    fs.unlink(fileinfo.path, () => {
                        let message = "Please upload image of size 350 * 750";
                        res.status(200).json({
                            status: false,
                            data: message,
                        });
                    });
                }
            } else {
                next();
            }
        }
    });
};

let uploadMultiple = multer({ storage: storage });



/* Ads Foliofit Slider1 APIs
============================================= */
router.post("/add_ads_foliofit_slider1", upload, adsFoliofitController.addAdsFoliofitSlider1);
router.get("/get_ads_foliofit_slider1", adsFoliofitController.getAdsFoliofitSlider1);
router.get("/get_ads_foliofit_slider1_by_id/:id", adsFoliofitController.getAdsFoliofitSlider1ById);
router.put("/edit_ads_foliofit_slider1", upload, adsFoliofitController.editAdsFoliofitSlider1);
router.delete("/delete_ads_foliofit_slider1/:id", adsFoliofitController.deleteAdsFoliofitSlider1);

/* Ads Foliofit Slider2 APIs
============================================= */
router.post("/add_ads_foliofit_slider2", upload, adsFoliofitController.addAdsFoliofitSlider2);
router.get("/get_ads_foliofit_slider2", adsFoliofitController.getAdsFoliofitSlider2);
router.get("/get_ads_foliofit_slider2_by_id/:id", adsFoliofitController.getAdsFoliofitSlider2ById);
router.put("/edit_ads_foliofit_slider2", upload, adsFoliofitController.editAdsFoliofitSlider2);
router.delete("/delete_ads_foliofit_slider2/:id", adsFoliofitController.deleteAdsFoliofitSlider2);

/* Ads Foliofit Slider3 APIs
============================================= */
router.post("/add_ads_foliofit_slider3", upload, adsFoliofitController.addAdsFoliofitSlider3);
router.get("/get_ads_foliofit_slider3", adsFoliofitController.getAdsFoliofitSlider3);
router.get("/get_ads_foliofit_slider3_by_id/:id", adsFoliofitController.getAdsFoliofitSlider3ById);
router.put("/edit_ads_foliofit_slider3", upload, adsFoliofitController.editAdsFoliofitSlider3);
router.delete("/delete_ads_foliofit_slider3/:id", adsFoliofitController.deleteAdsFoliofitSlider3);

/* Ads Foliofit Fitness Club Banner APIs
============================================= */
router.get("/get_ads_foliofit_fitness_club_banner", adsFoliofitController.getAdsFoliofitFitnessClubBanner);
router.get("/get_ads_foliofit_fitness_club_banner_by_id/:id", adsFoliofitController.getAdsFoliofitFitnessClubBannerById);
router.put("/edit_ads_foliofit_fitness_club_banner", upload, adsFoliofitController.editAdsFoliofitFitnessClubBanner);
router.delete("/delete_ads_foliofit_fitness_club_banner/:id", adsFoliofitController.deleteAdsFoliofitFitnessClubBanner);

/* Ads Foliofit Yoga Banner APIs
============================================= */
router.get("/get_ads_foliofit_yoga_banner", adsFoliofitController.getAdsFoliofitYogaBanner);
router.get("/get_ads_foliofit_yoga_banner_by_id/:id", adsFoliofitController.getAdsFoliofitYogaBannerById);
router.put("/edit_ads_foliofit_yoga_banner", upload, adsFoliofitController.editAdsFoliofitYogaBanner);
router.post("/add_ads_foliofit_yoga_banner", upload, adsFoliofitController.addAdsFoliofitYogaBanner);
router.delete("/delete_ads_foliofit_yoga_banner/:id", adsFoliofitController.deleteAdsFoliofitYogaBanner);

/* Ads Foliofit Fitness Club Slider
============================================= */
router.post("/add_ads_foliofit_fitness_club_slider", upload, adsFoliofitController.addAdsFoliofitFitnessClubSlider);
router.get("/get_ads_foliofit_fitness_club_slider", adsFoliofitController.getAdsFoliofitFitnessClubSlider);
router.get("/get_ads_foliofit_fitness_club_slider_by_id/:id", adsFoliofitController.getAdsFoliofitFitnessClubSliderById);
router.put("/edit_ads_foliofit_fitness_club_slider", upload, adsFoliofitController.editAdsFoliofitFitnessClubSlider);
router.delete("/delete_ads_foliofit_fitness_club_slider/:id", adsFoliofitController.deleteAdsFoliofitFitnessClubSlider);

/* Ads Foliofit Yoga Slider
============================================= */
router.post("/add_ads_foliofit_yoga_slider", upload, adsFoliofitController.addAdsFoliofitYogaSlider);
router.get("/get_ads_foliofit_yoga_slider", adsFoliofitController.getAdsFoliofitYogaSlider);
router.get("/get_ads_foliofit_yoga_slider_by_id/:id", adsFoliofitController.getAdsFoliofitYogaSliderById);
router.put("/edit_ads_foliofit_yoga_slider", upload, adsFoliofitController.editAdsFoliofitYogaSlider);
router.delete("/delete_ads_foliofit_yoga_slider/:id", adsFoliofitController.deleteAdsFoliofitYogaSlider);

/* Ads Foliofit Ad1 APIs
============================================= */
router.get("/get_ads_foliofit_ad1", adsFoliofitController.getAdsFoliofitAd1);
router.get("/get_ads_foliofit_ad1_by_id/:id", adsFoliofitController.getAdsFoliofitAd1ById);
router.put("/edit_ads_foliofit_ad1", upload, adsFoliofitController.editAdsFoliofitAd1);
router.delete("/delete_ads_foliofit_ad1/:id", adsFoliofitController.deleteAdsFoliofitAd1);



/* Ads Foliofit Nutrichart Banner APIs
============================================= */
router.get("/get_ads_foliofit_nutrichart_banner", adsFoliofitController.getAdsFoliofitNutrichartBanner);
router.get("/get_ads_foliofit_nutrichart_banner_by_id/:id", adsFoliofitController.getAdsFoliofitNutrichartBannerById);
router.put("/edit_ads_foliofit_nutrichart_banner", upload, adsFoliofitController.editAdsFoliofitNutrichartBanner);
router.post("/add_ads_foliofit_nutrichart_banner", upload, adsFoliofitController.addAdsFoliofitNutrichartBanner);
router.delete("/delete_ads_foliofit_nutrichart_banner/:id", adsFoliofitController.deleteAdsFoliofitNutrichartBanner);


/* Ads Foliofit Main Category APIs
============================================= */
router.post("/add_ads_foliofit_main_category", upload, adsFoliofitController.addAdsFoliofitMainCategory);
router.get("/get_ads_foliofit_main_category", adsFoliofitController.getAdsFoliofitMainCategory);
router.get("/get_ads_foliofit_main_category_by_id/:id", adsFoliofitController.getAdsFoliofitMainCategoryById);
router.put("/edit_ads_foliofit_main_category", upload, adsFoliofitController.editAdsFoliofitMainCategory);
router.delete("/delete_ads_foliofit_main_category/:id", adsFoliofitController.deleteAdsFoliofitMainCategory);




/*Dummy data for product and category APIs
============================================= */
router.get("/get_categories", adsFoliofitController.getCategory);
router.get("/get_products", adsFoliofitController.getProduct);

/*  ==================         Ads Medimall Management                 ============================= */

/* Ads Medimall Slider1 APIs
============================================= */
// router.post("/addAdsMedimallSlider1", upload, adsMedimallController.addAdsMedimallSlider1);
// router.get("/getAdsMedimallSlider1", adsMedimallController.getAdsMedimallSlider1);
// router.put("/editAdsMedimallSlider1", upload, adsMedimallController.editAdsMedimallSlider1);
// router.delete("/deleteAdsMedimallSlider1/:id", adsMedimallController.deleteAdsMedimallSlider1);

/* Ads Medimall Slider2 APIs
============================================= */
// router.post("/addAdsMedimallSlider2", upload, adsMedimallController.addAdsMedimallSlider2);
// router.get("/getAdsMedimallSlider2", adsMedimallController.getAdsMedimallSlider2);
// router.put("/editAdsMedimallSlider2", upload, adsMedimallController.editAdsMedimallSlider2);
// router.delete("/deleteAdsMedimallSlider2/:id", adsMedimallController.deleteAdsMedimallSlider2);

/* Ads Medimall Main Category APIs
============================================= */
router.get("/get_ads_medimall_main_category", adsMedimallController.getAdsMedimallMainCategory);
router.get("/get_ads_medimall_main_category_by_id/:id", adsMedimallController.getAdsMedimallMainCategoryById);
router.put("/edit_ads_medimall_main_category", upload, adsMedimallController.editAdsMedimallMainCategory);
router.delete("/delete_ads_medimall_main_category/:id", adsMedimallController.deleteAdsMedimallMainCategory);
router.post("/add_ads_medimall_main_category", upload, adsMedimallController.addAdsMedimallMainCategory);

/* Ads Medimall Top Categories APIs
============================================= */
router.post("/add_ads_medimall_top_categories", upload, adsMedimallController.addAdsMedimallTopCategories);
router.get("/get_ads_medimall_top_categories", adsMedimallController.getAdsMedimallTopCategories);
router.get("/get_ads_medimall_top_categories_by_id/:id", adsMedimallController.getAdsMedimallTopCategoriesById);
router.put("/edit_ads_medimall_top_categories", upload, adsMedimallController.editAdsMedimallTopCategories);
router.delete("/delete_ads_medimall_top_categories/:id", adsMedimallController.deleteAdsMedimallTopCategories);


/*  Ads Medimall Top 3 Icons, 6 categories, Healthcare (Banner) APIs
============================================= */
router.get("/get_ads_medimall_topIcon_6Cat_Healthcare/:sliderType", adsMedimallController.getAdsMedimallTopIconCatHealth);
router.get("/get_ads_medimall_topIcon_6Cat_Healthcare_by_id/:id", adsMedimallController.getAdsMedimallTopIconCatHealthById);
router.put(
    "/edit_ads_medimall_topIcon_6Cat_Healthcare/:sliderType",
    upload,
    adsMedimallController.editAdsMedimallTopIconCatHealth
);
router.delete("/delete_ads_medimall_topIcon_6Cat_Healthcare/:id", adsMedimallController.deleteAdsMedimallTopIconCatHealth);
router.post("/add_ads_medimall_topIcon_6Cat_Healthcare/:sliderType", upload, adsMedimallController.addAdsMedimallTopIconCatHealth);
router.put(
    "/edit_ads_medimall_topIcon_6Cat_Healthcare",
    upload,
    adsMedimallController.editAdsMedimallTopIconCatHealth
);




/* Ads Medimall Slider1, Slider2 Slider3, Slider4, Slider5, Slider6, Slider7, Top Deals APIs
============================================================================ */

router.post("/add_ads_medimall_slider/:sliderType", upload, adsMedimallController.addAdsMedimallSlider);
router.get("/get_ads_medimall_slider/:sliderType", adsMedimallController.getAdsMedimallSlider);
router.get("/get_ads_medimall_slider_by_id/:id", adsMedimallController.getAdsMedimallSliderById);
router.put("/edit_ads_medimall_slider", upload, adsMedimallController.editAdsMedimallSlider);
router.delete("/delete_ads_medimall_slider/:id", adsMedimallController.deleteAdsMedimallSlider);

/* Ads Medimall Wish list , Recently Viewed APIs
============================================= */
router.get("/get_ads_medimall_wish_recent/:sliderType", adsMedimallController.getAdsMedimallWishRecent);
router.put("/edit_ads_medimall_wish_recent", upload, adsMedimallController.editAdsMedimallWishRecent);
router.post("/add_ads_medimall_wish_recent/:sliderType", upload, adsMedimallController.addAdsMedimallWishRecent);
router.delete("/delete_ads_medimall_wish_recent/:id", adsMedimallController.deleteAdsMedimallWishRecent);
router.get("/get_ads_medimall_wish_recent_by_id/:id", adsMedimallController.getAdsMedimallWishRecentById);

/* Ads Medimall Grooming & Essentials APIs
============================================= */
router.post("/add_ads_medimall_grooming", upload, adsMedimallController.addAdsMedimallGrooming);
router.get("/get_ads_medimall_grooming", adsMedimallController.getAdsMedimallGrooming);
router.get("/get_ads_medimall_grooming/:id", adsMedimallController.getAdsMedimallGroomingById);
router.put("/edit_ads_medimall_grooming", upload, adsMedimallController.editAdsMedimallGrooming);
router.delete("/delete_ads_medimall_grooming/:id", adsMedimallController.deleteAdsMedimallGrooming);

/*  ==================         Ads Medfeed Management                 ============================= */

/* Ads Medfeed Slider1
============================================= */
router.post("/add_ads_medfeed_slider1", upload, adsMedfeedController.addAdsMedfeedSlider1);
router.get("/get_ads_medfeed_slider1", adsMedfeedController.getAdsMedfeedSlider1);
router.get("/get_ads_medfeed_slider1_by_id/:id", adsMedfeedController.getAdsMedfeedSlider1ById);
router.put("/edit_ads_medfeed_slider1", upload, adsMedfeedController.editAdsMedfeedSlider1);
router.delete("/delete_ads_medfeed_slider1/:id", adsMedfeedController.deleteAdsMedfeedSlider1);

/* Ads Medfeed Main Category, Expert Advise APIs
============================================= */
router.get("/get_ads_medfeed_main_expert/:sliderType", adsMedfeedController.getAdsMedfeedMainExpert);
router.get("/get_ads_medfeed_main_expert_by_id/:id", adsMedfeedController.getAdsMedfeedMainExpertById);
router.put("/edit_ads_medfeed_main_expert/:sliderType", upload, adsMedfeedController.editAdsMedfeedMainExpert);
router.delete("/delete_ads_medfeed_main_expert/:id", adsMedfeedController.deleteAdsMedfeedMainExpert);

/* Ads Medfeed Quiz
============================================= */
router.post("/add_ads_medfeed_quiz", upload, adsMedfeedController.addAdsMedfeedQuiz);
router.get("/get_ads_medfeed_quiz", adsMedfeedController.getAdsMedfeedQuiz);
router.get("/get_ads_medfeed_quiz_by_id/:id", adsMedfeedController.getAdsMedfeedQuizById);
router.put("/edit_ads_medfeed_quiz", upload, adsMedfeedController.editAdsMedfeedQuiz);
router.delete("/delete_ads_medfeed_quiz/:id", adsMedfeedController.deleteAdsMedfeedQuiz);

/* Ads Medfeed Quiz One
============================================= */
router.post("/add_ads_medfeed_quiz_one", upload, adsMedfeedController.addAdsMedfeedQuizOne);
router.get("/get_ads_medfeed_quiz_one", adsMedfeedController.getAdsMedfeedQuizOne);
router.put("/edit_ads_medfeed_quiz_one", upload, adsMedfeedController.editAdsMedfeedQuizOne);


/*  =========================         Ads Home Management            ============================= */

/* Ads Home Top Categories,Main Category, Ad1, Ad6, Ad8 APIs
============================================= */
router.get("/get_ads_home_topCat_mainCat_ad1_ad6_ad8/:sliderType", adsHomeController.getAdsHomeTopCatMainCatAd1Ad6Ad8);
router.put("/edit_ads_home_topCat_mainCat_ad1_ad6_ad8", upload, adsHomeController.editAdsHomeTopCatMainCatAd1Ad6Ad8);
router.post("/add_ads_home_topCat_mainCat_ad1_ad6_ad8/:sliderType", upload, adsHomeController.addAdsHomeTopCatMainCatAd1Ad6Ad8);
router.delete("/delete_ads_home_topCat_mainCat_ad1_ad6_ad8/:id", adsHomeController.deleteAdsHomeTopCatMainCatAd1Ad6Ad8);
router.get("/get_ads_home_topCat_mainCat_ad1_ad6_ad8_byId/:id", adsHomeController.getAdsHomeTopCatMainCatAd1Ad6Ad8Details);


/* Ads Home Slider1, Slider2 Slider3, Slider4, Ad2, Ad5 APIs
============================================================================ */

router.post("/add_ads_home_slider_1234_ad_25/:sliderType", upload, adsHomeController.addAdsHomeSlider1234Ad25);
router.get("/get_ads_home_slider_1234_ad_25/:sliderType", adsHomeController.getAdsHomeSlider1234Ad25);
router.put("/edit_ads_home_slider_1234_ad_25", upload, adsHomeController.editAdsHomeSlider1234Ad25);
router.delete("/delete_ads_home_slider_1234_ad_25/:id", adsHomeController.deleteAdsHomeSlider1234Ad25);
router.get("/get_ads_home_slider_1234_ad_25_byId/:id", adsHomeController.getAdsHomeSlider1234Ad25Details);


/* Ads Home Ad3 APIs
============================================================================ */

router.put("/edit_ads_home_ad3", upload, adsHomeController.editAdsHomeAd3);
router.get("/get_ads_home_ad3", adsHomeController.getAdsHomeAd3);
router.delete("/delete_ads_home_ad3/:id", adsHomeController.deleteAdsHomeAd3);
router.get("/get_ads_home_ad3_byId/:id", adsHomeController.getAdsHomeAd3Details);

/* Ads Home Ad4 APIs
============================================================================ */

router.put("/edit_ads_home_ad4", upload, adsHomeController.editAdsHomeAd4);
router.get("/get_ads_home_ad4", adsHomeController.getAdsHomeAd4);
router.delete("/delete_ads_home_ad4/:id", adsHomeController.deleteAdsHomeAd4);
router.get("/get_ads_home_ad4_byId/:id", adsHomeController.getAdsHomeAd4Details);


/* Ads Home Ad7 APIs
============================================================================ */

router.put("/edit_ads_home_ad7", upload, adsHomeController.editAdsHomeAd7);
router.get("/get_ads_home_ad7", adsHomeController.getAdsHomeAd7);
router.delete("/delete_ads_home_ad7/:id", adsHomeController.deleteAdsHomeAd7);
router.get("/get_ads_home_ad7_byId/:id", adsHomeController.getAdsHomeAd7Details);


/* Ads Home Slider5 APIs
============================================================================ */

router.post("/add_ads_home_slider5", upload, adsHomeController.addAdsHomeSlider5);
router.get("/get_ads_home_slider5", adsHomeController.getAdsHomeSlider5);
router.put("/edit_ads_home_slider5", upload, adsHomeController.editAdsHomeSlider5);
router.delete("/delete_ads_home_slider5/:id", adsHomeController.deleteAdsHomeSlider5);
router.get("/get_ads_home_slider5_byId/:id", adsHomeController.getAdsHomeSlider5Details);

/* Ads Home Trending Category APIs
============================================================================ */

router.post("/add_ads_home_trending_category", upload, adsHomeController.addAdsHomeTrendingCategory);
router.get("/get_ads_home_trending_category", adsHomeController.getAdsHomeTrendingCategory);
router.put("/edit_ads_home_trending_category", upload, adsHomeController.editAdsHomeTrendingCategory);
router.delete("/delete_ads_home_trending_category/:id", adsHomeController.deleteAdsHomeTrendingCategory);
router.get("/get_ads_home_trending_category_byId/:id", adsHomeController.getHomeTrendingCategoryDetails);

/* Ads Home Plan Your diet APIs
============================================================================ */

router.post("/add_ads_home_plan_your_diet", upload, adsHomeController.addAdsHomePlanYourDiet);
router.get("/get_ads_home_plan_your_diet", adsHomeController.getAdsHomePlanYourDiet);
router.get("/get_ads_home_plan_your_diet_byId/:id", adsHomeController.getAdsHomePlanYourDietDetails);
router.put("/edit_ads_home_plan_your_diet", upload, adsHomeController.editAdsHomePlanYourDiet);
router.delete("/delete_ads_home_plan_your_diet/:id", adsHomeController.deleteAdsHomePlanYourDiet);

/* Ads Home In The Spotlight APIs
============================================================================ */

router.post(
    "/add_ads_home_spotlight",
    uploadMultiple.fields([
        {
            name: "image",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    adsHomeController.addAdsHomeSpotlight
);
router.get("/get_ads_home_spotlight", adsHomeController.getAdsHomeSpotlight);
router.get("/get_ads_home_spotlight_byId/:id", adsHomeController.getAdsHomeSpotlightDetails);
router.put(
    "/edit_ads_home_spotlight",
    uploadMultiple.fields([
        {
            name: "image",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    adsHomeController.editAdsHomeSpotlight
);
router.delete("/delete_ads_home_spotlight/:id", adsHomeController.deleteAdsHomeSpotlight);

/* Ads Home Cart Your Esentials
============================================================================ */

router.post("/add_ads_home_cart", upload, adsHomeController.addAdsHomeCart);
router.get("/get_ads_home_cart", adsHomeController.getAdsHomeCart);
router.put("/edit_ads_home_cart", upload, adsHomeController.editAdsHomeCart);
router.delete("/delete_ads_home_cart/:id", adsHomeController.deleteAdsHomeCart);
router.get("/get_ads_home_cart_byId/:id", adsHomeController.getAdsHomeCartDetails);

/*Ads Home Main Yoga, Main Fitness APIS
============================================================================ */

router.get("/get_ads_home_main_yoga_fitness/:adsType", adsHomeController.getAdsHomeMainYogaFitness);
router.put("/edit_ads_home_main_yoga_fitness/:adsType", upload, adsHomeController.editAdsHomeMainYogaFitness);
router.get("/get_ads_home_main_yoga_fitness_by_id/:id", adsHomeController.getAdsHomeMainYogaFitnessDetails);
router.delete("/delete_ads_home_main_yoga_by_id/:id", adsHomeController.deleteAdsHomeMainYogaFitness);



/* Ads Home Sub yoga, Sub Fitness, Expert Advise
============================================================================ */
router.post("/add_ads_home_sub_yoga_fitness_expert/:adsType", upload, adsHomeController.addAdsHomeSubYogaFitnessExpert);
router.get("/get_ads_home_sub_yoga_fitness_expert/:adsType", adsHomeController.getAdsHomeSubYogaFitnessExpert);
router.put("/edit_ads_home_sub_yoga_fitness_expert", upload, adsHomeController.editAdsHomeSubYogaFitnessExpert);
router.delete("/delete_ads_home_sub_yoga_fitness_expert/:id", adsHomeController.deleteAdsHomeSubYogaFitnessExpert);
router.get("/get_ads_home_sub_yoga_fitness_expert_by_id/:id", adsHomeController.getAdsHomeSubYogaFitnessExpertDetails);

/* Ads Home  yoga(Main Yoga, Sub Yoga) Details By Id
============================================================================ */
router.get("/get_ads_home_fitness_by_id/:id", adsHomeController.getAdsHomeFitnessDetails);


/* Ads Home  Fitness(Main Fitness, Sub Fitness) Details By Id
============================================================================ */
router.get("/get_ads_home_yoga_by_id/:id", adsHomeController.getAdsHomeYogaDetails);



/* Ads Home Expert Advise Getting questions medfeed health expert category id
============================================= */
router.get("/get_ads_home_expertAdvise_replied_qusetions/:categoryId", adsHomeController.getAdsHomeExpertAdviseRepliedQuestions);

router.get("/get_ads_home_expertAdvise_replied_qusetions_details", adsHomeController.getAdsHomeExpertAdviseRepliedQuestionsDetails);

/* Ads Home  Expert Advice Details By Id
============================================================================ */
router.get("/get_ads_home_expertAdvise_by_id/:id", adsHomeController.getAdsHomeExpertAdviceDetails);


/* Ads Home Main Yoga , Sub Yoga - category Listing
============================================= */
router.get("/get_ads_home_yoga_categories", adsHomeController.getAdsHomeYogaCategories);


/* Ads Home Main Yoga , Sub Yoga - video Listing by category id
============================================= */
//router.get("/get_ads_home_yoga_videos_by_category_id/:categoryId", adsHomeController.getAdsHomeYogaVideosByCategoryId);

/* Ads Home Main Fitness , Sub Fitness - category Listing
============================================= */
router.get("/get_ads_home_fitness_categories", adsHomeController.getAdsHomeFitnessCategories);





/* Ads Med Coins
============================================================================ */
router.put("/editMedCoinAd1Ad2HowItWorks",upload,adsMedCoinController.medCoinAd1Ad2HowItWorks);
router.delete("/deleteMedCoinAd1Ad2HowItWorks/:type", adsMedCoinController.deleteMedCoinAd1Ad2HowItWorks);
router.get("/getMedCoinAd1Ad2HowItWorks", adsMedCoinController.getMedCoinAd1Ad2HowItWorks);

/* Ads Profile ad1Medfill
============================================================================ */
router.put("/editAd1MedFill",upload,adsProfileController.editAd1MedFillMedPride);
router.delete("/deleteAd1MedFill/:id", adsProfileController.deleteAd1MedFillMedPride);
router.get("/getAd1MedFill", adsProfileController.getAd1MedFillMedPride);
/* Ads Profile medPride
============================================================================ */
router.put("/editMedPride",upload,adsProfileController.editMedPride);
router.delete("/deleteMedPride/:id", adsProfileController.deleteMedPride);
router.get("/getMedPride", adsProfileController.getMedPride);
router.get("/getMedPride/:id", adsProfileController.getSingleMedPride);

/* Ads profile refer and Earn APIs
============================================= */
router.put("/editReferEarn",upload,adsProfileController.editReferEarn);
router.delete("/deleteReferEarn/:id", adsProfileController.deleteReferEarn);
router.get("/getReferEarn", adsProfileController.getReferEarn);

/* Ads profile address APIs
============================================= */
router.get("/getAdsAddress", adsProfileController.getAdsAddress);
router.put("/editAdsAddress", upload, adsProfileController.editAdsAddress);
router.delete("/deleteAdsAddress/:id", adsProfileController.deleteAdsAddress);


/* Ads cart handpick APIs
============================================= */
router.get("/get_ads_cart_handpick", adsCartController.getAdsCartHandpick);
router.put("/edit_ads_cart_handpick", upload, adsCartController.editAdsCartHandpick);
router.delete("/delete_ads_cart_handpick/:id", adsCartController.deleteAdsCartHandpick);

/* Ads ad1Subscription
============================================================================ */
router.put("/editAd1SubscriptionOrderReview2",upload,adsCartController.editAd1Subscription);
router.delete("/deleteAd1SubscriptionOrderReview2/:id", adsCartController.deleteAd1Subscription);
router.get("/getAd1SubscriptionOrderReview2", adsCartController.getAd1Subscription);

/* Ads cart order review APIs
============================================= */
router.get("/getOrderReview", adsCartController.getOrderReview);
router.put("/editOrderReview", upload, adsCartController.editOrderReview);
router.delete("/deleteOrderReview/:id", adsCartController.deleteOrderReview);


/* Ads cart orderMedicine3Icon APIs
============================================= */
router.put("/editOrderMedicine3Icon",upload,adsCartController.editOrderMedicine3Icon);
router.get("/getOrderMedicine3Icon", adsCartController.getOrderMedicine3Icon);
/* Ads Home In The Spotlight APIs
============================================================================ */

router.post(
    "/add_ads_cart_howToOrderMedicine",
    uploadMultiple.fields([
        {
            name: "video",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    adsCartController.addAdsCartHowToOrderMedicine
);
router.get("/get_ads_cart_howToOrderMedicine", adsCartController.getAdsCartHowToOrderMedicine);
router.put(
    "/edit_ads_cart_howToOrderMedicine",
    uploadMultiple.fields([
        {
            name: "video",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    adsCartController.editAdsCartHowToOrderMedicine
);
/* Ads cart order medicine slider APIs
============================================= */
router.get("/getOrderMedicineSlider", adsCartController.getOrderMedicineSlider);
router.put("/editOrderMedicineSlider", upload, adsCartController.editOrderMedicineSlider);
router.delete("/deleteOrderMedicineSlider/:id", adsCartController.deleteOrderMedicineSlider);

/* Ads promotion partnerPromotion APIs
============================================= */
router.put("/editPartnerPromotion",upload,adsCartController.editPartnerPromotion);
router.get("/getPartnerPromotion", adsCartController.getPartnerPromotion);
router.delete("/deletePartnerPromotion/:id", adsCartController.deletePartnerPromotion);

/* Ads promotion promotion APIs
============================================= */
router.put("/editPromotion",upload,adsCartController.editPromotion);
router.get("/getPromotion", adsCartController.getPromotion);
router.delete("/deletePromotion/:id", adsCartController.deletePromotion);
/* Ads seasonal offers SetYourDeal APIs
============================================= */
router.put("/editSetYourDeal",adsSeasonalOffersController.addSetYourDeal);
router.get("/getSetYourDeal", adsSeasonalOffersController.getSetYourDeal);
router.get("/getSetYourDeal/:id", adsSeasonalOffersController.getSingleSetYourDeal);
router.delete("/deleteSetYourDeal/:id", adsSeasonalOffersController.deleteSetYourDeal);
/* Ads seasonal offers SetYourDealsub APIs
============================================= */
router.put("/editSetYourDealSub",upload,adsSeasonalOffersController.addSetYourDealSub);
router.get("/getSetYourDealSub/:id", adsSeasonalOffersController.getSetYourDealSub);
router.get("/getSingleSetYourDealSub/:id", adsSeasonalOffersController.getSingleSetYourDealSub);
router.delete("/deleteSetYourDealSub/:id", adsSeasonalOffersController.deleteSetYourDealSub);
/* Ads seasonal offers editorsChoiceVocalLocalEnergizeYourWorkout APIs
============================================= */
router.get("/getAdseditorsChoiceVocalLocalEnergizeYourWorkout", adsSeasonalOffersController.getAdseditorsChoiceVocalLocalEnergizeYourWorkout);
router.get("/getAdseditorsChoiceVocalLocalEnergizeYourWorkout/:id", adsSeasonalOffersController.getAdsSingleeditorsChoiceVocalLocalEnergizeYourWorkout);
router.put("/editAdseditorsChoiceVocalLocalEnergizeYourWorkout", upload, adsSeasonalOffersController.editAdseditorsChoiceVocalLocalEnergizeYourWorkout);
router.delete("/deleteAdseditorsChoiceVocalLocalEnergizeYourWorkout/:id", adsSeasonalOffersController.deleteAdseditorsChoiceVocalLocalEnergizeYourWorkout);
/* Ads seasonal offers set new offer APIs
============================================= */
router.put("/editSetNewOffer",upload,adsSeasonalOffersController.editSetNewOffer);
router.get("/getSetNewOffer", adsSeasonalOffersController.getSetNewOffer);
router.get("/getSetNewOffer/:id", adsSeasonalOffersController.getSingleSetNewOffer);
router.delete("/deleteSetNewOffer/:id", adsSeasonalOffersController.deleteSetNewOffer);
/* Ads seasonal offers set new offer sub APIs
============================================= */
router.put("/editSetNewOffersub",upload,adsSeasonalOffersController.editSetNewOfferSub);
// router.get("/getSetNewOffersub", adsSeasonalOffersController.getSetNewOfferSub);
router.get("/getCatSetNewOffersub/:id", adsSeasonalOffersController.getCatSetNewOfferSub);
router.get("/getSetNewOffersub/:id", adsSeasonalOffersController.getSingleSetNewOfferSub);
router.delete("/deleteSetNewOffersub/:id", adsSeasonalOffersController.deleteSetNewOfferSub);
/* Ads seasonal offers immunity booster APIs
============================================= */
router.put("/editImmunityBooster",upload,adsSeasonalOffersController.editImmunityBooster);
router.get("/getImmunityBooster", adsSeasonalOffersController.getImmunityBooster);
router.get("/getSingleImmunityBooster/:id", adsSeasonalOffersController.getSingleImmunityBooster);
router.delete("/deleteImmunityBooster/:id", adsSeasonalOffersController.deleteImmunityBooster);
/* Ads seasonal offers top topCategories APIs
============================================= */
router.put("/editTopCategories",upload,adsSeasonalOffersController.editTopCategories);
router.get("/getTopCategories", adsSeasonalOffersController.getTopCategories);
router.get("/getSingleTopCategories/:id", adsSeasonalOffersController.getSingleTopCategories);
router.delete("/deleteTopCategories/:id", adsSeasonalOffersController.deleteTopCategories);
/* Ads seasonal offers budgetStore APIs
============================================= */
router.put("/editBudgetStore",upload,adsSeasonalOffersController.editBudgetStore);
router.get("/getBudgetStore", adsSeasonalOffersController.getBudgetStore);
router.get("/getSingleBudgetStore/:id", adsSeasonalOffersController.getSingleBudgetStore);
router.delete("/deleteBudgetStore/:id", adsSeasonalOffersController.deleteBudgetStore);



/* Ads Category Listing  APIs
============================================= */
router.get("/get_sub_catgory_healthcare", adsHomeController.getSubCatgoryHealthcare);


// medimall grooming and essential category listing (sub category and sub sub category in healthcare)
router.get("/get_sub_and_sub_catgory_healthcare", adsHomeController.getSubAndSubSubCatgoryHealthcare);

// main sub category and sub sub category in healthcare
router.get("/get_main_sub_and_sub_catgory_healthcare", adsHomeController.getMainSubAndSubSubCatgoryHealthcare);

// get all active products
router.get("/get_all_active_products", adsHomeController.getAllActiveProducts);

// get all inventory categories
router.get("/get_inventory_categories", adsHomeController.getInventoryCategories);

// get all active products by category id
router.get("/get_all_active_products_by_category_id/:categoryId", adsHomeController.getAllActiveProductsByCategoryId);

// *************************** ___WEB___ *************************** \\
router.post('/add_web_home_slider', upload, adsWebHomeController.addWebHomeSlider)
router.get('/get_all_web_home_sliders', adsWebHomeController.getAllWebHomeSliders)
router.get('/get_web_home_slider/:id', adsWebHomeController.getWebHomeSlider)
router.put('/edit_web_home_slider/:id',upload, adsWebHomeController.editWebHomeSlider)
router.delete('/delete_web_home_slider/:id', adsWebHomeController.deleteWebHomeSlider)

router.post('/add_web_banner', upload, adsWebHomeController.addWebBanner)
router.get('/get_all_web_banners', adsWebHomeController.getAllWebBanners)
router.get('/get_web_banner/:id', adsWebHomeController.getWebBanner)
router.put('/edit_web_banner/:id',upload, adsWebHomeController.editWebBanner)
router.delete('/delete_web_banner/:id', adsWebHomeController.deleteWebBanner)

module.exports = router;
