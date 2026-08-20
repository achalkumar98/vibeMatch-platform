const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { paymentService } = require('../services');

const createPayment = catchAsync(async (req, res) => {
  const { membershipType } = req.body;
  const { savedPayment, keyId } = await paymentService.createOrder(req.user, membershipType);

  res.json({ ...savedPayment.toJSON(), keyId });
});

const webhook = catchAsync(async (req, res) => {
  const webhookSignature = req.get('X-Razorpay-Signature');
  const isWebhookValid = paymentService.isWebhookSignatureValid(req.body, webhookSignature);

  if (!isWebhookValid) {
    return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Webhook signature is invalid' });
  }

  await paymentService.handleWebhook(req.body);

  return res.status(httpStatus.OK).json({ msg: 'Webhook received successfully' });
});

const verifyPremium = catchAsync(async (req, res) => {
  res.json({ isPremium: !!req.user.isPremium });
});

module.exports = {
  createPayment,
  webhook,
  verifyPremium,
};
