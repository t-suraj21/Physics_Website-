const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  completedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
  completedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  submittedAssignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
  completedTests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }],
  percentage: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

progressSchema.index({ student: 1, chapter: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
