const express = require('express');
const { userAuth, adminAuth } = require('../../middlewares/auth');
const adminController = require('../../controllers/admin.controller');

const router = express.Router();

// All admin routes require a valid session AND the isAdmin flag on the user

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin analytics and user management
 */

/**
 * @swagger
 * /admin/analytics:
 *   get:
 *     summary: Get headline metrics (revenue, DAU, total matches) + 30-day charts
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days for chart data
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                 dailyActiveUsers:
 *                   type: integer
 *                 totalMatches:
 *                   type: integer
 *                 revenueChart:
 *                   type: array
 *                 dauChart:
 *                   type: array
 *       "403":
 *         description: Admin access required
 */
router.get('/admin/analytics', userAuth, adminAuth, adminController.getAnalytics);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Paginated list of all users (with optional search)
 *     tags: [Admin]
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 */
router.get('/admin/users', userAuth, adminAuth, adminController.listUsers);

/**
 * @swagger
 * /admin/users/{userId}/ban:
 *   patch:
 *     summary: Ban or unban a user
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isBanned]
 *             properties:
 *               isBanned:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: OK
 *       "400":
 *         description: Validation error
 *       "404":
 *         description: User not found
 */
router.patch('/admin/users/:userId/ban', userAuth, adminAuth, adminController.banUser);

/**
 * @swagger
 * /admin/reported:
 *   get:
 *     summary: Get reported / banned profiles for review
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       "200":
 *         description: OK
 */
router.get('/admin/reported', userAuth, adminAuth, adminController.getReportedProfiles);

module.exports = router;
