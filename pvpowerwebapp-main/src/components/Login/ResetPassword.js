import React, { useState } from "react";
import { FaKey } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetPasswordFlow } from "../../api/authenticationFlow";
import "../../css/Login/ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();

  async function handleResetPassword(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    const result = await resetPasswordFlow(token);
    if (result.status === "success") {
      toast.success("Password set successfully!");
      navigate("/login");
    } else {
      toast.error("Password reset failed");
    }
  }

  return (
    <div className="form__container">
      <form className="form" onSubmit={handleResetPassword}>
        <p className="signup__title">RESET PASSWORD</p>
        
        <div className="form__fields">
          <div className="input-with-icon">
            <FaKey className="signupicon" />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input"
              placeholder=" "
              required
            />
            <span>Password</span>
          </div>

          <div className="input-with-icon">
            <RiLockPasswordLine className="signupicon" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              placeholder=" "
              required
            />
            <span>Confirm Password</span>
          </div>
        </div>
        
        <button className="signup__btn" type="submit">
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;