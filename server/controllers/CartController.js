const Cart = require('../models/Cart');

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ session: req.params.sessionId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { session: req.params.sessionId },
      { $push: { items: { ...req.body, addedBy: req.user._id } } },
      { new: true, upsert: true }
    );
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { session: req.params.sessionId },
      { $pull: { items: { productId: req.params.productId } } },
      { new: true }
    );
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { 
        session: req.params.sessionId,
        'items.productId': req.params.productId 
      },
      { 
        $set: { 
          'items.$.quantity': req.body.quantity 
        } 
      },
      { new: true }
    );
    if (!cart) {
      return res.status(404).json({ error: 'Cart or product not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity
};