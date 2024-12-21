const Session = require('../models/Session');
const Cart = require('../models/Cart');

class SessionController {
  static async createSession(req, res) {
    try {
      const session = await Session.create({
        host: req.user._id,
        participants: [{
          user: req.user._id,
          joinedAt: new Date(),
          isActive: true,
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

      res.status(201).json(session);
    } catch (error) {
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

  static async joinSession(req, res) {
    try {
      const session = await Session.findById(req.params.sessionId);
      
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      if (session.status === 'ended') {
        return res.status(400).json({ error: 'Session has ended' });
      }

      const existingParticipant = session.participants
        .find(p => p.user.toString() === req.user._id.toString());

      if (existingParticipant) {
        existingParticipant.isActive = true;
      } else {
        session.participants.push({
          user: req.user._id,
          joinedAt: new Date(),
          isActive: true,
          role: 'participant'
        });
      }

      await session.save();
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async leaveSession(req, res) {
    try {
      const session = await Session.findById(req.params.sessionId);
      
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const participant = session.participants
        .find(p => p.user.toString() === req.user._id.toString());

      if (!participant) {
        return res.status(400).json({ error: 'Not a participant in this session' });
      }

      participant.isActive = false;

      // If host leaves, end session
      if (participant.role === 'host') {
        session.status = 'ended';
        session.endedAt = new Date();
      }

      await session.save();
      res.json({ message: 'Successfully left session' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = SessionController;