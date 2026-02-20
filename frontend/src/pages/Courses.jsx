import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data);
      } catch (err) {
        alert('Failed to load courses: ' + (err.response?.data?.message || 'Server error'));
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/enrollments/${courseId}`);
      alert('Enrolled!');
    } catch (err) {
      alert('Enrollment failed: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  const filteredCourses = courses.filter(course => course.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-center">Courses</h2>
      <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full max-w-md mx-auto p-3 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <CourseCard key={course._id} course={course} onEnroll={handleEnroll} showEnroll={user.role === 'student'} />
        ))}
      </div>
      {filteredCourses.length === 0 && <p className="text-center text-gray-500 mt-4">No courses.</p>}
    </div>
  );
};

export default Courses;