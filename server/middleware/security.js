const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const configSecurity = (app) => {
  // Set security HTTP headers
  app.use(helmet());

  // Data sanitization against XSS
  app.use(xss());

  // Rate limiting
  app.use('/api/', limiter);

  // CORS configuration
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );
    next();
  });
};

module.exports = configSecurity;