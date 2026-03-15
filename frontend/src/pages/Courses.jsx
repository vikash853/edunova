import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import api from '../api';
import { Search, X } from 'lucide-react';
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
        const data = res.data || [];
        console.log('Courses fetched:', data.length);
        setCourses(data);
        setFilteredCourses(data);
      } catch (err) {
        console.error('Courses load failed:', err);
        setError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let result = [...courses];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(course =>
        course.title?.toLowerCase().includes(term) ||
        course.description?.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(course => course.category === selectedCategory);
    }

    result = result.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      if (sortBy === 'newest') return dateB - dateA;
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-8 md:mb-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Discover Your Next Skill
        </h1>

        {/* Filters - Mobile friendly */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8 md:mb-12">
          {/* Search */}
          <div className="relative w-full md:w-80 lg:w-96">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={18} />
              </button>
            )}
          </div>

          {/* Category buttons - scrollable on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-auto px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price Low to High</option>
            <option value="price-high">Price High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          {/* Clear */}
          {(searchTerm || selectedCategory !== 'All' || sortBy !== 'newest') && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="w-full md:w-auto text-sm">
              Clear Filters
            </Button>
          )}
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[460px] rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-600 text-xl">{error}</div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 px-4">
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              No courses found
            </p>
            <Button variant="primary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
