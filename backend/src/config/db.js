// src/config/db.js
const mongoose = require('mongoose');

module.exports = function connectDB() {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch(err => {
      console.error("DB Connection Error:", err);
      process.exit(1);
    });
};
