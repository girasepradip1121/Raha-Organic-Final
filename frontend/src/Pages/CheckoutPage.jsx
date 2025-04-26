"use client";
import { useState } from "react";
import { ChevronLeft, CreditCard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL, userToken } from "../Components/Variable";
import { toast } from "react-hot-toast";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("online");

  const location = useLocation();
  const navigate = useNavigate();
  const userData = userToken();
  const userId = userData.userId;

  const { cartItems, totalPrice } = location.state || {
    cartItems: [],
    totalPrice: 0,
  };

  const directProduct = location.state?.product || null;
  const finalCartItems = directProduct
    ? [{ ...directProduct, quantity: 1 }]
    : cartItems;

  const subtotal = finalCartItems?.reduce((sum, item) => {
    const product = item.product || item; // Cart se hai to item.product, Buy Now se hai to item
    return sum + (product.price || item.price) * (item.quantity || 1);
  }, 0);

  const shipping = 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apt: "",
    city: "",
    state: "",
    postalCode: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.postalCode
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const orderData = {
      userId,
      shippingCharge: shipping,
      tax: tax,
      totalPrice: total,
      paymentMethod,
      formData,
      status: 1,
      orderItems: finalCartItems?.map((item) => {
        const product = item.product || item;
        const productId = item.productId; //  Yeh fix hai
        const price = product.price;
        const quantity = item.quantity || 1;

        return {
          productId,
          quantity,
          price,
          totalAmount: quantity * price,
        };
      }),
    };

    try {
      const razorpayRes = await axios.post(
        `${API_URL}/razorpay/create-razorpay-order`,
        { totalPrice: total }
      );

      const { orderId, key, amount, currency } = razorpayRes.data;

      const options = {
        key,
        amount,
        currency,
        order_id: orderId,
        name: "RAHA ORGANIC",
        description: "Order Payment",
        handler: async function (response) {
          // Payment Success → Now place the order
          await placeOrder({
            ...orderData,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#000000" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment Failed to Initialize");
    }

    const placeOrder=async()=>{
      try {
        await axios.post(`${API_URL}/order/create`, orderData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        });
        toast.success("Order placed successfully");
        navigate("/order-success");
      } catch (error) {
        console.error(
          "Error placing order:",
          error.response ? error.response.data : error
        );
        toast.error("Something went wrong!");
      }
    }
   
    console.log("Final Cart Items being sent to backend:", finalCartItems);

  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Back to cart link */}
      <Link
        to="/cart"
        className="inline-flex items-center text-sm text-gray-500 mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to cart
      </Link>

      <h1 className="text-3xl font-medium text-gray-900 mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone
                  </label>
                  <input
                    type="number"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="apartment"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Apartment, suite, etc. (optional)
                  </label>
                  <input
                    type="text"
                    id="apt"
                    name="apt"
                    value={formData.apt}
                    onChange={handleChange}
                    placeholder="Apartment, suite, etc."
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your City"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      State
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Select State</option>
                      <option value="AP">Andhra Pradesh</option>
                      <option value="AR">Arunachal Pradesh</option>
                      <option value="AS">Assam</option>
                      <option value="BR">Bihar</option>
                      <option value="CT">Chhattisgarh</option>
                      <option value="GA">Goa</option>
                      <option value="GJ">Gujarat</option>
                      <option value="HR">Haryana</option>
                      <option value="HP">Himachal Pradesh</option>
                      <option value="JH">Jharkhand</option>
                      <option value="KA">Karnataka</option>
                      <option value="KL">Kerala</option>
                      <option value="MP">Madhya Pradesh</option>
                      <option value="MH">Maharashtra</option>
                      <option value="MN">Manipur</option>
                      <option value="ML">Meghalaya</option>
                      <option value="MZ">Mizoram</option>
                      <option value="NL">Nagaland</option>
                      <option value="OR">Odisha</option>
                      <option value="PB">Punjab</option>
                      <option value="RJ">Rajasthan</option>
                      <option value="SK">Sikkim</option>
                      <option value="TN">Tamil Nadu</option>
                      <option value="TG">Telangana</option>
                      <option value="TR">Tripura</option>
                      <option value="UP">Uttar Pradesh</option>
                      <option value="UK">Uttarakhand</option>
                      <option value="WB">West Bengal</option>
                      <option value="AN">Andaman and Nicobar Islands</option>
                      <option value="CH">Chandigarh</option>
                      <option value="DN">
                        Dadra and Nagar Haveli and Daman and Diu
                      </option>
                      <option value="DL">Delhi</option>
                      <option value="JK">Jammu and Kashmir</option>
                      <option value="LA">Ladakh</option>
                      <option value="LD">Lakshadweep</option>
                      <option value="PY">Puducherry</option>

                      {/* Add more states as needed */}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="Enter ZIP Code"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Payment Method
              </h2>
              <div className="space-y-4">
                
                <div className="border border-gray-300 p-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="online"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === "online"}
                      // onChange={handleChange}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label
                      htmlFor="online"
                      className="ml-2 block text-sm font-medium text-gray-700"
                    >
                      Online payment
                    </label>
                  </div>
                </div>

                {/* <div className="border border-gray-300 p-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      // onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label
                      htmlFor="cash"
                      className="ml-2 block text-sm font-medium text-gray-700"
                    >
                      Cash on delivery
                    </label>
                  </div>
                </div> */}
              </div>
            </section>
          </form>
        </div>

        {/* Order Summary */}
        {/* <div className="lg:col-span-1">
          <div className="border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {finalCartItems?.map((item) => (
                <div key={item.cartId} className="flex items-center">
                  <img
                    src={`${API_URL}/${item.product?.images[0]}`}
                    alt={item.name}
                    className="w-12 h-12 object-cover mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{item.product?.name}</h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × ₹{item.product?.price}
                    </p>
                  </div>
                  <p className="text-sm text-gray-800 font-medium">
                    ₹{(item.quantity * item.product?.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium">₹{(subtotal || 0).toFixed(2)}  </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Shipping</p>
                <p className="text-sm font-medium">₹{(shipping || 0).toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Tax</p>
                <p className="text-sm font-medium">₹{(tax || 0).toFixed(2)}</p>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <p className="text-base font-medium">Total</p>
                <p className="text-base font-bold">₹{(total || 0).toFixed(2)}</p>
              </div>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full mt-6 bg-purple-600 text-white py-3 px-4 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Place Order
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              By placing your order, you agree to our{" "}
              <Link to="#" className="text-purple-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="#" className="text-purple-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div> */}
        <div className="lg:col-span-1">
          <div className="border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {finalCartItems?.map((item) => {
                // Agar cart ka product hai to item.product use hoga, warna item direct hoga
                const product = item.product || item;

                return (
                  <div
                    key={product.productId || item.cartId}
                    className="flex items-center"
                  >
                    <img
                      src={`${API_URL}/${
                        product.images?.[0] || "default-image.jpg"
                      }`}
                      alt={product.name || "Product Image"}
                      className="w-12 h-12 object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">
                        {product.name || "Unnamed Product"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity || 1} × ₹
                        {product.price?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                    <p className="text-sm text-gray-800 font-medium">
                      ₹
                      {((item.quantity || 1) * (product.price || 0)).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium">
                  ₹{(subtotal || 0).toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Shipping</p>
                <p className="text-sm font-medium">
                  FREE
                </p>
              </div>
              {/* <div className="flex justify-between">
                <p className="text-sm text-gray-600">Tax</p>
                <p className="text-sm font-medium">₹{(tax || 0).toFixed(2)}</p>
              </div> */}
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <p className="text-base font-medium">Total</p>
                <p className="text-base font-bold">
                  ₹{(total || 0).toFixed(2)}
                </p>
              </div>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full mt-6 bg-purple-600 text-white py-3 px-4 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Place Order
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              By placing your order, you agree to our{" "}
              <Link to="#" className="text-purple-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="#" className="text-purple-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
