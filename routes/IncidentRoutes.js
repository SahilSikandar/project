const express = require("express");
const {
  reportNewIncident,
  takeNewDetectedCase,
  newlyDetectedCases,
  TrackCaseById,
  deleteCaseById,
} = require("../controllers/incidentCaseControllers");
const { authenticateToken } = require("../utils/authenticateToken");

const router = express.Router();

router.post("/reportCase", reportNewIncident);

router.get("/", authenticateToken, newlyDetectedCases);
router.put("/take-case/:caseId", authenticateToken, takeNewDetectedCase);
router.post("/track-case", TrackCaseById);
router.delete("/delete/:caseId", authenticateToken, deleteCaseById);
module.exports = router;
