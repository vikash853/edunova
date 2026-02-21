const express = require("express");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const protect = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleMiddleware");

// IMPORTANT: Define router here at the top
const router = express.Router();

// Enroll in a course (student only)
router.post("/:courseId", protect, roleCheck("student"), async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if already enrolled
    const existing = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
    });

    // Award points on successful enrollment
    enrollment.points = 10; // Award initial points
    await enrollment.save();

    // Add student to course's students array
    await Course.findByIdAndUpdate(courseId, {
      $push: { students: req.user.id },
    });

    res.json({ message: "Enrolled successfully", enrollment });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({
      message: "Enrollment failed",
      error: error.message,
    });
  }
});

// Get MY enrolled courses (for student dashboard / EnrolledCourses page)
router.get("/my", protect, roleCheck("student"), async (req, res) => {
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
    console.error("Fetch enrolled courses error:", error);
    res.status(500).json({
      message: "Failed to fetch enrolled courses",
      error: error.message,
    });
  }
});

module.exports = router;