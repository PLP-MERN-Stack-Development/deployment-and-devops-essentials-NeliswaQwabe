import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Wishlist() {
  const { token, user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setWishlist(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
      }
    };

    if (user?.role === 'buyer') fetchWishlist();
  }, [token, user, API_BASE_URL]);

  const handleRemove = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/wishlist/remove/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setWishlist(wishlist.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="border rounded p-4 dark:bg-gray-800 dark:text-white">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{product.description}</p>
              <p className="mt-2 font-bold text-green-700 dark:text-green-300">R{product.price}</p>
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="mt-4 w-full max-w-xs rounded shadow"
                />
              )}
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View
                </button>
                <button
                  onClick={() => handleRemove(product._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;