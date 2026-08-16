const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');

router.post('/register', authController.register);
router.post('/admin/register', authController.adminRegister);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);
router.get('/teacher', authController.getTeacherProfile);
router.put('/profile', auth, authController.updateProfile);
router.put('/avatar', auth, uploadAvatar.single('avatar'), authController.updateAvatar);

module.exports = router;
