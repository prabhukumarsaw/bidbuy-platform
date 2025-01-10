const nodemailer = require('nodemailer');
const logger = require('../config/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Verify your email address',
        html: `
          <h1>Email Verification</h1>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}">Verify Email</a>
        `,
      });

      logger.info(`Verification email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending verification email:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Password Reset Request',
        html: `
          <h1>Password Reset</h1>
          <p>Please click the link below to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });

      logger.info(`Password reset email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending password reset email:', error);
      throw error;
    }
  }

  async sendAccountDeactivationEmail(email) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Account Deactivated',
        html: `
          <h1>Account Deactivated</h1>
          <p>Your account has been deactivated by an administrator.</p>
          <p>If you believe this was done in error, please contact support.</p>
        `,
      });

      logger.info(`Account deactivation email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending account deactivation email:', error);
      throw error;
    }
  }

  async sendAccountReactivationEmail(email) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Account Reactivated',
        html: `
          <h1>Account Reactivated</h1>
          <p>Your account has been reactivated. You can now log in again.</p>
        `,
      });

      logger.info(`Account reactivation email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending account reactivation email:', error);
      throw error;
    }
  }

  async sendSellerVerificationEmail(email) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Seller Account Verified',
        html: `
          <h1>Seller Account Verified</h1>
          <p>Congratulations! Your seller account has been verified.</p>
          <p>You can now access the seller dashboard and start selling.</p>
        `,
      });

      logger.info(`Seller verification email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending seller verification email:', error);
      throw error;
    }
  }

  async sendSellerSuspensionEmail(email, reason) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Seller Account Suspended',
        html: `
          <h1>Seller Account Suspended</h1>
          <p>Your seller account has been suspended for the following reason:</p>
          <p><strong>${reason}</strong></p>
          <p>If you believe this was done in error, please contact support.</p>
        `,
      });

      logger.info(`Seller suspension email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending seller suspension email:', error);
      throw error;
    }
  }

  async sendSellerReactivationEmail(email) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Seller Account Reactivated',
        html: `
          <h1>Seller Account Reactivated</h1>
          <p>Your seller account has been reactivated.</p>
          <p>You can now access your seller dashboard and resume selling.</p>
        `,
      });

      logger.info(`Seller reactivation email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending seller reactivation email:', error);
      throw error;
    }
  }

}

module.exports = new EmailService();