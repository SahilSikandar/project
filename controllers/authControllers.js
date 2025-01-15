const User = require("../models/User");
const Ngo = require("../models/Ngo");
const { verifyRecaptcha } = require("../utils/verifyRecaptcha");
const { generateJwtToken } = require("../utils/generateJwt");
const Organization = require("../models/Organization");

// User Signup
exports.signup = async (req, res) => {
  console.log("Signup Route");
  const {
    name,
    email,
    password,
    role,
    pincode,
    contact,
    address,
    location,
    recaptchaToken,
  } = req.body;

  try {
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    console.log(isRecaptchaValid);
    if (!isRecaptchaValid) {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }
    //Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      if (user.role === "ngo")
        return res
          .status(400)
          .json({ role: "ngo", message: "Ngo already registered" });
      else if (user.role === "user")
        return res
          .status(400)
          .json({ role: "user", message: "User already exists" });
      else
        return res
          .status(400)
          .json({ role: "super_admin", message: "already exists" });
    }

    user = new User({
      name,
      email,
      password,
      contact,
      address,
      role,
    });

    await user.save();

    if (role === "ngo") {
      const ngo = new Ngo({
        user: user._id,
        pincode,
        location: {
          type: "Point",
          coordinates: [location.lng, location.lat],
        },
      });
      await ngo.save();
    }

    const accessToken = generateJwtToken(user);

    res.status(201).json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during signup" });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    console.log(user);
    if (user.role === "super_admin") {
      const organization = await Organization.findOne({}).populate("user");
      console.log(organization);
    }

    // Compare passwords
    const isMatch = user.password === password;
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    // Generate JWT
    const accessToken = generateJwtToken(user);
    // Send response
    return res.status(200).json({
      accessToken,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Login Error:", error);

    if (error.message.includes("Invalid credentials")) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // General server error
    return res.status(500).json({ error: "Server error during login" });
  }
};

// exports.verifyEmail = async (req, res) => {
//   const { token } = req.query;

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_KEY);
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res
//         .status(400)
//         .json({ message: "Invalid token or user does not exist." });
//     }

//     user.isVerified = true;
//     await user.save();

//     res.status(200).json({ message: "Email verified successfully." });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
