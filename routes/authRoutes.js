const express = require("express");
const {
  signup,
  login,
  verifyEmail,
} = require("../controllers/authControllers");
const { authenticateToken } = require("../utils/authenticateToken");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
