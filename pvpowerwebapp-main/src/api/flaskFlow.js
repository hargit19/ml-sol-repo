import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_FLASK_SERVER_URL + "/api/flask",
});

export async function runQuickModel(data, nextDate, id, lat, long, dataId) {
  try {
    const urlParams = `?nextdate=${nextDate}&_id=${id}&lat=${lat}&lon=${long}&dataId=${dataId}`;

    const result = await axiosInstance.post(`/quick/processing${urlParams}`, data);

    console.log("Status Code:", result.status);   // HTTP status (e.g., 200, 201, 400, 500)
  console.log("Response Data:", result.data); 
    console.log("quick result", result);

    return result.data;

    
  } catch (error) {


    if (error.response) {
    // Server responded with a non-2xx status
    console.error("Error Status:", error.response.status);
    console.error("Error Data:", error.response.data);
  } else if (error.request) {
    // No response received
    console.error("No response received:", error.request);
  } else {
    // Other errors (like bad request config)
    console.error("Request Error:", error.message);
  }

    return error.status;
  }
}

export async function runPremiumModel(data, nextDate, id, lat, long, dataId) {
  try {
    const urlParams = `?nextdate=${nextDate}&_id=${id}&lat=${lat}&lon=${long}&dataId=${dataId}`;

    const result = await axiosInstance.post(`/premium/processing${urlParams}`, data);
    console.log("premium result", result);

    return result.data;
  } catch (error) {
    return error.status;
  }
}
