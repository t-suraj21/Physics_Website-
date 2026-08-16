# ⚛️ Physics Academy — Premium Online Learning Platform

Physics Academy is a modern, concept-driven physics education web application. The platform provides students and teachers with interactive dashboards to manage video masterclasses, revision notes, homework assignments, real-time MCQ assessment tests, and detailed academic performance analytics.

---

## 🌟 Key Features

### 👨‍🎓 For Students
- **Course Syllabus**: Structured navigation of physics chapters (from Kinematics to Quantum Mechanics).
- **Revision Notes**: Instant access to booklets and formula sheets.
- **Video Masterclasses**: Topic lectures, derivations, and concept guides.
- **Assessment Tests**: Interactive, timed MCQ mock exams with automatic grading.
- **Homework Assignments**: File uploads for assignments and detailed feedback.
- **Student Dashboard**: Grade tracking, next deadline count, and course announcements.

### 👩‍🏫 For Teachers (Admin)
- **Manage Chapters**: Create, edit, and organize physics syllabus modules.
- **Manage Materials**: Upload and organize revision notes, assignments, and lectures.
- **Test Constructor**: Build MCQ exams with specific questions, timers, and marks.
- **Grading & Submissions**: View student homework uploads, grade them, and post feedback.
- **Analytics Dashboard**: Monitor student enrollments, exam average success rates, and homework completion progress.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Recharts, Lucide Icons
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Authentication
- **Assets**: Custom brand identity assets (logos, favicon)

---

## 📁 Repository Structure

```text
Physics Website/
├── backend/                  # Express REST API Server
│   ├── config/               # Database and configuration files
│   ├── controllers/          # Request handling logic
│   ├── middleware/           # Auth validation and uploads parser
│   ├── models/               # MongoDB schema models
│   ├── routes/               # API endpoints declaration
│   ├── server.js             # Entrypoint server script
│   └── package.json
│
├── frontend/                 # React SPA Client
│   ├── src/
│   │   ├── api/              # Axios client instance
│   │   ├── components/       # Common UI & Layout widgets
│   │   ├── context/          # Global Auth & Theme states
│   │   ├── layouts/          # Dashboard (Admin/Student) and Public layouts
│   │   ├── pages/            # View pages (Public, Student, Admin, Auth)
│   │   ├── main.jsx          # Entry point script
│   │   └── index.css         # Styling system
│   ├── public/               # Public assets (logo, favicon)
│   ├── index.html
│   └── package.json
└── README.md                 # Project Documentation
```

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (running locally or in the cloud)

### 1. Configuration Setup

#### Backend Environment Variables
Create a file named `.env` in the `backend/` directory:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/physics-academy
JWT_SECRET=your_jwt_signing_key_here
ADMIN_SECRET_KEY=your_teacher_registration_passphrase_here
NODE_ENV=development
```
> [!IMPORTANT]
> Keep the `JWT_SECRET` and `ADMIN_SECRET_KEY` secure. Never expose production values in repository code.

#### Frontend Environment Variables
Create a file named `.env` in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5001/api
PORT=8001
```

---

### 2. Installation & Running

#### Start Backend Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   npm start
   ```
   *The server runs by default on `http://localhost:5001`.*

#### Start Frontend Dev Client
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   *The Vite application runs on `http://localhost:8001` or `http://localhost:5173`.*

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
