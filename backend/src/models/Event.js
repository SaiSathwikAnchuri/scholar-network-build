const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  location: String,
  category: String,
  image: String,
  isVirtual: Boolean,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  approved: { type: Boolean, default: false },
}, { timestamps: true }); // <= crucial for 'createdAt'

module.exports = mongoose.model("Event", EventSchema);
