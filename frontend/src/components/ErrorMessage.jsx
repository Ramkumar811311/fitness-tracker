import React from 'react';

const ErrorMessage = ({ message, retry = null }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4 max-w-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{message}</p>
          </div>
        </div>
      </div>
      {retry && (
        <button 
          onClick={retry} 
          className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage; 