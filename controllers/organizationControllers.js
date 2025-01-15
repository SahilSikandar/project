const express = require("express");
const Organization = require("../models/Organization");
const logger = require("../middleware/Logger");
const { cloudinary } = require("../config/cloudinaryConfig");

// Create or Update Organization
exports.updateOrganization = async (req, res) => {
  try {
    const { name, organizationalTagLine, regdOfficeAddress, email, logo } =
      req.body;
    let organization = await Organization.findOne();
    organization.name = name;
    organization.organizationalTagLine = organizationalTagLine;
    organization.regdOfficeAddress = regdOfficeAddress;
    organization.email = email;
    organization.logo = logo;
    organization.user = req.user.id;
    await organization.save();
    res.status(200).json({
      message: "Organization info updated successfully",
      organization,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrganization = async (req, res) => {
  try {
    const organization = await Organization.findOne({}).select(
      "email logo organizationalTagLine regdOfficeAddress name carouselImages carouselMobileImages"
    );

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToGallary = async (req, res) => {
  const { gallaryImages } = req.body;
  try {
    const organization = await Organization.findOne({});

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    organization.gallary.push(...gallaryImages);

    await organization.save();

    return res.status(200).json(organization.gallary);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteFromGallery = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const organization = await Organization.findOne({});

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Find the index of the image with the given id
    const imageIndex = organization.gallary.findIndex(
      (img) => img.public_id === id
    );

    if (imageIndex === -1) {
      return res
        .status(404)
        .json({ message: "Image not found in the gallery" });
    }

    const imageFound = organization.gallary[imageIndex];

    // Destroy the image in Cloudinary
    const destroyedImage = await cloudinary.uploader.destroy(
      imageFound.public_id
    );

    // Remove the image from the gallery array
    organization.gallary.splice(imageIndex, 1);

    // Save the updated organization document
    await organization.save();

    return res
      .status(200)
      .json({ message: "Image deleted successfully", destroyedImage });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getallGallaryImages = async (req, res) => {
  try {
    const allImages = await Organization.findOne({}).select("gallary");
    res.status(200).json(allImages);
  } catch (error) {
    console.log(error);
  }
};

exports.uploadCarouselImages = async (req, res) => {
  const { gallaryImages, selectedCarouselType } = req.body;
  try {
    const organization = await Organization.findOne({});
    if (selectedCarouselType === "Mobile") {
      organization.carouselMobileImages.push(...gallaryImages);
      await organization.save();
      return res
        .status(200)
        .json({ type: "Mobile", images: organization.carouselMobileImages });
    } else {
      organization.carouselImages.push(...gallaryImages);
      await organization.save();
      return res
        .status(200)
        .json({ type: "Desktop", images: organization.carouselImages });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCarouselImage = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const organization = await Organization.findOne({});

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Helper function to find and remove image from array
    const findAndRemoveImage = (imagesArray) => {
      const imageIndex = imagesArray.findIndex((img) => img.public_id === id);

      if (imageIndex === -1) return null; // Return null if not found

      const imageFound = imagesArray[imageIndex];
      imagesArray.splice(imageIndex, 1); // Remove the image from the array
      return imageFound;
    };

    // Find and remove image from carouselImages or carouselMobileImages
    const imageFromCarousel = findAndRemoveImage(organization.carouselImages);
    const imageFromMobileCarousel = findAndRemoveImage(
      organization.carouselMobileImages
    );

    // If the image was found in neither array
    if (!imageFromCarousel && !imageFromMobileCarousel) {
      return res
        .status(404)
        .json({
          message: "Image not found in the carousel or mobile carousel",
        });
    }

    const imageFound = imageFromCarousel || imageFromMobileCarousel;

    // Destroy the image in Cloudinary
    const destroyedImage = await cloudinary.uploader.destroy(
      imageFound.public_id
    );

    // Save the updated organization document
    await organization.save();

    return res.status(200).json({
      message: "Carousel image deleted successfully",
      destroyedImage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAllCarouselImages = async (req, res) => {
  try {
    const allImages = await Organization.findOne({})
      .select("carouselImages")
      .select("carouselMobileImages");
    res.status(200).json(allImages);
  } catch (error) {
    console.log(error);
  }
};
