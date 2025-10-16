import axiosInstance from "./axiosInstance";

export async function getApiKeysFlow() {
  try {
    const result = await axiosInstance.get("/payment/get-api-keys");
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function createOrderFlow(input) {
  try {
    const result = await axiosInstance.post("/payment/create-order", input);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function verifyPaymentFlow(input) {
  try {
    const result = await axiosInstance.post("/payment/verify-payment", input);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getPaymentFlow(id) {
  try {
    const result = await axiosInstance.get(`/payment/get-payment/${id}`);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}
