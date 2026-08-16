const User = require('../models/User');
const Submission = require('../models/Submission');
const TestResult = require('../models/TestResult');

exports.getStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort({ name: 1 });
    res.json(students);
  } catch (error) {
    next(error);
  }
};

exports.getStudentPerformance = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const student = await User.findById(studentId).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const submissions = await Submission.find({ student: studentId })
      .populate('assignment', 'title totalMarks');

    const testResults = await TestResult.find({ student: studentId })
      .populate('test', 'title totalMarks');

    let gradedSubmissions = submissions.filter(s => s.status === 'graded');
    let avgAssignmentScore = 0;
    if (gradedSubmissions.length > 0) {
      const sum = gradedSubmissions.reduce((acc, s) => acc + (s.marks / s.assignment.totalMarks), 0);
      avgAssignmentScore = Number(((sum / gradedSubmissions.length) * 100).toFixed(2));
    }

    let avgTestScore = 0;
    if (testResults.length > 0) {
      const sum = testResults.reduce((acc, r) => acc + (r.score / r.totalMarks), 0);
      avgTestScore = Number(((sum / testResults.length) * 100).toFixed(2));
    }

    res.json({
      student,
      performance: {
        totalSubmissions: submissions.length,
        gradedSubmissions: gradedSubmissions.length,
        avgAssignmentScore,
        totalTestsTaken: testResults.length,
        avgTestScore,
        submissions,
        testResults
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    await Submission.deleteMany({ student: req.params.id });
    await TestResult.deleteMany({ student: req.params.id });

    res.json({ message: 'Student and all related records deleted successfully' });
  } catch (error) {
    next(error);
  }
};
