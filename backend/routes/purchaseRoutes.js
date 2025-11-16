const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Product = require('../models/Product');
const User = require('../models/User');
const Purchase = require('../models/Purchase'); // ✅ Make sure this is imported
const { sendEmail } = require('../utils/emailService');

// ✅ Buyer views their orders (existing route)
router.get('/my-orders', authMiddleware(['buyer']), async (req, res) => {
  try {
    const orders = await Purchase.find({ buyer: req.user.id })
      .populate('product')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ NEW: Buyer order history route for /buyer-orders
router.get('/buyer-orders', authMiddleware(['buyer']), async (req, res) => {
  try {
    const orders = await Purchase.find({ buyer: req.user.id })
      .populate('product')
      .populate('seller', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error('Buyer orders fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch buyer orders' });
  }
});

// ✅ Seller updates delivery status
router.put('/status/:purchaseId', authMiddleware(['seller']), async (req, res) => {
  const { status } = req.body;
  try {
    const purchase = await Purchase.findById(req.params.purchaseId).populate('product');
    if (!purchase || purchase.product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized or not found' });
    }

    purchase.status = status;
    await purchase.save();
    res.status(200).json({ message: 'Status updated', purchase });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Buyer purchases a product
router.post('/buy/:productId', authMiddleware(['buyer']), async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate('seller');
    const buyer = await User.findById(req.user.id);

    if (!product || !buyer) {
      return res.status(404).json({ message: 'Product or buyer not found' });
    }

    // ✅ Save purchase to database
    const purchase = new Purchase({
      product: product._id,
      buyer: buyer._id,
      seller: product.seller._id,
      status: 'Pending',
    });
    await purchase.save();

    // Send email to buyer
    await sendEmail({
      to: buyer.email,
      subject: `Purchase Confirmation: ${product.name}`,
      text: `Hi ${buyer.name},\n\nYou successfully purchased "${product.name}" for R${product.price}.\n\nThank you for supporting local sellers!\n\nLocalPop`,
    });

    // Send email to seller
    await sendEmail({
      to: product.seller.email,
      subject: `New Order: ${product.name}`,
      text: `Hi ${product.seller.name},\n\n${buyer.name} just purchased "${product.name}".\n\nPlease prepare for delivery.\n\nLocalPop`,
    });

    res.status(200).json({ message: 'Purchase successful and emails sent.' });
  } catch (err) {
    console.error('Purchase error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;