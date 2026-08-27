import React from "react";
import { Outlet } from "react-router-dom";
import NavLink from "../components/NavLink1";

const ProfileLayout = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mt-10">

      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-gray-100 border border-gray-300 rounded-xl p-3">

        <h2 className="text-xl font-bold px-4 py-3 text-gray-800">
          My Profile
        </h2>

        <div className="flex flex-col gap-1">
          <NavLink to="/profile/update-profile">
            👤 Update Profile
          </NavLink>

          <NavLink to="/profile/workout-details">
            🏋️ Workout Details
          </NavLink>

          <NavLink to="/profile/meal-plan">
            🍽️ Meal Plan
          </NavLink>

          <NavLink to="/profile/water-intake">
            💧 Water Intake
          </NavLink>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>

    </div>
  );
};

export default ProfileLayout;