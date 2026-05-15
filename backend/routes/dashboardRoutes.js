const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const Enrollment = require('../models/Enrollment');

// GET /api/dashboard/stats — real data from DB for the logged-in user
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all enrollments for this user, with course details
    const enrollments = await Enrollment.find({ student: userId })
      .populate('course', 'title image category')
      .sort({ enrolledAt: -1 });

    const enrolledCount = enrollments.length;

    const completedCount = enrollments.filter(e => e.progress >= 100).length;

    const overallProgress = enrolledCount > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrolledCount)
      : 0;

    // Build recent activity from the most recent 5 enrollments
    const recentActivity = enrollments.slice(0, 5).map(e => ({
      course: e.course?.title || 'Unknown course',
      action: e.progress >= 100
        ? 'Completed course'
        : e.progress > 0
        ? `Progress: ${e.progress}%`
        : 'Enrolled',
      date: e.enrolledAt,
    }));

    // Build enrolled courses summary for the dashboard
    const enrolledCourses = enrollments.map(e => ({
      courseId: e.course?._id,
      title: e.course?.title,
      image: e.course?.image,
      category: e.course?.category,
      progress: e.progress,
      badge: e.badge,
      points: e.points,
      enrolledAt: e.enrolledAt,
    }));

    res.json({
      enrolledCount,
      completedCount,
      overallProgress,
      recentActivity,
      enrolledCourses,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error.message);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

module.exports = router;