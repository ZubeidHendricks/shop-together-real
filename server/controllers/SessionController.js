const Session = require('../models/Session');
const Cart = require('../models/Cart');

async function createSession(req, res) {
  try {
    const session = await Session.create({
      host: req.user._id,
      participants: [{
        user: req.user._id,
        role: 'host'
      }]
    });

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

async function getSessionDetails(req, res) {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createSession,
  getSessionDetails
};