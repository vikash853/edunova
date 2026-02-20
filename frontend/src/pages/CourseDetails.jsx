import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        alert('Load failed: ' + (err.response?.data?.message || 'Server error'));
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!course) return <p className="text-center text-red-500">Not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-4">{course.title}</h2>
      <p className="text-gray-600 mb-4">{course.description}</p>
      <p className="text-sm text-gray-500 mb-2">Price: ${course.price}</p>
      <p className="text-sm text-gray-500 mb-6">Instructor: {course.instructor.name}</p>
      {user.role === 'instructor' && course.students && (
        <div>
          <h3 className="text-2xl font-bold mb-4">Students</h3>
          <ul className="list-disc pl-6">
            {course.students.map(student => (
              <li key={student._id}>{student.name} ({student.email})</li>
            ))}
          </ul>
          {course.students.length === 0 && <p>No students.</p>}
        </div>
      )}
    </div>
  );
};

export default CourseDetails;