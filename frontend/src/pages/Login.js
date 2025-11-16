import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
        if (data.user.role === 'seller') {
          navigate('/dashboard');
        } else if (data.user.role === 'buyer') {
          navigate('/products');
        } else if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  };

  return (
    <main role="main" className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 p-6 rounded shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Login</h2>

        {error && (
          <div role="alert" className="text-red-600 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4" aria-label="Login form">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              aria-describedby="emailHelp"
              className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <small id="emailHelp" className="text-xs text-gray-500 dark:text-gray-400">
              Enter your registered email address
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
              className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <small id="passwordHelp" className="text-xs text-gray-500 dark:text-gray-400">
              Must be at least 6 characters
            </small>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 focus:outline-none focus:ring"
            aria-label="Submit login form"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}

export default Login;