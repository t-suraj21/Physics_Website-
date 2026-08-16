const Progress = require('../models/Progress');
const Note = require('../models/Note');
const Video = require('../models/Video');
const progressService = require('../services/progressService');

exports.markResourceComplete = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { resourceType, resourceId, chapterId } = req.body;

    if (!resourceType || !resourceId || !chapterId) {
      return res.status(400).json({ message: 'Missing parameters resourceType, resourceId, or chapterId' });
    }

    let progress = await Progress.findOne({ student: studentId, chapter: chapterId });
    if (!progress) {
      progress = new Progress({
        student: studentId,
        chapter: chapterId,
        completedNotes: [],
        completedVideos: [],
        submittedAssignments: [],
        completedTests: []
      });
    }

    if (resourceType === 'note') {
      const noteExists = await Note.findById(resourceId);
      if (!noteExists) return res.status(404).json({ message: 'Note not found' });
      if (!progress.completedNotes.includes(resourceId)) {
        progress.completedNotes.push(resourceId);
      }
    } else if (resourceType === 'video') {
      const videoExists = await Video.findById(resourceId);
      if (!videoExists) return res.status(404).json({ message: 'Video not found' });
      if (!progress.completedVideos.includes(resourceId)) {
        progress.completedVideos.push(resourceId);
      }
    } else {
      return res.status(400).json({ message: 'Invalid resourceType. Must be note or video.' });
    }

    await progress.save();
    
    // Recalculate and return new percentage
    const newPercentage = await progressService.recalculateProgress(studentId, chapterId);
    res.json({ success: true, percentage: newPercentage });
  } catch (error) {
    next(error);
  }
};

exports.getChapterProgress = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { chapterId } = req.params;

    let progress = await Progress.findOne({ student: studentId, chapter: chapterId });
    if (!progress) {
      // Trigger a recalculate to initialize progress if resources exist
      const percentage = await progressService.recalculateProgress(studentId, chapterId);
      progress = await Progress.findOne({ student: studentId, chapter: chapterId });
      if (!progress) {
        return res.json({
          percentage: 0,
          completedNotes: [],
          completedVideos: [],
          submittedAssignments: [],
          completedTests: []
        });
      }
    }

    res.json(progress);
  } catch (error) {
    next(error);
  }
};

exports.getProgressSummary = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const progressRecords = await Progress.find({ student: studentId }).populate('chapter', 'title order');
    
    let totalChaptersCompleted = 0;
    let sumPercentage = 0;

    progressRecords.forEach(record => {
      sumPercentage += record.percentage;
      if (record.percentage === 100) {
        totalChaptersCompleted += 1;
      }
    });

    const averageProgress = progressRecords.length > 0 
      ? Math.round(sumPercentage / progressRecords.length) 
      : 0;

    res.json({
      averageProgress,
      totalChaptersCompleted,
      records: progressRecords
    });
  } catch (error) {
    next(error);
  }
};
