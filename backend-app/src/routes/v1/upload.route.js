const express = require('express');
const httpStatus = require('http-status');
const { userAuth } = require('../../middlewares/auth');
const { upload, uploadToCloudinary } = require('../../config/cloudinary');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Image upload via Cloudinary
 */

/**
 * @swagger
 * /upload/photo:
 *   post:
 *     summary: Upload a profile photo to Cloudinary (multipart/form-data, field "photo")
 *     tags: [Upload]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [photo]
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "200":
 *         description: Upload successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 photoUrl:
 *                   type: string
 *       "400":
 *         description: No file uploaded or wrong mime type
 *       "401":
 *         description: Unauthorized
 */
router.post(
  '/upload/photo',
  userAuth,
  upload.single('photo'),
  catchAsync(async (req, res) => {
    if (!req.file) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No file uploaded');
    }
    const result = await uploadToCloudinary(req.file.buffer);
    res.json({ message: 'Photo uploaded successfully', photoUrl: result.secure_url });
  })
);

module.exports = router;
