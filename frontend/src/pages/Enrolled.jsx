import React from 'react';
import { motion } from 'framer-motion';

const EnrolledCourses = () => {
  return (
    <div className="py-16">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
        Your Enrolled Courses
      </h1>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { staggerChildren: 0.2 } }}
      >
        {/* Similar to Courses cards, with progress bar */}
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Python Bootcamp</h3>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
            <motion.div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ duration: 1.5 }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">70% Complete</p>
        </motion.div>
        {/* Add more */}
      </motion.div>
    </div>
  );
};

export default EnrolledCourses;