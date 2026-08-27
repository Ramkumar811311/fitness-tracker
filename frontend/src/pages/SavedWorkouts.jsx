import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const SavedWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  useEffect(() => {
    // Load saved workouts from localStorage
    try {
      const savedWorkouts = JSON.parse(localStorage.getItem("workouts") || "[]");
      setWorkouts(savedWorkouts);
      setLoading(false);
    } catch (err) {
      console.error("Error loading workouts:", err);
      setError("Failed to load saved workouts");
      setLoading(false);
    }
  }, []);

  // Delete a workout
  const deleteWorkout = (id) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      const updatedWorkouts = workouts.filter(workout => workout.id !== id);
      localStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
      setWorkouts(updatedWorkouts);
      
      if (selectedWorkout && selectedWorkout.id === id) {
        setSelectedWorkout(null);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (loading) return <LoadingSpinner text="Loading your saved workouts..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">My Workouts</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Workouts List */}
        <div className="w-full lg:w-1/3">
          <Card title="Saved Workouts" className="mb-4">
            {workouts.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-gray-500 mb-4">You don't have any saved workouts yet.</p>
                <Link to="/WorkoutBuilder">
                  <Button variant="primary">Create Your First Workout</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {workouts.map(workout => (
                  <div 
                    key={workout.id} 
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedWorkout?.id === workout.id ? 'bg-green-50 border-green-300' : 'hover:bg-gray-50'}`}
                    onClick={() => setSelectedWorkout(workout)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{workout.name}</h3>
                      <span className="text-xs text-gray-500">{formatDate(workout.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {workout.exercises.length} exercises
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
          
          {workouts.length > 0 && (
            <div className="text-center">
              <Link to="/WorkoutBuilder">
                <Button variant="outline">Create New Workout</Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Workout Details */}
        <div className="w-full lg:w-2/3">
          {selectedWorkout ? (
            <Card title={selectedWorkout.name} className="h-full">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">Created on {formatDate(selectedWorkout.createdAt)}</p>
                <Button 
                  variant="danger" 
                  size="small" 
                  onClick={() => deleteWorkout(selectedWorkout.id)}
                >
                  Delete Workout
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercise</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sets</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reps</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedWorkout.exercises.map((exercise, index) => (
                      <tr key={`${exercise.id}-${index}`}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{exercise.name}</div>
                          <div className="text-xs text-gray-500">
                            <span className="mr-2">{exercise.bodyPart}</span>
                            <span className="mr-2">•</span>
                            <span>{exercise.equipment}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {exercise.sets}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {exercise.reps}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {exercise.weight}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Workout Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedWorkout.exercises.length}</p>
                    <p className="text-sm text-gray-600">Exercises</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {selectedWorkout.exercises.reduce((total, ex) => total + ex.sets, 0)}
                    </p>
                    <p className="text-sm text-gray-600">Total Sets</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {selectedWorkout.exercises.reduce((total, ex) => {
                        return total + (ex.sets * ex.reps);
                      }, 0)}
                    </p>
                    <p className="text-sm text-gray-600">Total Reps</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {[...new Set(selectedWorkout.exercises.map(ex => ex.bodyPart))].length}
                    </p>
                    <p className="text-sm text-gray-600">Body Parts</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="primary" onClick={() => window.print()}>
                  Print Workout
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center py-12">
                <p className="text-xl text-gray-500 mb-4">Select a workout to view details</p>
                {workouts.length === 0 && (
                  <Link to="/WorkoutBuilder">
                    <Button variant="primary">Create Your First Workout</Button>
                  </Link>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedWorkouts; 