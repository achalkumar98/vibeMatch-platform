const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'VibeMatch API documentation',
    version,
    license: {
      name: 'ISC',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/api`,
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token',
      },
    },
  },
};

module.exports = swaggerDef;
