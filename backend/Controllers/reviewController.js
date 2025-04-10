const Rating = require("../Models/ratingModel");
const Product = require("../Models/productModel");
const User = require("../Models/usermodel");
const { Op } = require("sequelize");

const addOrUpdateRating = async (req, res) => {
  const { productId, userId, rating, review } = req.body;

  try {
    let message = "";

    console.log("Incoming Data:", req.body);

    // Check if rating already exists
    const existingRating = await Rating.findOne({
      where: {
        productId,
        userId,
      },
    });

    if (existingRating) {
      // Update existing rating
      await Rating.update(
        { rating, review },
        { where: { ratingId: existingRating.ratingId } }
      );
      message = "Rating updated successfully";
    } else {
      // Create new rating
      await Rating.create({ productId, userId, rating, review });
      message = "Rating added successfully";
    }

    const ratings = await Rating.findAll({ where: { productId } });

    const totalRatings = ratings.length;
    const sumRatings = ratings.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = Math.round(sumRatings / totalRatings);

    // ✅ Update Product model
    await Product.update(
      { averageRating, totalRatings },
      { where: { productId } }
    );

    res.status(200).json({ message });
  } catch (error) {
    console.error("Error in addOrUpdateRating:", error);
    res.status(500).json({ message: "Failed to submit rating", error });
  }
};

const getRatingsByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const ratings = await Rating.findAll({
      where: { productId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(ratings);
  } catch (error) {
    console.error("Error in getRatingsByProduct:", error);
    res.status(500).json({ message: "Failed to fetch ratings", error });
  }
};

// GET /review/all
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Rating.findAll({
      include: [
        { model: Product, attributes: ["name"] },
        { model: User, attributes: ["fullName", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const rating = await Rating.findOne({ where: { ratingId } });
    if (!rating) return res.status(400).json({ message: "Review not found" });

    await rating.destroy();
    res.status(200).json("Review deleted successully");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to delete Review" });
  }
};

module.exports = {
  addOrUpdateRating,
  getRatingsByProduct,
  getAllReviews,
  deleteReview,
};
