const mongoose = require("mongoose");

const NgoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pincode: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    newDetectedCases: [{ type: mongoose.Types.ObjectId, ref: "IncidentCase" }],
    cases: [{ type: mongoose.Types.ObjectId, ref: "IncidentCase" }],
    volunteers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
NgoSchema.index({ location: "2dsphere" });
const Ngo = mongoose.model("Ngo", NgoSchema);

module.exports = Ngo;
