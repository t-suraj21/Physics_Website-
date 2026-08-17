const Note = require('../models/Note');
const fs = require('fs');
const path = require('path');

const getFileUrl = (req, file) => {
  if (!file) return '';
  if (file.path.startsWith('http://') || file.path.startsWith('https://')) {
    return file.path;
  }
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/uploads/${file.filename}`;
};

exports.getNotesByChapter = async (req, res, next) => {
  try {
    const notes = await Note.find({ chapter: req.params.chapterId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

exports.uploadNote = async (req, res, next) => {
  try {
    const { title, description, chapter } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = getFileUrl(req, req.file);
    const fileName = req.file.originalname;
    const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'pdf';

    const note = await Note.create({
      title,
      description,
      chapter,
      fileUrl,
      fileType,
      fileName,
      uploadedBy: req.user.id
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Delete local file if it exists
    if (note.fileUrl && !note.fileUrl.includes('cloudinary.com')) {
      try {
        const parts = note.fileUrl.split('/uploads/');
        if (parts.length > 1) {
          const filename = parts[1];
          const filepath = path.join(__dirname, '../uploads', filename);
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
          }
        }
      } catch (err) {
        console.error('Failed to delete local file on note deletion:', err);
      }
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find()
      .populate('chapter', 'title order')
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

