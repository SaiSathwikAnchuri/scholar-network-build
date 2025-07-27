module.exports = (err, req, res, next) => {
  console.error(err.stack || err.message);
  res.status(500).json({ error: err.message || "Server error." });
};
