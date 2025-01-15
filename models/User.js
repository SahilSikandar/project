const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: { type: String },
  address: { type: String },
  role: {
    type: String,
    enum: ["user", "ngo", "super_admin", "ngo_volunteer"],
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
