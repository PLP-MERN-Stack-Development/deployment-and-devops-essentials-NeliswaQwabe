import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DeliveryProgress from '../components/DeliveryProgress';

function BuyerOrders() {
  const { token, user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/purchase/buyer-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching buyer orders:', err);
      }
    };

    if (user?.role === 'buyer') fetchOrders();
  }, [token, user, API_BASE_URL]);

  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">You haven’t placed any orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o._id} className="border p-4 rounded dark:bg-gray-800 dark:text-white">
              <p className="font-semibold">{o.product.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Seller: {o.seller.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Status: {o.status}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Price: R{o.product.price}</p>
              <DeliveryProgress status={o.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BuyerOrders;