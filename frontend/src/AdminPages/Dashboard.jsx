import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Package,
  Users,
  MessageCircle,
  Tag,
  Star,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL, userToken } from "../Components/Variable";

const Dashboard = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    orders: 0,
    products: 0,
    users: 0,
    request: 0,
    category: 0,
    review: 0,
  });
  const userData = userToken();
  const token = userData?.token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await axios.get(`${API_URL}/order/getall`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const productsResponse = await axios.get(`${API_URL}/product/getall`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersResponse = await axios.get(`${API_URL}/user/getall`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const requestResponse = await axios.get(`${API_URL}/contact/getall`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const categoryResponse = await axios.get(`${API_URL}/category/getall`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reviewResponse = await axios.get(`${API_URL}/review/getall`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCounts({
          orders: ordersResponse.data.length,
          products: productsResponse.data.length,
          users: usersResponse.data.length,
          request: requestResponse.data.length,
          category: categoryResponse.data.length,
          review: reviewResponse.data.length,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const cards = [
    {
      title: "Total Orders",
      count: counts.orders,
      icon: <ShoppingCart size={32} />,
      color: "bg-blue-500",
      link: "/admin/orders",
    },
    {
      title: "Total Products",
      count: counts.products,
      icon: <Package size={32} />,
      color: "bg-green-500",
      link: "/admin/products",
    },
    {
      title: "Total Users",
      count: counts.users,
      icon: <Users size={32} />,
      color: "bg-purple-500",
      link: "/admin/users",
    },
    {
      title: "Total Requests",
      count: counts.request,
      icon: <MessageCircle size={32} />,
      color: "bg-yellow-500",
      link: "/admin/manage-contact",
    },
    {
      title: "Categories",
      count: counts.category,
      icon: <Tag size={32} />,
      color: "bg-red-500",
      link: "/admin/category",
    },
    {
      title: "Reviews",
      count: counts.review,
      icon: <Star size={32} />,
      color: "bg-orange-500",
      link: "/admin/reviews",
    },
  ];

  return (
    <div className="p-4 sm:p-6 min-h-screen text-white bg-black">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.link)}
            className={`rounded-xl p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 ${card.color} hover:brightness-110 transition duration-300 cursor-pointer`}
          >
            <div className="bg-white rounded-full p-3 text-black shadow">
              {card.icon}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="text-3xl font-bold">{card.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
