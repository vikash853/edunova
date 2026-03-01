const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const protect = require("../middleware/authMiddleware");

// Enroll in a course (student only)
router.post("/:courseId", protect, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can enroll" });
    }

    const { courseId } = req.params;

    if (!courseId || courseId.length < 10) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    const existing = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
      points: 10,
      progress: 0,
    });

    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { students: req.user.id },
    });

    res.status(201).json({
      message: "Enrolled successfully",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Enrollment failed",
      error: error.message,
    });
  }
});

// Update progress
router.put("/:courseId/progress", protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { progress } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const enrollment = await Enrollment.findOneAndUpdate(
      { student: req.user.id, course: courseId },
      { progress: Number(progress) },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json({ message: "Progress updated", progress: enrollment.progress });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get MY enrolled courses
router.get("/my", protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: "course",
        select: "title description price instructor",
        populate: {
          path: "instructor",
          select: "name email",
        },
      });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch enrolled courses",
      error: error.message,
    });
  }
});

module.exports = router;