const Assignment = require('../models/Assignment');
const fs = require('fs');
const path = require('path');

const getFileUrl = (req, file) => {
  if (!file) return '';
  if (file.path.startsWith('http://') || file.path.startsWith('https://')) {
    return file.path;
  }
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/uploads/${file.filename}`;
};

exports.getAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find().populate('chapter', 'title').sort({ dueDate: 1 });
    res.json(assignments);
  } catch (error) {
    next(error);
  }
};

exports.getAssignmentsByChapter = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({ chapter: req.params.chapterId }).sort({ dueDate: 1 });
    res.json(assignments);
  } catch (error) {
    next(error);
  }
};

exports.getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('chapter', 'title');
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (error) {
    next(error);
  }
};

exports.createAssignment = async (req, res, next) => {
  try {
    const { title, description, chapter, dueDate, totalMarks } = req.body;
    let resourceUrl = '';
    let resourceName = '';

    if (req.file) {
      resourceUrl = getFileUrl(req, req.file);
      resourceName = req.file.originalname;
    }

    const assignment = await Assignment.create({
      title,
      description,
      chapter,
      dueDate,
      totalMarks,
      resourceUrl,
      resourceName,
      createdBy: req.user.id
    });

    res.status(201).json(assignment);
  } catch (error) {
    next(error);
  }
};

exports.updateAssignment = async (req, res, next) => {
  try {
    const { title, description, dueDate, totalMarks } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (title) assignment.title = title;
    if (description !== undefined) assignment.description = description;
    if (dueDate) assignment.dueDate = dueDate;
    if (totalMarks !== undefined) assignment.totalMarks = totalMarks;

    if (req.file) {
      assignment.resourceUrl = getFileUrl(req, req.file);
      assignment.resourceName = req.file.originalname;
    }

    await assignment.save();
    res.json(assignment);
  } catch (error) {
    next(error);
  }
};

exports.deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const deleteLocalFile = (fileUrl) => {
      if (fileUrl && !fileUrl.includes('cloudinary.com')) {
        try {
          const parts = fileUrl.split('/uploads/');
          if (parts.length > 1) {
            const filename = parts[1];
            const filepath = path.join(__dirname, '../uploads', filename);
            if (fs.existsSync(filepath)) {
              fs.unlinkSync(filepath);
            }
          }
        } catch (err) {
          console.error('Failed to delete local file:', err);
        }
      }
    };

    // Delete assignment worksheet file
    deleteLocalFile(assignment.resourceUrl);

    // Delete all student submission files associated with this assignment
    const Submission = require('../models/Submission');
    const submissions = await Submission.find({ assignment: req.params.id });
    submissions.forEach(sub => {
      deleteLocalFile(sub.fileUrl);
    });

    await Assignment.findByIdAndDelete(req.params.id);
    await Submission.deleteMany({ assignment: req.params.id });

    res.json({ message: 'Assignment and associated submissions deleted successfully' });
  } catch (error) {
    next(error);
  }
};
