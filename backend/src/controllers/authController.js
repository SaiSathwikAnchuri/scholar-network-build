const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Hardcoded admin credentials
const ADMIN_EMAIL = "shashanka22@gmail.com";
const ADMIN_PASSWORD = "Sai@1414"; // Replace with your secret password!
const ADMIN_NAME = "Super Admin";
const ADMIN_ID = "000000000000000000000000"; // Static/fake id (should not collide with any mongo id)

exports.register = async (req, res) => {
  const { name, email, password, role, ...rest } = req.body;
  if (!name || !email || !password || !role)
    return res.status(400).json({ error: 'Enter all fields' });

  // DISALLOW admin registration via any API request
  if(role === "admin") {
    return res.status(403).json({ error: "Registration as admin is not allowed." });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: 'Email taken' });

  const hash = await bcrypt.hash(password, 10);

  // All users except backend/admin are approved by default
  const user = await User.create({
    name,
    email,
    password: hash,
    role,
    approved: true,
    ...rest
  });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Never send password to frontend!
  const responseUser = { ...user.toObject(), password: undefined };
  res.status(201).json({ token, user: responseUser });
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Hardcoded admin ("backend-only")
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { id: ADMIN_ID, role: "admin", name: ADMIN_NAME, email: ADMIN_EMAIL },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const user = {
      _id: ADMIN_ID,
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      role: "admin",
      approved: true
    };
    return res.json({ token, user });
  }

  // 2. Normal user login from MongoDB
  const user = await User.findOne({ email });
  if (!user)
    return res.status(401).json({ error: "Invalid email or password" });
  if (user.role === "admin") {
    // Prevent any "admin" user in MongoDB from logging in!
    return res.status(403).json({ error: "Admin login not allowed here." });
  }
  if (!user.approved)
    return res.status(401).json({ error: "Account not approved yet" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(401).json({ error: "Invalid email or password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  const responseUser = { ...user.toObject(), password: undefined };
  res.json({ token, user: responseUser });
};
