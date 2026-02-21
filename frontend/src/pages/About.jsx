import React from 'react';

const About = () => {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-10 text-indigo-700 dark:text-indigo-300">
        About EduNova LMS
      </h1>

      <div className="prose dark:prose-invert max-w-none text-lg text-gray-700 dark:text-gray-300 space-y-6">
        <p>
          EduNova is a modern, user-friendly Learning Management System built to make education accessible to everyone.
          Whether you're a student looking to learn new skills, an instructor sharing knowledge, or just exploring topics,
          EduNova provides a clean and intuitive platform for online learning.
        </p>

        <p>
          Our mission is simple: <strong>Empower learners and educators</strong> with high-quality courses,
          interactive discussions, flexible scheduling, and a supportive community.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-600 dark:text-indigo-400">
          What We Offer
        </h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>Wide range of courses across programming, design, business, and more</li>
          <li>Role-based access: Students, Instructors, and Admins</li>
          <li>Course enrollment, progress tracking, and certificates</li>
          <li>Interactive comments and discussions</li>
          <li>Beautiful, responsive design that works on mobile and desktop</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-600 dark:text-indigo-400">
          Our Team
        </h2>
        <p>
          EduNova was created by passionate developers and educators who believe learning should be enjoyable and effective.
          We're constantly improving the platform based on user feedback.
        </p>

        <p className="mt-8 text-center text-xl font-medium">
          Thank you for being part of the EduNova community! 📚✨
        </p>
      </div>
    </div>
  );
};

export default About;