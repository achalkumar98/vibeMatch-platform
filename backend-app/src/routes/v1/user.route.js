const express = require('express');
const validate = require('../../middlewares/validate');
const { userAuth } = require('../../middlewares/auth');
const { userValidation } = require('../../validations');
const { userController } = require('../../controllers');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Connections and feed
 */

/**
 * @swagger
 * /user/requests/received:
 *   get:
 *     summary: Get pending connection requests received by the logged-in user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       "200":
 *         description: OK
 */
router.get('/user/requests/received', userAuth, userController.getReceivedRequests);

/**
 * @swagger
 * /user/connections:
 *   get:
 *     summary: Get the logged-in user's accepted connections
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       "200":
 *         description: OK
 */
router.get('/user/connections', userAuth, userController.getConnections);

/**
 * @swagger
 * /feed:
 *   get:
 *     summary: Get the feed of other users (paginated)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *         description: OK
 */
router.get('/feed', userAuth, validate(userValidation.getFeed), userController.getFeed);

module.exports = router;
