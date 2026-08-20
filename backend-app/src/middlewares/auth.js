const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { User } = require('../models');

const userAuth = catchAsync(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please login first');
  }

  const decodedObj = jwt.verify(token, config.jwt.secret);
  const { _id } = decodedObj;

  const user = await User.findById(_id);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
  }

  req.user = user;
  next();
});

module.exports = {
  userAuth,
};
