const express = require('express');
const validate = require('../../middlewares/validate');
const { userAuth } = require('../../middlewares/auth');
const { userValidation } = require('../../validations');
const { userController } = require('../../controllers');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Logged-in user's profile
 */

/**
 * @swagger
 * /profile/view:
 *   get:
 *     summary: Get the logged-in user's profile
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 */
router.get('/profile/view', userAuth, userController.getProfile);

/**
 * @swagger
 * /profile/edit:
 *   put:
 *     summary: Edit the logged-in user's profile
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               emailId:
 *                 type: string
 *               photoUrl:
 *                 type: string
 *               gender:
 *                 type: string
 *               age:
 *                 type: number
 *               about:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       "200":
 *         description: Updated
 *       "400":
 *         description: Validation error
 */
router.put('/profile/edit', userAuth, validate(userValidation.editProfile), userController.editProfile);

module.exports = router;
