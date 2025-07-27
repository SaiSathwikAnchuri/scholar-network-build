const Job = require('../models/Job');

// List jobs (sorted newest first, with poster's name)
exports.list = async (req, res) => {
  const jobs = await Job.find()
    .populate('postedBy', 'name')
    .sort({ createdAt: -1 });  // <-- Sort by newest first!
  res.json(jobs);
};

// Add new job (alumni/admin only)
exports.add = async (req, res) => {
  const job = await Job.create({ ...req.body, postedBy: req.user._id });
  res.status(201).json(job);
};

exports.apply = async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job.applicants.includes(req.user._id)) {
    job.applicants.push(req.user._id);
    await job.save();
  }
  res.json({ success: true });
};

exports.remove = async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return res.sendStatus(404);
  if (String(job.postedBy) !== String(req.user._id) && req.user.role !== 'admin')
    return res.sendStatus(403);
  await job.remove();
  res.json({ success: true });
};
