const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/', videoController.getAllVideos);
router.get('/chapter/:chapterId', videoController.getVideosByChapter);
router.post('/', auth, authorize('admin'), videoController.addVideo);
router.put('/:id', auth, authorize('admin'), videoController.updateVideo);
router.delete('/:id', auth, authorize('admin'), videoController.deleteVideo);

module.exports = router;
