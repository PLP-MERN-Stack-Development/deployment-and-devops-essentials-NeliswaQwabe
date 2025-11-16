const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Product = require('../models/Product');
const Purchase = require('../models/Purchase');

// 🗑️ Delete a product
router.delete('/products/:id', authMiddleware(['admin']), async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// 🚩 Flag a product with reason
router.post('/products/:id/flag', authMiddleware(['admin']), async (req, res) => {
  const { reason } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.flagged = true;
    product.flagReason = reason;
    await product.save();

    res.status(200).json({ message: 'Product flagged', product });
  } catch (err) {
    console.error('Flag product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// 📊 Get platform stats
router.get('/stats', authMiddleware(['admin']), async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const purchaseCount = await Purchase.countDocuments();

    res.status(200).json({ userCount, productCount, purchaseCount });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 👥 Get all users
router.get('/users', authMiddleware(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📋 Admin overview snapshot
router.get('/overview', authMiddleware(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('name email role');
    const products = await Product.find().select('name price seller');
    const purchases = await Purchase.find().select('product buyer seller status');

    res.status(200).json({ users, products, purchases });
  } catch (err) {
    console.error('Admin overview error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🧹 View all products (for moderation)
router.get('/products', authMiddleware(['admin']), async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'name email');
    res.status(200).json(products);
  } catch (err) {
    console.error('Admin fetch products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🗑️ Delete a user
router.delete('/users/:id', authMiddleware(['admin']), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔄 Update user role
router.put('/users/:id/role', authMiddleware(['admin']), async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.status(200).json(user);
  } catch (err) {
    console.error('Update role error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;