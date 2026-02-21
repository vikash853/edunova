import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-indigo-700 mb-6">
        Welcome to EduNova LMS
      </h1>
      <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10">
        Learn from the best instructors. Explore hundreds of courses. Grow your skills at your own pace.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <Link
          to="/courses"
          className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-md"
        >
          Browse Courses
        </Link>
        <Link
          to="/register"
          className="bg-white text-indigo-700 border-2 border-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition shadow-md"
        >
          Get Started
        </Link>
      </div>

      {/* Features */}
      <div className="mt-20 grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
        <div className="p-8 bg-white rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-indigo-700 mb-4">Expert Instructors</h3>
          <p className="text-gray-600">Learn from industry professionals with real-world experience.</p>
        </div>
        <div className="p-8 bg-white rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-indigo-700 mb-4">Flexible Learning</h3>
          <p className="text-gray-600">Study anytime, anywhere — on your schedule.</p>
        </div>
        <div className="p-8 bg-white rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-indigo-700 mb-4">Certificates</h3>
          <p className="text-gray-600">Earn certificates to showcase your achievements.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;