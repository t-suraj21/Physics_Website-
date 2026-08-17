const TestResult = require('../models/TestResult');
const Test = require('../models/Test');
const progressService = require('../services/progressService');

exports.submitTestResult = async (req, res, next) => {
  try {
    const testId = req.params.id;
    const { answers, timeTaken } = req.body;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid test submission: answers must be an array' });
    }

    if (!test.isActive) {
      return res.status(400).json({ message: 'This test is no longer active' });
    }

    let score = 0;
    test.questions.forEach((q, idx) => {
      const studentAnswer = answers[idx] !== undefined ? answers[idx] : -1;
      const isCorrect = studentAnswer === q.correctOption;
      if (isCorrect) {
        score += q.marks || 1;
      }
    });

    const totalMarks = test.totalMarks || 1;
    const percentage = Number(((score / totalMarks) * 100).toFixed(2));

    const result = await TestResult.create({
      test: testId,
      student: req.user.id,
      answers,
      score,
      totalMarks,
      percentage,
      timeTaken
    });

    await progressService.recalculateProgress(req.user.id, test.chapter);

    // Generate graded questions for response
    const gradedQuestions = test.questions.map((q, idx) => {
      const studentAnswer = answers[idx] !== undefined ? answers[idx] : -1;
      return {
        questionText: q.questionText,
        options: q.options,
        correctOption: q.correctOption,
        studentAnswer,
        isCorrect: studentAnswer === q.correctOption,
        marks: q.marks
      };
    });

    res.status(201).json({
      resultId: result._id,
      score,
      totalMarks,
      percentage,
      timeTaken,
      gradedQuestions
    });
  } catch (error) {
    next(error);
  }
};

exports.getTestResultsByTest = async (req, res, next) => {
  try {
    const results = await TestResult.find({ test: req.params.testId })
      .populate('student', 'name email class')
      .sort({ score: -1, submittedAt: 1 });
    res.json(results);
  } catch (error) {
    next(error);
  }
};

exports.getMyTestResults = async (req, res, next) => {
  try {
    const results = await TestResult.find({ student: req.user.id })
      .populate({
        path: 'test',
        select: 'title totalMarks duration',
        populate: { path: 'chapter', select: 'title' }
      })
      .sort({ submittedAt: -1 });
    res.json(results);
  } catch (error) {
    next(error);
  }
};

exports.getTestResultById = async (req, res, next) => {
  try {
    const result = await TestResult.findById(req.params.id)
      .populate('student', 'name email class')
      .populate({
        path: 'test',
        select: 'title questions duration chapter',
        populate: { path: 'chapter', select: 'title' }
      });

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    if (req.user.role !== 'admin' && result.student._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied to this result' });
    }

    const gradedQuestions = result.test.questions.map((q, idx) => {
      const studentAnswer = result.answers[idx] !== undefined ? result.answers[idx] : -1;
      return {
        questionText: q.questionText,
        options: q.options,
        correctOption: q.correctOption,
        studentAnswer,
        isCorrect: studentAnswer === q.correctOption,
        marks: q.marks
      };
    });

    res.json({
      result,
      gradedQuestions
    });
  } catch (error) {
    next(error);
  }
};
