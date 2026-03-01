// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import CourseLecture from './pages/CourseLecture';  // adjust path if different
// Pages (all connected now)
import Landing from './pages/Landing'; // Use as "/" (fancy home)
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Faculty from './pages/Faculty';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EnrolledCourses from './pages/EnrolledCourses';
import CreateCourse from './pages/CreateCourse'; // Added route
import MyCourses from './pages/MyCourses'; // Added route
import AdminUsers from './pages/AdminUsers'; // Added route
import Login from './pages/Login';
import Register from './pages/Register';
import AddCourse from './pages/admin/AddCourse';   

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Pages - With Full Layout (Navbar + Footer) */}
          <Route path="/" element={<AppLayout><Landing /></AppLayout>} />
          <Route
              path="/course/:id/lecture/:lectureId?"
              element={
                <ProtectedRoute>
                  <CourseLecture />
                </ProtectedRoute>
              }
            />
          <Route path="/courses" element={<AppLayout><Courses /></AppLayout>} />
          <Route path="/course/:id" element={<AppLayout><CourseDetails /></AppLayout>} />
          <Route path="/admin/add-course" element={<ProtectedRoute><AddCourse /></ProtectedRoute>} />
          <Route path="/about" element={<AppLayout><About /></AppLayout>} />
          <Route path="/contact" element={<AppLayout><Contact /></AppLayout>} />
          <Route path="/faculty" element={<AppLayout><Faculty /></AppLayout>} />
              
          {/* Auth Pages - Clean (No Layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Pages - With Layout + Role Checks Inside Components */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>}
          />
          <Route
            path="/enrolled"
            element={<ProtectedRoute><AppLayout><EnrolledCourses /></AppLayout></ProtectedRoute>}
          />
          <Route
            path="/create-course"
            element={<ProtectedRoute><AppLayout><CreateCourse /></AppLayout></ProtectedRoute>}
          />
          <Route
            path="/my-courses"
            element={<ProtectedRoute><AppLayout><MyCourses /></AppLayout></ProtectedRoute>}
          />
          <Route
  path="/course/:id/lecture/:lectureId?"
  element={<CourseLecture />}
/>
          <Route
            path="/admin-users"
            element={<ProtectedRoute><AppLayout><AdminUsers /></AppLayout></ProtectedRoute>}
          />

          {/* Fallback - Redirect Unknown */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;