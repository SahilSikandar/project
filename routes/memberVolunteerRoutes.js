const express = require("express");
const { authenticateToken } = require("../utils/authenticateToken");
const {
  add,
  getAll,
  update,
  deletePerson,
} = require("../controllers/memberVolunteerControllers");

const router = express.Router();

router.post("/", authenticateToken, add);
router.post("/:id", authenticateToken, update);
router.delete("/:id", authenticateToken, deletePerson);
router.get("/", getAll);

module.exports = router;
