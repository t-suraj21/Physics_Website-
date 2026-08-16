const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');
const { uploadFile } = require('../middleware/upload');

router.post('/', auth, authorize('student'), uploadFile.single('file'), submissionController.submitAssignment);
router.get('/assignment/:assignmentId', auth, authorize('admin'), submissionController.getSubmissionsByAssignment);
router.get('/my', auth, authorize('student'), submissionController.getMySubmissions);
router.put('/:id/grade', auth, authorize('admin'), submissionController.gradeSubmission);

module.exports = router;
