const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const progressService = require('../services/progressService');

const getFileUrl = (req, file) => {
  if (!file) return '';
  if (file.path.startsWith('http://') || file.path.startsWith('https://')) {
    return file.path;
  }
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/uploads/${file.filename}`;
};

exports.submitAssignment = async (req, res, next) => {
  try {
    const { assignment } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const assignmentExists = await Assignment.findById(assignment);
    if (!assignmentExists) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const alreadySubmitted = await Submission.findOne({
      assignment,
      student: req.user.id
    });

    if (alreadySubmitted) {
      alreadySubmitted.fileUrl = getFileUrl(req, req.file);
      alreadySubmitted.fileName = req.file.originalname;
      alreadySubmitted.submittedAt = Date.now();
      alreadySubmitted.status = 'submitted';
      alreadySubmitted.marks = null;
      alreadySubmitted.feedback = '';
      
      await alreadySubmitted.save();
      await progressService.recalculateProgress(req.user.id, assignmentExists.chapter);
      return res.json(alreadySubmitted);
    }

    const submission = await Submission.create({
      assignment,
      student: req.user.id,
      fileUrl: getFileUrl(req, req.file),
      fileName: req.file.originalname
    });

    await progressService.recalculateProgress(req.user.id, assignmentExists.chapter);
    res.status(201).json(submission);
  } catch (error) {
    next(error);
  }
};

exports.getSubmissionsByAssignment = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.assignmentId })
      .populate('student', 'name email class')
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    next(error);
  }
};

exports.getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ student: req.user.id })
      .populate({
        path: 'assignment',
        select: 'title dueDate totalMarks',
        populate: { path: 'chapter', select: 'title' }
      })
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    next(error);
  }
};

exports.gradeSubmission = async (req, res, next) => {
  try {
    const { marks, feedback } = req.body;
    const submission = await Submission.findById(req.params.id).populate('assignment', 'totalMarks');
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (marks > submission.assignment.totalMarks) {
      return res.status(400).json({ message: `Marks cannot exceed the total marks of ${submission.assignment.totalMarks}` });
    }

    submission.marks = marks;
    submission.feedback = feedback || '';
    submission.status = 'graded';
    submission.gradedAt = Date.now();

    await submission.save();
    res.json(submission);
  } catch (error) {
    next(error);
  }
};
