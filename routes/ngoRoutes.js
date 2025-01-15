const express = require("express");
const {
  addVolunteer,
  updateVolunteer,
  deleteVolunteer,
  updateCase,
  getAllNgos,
  getNgoById,
  getAllNgosForAdmin,
  deleteNgo,
} = require("../controllers/ngoControllers");
const { authenticateToken } = require("../utils/authenticateToken");
const { adminOnly } = require("../utils/adminMiddleware");

const router = express.Router();

router.get("/", authenticateToken, adminOnly, getAllNgosForAdmin);
router.get("/:id", authenticateToken, getNgoById);
router.delete("/:id", authenticateToken, deleteNgo);
router.put("/:ngoId/cases/:caseId", authenticateToken, updateCase);
router.post("/volunteers", authenticateToken, addVolunteer);
router.put("/volunteers/:id", authenticateToken, updateVolunteer);
router.delete("/volunteers/:id", authenticateToken, deleteVolunteer);

module.exports = router;
