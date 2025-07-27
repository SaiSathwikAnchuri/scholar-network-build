const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'alumni', 'student'], required: true },
  theme: { type: String, enum: ['light', 'dark', 'custom'], default: 'light' },
  bio: String,
  batch: String,
  profilePhoto: String,
  contactLinks: [String],
  workHistory: [{ position: String, company: String, years: String }],
  education: [{ degree: String, year: String, institution: String }],
  approved: { type: Boolean, default:true },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);