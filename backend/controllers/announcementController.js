const Announcement = require('../models/Announcement');

exports.getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    next(error);
  }
};

exports.createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, priority } = req.body;
    const announcement = await Announcement.create({
      title,
      message,
      priority: priority || 'normal',
      createdBy: req.user.id
    });
    
    const populated = await announcement.populate('createdBy', 'name');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

exports.updateAnnouncement = async (req, res, next) => {
  try {
    const { title, message, priority } = req.body;
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    if (title) announcement.title = title;
    if (message) announcement.message = message;
    if (priority) announcement.priority = priority;

    await announcement.save();
    const populated = await announcement.populate('createdBy', 'name');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    next(error);
  }
};
