const express = require("express");
const {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEventById,
} = require("../controllers/eventControllers");
const { authenticateToken } = require("../utils/authenticateToken");
const router = express.Router();

router.post("/", authenticateToken, createEvent);
router.get("/", getAllEvents);
router.put("/:id", authenticateToken, updateEvent);
router.delete("/:id", authenticateToken, deleteEventById);

module.exports = router;
