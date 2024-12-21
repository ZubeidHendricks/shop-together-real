const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/Cart');

class PaymentService {
  static async createSplitPayment(sessionId, participants) {
    try {
      const cart = await Cart.findOne({ sessionId, status: 'active' })
        .populate('items.addedBy', 'email');

      const totalAmount = cart.items.reduce((sum, item) => (
        sum + (item.price * item.quantity)
      ), 0);

      const amountPerPerson = Math.ceil(totalAmount * 100 / participants.length);

      const paymentIntents = await Promise.all(
        participants.map(async (userId) => {
          const intent = await stripe.paymentIntents.create({
            amount: amountPerPerson,
            currency: 'usd',
            metadata: {
              sessionId,
              userId,
              type: 'split_payment'
            }
          });

          return {
            userId,
            clientSecret: intent.client_secret,
            amount: amountPerPerson
          };
        })
      );

      return paymentIntents;
    } catch (error) {
      console.error('Split payment error:', error);
      throw error;
    }
  }

  static async handlePaymentSuccess(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      const { sessionId, userId } = paymentIntent.metadata;

      await Cart.updateOne(
        { sessionId },
        { $set: { [`payments.${userId}`]: 'completed' } }
      );

      return { success: true };
    } catch (error) {
      console.error('Payment success handler error:', error);
      throw error;
    }
  }
}

module.exports = PaymentService;