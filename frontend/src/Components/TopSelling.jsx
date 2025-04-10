import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import ProductCard from "./ProductCard"; // Importing ProductCard component
import axios from "axios";
import { API_URL, userToken } from "./Variable";
// import { toast, ToastContainer } from "react-toastify";
import { toast } from 'react-hot-toast';


const TopSeller = () => {
  const [showAll, setShowAll] = useState(false);
  const [cart, setCart] = useState([]);
  const [products,setProducts]=useState([])
  const navigate = useNavigate(); 
  const userData=userToken()
  const userId=userData?.userId;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/product/getall`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error Fetching Products:", error);
        setProducts([]);
      }
    };
    fetchProduct();
  }, []);
  
  // const handleAddToCart=async(product)=>{
  //   try {
  //     await axios.post(`${API_URL}/cart/add`,
  //       {productId:product.productId,userId,quantity:1}
  //     )
  //     toast.success(`Product has been added to your cart.`);
  //   } catch (error) {
  //     toast.error(`Error To Add Product In Cart`);
  //     console.log(error);
  //   }
  // } 

  const handleAddToCart=async(product)=>{
    if (!userId) {
      toast.error("Please log in to add items to cart.");
      navigate("/login");
      return;
    }
    try {
      await axios.post(`${API_URL}/cart/add`,
        {productId:product.productId,userId,quantity:1},
        { headers: { Authorization: `Bearer ${userData?.token}` },}
      )
      toast.success(`Product has been added to your cart.`);
    } catch (error) {
      console.log(error);
      toast.error(`Error To Add Product In Cart`);
    }
  } 
  return (
    <>
    {/* <ToastContainer/> */}
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      {/* Title & Description */}
      <div className="max-w-7xl mx-auto mb-8 sm:mb-12 flex flex-col md:flex-row items-start justify-start gap-4 sm:gap-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light md:w-[35%] leading-tight">
          Top-Selling Hair Essential!
        </h1>
        <p className="text-gray-600 text-base sm:text-lg md:w-[55%] leading-relaxed">
          Get stronger, shinier, and healthier hair with our natural Hair
          Shampoo, Hair Oil, and Hair Pack. Nourish your scalp, reduce hair
          fall, and boost growth. Try it today for flawless hair!
        </p>
      </div>

      {/* Mobile Horizontal Scroll View */}
      <div className="md:hidden">
        <div className="overflow-x-auto pb-6 -mx-4 px-4">
          <div className="flex space-x-4 w-max">
            {products?.map((product) => (
              <div key={product.productId} className="w-64">
                <ProductCard product={product} addToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Grid Layout - Hidden on Mobile */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showAll ? (
            products?.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                addToCart={handleAddToCart}
              />
            ))
          ) : (
            <>
              <div className="flex items-center justify-center">
                <ProductCard product={products[0]} addToCart={handleAddToCart} />
              </div>
              <div className="flex flex-col gap-6">
                <ProductCard product={products[1]} addToCart={handleAddToCart} />
                <ProductCard product={products[2]} addToCart={handleAddToCart} />
              </div>
              <div
                onClick={() => setShowAll(true)}
                className="bg-white p-6 border border-[#DCDCDC] flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2 text-xl font-semibold">
                  <span>View All</span>
                  <ChevronRight size={24} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default TopSeller;
