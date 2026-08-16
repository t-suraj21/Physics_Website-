const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/', auth, authorize('admin'), studentController.getStudents);
router.get('/:id', auth, authorize('admin'), studentController.getStudentPerformance);
router.delete('/:id', auth, authorize('admin'), studentController.deleteStudent);

module.exports = router;
