const Cart = require('../models/Cart');

class CartController {
  static async getCart(req, res) {
    try {
      const cart = await Cart.findOne({ session: req.params.sessionId });
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addToCart(req, res) {
    try {
      const cart = await Cart.findOneAndUpdate(
        { session: req.params.sessionId },
        { $push: { items: req.body } },
        { new: true, upsert: true }
      );
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CartController;