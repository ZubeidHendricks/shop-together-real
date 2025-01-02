const express = require('express');
const router = express.Router();
const PaymentService = require('../services/paymentService');
const authMiddleware = require('../middleware/authMiddleware');

// Create checkout session
router.post('/create-session', authMiddleware, async (req, res) => {
  try {
    const { cartId } = req.body;
    
    // Fetch cart and validate
    const cart = await Cart.findById(cartId).populate('items.product');
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Create Stripe checkout session
    const session = await PaymentService.createCheckoutSession(cart, req.user);
    
    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ message: 'Checkout failed', error: error.message });
  }
});

// Webhook for payment confirmation
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await PaymentService.validateCheckoutSession(session.id);
        break;
      // Handle other event types
    }

    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

module.exports = router;