const Message = require("../models/Message");

// Get all threads for the logged-in user
const inbox = async (req, res) => {
  const threads = await Message.find({ participants: req.user._id })
    .populate("participants", "name profilePhoto email");
  res.json(threads);
};

// Fetch single thread (not required, but ok to keep)
const thread = async (req, res) => {
  const thread = await Message.findById(req.params.id)
    .populate("participants", "name profilePhoto email");
  if (!thread || !thread.participants.some(u => String(u._id) === String(req.user._id)))
    return res.status(403).json({ error: "Forbidden" });
  res.json(thread);
};

// Send a message (creates thread if needed, skips blank message)
const send = async (req, res) => {
  const from = req.user._id;
  const { to, content } = req.body;
  if (!to || content === undefined) return res.status(400).json({ error: "Missing required fields." });

  // Find or create my thread
  let thread = await Message.findOne({
    participants: { $all: [from, to], $size: 2 }
  });
  if (!thread) {
    thread = await Message.create({ participants: [from, to], messages: [] });
  }

  let msg = null;
  if (content && content.trim() !== "") {
    msg = { sender: from, content, timestamp: new Date() };
    thread.messages.push(msg);
    thread.updatedAt = new Date();
    await thread.save();
    await thread.populate("participants", "name profilePhoto email");
    // Socket.IO emit to both sender and recipient
    if (req.app && req.app.get) {
      const io = req.app.get('io');
      if (io) {
        [from, to].forEach(uid => {
          io.to(uid.toString()).emit("receive_message", { threadId: thread._id, msg });
        });
      }
    }
  } else {
    // No message, just thread creation
    await thread.save();
    await thread.populate("participants", "name profilePhoto email");
  }
  res.json(thread);
};

module.exports = { inbox, thread, send };
