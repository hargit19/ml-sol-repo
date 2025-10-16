import axiosInstance from "./axiosInstance";

export async function signupFlow(input) {
  try {
    const result = await axiosInstance.post("/users/signup", input);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function loginFlow(input) {
  try {
    const result = await axiosInstance.post("/users/login", input);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function forgotPasswordFlow(input) {
  try {
    const result = await axiosInstance.post("/users/forgotPassword", input);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function resetPasswordFlow(token) {
  try {
    const result = await axiosInstance.patch(`/users/resetPassword/${token}`);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function logoutFlow() {
  try {
    const result = await axiosInstance.get("/users/logout");
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function sendVerificationEmailFlow(input) {
  try {
    const result = await axiosInstance.get(`/users/sendVerificationEmail?forceSend=${input}`);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function verifyEmailFlow(emailVerificationCode) {
  try {
    const result = await axiosInstance.post("/users/verifyEmail", { emailVerificationCode });
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function sendVerificationSMSFlow(input) {
  try {
    const result = await axiosInstance.get(`/users/sendVerificationSMS?forceSend=${input}`);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function verifySMSFlow(smsVerificationCode) {
  try {
    const result = await axiosInstance.post("/users/verifySMS", { smsVerificationCode });
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function isLoggedIn() {
  try {
    const result = await axiosInstance.get("/users/islogin");
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}
