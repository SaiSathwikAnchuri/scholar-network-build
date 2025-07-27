const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deadline: Date,
  description: String,
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  file: String,
}, { timestamps: true });

module.exports = mongoose.model("Job", JobSchema);
