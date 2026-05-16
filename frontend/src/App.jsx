// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute     from './components/AdminRoute';       // ← NEW: strict admin guard
import AppLayout from './components/layout/AppLayout';

// Pages
import Landing        from './pages/Landing';
import Courses        from './pages/Courses';
import CourseDetails  from './pages/CourseDetails';
import CourseLecture  from './pages/CourseLecture';
import About          from './pages/About';
import Contact        from './pages/Contact';
import Faculty        from './pages/Faculty';
import Login          from './pages/Login';
import Register       from './pages/Register';
import Profile        from './pages/Profile';
import EnrolledCourses from './pages/EnrolledCourses';
import MyCourses      from './pages/MyCourses';

// Student Dashboard (improved)
import StudentDashboard from './pages/StudentDashboard';

// Admin — completely separate panel, no AppLayout
import AdminPanel from './pages/admin/AdminPanel';
import AddCourse  from './pages/admin/AddCourse';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          {/* ── PUBLIC ────────────────────────────────────── */}
          <Route path="/"        element={<AppLayout><Landing /></AppLayout>} />
          <Route path="/courses" element={<AppLayout><Courses /></AppLayout>} />
          <Route path="/course/:id" element={<AppLayout><CourseDetails /></AppLayout>} />
          <Route path="/about"   element={<AppLayout><About /></AppLayout>} />
          <Route path="/contact" element={<AppLayout><Contact /></AppLayout>} />
          <Route path="/faculty" element={<AppLayout><Faculty /></AppLayout>} />

          {/* ── AUTH ──────────────────────────────────────── */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── STUDENT (protected) ───────────────────────── */}
          <Route path="/dashboard" element={
            <ProtectedRoute><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>
          } />
          <Route path="/enrolled" element={
            <ProtectedRoute><AppLayout><EnrolledCourses /></AppLayout></ProtectedRoute>
          } />
          <Route path="/my-courses" element={
            <ProtectedRoute><AppLayout><MyCourses /></AppLayout></ProtectedRoute>
          } />

          {/* Course lecture — no AppLayout (fullscreen player) */}
          <Route path="/course/:id/lecture/:lectureId?" element={
            <ProtectedRoute><CourseLecture /></ProtectedRoute>
          } />

          {/* ── ADMIN (strict — only admin role) ──────────── */}
          {/*
              AdminPanel handles its own sub-routes internally via nested <Routes>:
                /admin            → Overview
                /admin/courses    → Course list + delete
                /admin/users      → User management + role change
                /admin/analytics  → Charts & stats
          */}
          <Route path="/admin/*" element={
            <AdminRoute><AdminPanel /></AdminRoute>
          } />

          {/* Add course — standalone page (no AppLayout) */}
          <Route path="/admin/add-course" element={
            <AdminRoute><AddCourse /></AdminRoute>
          } />

          {/* ── FALLBACK ──────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
