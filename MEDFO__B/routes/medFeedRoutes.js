const express = require("express");
const router = express.Router();
const multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_${Date.now()}.jpg`);
  },
});

let upload = multer({ storage: storage });

// filter image upload
let imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/ads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}_${Date.now()}` + path.extname(file.originalname)
    );
    //cb(null, `${file.fieldname}_${Date.now()}.jpg`);
  },
});

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image");
function checkFileType(file, cb) {
  // Allowed ext
  console.log('tffile',file)
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

router.use("/", express.static("public/images"));

const authController = require("./../controllers/authController");
const adminController = require("../controllers/adminController");
const quizController = require("./../controllers/quizController");
const articleController = require("../controllers/articleController");
const healthTipController = require("../controllers/healthTipController");
const medfeedMainSectionsController = require('../controllers/medfeedMainSectionsController')


router.use(authController.protect);
router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get(
  "/viewHealthcareVideoSubCategories",
  adminController.viewHealthCareVideoSubCategories
  );
  
  // ** medfeed main section adding ** //
  router.post("/add_main_section",upload.single('image'), medfeedMainSectionsController.addSection);
  
  //Quiz Api
  router.get("/quizes", quizController.listQuiz);
  router.post("/quizes", quizController.addQuiz);
  router.put("/edit_quiz/:id", quizController.editQuiz)
  router.get('/enable_disable_quiz/:id', quizController.deactivateQuiz)
  router.delete('/deleteQuiz/:id', quizController.deleteQuiz)


//article apis
// router.get(
//   "/viewAllArticleSubCategories",
//   adminController.viewAllArticleSubCategories
// );
router.post(
  "/addArticle",
  upload.single("image"),
  articleController.addArticle
);
router.get("/viewAllArticles", articleController.viewAllArticles);
router.get("/viewMostViewedArticles", articleController.viewMostViewedArticles);
router.get('/viewMostSharedArticles', articleController.viewMostSharedArticles);
router.get('/list_articles', articleController.listArticles)
router.get("/viewArticle/:id", articleController.viewArticleById);
router.post(
  "/viewArticlesBySubcategory",
  articleController.viewArticlesBySubcategory
);
router.get(
  "/viewArticlesByCategory/:id",
  articleController.viewArticlesByCategory
);
router.get("/viewTrendingArticles", articleController.viewTrendingArticles);
router.get("/viewNewestArticles", articleController.viewNewestArticles);
router.get(
  "/viewhomepageMainArticles",
  articleController.viewHomepageMainArticles
);
router.get(
  "/viewhomepageSubArticles",
  articleController.viewhomepageSubArticles
);
router.post("/searchArticleAdmin", articleController.searchArticleAdmin);
router.put(
  "/editArticle",
  upload.single("image"),
  articleController.editArticle
);
router.delete("/deleteArticle/:id", articleController.deleteArticle);

//healthtip apis
router.get(
  "/viewHealthTipCategories",
  healthTipController.viewHealthTipCategories
);
router.post(
  "/addHealthTip",
  upload.single("image"),
  healthTipController.addHealthTip
);
router.get("/viewAllHealthTips", healthTipController.viewAllHealthTips);
router.post(
  "/viewHealthTipsByCategory",
  healthTipController.viewHealthTipsByCategory
);
router.get(
  "/viewTrendingHealthTips",
  healthTipController.viewTrendingHealthTips
);
router.get(
  "/viewMostSharedHealthTips",
  healthTipController.viewMostSharedHealthTips
);
router.get(
  "/viewMostViewedHealthTips",
  healthTipController.viewMostViewedHealthTips
);
router.get("/viewNewestHealthTips", healthTipController.viewNewestHealthTips);
router.post("/searchHealthTips", healthTipController.searchHealthTips);
router.post("/searchHealthTipsByAdmin", healthTipController.searchHealthTipsByAdmin);
router.put(
  "/editHealthTip/:id",
  upload.single("image"),
  healthTipController.editHealthTip
);
router.delete(
  "/deleteHealthTip/:id",
  healthTipController.deleteHealthTip
);
router.get("/getHealthTip/:id", healthTipController.viewHealthTip);
router.get("/getHealthTipTabCount", healthTipController.getHealthTipTabCount);

router.get("/viewTrendingHealthTips/:id",healthTipController.viewTrendingHealthTips);
router.get("/viewMostSharedHealthTips/:id",healthTipController.viewMostSharedHealthTips);
router.get("/viewMostViewedHealthTips/:id",healthTipController.viewMostViewedHealthTips);
router.get("/viewNewestHealthTips/:id", healthTipController.viewNewestHealthTips);



// Quiz apis
router.get('/getLiveQuizzes', quizController.getLiveQuizzes)
// router.get('/getLiveQuizParticipants', quizController.getLiveQuizParticipants)
router.get('/getPreviousQuizWinners', quizController.getPreviousQuizWinners)
router.get('/getWinnersList/:id', quizController.getWinnersList)
router.post('/declare_winner', quizController.declareWinner)   
router.get('/getQuizParticipants/:id', quizController.getQuizParticipants)
router.get('/viewQuiz/:id', quizController.findQuiz)

module.exports = router;
