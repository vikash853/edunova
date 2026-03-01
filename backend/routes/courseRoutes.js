const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/admin');

// GET /api/courses - Public - Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/courses - Create new course (admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const {
      title,
      description,
      price = 0,
      image,
      category,
      level = 'Beginner',
      duration,
      lessons = 0,
      rating = 4.8,
      featured = false,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const course = new Course({
      title,
      description,
      price,
      image: image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
      instructor: req.user._id, // auto-set to logged-in admin
      category,
      level,
      duration,
      lessons,
      rating,
      featured,
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error('Course creation error:', err);
    res.status(400).json({ message: err.message || 'Failed to create course' });
  }
});

// GET /api/courses/my - Instructor's own courses
router.get('/my', protect, async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Only instructors can access their courses' });
    }
    const courses = await Course.find({ instructor: req.user._id }).populate('instructor', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/courses/:id - Single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;