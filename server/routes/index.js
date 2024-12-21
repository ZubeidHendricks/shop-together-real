const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Controllers
const SessionController = require('../controllers/SessionController');
const CartController = require('../controllers/CartController');
const ProductController = require('../controllers/ProductController');
const UserController = require('../controllers/UserController');

// Auth routes
router.post('/auth/register', UserController.register);
router.post('/auth/login', UserController.login);

// Session routes
router.post('/sessions', authMiddleware, SessionController.createSession);
router.get('/sessions/:sessionId', authMiddleware, SessionController.getSessionDetails);
router.post('/sessions/:sessionId/join', authMiddleware, SessionController.joinSession);
router.post('/sessions/:sessionId/leave', authMiddleware, SessionController.leaveSession);

// Cart routes
router.get('/sessions/:sessionId/cart', authMiddleware, CartController.getCart);
router.post('/sessions/:sessionId/cart', authMiddleware, CartController.addToCart);
router.delete('/sessions/:sessionId/cart/:productId', authMiddleware, CartController.removeFromCart);
router.put('/sessions/:sessionId/cart/:productId', authMiddleware, CartController.updateQuantity);

// Product routes
router.get('/products', authMiddleware, ProductController.getProducts);
router.get('/products/:productId', authMiddleware, ProductController.getProduct);

module.exports = router;