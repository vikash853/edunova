// backend/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

// Mock dashboard stats (you can expand later with real DB queries)
router.get('/stats', protect, (req, res) => {
  const mockStats = {
    enrolledCount: 3,           // replace with real count later
    completedCount: 1,
    overallProgress: 45,
    recentActivity: [
      { course: 'React Masterclass', action: 'Completed Module 4', date: '2026-02-20' },
      { course: 'Python for Data Science', action: 'Started Quiz 2', date: '2026-02-18' },
    ],
    notifications: [
      'New course "Advanced Tailwind" available!',
      'Quiz deadline approaching in 2 days',
    ],
  };

  res.json(mockStats);
});

module.exports = router;