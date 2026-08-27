import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Your auth context

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Get the auth status from context

  // If the user is not authenticated, redirect to SignIn
  return isAuthenticated ? children : <Navigate to="/SignIn" />;
};

export default PrivateRoute;
