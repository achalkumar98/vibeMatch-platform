const express = require('express');
const authRoute = require('./auth.route');
const profileRoute = require('./profile.route');
const requestRoute = require('./request.route');
const userRoute = require('./user.route');
const paymentRoute = require('./payment.route');
const chatRoute = require('./chat.route');
const adminRoute = require('./admin.route');
const uploadRoute = require('./upload.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  { path: '/', route: authRoute },
  { path: '/', route: profileRoute },
  { path: '/', route: requestRoute },
  { path: '/', route: userRoute },
  { path: '/', route: paymentRoute },
  { path: '/', route: chatRoute },
  { path: '/', route: adminRoute },
  { path: '/', route: uploadRoute },
];

const devRoutes = [{ path: '/docs', route: docsRoute }];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
