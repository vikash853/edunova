const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://edunova-frontend-rtyq.onrender.com"
  ],
  credentials: true
}));

// Body parser
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const courseRoutes = require("./routes/courseRoutes");
app.use("/api/courses", courseRoutes);

const enrollmentRoutes = require("./routes/enrollmentRoutes");
app.use("/api/enrollments", enrollmentRoutes);

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);

const commentRoutes = require('./routes/commentRoutes');
app.use('/api/comments', commentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("EduNova LMS API Running");
});

const protect = require("./middleware/authMiddleware");
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    message: "Something went wrong on the server!",
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
