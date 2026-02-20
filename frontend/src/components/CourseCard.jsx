import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, onEnroll, showEnroll = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300">
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-2 line-clamp-2">{course.description}</p>
        <p className="text-sm text-gray-500">Instructor: {course.instructor?.name || 'Unknown'}</p>
        <p className="text-sm text-gray-500">Price: ${course.price}</p>
        <div className="mt-4 flex justify-between">
          <Link to={`/course/${course._id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Details</Link>
          {showEnroll && (
            <button onClick={() => onEnroll(course._id)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">Enroll</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;