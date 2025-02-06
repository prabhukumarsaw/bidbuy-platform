const express = require('express');
const { protect, restrictTo } = require('../../middleware/index');
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
} = require('../../controllers/v1/category-controller');

const router = express.Router();

// Public route - accessible by all users
router.get('/', getAllCategories);

// Protected routes - only accessible by admins
router.use(protect);
router.use(restrictTo('ADMIN'));

router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.patch('/:id/restore', restoreCategory); // Restore soft-deleted category

module.exports = router;
