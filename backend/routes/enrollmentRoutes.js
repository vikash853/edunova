const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const protect = require("../middleware/authMiddleware");

// Enroll in a course (student only)
router.post("/:courseId", protect, async (req, res) => {
  try {
    // Debug log - ye Render logs mein dikhega
    console.log("[ENROLL] Request started", {
      userIdRaw: req.user?.id,
      userIdType: typeof req.user?.id,
      role: req.user?.role,
      courseIdRaw: req.params.courseId,
      courseIdType: typeof req.params.courseId,
      timestamp: new Date().toISOString(),
    });

    if (!req.user) {
      console.log("[ENROLL] No user in request");
      return res.status(401).json({ message: "Unauthorized - please login again" });
    }

    if (req.user.role !== "student") {
      console.log("[ENROLL] Wrong role:", req.user.role);
      return res.status(403).json({ message: "Only students can enroll" });
    }

    // Convert string IDs to ObjectId safely
    let studentId, courseId;
    try {
      studentId = new mongoose.Types.ObjectId(req.user.id);
      courseId = new mongoose.Types.ObjectId(req.params.courseId);
    } catch (err) {
      console.log("[ENROLL] ID conversion failed", err.message);
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      console.log("[ENROLL] Course not found:", courseId);
      return res.status(404).json({ message: "Course not found" });
    }

    // Check already enrolled
    const existing = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existing) {
      console.log("[ENROLL] Already enrolled");
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // Create enrollment
    console.log("[ENROLL] Creating enrollment...");
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      points: 10,
      progress: 0,
      enrolledAt: new Date(),
    });

    // Update course students array
    console.log("[ENROLL] Updating course students...");
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { students: studentId },
    });

    console.log("[ENROLL] Success - Enrollment ID:", enrollment._id);
    res.status(201).json({
      message: "Enrolled successfully",
      enrollment,
    });
  } catch (error) {
    console.error("[ENROLL] CRASH:", {
      message: error.message,
      name: error.name,
      stack: error.stack?.slice(0, 500),
    });
    res.status(500).json({
      message: "Enrollment failed",
      error: error.message || "Unknown server error",
    });
  }
});

// Update progress (unchanged)
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
    console.error("Progress update error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get MY enrolled courses (unchanged)
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
    console.error("Fetch enrolled courses error:", error.message);
    res.status(500).json({
      message: "Failed to fetch enrolled courses",
      error: error.message,
    });
  }
});

module.exports = router;
