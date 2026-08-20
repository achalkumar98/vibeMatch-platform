const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./logger');

const connectDB = async () => {
  await mongoose.connect(config.mongoose.url);
  logger.info('Database connection Established...');
};

module.exports = connectDB;
