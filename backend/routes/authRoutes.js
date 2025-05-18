const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const authBasic = require('../middlewares/authBasic');
const authSession = require('../middlewares/authSession');
const authJWT = require('../middlewares/authJWT');

// Routes d'authentification
router.post('/register', registerValidator, authCtrl.register);
router.post('/login', loginValidator, authCtrl.login);
router.get('/logout', authCtrl.logout);

// Routes de vérification
router.get('/verify-email/:token', authCtrl.verifyEmail);
router.post('/resend-verification', authCtrl.resendVerification);
router.post('/verify-phone', authJWT, authCtrl.verifyPhone);

router.post('/forgot-password', authCtrl.forgotPassword);
router.post('/reset-password/:token', authCtrl.resetPassword);

router.put('/profile', authJWT, authCtrl.updateProfile); 

router.get('/me/basic', authBasic, authCtrl.getMe);
router.get('/me/jwt', authJWT, authCtrl.getMe);
router.get('/me/session', authSession, authCtrl.getMe);

module.exports = router;