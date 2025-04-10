"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "./Variable";
import { toast } from "react-hot-toast";


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    setLoading(true); // Set loading to true when starting the login request
    try {
      const response = await axios.post(`${API_URL}/user/login`, formData);
      localStorage.setItem("token", JSON.stringify(response.data.user));
      toast.success("Login Successful ");
      setTimeout(() => {
        if (response.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/shop");
        }
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error("Login Failed: " + error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false); // Reset loading after request completion
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left Section - Login Form */}
        <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
          <div className="w-full max-w-md space-y-8">
            {/* Logo and Tagline */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-38 w-38">
                <img src="blacklogo.svg" alt="Logo" />
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="mt-8 space-y-6">
              <div className="space-y-4">
                {/* Email Input */}
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#8558B3] px-4 py-3 text-gray-900 placeholder-[#8558B3] focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                    placeholder="Email Address"
                  />
                </div>

                {/* Password Input */}
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
                  {formData.password && (
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
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Link
                    to="#"
                    className="text-sm text-[#8558B3] hover:text-purple-500"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Login Button */}
              <div>
                <button
                  type="submit"
                  className={`group relative flex w-full justify-center bg-purple-600 px-4 py-3 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={loading}
                >
                  {loading ? "Logging In..." : "Log In"}
                </button>
              </div>

              {/* OR Divider */}
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-[#8558B3]"></div>
                <span className="mx-4 flex-shrink text-[#8558B3]">OR</span>
                <div className="flex-grow border-t border-[#8558B3]"></div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center border border-[#8558B3] bg-white px-4 py-2 text-sm font-medium text-[#8558B3] hover:bg-gray-50"
                >
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center border border-[#8558B3] bg-white px-4 py-2 text-sm font-medium text-[#8558B3] hover:bg-gray-50"
                >
                  Facebook
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center text-sm">
                <span className="text-gray-500">Can't Log In? </span>
                <Link
                  to="/sign"
                  className="text-purple-600 hover:text-purple-500"
                >
                  Sign up an account
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Section - Illustration */}
        <div className="hidden md:block">
          <img src="loginimg.svg" alt="Login Illustration" />
        </div>
      </div>
    </>
  );
}
