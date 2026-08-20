const Joi = require('joi');

const createPayment = {
  body: Joi.object().keys({
    membershipType: Joi.string().valid('silver', 'gold', 'diamond').required(),
  }),
};

module.exports = {
  createPayment,
};
