import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function PurchaseHistory() {
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState('');
  const { token, user } = useContext(AuthContext);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/purchase/my-purchases`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPurchases(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching purchases:', err);
        setError('Failed to load purchases.');
      }
    };

    if (user?.role === 'buyer') {
      fetchPurchases();
    }
  }, [token, user, API_BASE_URL]);

  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">My Purchase History</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {purchases.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">You haven’t bought anything yet.</p>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div key={purchase._id} className="border rounded p-4 dark:bg-gray-800 dark:text-white">
              <h2 className="text-xl font-semibold">
                {purchase.product?.name || 'Product not found'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {purchase.product?.description || 'No description available'}
              </p>
              <p className="mt-2 font-bold text-green-700 dark:text-green-300">
                R{purchase.product?.price || 'N/A'}
              </p>
              {purchase.product?.image && (
                <img
                  src={purchase.product.image}
                  alt={purchase.product.name}
                  className="mt-4 w-full max-w-xs rounded shadow"
                />
              )}
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Status: <span className="font-semibold">{purchase.status}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Purchased on: {new Date(purchase.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PurchaseHistory;