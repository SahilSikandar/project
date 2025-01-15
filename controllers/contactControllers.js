const Contact = require("../models/ContactUs");
const { verifyRecaptcha } = require("../utils/verifyRecaptcha");

const contactController = {
  // Create a new contact message
  createMessage: async (req, res) => {
    try {
      const { name, email, contact, message, recaptchaToken } = req.body;
      const recaptcha = verifyRecaptcha(recaptchaToken);
      if (!recaptcha)
        return res.status(400).json({ message: "recaptcha failed " });
      const newContact = new Contact({
        name,
        email,
        contact,
        message,
      });

      // Save the contact document to the database
      await newContact.save();

      return res.status(200).json({
        message: "Your message has been sent successfully.",
      });
    } catch (error) {
      console.error("Error creating contact message:", error);
      return res.status(500).json({
        error:
          "An error occurred while sending your message. Please try again later.",
      });
    }
  },

  getAllMessages: async (req, res) => {
    try {
      const messages = await Contact.find();
      return res.status(200).json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      return res.status(500).json({
        error:
          "An error occurred while fetching messages. Please try again later.",
      });
    }
  },

  // Get a specific contact message by ID (optional, for admin purposes)
  getMessageByIdAndDelete: async (req, res) => {
    try {
      const message = await Contact.findByIdAndDelete(req.params.id);

      if (!message) {
        return res.status(404).json({ error: "Message not found." });
      }

      return res.status(200).json(message);
    } catch (error) {
      console.error("Error fetching contact message:", error);
      return res.status(500).json({
        error:
          "An error occurred while fetching the message. Please try again later.",
      });
    }
  },
};

module.exports = contactController;
