const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const logger = require('./config/logger');
const connectDB = require('./config/database');
const routes = require('./routes/v1');
const initializeSocket = require('./utils/socket');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// v1 api routes, mounted at /api to stay compatible with the existing client
app.use('/api', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    server.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
    });
  })
  .catch((err) => {
    logger.error(`Database cannot be connected: ${err.message}`);
  });

module.exports = app;
