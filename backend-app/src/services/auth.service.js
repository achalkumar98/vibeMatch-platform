const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const signup = async ({ firstName, lastName, emailId, password }) => {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
  });

  const savedUser = await user.save();
  const token = await savedUser.getJWT();

  return { savedUser, token };
};

const login = async ({ emailId, password }) => {
  const user = await User.findOne({ emailId });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid credentials');
  }

  const isPasswordValid = await user.validatePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect password. Please try again.');
  }

  const token = await user.getJWT();
  return { user, token };
};

module.exports = {
  signup,
  login,
};
