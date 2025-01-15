const logger = require("../middleware/Logger");
const IncidentCase = require("../models/IncidentCase");
const Ngo = require("../models/Ngo");
const nodemailer = require("nodemailer");
const findNearbyNGOs = require("../utils/findNearByNgos");
const { default: mongoose } = require("mongoose");

exports.reportNewIncident = async (req, res) => {
  try {
    const {
      animalName,
      injuryDescription,
      injuryImages,
      caseLocation,
      reporterName,
      reporterEmail,
      reporterContact,
    } = req.body;
    const reporterInfo = {
      name: reporterName,
      email: reporterEmail,
      contact: reporterContact,
    };

    const newCase = new IncidentCase({
      animalName,
      injuryDescription,
      injuryImages,
      caseLocation,
      reporterInfo,
    });

    const savedCase = await newCase.save();

    const nearByNgos = await findNearbyNGOs(savedCase.caseLocation);
    console.log(nearByNgos);
    console.log("reporting incident case ...");
    // Update each NGO with the new case
    await Promise.all(
      nearByNgos.map(async (ngo) => {
        ngo.newDetectedCases.push(savedCase._id);
        await ngo.save(); // Save the updated NGO document
      })
    );
    console.log("Nearby NGOs notified:", nearByNgos);
    res.status(201).json(savedCase);
  } catch (error) {
    console.error("Error creating incident case:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the case." });
  }
};

// Taking a new detected case
exports.takeNewDetectedCase = async (req, res) => {
  const { caseId } = req.params;
  const { ngoId } = req.body;

  try {
    const incidentCase = await IncidentCase.findById(caseId);
    const ngoTakingCase = await Ngo.findById(ngoId);

    if (!incidentCase || !ngoTakingCase) {
      return res.status(404).json({ message: "Case or NGO not found" });
    }

    // Assign the case to the NGO and add it to the NGO's cases array
    incidentCase.assignedToNgo = ngoId;
    ngoTakingCase.cases.push(incidentCase._id);

    // Save the incident case and the NGO taking the case
    await incidentCase.save();
    await ngoTakingCase.save();

    // Remove the case from the newDetectedCases array of all nearby NGOs
    const nearByNgos = await Ngo.find({ newDetectedCases: caseId });

    await Promise.all(
      nearByNgos.map(async (ngo) => {
        ngo.newDetectedCases = ngo.newDetectedCases.filter(
          (caseIdInArray) => !caseIdInArray.equals(caseId)
        );
        await ngo.save();
      })
    );

    return res.status(200).json({
      message: "Case successfully taken by the NGO",
      incidentCase,
    });
  } catch (error) {
    console.error("Error taking case:", error);
    return res.status(500).json({
      message: "An error occurred while assigning the case to the NGO.",
    });
  }
};

exports.newlyDetectedCases = async (req, res) => {
  try {
    const allNewCases = await IncidentCase.find({ status: "New" });
    res.status(200).json(allNewCases);
  } catch (error) {
    console.log(error);
  }
};

exports.TrackCaseById = async (req, res) => {
  console.log("track case by Id:");
  const { trackingId } = req.body;

  try {
    // Validate the trackingId before querying
    if (!mongoose.Types.ObjectId.isValid(trackingId)) {
      return res.status(400).json({ message: "Invalid tracking ID format." });
    }

    // If the tracking ID is valid, proceed to find the case by ID
    const trackedCase = await IncidentCase.findById(trackingId).populate({
      path: "assignedToNgo",
      select: "pincode user", // Only selecting pincode and user fields
      populate: {
        path: "user", // Populating user details inside assignedToNgo
        select: "name email contact address", // Only selecting required fields from user
      },
    });

    // If no case is found, return a 404 Not Found response
    if (!trackedCase) {
      return res.status(404).json({
        message: "Couldn't find the case with the provided tracking ID.",
      });
    }

    // Return the case if found
    return res.status(200).json(trackedCase);
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.deleteCaseById = async (req, res) => {
  const { caseId } = req.params;

  try {
    // Find and delete the case
    const deletedCase = await IncidentCase.findByIdAndDelete(caseId);

    if (!deletedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    // Remove the case from any NGO's newDetectedCases and cases arrays
    await Ngo.updateMany(
      { $or: [{ newDetectedCases: caseId }, { cases: caseId }] },
      { $pull: { newDetectedCases: caseId, cases: caseId } }
    );

    res.status(200).json({ message: "Case deleted successfully" });
  } catch (error) {
    console.error("Error deleting case:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
