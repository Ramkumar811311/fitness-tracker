import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSpinner,
  faExclamationTriangle,
  faTimes,
  faInfoCircle,
  faAppleAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../css/nutrition.css";

const Card = ({ children, className = "", title = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    {title && (
      <div className="px-6 py-4 bg-green-50 border-b border-green-100">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  className = "",
}) => {
  const baseClasses =
    "font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200";

  const variantClasses = {
    primary:
      "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-400",
    outline:
      "border border-gray-300 hover:border-green-500 hover:bg-green-50 text-gray-700 focus:ring-green-400",
  };

  const sizeClasses = {
    small: "px-3 py-2 text-sm",
    medium: "px-5 py-2.5",
    large: "px-6 py-3 text-lg",
  };

  const disabledClass = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClass} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({
  label,
  type = "text",
  id,
  name,
  value,
  onChange,
  onKeyPress,
  placeholder = "",
  error = "",
  className = "",
}) => (
  <div className={`w-full ${className}`}>
    {label && (
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        {label}
      </label>
    )}

    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        className={`w-full px-4 py-3 pr-10 border rounded-xl outline-none transition-all ${
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100"
        }`}
      />

      {error && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-red-500"
          />
        </div>
      )}
    </div>

    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="flex items-center justify-center py-5 text-gray-500">
    <FontAwesomeIcon
      icon={faSpinner}
      spin
      className="text-green-500 mr-2"
    />
    <span>{text}</span>
  </div>
);

const ErrorMessage = ({ message, retry = null }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start">
    <FontAwesomeIcon
      icon={faExclamationTriangle}
      className="text-red-500 mr-3 mt-1"
    />

    <div>
      <p>{message}</p>

      {retry && (
        <button
          onClick={retry}
          className="text-red-700 font-semibold hover:text-red-900 mt-2 underline"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

const NutritionChecker = () => {
  const [isFoodItem, setIsFoodItem] = useState("");
  const [nutritionResult, setNutritionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputError, setInputError] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  const handleInputChange = (event) => {
    setIsFoodItem(event.target.value);

    if (inputError) {
      setInputError("");
    }
  };

  const handleSearch = async () => {
    if (!isFoodItem.trim()) {
      setInputError("Please enter a food item to search");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(
          isFoodItem
        )}`,
        {
          headers: {
            "X-Api-Key":
              "MYYksvtBoYX0Wk+fylOq0A==AIDtjN1lmZG0OpVn",
          },
        }
      );

      if (response.data && Array.isArray(response.data.items)) {
        if (response.data.items.length > 0) {
          setNutritionResult(response.data.items[0]);
          addToRecentSearches(
            isFoodItem,
            response.data.items[0].name
          );
        } else {
          setNutritionResult(null);
          setError("No nutrition information found for that food item.");
        }
      } else {
        setNutritionResult(response.data);

        if (response.data.name) {
          addToRecentSearches(
            isFoodItem,
            response.data.name
          );
        }
      }
    } catch (error) {
      console.error("Error fetching nutrition information:", error);
      setError(`Error: ${error.message}. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  const addToRecentSearches = (query, result) => {
    const search = {
      query,
      result,
      timestamp: new Date().toISOString(),
    };

    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (item) => item.query !== query
      );

      return [search, ...filtered].slice(0, 5);
    });
  };

  const handleRecentSearchClick = (query) => {
    setIsFoodItem(query);

    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setIsFoodItem("");
    setNutritionResult(null);
    setError(null);
    setInputError("");
  };

  const renderResult = () => {
    if (!nutritionResult) return null;

    const hasNutritionData =
      nutritionResult.name ||
      (nutritionResult.calories !== undefined &&
        nutritionResult.protein_g !== undefined);

    if (!hasNutritionData) {
      return (
        <ErrorMessage message="Unable to parse nutrition data format." />
      );
    }

    const nutrients = [
      {
        name: "Calories",
        value: nutritionResult.calories,
        unit: " kcal",
        color: "orange",
      },
      {
        name: "Total Fat",
        value: nutritionResult.fat_total_g,
        unit: " g",
        color: "yellow",
      },
      {
        name: "Saturated Fat",
        value: nutritionResult.fat_saturated_g,
        unit: " g",
        color: "yellow",
      },
      {
        name: "Cholesterol",
        value: nutritionResult.cholesterol_mg,
        unit: " mg",
        color: "red",
      },
      {
        name: "Sodium",
        value: nutritionResult.sodium_mg,
        unit: " mg",
        color: "blue",
      },
      {
        name: "Total Carbohydrates",
        value: nutritionResult.carbohydrates_total_g,
        unit: " g",
        color: "green",
      },
      {
        name: "Dietary Fiber",
        value: nutritionResult.fiber_g,
        unit: " g",
        color: "brown",
      },
      {
        name: "Sugar",
        value: nutritionResult.sugar_g,
        unit: " g",
        color: "purple",
      },
      {
        name: "Protein",
        value: nutritionResult.protein_g,
        unit: " g",
        color: "indigo",
      },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-full mt-7">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">
                Nutrition Facts
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {nutritionResult.name || isFoodItem}
              </h2>
            </div>

            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs">
              Per 100g
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {nutrients.map((nutrient, index) => (
              <div
                key={index}
                className={`border border-gray-100 rounded-xl overflow-hidden ${
                  nutrient.name === "Calories"
                    ? "md:col-span-2 bg-orange-50"
                    : "bg-white"
                }`}
              >
                <div className="flex justify-between items-center p-4">
                  <span className="font-medium text-gray-600">
                    {nutrient.name}
                  </span>

                  <span className="font-bold text-gray-900">
                    {nutrient.value !== undefined &&
                    nutrient.value !== null
                      ? `${nutrient.value}${nutrient.unit}`
                      : "N/A"}
                  </span>
                </div>

                {nutrient.value > 0 && (
                  <div className="h-1 bg-gray-100">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${Math.min(
                          nutrient.name === "Calories"
                            ? (nutritionResult.calories / 500) *
                                100
                            : (nutrient.value /
                                (nutrient.name ===
                                "Total Carbohydrates"
                                  ? 50
                                  : nutrient.name === "Protein"
                                  ? 30
                                  : nutrient.name ===
                                    "Total Fat"
                                  ? 20
                                  : 100)) *
                                100
                        )}%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 border-t pt-5">
            <div className="text-xs text-gray-500 flex items-center">
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="mr-2 text-green-500"
              />
              Data source: CalorieNinjas API
            </div>

            <Button
              variant="outline"
              onClick={handleClear}
              size="small"
            >
              Search Another Food
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  };

  const commonFoods = [
    "Apple",
    "Banana",
    "Chicken Breast",
    "Egg",
    "Rice",
    "Broccoli",
    "Salmon",
    "Avocado",
    "Sweet Potato",
    "Quinoa",
  ];

  return (
    <div className="nutrition-page">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="nutrition-header"
        >
          <span className="nutrition-label">
            FITFUSION • NUTRITION
          </span>

          <h1>
            Know what you <span>eat.</span>
          </h1>

          <p>
            Search any food and instantly understand its
            nutritional value.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-7">
          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:w-2/3"
          >
            <Card title="Food Search">
              <div className="flex flex-col gap-5">
                <Input
                  type="text"
                  id="foodItem"
                  name="foodItem"
                  placeholder="Try apple, chicken breast, rice..."
                  value={isFoodItem}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  error={inputError}
                  label="What did you eat?"
                />

                <div className="flex gap-2">
                  <Button
                    onClick={handleSearch}
                    disabled={
                      isLoading || !isFoodItem.trim()
                    }
                    className="flex-1 sm:flex-none"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faSpinner}
                          spin
                          className="mr-2"
                        />
                        Searching...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faSearch}
                          className="mr-2"
                        />
                        Search Food
                      </span>
                    )}
                  </Button>

                  {isFoodItem && (
                    <Button
                      variant="secondary"
                      onClick={handleClear}
                    >
                      Clear
                    </Button>
                  )}
                </div>

                {isLoading && (
                  <LoadingSpinner text="Finding nutrition information..." />
                )}

                {error && (
                  <ErrorMessage
                    message={error}
                    retry={handleSearch}
                  />
                )}

                {!nutritionResult && !isLoading && (
                  <div className="pt-3 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3">
                      Popular foods
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {commonFoods.map((food) => (
                        <button
                          key={food}
                          onClick={() => {
                            setIsFoodItem(food);

                            setTimeout(() => {
                              handleSearch();
                            }, 100);
                          }}
                          className="px-3 py-2 bg-green-50 text-green-700 rounded-full text-xs font-medium hover:bg-green-100 transition-colors"
                        >
                          {food}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {renderResult()}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:w-1/3"
          >
            <Card title="Recent Searches">
              {recentSearches.length === 0 ? (
                <div className="py-10 text-center text-gray-400">
                  <FontAwesomeIcon
                    icon={faAppleAlt}
                    className="text-3xl mb-3 text-green-200"
                  />

                  <p className="text-sm">
                    Your recent searches will appear here
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recentSearches.map((item, index) => (
                    <li
                      key={index}
                      className="py-3 first:pt-0 last:pb-0"
                    >
                      <button
                        onClick={() =>
                          handleRecentSearchClick(item.query)
                        }
                        className="w-full text-left p-3 rounded-xl hover:bg-green-50 transition-colors"
                      >
                        <div className="font-semibold text-gray-800">
                          {item.result || item.query}
                        </div>

                        <div className="text-xs text-gray-400 mt-1 flex justify-between">
                          <span>
                            Search: {item.query}
                          </span>

                          <span>
                            {new Date(
                              item.timestamp
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card
              title="About Nutrition Data"
              className="mt-5"
            >
              <div className="text-sm text-gray-500 leading-7">
                <p>
                  Nutrition information is provided per 100g
                  serving. Values may vary depending on food
                  variety and preparation methods.
                </p>

                <div className="mt-4 space-y-2">
                  <p>
                    <strong className="text-gray-700">
                      Calories:
                    </strong>{" "}
                    Energy content
                  </p>

                  <p>
                    <strong className="text-gray-700">
                      Protein:
                    </strong>{" "}
                    Muscle building and repair
                  </p>

                  <p>
                    <strong className="text-gray-700">
                      Carbohydrates:
                    </strong>{" "}
                    Main energy source
                  </p>

                  <p>
                    <strong className="text-gray-700">
                      Fats:
                    </strong>{" "}
                    Important for hormones and nutrients
                  </p>

                  <p>
                    <strong className="text-gray-700">
                      Fiber:
                    </strong>{" "}
                    Supports healthy digestion
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NutritionChecker;