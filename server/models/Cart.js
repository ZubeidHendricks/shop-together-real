const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true
  },
  items: [{
    productId: String,
    quantity: Number,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'checkout', 'completed'],
    default: 'active'
  }
});

module.exports = mongoose.model('Cart', cartSchema);