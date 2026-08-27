import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "../components/Card";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Button from "../components/Button";
import Input from "../components/Input";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faDumbbell,
  faPlus,
  faCheck,
  faTimes,
  faSave,
  faArrowRight,
  faFilter,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";

const WorkoutBuilder = () => {
  // States for filter options
  const [bodyParts, setBodyParts] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // States for selected filters
  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // UI state variables
  const [showFilters, setShowFilters] = useState(true);
  const [activeSection, setActiveSection] = useState('search'); // 'search' or 'plan'
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const searchInputRef = useRef(null);

  // States for found exercises and workout plan
  const [exercises, setExercises] = useState([]);
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [workoutName, setWorkoutName] = useState("");

  // Load filter options on component mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setLoading(true);
      setError(null);

      try {
        const [bodyPartRes, equipmentRes, targetRes] = await Promise.all([
          axios.get(`/api/exercises/bodyPartList`),
          axios.get(`/api/exercises/equipmentList`),
          axios.get(`/api/exercises/targetList`)
        ]);

        setBodyParts(bodyPartRes.data || []);
        setEquipment(equipmentRes.data || []);
        setTargets(targetRes.data || []);
      } catch (err) {
        console.error("Error fetching filter options:", err);
        setError("Failed to load exercise categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);


  // Search exercises based on filters
  const searchExercises = async () => {
    if (!selectedBodyPart && !selectedEquipment && !selectedTarget && !searchTerm) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let type = "";
      let query = "";

      if (searchTerm) {
        type = "name";
        query = searchTerm;
      } else if (selectedBodyPart) {
        type = "bodyPart";
        query = selectedBodyPart;
      } else if (selectedEquipment) {
        type = "equipment";
        query = selectedEquipment;
      } else if (selectedTarget) {
        type = "target";
        query = selectedTarget;
      }

      const response = await axios.get(
        `/api/exercises/search?type=${type}&query=${encodeURIComponent(query)}`
      );

      // Set the exercises state with the response data
      setExercises(response.data);
    } catch (err) {
      console.error("Error searching exercises:", err);
      setError("Failed to search exercises. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedBodyPart("");
    setSelectedEquipment("");
    setSelectedTarget("");
    setSearchTerm("");
    setExercises([]);
  };

  // Add exercise to workout plan
  const addToWorkout = (exercise) => {
    const exerciseWithSets = {
      ...exercise,
      sets: 3,
      reps: 10,
      weight: 0,
    };
    setWorkoutPlan([...workoutPlan, exerciseWithSets]);
  };

  // Remove exercise from workout plan
  const removeFromWorkout = (id) => {
    setWorkoutPlan(workoutPlan.filter(exercise => exercise.id !== id));
  };

  // Update sets, reps, or weight for an exercise in the workout plan
  const updateExerciseDetails = (id, field, value) => {
    setWorkoutPlan(workoutPlan.map(exercise =>
      exercise.id === id ? { ...exercise, [field]: value } : exercise
    ));
  };

  // Save workout plan
  const saveWorkout = () => {
    if (!workoutName.trim()) {
      alert("Please enter a workout name");
      return;
    }

    // Save to local storage for demo purposes
    // In a real app, you would save to your backend
    const workout = {
      id: Date.now(),
      name: workoutName,
      exercises: workoutPlan,
      createdAt: new Date().toISOString(),
    };

    const savedWorkouts = JSON.parse(localStorage.getItem("workouts") || "[]");
    localStorage.setItem("workouts", JSON.stringify([...savedWorkouts, workout]));

    // Reset form and show success toast
    setWorkoutName("");
    setWorkoutPlan([]);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  // Helper function for animations
  const PulseAnimation = ({ children }) => (
    <motion.span
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
    >
      {children}
    </motion.span>
  );

  // Save success toast component
  const SaveSuccessToast = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50"
    >
      <div className="flex items-center">
        <FontAwesomeIcon icon={faCheck} className="mr-2" />
        <p>Workout saved successfully!</p>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-4 px-4">
      {showSaveSuccess && <SaveSuccessToast />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 text-center"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
              className="bg-gradient-to-br from-purple-500 to-purple-700 p-4 rounded-2xl shadow-lg text-white text-4xl"
            >
              <FontAwesomeIcon icon={faDumbbell} />
            </motion.div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 tracking-tight">
            Workout Builder
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto px-4 leading-relaxed">
            Build your perfect workout routine by searching for exercises and customizing sets, reps, and weights.
            <span className="hidden md:inline"> Create, save, and track your progress all in one place.</span>
          </p>
        </motion.div>

        {/* Steps Indicator */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative px-4">
            {/* Steps buttons */}
            <div className="relative z-10 flex justify-center gap-20 items-center">
              {/* Find Exercises Step */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(139, 92, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSection('search')}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ${activeSection === 'search'
                    ? 'bg-gradient-to-br from-purple-500 to-purple-700 scale-110'
                    : 'bg-gray-400 hover:bg-gray-500'
                    }`}
                >
                  <FontAwesomeIcon icon={faSearch} className="text-xl" />
                </motion.button>
                <div className="mt-3 flex flex-col items-center">
                  <span className={`font-medium transition-all duration-300 ${activeSection === 'search' ? 'text-purple-700 text-base' : 'text-gray-500 text-sm'
                    }`}>
                    Find Exercises
                  </span>
                  {activeSection === 'search' && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                      className="h-1 bg-purple-500 rounded-full mt-1"
                    />
                  )}
                </div>
              </motion.div>

              {/* Build Workout Step */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(139, 92, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSection('plan')}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ${activeSection === 'plan'
                    ? 'bg-gradient-to-br from-purple-500 to-purple-700 scale-110'
                    : 'bg-gray-400 hover:bg-gray-500'
                    }`}
                >
                  <FontAwesomeIcon icon={faDumbbell} className="text-xl" />
                </motion.button>
                <div className="mt-3 flex flex-col items-center">
                  <span className={`font-medium transition-all duration-300 ${activeSection === 'plan' ? 'text-purple-700 text-base' : 'text-gray-500 text-sm'
                    }`}>
                    Build Workout
                  </span>
                  {activeSection === 'plan' && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                      className="h-1 bg-purple-500 rounded-full mt-1"
                    />
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8">
          {/* Search Section */}
          {activeSection === 'search' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <FontAwesomeIcon icon={faSearch} className="mr-2 text-purple-500" />
                    Find Exercises
                  </h2>
                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    size="small"
                  >
                    <FontAwesomeIcon icon={faFilter} className="mr-2" />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </Button>
                </div>

                <div className="p-6">
                  {/* Search Input */}
                  <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                    </div>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                      }}
                      placeholder="Search exercises by name (e.g., bench press, squat, deadlift)"
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {searchTerm && (
                      <button
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setSearchTerm("")}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    )}
                  </div>

                  {/* Filters */}
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-6"
                    >
                      <h3 className="text-md font-medium text-gray-700 mb-3">Filter Exercises By:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Body Part Filter */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Body Part</label>
                          <div className="relative">
                            <select
                              value={selectedBodyPart}
                              onChange={(e) => {
                                setSelectedBodyPart(e.target.value);
                                setSearchTerm("");
                              }}
                              className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm appearance-none"
                            >
                              <option value="">Select Body Part</option>
                              {bodyParts.map((part) => (
                                <option key={part} value={part}>{part.charAt(0).toUpperCase() + part.slice(1)}</option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Equipment Filter */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Equipment</label>
                          <div className="relative">
                            <select
                              value={selectedEquipment}
                              onChange={(e) => {
                                setSelectedEquipment(e.target.value);
                                setSearchTerm("");
                              }}
                              className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm appearance-none"
                            >
                              <option value="">Select Equipment</option>
                              {equipment.map((item) => (
                                <option key={item} value={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Target Muscle Filter */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Target Muscle</label>
                          <div className="relative">
                            <select
                              value={selectedTarget}
                              onChange={(e) => {
                                setSelectedTarget(e.target.value);
                                setSearchTerm("");
                              }}
                              className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm appearance-none"
                            >
                              <option value="">Select Target Muscle</option>
                              {targets.map((target) => (
                                <option key={target} value={target}>{target.charAt(0).toUpperCase() + target.slice(1)}</option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick select body parts */}
                      <div className="flex flex-wrap mt-3 gap-2">
                        {bodyParts.slice(0, 6).map((part) => (
                          <button
                            key={part}
                            onClick={() => {
                              setSelectedBodyPart(part);
                              setSearchTerm("");
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedBodyPart === part
                              ? "bg-purple-600 text-white"
                              : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                              }`}
                          >
                            {part.charAt(0).toUpperCase() + part.slice(1)}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Search Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div>
                      {(selectedBodyPart || selectedEquipment || selectedTarget || searchTerm) && (
                        <Button
                          onClick={resetFilters}
                          variant="secondary"
                          size="small"
                        >
                          <FontAwesomeIcon icon={faTimes} className="mr-2" />
                          Clear Filters
                        </Button>
                      )}
                    </div>

                    <Button
                      onClick={searchExercises}
                      disabled={!selectedBodyPart && !selectedEquipment && !selectedTarget && !searchTerm || loading}
                      className={(!selectedBodyPart && !selectedEquipment && !selectedTarget && !searchTerm || loading) ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span>Searching...</span>
                        </div>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSearch} className="mr-2" />
                          Search Exercises
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Error Messages */}
              {error && <ErrorMessage message={error} className="mt-4" />}

              {/* Search Results / Loading State */}
              {loading ? (
                <div className="flex justify-center items-center h-40 mt-8">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600 font-medium">Searching for exercises...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mt-8 rounded shadow-sm">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FontAwesomeIcon icon={faTimes} className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">{error}</p>
                      <p className="text-sm mt-2">Please try again or try a different search.</p>
                    </div>
                  </div>
                </div>
              ) : exercises.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-8"
                >
                  <Card className="overflow-hidden">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
                      <h2 className="text-xl font-bold text-gray-800">Found {exercises.length} Exercises</h2>
                      <div className="text-sm text-gray-500 flex items-center flex-wrap gap-2">
                        <FontAwesomeIcon icon={faDumbbell} className="mr-2 text-purple-500" />
                        {searchTerm && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Search: "{searchTerm}"</span>}
                        {selectedBodyPart && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Body Part: {selectedBodyPart}</span>}
                        {selectedEquipment && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">Equipment: {selectedEquipment}</span>}
                        {selectedTarget && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Target: {selectedTarget}</span>}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exercises.slice(0, 9).map((exercise) => (
                          <motion.div
                            key={exercise.id}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
                          >
                            {/* Image Container with Gradient Overlay */}
                            <div className="relative h-52 bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden">
                              <div className="absolute top-2 right-2 z-10">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-80 text-purple-700 backdrop-blur-sm shadow-sm">
                                  {exercise.bodyPart}
                                </span>
                              </div>
                              <img
                                src={exercise.gifUrl}
                                alt={exercise.name}
                                className="h-full w-full object-contain p-2"
                                loading="lazy"
                              />
                            </div>

                            {/* Content Container */}
                            <div className="p-5 flex-grow flex flex-col">
                              <h3 className="font-bold text-lg text-gray-800 capitalize mb-2 line-clamp-1">{exercise.name}</h3>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                <div className="flex items-center text-xs">
                                  <span className="w-2 h-2 rounded-full bg-indigo-400 mr-1"></span>
                                  <span className="text-gray-600">{exercise.equipment}</span>
                                </div>
                                <div className="flex items-center text-xs">
                                  <span className="w-2 h-2 rounded-full bg-green-400 mr-1"></span>
                                  <span className="text-gray-600">{exercise.target}</span>
                                </div>
                              </div>

                              {/* Separator */}
                              <div className="border-t border-gray-100 my-2 flex-grow"></div>

                              {/* Action Button */}
                              <div className="mt-auto">
                                {workoutPlan.some(ex => ex.id === exercise.id) ? (
                                  <div className="flex items-center justify-center py-2 px-4 bg-gray-50 text-gray-500 rounded-lg border border-gray-200">
                                    <FontAwesomeIcon icon={faCheck} className="mr-2 text-green-500" />
                                    <span className="font-medium">Added to Workout</span>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      addToWorkout(exercise);
                                      setActiveSection('plan');
                                    }}
                                    className="w-full flex items-center justify-center py-2 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200"
                                  >
                                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                    Add to Workout
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      {exercises.length > 9 && (
                        <div className="mt-6 text-center">
                          <p className="text-gray-600 mb-4">Showing 9 of {exercises.length} exercises. Refine your search for more specific results.</p>
                          <Button variant="outline" size="small">
                            Load More Exercises
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Workout Plan Builder */}
          {activeSection === 'plan' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10 border border-purple-100">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <svg className="w-7 h-7 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <h2 className="text-2xl font-bold text-white">Your Workout Plan</h2>
                    </div>
                    <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {workoutPlan.length} {workoutPlan.length === 1 ? 'Exercise' : 'Exercises'} Selected
                    </span>
                  </div>

                  <div className="p-6">
                    {workoutPlan.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <p className="text-gray-500 mb-4">Start building your workout by adding exercises</p>
                        <button
                          onClick={() => {
                            // Focus on the search input when clicking this button
                            document.querySelector('input[type="text"]')?.focus();
                          }}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Find Exercises
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="mb-6">
                          <label htmlFor="workoutName" className="block text-sm font-medium text-gray-700 mb-1">
                            Workout Name
                          </label>
                          <input
                            type="text"
                            id="workoutName"
                            value={workoutName}
                            onChange={(e) => setWorkoutName(e.target.value)}
                            placeholder="E.g., Monday Upper Body"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Selected Exercises</h3>

                        <div className="space-y-4">
                          {workoutPlan.map((exercise, index) => (
                            <div
                              key={exercise.id}
                              className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold mr-3">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                        {exercise.bodyPart}
                                      </span>
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        {exercise.equipment}
                                      </span>
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                        {exercise.target}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeFromWorkout(exercise.id)}
                                  className="text-red-500 hover:text-red-700 focus:outline-none"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Sets
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={exercise.sets || ""}
                                    onChange={(e) => updateExerciseDetails(exercise.id, 'sets', parseInt(e.target.value) || 1)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Reps
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={exercise.reps || ""}
                                    onChange={(e) => updateExerciseDetails(exercise.id, 'reps', parseInt(e.target.value) || 1)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Weight (kg)
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={exercise.weight || ""}
                                    onChange={(e) => updateExerciseDetails(exercise.id, 'weight', parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between mt-6">
                          <button
                            onClick={() => setWorkoutPlan([])}
                            className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear All
                          </button>

                          <button
                            onClick={saveWorkout}
                            disabled={!workoutName || workoutPlan.length === 0}
                            className={`flex items-center px-6 py-2 rounded-lg transition-colors ${!workoutName || workoutPlan.length === 0
                              ? "bg-gray-300 cursor-not-allowed text-gray-500"
                              : "bg-purple-600 hover:bg-purple-700 text-white"
                              }`}
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            Save Workout
                          </button>
                        </div>
                      </>
                    )}

                    {/* Workout Tips Section */}
                    <div className="mt-8 bg-blue-50 rounded-lg p-5 border border-blue-100">
                      <h3 className="text-lg font-semibold text-blue-700 mb-3">Tips for Building an Effective Workout</h3>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-0.5">•</span>
                          <span><strong className="text-blue-700">Balance your training:</strong> Include exercises for all major muscle groups for a well-rounded workout.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-0.5">•</span>
                          <span><strong className="text-blue-700">Progressive overload:</strong> Gradually increase weight, sets, or reps to continue challenging your muscles.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-0.5">•</span>
                          <span><strong className="text-blue-700">Rest adequately:</strong> Allow 48 hours of recovery for muscle groups between intense workouts.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default WorkoutBuilder; 