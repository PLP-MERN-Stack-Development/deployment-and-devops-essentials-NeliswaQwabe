const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail'); // ✅ Your email utility

// Payfast IPN notification
router.post('/notify', async (req, res) => {
  try {
    const { payment_status, m_payment_id } = req.body;

    const purchase = await Purchase.findOne({ m_payment_id });

    if (!purchase) return res.status(404).end();

    if (payment_status === 'COMPLETE') {
      purchase.status = 'Paid';
      await purchase.save();

      const buyer = await User.findById(purchase.buyer);
      const product = await Product.findById(purchase.product);

      // ✅ Send confirmation email
      await sendEmail({
        to: buyer.email,
        subject: 'LocalPop Purchase Confirmed',
        text: `Hi ${buyer.name}, your purchase of ${product.name} is confirmed. Thank you!`,
      });
    }

    res.status(200).end();
  } catch (err) {
    console.error('Payfast notify error:', err);
    res.status(500).end();
  }
});

module.exports = router;