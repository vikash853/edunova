const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const protect = require("../middleware/authMiddleware");

// GET /api/enrollments/my — fetch logged-in student's enrollments
// FIX: defined BEFORE /:courseId so "my" isn't treated as an ObjectId
router.get("/my", protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: "course",
        select: "title description price image instructor category level duration lessons rating",
        populate: { path: "instructor", select: "name email" },
      });
    res.json(enrollments);
  } catch (error) {
    console.error("Fetch enrolled courses error:", error.message);
    res.status(500).json({ message: "Failed to fetch enrolled courses", error: error.message });
  }
});

// POST /api/enrollments/:courseId — enroll in a course (students only)
router.post("/:courseId", protect, async (req, res) => {
  try {
    console.log("[ENROLL] Request started", {
      userId: req.user?.id,
      role: req.user?.role,
      courseId: req.params.courseId,
    });

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - please login again" });
    }

    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can enroll" });
    }

    let studentId, courseId;
    try {
      studentId = new mongoose.Types.ObjectId(req.user.id);
      courseId = new mongoose.Types.ObjectId(req.params.courseId);
    } catch (err) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existing = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existing) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      points: 10,
      progress: 0,
      enrolledAt: new Date(),
    });

    // FIX: removed the dual-write to Course.students — Enrollment is the single
    // source of truth for enrollment data. Course.students was redundant and
    // created sync issues. Query Enrollment whenever you need student counts.

    console.log("[ENROLL] Success - Enrollment ID:", enrollment._id);
    res.status(201).json({ message: "Enrolled successfully", enrollment });
  } catch (error) {
    console.error("[ENROLL] CRASH:", error.message);
    res.status(500).json({ message: "Enrollment failed", error: error.message });
  }
});

// PUT /api/enrollments/:courseId/progress — update progress
router.put("/:courseId/progress", protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { progress } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const progressValue = Number(progress);
    if (isNaN(progressValue) || progressValue < 0 || progressValue > 100) {
      return res.status(400).json({ message: "Progress must be a number between 0 and 100" });
    }

    const enrollment = await Enrollment.findOneAndUpdate(
      { student: req.user.id, course: courseId },
      { progress: progressValue },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json({ message: "Progress updated", progress: enrollment.progress });
  } catch (error) {
    console.error("Progress update error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;