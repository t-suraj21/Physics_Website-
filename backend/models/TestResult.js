const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ type: Number }],
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  percentage: { type: Number, required: true },
  timeTaken: { type: Number, required: true }, // in seconds
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestResult', testResultSchema);
