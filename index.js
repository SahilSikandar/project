const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const CorsOptions = require("./config/CorsOptions");
const credentials = require("./middleware/credentials");
dotenv.config();
const authRoutes = require("./routes/authRoutes");
const pagesRoutes = require("./routes/pageRoutes");
const orgRoutes = require("./routes/organizationRoutes");
const userRoutes = require("./routes/userRoutes");
const incidentRoutes = require("./routes/IncidentRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const membershipRoutes = require("./routes/membershipRoutes");
const volunteerRoutes = require("./routes/adminVolunteersRoutes");
const volunteersMembers = require("./routes/memberVolunteerRoutes");
const eventRoutes = require("./routes/eventRoutes");
const contactRoutes = require("./routes/contactRoutes");
const app = express();

app.use(credentials);
app.use(cors(CorsOptions));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

//Function to send email

// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.sendinblue.com",

//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.SENDINBLUE_SMTP_USER,
//     pass: process.env.SENDINBLUE_SMTP_PASS,
//   },
// });

// // Set up email data
// const mailOptions = {
//   from: '"Your Name" <majidalipahore55566@gmail.com>', // Sender address
//   to: "khandumny@gmail.com", // List of receivers
//   subject: "Hello from Sendinblue", // Subject line
//   text: "This is a test email sent from a Node.js app using Sendinblue.", // Plain text body
//   html: "<b>Hi majid .This is a test email sent from a Node.js app using Sendinblue.</b>", // HTML body
// };

// // Send the email
// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     return console.log(error);
//   }
//   console.log("Message sent: %s", info.messageId);
// });

app.get("/", (req, res) => {
  res.json({ message: "Welcome..." });
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/membership", membershipRoutes);
app.use("/api/volunteership", volunteerRoutes);
app.use("/api/pages", pagesRoutes);
app.use("/api/organization", orgRoutes);
app.use("/api/cases", incidentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/volunteersmembers", volunteersMembers);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
