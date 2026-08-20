const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const razorpayInstance = require('../config/razorpay');
const config = require('../config/config');
const { Payment, User } = require('../models');
const { membershipAmount } = require('../utils/constants');

const createOrder = async (user, membershipType) => {
  const { firstName, lastName, emailId } = user;

  const order = await razorpayInstance.orders.create({
    amount: membershipAmount[membershipType] * 100,
    currency: 'INR',
    receipt: 'receipt#1',
    notes: {
      firstName,
      lastName,
      emailId,
      membershipType,
    },
  });

  const payment = new Payment({
    userId: user._id,
    orderId: order.id,
    status: order.status,
    amount: order.amount / 100,
    currency: order.currency,
    receipt: order.receipt,
    notes: order.notes,
  });

  const savedPayment = await payment.save();
  return { savedPayment, keyId: config.razorpay.keyId };
};

const isWebhookSignatureValid = (body, signature) =>
  validateWebhookSignature(JSON.stringify(body), signature, config.razorpay.webhookSecret);

const handleWebhook = async (body) => {
  const paymentDetails = body.payload.payment.entity;

  const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
  payment.status = paymentDetails.status;
  await payment.save();

  const user = await User.findOne({ _id: payment.userId });
  user.isPremium = true;
  user.membershipType = payment.notes.membershipType;
  await user.save();
};

module.exports = {
  createOrder,
  isWebhookSignatureValid,
  handleWebhook,
};
