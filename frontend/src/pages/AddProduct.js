import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function AddProduct() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('Vegetables');
  const [error, setError] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');
  const [searchResults, setSearchResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    if (image) formData.append('image', image);

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/add`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        navigate('/dashboard');
      } else {
        setError(data.message || 'Failed to add product.');
      }
    } catch (err) {
      console.error('Add product error:', err);
      setError('Something went wrong.');
    }
  };

  const handleSearch = async () => {
    try {
      const res = await fetch('/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const filtered = searchCategory === 'All'
        ? data
        : data.filter((p) => p.category === searchCategory);
      setSearchResults(filtered);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  return (
    <main role="main" className="min-h-screen px-4 py-8">
      <header>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Add New Product</h1>
      </header>

      {error && <p role="alert" className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="max-w-md space-y-4" aria-label="Add Product Form">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-white">Product Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white focus:outline-none focus:ring"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-white">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white focus:outline-none focus:ring"
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-white">Price (R)</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white focus:outline-none focus:ring"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-white">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white focus:outline-none focus:ring"
            aria-label="Select product category"
          >
            <option value="Vegetables">Vegetables</option>
            <option value="Crafts">Crafts</option>
            <option value="Eco Goods">Eco Goods</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-white">Product Image</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white focus:outline-none focus:ring"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring"
          aria-label="Submit new product"
        >
          Add Product
        </button>
      </form>

      <section aria-label="Search Existing Products" className="mt-12">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Search Existing Products</h2>
        <div className="flex items-center space-x-4 mb-4">
          <label htmlFor="searchCategory" className="sr-only">Search Category</label>
          <select
            id="searchCategory"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="px-4 py-2 border rounded dark:bg-gray-800 dark:text-white focus:outline-none focus:ring"
            aria-label="Filter products by category"
          >
            <option value="All">All</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Crafts">Crafts</option>
            <option value="Eco Goods">Eco Goods</option>
            <option value="Other">Other</option>
          </select>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring"
            aria-label="Search products"
          >
            Search
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map((product) => (
              <article key={product._id} className="border rounded p-4 dark:bg-gray-800 dark:text-white" tabIndex="0">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{product.description}</p>
                <p className="mt-1 font-bold text-green-700 dark:text-green-300">R{product.price}</p>
                {product.image && (
                  <img
                    src={product.image}
                    alt={`Fresh ${product.name} for sale`}
                    className="mt-2 w-full max-w-xs rounded shadow"
                  />
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AddProduct;