const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');


router.post('/register',registerValidator, authCtrl.register);
router.post('/login',loginValidator, authCtrl.login);

module.exports = router;
