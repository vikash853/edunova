import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, BookOpen, Users, Tag as TagIcon } from 'lucide-react';
import Button from '../components/common/Button';

const CourseCard = ({ course }) => {
  const [hover, setHover] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef(null);

  const rating = course.rating || 4.8;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative bg-white dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/40"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.03, y: -8 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Spotlight hover effect */}
      {hover && (
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-60 transition-opacity"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(99,102,241,0.15) 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Gradient border glow on hover */}
      <div
        className={`absolute inset-0 rounded-3xl pointer-events-none transition-all duration-500 ${
          hover ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
        }`}
        style={{
          background: 'linear-gradient(45deg, #6366f1, #a78bfa, #c084fc)',
          filter: 'blur(8px)',
          zIndex: -1,
        }}
      />

      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={course.image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800'}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Price Badge */}
        <div className="absolute top-4 right-4 px-4 py-2 rounded-full font-bold text-white shadow-lg transform group-hover:scale-110 transition-transform"
          style={{
            background: course.price === 0 ? 'linear-gradient(135deg, #10b981, #34d399)' : 'linear-gradient(135deg, #6366f1, #a78bfa)',
          }}
        >
          {course.price === 0 ? 'Free' : `₹${course.price}`}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
          {course.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500/30">
            <img
              src={course.instructor?.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
              alt={course.instructor?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {course.instructor?.name || 'Expert Instructor'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {course.level || 'Intermediate'}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={`${
                i < fullStars
                  ? 'text-yellow-400 fill-current'
                  : i === fullStars && hasHalfStar
                  ? 'text-yellow-400 fill-current opacity-50'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
          <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            {rating} ({course.students || '1.2k'} students)
          </span>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Clock size={16} />
            {course.duration || '12h 30m'}
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen size={16} />
            {course.lessons || '45'} lessons
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={16} />
            {course.enrolled || '3.4k'} enrolled
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {(course.tags || ['Bestseller', 'New', 'Job Ready']).map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-500/30 flex items-center gap-1"
            >
              <TagIcon size={12} />
              {tag}
            </span>
          ))}
        </div>

        {/* Enroll Button */}
        <div className="pt-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full text-base font-semibold shadow-lg hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            onClick={() => {/* handle enroll */}}
          >
            Enroll Now →
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;