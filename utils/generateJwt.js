const jwt = require("jsonwebtoken");

// Function to generate JWT token
function generateJwtToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_KEY, {
    expiresIn: "3hr",
  });
}

module.exports = { generateJwtToken };
