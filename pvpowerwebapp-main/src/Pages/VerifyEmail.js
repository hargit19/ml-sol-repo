import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { sendVerificationEmailFlow, sendVerificationSMSFlow, verifyEmailFlow } from "../api/authenticationFlow";
import "../css/Modal/VerifyEmailModal.css";

function VerifyEmail() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [verifyCode, setVerifyCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Send verification email when component mounts

  async function sendVerificationEmail() {
    setIsLoading(true);
    const result = await sendVerificationEmailFlow(email);
    setIsLoading(false);
    
    if (result.status === "success") {
      toast.success("Verification code sent successfully");
    } else {
      toast.error(result.message || "Something went wrong. Please try again.");
    }
  }

  async function handleVerify() {
    if (verifyCode.length !== 6) {
      toast.error("Please enter a valid 6 digit code");
      return;
    }
    
    setIsLoading(true);
    const result = await verifyEmailFlow(verifyCode);
    setIsLoading(false);
    
    if (result.status === "success") {
      toast.success("Email verified successfully");
      if (!result.data.verifiedPhone) {
        await sendVerificationSMSFlow();
        navigate("/verify-phone/" + result.data.phone);
      } else {
        navigate("/dashboard/main");
      }
    } else {
      toast.error(result.message || "Something went wrong. Please try again.");
    }
  }

  // Handle Enter key press
  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      handleVerify();
    }
  }

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        <h2 className="verify-email-title">Verify Email</h2>
        <p className="verify-email-description">
          Verification code is sent to <span className="verify-email-highlight">{email}</span>
        </p>
        
        <div className="verify-email-input-group">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            className="verify-email-input"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="Enter your 6 digit code"
            onKeyPress={handleKeyPress}
            required
          />
        </div>
        
        <button 
          className="verify-email-button"
          onClick={handleVerify}
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "VERIFY EMAIL"}
        </button>
        
        <p className="verify-email-resend">
          Didn't receive the code?{" "}
          <button 
            onClick={sendVerificationEmail} 
            className="verify-email-resend-link"
            disabled={isLoading}
          >
            Click here to send again
          </button>
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;