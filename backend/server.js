const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// ── CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://edunova-frontend-rtyq.onrender.com",
    "https://edunova-opal.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Database connect
connectDB();

// Routes
app.use("/api/auth",        require("./routes/authRoutes"));
app.use("/api/courses",     require("./routes/courseRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/dashboard",   require("./routes/dashboardRoutes"));
app.use("/api/comments",    require("./routes/commentRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("EduNova LMS API Running");
});

// Protected test route
const protect = require("./middleware/authMiddleware");
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

// Global error handler
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