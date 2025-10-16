import axiosInstance from "./axiosInstance";

export async function getHeaders() {
  try {
    const result = await axiosInstance.get("/header/get-header");
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function saveHeaders(data) {
  try {
    const result = await axiosInstance.post("/header/create-header", data);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function updateHeaders(data, id) {
  try {
    const result = await axiosInstance.put(`/header/update-header/${id}`, data);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}
