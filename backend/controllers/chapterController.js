const Chapter = require('../models/Chapter');
const Note = require('../models/Note');
const Video = require('../models/Video');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Test = require('../models/Test');
const TestResult = require('../models/TestResult');

exports.getChapters = async (req, res, next) => {
  try {
    const chapters = await Chapter.find().sort({ order: 1 });
    res.json(chapters);
  } catch (error) {
    next(error);
  }
};

exports.getChapterById = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    
    const notesCount = await Note.countDocuments({ chapter: chapter._id });
    const videosCount = await Video.countDocuments({ chapter: chapter._id });
    const assignmentsCount = await Assignment.countDocuments({ chapter: chapter._id });
    const testsCount = await Test.countDocuments({ chapter: chapter._id });

    res.json({
      chapter,
      stats: {
        notesCount,
        videosCount,
        assignmentsCount,
        testsCount
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.createChapter = async (req, res, next) => {
  try {
    const { title, description, order, icon } = req.body;

    const exists = await Chapter.findOne({ title });
    if (exists) {
      return res.status(400).json({ message: 'Chapter with this title already exists' });
    }

    const chapter = await Chapter.create({
      title,
      description,
      order: order || 0,
      icon: icon || '📚',
      createdBy: req.user.id
    });

    res.status(201).json(chapter);
  } catch (error) {
    next(error);
  }
};

exports.updateChapter = async (req, res, next) => {
  try {
    const { title, description, order, icon } = req.body;
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    if (title) chapter.title = title;
    if (description !== undefined) chapter.description = description;
    if (order !== undefined) chapter.order = order;
    if (icon) chapter.icon = icon;

    await chapter.save();
    res.json(chapter);
  } catch (error) {
    next(error);
  }
};

exports.deleteChapter = async (req, res, next) => {
  try {
    const chapterId = req.params.id;
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    await Chapter.findByIdAndDelete(chapterId);
    await Note.deleteMany({ chapter: chapterId });
    await Video.deleteMany({ chapter: chapterId });
    
    const assignments = await Assignment.find({ chapter: chapterId });
    const assignmentIds = assignments.map(a => a._id);
    await Submission.deleteMany({ assignment: { $in: assignmentIds } });
    await Assignment.deleteMany({ chapter: chapterId });

    const tests = await Test.find({ chapter: chapterId });
    const testIds = tests.map(t => t._id);
    await TestResult.deleteMany({ test: { $in: testIds } });
    await Test.deleteMany({ chapter: chapterId });

    res.json({ message: 'Chapter and all associated content deleted successfully' });
  } catch (error) {
    next(error);
  }
};
