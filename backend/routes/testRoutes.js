const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const testResultController = require('../controllers/testResultController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/', testController.getTests);
router.get('/chapter/:chapterId', testController.getTestsByChapter);
router.get('/:id', auth, testController.getTestById);
router.post('/', auth, authorize('admin'), testController.createTest);
router.put('/:id', auth, authorize('admin'), testController.updateTest);
router.delete('/:id', auth, authorize('admin'), testController.deleteTest);

router.post('/:id/submit', auth, authorize('student'), testResultController.submitTestResult);

module.exports = router;
