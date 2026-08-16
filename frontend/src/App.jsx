import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminRegister from './pages/auth/AdminRegister';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';
import PublicLayout from './layouts/PublicLayout';

// Public Pages
import AboutTeacher from './pages/public/AboutTeacher';
import PublicChapters from './pages/public/PublicChapters';
import PublicNotes from './pages/public/PublicNotes';
import PublicVideos from './pages/public/PublicVideos';
import PublicAssignments from './pages/public/PublicAssignments';
import PublicTests from './pages/public/PublicTests';
import Contact from './pages/public/Contact';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageChapters from './pages/admin/ManageChapters';
import ManageNotes from './pages/admin/ManageNotes';
import ManageVideos from './pages/admin/ManageVideos';
import ManageAssignments from './pages/admin/ManageAssignments';
import ViewSubmissions from './pages/admin/ViewSubmissions';
import ManageTests from './pages/admin/ManageTests';
import ViewResults from './pages/admin/ViewResults';
import ManageStudents from './pages/admin/ManageStudents';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import Chapters from './pages/student/Chapters';
import ChapterDetail from './pages/student/ChapterDetail';
import Notes from './pages/student/Notes';
import AssignmentsList from './pages/student/AssignmentsList';
import TestsList from './pages/student/TestsList';
import TakeTest from './pages/student/TakeTest';
import Results from './pages/student/Results';
import Announcements from './pages/student/Announcements';
import Profile from './pages/student/Profile';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Redirects to Login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/home" element={<Navigate to="/login" replace />} />

            {/* Public Layout & Landing Pages */}
            <Route element={<PublicLayout />}>
              <Route path="/about" element={<AboutTeacher />} />
              <Route path="/syllabus" element={<PublicChapters />} />
              <Route path="/notes" element={<PublicNotes />} />
              <Route path="/videos" element={<PublicVideos />} />
              <Route path="/assignments-preview" element={<PublicAssignments />} />
              <Route path="/tests-preview" element={<PublicTests />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/register" element={<AdminRegister />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="chapters" element={<ManageChapters />} />
              <Route path="notes" element={<ManageNotes />} />
              <Route path="videos" element={<ManageVideos />} />
              <Route path="assignments" element={<ManageAssignments />} />
              <Route path="submissions" element={<ViewSubmissions />} />
              <Route path="tests" element={<ManageTests />} />
              <Route path="results" element={<ViewResults />} />
              <Route path="students" element={<ManageStudents />} />
              <Route path="announcements" element={<ManageAnnouncements />} />
            </Route>

            {/* Student Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/chapters" element={<Chapters />} />
              <Route path="/chapters/:id" element={<ChapterDetail />} />
              <Route path="/study-notes" element={<Notes />} />
              <Route path="/assignments" element={<AssignmentsList />} />
              <Route path="/tests" element={<TestsList />} />
              <Route path="/tests/take/:id" element={<TakeTest />} />
              <Route path="/results" element={<Results />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;
