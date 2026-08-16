const express = require('express');
const router = express.Router();
const testResultController = require('../controllers/testResultController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/test/:testId', auth, authorize('admin'), testResultController.getTestResultsByTest);
router.get('/my', auth, authorize('student'), testResultController.getMyTestResults);
router.get('/:id', auth, testResultController.getTestResultById);

module.exports = router;
