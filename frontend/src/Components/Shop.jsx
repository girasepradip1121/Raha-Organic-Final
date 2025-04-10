"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL, userToken } from "./Variable";
import { toast } from "react-hot-toast";

// const categories = [
//   "All Product",
//   "Hair Shampoo",
//   "Hair Oil",
//   "Hair Pack",
//   "Best Combs",
// ];

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${product.productId}`);
  };

  return (
    <div
      className="w-full bg-white border border-gray-200 p-5 rounded-sm cursor-pointer"
      onClick={handleProductClick}
    >
      {/* {console.log("image", `${API_URL}/${product.images[0]}`)} */}
      <img
        // src={product.image}
        src={`${API_URL}/${product.images[0]}`}
        alt={product.name}
        className="w-full h-56 object-cover rounded-md"
      />
      <h2 className="mt-3 text-lg font-semibold">{product.name}</h2>

      {/* Star Ratings */}
      <div className="flex items-center mt-2 text-[#8558B3]">
        {Array.from({ length: product.averageRating }, (_, index) => (
          <span key={index} className="text-lg">
            ★
          </span>
        ))}
        {Array.from({ length: 5 - product.averageRating }, (_, index) => (
          <span key={index} className="text-lg text-gray-300">
            ★
          </span>
        ))}
        <span className="text-gray-600 ml-2 text-sm">
          ({product.totalRatings})
        </span>
      </div>

      {/* Price and Add to Cart */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-xl font-bold text-gray-900">
          ₹{product.price.toFixed(2)}
        </p>
        <button
          className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-all cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
            window.scrollTo(0, 0); // Scroll to top
            navigate("/cart");
          }}
        >
          Add Cart
        </button>
      </div>
    </div>
  );
}

export default function ShopProduct() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";
  const navigate = useNavigate();
  const userData = userToken();
  const userId = userData?.userId;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/product/getall`);
        console.log("data", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error Fetching Products:", error);
        setProducts([]);
      }
    };
    fetchProduct();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/category/getall`);
      console.log("Categories Data:", response.data);

      // Manually add "All Product" at the start
      setCategories([
        { categoryId: "all", name: "All Product" },
        ...response.data,
      ]);
    } catch (error) {
      console.error("Error Fetching Categories:", error);
      setCategories([{ categoryId: "all", name: "All Product" }]); // Still include "All Product"
    }
  };

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
    } catch (error) {}
  };

  // const filteredProducts =
  //   selectedCategory === "all"
  //     ? products
  //     : products.filter((product) => product.categoryId === selectedCategory);

  const categoryFilteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.categoryId === selectedCategory);

      const filteredProducts = categoryFilteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      

  useEffect(() => {
    if (searchQuery) {
      setSelectedCategory("all");
    }
  }, [searchQuery]);

  return (
    <>
      <div className="px-8 sm:px-6 md:px-8 lg:px-16 py-8">
        <h1 className="text-3xl font-light mb-8 text-center md:text-left">
          Shop Product
        </h1>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar for Categories */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-200 font-medium text-lg">
                Category
              </div>
              <ul>
                {categories?.map((category) => (
                  <li
                    key={category.categoryId}
                    className={`cursor-pointer p-4 transition-colors text-center md:text-left ${
                      selectedCategory === category.categoryId
                        ? "bg-purple-600 text-white font-semibold"
                        : "bg-gray-50 text-gray-800 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedCategory(category.categoryId)}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Product Display Section */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No products found in this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
