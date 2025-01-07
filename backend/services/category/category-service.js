const { prisma } = require('../../config/database');
const redis = require('../../config/redis');
const logger = require('../../config/logger');

const CACHE_TTL = 3600; // 1 hour

class CategoryService {
  async getAllCategories({ search, isActive, page, limit }) {
    try {
      const filters = {};
      if (search) filters.name = { contains: search, mode: 'insensitive' };
      if (isActive !== undefined) filters.isActive = isActive === 'true';

      const categories = await prisma.category.findMany({
        where: filters,
        include: { parent: true, children: true },
        skip: (page - 1) * limit,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      });

      const total = await prisma.category.count({ where: filters });
      return { categories, total };
    } catch (error) {
      logger.error('Error fetching categories:', error);
      throw error;
    }
  }

  async createCategory(data) {
    try {
      if (data.parentId) {
        const parentCategory = await prisma.category.findUnique({
          where: { id: data.parentId },
        });
        if (!parentCategory) {
          throw new Error('Parent category does not exist');
        }
      }

      const category = await prisma.category.create({ data });
      await redis.del('categories:all');
      return category;
    } catch (error) {
      logger.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(id, data) {
    try {
      const existingCategory = await prisma.category.findUnique({
        where: { id },
      });
      if (!existingCategory) {
        throw new Error('Category not found');
      }

      if (data.parentId && data.parentId !== id) {
        const parentCategory = await prisma.category.findUnique({
          where: { id: data.parentId },
        });
        if (!parentCategory) {
          throw new Error('Parent category does not exist');
        }
      }

      const category = await prisma.category.update({
        where: { id },
        data,
      });
      await redis.del('categories:all');
      return category;
    } catch (error) {
      logger.error('Error updating category:', error);
      throw error;
    }
  }

  async softDeleteCategory(id) {
    try {
      const category = await prisma.category.update({
        where: { id },
        data: { isActive: false },
      });
      await redis.del('categories:all');
      return category;
    } catch (error) {
      logger.error('Error deleting category:', error);
      throw error;
    }
  }

  async restoreCategory(id) {
    try {
      const category = await prisma.category.update({
        where: { id },
        data: { isActive: true },
      });
      await redis.del('categories:all');
      return category;
    } catch (error) {
      logger.error('Error restoring category:', error);
      throw error;
    }
  }
}

module.exports = new CategoryService();
