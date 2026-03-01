import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Skeleton from '../components/common/Skeleton';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { Star, Clock, BookOpen, Search, X, Filter, SlidersHorizontal } from 'lucide-react';

const Courses = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [enrollError, setEnrollError] = useState(null);

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['All', 'Web Development', 'AI & ML', 'UI/UX Design', 'Python', 'Data Science', 'Mobile Dev', 'DevOps'];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data);
        setFilteredCourses(res.data);
      } catch (err) {
        console.error('Courses load failed:', err);
        setEnrollError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter & sort logic
  useEffect(() => {
    let result = [...courses];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(course =>
        course.title?.toLowerCase().includes(term) ||
        course.description?.toLowerCase().includes(term) ||
        course.instructor?.name?.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(course => course.category === selectedCategory);
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    setFilteredCourses(result);
  }, [searchTerm, selectedCategory, sortBy, courses]);

  const handleEnroll = async (courseId, e) => {
    e.stopPropagation();

    if (!user) {
      alert('Please login to enroll');
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      alert('Only students can enroll in courses');
      return;
    }

    setEnrollingId(courseId);
    setEnrollError(null);

    try {
      await api.post(`/enrollments/${courseId}`);
      alert('Successfully enrolled! Redirecting...');
      navigate(`/course/${courseId}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Enrollment failed. Try again.';
      console.error('Enroll error:', err);
      setEnrollError(msg);
      alert(msg);
    } finally {
      setEnrollingId(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('newest');
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.92 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.06,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-indigo-50/30 to-white dark:from-gray-950 dark:via-indigo-950/20 dark:to-gray-950 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      {/* Header + Filters */}
      <div className="max-w-7xl mx-auto mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 text-center"
        >
          Discover Your Next Skill
        </motion.h1>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mt-8">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Category & Sort */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {(searchTerm || selectedCategory !== 'All' || sortBy !== 'newest') && (
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1"
              >
                <X size={16} /> Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[520px] rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 max-w-2xl mx-auto"
        >
          <Search size={64} className="mx-auto text-gray-400 mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            No courses found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Try adjusting your search or filters
          </p>
          <Button variant="primary" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {filteredCourses.map((course, index) => {
            const isFree = course.price === 0 || course.price === undefined;
            const isEnrolling = enrollingId === course._id;

            return (
              <motion.div
                key={course._id}
                custom={index}
                variants={{
                  hidden: { opacity: 0, y: 60, scale: 0.92 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      delay: index * 0.06,
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
                whileHover={{ scale: 1.04, y: -12 }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/40"
              >
                {/* Image + overlay */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={course.image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800'}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Free badge */}
                  {isFree && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg transform group-hover:scale-110 transition-transform">
                      Free
                    </div>
                  )}

                  {/* Featured badge (example) */}
                  {course.featured && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center gap-6 mb-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} />
                      {course.duration || '12h'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen size={16} />
                      {course.lessons || '45 lessons'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      {course.rating || '4.8'}
                    </div>
                  </div>

                  {/* Price + Enroll */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {isFree ? 'Free' : `₹${course.price || 0}`}
                    </span>

                    <Button
                      size="md"
                      disabled={isEnrolling}
                      onClick={(e) => handleEnroll(course._id, e)}
                      className={`min-w-[160px] text-base font-semibold transition-all duration-300 ${
                        isEnrolling
                          ? 'opacity-70 cursor-wait scale-95'
                          : 'hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/40 active:scale-95'
                      }`}
                    >
                      {isEnrolling ? 'Enrolling...' : isFree ? 'Start Free' : 'Enroll Now'}
                    </Button>
                  </div>

                  {enrollError && enrollingId === course._id && (
                    <p className="mt-4 text-sm text-red-600 dark:text-red-400 text-center">
                      {enrollError}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default Courses;