"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Star } from "lucide-react";
import axios from "axios";
import { API_URL, userToken } from "./Variable";
import { toast } from "react-hot-toast";
import PropTypes from "prop-types";



export default function ItemListing() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const userData = userToken();
  const userId = userData?.userId;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/product/best-sellers`);
        console.log("data", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error Fetching Products:", error);
        setProducts([]);
      }
    };
    fetchProduct();
  }, []);

  const handleAddToCart = async (product) => {
    if (!userId) {
      toast.error("Please log in to add items to cart.");
      navigate("/login");
      return;
    }
    try {
      await axios.post(`${API_URL}/cart/add`, {
        productId: product.productId,
        userId,
        quantity: 1,
      }, { headers: { Authorization: `Bearer ${userData?.token}` },});
      toast.success(`Product has been added to your cart.`);
    } catch (error) {
      toast.error("Error To Add To Cart");
      console.log(error);
    }
  };

  return (
    <div className="px-8 py-8">
      <h1 className="text-3xl font-serif mb-6">All Items</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ItemCard
            key={product.productId}
            product={product}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>
    </div>
  );
}

function ItemCard({ product, onAddToCart }) {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <>
    <div
      className="border border-gray-200 p-4 rounded-sm cursor-pointer"
      onClick={() => navigate(`/product/${product?.productId}`)} // Navigate when card is clicked
    >
      <div className="mb-3">
        <img
          src={`${API_URL}/${product?.images[0].imageUrl}`}
          alt={product?.name}
          className="w-full h-auto object-contain"
        />
      </div>

      <h2 className="text-base font-medium mb-2">{product?.name}</h2>

      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < product?.averageRating
                ? "fill-purple-600 text-purple-600"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
        <span className="text-xs text-gray-500 ml-2">({product?.totalRatings})</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-medium">₹{product?.price.toFixed(2)}</span>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent navigation when clicking "Add Cart"
            onAddToCart();
            window.scrollTo(0, 0); // Scroll to top
            navigate("/cart"); // Navigate to cart page
          }}
          className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Add Cart
        </button>
      </div>
    </div>
    </>
  );
}

// Add PropTypes validation for JavaScript
ItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    reviews: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};