const Session = require('../models/Session');

class SessionController {
  static async createSession(req, res) {
    try {
      const session = await Session.create({
        host: req.user._id
      });
      res.status(201).json(session);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSession(req, res) {
    try {
      const session = await Session.findById(req.params.id);
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