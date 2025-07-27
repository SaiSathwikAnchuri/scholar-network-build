const mongoose = require("mongoose");
const User = require("../models/User");

// Show current user's info
exports.me = (req, res) => {
  res.json(req.user);
};

// Update own profile
exports.update = async (req, res) => {
  const updates = req.body;
  delete updates.password;
  const u = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
  res.json(u);
};

// List all alumni (for directory with search filtering)
exports.listAlumni = async (req, res) => {
  const filter = { role: "alumni", approved: true };
  if (req.query.year) {
    filter.graduationYear = Number(req.query.year);
    delete req.query.year;
  }
  if (req.query.department) {
    filter.department = req.query.department;
    delete req.query.department;
  }
  if (req.query.search) {
    const search = req.query.search;
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { currentPosition: { $regex: search, $options: 'i' } }
    ];
    delete req.query.search;
  }
  Object.assign(filter, req.query);

  const alumni = await User.find(filter).select('-password');
  res.json(alumni);
};

// Get public profile (with id validation)
exports.getProfile = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid profile ID" });
  }
  const u = await User.findById(req.params.id).select('-password');
  if (!u) return res.status(404).json({ error: "Not found" });
  res.json(u);
};

// ADMIN only: approve or delete users
exports.listAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

exports.approveUser = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  const user = await User.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
  res.json(user);
};

// Sidebar: Alumni list for students
exports.listAlumniSidebar = async (req, res) => {
  const alumni = await User.find({ role: "alumni", approved: true })
    .select('_id name profilePhoto email');
  res.json(alumni);
};

// Sidebar: Student list for alumni
exports.listStudentsSidebar = async (req, res) => {
  const students = await User.find({ role: "student", approved: true })
    .select('_id name profilePhoto email');
  res.json(students);
};

exports.deleteUser = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
