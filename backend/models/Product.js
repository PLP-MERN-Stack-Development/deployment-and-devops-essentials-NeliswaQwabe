const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // 🚩 Admin moderation fields
  flagged: { type: Boolean, default: false },
  flagReason: { type: String, default: '' },
});

module.exports = mongoose.model('Product', productSchema);