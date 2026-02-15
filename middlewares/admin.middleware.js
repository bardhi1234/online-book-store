const adminMiddleware = (req, res, next) => {
  // authMiddleware duhet të ketë kaluar më parë
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admins only.",
    });
  }

  next();
};

module.exports = adminMiddleware;
