const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  items: [{
    productId: {
      type: String,
      required: true
    },
    title: String,
    quantity: {
      type: Number,
      default: 1
    },
    price: Number,
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
    enum: ['active', 'checking_out', 'completed'],
    default: 'active'
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

cartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  this.totalAmount = this.items.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0);
  next();
});

module.exports = mongoose.model('Cart', cartSchema);