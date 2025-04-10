import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userToken } from "./Variable";
import { FaSignOutAlt, FaBox, FaUserPlus } from "react-icons/fa";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const userData = userToken();

  useEffect(() => {
    if (userData?.token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsLogoutModalOpen(false);
    navigate("/login");
    // window.location.reload(); // Forcefully reload to reset state
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close dropdown if clicked outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="bg-purple-600 text-white">
      <div className="container mx-auto flex justify-between items-center p-2 px-0 lg:px-12 px-2">
        {/* Logo */}
        <div className="text-lg sm:text-xl font-bold">
          <Link to={"/"}>
            <img
              src="/logo.svg"
              alt="logo"
              className="h-16 sm:h-30 md:h-30 w-auto md:scale-200"
            />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-white border-2 overflow-hidden flex-grow max-w-lg mx-0 lg:mx-4 mx-2">
          <span className="p-2 text-gray-500">
            <img src="/search.svg" alt="search icon" />
          </span>
          <input
            type="text"
            placeholder="Search.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 outline-none text-gray-700 text-sm sm:text-base"
          />

          <button
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 text-sm sm:text-base"
            onClick={() => {
              if (searchTerm.trim()) {
                navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
                setSearchTerm(""); // optional: clear input
              }
            }}
          >
            Search
          </button>
        </div>

        {/* Icons on Right Side */}
        <div className="flex gap-4 text-lg">
          <span className="cursor-pointer hover:text-gray-300">
            <img
              src="/profile.svg"
              alt="profile icon"
              // className="text-xl cursor-pointer hover:text-gray-900"
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
            />
            {isDropdownOpen && (
              <div
                className="absolute right-9 md:right-12 lg:right-23 xl:right-67 mt-1 w-30  bg-white shadow-lg rounded-lg py-2 z-50 text-black"
                ref={dropdownRef}
              >
                {isAuthenticated ? (
                  <>
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-left w-full hover:bg-gray-100"
                      onClick={() => {
                        navigate("/myorders");
                        setIsDropdownOpen(false);
                      }}
                    >
                      <FaBox className="text-lg" />{" "}
                      <span className="text-sm">Orders</span>
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-left w-full hover:bg-gray-100"
                      onClick={() => {
                        setIsLogoutModalOpen(true);
                        setIsDropdownOpen(false); // optional: close dropdown when opening modal
                      }}
                    >
                      <FaSignOutAlt className="text-lg" />{" "}
                      <span className="text-sm">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Login and Signup Options for Not Logged-In User */}
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-left w-full hover:bg-gray-100"
                      onClick={() => {navigate("/login")
                        setIsDropdownOpen(false)
                      }}
                    >
                      <FaUserPlus className="text-lg" />{" "}
                      <span className="text-sm">Login</span>
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-left w-full hover:bg-gray-100"
                      onClick={() =>{ navigate("/sign")
                        setIsDropdownOpen(false)
                      }}
                    >
                      <FaUserPlus className="text-lg" />{" "}
                      <span className="text-sm">Sign Up</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </span>

          {isLogoutModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center">
              <div className="bg-white p-6 bg-opacity-50 rounded-lg shadow-lg text-black">
                <p className="text-lg font-semibold mb-4">
                  Are you sure you want to logout?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={() => setIsLogoutModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={handleLogout}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}

          <Link to="/cart" className="cursor-pointer hover:text-gray-300">
            <img src="/cart.svg" alt="cart icon" />
          </Link>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="bg-white text-gray-800 shadow-md overflow-x-auto whitespace-nowrap scrollbar-hide">
        <ul className="flex items-center justify-center px-4 sm:px-8 space-x-4 sm:space-x-6 py-2 sm:py-3 text-sm sm:text-lg">
          <li>
            <Link to="/" className="hover:text-purple-500 cursor-pointer">
              Home
            </Link>
          </li>
          <li>
            <Link to="/shop" className="hover:text-purple-500 cursor-pointer">
              Shop
            </Link>
          </li>
          <li>
            <Link
              to="/allproducts"
              className="hover:text-purple-500 cursor-pointer"
            >
              All Products
            </Link>
          </li>
          <li>
            <Link
              to="/bestseller"
              className="hover:text-purple-500 cursor-pointer"
            >
              Best Seller
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-purple-500 cursor-pointer">
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contactus"
              className="hover:text-purple-500 cursor-pointer"
            >
              Contact Us
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
