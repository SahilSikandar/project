const axios = require("axios");
const Ngo = require("../models/Ngo");

async function findNearbyNGOs(caseLocation) {
  console.log("case location: " + caseLocation);
  const ngos = await Ngo.find(); // Fetch all NGOs from the database
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const origins = [`${caseLocation.lat},${caseLocation.lng}`];
  const destinations = ngos.map(
    (ngo) => `${ngo.location.coordinates[1]},${ngo.location.coordinates[0]}`
  );

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins.join(
    "|"
  )}&destinations=${destinations.join("|")}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const distances = response.data.rows[0]?.elements;
    // Attach distances to NGOs and filter within a specific distance (e.g., 50km)
    const ngosWithDistance = ngos
      .map((ngo, index) => {
        const distanceElement = distances[index];

        // Check if the distance element has a valid status
        if (
          distanceElement &&
          distanceElement.status === "OK" &&
          distanceElement.distance
        ) {
          ngo.distance = distanceElement.distance.value; // Attach distance
        }

        return ngo;
      })
      .filter((ngo) => ngo.distance <= 100000); // Filter within 50km

    // Sort NGOs by distance in ascending order
    ngosWithDistance.sort((a, b) => a.distance - b.distance);

    return ngosWithDistance;
  } catch (error) {
    console.error("Error fetching distances from Google Maps:", error);
    return [];
  }
}

module.exports = findNearbyNGOs;
