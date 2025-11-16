import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Product fetch error:', err);
        setError('Failed to load product.');
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reviews/${id}`);
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Review fetch error:', err);
      }
    };

    const fetchRelated = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/related/${id}`);
        const data = await res.json();
        setRelated(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Related fetch error:', err);
      }
    };

    fetchProduct();
    fetchReviews();
    fetchRelated();
  }, [id, token, API_BASE_URL]);

  const handleBuy = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/payment/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });
      const data = await res.json();
      window.location.href = data.redirectUrl;
    } catch (err) {
      console.error('Payfast error:', err);
      alert('Payment initiation failed.');
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return <p className="text-gray-600 dark:text-gray-300">Loading product...</p>;

  return (
    <div className="min-h-screen px-4 py-8">
      <button
        onClick={() => navigate('/products')}
        className="mb-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        ← Back to Products
      </button>

      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">{product.name}</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-2">{product.description}</p>
      <p className="font-bold text-green-700 dark:text-green-300 mb-2">R{product.price}</p>
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="mb-6 w-full max-w-md rounded shadow"
        />
      )}
      {user?.role === 'buyer' && (
        <button
          onClick={handleBuy}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Buy Now
        </button>
      )}

      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="border rounded p-4 dark:bg-gray-800 dark:text-white">
              <p className="font-semibold text-yellow-600 dark:text-yellow-400">⭐ {r.rating}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{r.comment}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">By {r.buyer?.name}</p>

              {r.reply && (
                <div className="mt-2 p-2 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/30">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Seller reply:</strong> {r.reply}
                  </p>
                </div>
              )}

              {user?.role === 'seller' && product?.seller === user.id && !r.reply && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const reply = prompt('Enter your reply to this review:');
                    if (!reply) return;

                    try {
                      const res = await fetch(`${API_BASE_URL}/api/reviews/reply/${r._id}`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ reply }),
                      });
                      if (res.ok) {
                        alert('Reply submitted!');
                        window.location.reload();
                      } else {
                        alert('Failed to submit reply.');
                      }
                    } catch (err) {
                      console.error('Reply error:', err);
                      alert('Error submitting reply.');
                    }
                  }}
                  className="mt-2"
                >
                  <button className="text-sm text-blue-600 hover:underline">Reply to this review</button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">Related Products</h2>
      {related.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No related products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((item) => (
            <div key={item._id} className="border rounded p-4 dark:bg-gray-800 dark:text-white">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              <p className="mt-2 font-bold text-green-700 dark:text-green-300">R{item.price}</p>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="mt-4 w-full max-w-xs rounded shadow"
                />
              )}
              <Link
                to={`/product/${item._id}`}
                className="block mt-4 text-blue-600 hover:underline text-sm"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductDetails;