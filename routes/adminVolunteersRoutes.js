const express = require("express");
const { authenticateToken } = require("../utils/authenticateToken");
const {
  getAllAcceptedApplications,
  submitApplication,
  getPendingApplications,
  acceptApplication,
  rejectApplication,
  deleteVolunteerOrMember,
  updateVolunteerOrMember,
} = require("../controllers/adminVolunteersControllers");

const router = express.Router();

router.get("/", authenticateToken, getAllAcceptedApplications);
router.post("/", submitApplication);
router.delete(
  "/delete-volunteer-or-admin/:id",
  authenticateToken,
  deleteVolunteerOrMember
);
router.put(
  "/update-volunteer-or-admin/:id",
  authenticateToken,
  updateVolunteerOrMember
);
router.get("/pending", authenticateToken, getPendingApplications);
router.put("/:id/accept", authenticateToken, acceptApplication);
router.put("/:id/reject", authenticateToken, rejectApplication);

module.exports = router;
