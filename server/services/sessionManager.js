const Session = require('../models/Session');
const Analytics = require('../models/Analytics');
const { v4: uuidv4 } = require('uuid');

class SessionManager {
  static async createSession(hostId) {
    try {
      const session = new Session({
        sessionId: `shop_${uuidv4().slice(0, 8)}`,
        host: hostId,
        participants: [{
          user: hostId,
          joinedAt: new Date(),
          isActive: true
        }],
        status: 'active',
        createdAt: new Date()
      });

      await session.save();
      return session;
    } catch (error) {
      console.error('Session creation error:', error);
      throw error;
    }
  }

  static async joinSession(sessionId, userId) {
    try {
      const session = await Session.findOne({
        sessionId,
        status: 'active'
      });

      if (!session) {
        throw new Error('Session not found or inactive');
      }

      const existingParticipant = session.participants
        .find(p => p.user.toString() === userId.toString());

      if (existingParticipant) {
        existingParticipant.isActive = true;
      } else {
        session.participants.push({
          user: userId,
          joinedAt: new Date(),
          isActive: true
        });
      }

      await session.save();
      return session;
    } catch (error) {
      console.error('Session join error:', error);
      throw error;
    }
  }

  static async endSession(sessionId) {
    try {
      const session = await Session.findOne({ sessionId });
      
      if (!session) {
        throw new Error('Session not found');
      }

      session.status = 'ended';
      session.endedAt = new Date();
      await session.save();

      return session;
    } catch (error) {
      console.error('Session end error:', error);
      throw error;
    }
  }

  static async getActiveParticipants(sessionId) {
    try {
      const session = await Session.findOne({ sessionId })
        .populate('participants.user', 'name email');

      return session?.participants
        .filter(p => p.isActive)
        .map(p => p.user) || [];
    } catch (error) {
      console.error('Get participants error:', error);
      throw error;
    }
  }
}

module.exports = SessionManager;