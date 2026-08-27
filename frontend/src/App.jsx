import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Features from "./pages/Features";
import Register from "./pages/Register";
import Main from "./pages/Main";
import WorkoutDatabase from "./pages/WorkoutDatabase";
import BmrCalculator from "./pages/BmrCalculator";
import NutritionChecker from "./pages/NutritionChecker";
import WorkoutBuilder from "./pages/WorkoutBuilder";
import SignIn from "./pages/SignIn";
import ProfileLayout from "./pages/ProfileLayout";
import UpdateProfile from "./pages/UpdateProfile";
import WorkoutDetails from "./pages/WorkoutDetails";
import PrivateRoute from "./pages/PrivateRoute";
import VerifyOTP from "./pages/VerifyOTP";
import "./css/home.css";

const App = () => {
  const location = useLocation();
  
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/Features" element={<Features />} />
        <Route path="/WorkoutDatabase" element={<PrivateRoute><WorkoutDatabase /></PrivateRoute>} />
        <Route path="/BmrCalculator" element={<PrivateRoute><BmrCalculator /></PrivateRoute>} />
        <Route path="/NutritionChecker" element={<PrivateRoute><NutritionChecker /></PrivateRoute>} />
        <Route path="/WorkoutBuilder" element={<PrivateRoute><WorkoutBuilder /></PrivateRoute>} />
        <Route path="/Register" element={<Register />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/main" element={<Main />} />
        
        {/* Profile routes */}
        <Route path="/profile" element={<PrivateRoute><ProfileLayout /></PrivateRoute>}>
          <Route path="update-profile" element={<UpdateProfile />} />
          <Route path="workout-details" element={<WorkoutDetails />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
