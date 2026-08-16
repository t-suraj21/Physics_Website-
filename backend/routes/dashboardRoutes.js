const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/admin', auth, authorize('admin'), dashboardController.getAdminDashboard);
router.get('/student', auth, authorize('student'), dashboardController.getStudentDashboard);

module.exports = router;
