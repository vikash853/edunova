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
    default: 0,
  },
  badge: {
    type: String,
    default: '',
  },
  progress: {   // ← Yeh field add kar diya (sabse zaroori!)
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  lastLectureId: {  // optional, agar use kar rahe ho
    type: String,
    default: null,
  },
}, { timestamps: true });

// Auto-update updatedAt on save (good practice)
enrollmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);