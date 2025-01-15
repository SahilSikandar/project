// controllers/membershipController.js
const Membership = require("../models/MemberShip");
const { verifyRecaptcha } = require("../utils/verifyRecaptcha");

// Submit a new membership or volunteer application
exports.submitApplication = async (req, res) => {
  try {
    const {
      name,
      email,
      contact,
      address,
      pincode,
      status,
      description,
      recaptchaToken,
    } = req.body;
    const existingMember = await Membership.findOne({ email: email });
    console.log(description);
    const recaptcha = verifyRecaptcha(recaptchaToken);
    if (!recaptcha)
      return res.status(400).json({ message: "recaptcha failed " });
    if (existingMember) {
      return res
        .status(409)
        .json({ message: "Member already registered with this email!" });
    }
    const newApplication = new Membership({
      name,
      email,
      contact,
      address,
      pincode,
      status,
      description,
    });

    const savedApplication = await newApplication.save();
    res.status(200).json(savedApplication);
  } catch (error) {
    res.status(500).json({ error: "Failed to submit application" });
  }
};
exports.getAllAcceptedApplications = async (req, res) => {
  try {
    const applications = await Membership.find({ status: "accepted" });
    res.status(200).json(applications);
  } catch (error) {
    console.log(error);
  }
};

// Get all pending applications
exports.getPendingApplications = async (req, res) => {
  try {
    const applications = await Membership.find({ status: "pending" });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// Accept an application
exports.acceptApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const updatedApplication = await Membership.findByIdAndUpdate(
      applicationId,
      { status: "accepted" },
      { new: true }
    );

    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({ error: "Failed to accept application" });
  }
};

// Reject an application
exports.rejectApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const updatedApplication = await Membership.findByIdAndUpdate(
      applicationId,
      { status: "rejected" },
      { new: true }
    );

    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({ error: "Failed to reject application" });
  }
};
