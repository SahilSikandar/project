const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "super_admin") {
    next();
  } else {
    res.status(403).json({
      message: "Forbidden: You do not have the required permissions.",
    });
  }
};

module.exports = { adminOnly };
