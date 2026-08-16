const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, enum: ['pdf', 'image'], required: true },
  fileName: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', noteSchema);
