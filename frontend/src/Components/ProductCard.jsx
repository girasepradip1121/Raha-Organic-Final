import React from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";
import { API_URL } from "./Variable";

const ProductCard = ({ product, addToCart }) => {
  const navigate = useNavigate();

  // ✅ Prevent rendering if product is undefined
  if (!product) {
    return <div className="p-4 border border-gray-300">Loading...</div>;
  }

  return (
    <div
      onClick={() => {
        window.scrollTo(0, 0);
        navigate(`/product/${product.productId || ""}`);
      }}
      className="bg-white p-4 sm:p-6 border border-[#DCDCDC] transition"
    >
      <div className="aspect-w-11/9 overflow-hidden mb-4">
        <img
          src={`${API_URL}/${product.images[0]}` ? `${API_URL}/${product.images[0]}` : "/placeholder.svg"} // ✅ Ensure image is always defined
          alt={product.name ? product.name : "Product Image"}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <h3 className="text-base sm:text-lg font-semibold mb-2">
        {product.name ? product.name : "Untitled Product"}
      </h3>
      <div className="flex items-center gap-2 mb-2">
        <StarRating rating={product.averageRating || 0} />
        <span className="text-sm text-gray-600">
          ({product.totalRatings ? product.totalRatings : 0})
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg sm:text-xl font-bold">
          ₹{product.price ? product.price.toFixed(2) : "0.00"}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart?.(product);
          }}
          className="bg-black text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Add Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
