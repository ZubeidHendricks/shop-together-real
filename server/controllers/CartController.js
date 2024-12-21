const Cart = require('../models/Cart');
const Session = require('../models/Session');
const ActivityLog = require('../models/ActivityLog');

class CartController {
  static async addToCart(req, res) {
    try {
      const { sessionId } = req.params;
      const { productId, quantity = 1, productDetails } = req.body;

      const session = await Session.findOne({ sessionId })
        .populate('cartId');

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const cart = session.cartId;
      
      // Check if product already exists
      const existingItem = cart.items
        .find(item => item.productId === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          productId,
          quantity,
          title: productDetails.title,
          price: productDetails.price,
          addedBy: req.user._id
        });
      }

      await cart.save();

      // Log activity
      await ActivityLog.create({
        sessionId: session._id,
        userId: req.user._id,
        action: 'add_to_cart',
        details: { productId, quantity }
      });

      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async removeFromCart(req, res) {
    try {
      const { sessionId, productId } = req.params;

      const session = await Session.findOne({ sessionId })
        .populate('cartId');

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const cart = session.cartId;
      cart.items = cart.items.filter(item => item.productId !== productId);
      await cart.save();

      // Log activity
      await ActivityLog.create({
        sessionId: session._id,
        userId: req.user._id,
        action: 'remove_from_cart',
        details: { productId }
      });

      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateQuantity(req, res) {
    try {
      const { sessionId, productId } = req.params;
      const { quantity } = req.body;

      const session = await Session.findOne({ sessionId })
        .populate('cartId');

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const cart = session.cartId;
      const item = cart.items.find(item => item.productId === productId);

      if (!item) {
        return res.status(404).json({ error: 'Product not found in cart' });
      }

      item.quantity = quantity;
      await cart.save();

      // Log activity
      await ActivityLog.create({
        sessionId: session._id,
        userId: req.user._id,
        action: 'update_quantity',
        details: { productId, quantity }
      });

      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCart(req, res) {
    try {
      const { sessionId } = req.params;

      const session = await Session.findOne({ sessionId })
        .populate('cartId');

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      res.json(session.cartId);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CartController;