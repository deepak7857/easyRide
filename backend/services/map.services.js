const axios = require("axios");
const captainModel = require("../model/captain.model");
module.exports.getAddressCoordinate = async (address) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    throw new Error("Google Maps API key is not configured");
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    
    if (response.data.status === "OK") {
      const { lat, lng } = response.data.results[0].geometry.location;
      
      return { 
        latitude: lat,
        longitude: lng
      };
      
    } else {
      throw new Error(`Geocoding failed: ${response.data.status}`);
    }
  } catch (error) {
    console.error("Geocoding error:", error.message);
    throw new Error("Failed to get coordinates");
  }
};


module.exports.getDistanceTime = async (Pickup, destination) => {
  if (!Pickup || !destination) {
    throw new Error('Pickup and destination are required');
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("Google Maps API key is not configured");
  }

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(Pickup)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
  
 

  try {
    const response = await axios.get(url);
    const data = response.data;

  
    

    const element = data?.rows?.[0]?.elements?.[0];
    console.log("Element status:", element?.status);
    console.log("Element data:", element);
    if (!element || element.status !== "OK") {
      throw new Error('No routes found or invalid element status');
    }

    return {
      distance: element.distance,
      duration: element.duration,
      status: element.status
    };

  } catch (err) {
    console.error("[getDistanceTime] Error:", err.message);
    throw new Error("Failed to fetch distance and duration");
  }
};


module.exports.getAutoSuggestion=async(input)=>{
if(!input){
  throw new Error("address is required");
}

const apiKey=process.env.GOOGLE_MAPS_API_KEY;
const url=`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`
try {
  const response=await axios.get(url);
  if(response.data.status==="OK"){
    return response.data.predictions;
  }
  else{
    throw new Error("Unable to fetch Suggestion");
  }
} catch (error) {
  console.log(error);
  throw error;
}
}
module.exports.getCaptainsInTheRadius = async (latitude, longitude, radius) => {
  console.log("\n🔍 [GEOSPATIAL SEARCH] Starting captain search...");
  console.log("Pickup Coordinates - Latitude:", latitude, "Longitude:", longitude, "Radius:", radius, "km");
  
  if (!latitude || !longitude || !radius) {
    throw new Error("Latitude, longitude and radius are required");
  }

  // First, log all captains in database
  const allCaptains = await captainModel.find({}).select('_id vehicle.location email');
  console.log(`📊 Total captains in database: ${allCaptains.length}`);
  if (allCaptains.length > 0) {
    allCaptains.forEach(c => {
      console.log(`  - Captain ${c._id}: Location=${JSON.stringify(c.vehicle.location)} Email=${c.email}`);
    });
  }

  // Now run the geospatial query
  const radiusInRadians = radius / 6371;
  console.log(`🎯 Query: vehicle.location within ${radiusInRadians} radians (${radius}km) of [${longitude}, ${latitude}]`);
  
  const captains = await captainModel.find({
    'vehicle.location': {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radiusInRadians],
        }
    }
});

console.log(`✅ Captains found in radius: ${captains.length}`);
if (captains.length > 0) {
  captains.forEach(c => {
    const dist = calculateDistance(latitude, longitude, c.vehicle.location.coordinates[1], c.vehicle.location.coordinates[0]);
    console.log(`  - Captain: ${c._id}, SocketId: ${c.socketId}, Location: [${c.vehicle.location.coordinates}], Distance: ${dist.toFixed(3)}km`);
  });
}
console.log(""); // blank line for clarity
return captains;
};

// Helper to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
