
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute     from './components/AdminRoute';
import AppLayout      from './components/layout/AppLayout';

import Landing         from './pages/Landing';
import Courses         from './pages/Courses';
import CourseDetails   from './pages/CourseDetails';
import CourseLecture   from './pages/CourseLecture';
import About           from './pages/About';
import Contact         from './pages/Contact';
import Faculty         from './pages/Faculty';
import Login           from './pages/Login';
import Register        from './pages/Register';
import Profile         from './pages/Profile';
import EnrolledCourses from './pages/EnrolledCourses';
import MyCourses       from './pages/MyCourses';
import Dashboard       from './pages/Dashboard';
import AdminPanel      from './pages/admin/AdminPanel';
import AddCourse       from './pages/admin/AddCourse';

// /dashboard pe admin aaye to /admin pe bhejo
function DashboardRedirect() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null; // wait karo
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/"           element={<AppLayout><Landing /></AppLayout>} />
          <Route path="/courses"    element={<AppLayout><Courses /></AppLayout>} />
          <Route path="/course/:id" element={<AppLayout><CourseDetails /></AppLayout>} />
          <Route path="/about"      element={<AppLayout><About /></AppLayout>} />
          <Route path="/contact"    element={<AppLayout><Contact /></AppLayout>} />
          <Route path="/faculty"    element={<AppLayout><Faculty /></AppLayout>} />

          {/* Auth */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard — admin ko /admin redirect, student ko dashboard */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Student */}
          <Route path="/profile" element={
            <ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>
          } />
          <Route path="/enrolled" element={
            <ProtectedRoute><AppLayout><EnrolledCourses /></AppLayout></ProtectedRoute>
          } />
          <Route path="/my-courses" element={
            <ProtectedRoute><AppLayout><MyCourses /></AppLayout></ProtectedRoute>
          } />
          <Route path="/course/:id/lecture/:lectureId?" element={
            <ProtectedRoute><CourseLecture /></ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin/*"        element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/admin/add-course" element={<AdminRoute><AddCourse /></AdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
