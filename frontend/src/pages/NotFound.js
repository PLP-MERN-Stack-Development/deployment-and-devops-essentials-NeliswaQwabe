import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <main role="main" className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl text-gray-800 dark:text-white mb-2">Page Not Found</p>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        The page you're looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring"
        aria-label="Go back to homepage"
      >
        Go to Homepage
      </Link>
    </main>
  );
}

export default NotFound;