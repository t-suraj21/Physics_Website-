const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const auth = require('../middleware/auth');

router.post('/complete', auth, progressController.markResourceComplete);
router.get('/chapter/:chapterId', auth, progressController.getChapterProgress);
router.get('/summary', auth, progressController.getProgressSummary);

module.exports = router;
