const IncidentCase = require("../models/IncidentCase");
const Ngo = require("../models/Ngo");
const User = require("../models/User");

exports.getAllNgos = async () => {
  try {
    const ngos = await Ngo.find({});
    return ngos;
  } catch (error) {
    console.error("Error fetching NGOs:", error);
    return [];
  }
};
exports.getNgoById = async (req, res) => {
  try {
    const { id } = req.params;
    const ngo = await Ngo.findById(id)
      .populate("cases")
      .populate("volunteers")
      .populate("user");
    return res.status(200).json({ message: "All details of ngo", ngo: ngo });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllNgosForAdmin = async (req, res) => {
  try {
    const ngos = await Ngo.find({}).populate("user");
    if (ngos)
      return res.status(200).json({
        message: "All the ngos fetched successfully.",
        ngos,
      });
  } catch (error) {
    console.log(error);
  }
};

exports.updateCase = async (req, res) => {
  const { ngoId, caseId } = req.params;
  console.log("Extracted ngoId:", ngoId); // Log ngoId for debugging
  console.log("Extracted caseId:", caseId);

  if (!ngoId || !caseId) {
    return res.status(400).json({ message: "NGO ID or Case ID is missing." });
  }
  const { status, underTreatmentImages } = req.body;

  try {
    const ngo = await Ngo.findById(ngoId).populate("cases");
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    const caseToUpdate = await IncidentCase.findById(caseId);
    console.log(underTreatmentImages, status);
    caseToUpdate.status = status;
    caseToUpdate.underTreatmentImages = underTreatmentImages;
    const updatedCase = await caseToUpdate.save();
    res.status(200).json({
      message: "Case updated successfully",
      updatedCase,
    });
  } catch (error) {
    console.error("Error updating case:", error);
    res.status(500).json({
      message: "An error occurred while updating the case.",
    });
  }
};

exports.addVolunteer = async (req, res) => {
  const { ngoId, name, email, contact, address } = req.body;
  const password = "password"; // Default password
  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ message: "User already exists with this email" });
    }

    // Create a new volunteer user
    const newVolunteer = new User({
      name,
      email,
      password,
      contact,
      address,
      role: "ngo_volunteer",
    });

    // Save the volunteer user to the database
    const savedVolunteer = await newVolunteer.save();

    // Find the NGO and add the volunteer to its volunteers array
    const ngo = await Ngo.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }
    ngo.volunteers.push(savedVolunteer._id);
    await ngo.save();

    // Send the success response
    return res
      .status(201)
      .json({ message: "Volunteer added successfully", savedVolunteer });
  } catch (error) {
    console.error("Error adding volunteer:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while adding the volunteer." });
  }
};

exports.updateVolunteer = async (req, res) => {
  const { id } = req.params;
  const { name, email, contact, address } = req.body;

  try {
    // Find the volunteer and update their information
    const updatedVolunteer = await User.findByIdAndUpdate(
      id,
      { name, email, contact, address },
      { new: true }
    );

    if (!updatedVolunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    console.log(updatedVolunteer);

    res
      .status(200)
      .json({ message: "Volunteer updated successfully", updatedVolunteer });
  } catch (error) {
    console.error("Error updating volunteer:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the volunteer." });
  }
};

exports.deleteVolunteer = async (req, res) => {
  const { id } = req.params;
  const { ngoId } = req.query;

  try {
    const ngo = await Ngo.findByIdAndUpdate(
      ngoId,
      { $pull: { volunteers: id } },
      { new: true }
    );

    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    const deletedVolunteer = await User.findByIdAndDelete(id);

    if (!deletedVolunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    res.status(200).json({
      message: "Volunteer deleted successfully",
      deletedVolunteerId: id,
    });
  } catch (error) {
    console.error("Error deleting volunteer:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the volunteer." });
  }
};

exports.deleteNgo = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the NGO by its ID
    const ngo = await Ngo.findById(id).populate("user");
    console.log(id);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }
    // Get the corresponding user from the NGO
    const userId = ngo.user._id;
    // Delete the user associated with the NGO
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ message: "User associated with NGO not found" });
    }

    // Delete the NGO
    const deletedNgo = await Ngo.findByIdAndDelete(id);

    if (!deletedNgo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    return res.status(200).json({
      message: "NGO and corresponding user deleted successfully",
      deletedNgoId: id,
      deletedUserId: userId,
    });
  } catch (error) {
    console.error("Error deleting NGO:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the NGO and user.",
    });
  }
};
