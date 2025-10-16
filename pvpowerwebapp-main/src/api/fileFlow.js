import axiosInstance from "./axiosInstance";

export async function getCSVContentsFlow(locationCode) {
  try {
    const result = await axiosInstance.get(`/files/get-file/${locationCode}`);
    console.log("csv data from backednd: ", result);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}
