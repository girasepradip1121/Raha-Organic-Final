import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  ShoppingCart,
  Package,
  Mail,
  Menu,
  LogOut,
  Tag,
  Star,
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative top-0 left-0 h-screen bg-white text-black flex flex-col shadow-md pt-4 w-72 transform
        ${
          isOpen ? "translate-x-0" : "-translate-x-72"
        } transition-transform duration-300 lg:translate-x-0 lg:w-64 z-10`}
      >
        {/* Close Button (Mobile) */}
        <button
          className="lg:hidden absolute top-4 right-4 text-black"
          onClick={toggleSidebar}
        >
          ✖
        </button>

        {/* Logo */}
        <div className="flex justify-center items-center mb-4">
          <img
            src="/blacklogo.svg"
            alt="Logo"
            className="mt-5 h-12 w-auto scale-350"
          />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-4 space-y-1">
          {[
            { to: "/admin", label: "Dashboard", icon: <Home size={20} /> },
            { to: "/admin/users", label: "Users", icon: <Users size={20} /> },

            {
              to: "/admin/category",
              label: "Category",
              icon: <Tag size={20} />,
            },
            {
              to: "/admin/products",
              label: "Products",
              icon: <Package size={20} />,
            },
            { to: "/admin/reviews", label: "Review", icon: <Star size={20} /> },

            {
              to: "/admin/orders",
              label: "Orders",
              icon: <ShoppingCart size={20} />,
            },
            {
              to: "/admin/manage-contact",
              label: "Manage Contact",
              icon: <Mail size={20} />,
            },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center space-x-2 p-3 text-black rounded-lg transition ${
                  isActive
                    ? "bg-purple-500 text-white"
                    : "text-black hover:bg-purple-400"
                }`
              }
            >
              {item.icon} <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full space-x-2 p-3 text-black hover:bg-red-600 rounded-lg transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Layout Component
const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 min-h-screen">
        {/* Mobile Sidebar Toggle Button */}
        <button
          className="lg:hidden p-4 text-purple-600"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>

        {/* Page Content */}
        <div className="p-4">{/* Content Here */}</div>
      </div>
    </div>
  );
};

export { Sidebar, Layout };
