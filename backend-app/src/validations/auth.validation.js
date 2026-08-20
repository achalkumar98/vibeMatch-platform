const Joi = require('joi');

const signup = {
  body: Joi.object().keys({
    firstName: Joi.string().trim().min(4).max(20).required(),
    lastName: Joi.string().trim().allow(''),
    emailId: Joi.string().trim().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

const login = {
  body: Joi.object().keys({
    emailId: Joi.string().trim().email().required(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  signup,
  login,
};
