import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/common/Button';
import { Heart, Share2, MessageSquare, ThumbsUp, Award, PlayCircle } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastLectureId, setLastLectureId] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState({ q1: '', q2: '', q3: '' });
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await api.get(`/courses/${id}`);
        setCourse(courseRes.data);

        if (user?.role === 'student') {
          const enrollRes = await api.get('/enrollments/my');
          console.log('[Details] Enrollments fetched:', enrollRes.data);
          const enrollment = enrollRes.data.find(enroll => enroll.course._id === id);
          setIsEnrolled(!!enrollment);
          if (enrollment) {
            const freshProgress = Number(enrollment.progress) || 0;
            setProgress(freshProgress);
            setLastLectureId(enrollment.lastLectureId);
            console.log('[Details] Progress loaded:', freshProgress);
          } else {
            console.log('[Details] No enrollment found for course:', id);
          }
        }

        const commentsRes = await api.get(`/comments/${id}`);
        setComments(commentsRes.data);

        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setIsWishlisted(wishlist.includes(id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load course');
        if (err.response?.status === 404) navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user, navigate]);

  const handleEnroll = async () => {
    if (!user) {
      alert('Please login to enroll');
      navigate('/login');
      return;
    }
    if (user.role !== 'student') {
      alert('Only students can enroll');
      return;
    }
    setEnrolling(true);
    try {
      await api.post(`/enrollments/${id}`);
      setIsEnrolled(true);
      setProgress(0);
      alert('Successfully enrolled! Redirecting...');
      navigate(`/course/${id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Enrollment failed';
      alert(msg);
    } finally {
      setEnrolling(false);
    }
  };

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (wishlist.includes(id)) {
      const newList = wishlist.filter(cid => cid !== id);
      localStorage.setItem('wishlist', JSON.stringify(newList));
      setIsWishlisted(false);
    } else {
      wishlist.push(id);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsWishlisted(true);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      const res = await api.post(`/comments/${id}`, { text: newComment });
      setComments([...comments, { ...res.data, likes: 0, replies: [] }]);
      setNewComment('');
    } catch (err) {
      alert('Failed to post comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLikeComment = (commentId) => {
    setComments(comments.map(c =>
      c._id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c
    ));
  };

  const handleQuizChange = (e) => {
    setQuizAnswers({ ...quizAnswers, [e.target.name]: e.target.value });
  };

  const handleQuizSubmit = () => {
    const correct = { q1: 'Full-Stack JavaScript', q2: 'Python', q3: '4.8/5' };
    let score = 0;
    if (quizAnswers.q1 === correct.q1) score += 33;
    if (quizAnswers.q2 === correct.q2) score += 33;
    if (quizAnswers.q3 === correct.q3) score += 34;
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const copyCourseLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Course link copied!');
  };

  const continueLearning = () => {
    navigate(`/course/${id}/lecture/1`);
  };

  const handleDownloadCertificate = async () => {
    if (progress < 100) {
      alert("You need to complete the course to download your certificate!");
      return;
    }
    try {
      const { generateCertificate } = await import('../utils/generateCertificate');
      generateCertificate(
        user?.name || 'Learner',
        course?.title || 'Course Title',
        new Date()
      );
      alert("Certificate downloaded successfully! Check your Downloads folder 🎉");
    } catch (err) {
      console.error("Certificate generation failed:", err);
      alert("Failed to generate certificate. Try again.");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-600 font-semibold py-10">{error}</p>;
  if (!course) return <p className="text-center text-gray-500 py-10">Course not found.</p>;

  const isFree = course.price === 0 || course.price === undefined;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {course.title}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Instructor: <span className="font-semibold">{course.instructor?.name || 'Unknown'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
            {isFree ? 'Free' : `₹${course.price || 0}`}
          </span>

          {user?.role === 'student' && (
            <>
              {!isEnrolled ? (
                <Button
                  variant="primary"
                  size="lg"
                  disabled={enrolling}
                  onClick={handleEnroll}
                  className={enrolling ? 'opacity-70 cursor-not-allowed' : ''}
                >
                  {enrolling ? 'Enrolling...' : isFree ? 'Start Free Course' : 'Enroll Now'}
                </Button>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="px-5 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-full font-medium">
                    Enrolled
                  </span>
                  {progress === 100 && (
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={handleDownloadCertificate}
                      className="flex items-center gap-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    >
                      <Award size={18} />
                      Download Certificate
                    </Button>
                  )}
                </div>
              )}
            </>
          )}

          <button
            onClick={toggleWishlist}
            className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart size={24} className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'} />
          </button>

          <button
            onClick={copyCourseLink}
            className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="Share Course"
          >
            <Share2 size={24} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </motion.div>

      {/* Progress Bar */}
      {isEnrolled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-10 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="w-full md:w-2/3">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Your Progress</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{progress}%</span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={continueLearning}
                className="flex items-center gap-2"
              >
                <PlayCircle size={18} />
                Continue Learning
              </Button>

              {progress === 100 && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleDownloadCertificate}
                  className="flex items-center gap-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                >
                  <Award size={18} />
                  Download Certificate
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Description + Details */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">About This Course</h2>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <p className="leading-relaxed">{course.description}</p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 h-fit">
          <h3 className="text-xl font-semibold mb-4">Course Info</h3>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex justify-between">
              <span>Duration:</span> <span className="font-medium">{course.duration || '12h 30m'}</span>
            </li>
            <li className="flex justify-between">
              <span>Level:</span> <span className="font-medium">{course.level || 'Intermediate'}</span>
            </li>
            <li className="flex justify-between">
              <span>Lessons:</span> <span className="font-medium">{course.lessons || '45'}</span>
            </li>
            <li className="flex justify-between">
              <span>Language:</span> <span className="font-medium">English</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <MessageSquare size={24} className="text-indigo-600" />
          Discussion ({comments.length})
        </h2>

        <div className="space-y-6 mb-10">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {comment.user?.name || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleLikeComment(comment._id)}
                    className="flex items-center gap-1 text-gray-500 hover:text-indigo-600 transition"
                  >
                    <ThumbsUp size={18} />
                    {comment.likes || 0}
                  </button>
                </div>
                <p className="mt-3 text-gray-800 dark:text-gray-200">{comment.text}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10 italic">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>

        {user && (
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts, questions, or feedback..."
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white min-h-[120px]"
            />
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handlePostComment}
                disabled={commentLoading || !newComment.trim()}
                loading={commentLoading}
              >
                Post Comment
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900 p-8 rounded-2xl border border-indigo-100 dark:border-indigo-800">
        <h2 className="text-2xl font-bold mb-6 text-indigo-800 dark:text-indigo-200 flex items-center gap-3">
          <Award size={24} />
          Quick Knowledge Check
        </h2>

        {!quizSubmitted ? (
          <div className="space-y-8">
            <div>
              <p className="font-medium mb-3">1. What is the primary focus of this course?</p>
              {['Frontend Development', 'Backend with Node.js', 'Full-Stack JavaScript', 'UI/UX Design'].map((opt, i) => (
                <label key={i} className="flex items-center gap-3 mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="q1"
                    value={opt}
                    checked={quizAnswers.q1 === opt}
                    onChange={handleQuizChange}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <div>
              <p className="font-medium mb-3">2. Which technology is NOT covered?</p>
              {['React', 'Tailwind CSS', 'Python', 'Framer Motion'].map((opt, i) => (
                <label key={i} className="flex items-center gap-3 mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="q2"
                    value={opt}
                    checked={quizAnswers.q2 === opt}
                    onChange={handleQuizChange}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <div>
              <p className="font-medium mb-3">3. What is the average course rating?</p>
              {['4.2/5', '4.5/5', '4.8/5', '5.0/5'].map((opt, i) => (
                <label key={i} className="flex items-center gap-3 mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="q3"
                    value={opt}
                    checked={quizAnswers.q3 === opt}
                    onChange={handleQuizChange}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleQuizSubmit}
              className="mt-6"
            >
              Submit Quiz
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">
              Quiz Complete! Your Score: {quizScore}%
            </h3>
            <p className="text-lg mb-6">
              {quizScore >= 80
                ? "Excellent! You're mastering this topic."
                : quizScore >= 50
                ? "Good effort! Review the material and try again."
                : "Keep learning — retake to improve your score!"}
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setQuizSubmitted(false);
                setQuizAnswers({ q1: '', q2: '', q3: '' });
              }}
            >
              Retake Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;