const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Photo uploader function
async function handlePhotoUpload(file) {
  if (!file) return null;

  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'fixmate_workers' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      uploadStream.end(file.buffer);
    });
  } else {
    // Fallback: convert file to base64 Data URL for instant usability without setup
    const mime = file.mimetype || 'image/jpeg';
    const base64 = file.buffer.toString('base64');
    return `data:${mime};base64,${base64}`;
  }
}

module.exports = {
  upload,
  handlePhotoUpload
};
