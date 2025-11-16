// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const {
  generatePayfastForm,
  handlePayfastNotification,
} = require('../controllers/paymentController');

// Generate and auto-submit Payfast form
router.post('/pay', generatePayfastForm);

// Handle Payfast IPN (Instant Payment Notification)
router.post('/notify', express.urlencoded({ extended: false }), handlePayfastNotification);

module.exports = router;