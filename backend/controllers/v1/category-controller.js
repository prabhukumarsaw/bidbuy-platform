const CategoryService = require('../../services/category/category-service');
const { AppError } = require('../../middleware/error-handler');

const getAllCategories = async (req, res, next) => {
  const { search, isActive, page = 1, limit = 10 } = req.query;
  try {
    const result = await CategoryService.getAllCategories({
      search,
      isActive,
      page,
      limit,
    });
    res.status(200).json({ ...result, page, limit });
  } catch (error) {
    next(new AppError(500, 'Error fetching categories', error.message));
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await CategoryService.createCategory(req.body);
    res
      .status(201)
      .json({ message: 'Category created successfully', category });
  } catch (error) {
    next(new AppError(400, 'Error creating category', error.message));
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await CategoryService.updateCategory(
      req.params.id,
      req.body
    );
    res
      .status(200)
      .json({ message: 'Category updated successfully', category });
  } catch (error) {
    next(new AppError(400, 'Error updating category', error.message));
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await CategoryService.softDeleteCategory(req.params.id);
    res
      .status(200)
      .json({ message: 'Category deleted successfully', category });
  } catch (error) {
    next(new AppError(400, 'Error deleting category', error.message));
  }
};

const restoreCategory = async (req, res, next) => {
  try {
    const category = await CategoryService.restoreCategory(req.params.id);
    res
      .status(200)
      .json({ message: 'Category restored successfully', category });
  } catch (error) {
    next(new AppError(400, 'Error restoring category', error.message));
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
};
