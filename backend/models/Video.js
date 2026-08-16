const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  youtubeUrl: { type: String, required: true },
  duration: { type: String, default: '' },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);
