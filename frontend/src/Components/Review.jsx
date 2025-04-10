import React, { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";
import { API_URL } from "../Components/Variable";

const StarRating = ({ rating }) => (
  <div className="flex gap-1 text-[#8558B3]">
    {[...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? "fill-[#8558B3]" : "text-gray-300"}
      />
    ))}
  </div>
);

const ReviewCard = ({ review }) => (
  <div className="bg-white border border-gray-300 p-6 min-w-full transition-transform hover:scale-105">
    <div className="flex items-center gap-3 mb-4">
      <img
        src={
          review.user?.profile || // if you have profile pic
          `https://ui-avatars.com/api/?name=${review.user?.fullName}` // fallback image
        }
        alt={review.user?.fullName}
        className="w-12 h-12 rounded-full border"
      />
      <div>
        <h4 className="font-semibold text-lg">{review.user?.fullName}</h4>
        <StarRating rating={Math.round(review.rating)} />
      </div>
    </div>
    <p className="text-gray-600">{review.review}</p>
  </div>
);

const Review = () => {
  const scrollRef = useRef(null);
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/review/getall`);
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile || !scrollRef.current) return;

    const interval = setInterval(() => {
      if (
        scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
        scrollRef.current.scrollWidth
      ) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({
          left: scrollRef.current.clientWidth,
          behavior: "smooth",
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [reviews]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Title & Description */}
      <div className="mb-12 flex flex-col md:flex-row items-start justify-between gap-8">
        <h1 className="text-4xl md:text-5xl font-light md:w-[35%] leading-tight">
          See What Customers Say!
        </h1>
        <p className="text-gray-600 text-lg md:w-[55%] leading-relaxed">
          See what customers say about our best-selling hair care products! Real
          reviews, real results – experience stronger, shinier, and healthier
          hair with our shampoo, oil, and hair pack. Try it today!
        </p>
      </div>

      {/* Mobile Slider */}
      <div className="md:hidden overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {reviews.map((review) => (
            <ReviewCard key={review.ratingId} review={review} />
          ))}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.ratingId} review={review} />
        ))}
      </div>
    </div>
  );
};

export default Review;
