const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

const { validateBody } = require('../middleware/validator');

router.get('/', auth, announcementController.getAnnouncements);
router.post('/', auth, authorize('admin'), validateBody(['title', 'message']), announcementController.createAnnouncement);
router.put('/:id', auth, authorize('admin'), announcementController.updateAnnouncement);
router.delete('/:id', auth, authorize('admin'), announcementController.deleteAnnouncement);

module.exports = router;
