import NodeGeocoder from "node-geocoder";

const options = {
  provider: "openstreetmap",
  httpAdapter: "https",
  formatter: null,
  headers: {
    "User-Agent": "room-rental-app" // 🔥 REQUIRED
  }
};

const geocoder = NodeGeocoder(options);

export default geocoder;