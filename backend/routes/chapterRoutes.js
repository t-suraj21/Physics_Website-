const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/', auth, chapterController.getChapters);
router.get('/:id', auth, chapterController.getChapterById);
router.post('/', auth, authorize('admin'), chapterController.createChapter);
router.put('/:id', auth, authorize('admin'), chapterController.updateChapter);
router.delete('/:id', auth, authorize('admin'), chapterController.deleteChapter);

module.exports = router;
