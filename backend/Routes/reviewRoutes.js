const express = require("express");
const router = express.Router();
const {
  addOrUpdateRating,
  getRatingsByProduct,
  getAllReviews,
  deleteReview,
} = require("../Controllers/reviewController");
const authMiddleware = require("../Middlewares/authMiddleware");


// POST rating/review
router.post("/add",authMiddleware,addOrUpdateRating);
router.get("/product/:productId", getRatingsByProduct);
router.get("/getall",getAllReviews);
router.delete("/remove/:ratingId",authMiddleware,deleteReview);

module.exports = router;
