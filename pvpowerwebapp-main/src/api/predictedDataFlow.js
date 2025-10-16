import axiosInstance from "./axiosInstance";

export async function getPredictedDataFlow() {
  try {
    const result = await axiosInstance.get("/data/get-predicted-data");
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getAllPredictedDataFlow() {
  try {
    const result = await axiosInstance.get("/data/get-all-predicted-data");
    console.log("running correct data");
    return result.data;
  } catch (error) {
    console.log("runnung error data" , error);
    return error.response.data;
  }
}

export async function getDownloadExcelFileFlow(date) {
  try {
    const result = await axiosInstance.get(`/data/download-predicted-data?date=${date}`, { responseType: "blob" });
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function handleDeleteDataFlow(id) {
  try {
    const result = await axiosInstance.delete(`/data/delete-predicted-data/${id}`);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function generatePredictedDataIdFlow(forecastDate) {
  try {
    const result = await axiosInstance.post("/data/generate-data-id/", { forecastDate });
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getPenaltyFlow(input) {
  try {
    const result = await axiosInstance.get("/data/get-penalties/");
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function savePenaltyFlow(input) {
  try {
    const result = await axiosInstance.post("/data/save-penalties/", input);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getValidatedDataFlow() {
  try {
    const result = await axiosInstance.get("/data/get-validated-data");
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function saveValidationDataFlow(input) {
  try {
    const result = await axiosInstance.post("/data/save-actual-data/", { actualData: input });
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}
