import { useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { sendVerificationSMSFlow, verifySMSFlow } from "../api/authenticationFlow";
import "../css/Modal/VerifyPhoneModal.css";

function VerifyPhone() {
  const { phone } = useParams();
  const navigate = useNavigate();
  const [verifyCode, setVerifyCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Send verification SMS when component mounts

  async function sendVerificationSMS() {
    setIsLoading(true);
    const result = await sendVerificationSMSFlow(phone);
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
    const result = await verifySMSFlow(verifyCode);
    setIsLoading(false);
    
    if (result.status === "success") {
      toast.success("Phone verified successfully");
      navigate("/pricing");
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
    <div className="verify-container">
      <div className="verify-card">
        <h2 className="verify-title">Verify Phone</h2>
        <p className="verify-description">
          Verification code is sent to <span className="verify-highlight">{phone}</span>
        </p>
        
        <div className="verify-input-group">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            className="verify-input"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="Enter your 6 digit code"
            onKeyPress={handleKeyPress}
            required
          />
        </div>
        
        <button 
          className="verify-button"
          onClick={handleVerify}
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "VERIFY PHONE"}
        </button>
        
        <p className="verify-resend">
          Didn't receive the code?{" "}
          <button 
            onClick={sendVerificationSMS} 
            className="verify-resend-link"
            disabled={isLoading}
          >
            Click here to send again
          </button>
        </p>
      </div>
    </div>
  );
}

export default VerifyPhone;