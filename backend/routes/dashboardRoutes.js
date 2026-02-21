const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

// Mock stats for now (expand with real data)
router.get('/stats', protect, (req, res) => {
  const mockStats = {
    progress: [
      { name: 'Week 1', value: 20 },
      { name: 'Week 2', value: 50 },
      { name: 'Week 3', value: 80 },
    ],
    notifications: ['New course available!', 'Deadline approaching for Quiz 1'],
  };
  res.json(mockStats);
});

module.exports = router;