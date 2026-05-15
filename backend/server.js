const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// ── Security headers (helmet must be first)
app.use(helmet());

// ── CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://edunova-frontend-rtyq.onrender.com",
    "https://edunova-opal.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ── Rate limiting on auth routes (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this IP, please try again after 15 minutes" },
});

// ── Database
connectDB();

// ── Routes
app.use("/api/auth",        authLimiter, require("./routes/authRoutes"));
app.use("/api/courses",     require("./routes/courseRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/dashboard",   require("./routes/dashboardRoutes"));
app.use("/api/comments",    require("./routes/commentRoutes"));
// FIX: testRoutes was defined but never mounted — now it is
app.use("/api/tests",       require("./routes/testRoutes"));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "EduNova LMS API Running" });
});

// ── Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong on the server!",
    error: process.env.NODE_ENV === "production" ? undefined : err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});