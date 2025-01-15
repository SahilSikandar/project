const whitelist = [
  "https://rakshaanimal.org", // Your frontend production URL
  "https://animal-rescue-india.netlify.app",
  "http://localhost:5173", // For local development
];

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

module.exports = corsOptions;
