const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import middleware
const authMiddleware = require('./middleware/auth');

// Import controllers
const authController = require('./controllers/AuthController');
const sessionController = require('./controllers/SessionController');
const cartController = require('./controllers/CartController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

// Session routes
app.post('/api/sessions', authMiddleware, sessionController.createSession);
app.get('/api/sessions/:sessionId', authMiddleware, sessionController.getSessionDetails);

// Cart routes
app.get('/api/sessions/:sessionId/cart', authMiddleware, cartController.getCart);
app.post('/api/sessions/:sessionId/cart', authMiddleware, cartController.addToCart);
app.delete('/api/sessions/:sessionId/cart/:productId', authMiddleware, cartController.removeFromCart);
app.put('/api/sessions/:sessionId/cart/:productId', authMiddleware, cartController.updateQuantity);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

module.exports = app;