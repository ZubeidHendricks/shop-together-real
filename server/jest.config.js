module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setupTests.js'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  verbose: true
};