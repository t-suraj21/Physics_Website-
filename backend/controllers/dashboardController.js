const User = require('../models/User');
const Chapter = require('../models/Chapter');
const Note = require('../models/Note');
const Video = require('../models/Video');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Test = require('../models/Test');
const TestResult = require('../models/TestResult');
const Announcement = require('../models/Announcement');

exports.getAdminDashboard = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalChapters = await Chapter.countDocuments();
    const totalAssignments = await Assignment.countDocuments();
    const totalTests = await Test.countDocuments();
    
    const totalSubmissions = await Submission.countDocuments();
    const gradedSubmissions = await Submission.countDocuments({ status: 'graded' });
    const pendingSubmissions = totalSubmissions - gradedSubmissions;

    const allResults = await TestResult.find();
    let overallAvgTestScore = 0;
    if (allResults.length > 0) {
      const sum = allResults.reduce((acc, r) => acc + (r.score / r.totalMarks), 0);
      overallAvgTestScore = Number(((sum / allResults.length) * 100).toFixed(2));
    }

    const recentStudents = await User.find({ role: 'student' })
      .select('name email class createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentTestSubmissions = await TestResult.find()
      .populate('student', 'name class')
      .populate('test', 'title')
      .sort({ submittedAt: -1 })
      .limit(5);

    const recentAssignmentSubmissions = await Submission.find()
      .populate('student', 'name class')
      .populate('assignment', 'title')
      .sort({ submittedAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalStudents,
        totalChapters,
        totalAssignments,
        totalTests,
        totalSubmissions,
        gradedSubmissions,
        pendingSubmissions,
        overallAvgTestScore
      },
      recentStudents,
      recentTestSubmissions,
      recentAssignmentSubmissions
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudentDashboard = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const totalTestsTaken = await TestResult.countDocuments({ student: studentId });
    const totalSubmissions = await Submission.countDocuments({ student: studentId });

    const myResults = await TestResult.find({ student: studentId });
    let avgTestScore = 0;
    if (myResults.length > 0) {
      const sum = myResults.reduce((acc, r) => acc + (r.score / r.totalMarks), 0);
      avgTestScore = Number(((sum / myResults.length) * 100).toFixed(2));
    }

    const myGradedSubmissions = await Submission.find({ student: studentId, status: 'graded' })
      .populate('assignment', 'totalMarks');
    let avgAssignmentScore = 0;
    if (myGradedSubmissions.length > 0) {
      const sum = myGradedSubmissions.reduce((acc, s) => acc + (s.marks / s.assignment.totalMarks), 0);
      avgAssignmentScore = Number(((sum / myGradedSubmissions.length) * 100).toFixed(2));
    }

    const recentAnnouncements = await Announcement.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(3);

    const submittedAssignmentIds = await Submission.find({ student: studentId }).distinct('assignment');
    const upcomingAssignments = await Assignment.find({
      _id: { $nin: submittedAssignmentIds },
      dueDate: { $gte: new Date() }
    })
      .populate('chapter', 'title')
      .sort({ dueDate: 1 })
      .limit(3);

    const takenTestIds = await TestResult.find({ student: studentId }).distinct('test');
    const activeTests = await Test.find({
      _id: { $nin: takenTestIds },
      isActive: true
    })
      .populate('chapter', 'title')
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      stats: {
        totalTestsTaken,
        totalSubmissions,
        avgTestScore,
        avgAssignmentScore
      },
      recentAnnouncements,
      upcomingAssignments,
      activeTests
    });
  } catch (error) {
    next(error);
  }
};
