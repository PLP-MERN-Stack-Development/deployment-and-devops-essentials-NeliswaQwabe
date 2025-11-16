import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function ProductList() {
  const { token, user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({});
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products.');
      }
    };

    fetchProducts();
  }, [token, API_BASE_URL]);

  useEffect(() => {
    const fetchRatings = async () => {
      const results = {};
      await Promise.all(
        products.map(async (p) => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/reviews/average/${p._id}`);
            const data = await res.json();
            results[p._id] = data;
          } catch {
            results[p._id] = { average: 0, count: 0 };
          }
        })
      );
      setRatings(results);
    };

    if (products.length > 0) {
      fetchRatings();
    }
  }, [products, API_BASE_URL]);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBuy = async (productId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/payment/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (res.ok && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert(data.message || 'Purchase failed.');
      }
    } catch (err) {
      console.error('Buy error:', err);
      alert('Error occurred.');
    }
  };

  const handleReview = async (productId) => {
    const rating = prompt('Rate this product (1–5):');
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      alert('Please enter a valid rating between 1 and 5.');
      return;
    }

    const comment = prompt('Leave a comment (optional):');

    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: Number(rating), comment }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Review submitted!');
      } else {
        alert(data.message || 'Failed to submit review.');
      }
    } catch (err) {
      console.error('Review error:', err);
      alert('Error submitting review.');
    }
  };

  const handleWishlist = async (productId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/wishlist/${productId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert('Added to wishlist!');
      } else {
        alert('Already in wishlist.');
      }
    } catch (err) {
      console.error('Wishlist error:', err);
      alert('Error adding to wishlist.');
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Available Products</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-6 space-y-4">
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-white">Filter by Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
          >
            <option value="All">All</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Crafts">Crafts</option>
            <option value="Eco Goods">Eco Goods</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-white">Search Products:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or description"
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="border rounded p-4 dark:bg-gray-800 dark:text-white">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{product.description}</p>
              <p className="mt-2 font-bold text-green-700 dark:text-green-300">R{product.price}</p>
              {ratings[product._id] && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                  ⭐ {ratings[product._id].average} ({ratings[product._id].count} reviews)
                </p>
              )}
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="mt-4 w-full max-w-xs rounded shadow"
                />
              )}
              <Link
                to={`/product/${product._id}`}
                title={`View details for ${product.name}`}
                className="block mt-4 text-blue-600 hover:underline text-sm"
              >
                View Details
              </Link>
              {user?.role === 'buyer' && (
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => handleBuy(product._id)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => handleReview(product._id)}
                    className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Leave a Review
                  </button>
                  <button
                    onClick={() => handleWishlist(product._id)}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    ❤️ Save to Wishlist
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;