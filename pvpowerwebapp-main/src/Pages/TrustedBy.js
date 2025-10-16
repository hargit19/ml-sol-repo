import React from "react";
import "../css/Pages/TrustedBy.css";
// Import logos directly as in your original code
import logo1 from "../Images/Logos/1.png";
import logo2 from "../Images/Logos/IHUB2.png";
import logo3 from "../Images/Logos/3.png";

function TrustedBy() {
  return (
    <div className="trusted-by-container">
      <h1 className="trusted-by-title">Trusted by</h1>
      <div className="trusted-by-logos">
        <img 
          src={logo1}
          className="trusted-logo logo1" 
          alt="IIT Roorkee logo" 
          loading="lazy" 
        />
        {/* <img 
          src={logo2}
          className="trusted-logo logo2" 
          alt="Innovation Hub logo" 
          loading="lazy" 
        /> */}
        <img 
          src={logo3}
          className="trusted-logo logo3" 
          alt="NM-ICPS logo" 
          loading="lazy" 
        />
      </div>
    </div>
  );
}

export default TrustedBy;