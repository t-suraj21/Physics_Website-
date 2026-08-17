const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');
const { uploadFile } = require('../middleware/upload');

router.get('/', auth, assignmentController.getAssignments);
router.get('/chapter/:chapterId', auth, assignmentController.getAssignmentsByChapter);
const { validateBody } = require('../middleware/validator');

router.get('/:id', auth, assignmentController.getAssignmentById);
router.post('/', auth, authorize('admin'), uploadFile.single('file'), validateBody(['title', 'chapter', 'dueDate', 'totalMarks']), assignmentController.createAssignment);
router.put('/:id', auth, authorize('admin'), uploadFile.single('file'), assignmentController.updateAssignment);
router.delete('/:id', auth, authorize('admin'), assignmentController.deleteAssignment);

module.exports = router;
