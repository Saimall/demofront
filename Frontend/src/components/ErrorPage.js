// ErrorPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="text-center p-10 bg-white shadow-lg rounded-lg transform transition-transform duration-300 hover:scale-105">
        <h1 className="text-7xl font-extrabold text-gray-800 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <Link to="/HomePage" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium transition-transform duration-200 hover:bg-blue-700 hover:scale-105">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
