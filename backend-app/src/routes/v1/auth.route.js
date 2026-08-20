const express = require('express');
const validate = require('../../middlewares/validate');
const { authValidation } = require('../../validations');
const { authController } = require('../../controllers');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Signup, login, logout
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, emailId, password]
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               emailId:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       "200":
 *         description: User created
 *       "400":
 *         description: Validation error
 */
router.post('/signup', validate(authValidation.signup), authController.signup);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [emailId, password]
 *             properties:
 *               emailId:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "400":
 *         description: Invalid credentials
 */
router.post('/login', validate(authValidation.login), authController.login);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Auth]
 *     responses:
 *       "200":
 *         description: OK
 */
router.post('/logout', authController.logout);

module.exports = router;
