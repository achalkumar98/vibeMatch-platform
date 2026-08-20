const express = require('express');
const validate = require('../../middlewares/validate');
const { userAuth } = require('../../middlewares/auth');
const { requestValidation } = require('../../validations');
const { requestController } = require('../../controllers');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: Connection request management
 */

/**
 * @swagger
 * /request/send/{status}/{touserId}:
 *   post:
 *     summary: Send a connection request (ignored/interested)
 *     tags: [Requests]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ignored, interested]
 *       - in: path
 *         name: touserId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: User not found
 */
router.post(
  '/request/send/:status/:touserId',
  userAuth,
  validate(requestValidation.sendRequest),
  requestController.sendRequest
);

/**
 * @swagger
 * /request/review/{status}/{requestId}:
 *   post:
 *     summary: Review a received connection request (accepted/rejected)
 *     tags: [Requests]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [accepted, rejected]
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "404":
 *         description: Request not found
 */
router.post(
  '/request/review/:status/:requestId',
  userAuth,
  validate(requestValidation.reviewRequest),
  requestController.reviewRequest
);

module.exports = router;
