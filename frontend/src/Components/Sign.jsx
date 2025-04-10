"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "./Variable";
import axios from "axios";
import { toast } from "react-hot-toast";
;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await axios.post(`${API_URL}/user/signup`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Sigup Successful");
      setMessage(response.data.message);
      setFormData({ fullName: "", userName: "", email: "", password: "" });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error("Signup Failed...");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left Section - Signup Form */}
        <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
          <div className="w-full max-w-md space-y-8">
            {/* Logo and Tagline */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-38 w-38">
                <img src="blacklogo.svg" />
              </div>
              {/* <h1 className="mt-2 text-2xl font-bold">RAHA organic</h1>
              <p className="mt-1 text-sm text-gray-500">
                Is Good For, We Always For You!!
              </p> */}
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-4">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border border-[#8558B3] px-4 py-3 text-gray-900 placeholder-[#8558B3] focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                />
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  required
                  placeholder="Username"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full border border-[#8558B3] px-4 py-3 text-gray-900 placeholder-[#8558B3] focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-[#8558B3] px-4 py-3 text-gray-900 placeholder-[#8558B3] focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                />
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#8558B3] px-4 py-3 text-gray-900 placeholder-[#8558B3] focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="group relative flex w-full justify-center bg-purple-600 px-4 py-3 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Sign Up
              </button>
              <div className="text-center text-sm">
                <span className="text-gray-500">Already have an account? </span>
                <Link
                  to="/login"
                  className="text-purple-600 hover:text-purple-500"
                >
                  Log in
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Section - Product Display */}
        <div className="absolute right-0 h-full hidden md:block">
          <img
            src="sign.svg"
            alt="Decorative plants"
            className="h-full object-cover"
          />
        </div>
      </div>
    </>
  );
}
