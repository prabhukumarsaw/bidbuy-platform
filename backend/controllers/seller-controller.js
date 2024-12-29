const { prisma } = require('../config/database');
const { AppError } = require('../middleware/error-handler');
const logger = require('../config/logger');

// Submit seller application
const submitApplication = async (req, res, next) => {
  try {
    const {
      businessName,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
      gstNumber,
      aadhaarNumber,
      panNumber,
    } = req.body;

    // Get file paths
    const gstDocument = req.files?.gstDocument?.[0]?.path;
    const aadhaarDocument = req.files?.aadhaarDocument?.[0]?.path;
    const panDocument = req.files?.panDocument?.[0]?.path;

    // Validate required documents
    if (!gstDocument || !aadhaarDocument || !panDocument) {
      throw new AppError('All documents are required', 400);
    }

    // Check if user already has a seller profile
    const existingSeller = await prisma.seller.findUnique({
      where: { userId: req.user.id },
    });

    if (existingSeller) {
      throw new AppError('Seller profile already exists', 400);
    }

    // Create seller profile
    const seller = await prisma.seller.create({
      data: {
        userId: req.user.id,
        businessName,
        phone,
        address,
        city,
        state,
        postalCode,
        country,
        gstNumber,
        gstDocument,
        aadhaarNumber,
        aadhaarDocument,
        panNumber,
        panDocument,
        verified: false,
      },
    });

    logger.info(`New seller application submitted: ${seller.id}`);

    res.status(201).json({
      status: 'success',
      data: seller,
    });
  } catch (error) {
    next(error);
  }
};

// Get seller profile
const getSellerProfile = async (req, res, next) => {
  try {
    const seller = await prisma.seller.findUnique({
      where: { userId: req.user.id },
      include: { user: true },
    });

    if (!seller) {
      return next(new AppError('Seller profile not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: seller,
    });
  } catch (error) {
    next(error);
  }
};

// Update seller profile
const updateSellerProfile = async (req, res, next) => {
  try {
    const seller = await prisma.seller.update({
      where: { userId: req.user.id },
      data: req.body,
    });

    res.status(200).json({
      status: 'success',
      data: seller,
    });
  } catch (error) {
    next(error);
  }
};

const uploadDocument = async (req, res, next) => {
  try {
    const { type } = req.params;

    if (!req.file) {
      throw new AppError('Document file is required', 400);
    }

    const document = req.file.path;

    const seller = await prisma.seller.update({
      where: { userId: req.user.id },
      data: {
        [`${type}Document`]: document,
      },
    });

    res.status(200).json({
      status: 'success',
      data: seller,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitApplication,
  getSellerProfile,
  updateSellerProfile,
  uploadDocument,
};
