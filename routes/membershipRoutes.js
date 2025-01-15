// routes/membershipRoutes.js
const express = require("express");
const router = express.Router();
const {
  submitApplication,
  getPendingApplications,
  acceptApplication,
  rejectApplication,
  getAllAcceptedApplications,
} = require("../controllers/membershipControllers");
const { authenticateToken } = require("../utils/authenticateToken");

router.get("/", authenticateToken, getAllAcceptedApplications);
router.post("/", submitApplication);
router.get("/pending", authenticateToken, getPendingApplications);
router.put("/:id/accept", authenticateToken, acceptApplication);
router.put("/:id/reject", authenticateToken, rejectApplication);

module.exports = router;
