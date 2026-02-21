import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/common/Button';  // ← THIS WAS MISSING – now added

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  // Dark mode state (saved in localStorage)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  // Apply dark mode on mount & when changed
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav className="bg-indigo-700 dark:bg-gray-900 text-white shadow-lg transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            EduNova
          </Link>

          {/* Links + Toggle */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="hover:text-indigo-200 transition">
              Home
            </Link>
            <Link to="/courses" className="hover:text-indigo-200 transition">
              Courses
            </Link>

            {user ? (
              <>
                <Link to="/enrolled" className="hover:text-indigo-200 transition">
                  Enrolled
                </Link>
                <Link to="/dashboard" className="hover:text-indigo-200 transition">
                  Dashboard
                </Link>
                <Link to="/profile" className="hover:text-indigo-200 transition">
                  Profile
                </Link>

                {/* Use the imported Button for Logout */}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-indigo-200 transition">
                  Login
                </Link>

                {/* Use Button for Register */}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => window.location.href = '/register'}
                >
                  Register
                </Button>
              </>
            )}

            {/* Dark/Light Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-indigo-600 dark:hover:bg-gray-700 transition"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                // Sun icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                // Moon icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;