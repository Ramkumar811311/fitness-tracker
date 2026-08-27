import React, { useState } from "react";

const WaterIntake = () => {
  const [water, setWater] = useState(0);

  const goal = 3000;
  const glass = 250;

  const percentage = Math.min((water / goal) * 100, 100);

  const addWater = (amount) => {
    setWater((prev) => Math.min(prev + amount, goal));
  };

  const resetWater = () => {
    setWater(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
            Daily Hydration
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-1">
            Water Intake 💧
          </h1>

          <p className="text-gray-500 mt-2">
            Stay hydrated and keep your body performing at its best.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

          {/* Amount */}
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600">
              {water}
              <span className="text-xl text-gray-400 ml-1">ml</span>
            </div>

            <p className="text-gray-500 mt-2">
              of {goal} ml daily goal
            </p>
          </div>

          {/* Progress */}
          <div className="mt-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-600">
                Today's Progress
              </span>

              <span className="font-bold text-blue-600">
                {Math.round(percentage)}%
              </span>
            </div>

            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Quick Add */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Add Water
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[250, 500, 750, 1000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => addWater(amount)}
                  className="py-3 rounded-xl border border-blue-100 bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition"
                >
                  +{amount} ml
                </button>
              ))}
            </div>
          </div>

          {/* Glass Counter */}
          <div className="mt-8 p-5 rounded-xl bg-blue-50 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Glasses completed
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {Math.floor(water / glass)}
                <span className="text-sm font-normal text-gray-500">
                  {" "}
                  / {goal / glass} glasses
                </span>
              </p>
            </div>

            <div className="text-4xl">
              💧
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={resetWater}
            className="w-full mt-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
          >
            Reset Today's Intake
          </button>
        </div>

        {/* Tips */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">

          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-2xl mb-2">🌅</div>
            <h3 className="font-semibold text-gray-800">
              Start Early
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Start your day with a glass of water.
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-2xl mb-2">🏋️</div>
            <h3 className="font-semibold text-gray-800">
              Stay Hydrated
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Drink regularly throughout your workout.
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-2xl mb-2">🌙</div>
            <h3 className="font-semibold text-gray-800">
              Track Daily
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Keep your hydration consistent every day.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default WaterIntake;