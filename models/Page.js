const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        "About Us",
        "Membership and Volunteering",
        "Advocacy and Awareness",
        "Media and Achievements",
        "Donations and Fundraising",
        "Contact and Policies",
        "Project Reports",
        "Resources and Downloads",
        "Special Initiatives",
      ],
      message: "{VALUE} is not a valid category",
    },
    title: { type: String, required: true, unique: true },
    pageData: { type: String, required: true },
    bannerImage: { type: Object, required: true },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    raised: {
      type: Number,
      required: function () {
        return this.category === "Donations and Fundraising";
      },
    },
    goal: {
      type: Number,
      required: function () {
        return this.category === "Donations and Fundraising";
      },
    },

    raisedBy: {
      type: String,
      required: function () {
        return this.category === "Donations and Fundraising";
      },
    },
    days: {
      type: Number,
      required: function () {
        return this.category === "Donations and Fundraising";
      },
    },
    proofDoc: [
      {
        type: Object,
        required: function () {
          return this.category === "Donations and Fundraising";
        },
      },
    ],
  },
  { timestamps: true }
);

const Page = mongoose.model("Page", PageSchema);

module.exports = Page;
