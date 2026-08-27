import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const WorkoutDatabase = () => {
  const [isExercise, setIsExercise] = useState("");
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allMuscleGroups] = useState([
    { value: "back", label: "Back" },
    { value: "cardio", label: "Cardio" },
    { value: "chest", label: "Chest" },
    { value: "lower%20arms", label: "Lower Arms" },
    { value: "lower%20legs", label: "Lower Legs" },
    { value: "neck", label: "Neck" },
    { value: "shoulders", label: "Shoulders" },
    { value: "upper%20arms", label: "Upper Arms" },
    { value: "upper%20legs", label: "Upper Legs" },
    { value: "waist", label: "Waist" }
  ]);

  const handleSelectChange = (event) => {
    setIsExercise(event.target.value);
  };

  const handleSearch = async () => {
    if (!isExercise) return;

    setIsLoading(true);

    try {
      const response = await axios.get(`/api/exercises/search?type=bodyPart&query=${isExercise}`);
      setExercises(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pt-4 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Exercise Library
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Browse through hundreds of exercises categorized by muscle groups.
          Find the perfect movement for your workout routine.
        </p>
      </motion.div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-12 max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Your Exercise</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <select
                value={isExercise}
                onChange={handleSelectChange}
                className="block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-lg shadow-sm"
              >
                <option value="">Select Muscle Group</option>
                {allMuscleGroups.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                </svg>
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={!isExercise || isLoading}
              className={`px-6 py-3 rounded-lg shadow-sm text-white font-medium transition-all duration-200 ${!isExercise || isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 hover:shadow"
                }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="loader"></div>
          </div>
        ) : exercises.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {isExercise ? (
              <p>No exercises found. Try selecting a different muscle group.</p>
            ) : (
              <div className="space-y-4">
                <p className="text-lg">Select a muscle group and click search to view exercises</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-w-2xl mx-auto">
                  {allMuscleGroups.slice(0, 5).map((group) => (
                    <div
                      key={group.value}
                      className="bg-gray-100 rounded-lg p-2 text-center text-sm cursor-pointer hover:bg-green-100 transition-colors"
                      onClick={() => {
                        setIsExercise(group.value);
                        setTimeout(handleSearch, 100);
                      }}
                    >
                      {group.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {exercises.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {exercises.length} Exercises Found
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {exercises.map((exercise) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="p-4 bg-gray-50">
                  <img
                    src={exercise?.gifUrl}
                    alt={exercise.name}
                    className="w-full h-48 object-contain mx-auto"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800 capitalize mb-2">
                    {exercise?.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {exercise.bodyPart}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {exercise.target}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {exercise.equipment}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <style>
        {`
        .loader {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #4CAF50;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
      </style>
    </div>
  );
};

export default WorkoutDatabase;
