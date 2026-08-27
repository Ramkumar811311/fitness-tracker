import React, { useState } from "react";
import { motion } from "framer-motion";

const BmrCalculator = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("sedentary");

  const [calculatedBMR, setCalculatedBMR] = useState(null);

  const [calories, setCalories] = useState({
    deficit: "",
    maintenance: "",
    bulking: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [showResults, setShowResults] = useState(false);

  const activityLevels = [
    {
      id: "sedentary",
      label: "Sedentary — little or no exercise",
      multiplier: 1.2,
    },
    {
      id: "light",
      label: "Lightly active — 1-3 days/week",
      multiplier: 1.375,
    },
    {
      id: "moderate",
      label: "Moderately active — 3-5 days/week",
      multiplier: 1.55,
    },
    {
      id: "active",
      label: "Very active — 6-7 days/week",
      multiplier: 1.725,
    },
    {
      id: "very-active",
      label: "Extra active — hard exercise/job",
      multiplier: 1.9,
    },
  ];

  const validateForm = () => {
    const errors = {};

    if (!age) {
      errors.age = "Age is required";
    } else if (isNaN(age) || age <= 0 || age > 120) {
      errors.age = "Enter a valid age (1-120)";
    }

    if (!weight) {
      errors.weight = "Weight is required";
    } else if (isNaN(weight) || weight <= 0) {
      errors.weight = "Enter a valid weight";
    }

    if (!height) {
      errors.height = "Height is required";
    } else if (isNaN(height) || height <= 0) {
      errors.height = "Enter a valid height";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const calculateBMR = () => {
    if (!validateForm()) return;

    const weightInKg = parseFloat(weight);
    const heightInCm = parseFloat(height);
    const ageInYears = parseInt(age, 10);

    let bmr = 0;

    if (gender === "male") {
      bmr =
        88.362 +
        13.397 * weightInKg +
        4.799 * heightInCm -
        5.677 * ageInYears;
    } else {
      bmr =
        447.593 +
        9.247 * weightInKg +
        3.098 * heightInCm -
        4.33 * ageInYears;
    }

    setCalculatedBMR(Math.round(bmr));

    const selectedActivity = activityLevels.find(
      (level) => level.id === activityLevel
    );

    const activityMultiplier = selectedActivity
      ? selectedActivity.multiplier
      : 1.2;

    const maintenanceCalories = bmr * activityMultiplier;

    setCalories({
      deficit: Math.round(maintenanceCalories - 500),
      maintenance: Math.round(maintenanceCalories),
      bulking: Math.round(maintenanceCalories + 500),
    });

    setShowResults(true);
  };

  const resetCalculator = () => {
    setShowResults(false);
    setCalculatedBMR(null);

    setCalories({
      deficit: "",
      maintenance: "",
      bulking: "",
    });

    setFormErrors({});
  };

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-xs font-bold tracking-[3px] text-green-600">
            FITFUSION • FITNESS TOOL
          </span>

          <h1 className="text-4xl md:text-5xl font-black text-gray-800 mt-3">
            BMR <span className="text-green-600">Calculator</span>
          </h1>

          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Calculate your Basal Metabolic Rate and estimate your
            daily calorie requirements.
          </p>
        </motion.div>

        <div
          className={`grid gap-6 ${
            showResults
              ? "grid-cols-1 lg:grid-cols-2"
              : "grid-cols-1 max-w-3xl mx-auto"
          }`}
        >

          {/* Calculator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">

              <h2 className="text-2xl font-bold text-gray-800 mb-7">
                Personal Information
              </h2>

              {/* Gender */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Gender
                </label>

                <div className="flex gap-3">
                  <label
                    className={`flex-1 cursor-pointer border rounded-xl p-3 text-center transition ${
                      gender === "male"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === "male"}
                      onChange={() => setGender("male")}
                      className="hidden"
                    />

                    <span className="font-semibold">
                      Male
                    </span>
                  </label>

                  <label
                    className={`flex-1 cursor-pointer border rounded-xl p-3 text-center transition ${
                      gender === "female"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === "female"}
                      onChange={() => setGender("female")}
                      className="hidden"
                    />

                    <span className="font-semibold">
                      Female
                    </span>
                  </label>
                </div>
              </div>

              {/* Age */}
              <div className="mb-5">
                <label
                  htmlFor="age"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Age (years)
                </label>

                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition ${
                    formErrors.age
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  }`}
                />

                {formErrors.age && (
                  <p className="text-red-500 text-xs mt-2">
                    {formErrors.age}
                  </p>
                )}
              </div>

              {/* Weight */}
              <div className="mb-5">
                <label
                  htmlFor="weight"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Weight (kg)
                </label>

                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter your weight"
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition ${
                    formErrors.weight
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  }`}
                />

                {formErrors.weight && (
                  <p className="text-red-500 text-xs mt-2">
                    {formErrors.weight}
                  </p>
                )}
              </div>

              {/* Height */}
              <div className="mb-5">
                <label
                  htmlFor="height"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Height (cm)
                </label>

                <input
                  type="number"
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Enter your height"
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition ${
                    formErrors.height
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  }`}
                />

                {formErrors.height && (
                  <p className="text-red-500 text-xs mt-2">
                    {formErrors.height}
                  </p>
                )}
              </div>

              {/* Activity */}
              <div className="mb-7">
                <label
                  htmlFor="activity"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Activity Level
                </label>

                <select
                  id="activity"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  {activityLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Calculate */}
              <button
                onClick={calculateBMR}
                className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition shadow-sm hover:shadow-md"
              >
                Calculate BMR
              </button>
            </div>
          </motion.div>

          {/* Results */}
          {showResults && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 h-full">

                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Your Results
                </h2>

                {/* BMR */}
                <div className="rounded-2xl bg-green-50 border border-green-100 p-5 mb-6">
                  <span className="text-xs font-bold tracking-wider text-green-600">
                    YOUR BMR
                  </span>

                  <div className="text-4xl font-black text-green-700 mt-2">
                    {calculatedBMR}
                    <span className="text-base font-medium text-gray-500 ml-2">
                      kcal/day
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    Estimated calories your body needs at rest.
                  </p>
                </div>

                {/* Calories */}
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Daily Calorie Needs
                </h3>

                <div className="space-y-3">

                  {/* Deficit */}
                  <div className="flex justify-between items-center p-4 rounded-xl bg-red-50 border border-red-100">
                    <div>
                      <h4 className="font-bold text-gray-800">
                        Weight Loss
                      </h4>

                      <p className="text-xs text-gray-500 mt-1">
                        500 calorie deficit
                      </p>
                    </div>

                    <strong className="text-red-600 text-xl">
                      {calories.deficit}
                      <span className="text-xs ml-1">
                        Cal
                      </span>
                    </strong>
                  </div>

                  {/* Maintenance */}
                  <div className="flex justify-between items-center p-4 rounded-xl bg-green-50 border border-green-200">
                    <div>
                      <h4 className="font-bold text-gray-800">
                        Maintenance
                      </h4>

                      <p className="text-xs text-gray-500 mt-1">
                        Maintain current weight
                      </p>
                    </div>

                    <strong className="text-green-600 text-xl">
                      {calories.maintenance}
                      <span className="text-xs ml-1">
                        Cal
                      </span>
                    </strong>
                  </div>

                  {/* Bulking */}
                  <div className="flex justify-between items-center p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <div>
                      <h4 className="font-bold text-gray-800">
                        Weight Gain
                      </h4>

                      <p className="text-xs text-gray-500 mt-1">
                        500 calorie surplus
                      </p>
                    </div>

                    <strong className="text-blue-600 text-xl">
                      {calories.bulking}
                      <span className="text-xs ml-1">
                        Cal
                      </span>
                    </strong>
                  </div>

                </div>

                {/* Reset */}
                <button
                  onClick={resetCalculator}
                  className="w-full mt-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition"
                >
                  Reset Calculator
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            About BMR
          </h2>

          <div className="text-gray-500 text-sm leading-7">
            <p>
              Your Basal Metabolic Rate (BMR) is the number of
              calories your body needs to maintain basic
              physiological functions while at rest.
            </p>

            <p className="mt-3">
              This calculator uses the Harris-Benedict formula
              based on weight, height, age, and gender. Your
              activity level is then used to estimate your
              daily calorie requirement.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-5 mb-2">
              How to use these results
            </h3>

            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Weight Loss:</strong> calories below maintenance.
              </li>

              <li>
                <strong>Maintenance:</strong> calories around your
                maintenance level.
              </li>

              <li>
                <strong>Weight Gain:</strong> calories above maintenance.
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BmrCalculator;