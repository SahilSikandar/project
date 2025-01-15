const logger = require("../middleware/Logger");

const mailchimpTx = require("mailchimp_transactional")(
  process.env.MAILCHIMP_KEY
);

async function sendVerificationEmail(userEmail, verificationLink) {
  try {
    logger.info(responseworking);
    const response = await mailchimpTx.messages.send({
      message: {
        from_email: "rakshaanimal.adinberg@gmail.com",
        subject: "Verify your email",
        text: `Please verify your email by clicking on this link: ${verificationLink}`,
        to: [
          {
            email: userEmail,
            type: "to",
          },
        ],
      },
    });
    console.log(response);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

module.exports = sendVerificationEmail;
