require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const noteRoutes = require('./routes/noteRoutes');
const videoRoutes = require('./routes/videoRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const testRoutes = require('./routes/testRoutes');
const testResultRoutes = require('./routes/testResultRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const studentRoutes = require('./routes/studentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const progressRoutes = require('./routes/progressRoutes');

const app = express();

connectDB();

const User = require('./models/User');
const seedChapters = require('./utils/seedChapters');
const runSeeder = async () => {
  try {
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      await seedChapters(admin._id);
    } else {
      console.log('No admin user found yet. Chapters will be seeded when the first admin registers.');
    }
  } catch (err) {
    console.error('Error running seeder on startup:', err);
  }
};
// runSeeder();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/results', testResultRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/progress', progressRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Physics Academy API' });
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'API Route Not Found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
