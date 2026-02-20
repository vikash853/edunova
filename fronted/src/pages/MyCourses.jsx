import React, { useState, useEffect } from 'react';
import api from '../api';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await api.get('/courses/my');
        setCourses(res.data);
      } catch (err) {
        alert('Load failed: ' + (err.response?.data?.message || 'Server error'));
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-center">My Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
      {courses.length === 0 && <p className="text-center text-gray-500 mt-4">No courses.</p>}
    </div>
  );
};

export default MyCourses;