import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Main from "./Main";
import Features from "./Features";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";
import WorkoutDatabase from "./WorkoutDatabase";
import WorkoutBuilder from "./WorkoutBuilder";
import NutritionChecker from "./NutritionChecker";
import BmrCalculator from "./BmrCalculator";
import SignIn from "./SignIn";
import Register from "./Register";
import VerifyOTP from "./VerifyOTP";
import VerifyEmail from "./VerifyEmail";
import ProfileLayout from "./ProfileLayout";
import MealPlan from "./MealPlan";
import WaterIntake from "./WaterIntake";
import PrivateRoute from "./PrivateRoute";
import UpdateProfile from "./UpdateProfile";
import WorkoutDetails from "./WorkoutDetails";
import SavedWorkouts from "./SavedWorkouts";
import RestrictedAccess from "../components/RestrictedAccess";

import "../css/home.css";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="content-container">
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Main />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <>
            <Route
              path="/workoutdatabase"
              element={<WorkoutDatabase />}
            />

            <Route
              path="/nutritionchecker"
              element={<NutritionChecker />}
            />

            <Route
              path="/bmrcalculator"
              element={<BmrCalculator />}
            />

            <Route
              path="/workoutbuilder"
              element={<WorkoutBuilder />}
            />

            <Route
              path="/savedworkouts"
              element={<SavedWorkouts />}
            />

            {/* Profile */}
            <Route
              path="/profile"
              element={<PrivateRoute />}
            >
              <Route element={<ProfileLayout />}>

                {/* /profile */}
                <Route
                  index
                  element={
                    <Navigate
                      to="update-profile"
                      replace
                    />
                  }
                />

                {/* /profile/update-profile */}
                <Route
                  path="update-profile"
                  element={<UpdateProfile />}
                />

                {/* /profile/workout-details */}
                <Route
                  path="workout-details"
                  element={<WorkoutDetails />}
                />

                {/* /profile/meal-plan */}
                <Route
                  path="meal-plan"
                  element={<MealPlan />}
                />

                {/* /profile/water-intake */}
                <Route
                  path="water-intake"
                  element={<WaterIntake />}
                />

              </Route>
            </Route>
          </>
        ) : (
          <>
            <Route
              path="/workoutdatabase"
              element={
                <RestrictedAccess
                  featureName="Workout Database"
                />
              }
            />

            <Route
              path="/nutritionchecker"
              element={
                <RestrictedAccess
                  featureName="Nutrition Checker"
                />
              }
            />

            <Route
              path="/bmrcalculator"
              element={
                <RestrictedAccess
                  featureName="BMR Calculator"
                />
              }
            />

            <Route
              path="/workoutbuilder"
              element={
                <RestrictedAccess
                  featureName="Workout Builder"
                />
              }
            />

            <Route
              path="/savedworkouts"
              element={
                <RestrictedAccess
                  featureName="Saved Workouts"
                />
              }
            />

            <Route
              path="/profile/*"
              element={
                <RestrictedAccess
                  featureName="Profile"
                />
              }
            />
          </>
        )}

      </Routes>
    </div>
  );
};

export default Home;