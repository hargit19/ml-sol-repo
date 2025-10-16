import React from "react";
import "../../css/Pages/Payment/PaymentFailed.css";
import { useNavigate } from "react-router-dom";

function PaymentFail() {
  const navigation = useNavigate();
  return (
    <div className="paymentFail_container">
      <p>OOPS! Payment failed.</p>
      <p style={{ color: "grey" }}>Please try again or contact our team.</p>
      <p
        className="go_back"
        style={{ fontSize: "13px", color: "grey", cursor: "pointer" }}
        onClick={() => navigation("/")}
      >
        Go Back
      </p>
    </div>
  );
}

export default PaymentFail;
