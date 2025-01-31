const bcrypt = require('bcryptjs');
const { prisma } = require('../../config/database');
const { AppError } = require('../../middleware/error-handler');
const { generateToken, generateRefreshToken } = require('../../utils/token');
const emailService = require('../../services/email-service');
const crypto = require('crypto');

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        verificationToken,
      },
    });

    await emailService.sendVerificationEmail(email, verificationToken);

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({
      status: 'success',
      message: 'Registration successful. Please verify your email.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Invalid email or password', 401));
    }

    if (!user.emailVerified) {
      return next(new AppError('Please verify your email first', 401));
    }

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Find the user based on the verification token
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    // If no user is found or token is already used (verificationToken is null), return an error
    if (!user || user.verificationToken === null) {
      return next(new AppError('Invalid or expired verification token', 400));
    }

    // If the user is already verified, return a success message
    if (user.emailVerified) {
      return res.status(200).json({
        status: 'success',
        message: 'Email has already been verified.',
      });
    }

    // Proceed with the verification if the user is found and the token is valid
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null, // Clear the token after successful verification
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully.',
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(new AppError('No user found with this email', 404));
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetToken || null, // Explicitly set null if undefined
        resetTokenExpires: passwordResetExpires || null,
      },
    });

    await emailService.sendPasswordResetEmail(email, resetToken);

    res.status(200).json({
      status: 'success',
      message: 'Password reset email sent',
    });
  } catch (error) {
    next(error);
  }
};

// Social login/registration
const socialLogin = async (req, res, next) => {
  try {
    const { provider, providerId, email, name, image } = req.body;

    const accountType = 'oauth';

    let user = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    });

    if (!user) {
      // Create new user if doesn't exist
      user = await prisma.user.create({
        data: {
          email,
          name,
          emailVerified: true,
          image,
          password: crypto.randomBytes(32).toString('hex'), // Random password for social accounts
          accounts: {
            create: {
              provider,
              providerAccountId: providerId,
              type: accountType,
            },
          },
        },
        include: { accounts: true },
      });
    } else {
      // Link account if user exists but hasn't linked this provider
      const existingAccount = user.accounts.find(
        (acc) =>
          acc.provider === provider && acc.providerAccountId === providerId
      );

      if (!existingAccount) {
        await prisma.account.create({
          data: {
            userId: user.id,
            provider,
            providerAccountId: providerId,
            type: accountType,
          },
        });
      }
    }

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      status: 'success',
      data: {
        user,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.emailVerified) {
      return next(new AppError('Email already verified', 400));
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    await emailService.sendVerificationEmail(email, verificationToken);

    res.status(200).json({
      status: 'success',
      message: 'Verification email sent',
    });
  } catch (error) {
    next(error);
  }
};

// Reset password functionality
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return next(new AppError('Invalid or expired reset token', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  socialLogin,
  resetPassword,
  resendVerification,
};
