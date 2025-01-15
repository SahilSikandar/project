const logger = require("../middleware/Logger");
const Ngo = require("../models/Ngo");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email contact address role"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "ngo") {
      const ngo = await Ngo.findOne({ user: req.user.id })
        .populate("cases")
        .populate("newDetectedCases")
        .populate("volunteers");
      if (!ngo) {
        return res.status(404).json({ message: "NGO not found" });
      }

      return res.status(200).json({ user, ngo });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const { name, email, contact, address, pincode, location } = req.body;

    // Update user details
    let user = await User.findById(req.user.id).select(
      "name email contact address role"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name;
    user.email = email;
    user.contact = contact;
    user.address = address;

    // Save user details
    await user.save();

    let updatedUserResponse = { user };

    // If the user is an NGO, update NGO details as well
    if (user.role === "ngo") {
      let ngo = await Ngo.findOne({ user: req.user.id });
      if (!ngo) return res.status(404).json({ message: "NGO not found" });
      console.log(location);
      if (pincode) ngo.pincode = pincode;
      if (location)
        location.location = {
          type: "Point",
          coordinates: [location.lng, location.lat],
        };

      // Save NGO details
      await ngo.save();

      updatedUserResponse.ngo = ngo;
    }

    res.status(200).json({
      message: "User and NGO details updated successfully",
      ...updatedUserResponse,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both current and new passwords are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Before update:", user);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      console.log("user couldnt be compared");
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;

    await user.save();

    console.log(user);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
