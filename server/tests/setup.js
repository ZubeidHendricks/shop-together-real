require('dotenv').config({ path: '.env.test' });

process.env.JWT_SECRET = 'test-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/shop-together-test';