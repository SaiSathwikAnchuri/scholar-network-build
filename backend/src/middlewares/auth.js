const jwt = require('jsonwebtoken');
const User = require('../models/User');

// (Optional) If you use a hardcoded admin, include this:
const ADMIN_ID = "000000000000000000000000"; // This must match your admin's hardcoded ID
const ADMIN_EMAIL = "shashanka22@gmail.com";

module.exports = async function (req, res, next) {
  // Accept both 'Authorization: Bearer ...' and 'authorization' lowercase
  const authHeader = req.header('Authorization') || req.header('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token' });
  }
  const token = authHeader.replace('Bearer ', '').trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // If it's the hardcoded admin, attach a minimal admin user object
    if (decoded.id === ADMIN_ID && decoded.email === ADMIN_EMAIL && decoded.role === "admin") {
      req.user = {
        _id: ADMIN_ID,
        name: decoded.name || "Super Admin",
        email: ADMIN_EMAIL,
        role: "admin",
        approved: true
      };
      return next();
    }
    // Else, lookup normal user in DB
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ error: "Invalid token (user not found)" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
