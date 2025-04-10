// "use client";

// import { Trash2, Minus, Plus } from "lucide-react";

// export default function CartItem({ item, updateQuantity, removeItem }) {
//   const handleIncrement = () => {
//     updateQuantity(item.id, item.quantity + 1);
//   };

//   const handleDecrement = () => {
//     if (item.quantity > 1) {
//       updateQuantity(item.id, item.quantity - 1);
//     }
//   };

//   const handleChange = (e) => {
//     const value = Number.parseInt(e.target.value);
//     if (!isNaN(value) && value > 0) {
//       updateQuantity(item.id, value);
//     }
//   };

//   return (
//     <div className="flex items-center justify-between border-b py-4 gap-1 w-full border-gray-300 text-xs sm:text-sm md:text-base">
//       {/* Product Image & Description */}
//       <div className="flex flex-col items-center w-24 sm:w-28">
//         <img
//           src="cart1.svg"
//           alt={item.name}
//           className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
//         />
//         <h3 className="font-medium text-center mt-2">{item.name}</h3>
//       </div>

//       {/* Quantity Selector */}
//       <div className="flex border border-gray-300 w-[90px] sm:w-[120px]">
//         <button
//           onClick={handleDecrement}
//           className="px-2 py-1 hover:bg-gray-100 transition-colors"
//           aria-label="Decrease quantity"
//         >
//           <Minus className="w-4 h-4" />
//         </button>
//         <input
//           type="text"
//           value={item.quantity}
//           onChange={handleChange}
//           className="w-full text-center focus:outline-none"
//           aria-label="Quantity"
//         />
//         <button
//           onClick={handleIncrement}
//           className="px-2 py-1 hover:bg-gray-100 transition-colors"
//           aria-label="Increase quantity"
//         >
//           <Plus className="w-4 h-4" />
//         </button>
//       </div>

//       {/* Price */}
//       <div className="min-w-[70px] sm:min-w-[100px] text-center">
//         ₹{item.price.toFixed(2)}
//       </div>

//       {/* Total Price */}
//       <div className="min-w-[80px] sm:min-w-[100px] font-semibold text-center">
//         ₹{(item.price * item.quantity).toFixed(2)}
//       </div>

//       {/* Remove Button */}
//       <div className="flex-shrink-0">
//         <button
//           onClick={() => removeItem(item.id)}
//           className="text-gray-500 hover:text-red-500 transition-colors p-1"
//           aria-label="Remove item"
//         >
//           <Trash2 className="w-5 h-5" />
//         </button>
//       </div>
//     </div>
//   );
// }
