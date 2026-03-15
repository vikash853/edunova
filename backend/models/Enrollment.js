const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  points: {
    type: Number,
    default: 10,
  },
  badge: {
    type: String,
    default: '',
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  lastLectureId: {
    type: String,
    default: null,
  },
}, { 
  timestamps: true 
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
