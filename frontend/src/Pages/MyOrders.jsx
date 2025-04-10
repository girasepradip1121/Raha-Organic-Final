import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL, userToken } from "../Components/Variable";
import { toast } from "react-hot-toast";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const userData = userToken();
  const userId = userData?.userId;
  const token = userData?.token;

  const statusConfig = {
    1: { label: "Pending", color: "bg-amber-100 text-amber-800", icon: "⏳" },
    2: { label: "Processing", color: "bg-blue-100 text-blue-800", icon: "🔄" },
    3: { label: "Shipped", color: "bg-indigo-100 text-indigo-800", icon: "🚚" },
    4: { label: "Delivered", color: "bg-green-100 text-green-800", icon: "✅" },
    5: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: "❌" },
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/order/getuserorder/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrderHandler = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;
    try {
      await axios.put(
        `${API_URL}/order/cancel/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order cancelled successfully.");
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel the order.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No orders yet
            </h3>
            <p className="text-gray-500 mb-4">
              Your order history will appear here
            </p>
            <a
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = statusConfig[order.status] || {
                label: "Unknown",
                color: "bg-gray-100 text-gray-800",
                icon: "❓",
              };

              return (
                <div
                  key={order.orderId}
                  className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100"
                >
                  {/* Order Header */}
                  <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderId}
                        </h2>
                        <span
                          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusInfo.color}`}
                        >
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    {order.status === 1 && (
                      <button
                      onClick={() => {
                        setSelectedOrderId(order.orderId);
                        setShowCancelModal(true);
                      }}
                      className="text-sm font-medium text-red-600 hover:text-red-800 px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Cancel Order
                    </button>
                    
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="divide-y divide-gray-100">
                    {order.orderItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-5 flex flex-col md:flex-row gap-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={`${API_URL}/${item.product?.images[0]?.imageUrl}`}
                            alt={item.product?.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/100";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {item.product?.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-1">
                            Size: {item.product?.size}ml
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm mt-2">
                            <span className="text-gray-600">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-gray-600">
                              Price: ₹{item.price}
                            </span>
                            <span className="font-medium text-gray-900">
                              Subtotal: ₹{item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex justify-end">
                      <div className="text-right space-y-1">
                        <div className="flex items-center justify-between w-64">
                          <span className="text-sm text-gray-600">
                            Subtotal:
                          </span>
                          <span className="text-gray-900">
                            ₹
                            {order.totalPrice -
                              order.tax -
                              order.shippingCharge}
                          </span>
                        </div>
                        <div className="flex items-center justify-between w-64">
                          <span className="text-sm text-gray-600">Tax:</span>
                          <span className="text-gray-900">₹{order.tax}</span>
                        </div>
                        <div className="flex items-center justify-between w-64">
                          <span className="text-sm text-gray-600">
                            Shipping:
                          </span>
                          <span className="text-gray-900">
                            ₹{order.shippingCharge}
                          </span>
                        </div>
                        <div className="flex items-center justify-between w-64 pt-2 border-t border-gray-200">
                          <span className="text-base font-medium text-gray-900">
                            Total:
                          </span>
                          <span className="text-lg font-bold text-purple-600">
                            ₹{order.totalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Cancel Order
              </h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to cancel this order?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  No, Go Back
                </button>
                <button
                  onClick={async () => {
                    try {
                      await axios.put(
                        `${API_URL}/order/cancel/${selectedOrderId}`,
                        {},
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      toast.success("Order cancelled successfully.");
                      fetchOrders();
                      setShowCancelModal(false);
                    } catch (error) {
                      console.error("Error cancelling order:", error);
                      alert("Failed to cancel the order.");
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Yes, Cancel Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
