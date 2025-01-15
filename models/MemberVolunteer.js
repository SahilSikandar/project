const mongoose = require("mongoose");

const MemberVolunteerSchema = new mongoose.Schema(
  {
    serialNo: { type: "String", required: true },
    name: { type: "String", required: true },
    designation: { type: "String", required: true },
    validTill: { type: "String" },
    type: { type: String, enum: ["member", "volunteer"], required: true },
  },
  { timestamps: true }
);

const MemberVolunteer = mongoose.model(
  "MemberVolunteer",
  MemberVolunteerSchema
);

module.exports = MemberVolunteer;
