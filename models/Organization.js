const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrganizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    organizationalTagLine: {
      type: String,
      required: true,
    },
    regdOfficeAddress: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
    },
    logo: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    gallary: [{ url: { type: String }, public_id: { type: String } }],
    carouselImages: [{ url: { type: String }, public_id: { type: String } }],
    carouselMobileImages: [
      { url: { type: String }, public_id: { type: String } },
    ],
  },
  { timestamps: true }
);

const Organization = mongoose.model("Organization", OrganizationSchema);

module.exports = Organization;
