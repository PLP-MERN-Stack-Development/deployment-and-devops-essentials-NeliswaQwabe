const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Wishlist = require('../models/Wishlist');

// Add to wishlist
router.post('/:productId', authMiddleware(['buyer']), async (req, res) => {
  try {
    const exists = await Wishlist.findOne({
      buyer: req.user.id,
      product: req.params.productId,
    });
    if (exists) return res.status(400).json({ message: 'Already in wishlist' });

    const item = await Wishlist.create({
      buyer: req.user.id,
      product: req.params.productId,
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('Add to wishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from wishlist
router.delete('/:productId', authMiddleware(['buyer']), async (req, res) => {
  try {
    await Wishlist.deleteOne({
      buyer: req.user.id,
      product: req.params.productId,
    });
    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error('Remove wishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get buyer's wishlist
router.get('/', authMiddleware(['buyer']), async (req, res) => {
  try {
    const items = await Wishlist.find({ buyer: req.user.id }).populate('product');
    res.status(200).json(items);
  } catch (err) {
    console.error('Fetch wishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;