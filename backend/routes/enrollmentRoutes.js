const express = require("express");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const protect = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleMiddleware");

// IMPORTANT: Define router here at the top
const router = express.Router();

// Existing enroll route (keep this)
router.post("/:courseId", protect, roleCheck("student"), async (req, res) => {
  try {
    const { courseId } = req.params;
    const existing = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (existing) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }
    const enrollment = await Enrollment.create({ student: req.user.id, course: courseId });
    await Course.findByIdAndUpdate(courseId, { $push: { students: req.user.id } });
    res.json({ message: "Enrolled successfully", enrollment });
  } catch (error) {
    res.status(500).json({ message: "Enrollment failed", error: error.message });
  }
});

// NEW: Get MY enrolled courses (for student dashboard / EnrolledCourses page)
router.get("/my", protect, roleCheck("student"), async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: "course",
        select: "title description price instructor",
        populate: {
          path: "instructor",
          select: "name email"
        }
      });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch enrolled courses", error: error.message });
  }
});

module.exports = router;