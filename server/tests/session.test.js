const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Session = require('../models/Session');
const User = require('../models/User');

describe('Session Tests', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_MONGODB_URI);
    
    testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = loginRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Session.deleteMany({});
  });

  describe('POST /api/sessions', () => {
    it('should create a new session', async () => {
      const res = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .send();

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('sessionId');
      expect(res.body.host).toBe(testUser.id);
    });
  });

  describe('POST /api/sessions/:sessionId/join', () => {
    it('should join an existing session', async () => {
      const session = await Session.create({
        sessionId: 'test-session',
        host: testUser.id,
        status: 'active'
      });

      const res = await request(app)
        .post(`/api/sessions/${session.sessionId}/join`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.participants).toContainEqual(
        expect.objectContaining({
          user: testUser.id.toString()
        })
      );
    });
  });
});