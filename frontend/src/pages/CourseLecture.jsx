import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Award, Notebook, CheckCircle, PlayCircle } from 'lucide-react';

const CourseLecture = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState('');
  const [completed, setCompleted] = useState(false);

  const videoUrl = "/videos/vid.mp4";
  const lessons = [ // Fake lessons - backend se le lo
    { id: 1, title: 'Introduction', duration: '5 min', completed: true },
    { id: 2, title: 'Core Concepts', duration: '10 min', completed: false },
    { id: 3, title: 'Advanced Topics', duration: '15 min', completed: false },
    { id: 4, title: 'Conclusion', duration: '8 min', completed: false },
  ];

  const currentLessonId = 2; // Fake - dynamic kar lo

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);

        if (user?.role === 'student') {
          const enrollRes = await api.get('/enrollments/my');
          const enrollment = enrollRes.data.find(en => en.course._id === id);
          if (enrollment) {
            setProgress(enrollment.progress || 0);
          }
        }

        // Resume from last timestamp
        const savedTime = localStorage.getItem(`video-time-${id}`);
        if (savedTime && videoRef.current) {
          videoRef.current.currentTime = savedTime;
        }
      } catch (err) {
        console.error(err);
        setError('Course load failed');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, user]);

  const saveProgressToBackend = async (newProgress) => {
    try {
      await api.put(`/enrollments/${id}/progress`, { progress: newProgress });
      console.log('Progress saved:', newProgress);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleTimeUpdate = (e) => {
    const video = e.target;
    if (!video.duration) return;
    const percent = Math.round((video.currentTime / video.duration) * 100);
    if (percent > progress) {
      setProgress(percent);
      localStorage.setItem(`video-time-${id}`, video.currentTime); // Save resume time
      if (percent % 10 === 0 || percent === 100) {
        saveProgressToBackend(percent);
      }
    }
  };

  const handleEnded = () => {
    setProgress(100);
    setCompleted(true);
    saveProgressToBackend(100);
    console.log('Video ended - auto next lesson or redirect');
    // Auto next lesson
    setTimeout(() => {
      navigate(`/course/${id}/lecture/${currentLessonId + 1}`);
    }, 1500);
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    // Save notes to backend if needed
  };

  const handleMarkCompleted = () => {
    setCompleted(true);
    // Backend call for mark completed
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-600 text-center py-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 flex flex-col md:flex-row gap-6">
      {/* Video Main */}
      <div className="flex-1">
        <button
          onClick={() => navigate(`/course/${id}`)}
          className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Course
        </button>

        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          {course?.title} – Demo Lecture
        </h1>

        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-8">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            className="w-full h-full"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
          />
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span className="font-bold text-indigo-600">{progress}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {progress >= 100 && (
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <Award size={48} className="mx-auto mb-4 text-green-600" />
            <h3 className="text-2xl font-bold mb-2">Lecture Complete!</h3>
            <p className="mb-4">Demo pura dekh liya 🎉</p>
            <Button
              variant="primary"
              onClick={() => navigate(`/course/${id}`)}
            >
              Back & Download Certificate
            </Button>
          </div>
        )}
      </div>

      {/* Netflix Style Sidebar */}
      <div className="w-full md:w-80 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold mb-4">Lessons</h3>
        <div className="space-y-3">
          {lessons.map(lesson => (
            <div
              key={lesson.id}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                lesson.id === currentLessonId ? 'bg-indigo-100 dark:bg-indigo-900/40' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => navigate(`/course/${id}/lecture/${lesson.id}`)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{lesson.title}</span>
                <span className="text-sm text-gray-500">{lesson.duration}</span>
              </div>
              {lesson.completed && <CheckCircle size={16} className="text-green-600 mt-2" />}
            </div>
          ))}
        </div>

        {/* Notes Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Notebook size={20} />
            My Notes
          </h3>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[150px]"
            placeholder="Jot down your thoughts..."
          />
          <Button variant="primary" size="sm" className="mt-4 w-full">
            Save Notes
          </Button>
        </div>

        {/* Mark Completed */}
        <div className="mt-8">
          <Button
            variant="outline"
            size="md"
            className="w-full flex items-center gap-2"
            onClick={handleMarkCompleted}
            disabled={completed}
          >
            <CheckCircle size={18} />
            {completed ? 'Completed' : 'Mark as Completed'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseLecture;