const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const protect = require('../middleware/authMiddleware');

// Get comments for course
router.get('/:courseId', async (req, res) => {
  const comments = await Comment.find({ course: req.params.courseId }).populate('user', 'name');
  res.json(comments);
});

// Post comment
router.post('/:courseId', protect, async (req, res) => {
  const comment = new Comment({ course: req.params.courseId, user: req.user.id, text: req.body.text });
  await comment.save();
  res.json(comment);
});

module.exports = router;