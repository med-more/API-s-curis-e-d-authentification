const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const authJWT = require('../middlewares/authJWT');
const isAdmin = require('../middlewares/isAdmin');

router.get('/', authJWT, isAdmin, userCtrl.getAllUsers);
router.get('/search', authJWT, isAdmin, userCtrl.searchUsers);
router.get('/activity-logs', authJWT, isAdmin, userCtrl.getActivityLogs);
router.get('/:id', authJWT, isAdmin, userCtrl.getUserById);
router.put('/:id', authJWT, isAdmin, userCtrl.updateUser);
router.delete('/:id', authJWT, isAdmin, userCtrl.deleteUser);

module.exports = router;