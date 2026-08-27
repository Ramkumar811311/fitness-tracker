import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const RestrictedAccess = ({ featureName }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg max-w-lg mx-auto mb-8">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-yellow-800">
              {featureName ? `${featureName} Requires Login` : 'Restricted Access'}
            </h3>
            <p className="mt-2 text-yellow-700">
              Please log in or create an account to access this feature and unlock all the benefits of FitFusion.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/SignIn">
          <Button variant="primary" size="large">
            Log In
          </Button>
        </Link>
        <Link to="/Register">
          <Button variant="outline" size="large">
            Create Account
          </Button>
        </Link>
      </div>
      
      <div className="mt-10 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Why Create an Account?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 text-left">
            <h3 className="font-medium text-green-600 mb-2">Personalized Workouts</h3>
            <p className="text-gray-600">Create and save custom workouts tailored to your fitness goals.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 text-left">
            <h3 className="font-medium text-green-600 mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your fitness journey and see improvements over time.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 text-left">
            <h3 className="font-medium text-green-600 mb-2">Nutrition Insights</h3>
            <p className="text-gray-600">Access detailed nutritional information to support your fitness goals.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 text-left">
            <h3 className="font-medium text-green-600 mb-2">Health Metrics</h3>
            <p className="text-gray-600">Calculate and save your BMR and other important health data.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestrictedAccess; 