const Joi = require('joi');
const { objectId } = require('./custom.validation');

const sendRequest = {
  params: Joi.object().keys({
    status: Joi.string().valid('ignored', 'interested').required(),
    touserId: Joi.string().custom(objectId).required(),
  }),
};

const reviewRequest = {
  params: Joi.object().keys({
    status: Joi.string().valid('accepted', 'rejected').required(),
    requestId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  sendRequest,
  reviewRequest,
};
