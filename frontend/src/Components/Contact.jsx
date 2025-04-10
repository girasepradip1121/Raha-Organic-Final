import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import axios from "axios";
import { API_URL, userToken } from "./Variable";
import { toast } from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const createRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/contact/create`, formData);
      setFormData({ name: "", email: "", message: "" });
      toast.success("Request Send Successfully");
    } catch (error) {
      toast.success("Error To Send Request");
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Title & Description */}
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-light mb-6">
            Stay Connected with Us!
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Stay connected with us for the latest updates, exclusive offers, and
          expert hair care tips! Have questions? We’re here to help. Reach out
          today for the best hair care solutions!
        </p>
      </div>

      {/* Contact Section - Map & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side - Social Media Icons & Google Map */}
        <div>
          {/* Social Media Icons (Above the Map) */}
          <div className="flex space-x-4 mb-6">
            <div className="p-3 bg-purple-500 text-white rounded-full shadow-md hover:scale-110 transition cursor-pointer">
              <Mail size={20} />
            </div>
            <div className="p-3 bg-purple-500 text-white rounded-full shadow-md hover:scale-110 transition cursor-pointer">
              <Phone size={20} />
            </div>
            <div className="p-3 bg-purple-500 text-white rounded-full shadow-md hover:scale-110 transition cursor-pointer">
              <MapPin size={20} />
            </div>
          </div>

          {/* Google Map */}
          <iframe
            className="w-full h-100"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345086165!2d144.9537353153185!3d-37.81627977975159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f2a938a5%3A0xb2f3b3fbb5cf9a49!2sMelbourne%20CBD%2C%20Melbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sin!4v1616544873451!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        {/* Right Side - Contact Form */}
        <div className="border border-[#DCDCDC] p-8">
          <form onSubmit={createRequest}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                className="w-full p-3 border border-[#DCDCDC] focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                className="w-full p-3 border border-[#DCDCDC] focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium">Message</label>
              <textarea
                rows="4"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your Message"
                className="w-full p-3 border border-[#DCDCDC] focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              ></textarea>
            </div>

            <button
              className="w-full bg-purple-600 text-white py-3 hover:bg-purple-700 transition"
              type="submit"
            >
              Your Email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
