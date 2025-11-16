const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Review = require('../models/Review');

// Add a review (buyer only)
router.post('/:productId', authMiddleware(['buyer']), async (req, res) => {
  const { rating, comment } = req.body;
  const buyerId = req.user.id;
  const productId = req.params.productId;

  try {
    const review = await Review.create({ product: productId, buyer: buyerId, rating, comment });
    res.status(201).json({ message: 'Review added', review });
  } catch (err) {
    console.error('Add review error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('buyer', 'name');
    res.status(200).json(reviews);
  } catch (err) {
    console.error('Fetch reviews error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get average rating for a product
router.get('/average/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId });
    if (reviews.length === 0) return res.json({ average: 0, count: 0 });

    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    res.status(200).json({ average: avg.toFixed(1), count: reviews.length });
  } catch (err) {
    console.error('Average rating error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Seller replies to a review
router.post('/reply/:reviewId', authMiddleware(['seller']), async (req, res) => {
  const { reply } = req.body;
  const reviewId = req.params.reviewId;

  try {
    const review = await Review.findById(reviewId).populate('product');
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    review.reply = reply;
    await review.save();

    res.status(200).json({ message: 'Reply added', review });
  } catch (err) {
    console.error('Reply error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;