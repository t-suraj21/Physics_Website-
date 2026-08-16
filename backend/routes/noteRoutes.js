const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');
const { uploadFile } = require('../middleware/upload');

router.get('/', noteController.getAllNotes);
router.get('/chapter/:chapterId', noteController.getNotesByChapter);
router.post('/', auth, authorize('admin'), uploadFile.single('file'), noteController.uploadNote);
router.delete('/:id', auth, authorize('admin'), noteController.deleteNote);

module.exports = router;
