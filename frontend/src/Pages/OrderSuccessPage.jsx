import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center md:min-h-150 bg-white px-4 py-12">
      <CheckCircle className="w-16 h-16 text-purple-600 mb-4" />
      <h1 className="text-2xl font-semibold text-black mb-2">Order Successful!</h1>
      <p className="text-gray-600 text-center mb-6">
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      <div className="flex gap-4">
        <button
          className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
        <button
          className="border border-black text-black px-6 py-2 rounded-full hover:bg-gray-100 transition"
          onClick={() => navigate("/myorders")}
        >
          View My Orders
        </button>
      </div>
    </div>
  );
}
