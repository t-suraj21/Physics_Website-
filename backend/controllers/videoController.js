const Video = require('../models/Video');

exports.getVideosByChapter = async (req, res, next) => {
  try {
    const videos = await Video.find({ chapter: req.params.chapterId }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    next(error);
  }
};

exports.addVideo = async (req, res, next) => {
  try {
    const { title, description, chapter, youtubeUrl, duration } = req.body;

    const video = await Video.create({
      title,
      description,
      chapter,
      youtubeUrl,
      duration,
      addedBy: req.user.id
    });

    res.status(201).json(video);
  } catch (error) {
    next(error);
  }
};

exports.updateVideo = async (req, res, next) => {
  try {
    const { title, description, youtubeUrl, duration } = req.body;
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (youtubeUrl) video.youtubeUrl = youtubeUrl;
    if (duration !== undefined) video.duration = duration;

    await video.save();
    res.json(video);
  } catch (error) {
    next(error);
  }
};

exports.deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getAllVideos = async (req, res, next) => {
  try {
    const videos = await Video.find()
      .populate('chapter', 'title order')
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    next(error);
  }
};
