const whitelist = [
  "https://rakshaanimal.org", // Your frontend production URL
  "https://animal-rescue-india.netlify.app",

  "http://localhost:5173", // For local development
];
const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  console.log("Origin: " + origin);
  if (whitelist.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credentials;
