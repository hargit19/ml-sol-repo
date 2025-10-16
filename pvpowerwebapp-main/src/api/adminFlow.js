import axiosInstance from "./axiosInstance";

export async function getAllUsersFlow() {
  try {
    const result = await axiosInstance.get("/users/get-all-users");
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getAllPaymentsFlow() {
  try {
    // console.log("backend api function is going to be triggeered");
    const result = await axiosInstance.get("/payment/get-all-payments");
    // console.log("result from backend", result); 
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getAllPlansFlow() {
  try {
    const result = await axiosInstance.get("/plans/get-all-plans");
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function editPlanFlow(planId, planObj) {
  try {
    const result = await axiosInstance.patch(`/plans/update-plan/${planId}`, planObj);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function blockUserFlow(userId) {
  try {
    const result = await axiosInstance.patch(`/users/block-user/${userId}`);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function unblockUserFlow(userId) {
  try {
    const result = await axiosInstance.patch(`/users/unblock-user/${userId}`);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}
