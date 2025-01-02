const request = require('supertest');
const app = require('../app');

describe('Cart Endpoints', () => {
  let authToken;
  let testSession;

  beforeEach(async () => {
    // Create test user and get token
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'cart-test@example.com',
        password: 'password123',
        name: 'Cart Test User'
      });
    
    authToken = registerResponse.body.token;

    // Create test session
    const sessionResponse = await request(app)
      .post('/api/sessions')
      .set('Authorization', `Bearer ${authToken}`);

    testSession = sessionResponse.body;
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