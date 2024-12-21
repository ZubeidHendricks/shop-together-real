const express = require('express');
const cors = require('cors');

// Import middleware
const authMiddleware = require('./middleware/auth');

// Import controllers
const sessionController = require('./controllers/SessionController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Session routes
app.post('/api/sessions', authMiddleware, sessionController.createSession);
app.get('/api/sessions/:sessionId', authMiddleware, sessionController.getSessionDetails);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

module.exports = app;