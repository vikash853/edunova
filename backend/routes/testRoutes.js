const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Course = require("../models/Course");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Generate AI Test Series for a course
router.post("/generate/:courseId", protect, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can take tests" });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // AI Prompt (real company style questions)
    const prompt = `You are an expert interviewer from companies like Google, Amazon, Microsoft.
Generate a 10-question test for "${course.title}" course.

Rules:
- 6 MCQs + 4 short coding questions
- Questions should be like real previous year interview questions
- Include difficulty level (Easy/Medium/Hard)
- For coding questions give input/output examples
- Make it unique every time

Return only JSON in this exact format:
{
  "title": "AI Generated Test - ${course.title}",
  "questions": [
    {
      "type": "mcq",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "...",
      "difficulty": "Medium"
    },
    {
      "type": "coding",
      "question": "...",
      "testCases": [{"input": "...", "output": "..."}],
      "difficulty": "Hard"
    }
  ]
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 2048,
    });

    const testData = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      test: testData,
      courseTitle: course.title
    });
  } catch (error) {
    console.error("AI Test Generation Error:", error);
    res.status(500).json({ message: "Failed to generate test", error: error.message });
  }
});

module.exports = router;