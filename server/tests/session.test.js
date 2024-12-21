const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('Session Endpoints', () => {
  let authToken;
  let testUser;

  beforeEach(async () => {
    // Create test user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'session-test@example.com',
        password: 'password123',
        name: 'Session Test User'
      });

    testUser = registerRes.body.user;
    authToken = registerRes.body.token;
  });

  describe('POST /api/sessions', () => {
    it('should create a new session', async () => {
      const res = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('participants');
      expect(res.body.participants[0].user.toString()).toBe(testUser._id);
    });
  });

  describe('GET /api/sessions/:sessionId', () => {
    it('should get session details', async () => {
      // Create a session first
      const createRes = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${authToken}`);

      const res = await request(app)
        .get(`/api/sessions/${createRes.body._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(createRes.body._id);
    });
  });
});