const request = require('supertest');
const app = require('../app');

describe('Cart Endpoints', () => {
  let authToken;
  let testSession;

  beforeEach(async () => {
    // Create test user and get token
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'cart-test@example.com',
        password: 'password123',
        name: 'Cart Test User'
      });

    authToken = registerRes.body.token;

    // Create test session
    const sessionRes = await request(app)
      .post('/api/sessions')
      .set('Authorization', `Bearer ${authToken}`);

    testSession = sessionRes.body;
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
      await request(app)
        .post(`/api/sessions/${testSession._id}/cart`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: 'test-product',
          quantity: 1,
          price: 9.99
        });

      const res = await request(app)
        .delete(`/api/sessions/${testSession._id}/cart/test-product`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toHaveLength(0);
    });
  });
});