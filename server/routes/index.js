const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Controllers
const AuthController = require('../controllers/AuthController');
const SessionController = require('../controllers/SessionController');
const CartController = require('../controllers/CartController');

// Auth routes
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// Session routes
router.post('/sessions', authMiddleware, SessionController.createSession);
router.get('/sessions/:sessionId', authMiddleware, SessionController.getSessionDetails);

// Cart routes
router.get('/sessions/:sessionId/cart', authMiddleware, CartController.getCart);
router.post('/sessions/:sessionId/cart', authMiddleware, CartController.addToCart);
router.delete('/sessions/:sessionId/cart/:productId', authMiddleware, CartController.removeFromCart);
router.put('/sessions/:sessionId/cart/:productId', authMiddleware, CartController.updateQuantity);

module.exports = router;