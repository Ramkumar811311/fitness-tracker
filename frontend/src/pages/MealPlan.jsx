import React, { useState } from "react";

const MealPlan = () => {
  const [goal, setGoal] = useState("Weight Loss");

  const mealPlans = {
    "Weight Loss": {
      calories: 1800,
      meals: [
        {
          type: "Breakfast",
          icon: "🍳",
          name: "Oats & Eggs",
          description: "Oats with banana + 2 boiled eggs",
          calories: 400,
        },
        {
          type: "Lunch",
          icon: "🥗",
          name: "Chicken Rice Bowl",
          description: "Grilled chicken, rice & mixed vegetables",
          calories: 500,
        },
        {
          type: "Snack",
          icon: "🍎",
          name: "Fruit & Nuts",
          description: "Apple with a handful of almonds",
          calories: 250,
        },
        {
          type: "Dinner",
          icon: "🍗",
          name: "Grilled Chicken & Salad",
          description: "Grilled chicken with fresh green salad",
          calories: 450,
        },
      ],
    },

    "Muscle Gain": {
      calories: 2600,
      meals: [
        {
          type: "Breakfast",
          icon: "🥚",
          name: "Protein Breakfast",
          description: "4 eggs, oats, banana & milk",
          calories: 600,
        },
        {
          type: "Lunch",
          icon: "🍗",
          name: "Chicken Rice",
          description: "Chicken breast, rice & vegetables",
          calories: 700,
        },
        {
          type: "Snack",
          icon: "🥜",
          name: "Protein Snack",
          description: "Peanut butter sandwich & milk",
          calories: 400,
        },
        {
          type: "Dinner",
          icon: "🥩",
          name: "Protein Dinner",
          description: "Paneer/chicken with rice and vegetables",
          calories: 650,
        },
      ],
    },

    Maintenance: {
      calories: 2200,
      meals: [
        {
          type: "Breakfast",
          icon: "🥣",
          name: "Healthy Breakfast",
          description: "Oats, fruits, milk & boiled eggs",
          calories: 500,
        },
        {
          type: "Lunch",
          icon: "🍚",
          name: "Balanced Lunch",
          description: "Rice, dal, vegetables & salad",
          calories: 600,
        },
        {
          type: "Snack",
          icon: "🍌",
          name: "Healthy Snack",
          description: "Banana, yogurt & almonds",
          calories: 300,
        },
        {
          type: "Dinner",
          icon: "🥗",
          name: "Light Dinner",
          description: "Paneer/chicken with vegetables",
          calories: 550,
        },
      ],
    },
  };

  const currentPlan = mealPlans[goal];

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-green-600 text-xs font-bold tracking-widest">
            FITFUSION • NUTRITION
          </span>

          <h1 className="text-4xl md:text-5xl font-black text-gray-800 mt-2">
            Your Meal <span className="text-green-600">Plan</span>
          </h1>

          <p className="text-gray-500 mt-3">
            Plan your meals and stay consistent with your fitness goals.
          </p>
        </div>

        {/* Goal Selector */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">
            Choose Your Goal
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.keys(mealPlans).map((item) => (
              <button
                key={item}
                onClick={() => setGoal(item)}
                className={`p-3 rounded-xl font-semibold transition ${
                  goal === item
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Current Goal</p>
            <h3 className="text-xl font-bold text-green-600 mt-1">
              {goal}
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Daily Calories</p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">
              {currentPlan.calories} kcal
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Meals Per Day</p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">
              {currentPlan.meals.length} Meals
            </h3>
          </div>

        </div>

        {/* Meals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {currentPlan.meals.map((meal) => (
            <div
              key={meal.type}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center text-3xl">
                    {meal.icon}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-green-600 uppercase tracking-wide">
                      {meal.type}
                    </p>

                    <h3 className="text-lg font-bold text-gray-800">
                      {meal.name}
                    </h3>
                  </div>
                </div>

                <span className="text-sm font-bold text-orange-500">
                  {meal.calories} kcal
                </span>

              </div>

              <p className="text-gray-500 text-sm mt-5">
                {meal.description}
              </p>

              <button className="mt-5 text-sm font-semibold text-green-600 hover:text-green-800">
                View meal →
              </button>
            </div>
          ))}

        </div>

        {/* Water Reminder */}
        <div className="mt-6 bg-gray-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-green-400 text-xs font-bold tracking-widest">
              DAILY HYDRATION
            </p>

            <h2 className="text-xl font-bold mt-1">
              Don't forget your water 💧
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Stay hydrated throughout the day.
            </p>
          </div>

          <div className="text-3xl font-black">
            2.5L
          </div>
        </div>

      </div>
    </div>
  );
};

export default MealPlan;