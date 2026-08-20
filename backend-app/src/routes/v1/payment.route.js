const express = require('express');
const validate = require('../../middlewares/validate');
const { userAuth } = require('../../middlewares/auth');
const { paymentValidation } = require('../../validations');
const { paymentController } = require('../../controllers');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Razorpay membership payments
 */

/**
 * @swagger
 * /payment/create:
 *   post:
 *     summary: Create a Razorpay order for a membership
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [membershipType]
 *             properties:
 *               membershipType:
 *                 type: string
 *                 enum: [silver, gold, diamond]
 *     responses:
 *       "200":
 *         description: OK
 */
router.post('/payment/create', userAuth, validate(paymentValidation.createPayment), paymentController.createPayment);

/**
 * @swagger
 * /payment/webhook:
 *   post:
 *     summary: Razorpay webhook receiver
 *     tags: [Payments]
 *     responses:
 *       "200":
 *         description: OK
 *       "400":
 *         description: Invalid signature
 */
router.post('/payment/webhook', paymentController.webhook);

/**
 * @swagger
 * /premium/verify:
 *   get:
 *     summary: Check whether the logged-in user is premium
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       "200":
 *         description: OK
 */
router.get('/premium/verify', userAuth, paymentController.verifyPremium);

module.exports = router;
