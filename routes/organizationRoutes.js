const express = require("express");

const {
  getOrganization,
  updateOrganization,
  addToGallary,
  deleteFromGallery,
  getallGallaryImages,
  uploadCarouselImages,
  getAllCarouselImages,
  deleteCarouselImage,
} = require("../controllers/organizationControllers");
const { authenticateToken } = require("../utils/authenticateToken");
const { adminOnly } = require("../utils/adminMiddleware");

const router = express.Router();

router.post("/carouselImages", authenticateToken, uploadCarouselImages);
router.get("/carouselImages", getAllCarouselImages);
router.delete("/carouselImages/:id", authenticateToken, deleteCarouselImage);
router.get("/gallary", getallGallaryImages);
router.post("/gallary", authenticateToken, adminOnly, addToGallary);
router.delete("/gallary/:id", authenticateToken, adminOnly, deleteFromGallery);
router.get("/", getOrganization);
router.patch("/", authenticateToken, adminOnly, updateOrganization);

module.exports = router;
