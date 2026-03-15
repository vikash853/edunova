const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
    min: 0,
  },
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  category: {
    type: String,
    enum: [
      "Web Development",
      "AI & Machine Learning",
      "UI/UX Design",
      "Python",
      "Data Science",
      "Mobile Development",
      "DevOps & Cloud",
      "Cybersecurity",
      "Blockchain",
      "Others",
    ],
    required: true,
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },
  duration: {
    type: String, // e.g. "24h", "6 weeks"
    default: "12h",
  },
  lessons: {
    type: Number,
    default: 45,
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
