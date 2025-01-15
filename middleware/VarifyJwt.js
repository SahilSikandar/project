const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication token is required!" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired!" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(403).json({ message: "Invalid token!" });
      }
      return res.status(403).json({ message: "Failed to authenticate token!" });
    }

    req.user = decoded;
    next();
  });
}

module.exports = authenticateToken;
