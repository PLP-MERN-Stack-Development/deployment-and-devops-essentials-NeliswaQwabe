import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-green-600 dark:text-green-400">
        LocalPop 🌱
      </Link>

      <div className="flex items-center space-x-4">
        <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium">
          Home
        </Link>

        {isLoggedIn && user?.role === 'seller' && (
          <>
            <Link to="/add-product" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium">
              Add Product
            </Link>
            <Link to="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium">
              My Products
            </Link>
          </>
        )}

        {isLoggedIn && user?.role === 'buyer' && (
          <>
            <Link to="/products" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium">
              View Products
            </Link>
            <Link to="/purchase-history" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium">
              My Purchases
            </Link>
          </>
        )}

        {!isLoggedIn ? (
          <>
            <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium">
              Login
            </Link>
            <Link to="/signup" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium">
              Sign Up
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 font-medium"
          >
            Logout
          </button>
        )}

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 rounded bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-700 transition"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;