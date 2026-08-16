const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  order: { type: Number, required: true },
  icon: { type: String, default: '📚' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chapter', chapterSchema);
