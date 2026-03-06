const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// ── CORS (yeh sabse important tha – login/register ke liye)
app.use(cors({
  origin: [
    "http://localhost:5173",                     // local dev
    "http://localhost:3000",
    "https://edunova-frontend-rtyq.onrender.com", // tumhara live frontend URL
    "https://edunova-opal.vercel.app"            // purana Vercel URL (if still using)
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Database connect
connectDB();

// Routes (sab clean imports)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));

// Test routes
app.get("/", (req, res) => {
  res.send("EduNova LMS API Running");
});

const protect = require("./middleware/authMiddleware");
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

// Global error handler (better logging)
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong on the server!",
    error: process.env.NODE_ENV === "production" ? undefined : err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
