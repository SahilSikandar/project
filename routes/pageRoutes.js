const express = require("express");

const {
  createPage,
  getAllPages,
  getPageById,
  deletePageById,
  updatePageById,
  getPagesByCategory,
} = require("../controllers/pageControllers");
const { authenticateToken } = require("../utils/authenticateToken");
const { adminOnly } = require("../utils/adminMiddleware");

const router = express.Router();

router.post("/", authenticateToken, adminOnly, createPage);
router.get("/category", getPagesByCategory);
router.get("/", getAllPages);
router.get("/:id", getPageById);
router.delete("/:id", authenticateToken, adminOnly, deletePageById);
router.patch("/:id", authenticateToken, adminOnly, updatePageById);

module.exports = router;
