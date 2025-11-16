import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  };

  return (
    <main role="main" className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Sign Up</h2>

      {error && (
        <div role="alert" className="text-red-600 mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="w-full max-w-sm space-y-4" aria-label="Signup form">
        <div>
          <label htmlFor="name" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            aria-describedby="nameHelp"
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white focus:outline-none focus:ring"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <small id="nameHelp" className="text-xs text-gray-500 dark:text-gray-400">
            Enter your full name
          </small>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            aria-describedby="emailHelp"
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white focus:outline-none focus:ring"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <small id="emailHelp" className="text-xs text-gray-500 dark:text-gray-400">
            Enter a valid email address
          </small>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            aria-describedby="passwordHelp"
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white focus:outline-none focus:ring"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <small id="passwordHelp" className="text-xs text-gray-500 dark:text-gray-400">
            Must be at least 6 characters
          </small>
        </div>

        <div>
          <label htmlFor="role" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white focus:outline-none focus:ring"
            required
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 focus:outline-none focus:ring"
          aria-label="Submit signup form"
        >
          Sign Up
        </button>
      </form>
    </main>
  );
}

export default Signup;