const AdminVolunteer = require("../models/AdminVolunteer");
const MemberShip = require("../models/MemberShip");
const { verifyRecaptcha } = require("../utils/verifyRecaptcha");

exports.submitApplication = async (req, res) => {
  try {
    const {
      name,
      email,
      description,
      contact,
      address,
      pincode,
      recaptchaToken,
      status,
    } = req.body;
    console.log(req.body);
    const existingMember = await AdminVolunteer.findOne({ email: email });
    console.log(description);
    const recaptcha = verifyRecaptcha(recaptchaToken);
    if (!recaptcha)
      return res.status(400).json({ message: "recaptcha failed " });
    if (existingMember) {
      return res
        .status(409)
        .json({ message: "Volunteer already registered with this email!" });
    }

    const newApplication = new AdminVolunteer({
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
    const applications = await AdminVolunteer.find({ status: "accepted" });
    res.status(200).json(applications);
  } catch (error) {
    console.log(error);
  }
};

exports.getPendingApplications = async (req, res) => {
  try {
    const applications = await AdminVolunteer.find({ status: "pending" });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

exports.acceptApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const updatedApplication = await AdminVolunteer.findByIdAndUpdate(
      applicationId,
      { status: "accepted" },
      { new: true }
    );

    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({ error: "Failed to accept application" });
  }
};

exports.rejectApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const updatedApplication = await AdminVolunteer.findByIdAndUpdate(
      applicationId,
      { status: "rejected" },
      { new: true }
    );

    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({ error: "Failed to reject application" });
  }
};

exports.deleteVolunteerOrMember = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedVolunteer = await AdminVolunteer.findByIdAndDelete(id);

    if (deletedVolunteer) {
      return res.status(200).json({
        type: "volunteer",
        data: deletedVolunteer,
      });
    }

    const deletedMember = await MemberShip.findByIdAndDelete(id);

    if (deletedMember) {
      return res.status(200).json({ type: "member", data: deletedMember });
    }

    return res
      .status(404)
      .json({ message: "No volunteer or member found with this ID" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

exports.updateVolunteerOrMember = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedVolunteer = await AdminVolunteer.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (updatedVolunteer) {
      return res.status(200).json({
        type: "Volunteer",
        data: updatedVolunteer,
      });
    }

    const updatedMember = await MemberShip.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (updatedMember) {
      return res.status(200).json({ type: "Member", data: updatedMember });
    }

    return res
      .status(404)
      .json({ message: "No volunteer or member found with this ID" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};
