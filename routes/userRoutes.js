const express = require("express");
const {
  updateUserDetails,
  getUserById,
  updatePassword,
} = require("../controllers/userControllers");
const { authenticateToken } = require("../utils/authenticateToken");

const router = express.Router();

router.get("/", authenticateToken, getUserById);
router.patch("/", authenticateToken, updateUserDetails);
router.post("/update-password", authenticateToken, updatePassword);

module.exports = router;
