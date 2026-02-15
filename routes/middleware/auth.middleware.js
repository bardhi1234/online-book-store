const jwt = require("jsonwebtoken");

// ==========================
// Auth Middleware
// Kontrollon tokenin dhe vendos user-in në req.user
// ==========================
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided." });
  }

  // authHeader duhet të jetë "Bearer TOKEN"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Malformed token." });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // id dhe role nga tokeni
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// ==========================
// Admin Middleware
// Vetëm admin mund të përdorë
// ==========================
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { authMiddleware, isAdmin };
