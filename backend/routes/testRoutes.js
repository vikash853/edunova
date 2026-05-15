const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Course = require("../models/Course");
const Groq = require("groq-sdk");

// NOTE: Groq client is intentionally NOT initialized at the top level.
// Instantiating it at module load time throws if GROQ_API_KEY is missing,
// which crashes the entire server on startup. Instead we create it lazily
// inside the route handler so the rest of the app stays up.

// POST /api/tests/generate/:courseId — AI test generation (students only)
router.post("/generate/:courseId", protect, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can take tests" });
    }

    // Guard: return a clean error instead of crashing if key is not set
    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        message: "AI test feature is not configured. Add GROQ_API_KEY to your .env file.",
      });
    }

    // Lazy init — safe because we checked the key above
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const prompt = `You are an expert interviewer from companies like Google, Amazon, Microsoft.
Generate a 10-question test for "${course.title}" course.

Rules:
- 6 MCQs + 4 short coding questions
- Questions should be like real previous year interview questions
- Include difficulty level (Easy/Medium/Hard)
- For coding questions give input/output examples
- Make it unique every time

Return ONLY valid JSON with no markdown, no backticks, no explanation — just the raw JSON object:
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

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) {
      return res.status(502).json({ message: "No response from AI model" });
    }

    // Safely parse — strip markdown fences the model sometimes adds
    let testData;
    try {
      const cleaned = rawContent
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
      testData = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("AI response JSON parse failed:", parseErr.message);
      console.error("Raw AI response:", rawContent.slice(0, 500));
      return res.status(502).json({
        message: "AI returned malformed data. Please try again.",
      });
    }

    res.json({ success: true, test: testData, courseTitle: course.title });
  } catch (error) {
    console.error("AI Test Generation Error:", error);
    res.status(500).json({ message: "Failed to generate test", error: error.message });
  }
});

module.exports = router;