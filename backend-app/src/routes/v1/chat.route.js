const express = require('express');
const { userAuth } = require('../../middlewares/auth');
const { userValidation } = require('../../validations');
const validate = require('../../middlewares/validate');
const { chatController } = require('../../controllers');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: 1:1 chat between connected users
 */

/**
 * @swagger
 * /chat/{targetUserId}:
 *   get:
 *     summary: Get (or create) the chat with a connected user
 *     tags: [Chat]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "403":
 *         description: Not connected
 */
router.get('/chat/:targetUserId', userAuth, validate(userValidation.targetUserParam), chatController.getChat);

module.exports = router;
