// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Cart() {
//   const navigate = useNavigate();
//   const [cartSummary, setCartSummary] = useState({
//     subtotal: 0,
//     shipping: 0,
//     tax: 0,
//     total: 0,
//   });

//   useEffect(() => {
//     // Fetch cart data or calculate it based on some logic
//     const fetchedCartData = {
//       subtotal: 120,
//       shipping: 20,
//       tax: 20,
//       total: 160,
//     };

//     setCartSummary(fetchedCartData);
//   }, []);

//   return (
//     <div>
//       <CartSummary
//         subtotal={cartSummary.subtotal}
//         shipping={cartSummary.shipping}
//         tax={cartSummary.tax}
//         total={cartSummary.total}
//         navigate={navigate}
//       />
//     </div>
//   );
// }

// function CartSummary({ subtotal, shipping, tax, total, navigate }) {
//   return (
//     <div className="border border-gray-300 p-6">
//       <h2 className="text-lg font-medium mb-6">Order Summary</h2>

//       <div className="space-y-4">
//         <div className="flex justify-between">
//           <span className="text-gray-600">Subtotal</span>
//           <span>₹{subtotal.toFixed(2)}</span>
//         </div>

//         <div className="flex justify-between">
//           <span className="text-gray-600">Shipping</span>
//           <span>₹{shipping.toFixed(2)}</span>
//         </div>

//         <div className="flex justify-between">
//           <span className="text-gray-600">Tax</span>
//           <span>₹{tax.toFixed(2)}</span>
//         </div>

//         <div className="border-t border-gray-300 pt-4 mt-4">
//           <div className="flex justify-between font-medium">
//             <span>Total</span>
//             <span>₹{total.toFixed(2)}</span>
//           </div>
//         </div>
//       </div>

//       <button
//         onClick={() => {
//           window.scrollTo(0, 0);
//           navigate("/checkoutpage");
//         }}
//         className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 mt-6 transition-colors"
//       >
//         Proceed to Checkout
//       </button>
//     </div>
//   );
// }
