import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 filter blur-3xl" />

      {/* Creative Animated Orbs */}
      <motion.div
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-400/20 rounded-full blur-[100px] dark:bg-indigo-500/10"
        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.5, 0.8] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] dark:bg-purple-500/10"
        animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.6, 0.8] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="relative z-10 text-center max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-8xl font-extrabold leading-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          Ignite Your Learning Journey
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-8 text-xl md:text-3xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
        >
          Discover world-class courses, master new skills, and achieve your goals with EduNova — the platform trusted by thousands.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12 flex flex-col md:flex-row justify-center gap-6"
        >
          <Link to="/courses">
            <Button variant="primary" size="lg" className="w-full md:w-auto">
              Explore Courses
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary" size="lg" className="w-full md:w-auto">
              Join for Free
            </Button>
          </Link>
        </motion.div>

        {/* Trust Bar – Inspired by Edtech Sites */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 text-gray-600 dark:text-gray-400"
        >
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">10K+</div>
            <p className="mt-2 text-lg">Learners</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">500+</div>
            <p className="mt-2 text-lg">Courses</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">4.9/5</div>
            <p className="mt-2 text-lg">Average Rating</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;