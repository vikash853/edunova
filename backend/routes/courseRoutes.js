const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const protect = require('../middleware/authMiddleware');
const roleCheck = require('../middleware/roleMiddleware');

// GET /api/courses — Public
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    res.json(courses);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// GET /api/courses/my — Instructor (BEFORE /:id)
router.get('/my', protect, roleCheck('instructor'), async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id }).populate('instructor', 'name email');
    res.json(courses);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/courses — Admin only
router.post('/', protect, roleCheck('admin'), async (req, res) => {
  try {
    const { title, description, price=0, image, category, level='Beginner', duration, lessons=0, featured=false } = req.body;
    if (!title || !description) return res.status(400).json({ message: 'Title and description are required' });
    const course = new Course({
      title, description, price,
      image: image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
      instructor: req.user.id, category, level, duration, lessons, featured,
    });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to create course' });
  }
});

// GET /api/courses/:id — Single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/courses/:id — Admin only
router.delete('/:id', protect, roleCheck('admin'), async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
