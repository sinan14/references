const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
  type: { type: String, required: [true, "type missing"] },
  contentId: { type: mongoose.Types.ObjectId},
  userId: { type: mongoose.Types.ObjectId, required: [true, "userId missing"]},
  rating: { type: Number }
});

const foliofitRating = mongoose.model("rating", ratingSchema)
module.exports = foliofitRating