import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ✅ Import useNavigate
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import axios from "axios";
import { API_URL } from "./Variable";


const ProductSlider = () => {
  const { productId } = useParams(); // ✅ Extract productId from URL

  const [products, setProducts] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate(); // ✅ Initialize useNavigate

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!productId) return;
      try {
        const response = await axios.get(
          `${API_URL}/product/getrecommanded/${productId}`
        );
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching recommendations:", err.message);
      }
    };
    fetchRecommendations();
  }, [productId]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const productWidth = scrollRef.current.children[0].offsetWidth;
      const gap = 16;
      const visibleCards = 3;
      const scrollAmount = (productWidth + gap) * visibleCards;

      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12 relative">
      <div className="mb-12 flex flex-col md:flex-row items-start justify-between gap-8">
        <h1 className="text-4xl md:text-5xl font-light md:w-[35%] leading-tight">
          Recommandations!
        </h1>
        <p className="text-gray-600 text-lg md:w-[55%] leading-relaxed">
          Get stronger, shinier, and healthier hair with our natural Hair
          Shampoo, Hair Oil, and Hair Pack. Nourish your scalp, reduce hair
          fall, and boost growth. Try it today for flawless hair!
        </p>
      </div>

      <div className="relative flex justify-center items-center">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 md:-left-10 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 p-3 rounded-full z-10 hover:bg-gray-100 hidden md:flex"
        >
          <ChevronLeft size={24} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x w-full md:w-[1050px] no-scrollbar md:overflow-hidden justify-start"
        >
          {products.map((product) => (
            <div
              key={product.productId}
              className="w-[calc(100vw-32px)] md:w-[335px] bg-white border border-gray-300 p-4 snap-start flex-shrink-0 cursor-pointer"
              onClick={() => navigate(`/product/${product.productId}`)} // ✅ Navigate on click
            >
              <div className="aspect-square overflow-hidden mb-4">
                <img
                  src={`${API_URL}/${product.images[0]}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={product.averageRating} />
                <span className="text-sm text-gray-600">
                  ({product.totalRatings})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">₹{product.price}</span>
                <button
                  className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => {
                    window.scrollTo(0, 0); // Scroll to top
                    navigate("/cart");
                  }}
                >
                  Add Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 md:-right-10 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 p-3 rounded-full z-10 hover:bg-gray-100 hidden md:flex"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

const StarRating = ({ rating }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={
          index < rating ? "fill-[#8558B3] text-[#8558B3]" : "text-gray-300"
        }
      />
    ))}
  </div>
);

export default ProductSlider;
