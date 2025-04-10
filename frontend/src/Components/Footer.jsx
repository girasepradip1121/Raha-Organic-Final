"use client";

import { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleSubscribe = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    console.log("Subscribed with email:", email);
    setEmail("");
    alert("Thank you for subscribing!");
  };

  return (
    <footer className="bg-purple-600 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-center md:justify-start">
              <img
                src="/logo.svg"
                alt="Raha Logo"
                className="h-[125px] w-auto scale-170"
              />
            </div>

            <p className="text-sm">
              Premium haircare products designed to nourish, strengthen, and
              beautify your hair.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/bestseller"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Best Seller
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contactus"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Newsletter</h3>
            <p className="text-sm mb-4">
              Subscribe to our newsletter for exclusive offers and hair care
              tips.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div>
                <input
                  type="email"
                  placeholder="Your Email Address"
                  className={`w-full p-2 bg-white/10 border ${
                    emailError ? "border-red-400" : "border-transparent"
                  } focus:outline-none focus:ring-2 focus:ring-white/30`}
                  value={email}
                  onChange={handleEmailChange}
                />
                {emailError && (
                  <p className="text-red-200 text-xs mt-1">{emailError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-white text-purple-600 py-2 px-4 hover:bg-white/90 transition-colors font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© 2025 Raha Organic. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link
              to="#"
              className="text-white/80 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="#"
              className="text-white/80 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="#"
              className="text-white/80 hover:text-white transition-colors"
            >
              Cookies Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
