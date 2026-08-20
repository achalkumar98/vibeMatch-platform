const Joi = require('joi');
const { objectId } = require('./custom.validation');

const editProfile = {
  body: Joi.object().keys({
    firstName: Joi.string().trim().min(2),
    lastName: Joi.string().trim().allow(''),
    emailId: Joi.string().trim().email(),
    photoUrl: Joi.string().trim().uri(),
    gender: Joi.string().valid('male', 'female', 'other'),
    age: Joi.number().integer().min(18),
    about: Joi.string().trim().max(500),
    skills: Joi.array().items(Joi.string()),
  }),
};

const getFeed = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(50),
    cursor: Joi.string().optional(),
  }),
};

const targetUserParam = {
  params: Joi.object().keys({
    targetUserId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  editProfile,
  getFeed,
  targetUserParam,
};
