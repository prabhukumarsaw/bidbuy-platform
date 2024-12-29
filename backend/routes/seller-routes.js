const express = require('express');
const { protect, restrictTo } = require('../middleware/auth-middleware');
const {
  submitApplication,
  getSellerProfile,
  updateSellerProfile,
  uploadDocument,
} = require('../controllers/seller-controller');
const upload = require('../middleware/upload-middleware');

const router = express.Router();

// Protect all seller routes
router.use(protect);

// Public routes (for authenticated users)
router.post(
  '/apply',
  upload.fields([
    { name: 'gstDocument', maxCount: 1 },
    { name: 'aadhaarDocument', maxCount: 1 },
    { name: 'panDocument', maxCount: 1 },
  ]),
  submitApplication
);

// Protected seller routes
router.use(restrictTo('SELLER'));
router.get('/profile', getSellerProfile);
router.patch('/profile', updateSellerProfile);
router.post('/documents/:type', upload.single('document'), uploadDocument);

module.exports = router;
