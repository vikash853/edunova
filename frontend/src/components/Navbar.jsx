import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import Button from './common/Button';
import { Menu, X, User, LogOut, ChevronDown, BookOpen, LayoutDashboard, PlusCircle, Users } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDark = () => setDarkMode(!darkMode);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-[9999] backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            EduNova
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/courses" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Courses
            </Link>
            <Link to="/faculty" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Faculty
            </Link>
            <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              About
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                    {user.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                          onClick={() => setProfileOpen(false)}
                        >
                          <LayoutDashboard size={18} className="mr-3" />
                          Dashboard
                        </Link>

                        <Link
                          to="/enrolled"
                          className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                          onClick={() => setProfileOpen(false)}
                        >
                          <BookOpen size={18} className="mr-3" />
                          My Courses
                        </Link>

                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                          onClick={() => setProfileOpen(false)}
                        >
                          <User size={18} className="mr-3" />
                          Profile
                        </Link>

                        {/* Admin-only links */}
                        {user?.role === 'admin' && (
                          <>
                            <Link
                              to="/admin/add-course"
                              className="flex items-center px-4 py-3 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 font-medium"
                              onClick={() => setProfileOpen(false)}
                            >
                              <PlusCircle size={18} className="mr-3" />
                              Add New Course
                            </Link>

                            <Link
                              to="/admin/users"
                              className="flex items-center px-4 py-3 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 font-medium"
                              onClick={() => setProfileOpen(false)}
                            >
                              <Users size={18} className="mr-3" />
                              Manage Users
                            </Link>
                          </>
                        )}

                        <button
                          onClick={() => { logout(); setProfileOpen(false); }}
                          className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                        >
                          <LogOut size={18} className="mr-3" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Login
                </Link>
                <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden p-2 text-gray-700 dark:text-gray-300" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-5">
              <Link to="/courses" className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600" onClick={() => setMobileOpen(false)}>
                Courses
              </Link>
              <Link to="/faculty" className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600" onClick={() => setMobileOpen(false)}>
                Faculty
              </Link>
              <Link to="/about" className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600" onClick={() => setMobileOpen(false)}>
                About
              </Link>

              {user ? (
                <>
                  <Link to="/dashboard" className="block text-gray-700 dark:text-gray-300" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/enrolled" className="block text-gray-700 dark:text-gray-300" onClick={() => setMobileOpen(false)}>
                    My Courses
                  </Link>
                  <Link to="/profile" className="block text-gray-700 dark:text-gray-300" onClick={() => setMobileOpen(false)}>
                    Profile
                  </Link>

                  {/* Mobile Admin Links */}
                  {user.role === 'admin' && (
                    <>
                      <Link to="/admin/add-course" className="block text-indigo-600" onClick={() => setMobileOpen(false)}>
                        Add New Course
                      </Link>
                      <Link to="/admin/users" className="block text-indigo-600" onClick={() => setMobileOpen(false)}>
                        Manage Users
                      </Link>
                    </>
                  )}

                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="block text-red-600 w-full text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block text-gray-700 dark:text-gray-300" onClick={() => setMobileOpen(false)}>
                    Login
                  </Link>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => { navigate('/register'); setMobileOpen(false); }}
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;