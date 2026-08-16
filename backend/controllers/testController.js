const Test = require('../models/Test');

exports.getTests = async (req, res, next) => {
  try {
    const isAdmin = req.user && req.user.role === 'admin';
    const query = isAdmin ? {} : { isActive: true };
    const tests = await Test.find(query).populate('chapter', 'title').sort({ createdAt: -1 });

    if (!isAdmin) {
      const sanitizedTests = tests.map(test => {
        const testObj = test.toObject();
        if (!req.user) {
          testObj.questionCount = testObj.questions ? testObj.questions.length : 0;
          delete testObj.questions;
        } else {
          testObj.questions = testObj.questions.map(q => {
            const { correctOption, ...qWithoutAnswer } = q;
            return qWithoutAnswer;
          });
        }
        return testObj;
      });
      return res.json(sanitizedTests);
    }

    res.json(tests);
  } catch (error) {
    next(error);
  }
};

exports.getTestsByChapter = async (req, res, next) => {
  try {
    const query = { chapter: req.params.chapterId };
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin) {
      query.isActive = true;
    }

    const tests = await Test.find(query).sort({ createdAt: -1 });

    if (!isAdmin) {
      const sanitizedTests = tests.map(test => {
        const testObj = test.toObject();
        if (!req.user) {
          testObj.questionCount = testObj.questions ? testObj.questions.length : 0;
          delete testObj.questions;
        } else {
          testObj.questions = testObj.questions.map(q => {
            const { correctOption, ...qWithoutAnswer } = q;
            return qWithoutAnswer;
          });
        }
        return testObj;
      });
      return res.json(sanitizedTests);
    }

    res.json(tests);
  } catch (error) {
    next(error);
  }
};

exports.getTestById = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id).populate('chapter', 'title');
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    if (req.user.role !== 'admin') {
      if (!test.isActive) {
        return res.status(403).json({ message: 'Test is not active' });
      }

      const testObj = test.toObject();
      testObj.questions = testObj.questions.map(q => {
        const { correctOption, ...qWithoutAnswer } = q;
        return qWithoutAnswer;
      });
      return res.json(testObj);
    }

    res.json(test);
  } catch (error) {
    next(error);
  }
};

exports.createTest = async (req, res, next) => {
  try {
    const { title, description, chapter, duration, totalMarks, questions, isActive } = req.body;

    const test = await Test.create({
      title,
      description,
      chapter,
      duration,
      totalMarks,
      questions,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user.id
    });

    res.status(201).json(test);
  } catch (error) {
    next(error);
  }
};

exports.updateTest = async (req, res, next) => {
  try {
    const { title, description, duration, totalMarks, questions, isActive } = req.body;
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    if (title) test.title = title;
    if (description !== undefined) test.description = description;
    if (duration !== undefined) test.duration = duration;
    if (totalMarks !== undefined) test.totalMarks = totalMarks;
    if (questions) test.questions = questions;
    if (isActive !== undefined) test.isActive = isActive;

    await test.save();
    res.json(test);
  } catch (error) {
    next(error);
  }
};

exports.deleteTest = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    await Test.findByIdAndDelete(req.params.id);
    const TestResult = require('../models/TestResult');
    await TestResult.deleteMany({ test: req.params.id });

    res.json({ message: 'Test and associated results deleted successfully' });
  } catch (error) {
    next(error);
  }
};
