const Event = require("../models/Event");

// List all events (visible to everyone or approved only if you want)
exports.list = async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.json(events);
};

// Create an event (admin/alumni only)
exports.create = async (req, res) => {
  const {
    title, description, date, time, location, category, image, isVirtual
  } = req.body;
  const event = await Event.create({
    title, description, date, time, location, category, image, isVirtual,
    createdBy: req.user._id,
    attendees: [],
    approved: req.user.role === "admin", // Auto-approved for admin, else false
  });
  res.status(201).json(event);
};

// RSVP/Un-RSVP endpoint (students)
exports.rsvp = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });

  const idx = event.attendees.findIndex(id => id.toString() === req.user._id.toString());
  if (idx === -1) event.attendees.push(req.user._id); // RSVP
  else event.attendees.splice(idx, 1); // UN-RSVP

  await event.save();
  res.json(event);
};

// Get all events student has RSVPd (for profile)
exports.listMyRsvp = async (req, res) => {
  const events = await Event.find({ attendees: req.user._id }).sort({ date: 1 });
  res.json(events);
};

// ===== APPROVE EVENT (admin only) =====
exports.approveEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });
  event.approved = true;
  await event.save();
  res.json(event);
};
exports.mostRecent = async (req, res) => {
  const event = await Event.findOne({ approved: true }).sort({ createdAt: -1 });
  if (!event) return res.status(404).json({ error: "No events found" });
  res.json(event);
};
exports.detail = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json(event);
};
