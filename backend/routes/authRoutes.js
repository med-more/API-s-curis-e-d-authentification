const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authValidators = require('../validators/authValidator');
const authBasic = require('../middlewares/authBasic');
const authSession = require('../middlewares/authSession');
const authJWT = require('../middlewares/authJWT');

// Authentication Routes
router.post('/register', 
  authValidators.registerValidator, 
  authController.register
);

router.post('/login', 
  authValidators.loginValidator, 
  authController.login
);

router.get('/logout', 
  authController.logout
);

// Verification Routes
router.get('/verify-email/:token', 
  authController.verifyEmail
);

router.post('/resend-verification', 
  authController.resendVerification
);

router.post('/verify-phone', 
  authJWT, 
  authController.verifyPhone
);

// Password Routes
router.post('/forgot-password', 
  authController.forgotPassword
);

router.post('/reset-password/:token', 
  authController.resetPassword
);

// Profile Route
router.put('/profile', 
  authJWT, 
  authController.updateProfile
);

// User Info Routes
router.get('/me/basic', 
  authBasic, 
  authController.getMe
);

router.get('/me/jwt', 
  authJWT, 
  authController.getMe
);

router.get('/me/session', 
  authSession, 
  authController.getMe
);

module.exports = router;