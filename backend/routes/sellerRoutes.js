const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Product = require('../models/Product');
const Purchase = require('../models/Purchase');
const Wishlist = require('../models/Wishlist'); // ✅ Add this if you track wishlists

// 📊 Seller stats (basic)
router.get('/stats', authMiddleware(['seller']), async (req, res) => {
  try {
    const sellerId = req.user.id;

    const productCount = await Product.countDocuments({ seller: sellerId });
    const purchases = await Purchase.find({ seller: sellerId });

    const purchaseCount = purchases.length;
    const totalRevenue = purchases.reduce((sum, p) => sum + p.price, 0);

    res.status(200).json({ productCount, purchaseCount, totalRevenue });
  } catch (err) {
    console.error('Seller stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📈 Seller analytics dashboard
router.get('/analytics', authMiddleware(['seller']), async (req, res) => {
  try {
    const sellerId = req.user.id;

    const productCount = await Product.countDocuments({ seller: sellerId });
    const purchases = await Purchase.find({ seller: sellerId });
    const flaggedProducts = await Product.find({ seller: sellerId, flagged: true });

    let wishlistCount = 0;
    try {
      const wishlistItems = await Wishlist.find().populate('product');
      wishlistCount = wishlistItems.filter(
        (w) => w.product?.seller?.toString() === sellerId
      ).length;
    } catch (wishlistErr) {
      console.warn('Wishlist fetch failed:', wishlistErr.message);
    }

    const totalRevenue = purchases.reduce((sum, p) => sum + p.product.price, 0);

    res.status(200).json({
      productCount,
      purchaseCount: purchases.length,
      totalRevenue,
      wishlistCount,
      flaggedCount: flaggedProducts.length,
    });
  } catch (err) {
    console.error('Seller analytics error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;