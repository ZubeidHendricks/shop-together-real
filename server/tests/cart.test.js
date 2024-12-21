const request = require('supertest');
const app = require('../app');

describe('Cart Endpoints', () => {
  let authToken;
  let testSession;

  beforeEach(async () => {
    // Register a user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test2@example.com',
        password: 'password123',
        name: 'Test User 2'
      });

    authToken = registerRes.body.token;

    // Create a session
    const sessionRes = await request(app)
      .post('/api/sessions')
      .set('Authorization', `Bearer ${authToken}`);

    testSession = sessionRes.body;
  });

  describe('POST /api/sessions/:sessionId/cart', () => {
    it('should add item to cart', async () => {
      const item = {
        productId: 'test-product',
        quantity: 1,
        price: 9.99
      };

      const res = await request(app)
        .post(`/api/sessions/${testSession._id}/cart`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(item);

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].productId).toBe(item.productId);
    });
  });
});