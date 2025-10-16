import axiosInstance from "./axiosInstance";

export async function updateUserFlow(input) {
  try {
    const result = await axiosInstance.patch("/users/updateMe", input);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function sendQueryMail(input) {
  try {
    const result = await axiosInstance.post("/users/sendQuery", input);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getMapDefaultLocationFlow() {
  try {
    const result = await axiosInstance.get("/users/get-location");
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function saveMapLocationFlow(input) {
  try {
    const result = await axiosInstance.patch("/users/save-location", input);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}
