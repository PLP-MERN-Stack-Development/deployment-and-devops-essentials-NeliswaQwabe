// controllers/paymentController.js
const crypto = require('crypto');
const qs = require('querystring');
const nodemailer = require('nodemailer');
const Purchase = require('../models/Purchase');

// Generate and auto-submit Payfast form
const generatePayfastForm = (req, res) => {
  const { productName, amount, buyerEmail, purchaseId } = req.body;

  const payfastData = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY,
    return_url: 'https://localpop.co.za/payment-success',
    cancel_url: 'https://localpop.co.za/payment-cancel',
    notify_url: process.env.PAYFAST_NOTIFY_URL,
    amount,
    item_name: productName,
    email_address: buyerEmail,
    custom_str1: purchaseId, // used to track the purchase
  };

  let formHtml = `<form id="payfastForm" action="https://www.payfast.co.za/eng/process" method="POST">`;
  for (const [key, value] of Object.entries(payfastData)) {
    formHtml += `<input type="hidden" name="${key}" value="${value}" />`;
  }
  formHtml += `</form><script>document.getElementById('payfastForm').submit();</script>`;

  res.send(formHtml);
};

// Validate Payfast signature
const validatePayfastSignature = (data) => {
  const passphrase = process.env.PAYFAST_PASSPHRASE;
  const { signature, ...rest } = data;

  const sorted = Object.keys(rest).sort().reduce((obj, key) => {
    obj[key] = rest[key];
    return obj;
  }, {});

  let queryString = qs.stringify(sorted);
  if (passphrase) {
    queryString += `&passphrase=${passphrase}`;
  }

  const hash = crypto.createHash('md5').update(queryString).digest('hex');
  return hash === signature;
};

// Send confirmation email
const sendConfirmationEmail = async (to, purchase) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'LocalPop Payment Confirmation',
    html: `
      <h2>Thank you for your purchase!</h2>
      <p>Your payment for <strong>${purchase.itemName}</strong> has been received.</p>
      <p>Status: <strong>${purchase.status}</strong></p>
      <p>We’ll notify the seller and begin processing your order.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log('📧 Confirmation email sent to', to);
};

// Handle Payfast IPN
const handlePayfastNotification = async (req, res) => {
  const isValid = validatePayfastSignature(req.body);

  if (!isValid) {
    console.warn('❌ Invalid Payfast signature');
    return res.status(400).send('Invalid signature');
  }

  const { custom_str1, payment_status, email_address } = req.body;

  try {
    const purchase = await Purchase.findById(custom_str1);
    if (!purchase) {
      return res.status(404).send('Purchase not found');
    }

    if (payment_status === 'COMPLETE') {
      purchase.status = 'Paid';
      await purchase.save();
      console.log('✅ Purchase marked as Paid');

      await sendConfirmationEmail(email_address, purchase);
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('❌ Error updating purchase:', err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  generatePayfastForm,
  handlePayfastNotification,
};