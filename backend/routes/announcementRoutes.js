const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/', auth, announcementController.getAnnouncements);
router.post('/', auth, authorize('admin'), announcementController.createAnnouncement);
router.put('/:id', auth, authorize('admin'), announcementController.updateAnnouncement);
router.delete('/:id', auth, authorize('admin'), announcementController.deleteAnnouncement);

module.exports = router;
