import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Comments
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Quiz (mock)
  const [quizAnswers, setQuizAnswers] = useState({ q1: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course details
        const courseRes = await api.get(`/courses/${id}`);
        setCourse(courseRes.data);

        // Check if student is enrolled (only if student role)
        if (user?.role === 'student') {
          const enrollRes = await api.get('/enrollments/my');
          const enrolled = enrollRes.data.some(enroll => enroll.course._id === id);
          setIsEnrolled(enrolled);
        }

        // Fetch comments
        const commentsRes = await api.get(`/comments/${id}`);
        setComments(commentsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load course details');
        if (err.response?.status === 404) {
          navigate('/courses');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, navigate]);

  const handleEnroll = async () => {
    if (!user || user.role !== 'student') return;
    setEnrolling(true);
    try {
      await api.post(`/enrollments/${id}`);
      setIsEnrolled(true);
      alert('Successfully enrolled in the course!');
    } catch (err) {
      alert('Enrollment failed: ' + (err.response?.data?.message || 'Error'));
    } finally {
      setEnrolling(false);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      const res = await api.post(`/comments/${id}`, { text: newComment });
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (err) {
      alert('Failed to post comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleQuizChange = (e) => {
    setQuizAnswers({ ...quizAnswers, [e.target.name]: e.target.value });
  };

  const handleQuizSubmit = () => {
    // Mock submission
    alert('Quiz submitted! (This is a mock quiz)');
  };

  const copyCourseLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Course link copied to clipboard!');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-600 font-semibold py-10">{error}</p>;
  if (!course) return <p className="text-center text-gray-500 py-10">Course not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {course.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Instructor: <span className="font-medium">{course.instructor?.name || 'Unknown'}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-green-600 dark:text-green-400">
            ${course.price || 0}
          </span>

          {user?.role === 'student' && !isEnrolled && (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className={`px-6 py-3 rounded-lg font-semibold text-white transition ${
                enrolling
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 shadow-md'
              }`}
            >
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </button>
          )}

          {isEnrolled && (
            <span className="px-5 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full font-medium">
              Enrolled
            </span>
          )}

          <button
            onClick={copyCourseLink}
            className="p-2 text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="Share course"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367 2.684m0-6.368a3 3 0 10-5.367 2.684m6.632 3.316l-6.632 3.316" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="prose dark:prose-invert max-w-none mb-10">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {course.description}
        </p>
      </div>

      {/* Instructor-only: Enrolled Students */}
      {user?.role === 'instructor' && course?.students && (
        <div className="mb-12 bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Enrolled Students ({course.students.length})
          </h3>
          {course.students.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {course.students.map((student) => (
                <div
                  key={student._id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
                >
                  <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">No students enrolled yet.</p>
          )}
        </div>
      )}

      {/* Comments Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Discussion & Comments
        </h3>

        <div className="space-y-4 mb-8">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <p className="font-medium text-indigo-600 dark:text-indigo-400">
                  {comment.user?.name || 'Anonymous'}
                </p>
                <p className="mt-1 text-gray-700 dark:text-gray-300">{comment.text}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic text-center">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>

        {user && (
          <div className="flex flex-col gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this course..."
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 min-h-[100px]"
            />
            <button
              onClick={handlePostComment}
              disabled={commentLoading || !newComment.trim()}
              className={`self-start px-6 py-3 rounded-lg font-medium text-white transition ${
                commentLoading || !newComment.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
              }`}
            >
              {commentLoading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        )}
      </div>

      {/* Mock Quiz Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900 p-6 md:p-8 rounded-xl border border-indigo-100 dark:border-indigo-800">
        <h3 className="text-2xl font-bold text-indigo-800 dark:text-indigo-200 mb-6">
          Quick Knowledge Check
        </h3>

        <div className="space-y-6">
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">
              1. What is the primary topic of this course?
            </p>
            <div className="flex flex-col gap-2">
              {['Option A', 'Option B (correct)', 'Option C', 'Option D'].map((opt, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="q1"
                    value={opt}
                    checked={quizAnswers.q1 === opt}
                    onChange={handleQuizChange}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* You can add more questions here */}

          <button
            onClick={handleQuizSubmit}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;