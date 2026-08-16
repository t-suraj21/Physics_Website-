const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true },
  marks: { type: Number, default: 1 }
});

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  duration: { type: Number, required: true }, // in minutes
  totalMarks: { type: Number, required: true },
  questions: [questionSchema],
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', testSchema);
