const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token, unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// role-based access
exports.requireOrganizer = (req, res, next) => {
  if (req.user.role !== "organizer") {
    return res.status(403).json({ message: "Access denied: organizers only" });
  }
  next();
};
