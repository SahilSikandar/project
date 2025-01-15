const mongoose = require("mongoose");

const IncidentCaseSchema = new mongoose.Schema(
  {
    animalName: { type: String },
    injuryDescription: { type: String },
    injuryImages: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    underTreatmentImages: [
      { url: { type: String }, public_id: { type: String } },
    ],
    caseLocation: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    reporterInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      contact: { type: String, required: true },
    },
    assignedToNgo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ngo",
    },
    status: {
      type: String,
      enum: [
        "New",
        "Pending Review",
        "Approved",
        "Rejected",
        "Rescue In Progress",
        "Under Care",
        "Recovered",
        "Closed",
      ],
      default: "New",
      required: true,
    },
  },
  { timestamps: true }
);

const IncidentCase = mongoose.model("IncidentCase", IncidentCaseSchema);
module.exports = IncidentCase;
