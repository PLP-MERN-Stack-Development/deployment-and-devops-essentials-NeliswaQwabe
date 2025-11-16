import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Dashboard</h1>
      {user ? (
        <>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Welcome, <span className="font-semibold">{user.name}</span>!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Role: <span className="font-semibold">{user.role}</span>
          </p>
          {user.role === 'seller' ? (
            <p className="text-green-700 dark:text-green-300">You can add and manage your products.</p>
          ) : (
            <p className="text-blue-700 dark:text-blue-300">Browse and buy products from local sellers.</p>
          )}
        </>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">Loading user info...</p>
      )}
    </div>
  );
}

export default Dashboard;