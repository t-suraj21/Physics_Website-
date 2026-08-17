const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/', auth, videoController.getAllVideos);
const { validateBody } = require('../middleware/validator');

router.get('/chapter/:chapterId', auth, videoController.getVideosByChapter);
router.post('/', auth, authorize('admin'), validateBody(['title', 'chapter', 'youtubeUrl']), videoController.addVideo);
router.put('/:id', auth, authorize('admin'), videoController.updateVideo);
router.delete('/:id', auth, authorize('admin'), videoController.deleteVideo);

module.exports = router;
