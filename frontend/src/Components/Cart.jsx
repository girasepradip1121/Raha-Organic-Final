import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL, userToken } from "../Components/Variable";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const userData = userToken();
  const userId = userData?.userId;
  const token = userData?.token;

  // Order summary constants
  const shipping = 20.0;
  const tax = 20.0;

  const getCartItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart/getall/${userId}`, {
        headers: { Authorization: `Bearer ${userData?.token}` },
      });
      setCartItems(response.data);
      console.log("cartITEMS", response.data);
    } catch (error) {
      console.log(error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    if (userId) {
      getCartItems();
    }
  }, [userId]);

  const handleUpdateQuantity = async (cartId, quantity) => {
    if (quantity < 1) return handleRemoveItem(cartId);
    try {
      if (!token) {
        toast.error("Please log in to update the cart.");
        return;
      }
      await axios.put(
        `${API_URL}/cart/update/${cartId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${userData?.token}` } }
      );
      const updatedItems = cartItems?.map((item) =>
        item.cartId === cartId ? { ...item, quantity } : item
      );
      setCartItems(updatedItems);
      calculateTotalPrice(updatedItems);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating cart");
    }
  };
  const handleRemoveItem = async (cartId) => {
    try {
      if (!token) {
        toast.error("Please log in to remove items from the cart.");
        return;
      }
      await axios.delete(`${API_URL}/cart/remove/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedItems = cartItems.filter((item) => item.cartId !== cartId);
      setCartItems(updatedItems);
      calculateTotalPrice(updatedItems);
      toast.success("Product Has Been Remove From Cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error removing item");
    }
  };
  // Calculate subtotal
  const calculateTotalPrice = (items) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );
    setTotalPrice(subtotal);
  };
  console.log("total", totalPrice);

  useEffect(() => {
    calculateTotalPrice(cartItems);
  }, [cartItems]);

  // Calculate total
  const total = totalPrice + shipping + tax;

  // Handle checkout
  const handleCheckout = () => {
    if (!token) {
      toast.error("Please log in to proceed to checkout.");
      return;
    }
    navigate("/checkoutpage", { state: { cartItems, totalPrice } });
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top smoothly
  };

  // const handleCheckout = () => {
  //   navigate("/checkoutpage"); // Navigate to the checkout page
  //   window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top smoothly
  // };
  if (!token) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] px-4">
        <div className="text-center bg-white border p-4 sm:p-6 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            Please Login
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mb-4">
            You need to be logged in to view your cart.
          </p>
          <Link
            to="/login"
            className="inline-block w-full sm:w-auto px-6 py-2 bg-[#8558B3] text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title and Breadcrumb */}
        <h1 className="text-3xl font-light mb-8">Your Cart</h1>

        {cartItems?.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Section */}
            <div className="lg:flex-1">
              {/* Table Header - Desktop */}
              <div className="hidden md:grid md:grid-cols-6 border-b border-[#DCDCDC] pb-4 mb-4">
                <div className="col-span-1 font-medium">Product</div>
                <div className="col-span-1 font-medium">Description</div>
                <div className="col-span-1 font-medium text-center">
                  Quantity
                </div>
                <div className="col-span-1 font-medium text-center">Price</div>
                <div className="col-span-1 font-medium text-center">Total</div>
                <div className="col-span-1 font-medium text-center">
                  Actions
                </div>
              </div>

              {/* Cart Items */}
              {cartItems?.map((item) => (
                <div
                  key={item.product.productId}
                  className="border-b border-[#DCDCDC] py-4 mb-4"
                >
                  {/* Mobile View */}
                  <div className="md:hidden grid grid-cols-2 gap-4 mb-4">
                    <div className="col-span-1">
                      <img
                        src={`${API_URL}/${item.product.images[0]}`}
                        alt={item.product.name}
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="col-span-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        Size: {item.product.size}ml
                      </p>
                      <p className="font-medium mt-2">
                        ₹{(item.product?.price ?? 0).toFixed(2)}
                      </p>

                      <div className="flex items-center mt-2 border rounded-md w-fit">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.cartId, item.quantity - 1)
                          }
                          className="px-3 py-1 text-gray-600"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = Number.parseInt(e.target.value);
                            if (!isNaN(val))
                              handleUpdateQuantity(item.cartId, val);
                          }}
                          className="w-10 text-center border-x py-1"
                        />
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.cartId, item.quantity + 1)
                          }
                          className="px-3 py-1 text-gray-600"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <p className="font-medium">
                          Total: ₹
                          {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.cartId)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:grid md:grid-cols-6 md:items-center">
                    <div className="col-span-1">
                      <img
                        src={
                          `${API_URL}/${item.product.images[0]}` ||
                          "/placeholder.svg"
                        }
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="col-span-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        Size: {item.product.size}ml
                      </p>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <div className="flex items-center border border-[#DCDCDC]">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.cartId, item.quantity - 1)
                          }
                          className="px-3 py-1 text-gray-600"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = Number.parseInt(e.target.value);
                            if (!isNaN(val))
                              handleUpdateQuantity(item.cartId, val);
                          }}
                          className="w-10 text-center  py-1"
                        />
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.cartId, item.quantity + 1)
                          }
                          className="px-3 py-1 text-gray-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col-span-1 text-center">
                      ₹{(item.product.price ?? 0).toFixed(2)}
                    </div>
                    <div className="col-span-1 text-center font-medium">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button
                        onClick={() => handleRemoveItem(item.cartId)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping Button */}
              <div className="mt-8">
                <Link
                  to="/allproducts"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <ChevronLeft size={16} className="mr-2" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:w-80 border border-[#DCDCDC] p-6 md:self-start">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">₹{shipping.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-[#DCDCDC] pt-4 mt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-[#8558B3] text-white py-3  font-medium hover:bg-purple-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          // Empty Cart Message
          <div className="text-center py-16 bg-white border rounded-md">
            <div className="max-w-md mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">
                Looks like you haven't added any items to your cart yet. Browse
                our products and find something you'll love!
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-amber-800 text-white rounded-md font-medium hover:bg-amber-900 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
