"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom"; // ✅ Import useNavigate
import axios from "axios";
import { API_URL, userToken } from "./Variable";
import { toast } from "react-hot-toast";

const Product = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const { productId } = useParams();
  const userData = userToken();
  const userId = userData?.userId;

  // Sample product images

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching product data...");
        const response = await axios.get(
          `${API_URL}/product/getproductbyid/${productId}`
        );
        setProduct(response.data);
        console.log("API Response:", response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProducts();
  }, [productId]);

  const handleAddToCart = async (product) => {
    if (!userId) {
      toast.error("Please log in to add items to cart.");
      navigate("/login");
    }
    else{
      setTimeout(() => navigate("/cart"), 2000);
    }
    try {
      await axios.post(`${API_URL}/cart/add`, {
        productId: product.productId,
        userId,
        quantity: 1,
      });
      toast.success(`Product has been added to your cart.`);
    } catch (error) {
      console.log(error);
      toast.error(`Error To Add Product In Cart`);
    }
  };

  // Function to handle thumbnail click
  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API_URL}/review/product/${productId}`);
        setReviews(res.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [productId]);

  // Submit review
  const handleSubmitReview = async () => {
    if (!rating || !comment) {
      return toast.error("Please provide both rating and review");
    }

    try {
      await toast.promise(
        axios.post(
          `${API_URL}/review/add`,
          {
            productId,
            userId,
            rating,
            review: comment,
          },
          { headers: { Authorization: `Bearer ${userData?.token}` } }
        ),
        {
          loading: "Submitting your review...",
          success: "Review submitted successfully",
          error: "Failed to submit review",
        }
      );

      setRating(0);
      setComment("");

      // Fetch updated reviews after short delay (to ensure DB is updated)
      setTimeout(async () => {
        try {
          const res = await axios.get(`${API_URL}/review/product/${productId}`);
          setReviews(res.data);
        } catch (err) {
          console.error("Error loading updated reviews:", err);
          // toast.error("Review added, but failed to load latest reviews.");
        }
      }, 1000); // wait 0.5 second
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
        {/* Left Section - Product Image */}
        <div className="w-full md:w-1/2">
          {/* Main Image Container */}
          {product?.images?.length > 0 && (
            <div className=" overflow-hidden w-80 h-80 flex items-center justify-center">
              <img
                src={`${API_URL}/${product.images[selectedImage]}`}
                alt="Product Image"
                className="w-full h-full object-contain"
              />
            </div>
          )}
          {/* Thumbnails Row - Outside and Below Main Image */}
          <div className="flex justify-start gap-2 mt-4 w-full overflow-x-auto">
            {product?.images?.map((image, index) => (
              <div
                key={index}
                className={`w-24 h-24 overflow-hidden flex-shrink-0 cursor-pointer border-2 ${
                  selectedImage === index
                    ? "border-purple-600"
                    : "border-gray-200"
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img
                  src={`${API_URL}/${image}`}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Product Details */}
        <div className="w-full md:w-1/2">
          <div className="border border-gray-200 p-6">
            {/* Rating */}
            <div className="flex items-center mb-4">
              {Array.from({ length: product?.averageRating }, (_, index) => (
                <span key={index} className="text-yellow-400 text-xl">
                  ★
                </span>
              ))}
              {Array.from(
                { length: 5 - product?.averageRating },
                (_, index) => (
                  <span key={index} className="text-xl text-gray-300">
                    ★
                  </span>
                )
              )}
              <span className="ml-2 text-gray-600">
                {product?.averageRating}({product?.totalRatings})
              </span>
            </div>

            {/* Product Title */}
            <h2 className="text-2xl font-semibold mb-6 text-purple-700">
              {product?.name}
            </h2>

            {/* Price Section */}
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-red-600 text-white text-sm font-semibold px-3 py-1 ">
                {product?.discountLabel}
              </div>
              <span className="text-purple-700 text-2xl font-semibold">
                ₹{product?.price}
              </span>
            </div>

            {/* Original Price */}
            <div className="flex gap-4 mb-4 text-sm text-gray-500">
              <span>M.R.P: ₹{product?.originalPrice}</span>
              <span>Inclusive of all taxes</span>
            </div>

            {/* Product Description */}
            <p className="text-gray-700 mb-8">{product?.description}</p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  if (!userId) {
                    toast.error("Please log in to continue.");
                    navigate("/login");
                    return;
                  }
                  navigate("/checkoutpage", {
                    state: { product: { ...product, quantity: 1 } },
                  });
                }}
                className="bg-purple-600 text-white py-3 px-4 hover:bg-purple-700 w-full rounded"
              >
                Buy Now
              </button>

              <button
                onClick={() => {
                  handleAddToCart(product);
                  window.scrollTo(0, 0);
                  // setTimeout(() => navigate("/cart"), 2000);
                }}
                className="bg-purple-200 text-purple-700 py-3 px-4 hover:bg-purple-300 w-full flex items-center justify-center rounded"
              >
                Add Cart <ShoppingCart className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section  */}

      <div className="mt-12 max-w-5xl mx-auto px-4 sm:px-6 border-t pt-8">
        <h3 className="text-xl sm:text-2xl font-bold text-purple-700 mb-6 text-center sm:text-left">
          Customer Reviews
        </h3>

        {/* 🔘 Review Submission Box */}
        {userId ? (
          <div className="mb-10 p-4 sm:p-6 border rounded-lg bg-gray-50 shadow-sm">
            <label className="block font-medium text-gray-700 mb-2 text-sm sm:text-base">
              Rate this product
            </label>
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  } focus:outline-none`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your thoughts about the product..."
              className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-purple-300 mb-4 text-sm sm:text-base"
              rows={4}
            />

            <button
              onClick={handleSubmitReview}
              className="bg-purple-600 text-white py-2 px-4 sm:px-6 rounded hover:bg-purple-700 transition duration-200 text-sm sm:text-base w-full sm:w-auto"
            >
              Submit Review
            </button>
          </div>
        ) : (
          <p className="text-gray-600 mb-6 text-center text-sm sm:text-base">
            Please{" "}
            <span
              className="text-purple-600 font-semibold cursor-pointer"
              onClick={() => navigate("/login")}
            >
              log in
            </span>{" "}
            to leave a review.
          </p>
        )}

        {/* 🔁 Review List */}
        <div className="space-y-4 sm:space-y-6">
          {reviews.length > 0 ? (
            reviews.map((rev, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 border rounded-md shadow-sm bg-white hover:shadow-md transition duration-300"
              >
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-base sm:text-lg ${
                        i < rev.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm sm:text-base">
                  {rev.review}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Reviewed on {new Date(rev.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm sm:text-base text-center sm:text-left">
              No reviews yet for this product.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;
