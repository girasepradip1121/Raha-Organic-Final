import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Edit } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL, userToken } from "../Components/Variable";

const Orders = () => {
  const userData = userToken();
  const token = userData?.token;
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const orderStatusOptions = [
    { value: 1, label: "Pending" },
    { value: 2, label: "Processing" },
    { value: 3, label: "Shipped" },
    { value: 4, label: "Delivered" },
    { value: 5, label: "Cancelled" },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/order/getall`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("response order", response.data);

        const updatedOrders = response.data?.map((order) => ({
          ...order,
          items:
            order?.orderItems?.map((item) => ({
              name: item?.product?.name || "Unknown Product",
              quantity: item.quantity,
              price: item.price,
              image:
                item?.product?.images?.length > 0
                  ? item.product.images[0].imageUrl
                  : "",
            })) || [],
        }));
        setOrders(updatedOrders);
        console.log("orders", orders);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API_URL}/order/updatestatus/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order status updated successfully!");
      setOrders((prevOrders) =>
        prevOrders?.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="p-6 bg-black min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="flex flex-col gap-4">
            {orders?.length > 0 ? (
              orders?.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition flex flex-col md:flex-row justify-between items-center"
                >
                  <div className="text-sm md:text-base w-full md:w-2/3">
                    <p>
                      <strong>Order ID:</strong> {order.orderId}
                    </p>
                    <p>
                      <strong>Customer Name:</strong> {order.firstName}{" "}
                      {order.lastName}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-purple-500 hover:bg-purple-400 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600 transition"
                    >
                      <Eye size={16} /> View Details
                    </button>
                    <select
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                      onChange={(e) => {
                        updateOrderStatus(order.orderId, e.target.value);
                        console.log("target", e.target.value);
                      }}
                      value={order.status}
                    >
                      {orderStatusOptions?.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <p className="">No orders found.</p>
            )}
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full text-white relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setSelectedOrder(null)}
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <p>
              <strong>Order ID:</strong> {selectedOrder.orderId}
            </p>
            <p>
              <strong>User ID:</strong> {selectedOrder.userId}
            </p>
            <p>
              <strong>Customer Name:</strong> {selectedOrder.firstName}{" "}
              {selectedOrder.lastname}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedOrder.phone}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.address},{" "}
              {selectedOrder.apt}, {selectedOrder.city}, {selectedOrder.state},
              {selectedOrder.postalCode}
            </p>
            <p>
              <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
            </p>
            <p>
              <strong>Grand Total:</strong> ₹{selectedOrder.totalPrice}
            </p>
            <h3 className="font-semibold mt-4">Ordered Items:</h3>
            {selectedOrder?.items?.map((item, index) => (
              <div key={index} className="flex items-center gap-4 mt-2">
                <img
                  src={`${API_URL}/${item.image}`}
                  alt={item.name}
                  className="w-14 h-14 rounded-md object-cover"
                />
                <div>
                  {console.log("name", item?.name)}
                  <p className="text-sm">{item?.product?.name}</p>
                  <p className="text-sm text-gray-400">
                    Qty: {item.quantity} | ₹{item?.price} each
                  </p>
                </div>
              </div>
            ))}
            <p className="text-sm text-gray-400">
              Shipping: ₹{selectedOrder.shippingCharge} | Tax: ₹
              {selectedOrder.tax}
            </p>
            <p className="text-sm text-gray-400 font-bold">
              Total: ₹{selectedOrder.totalPrice}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;
