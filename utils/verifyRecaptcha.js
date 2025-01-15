const axios = require("axios");

const verifyRecaptcha = async (recaptchaToken) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Your reCAPTCHA secret key

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: secretKey,
          response: recaptchaToken,
        },
      }
    );

    const { success } = response.data;

    return success;
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    throw new Error("Error verifying reCAPTCHA");
  }
};

module.exports = { verifyRecaptcha };
