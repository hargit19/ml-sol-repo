import React, { useState } from "react";
import ReactDom from "react-dom";
import { toast } from "react-toastify";
import { forgotPasswordFlow } from "../../api/authenticationFlow";
import "../../css/Modal/ResetModal.css";

function ResetEmailModal({ isOpen, closeModal, setShowResetModal }) {
  const [resetEmail, setResetEmail] = useState("");

  async function resetPassword() {
    const sentResult = await forgotPasswordFlow({ email: resetEmail });
    if (sentResult.status === "success") {
      toast.info("Success");
    } else {
      toast.error("Something went wrong!");
    }
    setResetEmail("");
    setShowResetModal(false);
  }

  if (!isOpen) return null;
  return ReactDom.createPortal(
    <>
      <div className="resetP-wrapper" onClick={closeModal}></div>
      <div className="resetP-container">
        <div className="resetP__heading">
          <h2>Forgot Password</h2>
        </div>
        <input
          type={"email"}
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value.trim())}
          className="input"
          placeholder="Enter your Registered Email"
          required
        />
        <button className="signup__btn reset_btn" onClick={resetPassword}>
          Send Password Reset Link
        </button>
      </div>
    </>,
    document.getElementById("reset-modal")
  );
}

export default ResetEmailModal;
