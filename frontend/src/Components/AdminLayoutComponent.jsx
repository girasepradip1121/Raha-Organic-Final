import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../AdminPages/Sidebar";
import { Menu } from "lucide-react";

const AdminLayoutComponent = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col">
        {/* Mobile Sidebar Toggle Button */}
        <button className="lg:hidden p-4 text-white" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>

        {/* Page Content */}
        <div className="p-4 overflow-auto bg-black shadow-md rounded-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayoutComponent;
