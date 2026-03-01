import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import CourseCard from '../components/CourseCard'; // Assuming this is your polished card
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/common/Button';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, AlertCircle } from 'lucide-react';

const EnrolledCourses = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchEnrolled = async () => {
      try {
        const res = await api.get('/enrollments/my');
        // Map to get course objects from enrollments
        const enrolledCourses = res.data.map(enrollment => enrollment.course);
        setCourses(enrolledCourses);
      } catch (err) {
        console.error('Failed to load enrolled courses:', err);
        setError(err.response?.data?.message || 'Failed to load your courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolled();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
        <AlertCircle size={64} className="text-red-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
          {error}
        </p>
        <Button
          variant="primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Your Enrolled Courses
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Continue learning and track your progress
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl">
            <BookOpen size={64} className="mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              No courses enrolled yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start exploring our courses and enroll in something exciting today!
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/courses')}
            >
              Browse Courses
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course._id} className="relative">
                {/* Use your polished CourseCard */}
                <CourseCard course={course} enrolledMode={true} />

                {/* Continue Learning button overlay or inside card */}
                <div className="absolute bottom-6 left-6 right-6">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate(`/course/${course._id}`)}
                    className="shadow-lg hover:shadow-indigo-500/40"
                  >
                    Continue Learning →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;