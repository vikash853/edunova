import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import api from '../api';
import { Star, Clock, BookOpen, Search, X, SlidersHorizontal } from 'lucide-react';
import Button from '../components/common/Button';
import Skeleton from '../components/common/Skeleton';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    'All', 'Web Development', 'AI & ML', 'UI/UX Design', 'Python',
    'Data Science', 'Mobile Dev', 'DevOps & Cloud', 'Cybersecurity',
    'Blockchain', 'Others'
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        console.log('Courses fetched:', res.data.length, 'courses');
        setCourses(res.data || []);
        setFilteredCourses(res.data || []);
      } catch (err) {
        console.error('Courses load failed:', err);
        setError(err.response?.data?.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter + Sort logic
  useEffect(() => {
    let result = [...courses];

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(course =>
        course.title?.toLowerCase().includes(term) ||
        course.description?.toLowerCase().includes(term) ||
        course.instructor?.name?.toLowerCase().includes(term)
      );
    }

    // Category
    if (selectedCategory !== 'All') {
      result = result.filter(course => course.category === selectedCategory);
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

    setFilteredCourses(result);
  }, [searchTerm, selectedCategory, sortBy, courses]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-indigo-50/30 to-white dark:from-gray-950 dark:via-indigo-950/20 dark:to-gray-950">
      {/* Header + Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 text-center">
          Discover Your Next Skill
        </h1>

        {/* Filters - Responsive */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-10">
          {/* Search */}
          <div className="relative w-full sm:w-80 md:w-96">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-base"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Category buttons - horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full sm:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          {/* Clear filters button */}
          {(searchTerm || selectedCategory !== 'All' || sortBy !== 'newest') && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="w-full sm:w-auto text-sm"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[480px] sm:h-[520px] rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="max-w-2xl mx-auto text-center py-20 px-4">
          <Search size={64} className="mx-auto text-gray-400 mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            No courses found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-base sm:text-lg">
            Try adjusting your search or filters
          </p>
          <Button variant="primary" onClick={clearFilters} className="text-base">
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredCourses.map((course, index) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
