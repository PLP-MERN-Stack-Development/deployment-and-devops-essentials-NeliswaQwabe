import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function AdminProducts() {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [flagId, setFlagId] = useState('');
  const [flagReason, setFlagReason] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/products`, {
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      } else {
        alert('Failed to delete product.');
      }
    } catch (err) {
      console.error('Delete product error:', err);
      alert('Error deleting product.');
    }
  };

  const handleFlag = async () => {
    if (!flagReason.trim()) return alert('Please enter a reason.');
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/products/${flagId}/flag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: flagReason }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(products.map((p) => (p._id === flagId ? updated.product : p)));
        setFlagId('');
        setFlagReason('');
      } else {
        alert('Failed to flag product.');
      }
    } catch (err) {
      console.error('Flag error:', err);
      alert('Error flagging product.');
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">All Products</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {products.length === 0 && !error ? (
        <p className="text-gray-600 dark:text-gray-300">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p._id} className="border rounded p-4 dark:bg-gray-800 dark:text-white">
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{p.description}</p>
              <p className="mt-2 font-bold text-green-700 dark:text-green-300">R{p.price}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Seller: {p.seller?.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email: {p.seller?.email}</p>

              {p.flagged && (
                <p className="text-sm text-red-500 mt-2">🚩 Flagged: {p.flagReason}</p>
              )}

              <button
                onClick={() => setFlagId(p._id)}
                className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
              >
                Flag
              </button>

              {flagId === p._id && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    placeholder="Reason for flagging"
                    className="px-2 py-1 border rounded w-full dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={handleFlag}
                    className="mt-2 px-3 py-1 bg-yellow-700 text-white rounded hover:bg-yellow-800 text-sm"
                  >
                    Submit Flag
                  </button>
                </div>
              )}

              <button
                onClick={() => handleDelete(p._id)}
                className="mt-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProducts;