const Session = require('../models/Session');
const Cart = require('../models/Cart');
const ActivityLog = require('../models/ActivityLog');
const { v4: uuidv4 } = require('uuid');

class SessionController {
  static async createSession(req, res) {
    try {
      const sessionId = `shop_${uuidv4().slice(0, 8)}`;
      
      // Create session
      const session = new Session({
        sessionId,
        host: req.user._id,
        participants: [{
          user: req.user._id,
          joinedAt: new Date(),
          isActive: true,
          role: 'host'
        }]
      });

      // Create associated cart
      const cart = new Cart({
        sessionId: session._id,
        items: []
      });
      await cart.save();
      
      session.cartId = cart._id;
      await session.save();

      // Log activity
      await ActivityLog.create({
        sessionId: session._id,
        userId: req.user._id,
        action: 'join_session',
        details: { role: 'host' }
      });

      res.status(201).json({
        session: await session.populate('participants.user', 'name email'),
        cart
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async joinSession(req, res) {
    try {
      const { sessionId } = req.params;
      
      const session = await Session.findOne({ sessionId, status: 'active' });
      if (!session) {
        return res.status(404).json({ error: 'Session not found or inactive' });
      }

      // Check if user is already in session
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

      // Log activity
      await ActivityLog.create({
        sessionId: session._id,
        userId: req.user._id,
        action: 'join_session',
        details: { role: 'participant' }
      });

      res.json(await session.populate('participants.user', 'name email'));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async leaveSession(req, res) {
    try {
      const { sessionId } = req.params;
      
      const session = await Session.findOne({ sessionId });
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const participant = session.participants
        .find(p => p.user.toString() === req.user._id.toString());

      if (participant) {
        participant.isActive = false;
        
        // If host leaves, end session
        if (participant.role === 'host') {
          session.status = 'ended';
          session.endedAt = new Date();
        }

        await session.save();

        // Log activity
        await ActivityLog.create({
          sessionId: session._id,
          userId: req.user._id,
          action: 'leave_session'
        });
      }

      res.json({ message: 'Successfully left session' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSessionDetails(req, res) {
    try {
      const { sessionId } = req.params;
      
      const session = await Session.findOne({ sessionId })
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