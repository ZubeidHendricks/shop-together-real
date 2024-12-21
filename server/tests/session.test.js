const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Session = require('../models/Session');
const User = require('../models/User');

describe('Session Endpoints', () => {
  let authToken;
  let testUser;

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
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('participants');
      expect(res.body.participants[0].user.toString()).toBe(testUser._id.toString());
    });
  });

  describe('GET /api/sessions/:sessionId', () => {
    it('should get session details', async () => {
      // Create a session first
      const session = await Session.create({
        host: testUser._id,
        participants: [{
          user: testUser._id,
          joinedAt: new Date(),
          isActive: true,
          role: 'host'
        }]
      });

      const res = await request(app)
        .get(`/api/sessions/${session._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(session._id.toString());
    });
  });
});
