const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const testResultController = require('../controllers/testResultController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/', auth, testController.getTests);
router.get('/chapter/:chapterId', auth, testController.getTestsByChapter);
const { validateBody } = require('../middleware/validator');

router.get('/:id', auth, testController.getTestById);
router.post('/', auth, authorize('admin'), validateBody(['title', 'chapter', 'duration', 'totalMarks', 'questions']), testController.createTest);
router.put('/:id', auth, authorize('admin'), testController.updateTest);
router.delete('/:id', auth, authorize('admin'), testController.deleteTest);

router.post('/:id/submit', auth, authorize('student'), testResultController.submitTestResult);

module.exports = router;
