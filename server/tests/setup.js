require('dotenv').config({ path: '.env.test' });
const mongoose = require('mongoose');

// Set strictQuery to true to suppress deprecation warning
mongoose.set('strictQuery', true);

// Setup test environment variables
process.env.JWT_SECRET = 'test-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/shop-together-test';

// Clear database before tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});