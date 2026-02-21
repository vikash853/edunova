const mongoose = require("mongoose");
const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  points: { type: Number, default: 0 },  // Add this
  badge: { type: String, default: '' },  // Add this
}, { timestamps: true });
module.exports = mongoose.model("Enrollment", enrollmentSchema);