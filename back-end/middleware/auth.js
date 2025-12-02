// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "No Authorization header" });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Malformed Authorization header" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("Token verify error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
