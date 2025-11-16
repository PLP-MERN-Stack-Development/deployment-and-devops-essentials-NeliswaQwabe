const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const Product = require('../models/Product');

// ✅ Add a product with image upload and category (seller only)
router.post('/add', authMiddleware(['seller']), upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const sellerId = req.user.id;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const product = await Product.create({
      name,
      description,
      price,
      category,
      seller: sellerId,
      image: imageUrl,
    });

    res.status(201).json({ message: 'Product added', product });
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ View all products (any logged-in user)
router.get('/', authMiddleware(), async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'name');
    res.status(200).json(products);
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Keyword search by name or description
router.get('/search', authMiddleware(), async (req, res) => {
  const { q } = req.query;
  try {
    const regex = new RegExp(q, 'i'); // case-insensitive
    const products = await Product.find({
      $or: [{ name: regex }, { description: regex }],
    }).populate('seller', 'name');
    res.status(200).json(products);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Seller dashboard: view own products
router.get('/my-products', authMiddleware(['seller']), async (req, res) => {
  try {
    const sellerId = req.user.id;
    const products = await Product.find({ seller: sellerId });
    res.status(200).json(products);
  } catch (err) {
    console.error('Seller dashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get single product by ID (for editing)
router.get('/:id', authMiddleware(['seller']), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Edit a product (seller only)
router.put('/edit/:id', authMiddleware(['seller']), async (req, res) => {
  try {
    const sellerId = req.user.id;
    const productId = req.params.id;

    const product = await Product.findOneAndUpdate(
      { _id: productId, seller: sellerId },
      req.body,
      { new: true }
    );

    if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });

    res.status(200).json({ message: 'Product updated', product });
  } catch (err) {
    console.error('Edit product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Delete a product (seller only)
router.delete('/delete/:id', authMiddleware(['seller']), async (req, res) => {
  try {
    const sellerId = req.user.id;
    const productId = req.params.id;

    const deleted = await Product.findOneAndDelete({ _id: productId, seller: sellerId });

    if (!deleted) return res.status(404).json({ message: 'Product not found or unauthorized' });

    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// ✅ Get related products by category
router.get('/related/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    res.status(200).json(related);
  } catch (err) {
    console.error('Related products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;