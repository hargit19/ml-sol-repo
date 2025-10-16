import React, { useEffect, useState } from "react";
import "../../css/Pages/Payment/PaymentDone.css";
import { useLocation, useNavigate } from "react-router-dom";
function PaymentDone() {
  const location = useLocation();
  const navigation = useNavigate();
  const [reference, setReference] = useState("");
  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const ref = search.get("reference");
    setReference(ref);
  }, []);
  if (reference === "") {
    return (
      <>
        <div>Loading</div>
      </>
    );
  }
  return (
    <div className="paymentDone_container">
      <p>Congratulations!</p>
      <p style={{ color: "grey" }}>Your Payment is Complete.</p>
      <p style={{ fontSize: "18px" }}>Payment id: {reference}</p>
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

export default PaymentDone;
