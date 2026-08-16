const Progress = require('../models/Progress');
const Note = require('../models/Note');
const Video = require('../models/Video');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Test = require('../models/Test');
const TestResult = require('../models/TestResult');

exports.recalculateProgress = async (studentId, chapterId) => {
  try {
    // 1. Fetch total resources for the chapter
    const totalNotes = await Note.countDocuments({ chapter: chapterId });
    const totalVideos = await Video.countDocuments({ chapter: chapterId });
    const totalAssignments = await Assignment.countDocuments({ chapter: chapterId });
    const totalTests = await Test.countDocuments({ chapter: chapterId, isActive: true });

    const totalResources = totalNotes + totalVideos + totalAssignments + totalTests;
    if (totalResources === 0) return 0;

    // 2. Fetch existing Progress record or initialize it
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

    // 3. Find submitted assignments for this chapter
    const submissions = await Submission.find({ student: studentId });
    const submittedAssignments = [];
    for (const sub of submissions) {
      const assign = await Assignment.findById(sub.assignment);
      if (assign && assign.chapter.toString() === chapterId.toString()) {
        submittedAssignments.push(assign._id);
      }
    }
    progress.submittedAssignments = [...new Set(submittedAssignments.map(id => id.toString()))];

    // 4. Find completed tests for this chapter
    const testResults = await TestResult.find({ student: studentId });
    const completedTests = [];
    for (const tr of testResults) {
      const test = await Test.findById(tr.test);
      if (test && test.chapter.toString() === chapterId.toString()) {
        completedTests.push(test._id);
      }
    }
    progress.completedTests = [...new Set(completedTests.map(id => id.toString()))];

    // 5. Filter note/video completions to ensure they still exist in this chapter
    const validNotes = await Note.find({ _id: { $in: progress.completedNotes }, chapter: chapterId });
    progress.completedNotes = validNotes.map(n => n._id);

    const validVideos = await Video.find({ _id: { $in: progress.completedVideos }, chapter: chapterId });
    progress.completedVideos = validVideos.map(v => v._id);

    // 6. Calculate overall progress percentage
    const completedCount = 
      progress.completedNotes.length + 
      progress.completedVideos.length + 
      progress.submittedAssignments.length + 
      progress.completedTests.length;

    progress.percentage = Math.round((completedCount / totalResources) * 100);
    progress.lastUpdated = new Date();

    await progress.save();
    return progress.percentage;
  } catch (error) {
    console.error('Error recalculating progress:', error);
    return 0;
  }
};
