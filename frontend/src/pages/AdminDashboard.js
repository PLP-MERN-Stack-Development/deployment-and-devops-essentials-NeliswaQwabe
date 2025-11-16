import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ userCount: 0, productCount: 0, purchaseCount: 0 });
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Fetch users error:', err);
        setError('Failed to load users.');
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Stats fetch error:', err);
      }
    };

    fetchUsers();
    fetchStats();
  }, [token, API_BASE_URL]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== id));
      } else {
        alert('Failed to delete user.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting user.');
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers(users.map((u) => (u._id === id ? updated : u)));
      } else {
        alert('Failed to update role.');
      }
    } catch (err) {
      console.error('Role update error:', err);
      alert('Error updating role.');
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Admin Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Platform Overview</h2>
        <Bar
          data={{
            labels: ['Users', 'Products', 'Purchases'],
            datasets: [
              {
                label: 'Total Count',
                data: [stats.userCount, stats.productCount, stats.purchaseCount],
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Marketplace Stats' },
            },
          }}
        />
        <div className="flex space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
          <div><span className="inline-block w-3 h-3 bg-blue-500 mr-1"></span>Users</div>
          <div><span className="inline-block w-3 h-3 bg-green-500 mr-1"></span>Products</div>
          <div><span className="inline-block w-3 h-3 bg-yellow-500 mr-1"></span>Purchases</div>
        </div>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border rounded shadow">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && !error && (
              <tr>
                <td colSpan="4" className="px-4 py-4 text-center text-gray-500 dark:text-gray-300">
                  Loading users...
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u._id} className="border-t dark:border-gray-600">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="px-2 py-1 border rounded dark:bg-gray-700 dark:text-white"
                  >
                    <option value="buyer">buyer</option>
                    <option value="seller">seller</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;