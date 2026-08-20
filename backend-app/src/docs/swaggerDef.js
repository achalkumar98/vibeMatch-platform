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
  // Tags declared alphabetically — Swagger UI renders groups in this order
  tags: [
    { name: 'Admin', description: 'Admin analytics and user management' },
    { name: 'Auth', description: 'Signup, login, logout' },
    { name: 'Chat', description: '1:1 chat between connected users' },
    { name: 'Payments', description: 'Razorpay membership payments' },
    { name: 'Profile', description: "Logged-in user's profile" },
    { name: 'Requests', description: 'Connection request management' },
    { name: 'Upload', description: 'Image upload via Cloudinary' },
    { name: 'Users', description: 'Connections and feed' },
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
