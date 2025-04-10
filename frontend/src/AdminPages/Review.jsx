import React, { useEffect, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import axios from "axios";
import { API_URL, userToken } from "../Components/Variable";
import { toast } from "react-toastify";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const userData = userToken();
  const token = userData?.token;

  const fetchAllReview = async () => {
    try {
      const response = await axios.get(`${API_URL}/review/getall`);
      setReviews(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch reviews");
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await axios.delete(`${API_URL}/review/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Review deleted successfully");
      fetchAllReview();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete review");
    }
  };

  useEffect(() => {
    fetchAllReview();
  }, []);

  return (
    <div className="w-full p-4 min-h-screen bg-black text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Reviews</h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-700 rounded-xl shadow-md">
          <thead className="bg-gray-800 text-xs uppercase text-gray-300">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Review</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews?.length > 0 ? (
              reviews.map((review) => (
                <tr
                  key={review.ratingId}
                  className="border-b border-gray-700 hover:bg-gray-700 transition-all"
                >
                  <td className="px-4 py-3">{review.product?.name}</td>
                  <td className="px-4 py-3">{review.user?.fullName}</td>
                  <td className="px-4 py-3 text-yellow-400 flex items-center gap-1">
                    {[...Array(Math.round(review.rating))].map((_, index) => (
                      <Star
                        key={index}
                        size={16}
                        fill="#facc15"
                        stroke="none"
                      />
                    ))}
                    <span className="ml-1 text-white">({review.rating})</span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{review.review}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteReview(review.ratingId)}
                      className="text-red-500 hover:text-red-600 flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                  No reviews yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedReviewId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-gray-700 text-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
            <p className="text-gray-400 mb-4">
              Are you sure you want to delete this review?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedReviewId(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={async() => {
                  await handleDeleteReview(selectedReviewId);
                  setSelectedReviewId(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {reviews?.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.ratingId}
              className="bg-gray-800 p-4 rounded-xl shadow border border-gray-700"
            >
              <p className="text-sm text-gray-400">
                <strong className="text-white">Product:</strong>{" "}
                {review.product?.name}
              </p>
              <p className="text-sm text-gray-400">
                <strong className="text-white">User:</strong>{" "}
                {review.user?.fullName}
              </p>
              <p className="text-sm text-yellow-400 flex items-center gap-1 mt-1">
                {[...Array(Math.round(review.rating))].map((_, index) => (
                  <Star key={index} size={16} fill="#facc15" stroke="none" />
                ))}
                <span className="ml-1 text-white">({review.rating})</span>
              </p>
              <p className="text-sm text-gray-300 mt-2">
                <strong>Review:</strong> {review.review}
              </p>
              <p className="text-sm text-gray-400">
                <strong>Date:</strong>{" "}
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={() => setSelectedReviewId(review.ratingId)}
                className="text-red-500 hover:text-red-600 flex items-center gap-1"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 mt-4">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
