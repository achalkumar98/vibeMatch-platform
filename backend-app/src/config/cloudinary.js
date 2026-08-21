const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');
const config = require('./config');

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

/** Multer — store in memory, max 5 MB */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

/** Upload buffer to Cloudinary v2 via upload_stream */
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'vibematch/avatars',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
}

module.exports = { cloudinary, upload, uploadToCloudinary };
