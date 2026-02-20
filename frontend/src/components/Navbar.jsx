import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="text-white font-bold text-xl">
                EduNova LMS
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                {user.role === 'student' && (
                  <>
                    <Link to="/courses" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                      All Courses
                    </Link>
                    <Link to="/enrolled-courses" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                      My Enrollments
                    </Link>
                  </>
                )}

                {user.role === 'instructor' && (
                  <>
                    <Link to="/my-courses" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                      My Courses
                    </Link>
                    <Link to="/create-course" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                      Create Course
                    </Link>
                  </>
                )}

                {user.role === 'admin' && (
                  <Link to="/admin/users" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                    Manage Users
                  </Link>
                )}

                <Link to="/profile" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                  Profile
                </Link>

                <button
                  onClick={logout}
                  className="text-white hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;