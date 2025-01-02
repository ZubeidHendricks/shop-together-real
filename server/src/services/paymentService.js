const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const NotificationService = require('./notificationService');

class PaymentService {
  static async createCheckoutSession(cart, user) {
    try {
      const lineItems = cart.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            images: [item.product.imageUrl]
          },
          unit_amount: Math.round(item.product.price * 100)
        },
        quantity: item.quantity
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/checkout/cancel`,
        client_reference_id: cart._id.toString(),
        customer_email: user.email
      });

      const order = new Order({
        user: user._id,
        cart: cart._id,
        stripeSessionId: session.id,
        total: cart.total,
        status: 'PENDING'
      });

      await order.save();

      await NotificationService.createNotification(
        user._id,
        'CHECKOUT_INITIATED',
        'Checkout session created',
        {
          orderId: order._id,
          stripeSessionId: session.id
        }
      );

      return session;
    } catch (error) {
      console.error('Checkout session creation error', error);
      throw error;
    }
  }

  static async validateCheckoutSession(sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      const order = await Order.findOne({ 
        stripeSessionId: sessionId 
      }).populate('cart');

      if (!order) {
        throw new Error('Order not found');
      }

      if (session.payment_status === 'paid') {
        order.status = 'COMPLETED';
        await order.save();

        await Cart.findByIdAndUpdate(order.cart._id, { 
          status: 'COMPLETED' 
        });

        return order;
      }

      return null;
    } catch (error) {
      console.error('Checkout validation error', error);
      throw error;
    }
  }
}

module.exports = PaymentService;