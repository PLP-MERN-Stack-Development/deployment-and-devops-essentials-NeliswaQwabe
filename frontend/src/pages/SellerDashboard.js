import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function SellerDashboard() {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (!token || !user?.role || user.role !== 'seller') return;

    const fetchAll = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/my-products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching seller products:', err);
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/seller/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching seller stats:', err);
        setError('Failed to load stats.');
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/purchase/seller-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Fetch orders error:', err);
      }

      setLoading(false);
    };

    fetchAll();
  }, [token, user, API_BASE_URL]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`);
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/purchase/status/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(orders.map((o) => (o._id === id ? updated.purchase : o)));
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  return (
    <main role="main" className="min-h-screen px-4 py-8">
      <header>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Seller Dashboard</h1>
      </header>

      {error && <p role="alert" className="text-red-600 mb-4">{error}</p>}
      {loading && <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>}

      {stats && (
        <section aria-label="Seller stats" className="mb-8 space-y-2 text-lg">
          <p className="text-gray-800 dark:text-white">📦 Products Listed: {stats.productCount}</p>
          <p className="text-gray-800 dark:text-white">🛒 Purchases Made: {stats.purchaseCount}</p>
          <p className="text-gray-800 dark:text-white">💰 Total Revenue: R{stats.totalRevenue}</p>
        </section>
      )}

      <section aria-label="My products">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">My Products</h2>
        {products.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">You haven’t added any products yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {products.map((product) => (
              <article key={product._id} className="border rounded p-4 dark:bg-gray-800 dark:text-white" tabIndex="0">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{product.description}</p>
                <p className="mt-2 font-bold text-green-700 dark:text-green-300">R{product.price}</p>
                {product.image && (
                  <img
                    src={product.image}
                    alt={`Image of ${product.name}`}
                    className="mt-4 w-full max-w-xs rounded shadow"
                  />
                )}
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(product._id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring"
                    aria-label={`Edit ${product.name}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring"
                    aria-label={`Delete ${product.name}`}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section aria-label="Orders">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No orders yet.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((o) => (
              <li key={o._id} className="border p-4 rounded dark:bg-gray-800 dark:text-white" tabIndex="0">
                <p className="font-semibold">{o.product.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Buyer: {o.buyer.name}</p>
                <label htmlFor={`status-${o._id}`} className="text-sm text-gray-600 dark:text-gray-300">
                  Status:
                </label>
                <select
                  id={`status-${o._id}`}
                  value={o.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                  className="mt-2 px-2 py-1 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring"
                  aria-label={`Update status for order ${o._id}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default SellerDashboard;