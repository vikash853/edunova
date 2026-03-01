import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { BookOpen, Award, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fake weekly data (replace with real API later)
  const weeklyData = [
    { day: 'Mon', hours: 2 },
    { day: 'Tue', hours: 3 },
    { day: 'Wed', hours: 1 },
    { day: 'Thu', hours: 4 },
    { day: 'Fri', hours: 2 },
    { day: 'Sat', hours: 5 },
    { day: 'Sun', hours: 3 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/enrollments/my');
        setEnrolledCourses(res.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-600 text-center py-10 text-xl">{error}</p>;

  const completedCount = enrolledCourses.filter(c => c.progress === 100).length;
  const totalProgress = enrolledCourses.length
    ? Math.round(enrolledCourses.reduce((sum, c) => sum + (c.progress || 0), 0) / enrolledCourses.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, {user?.name?.split(' ')[0] || 'Learner'}!
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Continue your learning journey • {enrolledCourses.length} active courses
          </p>
        </motion.div>

        {/* Admin Quick Actions - only for admins */}
        {user?.role === 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 p-8 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-3xl border border-indigo-500/20 shadow-xl text-center"
          >
            <h2 className="text-2xl font-bold mb-6 text-indigo-700 dark:text-indigo-300">
              Admin Quick Actions
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/admin/add-course')}
                className="bg-indigo-600 hover:bg-indigo-700 px-10 py-4 shadow-lg"
              >
                Add New Course
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/admin/users')}
                className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-10 py-4"
              >
                Manage Users
              </Button>
            </div>
          </motion.div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
            <p className="text-5xl font-bold text-indigo-600">{enrolledCourses.length}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">Enrolled Courses</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
            <p className="text-5xl font-bold text-purple-600">{completedCount}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">Completed</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
            <p className="text-5xl font-bold text-pink-600">{totalProgress}%</p>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">Overall Progress</p>
          </div>
        </div>

        {/* Weekly Learning Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-6">Weekly Learning Hours</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Enrolled Courses Grid */}
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl">
            <BookOpen size={64} className="mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              No courses enrolled yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start exploring and enroll in something exciting today!
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/courses')}
            >
              Browse Courses Now
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCourses.map((enroll) => {
              const course = enroll.course;
              const progress = enroll.progress || 0;

              return (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all"
                >
                  <div className="relative h-48">
                    <img
                      src={course.image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800'}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white line-clamp-2">{course.title}</h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Link
                        to={`/course/${course._id}`}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                      >
                        View Details
                      </Link>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/course/${course._id}`)}
                      >
                        Continue Learning
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;