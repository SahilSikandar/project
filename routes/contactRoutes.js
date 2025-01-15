const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactControllers");
const { authenticateToken } = require("../utils/authenticateToken");

// Route to handle submitting a contact form
router.post("/", contactController.createMessage);

// Optional: Routes for admin to view messages
router.get("/", authenticateToken, contactController.getAllMessages);
router.delete("/:id", contactController.getMessageByIdAndDelete);

module.exports = router;
