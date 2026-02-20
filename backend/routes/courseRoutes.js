const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const protect = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleMiddleware");

// Get all courses (public)
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Instructor - Get MY courses
router.get("/my", protect, roleCheck("instructor"), async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id }).populate("instructor", "name email");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single course by ID (with students populated only for the course's instructor)
router.get("/:id", protect, async (req, res) => {
  try {
    let query = Course.findById(req.params.id).populate("instructor", "name email");
    const course = await query;
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    // Only populate and show students if the user is the instructor of this course
    if (req.user.role === "instructor" && course.instructor.toString() === req.user.id) {
      await course.populate("students", "name email");
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Instructor - Create course
router.post("/create", protect, roleCheck("instructor"), async (req, res) => {
  try {
    const { title, description, price } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }
    const course = new Course({ title, description, price, instructor: req.user.id });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;