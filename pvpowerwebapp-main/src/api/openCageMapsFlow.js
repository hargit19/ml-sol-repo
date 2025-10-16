import axios from "axios";

export async function getLatLngFromLocationFlow(location) {
  try {
    const result = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        location
      )}&key=${process.env.REACT_APP_OPENCAGE_API_KEY}`
    );

    console.log(result);

    return result.data;
  } catch (error) {
    return { status: { code: 500, message: "Error geocoding the location" } };
  }
}

export async function getLocationAddressFlow(lat, lon) {
  try {
    const result = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C${lon}&key=${process.env.REACT_APP_OPENCAGE_API_KEY}`
    );
    return result.data;
  } catch (error) {
    return error;
  }
}
