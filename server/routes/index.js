const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Import controllers
const { register, login } = require('../controllers/AuthController');
const { createSession, getSessionDetails } = require('../controllers/SessionController');
const { getCart, addToCart, removeFromCart, updateQuantity } = require('../controllers/CartController');

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Session routes
router.post('/sessions', authMiddleware, createSession);
router.get('/sessions/:sessionId', authMiddleware, getSessionDetails);

// Cart routes
router.get('/sessions/:sessionId/cart', authMiddleware, getCart);
router.post('/sessions/:sessionId/cart', authMiddleware, addToCart);
router.delete('/sessions/:sessionId/cart/:productId', authMiddleware, removeFromCart);
router.put('/sessions/:sessionId/cart/:productId', authMiddleware, updateQuantity);

module.exports = router;