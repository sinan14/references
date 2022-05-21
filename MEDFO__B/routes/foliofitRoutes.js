const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path')
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images/foliofit');
    },
    filename: function(req, file, cb) {
        cb(null, `${file.fieldname}_${Date.now()}`+path.extname(file.originalname)) 
        //cb(null, `${file.fieldname}_${Date.now()}.jpg`);
    }
});

// filter image upload
let imageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public/images/foliofit");
    },
    filename: function(req, file, cb) {
        cb(
            null,
            `${file.fieldname}_${Date.now()}` + path.extname(file.originalname)
        );
        //cb(null, `${file.fieldname}_${Date.now()}.jpg`);
    },
});

const uploadImage = multer({
    storage: imageStorage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    },
}).single("image");

let dietdayStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public/images/foliofit");
    },
    filename: function(req, file, cb) {
        cb(
            null,
            file.originalname
        );
        //cb(null, `${file.fieldname}_${Date.now()}.jpg`);
    },
});

const dietdayUpload = multer({
    storage: dietdayStorage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    },
})

function checkFileType(file, cb) {
    // Allowed ext  
    const filetypes = /jpeg|jpg|png|gif/;
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

let upload = multer({ storage: storage })
router.use("/", express.static("public/images/foliofit"));

const authController = require('../controllers/authController');
const dietController = require('../controllers/dietController');
const nutrichartController = require('../controllers/nutrichartController');

const nutrichartCategoryBasedController = require('../controllers/foliofit/nutrichartCategoryBasedController')
const nutrichartVitaminController = require('../controllers/foliofit/nutrichartVitaminController')

// This is for foliofit master yoga---------------------
const foliofitMasterController = require('../controllers/foliofit/foliofitMasterController');
const foliofitMainSectionController = require('../controllers/foliofitMainSectionController');
const foliofitTestimonialController = require('../controllers/foliofit/foliofitTestimonialController');


const yogaController = require('../controllers/foliofit/yogaController');
const fitnessClubController = require('../controllers/foliofit/fitnessClubController');
const proCategoryController = require('../controllers/proCategoryController');
const { checkFoliofitFitnessCLubFile } = require('./middlewares/checkFile');

router.use(authController.protect);

// Main Sections
router.post('/add_foliofit_main_sections', uploadImage, foliofitMainSectionController.addFoliofitMainSection)
router.get('/get_foliofit_main_sections', foliofitMainSectionController.getFoliofitMainSections)

//diet regime APIs
router.post('/addDietPlan', upload.single('image'), dietController.addDietPlan)
router.get('/viewAllDietPlans', dietController.viewAllDietPlans)
router.get('/list_diet_plans', dietController.viewDietPlansNameAndId)
router.get('/viewDietPlan/:id', dietController.viewDietPlan)
router.put('/editDietPlan', upload.single('image'), dietController.editDietPlan)
router.delete('/deleteDietPlan/:id', dietController.deleteDietPlan)
router.post('/upload_image',upload.single('image'), dietController.uploadFoliofitImage)
router.post('/addDay',upload.single('image'), dietController.addDay)
router.get('/viewAllDays', dietController.viewAllDays)
router.get('/viewDaysByDiet/:id', dietController.viewDaysByDiet)
router.get('/viewDay/:id', dietController.viewDay)
router.put('/editDay',upload.single('image'), dietController.editDay)
router.delete('/deleteDay/:id', dietController.deleteDay)

//nutrichart APIs
router.post('/addNutrichartCategory', upload.single('image'), nutrichartController.addNutrichartCategory)
router.get('/viewAllNutrichartCategories', nutrichartController.viewAllNutrichartCatergories)
router.get('/viewNutrichartCategory/:id', nutrichartController.viewNutrichartCategory)
router.put('/editNutrichartCategory', upload.single('image'), nutrichartController.editNutrichartController)
router.delete('/deleteNutrichartCategory/:id', nutrichartController.deletedNutrichartCategory)

router.post('/addNutrichartFood', upload.fields([{
    name: 'image',
    maxCount: 1
}, {
    name: 'banner',
    maxCount: 1
}]), nutrichartController.addNutrichartFood)
router.get('/viewAllNutrichartFoods/:id', nutrichartController.viewAllNutrichartFoods)
router.get('/viewNutrichartFood/:id', nutrichartController.viewNutrichartFood)
router.put('/editNutrichartFood', upload.fields([{
    name: 'image',
    maxCount: 1
}, {
    name: 'banner',
    maxCount: 1
}]), nutrichartController.editNutrichartFood)
router.delete('/deleteNutrichartFood/:id', nutrichartController.deleteNutrichartFood)




/* Foliofit Master Nutrichart Category Based APIs
============================================= */
router.post('/add_nutrichart_category_based', upload.single('image'), nutrichartCategoryBasedController.addNutrichartCategoryBased)
router.get('/get_nutrichart_category_based', nutrichartCategoryBasedController.getAllNutrichartCategoryBased)
router.get('/get_nutrichart_category_based_by_id/:id', nutrichartCategoryBasedController.getNutrichartCategoryBasedById)
router.put('/edit_nutrichart_category_based', upload.single('image'), nutrichartCategoryBasedController.editNutrichartCategoryBased)
router.delete('/delete_nutrichart_category_based/:id', nutrichartCategoryBasedController.deleteNutrichartCategoryBased)
//master nutrichart recommended
router.get('/get_nutrichart_recommended', foliofitMasterController.getAllNutrichartRecommended)
router.post('/delete_nutrichart_recommended', foliofitMasterController.deleteNutrichartRecommended)



/* Master Nutrichart Vitamin Based APIs
============================================= */
router.post('/add_nutrichart_vitamin', upload.single('image'), nutrichartVitaminController.addNutrichartVitamin)
router.get('/get_nutrichart_vitamin', nutrichartVitaminController.getAllNutrichartVitamins)
router.get('/get_nutrichart_vitamin_by_id/:id', nutrichartVitaminController.getNutrichartVitaminsById)
router.put('/edit_nutrichart_vitamin', upload.single('image'), nutrichartVitaminController.editNutrichartVitamin)
router.delete('/delete_nutrichart_vitamin/:id', nutrichartVitaminController.deleteNutrichartVitamin)




/* Foliofit Master yoga APIs
============================================= */

router.get('/get_all_foliofit_master_yoga_home', foliofitMasterController.getAllFoliofitMasterYogaHome)
router.get('/get_foliofit_master_yoga_home/:id', foliofitMasterController.getFoliofitMasterYogaHome)
router.put('/edit_foliofit_master_yoga_home',upload.single('image'), foliofitMasterController.editFoliofitMasterYogaHome)
router.delete('/delete_foliofit_master_yoga_home/:id', foliofitMasterController.deleteFoliofitMasterYogaHome)

/* Foliofit Master Yoga Main Category APIs
============================================= */
router.post(
  "/add_foliofit_master_yoga_main_category",
  upload.fields([
      {
          name: "icon",
          maxCount: 1,
      },
      {
          name: "banner",
          maxCount: 1,
      },
  ]),
  foliofitMasterController.addFoliofitMasterYogaMainCategory
);

router.get('/get_all_foliofit_master_yoga_main_category', foliofitMasterController.getAllFoliofitMasterYogaMainCategory)
router.get('/get_foliofit_master_yoga_main_category/:id', foliofitMasterController.getFoliofitMasterYogaMainCategory)
router.put(
  "/edit_foliofit_master_yoga_main_category",
  upload.fields([
      {
          name: "icon",
          maxCount: 1,
      },
      {
          name: "banner",
          maxCount: 1,
      },
  ]),
  foliofitMasterController.editFoliofitMasterYogaMainCategory
);

router.delete('/delete_foliofit_master_yoga_main_category/:id', foliofitMasterController.deleteFoliofitMasterYogaMainCategory)







/* Foliofit Master Yoga Weekly Workout APIs
============================================= */
router.post('/add_foliofit_master_yoga_weekly',upload.single('image'), foliofitMasterController.addFoliofitMasterYogaWeekly)
router.get('/get_all_foliofit_master_yoga_weekly', foliofitMasterController.getAllFoliofitMasterYogaWeekly)
router.get('/get_foliofit_master_yoga_weekly/:id', foliofitMasterController.getFoliofitMasterYogaWeekly)
router.put('/edit_foliofit_master_yoga_weekly',upload.single('image'), foliofitMasterController.editFoliofitMasterYogaWeekly)
router.delete('/delete_foliofit_master_yoga_weekly/:id', foliofitMasterController.deleteFoliofitMasterYogaWeekly)

/* Foliofit Master Yoga Start Your Healthy APIs
============================================= */
router.post(
    "/add_foliofit_master_yoga_healthy",
    upload.fields([{
            name: "icon",
            maxCount: 1,
        },
        {
            name: "banner",
            maxCount: 1,
        },
    ]),
    foliofitMasterController.addFoliofitMasterYogaHealthy
);

router.get('/get_all_foliofit_master_yoga_healthy', foliofitMasterController.getAllFoliofitMasterYogaHealthy)
router.get('/get_foliofit_master_yoga_healthy/:id', foliofitMasterController.getFoliofitMasterYogaHealthy)
router.put(
    "/edit_foliofit_master_yoga_healthy",
    upload.fields([{
            name: "icon",
            maxCount: 1,
        },
        {
            name: "banner",
            maxCount: 1,
        },
    ]),
    foliofitMasterController.editFoliofitMasterYogaHealthy
);

router.delete('/delete_foliofit_master_yoga_healthy/:id', foliofitMasterController.deleteFoliofitMasterYogaHealthy)



/* Foliofit Master Yoga Recommend APIs
============================================= */
router.post(
    "/add_foliofit_master_yoga_recommend",
    upload.fields([{
            name: "icon",
            maxCount: 1,
        },
        {
            name: "banner",
            maxCount: 1,
        },
    ]),
    foliofitMasterController.addFoliofitMasterYogaRecommend
);

router.get('/get_all_foliofit_master_yoga_recommend', foliofitMasterController.getAllFoliofitMasterYogaRecommend)
router.get('/get_foliofit_master_yoga_recommend/:id', foliofitMasterController.getFoliofitMasterYogaRecommend)
router.put(
    "/edit_foliofit_master_yoga_recommend",
    upload.fields([{
            name: "icon",
            maxCount: 1,
        },
        {
            name: "banner",
            maxCount: 1,
        },
    ]),
    foliofitMasterController.editFoliofitMasterYogaRecommend
);

router.delete('/delete_foliofit_master_yoga_recommend/:id', foliofitMasterController.deleteFoliofitMasterYogaRecommend)

router.get('/get_health_reminder', foliofitMasterController.getHealthReminder)
router.post('/get_date_health_reminder', foliofitMasterController.getDateHealthReminder)
router.get('/get_health_calculator', foliofitMasterController.getHealthCalculator)
router.post('/get_date_health_calculator', foliofitMasterController.getDateHealthCalculator)

//FolioFit Master  fitnes club Master Weekly Workout
router.get('/get_foliofit_master_weekly_workouts', foliofitMasterController.getFoliofitWeeklyWorkout)
router.post('/add_foliofit_master_weekly_workout', upload.single('banner'), foliofitMasterController.addFoliofitWeeklyWorkout)
router.get('/get_foliofit_master_weeklyworkout_by_id/:id', foliofitMasterController.getFoliofitWeeklyWorkoutById)
router.put('/edit_foliofit_master_weekly_workout/:id', upload.single('banner'), foliofitMasterController.editFoliofitWeeklyWorkout)
router.delete('/delete_foliofit_master_weekly_workout/:id', foliofitMasterController.deleteFoliofitWeeklyWorkout)

//FOLIOFIT FITNESS CLUB HOME PAGE
router.post('/add_foliofit_home', foliofitMasterController.addFoliofitHome)
router.get('/get_foliofit_home', foliofitMasterController.getFoliofitHome)









/* Foliofit Master Fitness Club  Main Category APIs
============================================= */
router.post(
  "/add_foliofit_master_fitnessclub_main_category",
  upload.fields([
      {
          name: "icon",
          maxCount: 1,
      },
      {
          name: "banner",
          maxCount: 1,
      },
  ]),
  foliofitMasterController.addFoliofitMasterFitnessMainCategory
);

router.get('/get_all_foliofit_master_fitnessclub_main_categories', foliofitMasterController.getAllFoliofitMasterFitnessMainCategories)
router.get('/get_foliofit_master_fitnessclub_main_category/:id', foliofitMasterController.getFoliofitMasterFitnessMainCategory)
router.put(
  "/edit_foliofit_master_fitnessclub_main_category",
  upload.fields([
      {
          name: "icon",
          maxCount: 1,
      },
      {
          name: "banner",
          maxCount: 1,
      },
  ]),
  foliofitMasterController.editFoliofitMasterFitnessMainCategory
);

router.delete('/delete_foliofit_master_fitnessclub_main_category/:id', foliofitMasterController.deleteFoliofitMasterFitnessMainCategory)





/* Foliofit Master Fitness Club  All Category Listing APIs
============================================= */

router.get('/get_foliofit_fitness_categories', foliofitMasterController.getFoliofitFitnessCategories)


/* Foliofit Master Yoga  All Category Listing APIs
============================================= */

router.get('/get_foliofit_yoga_categories', foliofitMasterController.getFoliofitYogaCategories)



/* Foliofit Master Nutrichart(categorybased and vitamins) , Nutrichart  All Category Listing APIs
============================================= */

router.get('/get_foliofit_nutrichart_categories', foliofitMasterController.getFoliofitNutrichartCategories)


/* Foliofit Master Fitness Club  Home Workouts APIs
============================================= */
router.post(
  "/add_foliofit_master_fitnessclub_home_workouts",
  upload.fields([
      {
          name: "icon",
          maxCount: 1,
      },
      {
          name: "banner",
          maxCount: 1,
      },
  ]),
  foliofitMasterController.addFoliofitMasterFitnessHomeWorkouts
);

router.get('/get_all_foliofit_master_fitnessclub_home_workouts', foliofitMasterController.getAllFoliofitMasterFitnessHomeWorkouts)
router.get('/get_foliofit_master_fitnessclub_home_workouts/:id', foliofitMasterController.getFoliofitMasterFitnessHomeWorkouts)
router.put(
  "/edit_foliofit_master_fitnessclub_home_workouts",
  upload.fields([
      {
          name: "icon",
          maxCount: 1,
      },
      {
          name: "banner",
          maxCount: 1,
      },
  ]),
  foliofitMasterController.editFoliofitMasterFitnessHomeWorkouts
);

router.delete('/delete_foliofit_master_fitnessclub_home_workouts/:id', foliofitMasterController.deleteFoliofitMasterFitnessHomeWorkouts)




/* Foliofit Master Fitness Club  Full Body Workouts APIs
============================================= */
router.post(
  "/add_foliofit_master_fitnessclub_full_body_workouts",
  upload.fields([
      {
          name: "icon",
          maxCount: 1,
      },
      {
          name: "banner",
          maxCount: 1,
      },
  ]),
  foliofitMasterController.addFoliofitMasterFitnessFullBodyWorkouts
);

router.get('/get_all_foliofit_master_fitnessclub_full_body_workouts', foliofitMasterController.getAllFoliofitMasterFitnessFullBodyWorkouts)
router.get('/get_foliofit_master_fitnessclub_full_body_workouts/:id', foliofitMasterController.getFoliofitMasterFitnessFullBodyWorkouts)
router.put(
  "/edit_foliofit_master_fitnessclub_full_body_workouts",
  upload.fields([
      {
          name: "icon",
          maxCount: 1,
      },
      {
          name: "banner",
          maxCount: 1,
      },
  ]),
  foliofitMasterController.editFoliofitMasterFitnessFullBodyWorkouts
);

router.delete('/delete_foliofit_master_fitnessclub_full_body_workouts/:id', foliofitMasterController.deleteFoliofitMasterFitnessFullBodyWorkouts)



/* Foliofit Master Fitness Club  Commence Your Healthy Journey APIs
============================================= */
router.post(
  "/add_foliofit_master_fitnessclub_healthy_journey",
  upload.fields([
      {
          name: "icon",
          maxCount: 1,
      },
      {
          name: "banner",
          maxCount: 1,
      },
  ]),
  foliofitMasterController.addFoliofitMasterFitnessHealthyJourney
);

router.get('/get_all_foliofit_master_fitnessclub_healthy_journey', foliofitMasterController.getAllFoliofitMasterFitnessHealthyJourney)
router.get('/get_foliofit_master_fitnessclub_healthy_journey/:id', foliofitMasterController.getFoliofitMasterFitnessHealthyJourney)
router.put(
  "/edit_foliofit_master_fitnessclub_healthy_journey",
  upload.fields([
      {
          name: "icon",
          maxCount: 1,
      },
      {
          name: "banner",
          maxCount: 1,
      },
  ]),
  foliofitMasterController.editFoliofitMasterFitnessHealthyJourney
);

router.delete('/delete_foliofit_master_fitnessclub_healthy_journey/:id', foliofitMasterController.deleteFoliofitMasterFitnessHealthyJourney)






/* Foliofit Testimonial - Foliofit  APIs
============================================= */
router.post('/add_foliofit_testimonial',upload.single('image'), foliofitTestimonialController.addFoliofitTestimonial)
router.get('/get_all_foliofit_testimonials', foliofitTestimonialController.getAllFoliofitTestimonials)
router.get('/get_foliofit_testimonial/:id', foliofitTestimonialController.getFoliofitTestimonial)
router.put('/edit_foliofit_testimonial',upload.single('image'), foliofitTestimonialController.editFoliofitTestimonial)
router.delete('/delete_foliofit_testimonial/:id', foliofitTestimonialController.deleteFoliofitTestimonial)


/* Foliofit Testimonial - Yoga  APIs
============================================= */
router.post('/add_yoga_testimonial',upload.single('image'), foliofitTestimonialController.addYogaTestimonial)
router.get('/get_all_yoga_testimonials', foliofitTestimonialController.getAllYogaTestimonials)
router.get('/get_yoga_testimonial/:id', foliofitTestimonialController.getYogaTestimonial)
router.put('/edit_yoga_testimonial',upload.single('image'), foliofitTestimonialController.editYogaTestimonial)
router.delete('/delete_yoga_testimonial/:id', foliofitTestimonialController.deleteYogaTestimonial)


/* Foliofit Testimonial - Web  APIs
============================================= */
router.post('/add_web_testimonial',upload.single('image'), foliofitTestimonialController.addWebTestimonial)
router.get('/get_all_web_testimonials', foliofitTestimonialController.getAllWebTestimonials)
router.get('/get_web_testimonial/:id', foliofitTestimonialController.getWebTestimonial)
router.put('/edit_web_testimonial',upload.single('image'), foliofitTestimonialController.editWebTestimonial)
router.delete('/delete_web_testimonial/:id', foliofitTestimonialController.deleteWebTestimonial)



/* Foliofit Yoga Video  APIs
============================================= */
router.post(
    "/add_foliofit_yoga_video",
    upload.fields([{
            name: "video",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),checkFoliofitFitnessCLubFile,
    yogaController.addFoliofitYogaVideo
);
router.delete("/delete_foliofit_yoga_video/:id", yogaController.deleteVideo);


router.get("/get_all_paginated_foliofit_yoga_video", yogaController.getAllPaginatedFoliofitYogaVideo);
router.get("/get_foliofit_yoga_video_by_id/:id", yogaController.getFoliofitYogaVideoById);
router.post("/search_foliofit_yoga_video", yogaController.searchFoliofitYogaVideo);
router.get("/get_categories_foliofit_yoga_video", yogaController.getFoliofitYogaVideoCategories);
// router.get("/get_all_foliofit_popular_yoga_videos", yogaController.getAllFoliofitPopularYogaVideos);
router.put(
    "/edit_foliofit_yoga_video/:id",
    upload.fields([{
            name: "video",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),checkFoliofitFitnessCLubFile,
    yogaController.editFoliofitYogaVideo
);
router.get("/get_foliofit_yoga_video_by_category/:categoryId", yogaController.getFoliofitYogaVideoByCategory);
router.get('/get_popular_foliofit_yoga',yogaController.listPopularYogaVideo)
router.post('/search_foliofit_popular_yoga',yogaController.searchPopularYogaList)
router.get('/get_foliofit_yoga_byType/:type',yogaController.getYogaSubCatByMain)
router.get('/get_foliofit_yoga_video_byMain/:type',yogaController.getYogaVideoByMain)
/* Foliofit Fitness Club Video  APIs
============================================= */
router.post("/add_fitnessClub_video",upload.fields([{
    name: "video",
    maxCount: 1,
},
{
    name: "thumbnail",
    maxCount: 1,
},
{
    name: "gif",
    maxCount: 1,
},
]),checkFoliofitFitnessCLubFile,fitnessClubController.addVideo)
router.put("/edit_fitnessClub_video/:id",upload.fields([{
    name: "video",
    maxCount: 1,
},
{
    name: "thumbnail",
    maxCount: 1,
},
{
    name: "gif",
    maxCount: 1,
},
]),checkFoliofitFitnessCLubFile,fitnessClubController.editVideo)
router.get('/get_foliofit_fitness_club',fitnessClubController.listFitnessClubVideo)
//Demy Api
router.get('/get_popular_foliofit_fitness_club',fitnessClubController.listPopularFitnessClubVideo)
router.get('/get_foliofit_fitness_club_byId/:id',fitnessClubController.getFitnessClubById)
router.get('/get_foliofit_fitness_club_byType/:type',fitnessClubController.getFitnessSubCatByMain)
router.get('/get_foliofit_fitness_club_video_byMain/:type',fitnessClubController.getFitnessVideoByMain)
router.delete('/delete_foliofit_fitness_club/:id',fitnessClubController.deleteVideo)
router.post('/search_foliofit_fitness_club',fitnessClubController.searchFitnessClubList)
router.post('/search_foliofit_popular_fitness_club',fitnessClubController.searchPopularFitnessClubList)

router.get('/get_fitnessClub_by_catId/:id',fitnessClubController.getFitnessClubByCatId)

// dummy apis for product and category
router.post('/addProCategory', upload.single('image'), proCategoryController.addProCategory)
router.get('/getProCategory', proCategoryController.getProCategory)
router.get('/viewProCategory/:id', proCategoryController.viewProCategory)
router.put('/editProCategory', upload.single('image'), proCategoryController.editProCategory)
router.delete('/deleteProCategory/:id', proCategoryController.deleteProCategory)

//
router.post('/addProduct', upload.single('image'), proCategoryController.addProduct)
router.get('/getProduct', proCategoryController.getProduct)
router.get('/viewProduct/:id', proCategoryController.viewProduct)
router.put('/editProduct', upload.single('image'), proCategoryController.editProduct)
router.delete('/deleteProduct/:id', proCategoryController.deleteProduct)
router.get('/get_product_by_category_id/:categoryId', proCategoryController.getProductByCategoryId)

module.exports = router;