const Session = require('../models/Session');
const Cart = require('../models/Cart');

class SessionController {
  static async createSession(req, res) {
    try {
      // Create session
      const session = await Session.create({
        host: req.user._id,
        participants: [{
          user: req.user._id,
          role: 'host'
        }]
      });

      // Create associated cart
      const cart = await Cart.create({
        session: session._id,
        items: []
      });

      session.cartId = cart._id;
      await session.save();

      const populatedSession = await Session.findById(session._id)
        .populate('participants.user', 'name email')
        .populate('cartId');

      res.status(201).json(populatedSession);
    } catch (error) {
      console.error('Session creation error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getSessionDetails(req, res) {
    try {
      const session = await Session.findById(req.params.sessionId)
        .populate('participants.user', 'name email')
        .populate('cartId');

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      res.json(session);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = SessionController;