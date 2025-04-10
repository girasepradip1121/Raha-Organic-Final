import React from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating ? "fill-[#8558B3] text-[#8558B3]" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

export default StarRating;
