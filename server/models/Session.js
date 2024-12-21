const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    default: () => 'session_' + Math.random().toString(36).substr(2, 9),
    unique: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: Date,
    isActive: Boolean,
    role: {
      type: String,
      enum: ['host', 'participant'],
      default: 'participant'
    }
  }],
  status: {
    type: String,
    enum: ['active', 'ended'],
    default: 'active'
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  endedAt: Date
});

module.exports = mongoose.model('Session', sessionSchema);