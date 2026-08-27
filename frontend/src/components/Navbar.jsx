import React, { useState, useRef, useEffect } from "react";
import Hamburger from "hamburger-react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import NavLink from "../components/NavLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isMenu, setIsMenu] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const userDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  // Mobile menu
  const toggleMenu = () => {
    setIsMenu((prev) => !prev);
  };

  // User dropdown
  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedDesktopDropdown =
        userDropdownRef.current?.contains(event.target);

      const clickedMobileDropdown =
        mobileDropdownRef.current?.contains(event.target);

      if (!clickedDesktopDropdown && !clickedMobileDropdown) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close everything after mobile navigation
  const handleMobileNavigation = () => {
    setIsDropdownVisible(false);
    setIsMenu(false);
  };

  return (
    <div className="w-full animate-slideInFromTop">

      {/* ================= NAVBAR ================= */}
      <div className="w-full h-20 flex items-center justify-between">

        {/* Logo */}
        <div>
          <img
            src="/FitnessAppLogo.png"
            className="w-16 border border-gray-400 rounded-full"
            alt="Logo"
          />
        </div>

        {/* ================= DESKTOP MENU ================= */}
        <div className="hidden md:flex relative gap-4">

          <NavLink to="/" className="cursor-pointer">
            Home
          </NavLink>

          <NavLink to="/Features" className="cursor-pointer">
            Features
          </NavLink>

          <NavLink to="/AboutUs" className="cursor-pointer">
            About Us
          </NavLink>

          <NavLink to="/ContactUs" className="cursor-pointer">
            Contact Us
          </NavLink>

        </div>

        {/* ================= MOBILE MENU BUTTON ================= */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="scale-75 border border-slate-600 rounded-md focus:outline-none"
          >
            <Hamburger toggled={isMenu} toggle={toggleMenu} />
          </button>
        </div>

        {/* ================= DESKTOP USER MENU ================= */}
        <div className="hidden md:flex items-center justify-between gap-4 relative">

          {!isAuthenticated ? (
            <>
              <Link
                to="/SignIn"
                className="cursor-pointer text-xl text-gray-500"
              >
                Login
              </Link>

              <Link
                to="/Register"
                className="cursor-pointer text-xl text-gray-500"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative" ref={userDropdownRef}>

              {/* Username */}
              <button
                type="button"
                className="cursor-pointer text-xl text-gray-500 flex gap-2 items-center"
                onClick={toggleDropdown}
              >
                {user?.name || "User"}

                <FontAwesomeIcon icon={faCaretDown} />
              </button>

              {/* Desktop Dropdown */}
              <AnimatePresence>
                {isDropdownVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden"
                  >

                    {/* User Info */}
                    <div className="py-2 border-b border-gray-100">
                      <div className="px-4 py-2">
                        <p className="text-sm font-medium text-gray-400">
                          Signed in as
                        </p>

                        <p className="text-base font-semibold text-gray-800 truncate">
                          {user?.name || "User"}
                        </p>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="py-1">

                      <Link
                        to="/profile/update-profile"
                        className="flex items-center px-4 py-2.5 text-base text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        onClick={() => setIsDropdownVisible(false)}
                      >
                        <svg
                          className="w-5 h-5 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>

                        Profile
                      </Link>

                      <Link
                        to="/profile/workout-details"
                        className="flex items-center px-4 py-2.5 text-base text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        onClick={() => setIsDropdownVisible(false)}
                      >
                        <svg
                          className="w-5 h-5 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>

                        My Workouts
                      </Link>

                      <Link
                        to="/profile/saved-workouts"
                        className="flex items-center px-4 py-2.5 text-base text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        onClick={() => setIsDropdownVisible(false)}
                      >
                        <svg
                          className="w-5 h-5 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>

                        Saved Workouts
                      </Link>

                      <Link
                        to="/profile/workout-builder"
                        className="flex items-center px-4 py-2.5 text-base text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        onClick={() => setIsDropdownVisible(false)}
                      >
                        <svg
                          className="w-5 h-5 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>

                        Create Workout
                      </Link>

                    </div>

                    {/* Logout */}
                    <div className="py-1 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsDropdownVisible(false);
                        }}
                        className="flex items-center w-full px-4 py-2.5 text-base text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FiLogOut size={18} className="mr-3" />

                        Logout
                      </button>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )}

        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isMenu && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col md:hidden gap-2 p-4"
          >

            <NavLink
              to="/"
              onClick={handleMobileNavigation}
            >
              Home
            </NavLink>

            <NavLink
              to="/Features"
              onClick={handleMobileNavigation}
            >
              Features
            </NavLink>

            <NavLink
              to="/AboutUs"
              onClick={handleMobileNavigation}
            >
              About Us
            </NavLink>

            <NavLink
              to="/ContactUs"
              onClick={handleMobileNavigation}
            >
              Contact Us
            </NavLink>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/SignIn"
                  className="cursor-pointer text-sm text-gray-500 py-2"
                  onClick={handleMobileNavigation}
                >
                  Login
                </Link>

                <Link
                  to="/Register"
                  className="cursor-pointer text-sm text-gray-500 py-2"
                  onClick={handleMobileNavigation}
                >
                  Register
                </Link>
              </>
            ) : (

              /* ================= MOBILE USER MENU ================= */
              <div
                className="relative"
                ref={mobileDropdownRef}
              >

                {/* Username */}
                <button
                  type="button"
                  className="cursor-pointer text-sm flex gap-2 text-gray-500 items-center"
                  onClick={toggleDropdown}
                >
                  {user?.name || "User"}

                  <FontAwesomeIcon icon={faCaretDown} />
                </button>

                {/* Mobile Dropdown */}
                <AnimatePresence>
                  {isDropdownVisible && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="mt-1 pl-4 w-full bg-white border-l border-gray-200 z-50"
                    >

                      {/* Profile */}
                      <Link
                        to="/profile/update-profile"
                        className="block py-3 text-sm text-gray-700 hover:text-green-600"
                        onClick={handleMobileNavigation}
                      >
                        👤 Profile
                      </Link>

                      {/* My Workouts */}
                      <Link
                        to="/profile/workout-details"
                        className="block py-3 text-sm text-gray-700 hover:text-green-600"
                        onClick={handleMobileNavigation}
                      >
                        📋 My Workouts
                      </Link>

                      {/* Saved Workouts */}
                      <Link
                        to="/profile/saved-workouts"
                        className="block py-3 text-sm text-gray-700 hover:text-green-600"
                        onClick={handleMobileNavigation}
                      >
                        🔖 Saved Workouts
                      </Link>

                      {/* Create Workout */}
                      <Link
                        to="/profile/workout-builder"
                        className="block py-3 text-sm text-gray-700 hover:text-green-600"
                        onClick={handleMobileNavigation}
                      >
                        ➕ Create Workout
                      </Link>

                      {/* Logout */}
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsDropdownVisible(false);
                          setIsMenu(false);
                        }}
                        className="w-full text-left block py-3 text-sm text-red-600"
                      >
                        <FiLogOut
                          size={16}
                          className="inline mr-2"
                        />

                        Logout
                      </button>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            )}

          </motion.div>
        </AnimatePresence>
      )}

    </div>
  );
};

export default Navbar;