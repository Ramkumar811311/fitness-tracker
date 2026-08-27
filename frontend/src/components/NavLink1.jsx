import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavLink = ({ to, children, className = "" }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`block w-full px-4 py-3 rounded-lg text-lg transition ${
        isActive
          ? "bg-blue-600 text-white font-semibold"
          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
      } ${className}`}
    >
      {children}
    </Link>
  );
};

export default NavLink;