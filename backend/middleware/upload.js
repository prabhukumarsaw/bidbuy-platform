const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Function to create Cloudinary storage for different folders dynamically
const createStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Supported image formats
      transformation: [{ width: 800, height: 800, crop: 'limit' }], // Resize image
    },
    // Error handling during the upload process
    onError: (error, next) => {
      console.error('Cloudinary Upload Error:', error);
      next(error); // Pass the error to multer error handling
    },
  });

// Middleware to handle the upload of both featuredImage and multiple images
const sellerAuctionUpload = multer({
  storage: createStorage('seller-auction'),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).fields([
  { name: 'featuredImage', maxCount: 1 }, // Single file for the featured image
  { name: 'images', maxCount: 4 }, // Up to 4 files for additional images
]);

const adminAuctionUpload = multer({
  storage: createStorage('admin-auction'),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).fields([
  { name: 'featuredImage', maxCount: 1 }, // Single file for the featured image
  { name: 'images', maxCount: 4 }, // Up to 4 files for additional images
]);

// Export middleware for use in routes
module.exports = {
  sellerAuctionUpload,
  adminAuctionUpload,
};
