const express = require('express');
const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  socialLogin,
  resendVerification,
} = require('../../controllers/v1/auth-controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
// router.post('/reset-password/:token', resetPassword);
router.post('/social-login', socialLogin);
router.post('/resend-verification', resendVerification);

module.exports = router;
