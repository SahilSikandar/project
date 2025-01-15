const Page = require("../models/Page");
const logger = require("../middleware/Logger");

// Create a new page
exports.createPage = async (req, res) => {
  try {
    const {
      category,
      title,
      pageData,
      bannerImage,
      metaTitle,
      metaDescription,
      raised,
      goal,
      raisedBy,
      days,
      proofDoc,
    } = req.body;

    if (category === "Donations and Fundraising") {
      if (!raised || !goal || !raisedBy || !days) {
        return res.status(400).json({
          message:
            "Missing required fields for Donations and Fundraising category",
        });
      }
    }

    const newPage = new Page({
      category,
      title,
      pageData,
      bannerImage,
      metaTitle,
      metaDescription,
      ...(category === "Donations and Fundraising" && {
        raised,
        goal,
        raisedBy,
        days,
        proofDoc,
      }),
    });

    await newPage.save();

    res.status(201).json({
      message: "Page created successfully",
      data: newPage,
    });
  } catch (error) {
    console.error("Error creating page:", error);
    if (error.code === 11000) {
      res.status(400).json({
        message: "Page with the same title already exists",
      });
    } else {
      res.status(500).json({
        message: "An error occurred while creating the page",
      });
    }
  }
};

exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.find().select("category title bannerImage _id");
    logger.info("get all pages");
    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPagesByCategory = async (req, res) => {
  const { category } = req.query;
  try {
    const pagesOfCategory = await Page.find({ category });
    if (pagesOfCategory.length === 0) {
      return res.status(404).json({
        message: "Pages not found with category: " + category,
      });
    }
    res.status(200).json(pagesOfCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while retrieving pages.",
    });
  }
};

exports.getPageById = async (req, res) => {
  const { id } = req.params;
  try {
    const page = await Page.findById(id);
    if (page) {
      console.log(page);
      logger.info("get pageById", page);
      res.status(200).json({ ok: true, page });
    } else {
      res.status(404).json({ message: "Page not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePageById = async (req, res) => {
  try {
    const page = await Page.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (page) {
      res.status(201).json(page);
    } else {
      res.status(404).json({ message: "Page not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePageById = async (req, res) => {
  console.log("Delete page by id");
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (page) {
      res.status(200).json({ message: "Page deleted" });
    } else {
      res.status(404).json({ message: "Page not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
