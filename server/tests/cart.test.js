const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Session = require('../models/Session');

describe('Cart Endpoints', () => {
  let authToken;
  let testUser;
  let testSession;
  let testCart;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Create test user
    testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    });

    // Get auth token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = loginRes.body.token;

    // Create test session
    testSession = await Session.create({
      host: testUser._id,
      participants: [{
        user: testUser._id,
        joinedAt: new Date(),
        isActive: true,
        role: 'host'
      }]
    });

    // Create test cart
    testCart = await Cart.create({
      session: testSession._id,
      items: []
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Cart.updateOne(
      { _id: testCart._id },
      { $set: { items: [] } }
    );
  });

  describe('POST /api/sessions/:sessionId/cart', () => {
    it('should add item to cart', async () => {
      const res = await request(app)
        .post(`/api/sessions/${testSession._id}/cart`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: 'test-product',
          quantity: 1,
          price: 9.99
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].productId).toBe('test-product');
    });
  });

  describe('DELETE /api/sessions/:sessionId/cart/:productId', () => {
    it('should remove item from cart', async () => {
      // First add an item
      await Cart.findByIdAndUpdate(testCart._id, {
        $push: {
          items: {
            productId: 'test-product',
            quantity: 1,
            price: 9.99,
            addedBy: testUser._id
          }
        }
      });

      const res = await request(app)
        .delete(`/api/sessions/${testSession._id}/cart/test-product`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toHaveLength(0);
    });
  });
});
