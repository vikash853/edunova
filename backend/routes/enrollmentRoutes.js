const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const protect = require("../middleware/authMiddleware");

// Enroll in a course (student only)
router.post("/:courseId", protect, async (req, res) => {
  try {
    console.log("[ENROLL] Request started", {
      userId: req.user?.id,
      role: req.user?.role,
      courseId: req.params.courseId,
      timestamp: new Date().toISOString(),
    });

    if (!req.user) {
      console.log("[ENROLL] No user object found in request");
      return res.status(401).json({ message: "Unauthorized - please login again" });
    }

    if (req.user.role !== "student") {
      console.log("[ENROLL] Unauthorized role:", req.user.role);
      return res.status(403).json({ message: "Only students can enroll" });
    }

    const courseIdStr = req.params.courseId;
    let courseId;
    try {
      courseId = new mongoose.Types.ObjectId(courseIdStr);
    } catch (err) {
      console.log("[ENROLL] Invalid courseId format:", courseIdStr);
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      console.log("[ENROLL] Course not found:", courseId);
      return res.status(404).json({ message: "Course not found" });
    }

    const existing = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (existing) {
      console.log("[ENROLL] Already enrolled in course:", courseId);
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    console.log("[ENROLL] Creating new enrollment...");
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
      points: 10,
      progress: 0,
      enrolledAt: new Date(),
    });

    console.log("[ENROLL] Updating course students array...");
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { students: req.user.id },
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
      stack: error.stack?.slice(0, 500), // limited for logs
    });
    res.status(500).json({
      message: "Enrollment failed",
      error: error.message || "Unknown server error",
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
    console.error("Progress update error:", error.message);
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
    console.error("Fetch enrolled courses error:", error.message);
    res.status(500).json({
      message: "Failed to fetch enrolled courses",
      error: error.message,
    });
  }
});

module.exports = router;
